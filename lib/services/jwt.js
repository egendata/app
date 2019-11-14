import { token } from '@egendata/messaging'
import * as jwt from 'jwt-lite'
import jose from '@egendata/react-native-jose'

export const { sign, verify } = token({
  sign: jose.sign,
  decode: jwt.decode,
  verify: jose.verify,
})
