import { initConnection, approveConnection } from '../auth'
import { getAccount } from '../account'
import { generateTestAccount } from './_helpers'
import { generateKey } from '../crypto'
import Config from 'react-native-config' // this is mocked
import * as operatorAdapter from '../operatorAdapter'

jest.mock('../jwt.js', () => ({
  sign: jest.fn().mockImplementation(input => {
    const type = input.type
    if (type === 'CONNECTION') {
      return {
        payload: 'connection_payload',
        permissions: input.permissions,
      }
    } else if (type === 'CONNECTION_RESPONSE') {
      return input.payload
    }
  }),
  verify: jest.fn().mockResolvedValue({ payload: { foo: 'bar' } }),
}))
jest.mock('../account', () => ({
  getAccount: jest.fn(),
}))
jest.mock('../storage', () => ({
  getAccountKeys: jest.fn().mockReturnValue({
    publicKey: 'pub key',
    privateKey: 'priv key',
    privateKeyPem: 'priv key pem',
  }),
  getAccount: jest.fn().mockReturnValue({ id: 1 }),
  storeConnection: jest.fn(),
}))

jest.mock('../serviceAdapter', () => ({
  createConnectionInit: jest
    .fn()
    .mockResolvedValue('jwt-for-createConnectionInit'),
}))
jest.mock('../operatorAdapter', () => {
  const operatorAdapterActual = jest.requireActual('../operatorAdapter.js')
  return {
    createConnectionMessage: jest
      .fn()
      .mockResolvedValue('jwt-for-createConnection'),
    getApprovedPermissionRequestWithKeys:
      operatorAdapterActual.getApprovedPermissionRequestWithKeys,
    createConnection: operatorAdapterActual.createConnection,
    createConnectionResponse: jest
      .fn()
      .mockResolvedValue('jwt-for-createConnectionResponse'),
  }
})

jest.mock('../crypto', () => {
  const actualCrypto = jest.requireActual('../crypto')
  return {
    toPublicKey: actualCrypto.toPublicKey,
    generateKey: jest.fn().mockName('crypto.generateKey'),
  }
})

jest.useFakeTimers()

describe('auth', () => {
  let account
  beforeAll(async () => {
    account = generateTestAccount()

    getAccount.mockResolvedValue(account)

    Config.OPERATOR_URL = 'https://smoothoperator.work'
  })
  describe('#initConnection', () => {
    it('posts to correct url with correct content type', async () => {
      const authRequest = {
        aud: 'egendata://account',
        description: 'An app for your CV online',
        eventsURI: 'http://localhost:4000/events',
        exp: 1556946770839,
        iss: 'http://localhost:4000',
        sid: '5e6f8512-b2c1-48f9-adda-17026cd84856',
        name: 'My CV',
        type: 'AUTHENTICATION_REQUEST',
      }

      await initConnection(authRequest)

      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/events', {
        headers: { 'content-type': 'application/jwt' },
        method: 'POST',
        body: 'jwt-for-createConnectionInit',
      })
    })
  })
  describe('permissions', () => {
    let appKeyBaseData,
      appKeyExperience,
      baseDataKey,
      experienceKey,
      nationalExperienceKey
    let connectionRequest
    beforeEach(() => {
      appKeyBaseData = {
        e: 'AQAB',
        kid: 'egendata://jwks/base-data',
        kty: 'RSA',
        n:
          'sgkmc6s2kOM4gNWlHlkbIpYdXD9HQU_FHRQyBmL1_8wriRHQGtF3XfoQgVKYUwxZfX94_4YQaygdKdZSQjQkXGEHlo6N4xsVx3U0qe-cSE0ER1wvLcPIrQCvixQHJSNnMJjb4VDeMSR7OW36CMrNboOKde8aNAJ8VTow9pd4feMFpPt3RYmuwQ3M7EUOdexD3h6X87TCcTHWmXxqBjVZ-cr7fFu5PZcXkVS2nGEqAThVZn6Jp4NAZm5-wn79awkSKg6skxUuP-VtTtco0XNd7SOnM8PhAX88E8Xi0kPu8LAHvgrxd19Yj-wQIgl-u3J97THTR_rbl3xKRaAAASl0bw',
        use: 'enc',
      }
      appKeyExperience = {
        e: 'AQAB',
        kid: 'egendata://jwks/experience',
        kty: 'RSA',
        n:
          'sgkmc6s2kOM4gNWlHlkbIpYdXD9HQU_FHRQyBmL1_8wriRHQGtF3XfoQgVKYUwxZfX94_4YQaygdKdZSQjQkXGEHlo6N4xsVx3U0qe-cSE0ER1wvLcPIrQCvixQHJSNnMJjb4VDeMSR7OW36CMrNboOKde8aNAJ8VTow9pd4feMFpPt3RYmuwQ3M7EUOdexD3h6X87TCcTHWmXxqBjVZ-cr7fFu5PZcXkVS2nGEqAThVZn6Jp4NAZm5-wn79awkSKg6skxUuP-VtTtco0XNd7SOnM8PhAX88E8Xi0kPu8LAHvgrxd19Yj-wQIgl-u3J97THTR_rbl3xKRaAAASl0bw',
        use: 'enc',
      }
      baseDataKey = {
        e: 'AQAB',
        kid: 'http://localhost:4000/jwks/base-data',
        kty: 'RSA',
        n:
          'sgkmc6s2kOM4gNWlHlkbIpYdXD9HQU_FHRQyBmL1_8wriRHQGtF3XfoQgVKYUwxZfX94_4YQaygdKdZSQjQkXGEHlo6N4xsVx3U0qe-cSE0ER1wvLcPIrQCvixQHJSNnMJjb4VDeMSR7OW36CMrNboOKde8aNAJ8VTow9pd4feMFpPt3RYmuwQ3M7EUOdexD3h6X87TCcTHWmXxqBjVZ-cr7fFu5PZcXkVS2nGEqAThVZn6Jp4NAZm5-wn79awkSKg6skxUuP-VtTtco0XNd7SOnM8PhAX88E8Xi0kPu8LAHvgrxd19Yj-wQIgl-u3J97THTR_rbl3xKRaAAASl0bw',
        use: 'enc',
      }
      experienceKey = {
        e: 'AQAB',
        kid: 'http://localhost:4000/jwks/experience',
        kty: 'RSA',
        n:
          'sgkmc6s2kOM4gNWlHlkbIpYdXD9HQU_FHRQyBmL1_8wriRHQGtF3XfoQgVKYUwxZfX94_4YQaygdKdZSQjQkXGEHlo6N4xsVx3U0qe-cSE0ER1wvLcPIrQCvixQHJSNnMJjb4VDeMSR7OW36CMrNboOKde8aNAJ8VTow9pd4feMFpPt3RYmuwQ3M7EUOdexD3h6X87TCcTHWmXxqBjVZ-cr7fFu5PZcXkVS2nGEqAThVZn6Jp4NAZm5-wn79awkSKg6skxUuP-VtTtco0XNd7SOnM8PhAX88E8Xi0kPu8LAHvgrxd19Yj-wQIgl-u3J97THTR_rbl3xKRaAAASl0bw',
        use: 'enc',
      }
      nationalExperienceKey = {
        e: 'AQAB',
        kid: 'http://localhost:4000/jwks/national-experience',
        kty: 'RSA',
        n:
          'sgkmc6s2kOM4gNWlHlkbIpYdXD9HQU_FHRQyBmL1_8wriRHQGtF3XfoQgVKYUwxZfX94_4YQaygdKdZSQjQkXGEHlo6N4xsVx3U0qe-cSE0ER1wvLcPIrQCvixQHJSNnMJjb4VDeMSR7OW36CMrNboOKde8aNAJ8VTow9pd4feMFpPt3RYmuwQ3M7EUOdexD3h6X87TCcTHWmXxqBjVZ-cr7fFu5PZcXkVS2nGEqAThVZn6Jp4NAZm5-wn79awkSKg6skxUuP-VtTtco0XNd7SOnM8PhAX88E8Xi0kPu8LAHvgrxd19Yj-wQIgl-u3J97THTR_rbl3xKRaAAASl0bw',
        use: 'enc',
      }
      connectionRequest = {
        aud: 'egendata://account',
        description: 'An app for your CV online',
        displayName: 'My CV',
        exp: 1559912378,
        iat: 1559908778,
        iconURI: 'https://mycv.work/android-icon-96x96.png',
        iss: 'https://mycv.work',
        sid: 'dcd2a523-34ca-43f8-95e7-d91342910402',
        type: 'CONNECTION_REQUEST',
        permissions: [
          {
            area: 'baseData',
            domain: 'https://mycv.work',
            id: '18710e28-7d6c-49cf-941e-0f954bb179ae',
            lawfulBasis: 'CONSENT',
            purpose: 'In order to create a CV using our website.',
            type: 'READ',
            jwk: baseDataKey,
          },
          {
            area: 'baseData',
            description: 'Personal information.',
            domain: 'https://mycv.work',
            id: '1712ec0c-9ae6-472f-9e14-46088e51f505',
            lawfulBasis: 'CONSENT',
            type: 'WRITE',
          },
          {
            area: 'experience',
            description: 'A list of your work experiences.',
            domain: 'https://mycv.work',
            id: 'd5dab30d-b0ac-43e3-9ac8-cff8b39ca560',
            lawfulBasis: 'CONSENT',
            type: 'WRITE',
          },
          {
            area: 'experience',
            purpose: 'In order to create a CV using our website.',
            domain: 'https://mycv.work',
            id: '55c24372-6956-4891-b5ff-a6cf69fb5c8b',
            lawfulBasis: 'CONSENT',
            type: 'READ',
            jwk: experienceKey,
          },
          {
            area: 'experience',
            purpose: 'In order to create a CV using our website.',
            domain: 'https://national.gov',
            id: 'fc284cf5-b1af-4fac-b793-7d1adf8a9c60',
            lawfulBasis: 'CONSENT',
            type: 'READ',
            jwk: nationalExperienceKey,
          },
        ],
      }
    })
    describe('#operatorAdapter.getApprovedPermissionRequestWithKeys', () => {
      beforeEach(() => {
        generateKey.mockResolvedValueOnce({ privateKey: appKeyBaseData })
        generateKey.mockResolvedValueOnce({ privateKey: appKeyExperience })
      })
      afterEach(() => {
        generateKey.mockReset()
      })
      it('creates a CONNECTION message', async () => {
        const expected = {
          approved: [
            {
              area: 'baseData',
              domain: 'https://mycv.work',
              id: '18710e28-7d6c-49cf-941e-0f954bb179ae',
              lawfulBasis: 'CONSENT',
              purpose: 'In order to create a CV using our website.',
              type: 'READ',
              kid: baseDataKey.kid,
            },
            {
              area: 'baseData',
              description: 'Personal information.',
              domain: 'https://mycv.work',
              id: '1712ec0c-9ae6-472f-9e14-46088e51f505',
              lawfulBasis: 'CONSENT',
              type: 'WRITE',
              jwks: {
                keys: [baseDataKey, appKeyBaseData],
              },
            },
            {
              area: 'experience',
              description: 'A list of your work experiences.',
              domain: 'https://mycv.work',
              id: 'd5dab30d-b0ac-43e3-9ac8-cff8b39ca560',
              lawfulBasis: 'CONSENT',
              type: 'WRITE',
              jwks: {
                keys: [experienceKey, appKeyExperience],
              },
            },
            {
              area: 'experience',
              domain: 'https://mycv.work',
              id: '55c24372-6956-4891-b5ff-a6cf69fb5c8b',
              lawfulBasis: 'CONSENT',
              purpose: 'In order to create a CV using our website.',
              type: 'READ',
              kid: experienceKey.kid,
            },
            {
              area: 'experience',
              purpose: 'In order to create a CV using our website.',
              domain: 'https://national.gov',
              id: 'fc284cf5-b1af-4fac-b793-7d1adf8a9c60',
              lawfulBasis: 'CONSENT',
              type: 'READ',
              kid: nationalExperienceKey.kid,
            },
          ],
        }
        const approved = new Map([
          ['18710e28-7d6c-49cf-941e-0f954bb179ae', true],
          ['1712ec0c-9ae6-472f-9e14-46088e51f505', true],
          ['55c24372-6956-4891-b5ff-a6cf69fb5c8b', true],
          ['d5dab30d-b0ac-43e3-9ac8-cff8b39ca560', true],
          ['fc284cf5-b1af-4fac-b793-7d1adf8a9c60', true],
        ])

        const result = await operatorAdapter.getApprovedPermissionRequestWithKeys(
          connectionRequest,
          approved,
        )

        expect(result).toEqual(expected)
      })
    })
    describe('#approveConnection', () => {
      beforeEach(() => {
        generateKey.mockResolvedValueOnce({ privateKey: appKeyBaseData })
        generateKey.mockResolvedValueOnce({ privateKey: appKeyExperience })
      })
      afterEach(() => {
        generateKey.mockReset()
      })

      it('sends payload to operator without permissions, if no permissions approved', async () => {
        await approveConnection(connectionRequest, new Map())
        expect(fetch).toHaveBeenCalledWith('https://smoothoperator.work', {
          body: {
            payload: 'connection_payload',
            permissions: undefined,
          },
          headers: {
            'content-type': 'application/jwt',
          },
          method: 'POST',
        })
      })

      it('calls fetch with correct arguments, some approved', async () => {
        const approved = new Map([
          ['18710e28-7d6c-49cf-941e-0f954bb179ae', true],
          ['1712ec0c-9ae6-472f-9e14-46088e51f505', true],
          ['55c24372-6956-4891-b5ff-a6cf69fb5c8b', true],
          ['d5dab30d-b0ac-43e3-9ac8-cff8b39ca560', true],
          ['fc284cf5-b1af-4fac-b793-7d1adf8a9c60', false],
        ])
        await approveConnection(connectionRequest, approved)

        expect(fetch).toHaveBeenCalledWith('https://smoothoperator.work', {
          body: {
            payload: 'connection_payload',
            permissions: {
              approved: expect.any(Array),
            },
          },
          headers: {
            'content-type': 'application/jwt',
          },
          method: 'POST',
        })
      })
      it('calls fetch with correct arguments, none approved', async () => {
        const approved = new Map([
          ['18710e28-7d6c-49cf-941e-0f954bb179ae', false],
          ['1712ec0c-9ae6-472f-9e14-46088e51f505', false],
          ['55c24372-6956-4891-b5ff-a6cf69fb5c8b', false],
          ['d5dab30d-b0ac-43e3-9ac8-cff8b39ca560', false],
          ['fc284cf5-b1af-4fac-b793-7d1adf8a9c60', false],
        ])
        await approveConnection(connectionRequest, approved)

        expect(fetch).toHaveBeenCalledWith('https://smoothoperator.work', {
          body: {
            payload: 'connection_payload',
            permissions: undefined,
          },
          headers: {
            'content-type': 'application/jwt',
          },
          method: 'POST',
        })
      })
    })
  })
})
