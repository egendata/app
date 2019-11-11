import { sign } from './jwt'
import { getAccount, getAccountKeys } from './storage'
import Config from 'react-native-config'
import { schemas } from '@egendata/messaging'

const nowSeconds = () => Math.round(Date.now() / 1000)
import jose from 'react-native-jose'

import moment from 'moment'

export const createAccountRegistration = async (
  // eslint-disable-next-line camelcase
  { id, pds: { provider, access_token } },
  { publicKey, privateKey },
  privateKeyObj
) => {
  console.log('\n ===> SIGN in createAccountRegistration')

  let privateDER = privateKeyObj
    .replace(/(?:\r\n|\r|\n)/g, '')
    .replace('-----BEGIN RSA PRIVATE KEY-----', '')
    .replace('-----END RSA PRIVATE KEY-----', '')

  const original = await sign(
    {
      type: 'ACCOUNT_REGISTRATION',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      pds: { provider, access_token },
    },
    privateKey,
    {
      jwk: publicKey,
      alg: schemas.algs[0],
    }
  )

  console.log('\noriginal\n', original)

  const newToken = await jose.sign(
    JSON.stringify({
      type: 'ACCOUNT_REGISTRATION',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      pds: { provider, access_token },
      iat: moment().unix(),
      exp: moment().add('minutes', 5).unix()
    }),
    privateDER,
    publicKey
  )
  console.log('\nnewToken\n', newToken)
  return original

  try {
    const joseswift = await jose.sign(
      JSON.stringify({
        type: 'ACCOUNT_REGISTRATION',
        aud: Config.OPERATOR_URL,
        iss: `egendata://account/${id}`,
        pds: { provider, access_token },
      }),
      privateDER
    )
    console.log('\n ++> TOKEN \n', joseswift)
  } catch (ex) {
    console.log('ot b0rkws', ex)
  }
  return sign(
    {
      type: 'ACCOUNT_REGISTRATION',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      pds: { provider, access_token },
    },
    privateKey,
    {
      jwk: publicKey,
      alg: schemas.algs[0],
    }
  )
}

export const createConnectionInit = async ({ aud, iss, sid }) => {
  const { publicKey, privateKey } = await getAccountKeys()

  const now = nowSeconds()
  console.log('\n ===> SIGN in createConnectionInit')
  return sign(
    {
      type: 'CONNECTION_INIT',
      aud: iss,
      iss: aud,
      sid,
      iat: now,
      exp: now + 60,
    },
    privateKey,
    { jwk: publicKey, alg: schemas.algs[0] }
  )
}

export const createConnection = async (
  { iss, sid },
  permissions,
  connectionId
) => {
  const { publicKey, privateKey } = await getAccountKeys()
  const body = {
    type: 'CONNECTION',
    aud: iss,
    iss: 'egendata://account',
    sid,
    sub: connectionId,
    permissions,
  }
  console.log('\n ===> SIGN in createConnection')

  return sign(body, privateKey, { jwk: publicKey, alg: schemas.algs[0] })
}

export const createConnectionResponse = async payload => {
  const { id } = await getAccount()
  const { publicKey, privateKey } = await getAccountKeys()
  console.log('\n ===> SIGN in createConnectionResponse')

  return sign(
    {
      type: 'CONNECTION_RESPONSE',
      aud: Config.OPERATOR_URL,
      iss: `egendata://account/${id}`,
      payload,
    },
    privateKey,
    { jwk: publicKey, alg: schemas.algs[0] }
  )
}

export const createLogin = async ({ serviceId, connectionId }, sessionId) => {
  if (!sessionId) {
    throw Error('SessionId is missing')
  }
  const { publicKey, privateKey } = await getAccountKeys()
  console.log('\n ===> SIGN in createLogin')

  return sign(
    {
      type: 'LOGIN',
      aud: serviceId,
      sid: sessionId,
      sub: connectionId,
      iss: 'egendata://account',
    },
    privateKey,
    { jwk: publicKey, alg: schemas.algs[0] }
  )
}

export const createLoginResponse = async loginPayload => {
  const { id } = await getAccount()
  const { publicKey, privateKey } = await getAccountKeys()
  console.log('\n ===> SIGN in createLoginResponse')

  return sign(
    {
      type: 'LOGIN_RESPONSE',
      payload: loginPayload,
      iss: `egendata://account/${id}`,
      aud: Config.OPERATOR_URL,
    },
    privateKey,
    { jwk: publicKey, alg: schemas.algs[0] }
  )
}
