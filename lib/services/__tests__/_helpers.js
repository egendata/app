import { generateKey } from '../crypto'

export const generateTestAccount = async kid => {
  return {
    id: 'foo',
    pds: { provider: 'memory' },
    kid,
  }
}

export const generateTestKey = async options => {
  const { privateKey, privateKeyPem } = await generateKey(options, 1024)
  return { privateKey, privateKeyPem }
}

export const testConnectionRequest = {
  aud: 'mydata://account',
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
    },
    {
      area: 'experience',
      purpose: 'In order to create a CV using our website.',
      domain: 'https://national.gov',
      id: 'fc284cf5-b1af-4fac-b793-7d1adf8a9c60',
      lawfulBasis: 'CONSENT',
      type: 'READ',
    },
  ],
}
