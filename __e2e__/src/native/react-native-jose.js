import * as jwt from 'jwt-lite'
import { privateDecrypt, publicEncrypt } from 'crypto'
import jwk2pem from 'jwk-to-pem'

export const sign = (payload, keys, header) =>
  jwt.sign(payload, keys.jwk, header)
export const verify = (token, jwk) => jwt.verify(token, jwk)
export const decode = (token, options) => jwt.decode(token, options)

export const addRecipient = async (
  jwe,
  ownerKeys,
  recipientKey,
  alg = 'RSA-OAEP',
) => {
  const ownersEncryptedKey = jwe.recipients.find(
    recipient => recipient.header.kid === ownerKeys.privateKey.kid,
  )
  if (!ownersEncryptedKey) {
    throw new Error('no matching recipient for owner key')
  }

  const newEncryptedKey = await reEncryptCek(
    ownersEncryptedKey.encrypted_key, // the encrypted key of the encrypted key of the owner
    ownerKeys,
    recipientKey,
    alg,
  )

  jwe.recipients.push({
    header: {
      kid: recipientKey.kid,
      alg,
    },
    encrypted_key: newEncryptedKey,
  })
  return jwe
}

const reEncryptCek = (ownersEncryptedKey, ownerKey, recipientKey, _alg) => {
  const decryptedCek = privateDecrypt(
    ownerKey.privateKeyPem,
    Buffer.from(ownersEncryptedKey, 'base64'),
  )
  return publicEncrypt(jwk2pem(recipientKey), decryptedCek).toString('base64')
}
