import Finished from '../../components/wizard/Finished'
import KeyPair from '../../components/KeyPair'
import PDS from '../../components/wizard/PDS'
import React from 'react'
import { Alert } from 'react-native'
import { Wrap, ScrollViewWrap } from '../../components/view/Wrapper'
import { save } from '../../services/account'
import { storeAccount } from '../../services/storage'

const initialState = {
  account: {},
  status: 'generateKeys',
  complete: false,
}

function AccountScreen({ navigation }) {
  const [state, setState] = React.useState(initialState)

  const saveAccount = async account => {
    try {
      if (account.keys && account.pds) {
        await save(account)

        return setState(prevState => ({
          ...prevState,
          status: 'finished',
        }))
      }

      await storeAccount(account)
      setState(s => ({ ...s, account }))

      switch (state.status) {
        case 'generateKeys':
          setState(prevState => ({ ...prevState, status: 'choosePds' }))
          break
        case 'choosePds':
          setState(prevState => ({ ...prevState, status: 'finished' }))
          break
        default:
          setState(prevState => ({ ...prevState, status: 'register' }))
          break
      }
    } catch (err) {
      Alert.alert('Error', `${err.message}\n${err.stack}`, [{ text: '"OK"' }])
    }
  }

  const onGenerateKeys = keys => {
    saveAccount({ ...state.account, keys })
  }

  const onConnectPDS = pds => {
    saveAccount({ ...state.account, pds })
  }

  const currentComponent = () => {
    switch (state.status) {
      case 'generateKeys':
        return <KeyPair keys={state.account.keys} onGenerate={onGenerateKeys} />
      case 'choosePds':
        return <PDS onConnect={onConnectPDS} />
      case 'finished':
        return (
          <Finished onFinished={() => navigation.navigate('AuthLoading')} />
        )
    }
  }

  return (
    <Wrap>
      <ScrollViewWrap>{currentComponent()}</ScrollViewWrap>
    </Wrap>
  )
}

export default AccountScreen
