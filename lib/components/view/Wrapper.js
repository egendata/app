import React from 'react'
import styled, { theme as egendataTheme } from '../../theme'
import { View, ScrollView, StyleSheet } from 'react-native'
import { ScreenHeaderH3 } from '../../components/typography/Typography'
import { isIphoneX } from '../../utils/is-iphone-x'

export const Wrap = styled(View)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.quiet};
  height: 100%;
  justify-content: center;
  padding-left: ${({ theme }) => theme.spacing.small};
  padding-right: ${({ theme }) => theme.spacing.small};
`

export const ScreenHeaderContainer = styled(View)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: ${isIphoneX() ? '90px' : '12%'};
  width: 100%;
  z-index: 10;
`

const shadowStyles = StyleSheet.create({
  shadow: {
    shadowColor: egendataTheme.colors.shadow,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    backgroundColor: 'white',
    elevation: egendataTheme.sizes.elevation,
  },
})

export const WrapWithHeader = ({ children, headerText }) => (
  <>
    <ScreenHeaderContainer elevation={6} style={shadowStyles.shadow}>
      <ScreenHeaderH3 style={{ paddingBottom: 8 }}>{headerText}</ScreenHeaderH3>
    </ScreenHeaderContainer>
    <Wrap>{children}</Wrap>
  </>
)

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
