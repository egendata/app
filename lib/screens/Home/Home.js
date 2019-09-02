import React, { useState, useEffect } from 'react'
import { Linking } from 'react-native'
import { H1 } from '../../components/typography/Typography'
import { Wrap, ScrollViewWrap } from '../../components/view/Wrapper'
import ConsentList from '../../components/ConsentList/ConsentList'
import { getAccount } from '../../services/storage'

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

  return (
    <Wrap style={{ justifyContent: 'flex-start', paddingHorizontal: 26 }}>
      <ScrollViewWrap contentContainerStyle={{ justifyContent: 'flex-start' }}>
        <H1 style={{ marginTop: 64 }}>Egendata</H1>
        <ConsentList consents={consents} />
      </ScrollViewWrap>
    </Wrap>
  )
}

export default HomeScreen
