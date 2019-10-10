import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react-native'
import MockedProvider from '../../../utils/test-utils'
import ConsentRequest from '../ConsentRequest'

jest.mock('../../../services/auth', () => ({
  approveConnection: jest.fn().mockResolvedValue('doesntMatter'),
}))

const baseDataKey = {
  e: 'AQAB',
  kid: 'http://localhost:4000/jwks/base-data',
  kty: 'RSA',
  n:
    'sgkmc6s2kOM4gNWlHlkbIpYdXD9HQU_FHRQyBmL1_8wriRHQGtF3XfoQgVKYUwxZfX94_4YQaygdKdZSQjQkXGEHlo6N4xsVx3U0qe-cSE0ER1wvLcPIrQCvixQHJSNnMJjb4VDeMSR7OW36CMrNboOKde8aNAJ8VTow9pd4feMFpPt3RYmuwQ3M7EUOdexD3h6X87TCcTHWmXxqBjVZ-cr7fFu5PZcXkVS2nGEqAThVZn6Jp4NAZm5-wn79awkSKg6skxUuP-VtTtco0XNd7SOnM8PhAX88E8Xi0kPu8LAHvgrxd19Yj-wQIgl-u3J97THTR_rbl3xKRaAAASl0bw',
  use: 'enc',
}
const experienceKey = {
  e: 'AQAB',
  kid: 'http://localhost:4000/jwks/experience',
  kty: 'RSA',
  n:
    'sgkmc6s2kOM4gNWlHlkbIpYdXD9HQU_FHRQyBmL1_8wriRHQGtF3XfoQgVKYUwxZfX94_4YQaygdKdZSQjQkXGEHlo6N4xsVx3U0qe-cSE0ER1wvLcPIrQCvixQHJSNnMJjb4VDeMSR7OW36CMrNboOKde8aNAJ8VTow9pd4feMFpPt3RYmuwQ3M7EUOdexD3h6X87TCcTHWmXxqBjVZ-cr7fFu5PZcXkVS2nGEqAThVZn6Jp4NAZm5-wn79awkSKg6skxUuP-VtTtco0XNd7SOnM8PhAX88E8Xi0kPu8LAHvgrxd19Yj-wQIgl-u3J97THTR_rbl3xKRaAAASl0bw',
  use: 'enc',
}
const nationalExperienceKey = {
  e: 'AQAB',
  kid: 'http://localhost:4000/jwks/national-experience',
  kty: 'RSA',
  n:
    'sgkmc6s2kOM4gNWlHlkbIpYdXD9HQU_FHRQyBmL1_8wriRHQGtF3XfoQgVKYUwxZfX94_4YQaygdKdZSQjQkXGEHlo6N4xsVx3U0qe-cSE0ER1wvLcPIrQCvixQHJSNnMJjb4VDeMSR7OW36CMrNboOKde8aNAJ8VTow9pd4feMFpPt3RYmuwQ3M7EUOdexD3h6X87TCcTHWmXxqBjVZ-cr7fFu5PZcXkVS2nGEqAThVZn6Jp4NAZm5-wn79awkSKg6skxUuP-VtTtco0XNd7SOnM8PhAX88E8Xi0kPu8LAHvgrxd19Yj-wQIgl-u3J97THTR_rbl3xKRaAAASl0bw',
  use: 'enc',
}
const connectionRequest = {
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

describe('components/Consent/ConsentRequest', () => {
  let onApprove, onCancel

  beforeEach(() => {
    onApprove = jest.fn()
    onCancel = jest.fn()
  })

  it('renders', async () => {
    const { getByText } = render(
      <MockedProvider>
        <ConsentRequest
          connectionRequest={connectionRequest}
          onApprove={onApprove}
          onCancel={onCancel}
        />
      </MockedProvider>
    )

    expect(getByText(/tillåt/i)).toBeTruthy()
  })

  it('calls onApprove when Tillåt is pressed', async () => {
    const { getByText } = render(
      <MockedProvider>
        <ConsentRequest
          connectionRequest={connectionRequest}
          onApprove={onApprove}
          onCancel={onCancel}
        />
      </MockedProvider>
    )

    fireEvent.press(getByText(/tillåt/i))

    await wait()

    expect(onApprove).toHaveBeenCalled()
  })

  it('calls onCancel when Neka is pressed', async done => {
    const { getByText } = render(
      <MockedProvider>
        <ConsentRequest
          connectionRequest={connectionRequest}
          onApprove={onApprove}
          onCancel={onCancel}
        />
      </MockedProvider>
    )

    fireEvent.press(getByText(/neka/i))

    await wait()

    done(expect(onCancel).toHaveBeenCalled())
  })
})
