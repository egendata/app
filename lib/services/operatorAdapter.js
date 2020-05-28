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
const recipientsKey = {
  n:
    'ueCP0HcTK2GKJp6-gaD3SJ-CjOfuP6vLHfkcugY4iWcs4LmAtqByxhvHhFWBakgLCaZgwCp0or1r7IcmJL5LNy_z7fYrX15hYOf8HH_38I7968uSjhLbRi01xCTtv2R-k0VpFFKVW-V1AZDUCz8e7zdQhuDpwF1UX8RepVFWqeriMqzPwWod66GP-8MDJRnZPff7zeeGnQi3kN-wAfdVZvnggoBg6ZEClLtwSGzdH5F0DfYk-snnvVxJbIM0-Or8zPyIucQd2hkSK1afFGXimz0Li82javS49NUbgeFmYZ-g93xXZSTTx4Z-zea1C3liGGtrPAz7gANY8VR1IqlQxw',
  e: 'AQAB',
  d:
    'lKeYvLMOfKpEb4CTgV53hfgz03cFnpxJFI6PP-MLwi_mv078NpJ5WCENXrN3jcVSNoR-ahFKOIDfWEn54nbh9p_-KLiwlVQI8xR1F2Hsq9HgF302lzNTdHthvZ1_GotHg4aGdD9bviPzgK4QN3JizhPh7gzgRP0fJnwI6ZP0iGy4mg2T5L0-M72OB9t6lUO3CyBnYPOxD8Ow5F0MLoYmGaq_JfO7LXCZx7S4VTQrBE72SYBvwGkXbiKye5iTQqonSfvIpmdYuXM8pd_FmavupzB-DoFdC4nY7l9n9mBU2rehKbrSrzCDBTdKdE54L6cRKx0n3_ldBoXM6G_sqh4fSQ',
  p:
    '6JdRrj4wypuW-vX_ask-uheJGETnOdnas43Et_FUNDxoCNotK3gIOoAQekr1aA4i8ZgoXo1vGhEkqH179InfzreV1omhBdd_dz86KakixnctvMpJ65_o7PM3oKbAQOV_mGiA02X-tF61KOmENlSNqqxnKrnqufTf3BLch5Tg05s',
  q:
    'zJWqN65Juia-8zlELnqCHSX6C2OhlDAeusMi2_4Bx3Agpmfm46zDIM6hLq_vmY-mxg5wZWgPl1G9fTzob_xpkaxpwWHTLm9Visx6flSlMw1s4SrQEP7M7JGaKq53VViBrj3QxW5udnpgDRCE_sKljfuX7Go73UULjDvbV5ipWEU',
  dp:
    'Zcn7RB8RaUnIPFI2Eny6B-TO6aEV9Fpj_NpZMgraR_X7rYwV4oUoTLnI_EwbtAsjvclSOXb6HVVNTrOD8NP571SmrXoTzyOtM_mmsZ7EikiT6qA403ZrEG-sc5EmaABH4-IwJtPnMPaVn676XnCIgx3qFGfC0tjYs05J1sgP0Gs',
  dq:
    'gjkyJEc4ftly6nclQ0CP2eX2h5FfpGgM52yWn9nLYBurbMDuYzXw7s0YJBOxO9oImkFOof3fDr7lEvbWLZJJ0IQivQl71y7fEH6f6hIPJbQB_kG2N1s5LcxwiYKMSzMPOM34OfPVNG0o_qfpQBC-OOZRCheFC4-LjjP7poJyKNE',
  qi:
    'eQaVBht5vsnozmI_My6OcVheMsps6NeiWEwUgmv3Bdxr1X0qd0WbFyJrgZXHLAwcd_JvWsyhmrIhfbBTtkQJKKfeC8U850VaMM4EBI9Eu6e9lqbANbOWstfFLS1xAYG3-ufPIGDycsI-Od8W6PtMO4_yTDxFzxXOJB4fRdluwao',
  kty: 'RSA',
  use: 'sig',
  kid: 'egendata://jwks/o7LRekajUbDTaXFY5TaGRfuVV5tJFBNw4ZcG8RozYZ0',
}

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

export async function getRecipients({ domain, area }) {
  const {
    publicKey: publicSigningKey,
    privateKey: privateSigningKey,
    privateKeyPem: privateSigningKeyPem,
  } = await getAccountKeys()
  const connection = await getConnection(domain)
  if (!connection) {
    return []
  }
  console.log(connection.connectionId, 'connectionID')
  console.log(privateSigningKey.kid, 'private keyid from storage')
  return sign(
    {
      type: 'RECIPIENTS_READ_REQUEST',
      sub: connection.connectionId,
      paths: [{ domain, area }],
      iss: domain,
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
    .then(async jwe => {
      const [privateKeys] = (
        await Promise.all(
          jwe.recipients.map(({ header: { kid } }) => kid).map(getPrivateKey),
        )
      ).filter(Boolean)
      return { jwe, privateKeys }
    })
    .then(({ jwe, privateKeys }) =>
      addRecipient(jwe, privateKeys, recipientsKey),
    )
}
export function postToOperator(body) {
  return fetch(Config.OPERATOR_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/jwt' },
    body,
  }).then(e => e.text())
}

export async function createConnection(connectionRequest, approvedPermissions) {
  const connectionId = v4()

  return getApprovedPermissionRequestWithKeys(
    connectionRequest,
    approvedPermissions,
  )
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
            const recipients = await getRecipients({
              domain: p.domain,
              area: p.area,
            })
            console.log(recipients)
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
