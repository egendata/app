import React from 'react'
import styled from '../../theme'
import { Text, View } from 'react-native'

export const H1 = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.contrast};
  font-size: ${({ theme }) => theme.fontSize.large};
  text-align: center;
  width: 100%;
  margin-bottom: 32px;
`

export const H2 = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.contrast};
  font-size: ${({ theme }) => theme.fontSize.medium};
  text-align: left;
  width: 100%;
  margin-bottom: 32px;
`

export const H3 = styled(Text)`
  align-self: stretch;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.contrast};
  font-size: ${({ theme }) => theme.fontSize.regular};
  margin-bottom: 12px;
`

export const H4 = styled(Text)`
  align-self: stretch;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.contrast};
  font-size: ${({ theme }) => theme.fontSize.small};
  margin-bottom: 6px;
`

export const StyledParagraph = styled(Text)`
  align-self: stretch;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.regular};
  font-size: ${({ small, theme }) =>
    small ? theme.fontSize.small : theme.fontSize.regular};
  line-height: 22;
  text-align: ${({ align }) => align.toString()};
`

export const Separator = styled(View)`
  align-self: stretch;
  background-color: ${({ theme }) => theme.colors.border};
  height: ${({ vertical = false }) => (vertical ? '100%' : '1px')};
  width: ${({ vertical = false }) => (vertical ? '1px' : '100%')};
  margin: 24px 0;
`

export const Paragraph = ({ align = 'left', small = false, ...props }) => (
  <StyledParagraph align={align} small={small} {...props} />
)
