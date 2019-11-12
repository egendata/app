import { token } from '@egendata/messaging'
import * as jwt from 'jwt-lite'
import jose from 'react-native-jose'

export const { sign, verify } = token({
  sign: jwt.sign,
  decode: jwt.decode,
  verify: jose.verify,
})
