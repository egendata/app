import * as accountService from '../account'
import Config from 'react-native-config'
import * as uuid from 'uuid'
import * as crypto from '../crypto'
import * as storage from '../storage'
import * as messages from '../messages'
import { generateTestAccount } from './_helpers'

jest.mock('uuid', () => ({
  v4: jest.fn().mockName('uuid.v4'),
}))
jest.mock('../crypto', () => ({
  generateKey: jest.fn().mockName('crypto.generateKey'),
  toPublicKey: jest.fn().mockName('crypto.toPublicKey'),
}))
jest.mock('../storage', () => ({
  storeAccount: jest
    .fn()
    .mockName('storage.storeAccount')
    .mockResolvedValue(),
  storeKey: jest
    .fn()
    .mockName('storage.storeKey')
    .mockResolvedValue(),
}))
jest.mock('../messages', () => ({
  createAccountRegistration: jest
    .fn()
    .mockName('messages.createAccountRegistration'),
}))

Config.OPERATOR_URL = 'aTotallyLegitOperatorUrl'

describe('account', () => {
  describe('#save', () => {
    let account, id, privateKey, publicKey, jwt, privateKeyPem
    beforeEach(async () => {
      account = await generateTestAccount()
      privateKey = {
        d: 'abcd1',
        dp: 'abcd2',
        dq: 'abcd3',
        e: 'AQAB',
        kid: 'egendata://jwks/efgh123',
        kty: 'RSA',
        n: 'abcd4',
        p: 'abcd5',
        q: 'abcd6',
        qi: 'abcd7',
        use: 'sig',
      }
      publicKey = {
        e: 'AQAB',
        kid: 'egendata://jwks/efgh123',
        kty: 'RSA',
        n: 'abcd4',
        use: 'sig',
      }
      privateKeyPem = 'Begin ----dsadsadsa---End'
      jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      id = '74837a38-c61e-46c1-a1c7-bf3f66450406'

      uuid.v4.mockReturnValue(id)
      crypto.generateKey.mockResolvedValue({
        privateKey,
        privateKeyPem,
      })
      crypto.toPublicKey.mockReturnValue(publicKey)
      messages.createAccountRegistration.mockResolvedValue(jwt)
      fetch.mockResponse(JSON.stringify({ data: { id: 'abc123' } }))
    })
    describe('new user', () => {
      beforeEach(() => {
        account.id = undefined
      })
      it('generates an id', async () => {
        const result = await accountService.save(account)
        expect(result.id).not.toBeUndefined()
      })
      it('creates an account key', async () => {
        await accountService.save(account)
        expect(crypto.generateKey).toHaveBeenCalledWith({ use: 'sig' })
      })
      it('saves account key', async () => {
        await accountService.save(account)
        expect(storage.storeKey).toHaveBeenCalledWith({
          privateKey,
          privateKeyPem,
        })
      })
      it('sets kid', async () => {
        const result = await accountService.save(account)
        expect(result.kid).toEqual(privateKey.kid)
      })
      it('generates a token', async () => {
        const result = await accountService.save(account)
        expect(messages.createAccountRegistration).toHaveBeenCalledWith(
          result,
          {
            publicKey,
            privateKey,
            privateKeyPem,
          },
        )
      })
      it('saves account to storage', async () => {
        const result = await accountService.save(account)
        expect(storage.storeAccount).toHaveBeenCalledWith(result)
      })
      it('calls fetch', async () => {
        await accountService.save(account)

        expect(fetch).toHaveBeenCalledWith('aTotallyLegitOperatorUrl', {
          headers: { 'content-type': 'application/jwt' },
          method: 'POST',
          body: jwt,
        })
      })
      it('returns account', async () => {
        const result = await accountService.save(account)

        expect(result).toEqual({ ...account, id, kid: privateKey.kid })
      })
    })
  })
})
