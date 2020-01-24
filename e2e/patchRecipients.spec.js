const {
  device,
  element: detoxElement,
  by,
  expect: detoxExpect,
} = require('detox')

const {
  init,
  getElementById,
  getElementByName,
  getElementByXPath,
} = require('./seleniumUtils')

let driver
const cvUrl = 'https://cv-test.dev.services.jtech.se'
const cvSearchUrl = 'https://cv-search-test.dev.services.jtech.se'
const firstName = 'Tester'
const lastName = 'Smith'

describe('Patching recipients', () => {
  beforeAll(async () => {
    driver = await init('chrome')
  }, 300000)

  afterAll(async () => {
    await driver.quit()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  describe('signup for CV', () => {
    it('should have welcome screen', async () => {
      await detoxExpect(detoxElement(by.text('Dropbox'))).toBeVisible()
      await detoxExpect(detoxElement(by.text('I minnet (DEV)'))).toBeVisible()
    })

    it('should show Min data screen after choosing storage', async () => {
      await detoxElement(by.text('I minnet (DEV)')).tap()
      await detoxExpect(detoxElement(by.text('Börja använd'))).toBeVisible()
      await detoxElement(by.text('Börja använd')).tap()
      await detoxExpect(detoxElement(by.text('Min data'))).toBeVisible()
    })

    it('should show consent screen when scanning opening egendata: URL', async () => {
      await driver.get(`${cvUrl}`)
      const loginBtn = await getElementByXPath(
        '//button[contains(text(), "Login with Egendata")]',
      )
      await loginBtn.click()
      const qrElement = await getElementById('qrcode')
      const url = await qrElement.getAttribute('data-consent-request-url')

      await device.launchApp({
        url,
        newInstance: true,
        permissions: { camera: 'YES' },
      })

      await detoxElement(by.text('Tillåt')).tap()
      await detoxExpect(detoxElement(by.text('Min data'))).toBeVisible()
      await driver.sleep(300)
      const currentUrl = await driver.getCurrentUrl()
      expect(currentUrl).toBe(`${cvUrl}/profile`)
    })

    it('saves basic info on the CV site', async () => {
      const editBtn = await getElementByXPath(
        '//button[contains(text(), "Edit")]',
      )
      await editBtn.click()
      const firstNameInput = await getElementByName('firstName')
      await firstNameInput.sendKeys(firstName)
      const lastNameInput = await getElementByName('lastName')
      await lastNameInput.sendKeys(lastName)
      const saveBtn = await getElementByXPath(
        '//button[contains(text(), "Save")]',
      )
      await saveBtn.click()
      const logoutBtn = await getElementByXPath(
        '//button[contains(text(), "Logout")]',
      )
      await logoutBtn.click()
    })

    // it('shows the info when logging back in to CV', async () => {
    //   await driver.get(`${cvUrl}`)
    //   const loginBtn = await getElementByXPath(
    //     '//button[contains(text(), "Login with Egendata")]',
    //   )
    //   await loginBtn.click()

    //   const qrElement = await getElementById('qrcode')
    //   const url = await qrElement.getAttribute('data-consent-request-url')

    //   await device.launchApp({
    //     url,
    //     newInstance: true,
    //     permissions: { camera: 'YES' },
    //   })

    //   await detoxElement(by.text('Ja')).tap()
    //   await driver.sleep(300)
    //   const logoutBtn = await getElementByXPath(
    //     '//button[contains(text(), "Logout")]',
    //   )
    //   const baseInfo = await getElementByXPath(
    //     `//h3[contains(text(), "${firstName}")]`,
    //   )
    //   expect(baseInfo).toBeTruthy()
    //   await logoutBtn.click()
    // })
  })

  describe('signup for CV-Search', () => {
    it('should show consent screen when scanning opening egendata: URL', async () => {
      await driver.get(`${cvSearchUrl}`)
      const qrElement = await getElementById('qrcode')
      const url = await qrElement.getAttribute('data-consent-request-url')

      await device.launchApp({
        url,
        newInstance: true,
        permissions: { camera: 'YES' },
      })

      await detoxElement(by.text('Tillåt')).tap()
      await detoxExpect(detoxElement(by.text('Min data'))).toBeVisible()
      const baseInfoElement = await getElementByXPath('//*[@id="root"]/div/pre')
      const baseInfo = await baseInfoElement.getAttribute('innerHTML')
      expect(baseInfo).toBe(firstName)
    })
  })
})
