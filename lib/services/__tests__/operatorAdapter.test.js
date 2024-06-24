import * as operatorAdapter from '../operatorAdapter'

jest.mock('@egendata/react-native-jose', () => ({
  addRecipient: jest.fn().mockReturnValue(),
}))

jest.mock('react-native-config', () => ({
  OPERATOR_URL: 'myoperatorUrl.invalid',
}))

jest.mock('../jwt', () => ({
  sign: jest.fn().mockResolvedValue('signedRequestPayload'),
  verify: jest.fn().mockResolvedValue({
    payload: {
      paths: [{ recipients: [{ header: { kid: 'mockedKeyId' } }] }],
    },
  }),
}))

jest.mock('../storage', () => ({
  getAccountKeys: jest.fn().mockReturnValue({
    publicKey: 'pub key',
    privateKey: 'priv key',
    privateKeyPem: 'priv key pem',
  }),
  getPrivateKey: jest
    .fn()
    .mockReturnValue({ privateKey: { kid: 'mockedKeyId' } }),
  getConnection: jest
    .fn()
    .mockReturnValue({ connectionId: 'connectionIdFromMock' }),
}))

describe('operatorAdapter', () => {
  describe('getJWE', () => {
    it('creates RECIPIENTS_READ_REQUEST and sends it to operator', async () => {
      await operatorAdapter.getJWE({
        domain: 'myCV.work',
        area: 'photos',
      })
      expect(fetch).toHaveBeenCalledWith('myoperatorUrl.invalid', {
        headers: { 'content-type': 'application/jwt' },
        method: 'POST',
        body: 'signedRequestPayload',
      })
    })
  })
})
