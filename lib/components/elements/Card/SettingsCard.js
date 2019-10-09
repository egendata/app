import React from 'react'
import { View, StyleSheet } from 'react-native'
import styled, { theme as egendataTheme } from '../../../theme'

const Container = styled(View)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  margin-top: 20px;
  width: 100%;
  padding: 15px;
`

const containerStyles = StyleSheet.create({
  shadow: {
    shadowColor: egendataTheme.colors.shadow,
    shadowRadius: 5,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    backgroundColor: egendataTheme.colors.white,
    elevation: egendataTheme.sizes.elevation,
  },
})

function SettingsCard({ children }) {
  return <Container style={containerStyles.shadow}>{children}</Container>
}

export default SettingsCard
