import React from 'react'
import { Linking } from 'react-native'
import Consents from '../../components/Consents'

const HomeScreen = ({ navigation }) => {
  React.useEffect(() => {
    const handleOpenURL = event => {
      const { navigate } = navigation
      navigate('QR-kod', { egendataUrl: event.url })
    }

    Linking.addEventListener('url', handleOpenURL)

    return () => {
      Linking.removeEventListener('url', handleOpenURL)
    }
  }, [navigation])

  return <Consents navigation={navigation} />
}

export default HomeScreen
