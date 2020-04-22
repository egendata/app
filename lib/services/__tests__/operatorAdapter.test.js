import * as operatorAdapter from '../operatorAdapter'
jest.mock('../jwt', () => ({
  sign: jest.fn().mockResolvedValue(),
}))

jest.mock('../storage', () => ({
  getAccountKeys: jest.fn().mockReturnValue({
    publicKey: 'pub key',
    privateKey: 'priv key',
    privateKeyPem: 'priv key pem',
  }),
  getConnection: jest.fn(),
}))

describe('operatorAdapter', () => {
  describe('getRecipients', () => {
    it('creates RECIPIENTS_READ_REQUEST and sends it to operator', async () => {
      await operatorAdapter.getRecipients({
        domain: 'myCV.work',
        area: 'photos',
      })
      expect(fetch).toHaveBeenCalledWith(undefined, {
        headers: { 'content-type': 'application/jwt' },
        method: 'POST',
        body: undefined,
      })
    })
  })
})
