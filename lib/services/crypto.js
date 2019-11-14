import { RSA, SHA } from '@egendata/react-native-simple-crypto'
import pem2jwk from 'simple-pem2jwk'

export function toBase64Url(base64) {
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/[=]/g, '')
}

export async function generateKeys(modulusLength = 2048) {
  const keyPair = await RSA.generateKeys(modulusLength)
  return {
    publicKey: pem2jwk(keyPair.public, { use: 'sig' }),
    privateKey: pem2jwk(keyPair.private),
  }
}

export async function thumbprint({ e, kty, n }) {
  const hash = await SHA.sha256(JSON.stringify({ e, kty, n }))
  return toBase64Url(hash)
}

export async function generateKey(options = {}, modulusLength = 2048) {
  const keyPair = await RSA.generateKeys(modulusLength)
  const key = pem2jwk(keyPair.private, options)
  key.kid = `egendata://jwks/${await thumbprint(key)}`

  return {
    privateKey: key,
    privateKeyPem: keyPair.private,
  }
}

export function toPublicKey({ e, kid, kty, n, use }) {
  return { e, kid, kty, n, use }
}
