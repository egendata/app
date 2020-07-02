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
  describe('addRecipient', () => {
    it('returns jwe with new recipient', async () => {
      const oldJWE = {
        domain: 'http://localhost:8346',
        area: 'favorite_cats',
        recipients: [
          {
            header: {
              kid:
                'http://localhost:8346/jwks/342m8JJLQ7VhS-YcWzvqS6OPjzXnd-b08PuESLIzohk',
              alg: 'RSA-OAEP',
            },
            encrypted_key:
              'WNAru3_AbZsx5QxYD3cCohGC_beJYBarGJCQCOBbFYE7w5DiO8p1E-VWMvGWBma0f2fUrlN7YWpgoYDBWU1N8oIk7vZDovsI_GF3zan2l_oXYvTCJdinRHyc1jiGpQLtdgIXoHTcdYqlLOQgJcUg0wzvKtWDQAXE7HddndtNtQUhQps7D_eHNZ4DSkhtmXd7W16lsjSwEhJg458Q5Zz9B4XCXtg1ayiRex8fKpa4Lu1207_XHxCpfFSLcweAq4FIr1NZQCzrykdnLLO3pOOAVde7a0mcn48d08K3xbGsOuDAVKYOTCJXfWb4-rLGzUd99KaWZNt6idAjbXWm5MtSmw',
          },
          {
            header: {
              kid:
                'egendata://jwks/rX0ptAh_UnSp0mGoYjq5iLH3euoRdBqB50LPZKEoscw',
              alg: 'RSA-OAEP',
            },
            encrypted_key:
              'ghUqrwSE0wiHXnk7Q6sj8UZtfLBK8KGOOpvPlY-X-VO2o6TwU-F2XZ0K9YdaQz7FHHDWr35NMrkOLFeUsPLfQTki5_L2g0Iw8z7r96CeRIz6dN-iBru9MqGvFcFoWy-kDewAbKpOKRxeQpRrOd4Qw5IgkjjmOB44mcg-EFUlXu-S1EjoEU7Rw9I0YC9-LwF3C01Q4xEjPqRGHiFug-RYLaYK0Ba2MV5f9aYZh9YYSRgS62RltIf5Ww2gI76MtAShEUKxo4eM4UGC87YZScQk5wwkD4_66JhsWTHun6QnqjpWsymgLJRQ_wDsXYetzQjsOa-lg4D_2AgKHUrVrqM8rw',
          },
        ],
      }

      const newRecipientKey = {
        n:
          'qS1ShZotuImce-zDJCCzFD2-rHKCFBVZQ7MUtkv1qOc8CTIg8SCrMFG0-N45-I90o2V0wvnUd6Gy18C1U-PoncOW7atYH_mubMAT9OufG_oNEYxcvnLtkcQ7iJfHEdpGSZG8zbIGPWqcvSOoBsR4AAF-3s7s8lmXTzv3c_r6LrTkHg8vP3wnp_0660aAwD9nQIB5tchxxFJinGY1TChIRx3afxDHqGeURdup_aLM6RzWRw46Pt1rhktY2_ZCpo756Qw3ZVGaraofpOY1w4g2HkkIjZJ-PXkdXZdSVuLMJvASDesVtPv3ZeMMzX6Jq2wTHO5NYgz4jOQQ4KPcx4pksw',
        e: 'AQAB',
        d:
          'pM_Ygvuu6wZ1Am2ntjx8-Y0lgo6TlsktizydQvNBQejznenOGdq_q3UOHx0v0KzA7qXaWFBW4q0OtA2zGSUA6yEumh_A3HW7rYp6ZrJc8T5rGNtrRsZkFwvbC7kBYK0KqIVoL-PtHEwOolxoRx-D4E2Usa9ZOsh5FeHPspegv3o4p61hwbhn0LK6aZIvF0I4pLDVx7aMu1T6LHwhujvVyPFpLRQLOESbvGji-NR07I4mCSSZsm5IeAL7GbjzJpaPDCV537vin4_GKVfvJ1Mx3H0hN6LYysqwypB6xt9Abv0gl--tzYV9yNQl3rP83m2URckWO4jwtPkko2GlZNkAoQ',
        p:
          '2MMWxeOzMGJBc0Xi5CP5zyyNLZYQlEUYrVn0xNNSb4WkSflM2cpyEUWD7vLDIDQbX7hdGFwuCe75TlcKcF3d0_WTbwVhgwCsN8oVhnNokN-kiJZ_ewo32UHyjyXYA8z2hVBschPVhQwE2qiFSuF3Wi2up5J82r-nI_FXG4DGR1k',
        q:
          'x80b3fycgkAaDuucmB8ymMORKdCtwEh8o5pr7eJjFyq1ETbXsg7QMqr_tI5WGsaeq8jH-dlZx5ZcQNK1SWV7gChEzTKQzkcANVUsV-fW24tsYcsg1gdqX-fl48rogsyUkH87VZKndLUaj_VxndshqOP30ZwVF2cUraDamu8nVus',
        dp:
          'lfo96oQGuoZxZLHJMDMYKFlaAV2gcQZx8ZeZPQo-Mn2UU76ThumFDSA9DfqYOdLz0cH9X9p_3E2l36dnyKGZ14tGDH37nym6_wrq49E8W2jyLbN71wUV6VOw4Yy8rryFIW6o6jGA_gJ35VbOiyX_b7zF6Jn5m10Z50uYCqaKClk',
        dq:
          'CrdShk51Kns7qo8yf-o0cYMTtxVtLEH3BWNT5JdezzBIM9soKHGo8v6-5jU4IwmCGx6SszDYIt9KpWNnu78Ip7ABOKw8ngOq3DFsRm611GKe9oPJiBEvwGMUrmoEnHdShIl-ajGKb7UC7rOwW1IUdRV9Bi4D55RsxH87GlI3Xu8',
        qi:
          'DT-hn8eazryP6iKzXU1QrQTmYnCRJ7lxmcDyEcW5C49JZ_PylOG4qgabic6M48jxcn714jloYcbLGx9gfxVdWRuyYwWjZTLR9gS8_2n4GnYwLyD8GqPfMx6TjelqbVlPnogjfPsJoQzSV99skNTimbY6v8Ft7_Rucpjrm8B12vw',
        kty: 'RSA',
        use: 'sig',
        kid: 'egendata://jwks/kAvUQu002YzNbXVdRmoNqLGQNPSnxeGDA3JjHAeJG2Y',
      }
      const privateKeyPhone = {
        n:
          'ueCP0HcTK2GKJp6-gaD3SJ-CjOfuP6vLHfkcugY4iWcs4LmAtqByxhvHhFWBakgLCaZgwCp0or1r7IcmJL5LNy_z7fYrX15hYOf8HH_38I7968uSjhLbRi01xCTtv2R-k0VpFFKVW-V1AZDUCz8e7zdQhuDpwF1UX8RepVFWqeriMqzPwWod66GP-8MDJRnZPff7zeeGnQi3kN-wAfdVZvnggoBg6ZEClLtwSGzdH5F0DfYk-snnvVxJbIM0-Or8zPyIucQd2hkSK1afFGXimz0Li82javS49NUbgeFmYZ-g93xXZSTTx4Z-zea1C3liGGtrPAz7gANY8VR1IqlQxw',
        e: 'AQAB',
        d:
          'lKeYvLMOfKpEb4CTgV53hfgz03cFnpxJFI6PP-MLwi_mv078NpJ5WCENXrN3jcVSNoR-ahFKOIDfWEn54nbh9p_-KLiwlVQI8xR1F2Hsq9HgF302lzNTdHthvZ1_GotHg4aGdD9bviPzgK4QN3JizhPh7gzgRP0fJnwI6ZP0iGy4mg2T5L0-M72OB9t6lUO3CyBnYPOxD8Ow5F0MLoYmGaq_JfO7LXCZx7S4VTQrBE72SYBvwGkXbiKye5iTQqonSfvIpmdYuXM8pd_FmavupzB-DoFdC4nY7l9n9mBU2rehKbrSrzCDBTdKdE54L6cRKx0n3_ldBoXM6G_sqh4fSQ',
        p:
          '6JdRrj4wypuW-vX_ask-uheJGETnOdnas43Et_FUNDxoCNotK3gIOoAQekr1aA4i8ZgoXo1vGhEkqH179InfzreV1omhBdd_dz86KakixnctvMpJ65_o7PM3oKbAQOV_mGiA02X-tF61KOmENlSNqqxnKrnqufTf3BLch5Tg05s',
        q:
          'zJWqN65Juia-8zlELnqCHSX6C2OhlDAeusMi2_4Bx3Agpmfm46zDIM6hLq_vmY-mxg5wZWgPl1G9fTzob_xpkaxpwWHTLm9Visx6flSlMw1s4SrQEP7M7JGaKq53VViBrj3QxW5udnpgDRCE_sKljfuX7Go73UULjDvbV5ipWEU',
        dp:
          'Zcn7RB8RaUnIPFI2Eny6B-TO6aEV9Fpj_NpZMgraR_X7rYwV4oUoTLnI_EwbtAsjvclSOXb6HVVNTrOD8NP571SmrXoTzyOtM_mmsZ7EikiT6qA403ZrEG-sc5EmaABH4-IwJtPnMPaVn676XnCIgx3qFGfC0tjYs05J1sgP0Gs',
        dq:
          'gjkyJEc4ftly6nclQ0CP2eX2h5FfpGgM52yWn9nLYBurbMDuYzXw7s0YJBOxO9oImkFOof3fDr7lEvbWLZJJ0IQivQl71y7fEH6f6hIPJbQB_kG2N1s5LcxwiYKMSzMPOM34OfPVNG0o_qfpQBC-OOZRCheFC4-LjjP7poJyKNE',
        qi:
          'eQaVBht5vsnozmI_My6OcVheMsps6NeiWEwUgmv3Bdxr1X0qd0WbFyJrgZXHLAwcd_JvWsyhmrIhfbBTtkQJKKfeC8U850VaMM4EBI9Eu6e9lqbANbOWstfFLS1xAYG3-ufPIGDycsI-Od8W6PtMO4_yTDxFzxXOJB4fRdluwao',
        kty: 'RSA',
        use: 'sig',
        kid: 'egendata://jwks/o7LRekajUbDTaXFY5TaGRfuVV5tJFBNw4ZcG8RozYZ0',
      }
      const newJWE = await operatorAdapter.addRecipient(
        oldJWE,
        privateKeyPhone,
        newRecipientKey,
      )

      expect(newJWE.recipients).toHaveLength(3)
    })
  })
})
