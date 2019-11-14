import React from 'react'
import { Alert, View } from 'react-native'
import { Paragraph, StyledPre } from '../../components/typography/Typography'
import { Spinner } from '../../components/elements/Spinner/Spinner'
import { PrimaryButton } from '../../components/elements/Button/Button'
import {
  WrapWithHeader,
  ScrollViewWrap,
  Wrap,
} from '../../components/view/Wrapper'
import { getAccount, storeAccount } from '../../services/storage'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from '../../components/elements/Icon/Icon'
import SettingsCard from '../../components/elements/Card/SettingsCard'

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
      'Are you sure you want to clear your account?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'OK', onPress: () => doClearAccount() },
      ],
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
    <WrapWithHeader
      headerText="Inställningar"
      style={{
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flex: 1,
      }}
    >
      <ScrollViewWrap
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 5,
          paddingHorizontal: 5,
          flex: 1,
        }}
      >
        <SettingsCard>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <StyledPre>Vald lagring</StyledPre>
            <Icon
              style={{ marginLeft: 10 }}
              name="info"
              width="14"
              height="14"
            />
          </View>

          <Paragraph style={{ marginTop: 5, textTransform: 'capitalize' }}>
            {account.pds.provider}
          </Paragraph>
        </SettingsCard>

        <View style={{ width: '100%', justifyContent: 'center' }}>
          <PrimaryButton
            red
            style={{ marginTop: 64 }}
            icon={{ name: 'ban' }}
            onPress={clearAccount}
          >
            Radera konto
          </PrimaryButton>
        </View>
      </ScrollViewWrap>
    </WrapWithHeader>
  )
}

export default Settings
