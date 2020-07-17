import { sign, verify } from './jwt'
import {
  getAccount,
  getAccountKeys,
  getConnection,
  storeKey,
  getPrivateKey,
} from './storage'
import { addRecipient } from '@egendata/react-native-jose'
import Config from 'react-native-config'
import { schemas } from '@egendata/messaging'
import { v4 } from 'uuid'
import { generateKey, toPublicKey } from './crypto'

export const createAccountRegistration = async (
  // eslint-disable-next-line camelcase
  { id, pds: { provider, access_token } },
  { publicKey, privateKeyPem, privateKey },
) => {
  return sign(
    {
      type: 'ACCOUNT_REGISTRATION',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      pds: { provider, access_token },
    },
    {
      jwk: privateKey,
      pem: privateKeyPem,
    },
    {
      jwk: publicKey,
      alg: schemas.algs[0],
    },
  )
}

export const createConnectionMessage = async (
  { iss, sid },
  permissions,
  connectionId,
) => {
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeys()
  const body = {
    type: 'CONNECTION',
    aud: iss,
    iss: 'egendata://account',
    sid,
    sub: connectionId,
    permissions,
  }
  return sign(
    body,
    {
      jwk: privateKey,
      pem: privateKeyPem,
    },
    {
      jwk: publicKey,
      alg: schemas.algs[0],
    },
  )
}

export const createConnectionResponse = async payload => {
  const { id } = await getAccount()
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeys()
  return sign(
    {
      type: 'CONNECTION_RESPONSE',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      payload,
    },
    {
      jwk: privateKey,
      pem: privateKeyPem,
    },
    { jwk: publicKey, alg: schemas.algs[0] },
  )
}

export const createLogin = async ({ serviceId, connectionId }, sessionId) => {
  if (!sessionId) {
    throw Error('SessionId is missing')
  }
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeys()
  return sign(
    {
      type: 'LOGIN',
      aud: serviceId,
      sid: sessionId,
      sub: connectionId,
      iss: 'egendata://account',
    },
    {
      jwk: privateKey,
      pem: privateKeyPem,
    },
    { jwk: publicKey, alg: schemas.algs[0] },
  )
}

export const createLoginResponse = async loginPayload => {
  const { id } = await getAccount()
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeys()
  return sign(
    {
      type: 'LOGIN_RESPONSE',
      payload: loginPayload,
      iss: `egendata://account/${id}`,
      aud: Config.OPERATOR_URL,
    },
    {
      jwk: privateKey,
      pem: privateKeyPem,
    },
    { jwk: publicKey, alg: schemas.algs[0] },
  )
}

export async function getJWE({ domain, area }) {
  const {
    publicKey: publicSigningKey,
    privateKey: privateSigningKey,
    privateKeyPem: privateSigningKeyPem,
  } = await getAccountKeys()
  const connection = await getConnection(domain)
  if (!connection) {
    return null
  }
  return sign(
    {
      type: 'RECIPIENTS_READ_REQUEST',
      sub: connection.connectionId,
      paths: [{ domain, area }],
      iss: domain, // Change this to egendata://account/${id}?
      aud: Config.OPERATOR_URL,
    },
    {
      jwk: privateSigningKey,
      pem: privateSigningKeyPem,
    },
    { jwk: publicSigningKey, alg: schemas.algs[0] },
  )
    .then(postToOperator)
    .then(verify)
    .then(({ payload: { paths } }) => paths[0])
}

async function sendRecipientsToOperator(domain, area, recipients) {
  const connection = await getConnection(domain)
  if (!connection) {
    return null
  }
  const {
    publicKey: publicSigningKey,
    privateKey: privateSigningKey,
    privateKeyPem: privateSigningKeyPem,
  } = await getAccountKeys()
  return sign(
    {
      type: 'RECIPIENTS_WRITE',
      sub: connection.connectionId,
      paths: [{ domain, area, recipients }],
      iss: domain, // Change this to egendata://account/${id}?
      aud: Config.OPERATOR_URL,
    },
    {
      jwk: privateSigningKey,
      pem: privateSigningKeyPem,
    },
    { jwk: publicSigningKey, alg: schemas.algs[0] },
  ).then(postToOperator)
}

export async function postToOperator(body) {
  return fetch(Config.OPERATOR_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/jwt' },
    body,
  }).then(async res => {
    if (res.ok) {
      return res.text()
    }
    throw Error(`Failed to post to operator ${await res.text()}`)
  })
}

async function addDataPaths(permissions) {
  return getAccount()
    .then(({ id: userId }) =>
      permissions.approved.map(permission => ({
        ...permission,
        dataPath: userId + permission.domain + permission.area,
      })),
    )
    .then(permissionsWithDataPaths => ({
      approved: permissionsWithDataPaths,
    }))
}

export async function createConnection(connectionRequest, approvedPermissions) {
  const connectionId = v4()
  return getApprovedPermissionRequestWithKeys(
    connectionRequest,
    approvedPermissions,
  )
    .then(addDataPaths)
    .then(permissionsResult =>
      createConnectionMessage(
        connectionRequest,
        permissionsResult,
        connectionId,
      ),
    )
    .then(createConnectionResponse)
    .then(postToOperator)
    .then(() => connectionId)
}

export async function getApprovedPermissionRequestWithKeys(
  { permissions: requestedPermissions },
  approved,
) {
  if (!requestedPermissions) {
    return undefined
  }

  const readServiceReadKeysByArea = mapReadKeys(requestedPermissions)

  const permissionResult = {
    approved: await Promise.all(
      requestedPermissions
        .filter(p => approved.get(p.id))
        .map(async p => {
          const serviceReadKey = readServiceReadKeysByArea.get(
            `${p.domain}|${p.area}`,
          )
          if (p.type === 'WRITE') {
            if (!p.jwks) {
              p.jwks = {
                keys: [],
              }
            }
            // push service read-keys to jwks-keys
            if (serviceReadKey) {
              p.jwks.keys.push(serviceReadKey)
            }

            // push user read-key
            const key = await generateKey({
              use: 'enc',
            }).then(storeKey)

            p.jwks.keys.push(toPublicKey(key.privateKey))
          } else if (p.type === 'READ') {
            await getJWE({
              domain: p.domain,
              area: p.area,
            }).then(async jwe => {
              if (jwe) {
                const [privateKeys] = (
                  await Promise.all(
                    jwe.recipients
                      .map(({ header: { kid } }) => kid)
                      .map(getPrivateKey),
                  )
                ).filter(Boolean)
                return addRecipient(
                  jwe,
                  privateKeys,
                  serviceReadKey,
                ).then(({ recipients }) =>
                  sendRecipientsToOperator(p.domain, p.area, recipients),
                )
              }
            })

            // todo: l8r if there are no recipients then create JWE with empty data
            // eslint-disable-next-line require-atomic-updates
            p.kid = p.jwk.kid
            delete p.jwk
          }
          return p
        }),
    ),
  }
  return permissionResult.approved.length ? permissionResult : undefined
}

function mapReadKeys(permissions) {
  return permissions
    .filter(p => p.type === 'READ')
    .reduce((map, { domain, area, jwk }) => {
      return map.set(`${domain}|${area}`, jwk)
    }, new Map())
}
