import { sign } from './jwt'
import { getAccount, getAccountKeys, getConnection, storeKey } from './storage'
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

export const createConnection = async (
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

export async function getRecipients({ domain, area }) {
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeys()
  const connectionId = getConnection(domain)

  return sign(
    {
      type: 'RECIPIENTS_READ_REQUEST',
      sub: connectionId,
      paths: [{ domain, area }],
    },
    {
      jwk: privateKey,
      pem: privateKeyPem,
    },
    { jwk: publicKey, alg: schemas.algs[0] },
  ).then(postToOperator)
}
// ToOoOoToOT
// poopstoopidooperator
export function postToOperator(body) {
  return fetch(Config.OPERATOR_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/jwt' },
    body,
  })
}

export async function newCreateConnection(
  connectionRequest,
  approvedPermissions,
) {
  const connectionId = v4()

  const permissionsResult = await getApprovedPermissionRequestWithKeys(
    connectionRequest,
    approvedPermissions,
  )
  const connection = await createConnection(
    connectionRequest,
    permissionsResult,
    connectionId,
  )

  const connectionResponse = await createConnectionResponse(connection)

  await fetch(Config.OPERATOR_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/jwt' },
    body: connectionResponse,
  })

  return connectionId
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
          if (p.type === 'WRITE') {
            if (!p.jwks) {
              p.jwks = {
                keys: [],
              }
            }
            // push service read-keys to jwks-keys
            const serviceReadKey = readServiceReadKeysByArea.get(
              `${p.domain}|${p.area}`,
            )
            if (serviceReadKey) {
              p.jwks.keys.push(serviceReadKey)
            }

            // push user read-key
            const key = await generateKey({
              use: 'enc',
            }).then(storeKey)

            p.jwks.keys.push(toPublicKey(key.privateKey))
          } else if (p.type === 'READ') {
            // todo: l8r if there are no recipients then create JWE with empty data

            // todo: get jwe recipients

            // if there are then add it to the recipeintseassesez

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
