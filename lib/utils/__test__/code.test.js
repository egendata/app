import { parse } from '../code'

describe('code', () => {
  describe('#parse', () => {
    it('parses auth url correctly', () => {
      const jwt = parse('egendata://account/stuff-here-thing')
      expect(jwt).toEqual('stuff-here-thing')
    })
  })
})
