import React from 'react'
import { View, Image } from 'react-native'
import { Paragraph } from '../typography/Typography'
import styled from '../../theme'

const CardContainer = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`

const Card = styled(View)`
  display: flex;
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

const ConsentCard = ({ iconURI, displayName, description }) => {
  return (
    <CardContainer>
      <Card>
        <Logo source={{ uri: iconURI }} />
        <Description>
          <Paragraph>{displayName}</Paragraph>
          <Paragraph small>{description}</Paragraph>
        </Description>
      </Card>
    </CardContainer>
  )
}

export default ConsentCard
