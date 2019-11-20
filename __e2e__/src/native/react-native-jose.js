import * as jwt from 'jwt-lite'

const Jose = {
  sign: (payload, keys, header) => jwt.sign(payload, keys.jwk, header),
  verify: (token, jwk) => jwt.verify(token, jwk),
  decode: (token, options) => jwt.decode(token, options),
}

export default Jose
