import React from 'react'
import { View } from 'react-native'
import styled from '../../../theme'
import LogotypeClean from '../logotypeClean'

const StyledQRIcon = styled(View)`
  align-items: center;
  width: 96px;
  height: 96px;
  margin-bottom: 60px;
  border: 5px solid ${({ theme }) => theme.colors.quiet};
  justify-content: center;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.primary};
`

const QRIcon = () => (
  <StyledQRIcon>
    <LogotypeClean />
  </StyledQRIcon>
)

export default QRIcon
