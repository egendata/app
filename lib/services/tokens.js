import { sign } from './jwt'
import { getAccount, getAccountKeysWithPem } from './storage'
import Config from 'react-native-config'
import { schemas } from '@egendata/messaging'

const nowSeconds = () => Math.floor(Date.now() / 1000)

function pem2der(key) {
  return key
    .replace(/(?:\r\n|\r|\n)/g, '')
    .replace('-----BEGIN RSA PRIVATE KEY-----', '')
    .replace('-----END RSA PRIVATE KEY-----', '')
}

export const createAccountRegistration = async (
  // eslint-disable-next-line camelcase
  { id, pds: { provider, access_token } },
  { publicKey },
  privateKeyPem
) => {
  return sign(
    {
      type: 'ACCOUNT_REGISTRATION',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      pds: { provider, access_token },
    },
    pem2der(privateKeyPem),
    {
      jwk: publicKey,
      alg: schemas.algs[0],
    }
  )
}

export const createConnectionInit = async ({ aud, iss, sid }) => {
  const { publicKey, privateKeyPem } = await getAccountKeysWithPem()
  const now = nowSeconds()
  return sign(
    {
      type: 'CONNECTION_INIT',
      aud: iss,
      iss: aud,
      sid,
      iat: now,
      exp: now + 60,
    },
    pem2der(privateKeyPem),
    { jwk: publicKey, alg: schemas.algs[0] }
  )
}

export const createConnection = async (
  { iss, sid },
  permissions,
  connectionId
) => {
  const { publicKey, privateKeyPem } = await getAccountKeysWithPem()
  const body = {
    type: 'CONNECTION',
    aud: iss,
    iss: 'egendata://account',
    sid,
    sub: connectionId,
    permissions,
  }
  return sign(body, pem2der(privateKeyPem), { jwk: publicKey, alg: schemas.algs[0] })
}

export const createConnectionResponse = async payload => {
  const { id } = await getAccount()
  const { publicKey, privateKeyPem } = await getAccountKeysWithPem()
  return sign(
    {
      type: 'CONNECTION_RESPONSE',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      payload
    },
    pem2der(privateKeyPem),
    { jwk: publicKey, alg: schemas.algs[0] }
  )
}

export const createLogin = async ({ serviceId, connectionId }, sessionId) => {
  if (!sessionId) {
    throw Error('SessionId is missing')
  }
  const { publicKey, privateKeyPem } = await getAccountKeysWithPem()
  return sign(
    {
      type: 'LOGIN',
      aud: serviceId,
      sid: sessionId,
      sub: connectionId,
      iss: 'egendata://account',
    },
    pem2der(privateKeyPem),
    { jwk: publicKey, alg: schemas.algs[0] }
  )
}

export const createLoginResponse = async loginPayload => {
  const { id } = await getAccount()
  const { publicKey, privateKeyPem } = await getAccountKeysWithPem()
  return sign(
    {
      type: 'LOGIN_RESPONSE',
      payload: loginPayload,
      iss: `egendata://account/${id}`,
      aud: Config.OPERATOR_URL,
    },
    pem2der(privateKeyPem),
    { jwk: publicKey, alg: schemas.algs[0] }
  )
}
