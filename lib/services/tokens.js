import { sign } from './jwt'
import { getAccount, getAccountKeysWithPem } from './storage'
import Config from 'react-native-config'
import { schemas } from '@egendata/messaging'
import jose from 'react-native-jose'

const nowSeconds = () => Math.round(Date.now() / 1000)

function pem2der(key) {
  return key
    .replace(/(?:\r\n|\r|\n)/g, '')
    .replace('-----BEGIN RSA PRIVATE KEY-----', '')
    .replace('-----END RSA PRIVATE KEY-----', '')
}

export const createAccountRegistration = async (
  // eslint-disable-next-line camelcase
  { id, pds: { provider, access_token } },
  { publicKey, privateKey },
  privateKeyPem
) => {
  const now = nowSeconds()
  console.log('\n ===> SIGN in createAccountRegistration')
  return jose.sign(
    JSON.stringify({
      type: 'ACCOUNT_REGISTRATION',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      pds: { provider, access_token },
      iat: now,
      exp: now + 60,
    }),
    pem2der(privateKeyPem),
    publicKey
  )
}

export const createConnectionInit = async ({ aud, iss, sid }) => {
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeysWithPem()

  console.log('\n ===> SIGN in createConnectionInit')
  const now = nowSeconds()
  return jose.sign(
    JSON.stringify({
      type: 'CONNECTION_INIT',
      aud: iss,
      iss: aud,
      sid,
      iat: now,
      exp: now + 60,
    }),
    pem2der(privateKeyPem),
    publicKey
  )
}

export const createConnection = async (
  { iss, sid },
  permissions,
  connectionId
) => {
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeysWithPem()
  const body = {
    type: 'CONNECTION',
    aud: iss,
    iss: 'egendata://account',
    sid,
    sub: connectionId,
    permissions,
  }

  console.log('\n ===> SIGN in createConnection')
  const now = nowSeconds()
  return jose.sign(
    JSON.stringify({ ...body, ...{ iat: now, exp: now + 60 } }),
    pem2der(privateKeyPem),
    publicKey
  )
}

export const createConnectionResponse = async payload => {
  const { id } = await getAccount()
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeysWithPem()

  console.log('\n ===> SIGN in createConnectionResponse')
  const now = nowSeconds()
  return jose.sign(
    JSON.stringify({
      type: 'CONNECTION_RESPONSE',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      payload,
      iat: now,
      exp: now + 60,
    }),
    pem2der(privateKeyPem),
    publicKey
  )
}

export const createLogin = async ({ serviceId, connectionId }, sessionId) => {
  if (!sessionId) {
    throw Error('SessionId is missing')
  }
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeysWithPem()

  console.log('\n ===> SIGN in createLogin')
  const now = nowSeconds()
  return jose.sign(
    JSON.stringify({
      type: 'LOGIN',
      aud: serviceId,
      sid: sessionId,
      sub: connectionId,
      iss: 'egendata://account',
      iat: now,
      exp: now + 60,
    }),
    pem2der(privateKeyPem),
    publicKey
  )
}

export const createLoginResponse = async loginPayload => {
  const { id } = await getAccount()
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeysWithPem()

  console.log('\n ===> SIGN in createLoginResponse')
  const now = nowSeconds()
  return jose.sign(
    JSON.stringify({
      type: 'LOGIN_RESPONSE',
      payload: loginPayload,
      iss: `egendata://account/${id}`,
      aud: Config.OPERATOR_URL,
      iat: now,
      exp: now + 60,
    }),
    pem2der(privateKeyPem),
    publicKey
  )
}
