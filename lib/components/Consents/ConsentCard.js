import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { Paragraph } from '../typography/Typography'
import styled from '../../theme'

const Container = styled(TouchableOpacity)`
  flex-direction: row;
`

const Description = styled(View)`
  margin-left: ${({ theme }) => theme.spacing.small};
`

const Logo = styled(Image)`
  background: blue;
  width: 48px;
  height: 48px;
`

const ConsentCard = ({ iconURI, displayName, description, callback }) => {
  return (
    <Container onPress={callback}>
      <Logo source={{ uri: iconURI }} />
      <Description>
        <Paragraph>{displayName}</Paragraph>
        <Paragraph small>{description}</Paragraph>
      </Description>
    </Container>
  )
}

export default ConsentCard
