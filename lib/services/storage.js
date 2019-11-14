import AsyncStorage from '@react-native-community/async-storage'
import { toPublicKey } from './crypto'

export async function storeAccount(account) {
  await AsyncStorage.setItem('account', account ? JSON.stringify(account) : '')
}

export const getAccount = async () => {
  const result = await AsyncStorage.getItem('account')
  return result ? JSON.parse(result) : undefined
}

export const getConnections = () =>
  AsyncStorage.getItem('connections').then(res => (res ? JSON.parse(res) : {}))

export const getConnection = async serviceId => {
  const connections = await getConnections()
  return connections[serviceId]
}

export const storeConnection = async ({ serviceId, ...rest }) => {
  const existingConnections = await getConnections()
  existingConnections[serviceId] = { serviceId, ...rest }

  return AsyncStorage.setItem(
    'connections',
    JSON.stringify(existingConnections)
  )
}

export const storeKey = async ({ privateKey, privateKeyPem }) => {
  return AsyncStorage.setItem(
    `jwks/${privateKey.kid}`,
    JSON.stringify({ privateKey, privateKeyPem })
  )
}

export const getPrivateKey = async kid => {
  const result = await AsyncStorage.getItem(`jwks/${kid}`)
  return result ? JSON.parse(result) : undefined
}

export const getPublicKey = async kid => {
  const { privateKey } = await getPrivateKey(kid)
  return privateKey ? toPublicKey(privateKey) : undefined
}

export const getAccountKeys = async () => {
  const { kid } = await getAccount()
  const { privateKey, privateKeyPem } = await getPrivateKey(kid)
  const publicKey = toPublicKey(privateKey)

  return { publicKey, privateKey, privateKeyPem }
}
