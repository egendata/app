const { Builder, By, until } = require('selenium-webdriver')

require('selenium-webdriver/chrome')
require('chromedriver')

const waitUntilTime = 20000
let driver

export async function init(browser = 'chrome') {
  driver = await new Builder().forBrowser(browser).build()
  return driver
}

export async function getElementById(id) {
  if (!driver) {
    throw new Error('Have you called init before running the tests?')
  }
  const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime)
  return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

export async function getElementByName(name) {
  if (!driver) {
    throw new Error('Have you called init before running the tests?')
  }
  const el = await driver.wait(
    until.elementLocated(By.name(name)),
    waitUntilTime,
  )
  return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

export async function getElementByXPath(xpath) {
  if (!driver) {
    throw new Error('Have you called init before running the tests?')
  }
  const el = await driver.wait(
    until.elementLocated(By.xpath(xpath)),
    waitUntilTime,
  )
  return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}
