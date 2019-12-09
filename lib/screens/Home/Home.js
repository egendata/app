import React, { useEffect, useReducer } from 'react'
import { Linking, Image, View } from 'react-native'
import { WrapWithHeader, ScrollViewWrap } from '../../components/view/Wrapper'
import ConsentList from '../../components/ConsentList/ConsentList'
import { getConnections } from '../../services/storage'
import { Paragraph } from '../../components/typography/Typography'
import { Spinner } from '../../components/elements/Spinner/Spinner'
import reducer from './homeReducer'

const initialState = {
  connections: [],
  isLoading: true,
}

const HomeScreen = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    getConnections()
      .then(consents => {
        dispatch({
          type: 'setConnections',
          payload: Object.values(consents)[0],
        })
      })
      .then(() => dispatch({ type: 'isLoading', payload: false }))
  }, [])

  useEffect(() => {
    const handleOpenURL = event => {
      const { navigate } = navigation
      navigate('QR-kod', { egendataUrl: event.url })
    }

    Linking.addEventListener('url', handleOpenURL)

    return () => {
      Linking.removeEventListener('url', handleOpenURL)
    }
  }, [navigation])

  if (state.isLoading) {
    return <Spinner />
  }

  if (state.connections.length > 0) {
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
        <ConsentList consents={state.connections} />
      </ScrollViewWrap>
    </WrapWithHeader>
  )
}

export default HomeScreen
