import React from 'react'
import { View } from 'react-native'
import { containerShadowStyle } from '../../../theme/sharedStyles'
import styled from '../../../theme'

const Container = styled(View)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  margin-top: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  padding: 15px;
`

function SettingsCard({ children }) {
  return <Container style={containerShadowStyle.shadow}>{children}</Container>
}

export default SettingsCard
