import * as jwt from 'jwt-lite'

export const sign = (payload, keys, header) =>
  jwt.sign(payload, keys.jwk, header)
export const verify = (token, jwk) => jwt.verify(token, jwk)
export const decode = (token, options) => jwt.decode(token, options)
