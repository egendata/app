import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { Paragraph } from '../typography/Typography'
import styled, { theme as egendataTheme } from '../../theme'
import { Icon } from '../elements/Icon/Icon'

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  min-height: 100px
  align-items: center;
`

const Description = styled(View)`
  margin-left: ${({ theme }) => theme.spacing.small};
`

const Logo = styled(Image)`
  border-radius: ${({ theme }) => theme.sizes.borderRadius.small};
  background: dodgerblue;
  width: 45px;
  height: 45px;
`

const IconContainer = styled(View)`
  flex-direction: row;
  position: absolute;
  top: 0;
  right: 0;
`
const Logotype = uri => <Logo source={uri} />

const ConsentListItem = ({
  iconURI: logoURI,
  displayName,
  description,
  callback,
}) => (
  <Container onPress={callback}>
    <IconContainer>
      <Paragraph
        style={{
          fontWeight: '500',
          marginBottom: 25,
          marginRight: 5,
          color: 'red',
        }}
      >
        remove consent
      </Paragraph>
      <Icon width="11" height="15" name="arrowRight" fill="red" />
    </IconContainer>
    <Logotype uri={logoURI} />
    <Description>
      <Paragraph style={{ marginBottom: 5 }}>{displayName}</Paragraph>
      <Paragraph small>{description}</Paragraph>
    </Description>
  </Container>
)

export default ConsentListItem
