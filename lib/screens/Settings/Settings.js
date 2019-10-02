import React from 'react'
import { Alert, View } from 'react-native'
import { Spinner } from '../../components/elements/Spinner/Spinner'
import { H2, H3, Paragraph } from '../../components/typography/Typography'
import { PrimaryButton } from '../../components/elements/Button/Button'
import { Wrap, ScrollViewWrap } from '../../components/view/Wrapper'
import { getAccount, storeAccount } from '../../services/storage'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from '../../components/elements/Icon/Icon'

function Settings({ navigation }) {
  const [account, setAccount] = React.useState()

  const getAccountFromStorage = async () => {
    const accountInStorage = await getAccount()

    setAccount(accountInStorage)
  }

  React.useEffect(() => {
    getAccountFromStorage()
  }, [])

  const doClearAccount = async () => {
    await storeAccount()
    AsyncStorage.removeItem('connections')
    setAccount(undefined)
    const { navigate } = navigation
    navigate('AuthLoading')
  }

  const clearAccount = async () => {
    Alert.alert(
      'Clear account',
      'Are you sure you want to clear your account? This is a REALLY bad idea!',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'OK', onPress: () => doClearAccount() },
      ]
    )
  }

  if (!account) {
    return (
      <Wrap>
        <ScrollViewWrap>
          <Spinner />
        </ScrollViewWrap>
      </Wrap>
    )
  }

  return (
    <Wrap
      style={{
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <ScrollViewWrap
        contentContainerStyle={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flex: 1,
        }}
      >
        <View style={{ width: '100%' }}>
          <H2 style={{ alignSelf: 'flex-start', marginTop: 64 }}>
            Inställningar
          </H2>
          <H3 style={{ marginTop: 32 }}>PDS</H3>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="circleCheck"
              width="22"
              height="18"
              style={{ marginRight: 12 }}
            />
            <Paragraph align="left" style={{ textTransform: 'capitalize' }}>
              {account.pds.provider}
            </Paragraph>
          </View>
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <PrimaryButton
              red
              style={{ marginTop: 32 }}
              icon={{ name: 'ban' }}
              onPress={clearAccount}
            >
              Radera konto
            </PrimaryButton>
          </View>
        </View>
      </ScrollViewWrap>
    </Wrap>
  )
}

export default Settings
