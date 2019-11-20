import { token } from '@egendata/messaging'
import jose from '@egendata/react-native-jose'

export const { sign, verify } = token({
  sign: jose.sign,
  decode: jose.decode,
  verify: jose.verify,
})
