import Config from 'react-native-config'
import { v4 } from 'uuid'
import { generateKey, toPublicKey } from './crypto'
import { storeAccount, storeKeyAndPem } from './storage'
import { createAccountRegistration } from './tokens'

export async function save(account) {
  try {
    if (account.id) {
      throw Error('An account already exist on this phone')
    }
    const { key: privateKey, private: privateKeyPem } = await generateKey({
      use: 'sig',
    })
    const publicKey = toPublicKey(privateKey)
    await storeKeyAndPem({ privateKey, privateKeyPem })

    const accountWithId = {
      ...account,
      kid: privateKey.kid,
      id: v4(),
    }

    await storeAccount(accountWithId)

    const jwt = await createAccountRegistration(
      accountWithId,
      {
        privateKey,
        publicKey,
      },
      privateKeyPem
    )

    await fetch(Config.OPERATOR_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/jwt' },
      body: jwt,
    })

    return accountWithId
  } catch (err) {
    console.error(err)
    throw err
  }
}
