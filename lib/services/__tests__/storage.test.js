import * as storage from '../storage'
import AsyncStorage from '@react-native-community/async-storage'
import {
  generateTestAccount,
  generateTestKey,
  testConnectionRequest,
} from './_helpers'

describe('storage', () => {
  let account, key
  beforeAll(async () => {
    key = await generateTestKey({ use: 'enc' })
    account = await generateTestAccount()
  })

  describe('#storeAccountId', () => {
    it('calls AsyncStorage.setItem', async () => {
      await storage.storeAccount(account)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'account',
        JSON.stringify(account),
      )
    })
  })
  describe('#getAccount', () => {
    it('calls AsyncStorage.getItem', async () => {
      await storage.getAccount()
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('account')
    })
    it('resolves if AsyncStorage resolves', async () => {
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(account))
      const result = await storage.getAccount()
      expect(result).toEqual(account)
    })
  })
  describe('#storeKey', () => {
    it('calls AsyncStorage.setItem', async () => {
      await storage.storeKey({ privateKey: key })

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `jwks/${key.kid}`,
        JSON.stringify({ privateKey: key }),
      )
    })
  })
  describe('#getPrivateKey', () => {
    it('calls AsyncStorage.getItem', async () => {
      await storage.getPrivateKey(key.kid)

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(`jwks/${key.kid}`)
    })
    it('returns the private key', async () => {
      AsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({ privateKey: key }),
      )
      const result = await storage.getPrivateKey(key.kid)

      expect(result).toEqual({ privateKey: key })
    })
  })
  describe('#getPublicKey', () => {
    it('returns the public key', async () => {
      AsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({ privateKey: key }),
      )
      const result = await storage.getPublicKey(key.kid)
      const { e, kid, kty, n, use } = key

      expect(result).toEqual({ e, kid, kty, n, use })
    })
  })
  describe('#getAccountKeys', () => {
    it('returns the private and public keys for the account', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(account))
      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify({ privateKey: key }),
      )

      const { publicKey, privateKey } = await storage.getAccountKeys()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('account')
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(`jwks/${account.kid}`)

      expect(privateKey).toEqual(key)

      const { e, kid, kty, n, use } = key
      expect(publicKey).toEqual({ e, kid, kty, n, use })
    })
  })
  describe('#getPermissions', () => {
    it('resolves permissions from given connection', async () => {
      const connectionEntry = {
        [testConnectionRequest.iss]: { ...testConnectionRequest },
      }
      const serviceId = testConnectionRequest.iss
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(connectionEntry))
      const result = await storage.getPermissions(serviceId)

      const expectedLength = testConnectionRequest.permissions.length

      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(expectedLength)
    })
  })

  describe('#getWritePermissionDescription', () => {
    it('resolves description of a given write permission', async () => {
      const connectionEntry = {
        [testConnectionRequest.iss]: { ...testConnectionRequest },
      }
      const serviceId = testConnectionRequest.iss
      const expectedPermission = {
        area: 'experience',
        description: 'A list of your work experiences.',
        domain: 'https://mycv.work',
        id: 'd5dab30d-b0ac-43e3-9ac8-cff8b39ca560',
        lawfulBasis: 'CONSENT',
        type: 'WRITE',
      }

      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(connectionEntry))
      const result = await storage.getWritePermissionDescription(
        serviceId,
        'experience',
      )

      expect(result).toEqual(expectedPermission.description)
    })
  })
})
