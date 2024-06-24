import { sign } from './jwt'
import { schemas } from '@egendata/messaging'
import { getAccountKeys } from './storage'
const nowSeconds = () => Math.floor(Date.now() / 1000)

export const createConnectionInit = async ({ aud, iss, sid }) => {
  const { publicKey, privateKey, privateKeyPem } = await getAccountKeys()
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
    {
      jwk: privateKey,
      pem: privateKeyPem,
    },
    { jwk: publicKey, alg: schemas.algs[0] },
  )
}
