import React, { useState, useEffect } from 'react'
import { Linking, Image, View } from 'react-native'
import { WrapWithHeader, ScrollViewWrap } from '../../components/view/Wrapper'
import ConsentList from '../../components/ConsentList/ConsentList'
import { getAccount } from '../../services/storage'
import { Paragraph } from '../../components/typography/Typography'

const HomeScreen = ({ navigation }) => {
  /* eslint-disable no-unused-vars */
  const [consents, _setConsents] = useState([])

  // const updateConsents = () => getAll().then(setConsents)

  useEffect(() => {
    const handleOpenURL = event => {
      const { navigate } = navigation
      navigate('QR-kod', { myDataUrl: event.url })
    }

    Linking.addEventListener('url', handleOpenURL)

    /* eslint-disable no-console */
    getAccount().then(console.log)
    // TODO: Uncomment =)
    // const subscription = navigation.addListener('willFocus', updateConsents)
    // updateConsents()

    return () => {
      Linking.removeEventListener('url', handleOpenURL)
      // subscription.remove()
    }
  }, [navigation])

  if (!consents.length) {
    return (
      <WrapWithHeader
        headerText="Min data"
        style={{ justifyContent: 'center' }}
      >
        <ScrollViewWrap
          contentContainerStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '90%',
          }}
        >
          <Image
            style={{
              height: 200,
              width: 250,
              resizeMode: 'contain',
            }}
            source={require('../../components/elements/Icon/img/not_found.png')}
          />
          <View style={{ marginTop: 40, paddingHorizontal: 10 }}>
            <Paragraph align="center">
              Det ser lite tomt ut här just nu.
            </Paragraph>
            <Paragraph style={{ marginTop: 10 }} align="center">
              Här kommer de tjänster som du använder med Egendata att listas.
            </Paragraph>
          </View>
        </ScrollViewWrap>
      </WrapWithHeader>
    )
  }

  return (
    <WrapWithHeader
      headerText="Min data"
      style={{ justifyContent: 'flex-start', paddingHorizontal: 26 }}
    >
      <ScrollViewWrap contentContainerStyle={{ justifyContent: 'flex-start' }}>
        <ConsentList consents={consents} />
      </ScrollViewWrap>
    </WrapWithHeader>
  )
}

export default HomeScreen
