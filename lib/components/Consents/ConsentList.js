import React from 'react'
import { FlatList, View } from 'react-native'
import ConsentListItem from './ConsentListItem'
import styled from '../../theme'
import { containerShadowStyle } from '../../theme/sharedStyles'

const Container = styled(View)`
  margin-top: ${({ theme }) => theme.spacing.medium};
  background: ${({ theme }) => theme.colors.white};
  padding: 14px;
  border-radius: ${({ theme }) => theme.sizes.borderRadius.small};
`

const ConsentList = ({ consents, callback }) => {
  return (
    <Container style={containerShadowStyle.shadow}>
      <FlatList
        data={consents}
        renderItem={({ item }) => (
          <ConsentListItem
            callback={() => callback(item)}
            displayName={item.displayName}
            description={item.description}
            iconURI={item.iconURI}
          />
        )}
        keyExtractor={item => item.serviceId}
      />
    </Container>
  )
}

export default ConsentList
