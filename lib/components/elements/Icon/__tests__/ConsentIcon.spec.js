import React from 'react'
import { shallow } from 'react-native-testing-library'
import MockedProvider from '../../../../utils/test-utils'
import ConsentIcon from '../../Icon/Icon'

describe('elements/Icons/QRIcon', () => {
  it('should render', () => {
    const { output } = shallow(
      <MockedProvider>
        <ConsentIcon />
      </MockedProvider>,
    )

    expect(output).toMatchSnapshot()
  })
})
