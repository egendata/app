import React from 'react'
import { Image, View } from 'react-native'
import { WrapWithHeader, ScrollViewWrap } from '../view/Wrapper'
import ConsentList from './ConsentList'
import { getConnections } from '../../services/storage'
import { Paragraph } from '../typography/Typography'
import { Spinner } from '../elements/Spinner/Spinner'
import { reducer, actions } from './consentReducer'

const initialState = {
  connections: [],
  isLoading: true,
}

const Consents = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    getConnections()
      .then(consents =>
        dispatch({
          type: actions.SET_CONNECTIONS,
          payload: Object.values(consents)[0],
        }),
      )
      .then(() => dispatch({ type: actions.IS_LOADING, payload: false }))
  }, [])

  if (state.isLoading) {
    return <Spinner />
  }

  if (!state.connections.length) {
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

export default Consents
