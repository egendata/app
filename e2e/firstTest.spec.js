describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should have welcome screen', async () => {
    await expect(element(by.text('Dropbox'))).toBeVisible()
    await expect(element(by.text('I minnet (DEV)'))).toBeVisible()
  })

  it('should show Min data screen after choosing storage', async () => {
    await element(by.text('I minnet (DEV)')).tap()
    await expect(element(by.text('Börja använd'))).toBeVisible()
    await element(by.text('Börja använd')).tap()
    await expect(element(by.text('Min data'))).toBeVisible()
  })

  it('should show consent screen when scanning opening egendata: URL', async () => {
    const url =
      'egendata://account/eyJraWQiOiJodHRwczovL2N2LXRlc3QuZGV2LnNlcnZpY2VzLmp0ZWNoLnNlL2p3a3MvY2xpZW50X2tleSIsImFsZyI6IlBTMjU2In0.eyJ0eXBlIjoiQVVUSEVOVElDQVRJT05fUkVRVUVTVCIsInNpZCI6ImE4ODVhNTZiLTNkZDMtNDc5ZS05MzE5LWJjNWMwMWIzMGUzMiIsImF1ZCI6ImVnZW5kYXRhOi8vYWNjb3VudCIsImlzcyI6Imh0dHBzOi8vY3YtdGVzdC5kZXYuc2VydmljZXMuanRlY2guc2UiLCJldmVudHNVUkkiOiJodHRwczovL2N2LXRlc3QuZGV2LnNlcnZpY2VzLmp0ZWNoLnNlL2V2ZW50cyIsImlhdCI6MTU3OTI0ODc2MSwiZXhwIjoxNTc5MjUyMzYxfQ.g1xmW_JW6-Y3CtF_HT3icb3RuzukWZPWrDml9xRQ7NQkV3JTFgPl2eHeJYyOIUYwAqZ9yGiaPOA7D3Ix1jEn6YKcfILxUvhgmY4En3e0wl_PqiJLX2r5vW6yi5wJEN4y007ZMT-SogVRR6gcA2ZiI5HWzGFIfCMv8vsvRLPCuI5HKU1q5uNxm33HjeJ2B8mLm4cJSxx2jxHBGbG5xiTxGF6MzempEnpM8HAuv6rLTEs_nDbi-kGTzE93qSWSmWA5WSImpuWzS1Wsr7jQNpIvVJL7lvinUjJ8UElcYxR_kqSG9e-IyhMaIIKOTzW5cNn4vGBuEpydytNGvg_qe4fVK-hv9bqOHUTS30u2IAGnFT8GhrbG2yOZOXKmHKfIXxmGCY5jXl0bzErhOqUB2_7spijJsoBDmSGnq3ZvEUu5xh_qK0QqoTUdN48kBKB9_5A0vHv4G8upwzKXoy_2qNGuNHsaevo1cx1nchuwnIAONenAGn1EchJXlV7tv2dyacvkDdMG_A019DXSFsSZJB6vyoY7GrI9SuqmYIocVfwn1oRaCAEMFOX2YD2HuGPwI-oj7OFZI78ua_FfiStx6bDQ2JFgwzunRjuWOyD9daT61O1s07A_aQJ_shkZ8gVkwzq-BMAmfkj8qY4vUIVYtOv3mWAUPrYmi9Z0y8t_jbpbMPU'

    await device.launchApp({
      url,
      newInstance: true,
      permissions: { camera: 'YES' },
    })

    await element(by.text('Tillåt')).tap()
    await expect(element(by.text('Min data'))).toBeVisible()
  })
})
