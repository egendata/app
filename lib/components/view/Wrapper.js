import React from 'react'
import styled from '../../theme'
import { View, ScrollView } from 'react-native'

export const Wrap = styled(View)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.quiet};
  height: 100%;
  justify-content: center;
  padding: 0 32px 0;
`

export const ScrollViewWrap = props => (
  <ScrollView
    contentContainerStyle={{
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
    }}
    style={{ width: '100%' }}
    {...props}
  />
)
