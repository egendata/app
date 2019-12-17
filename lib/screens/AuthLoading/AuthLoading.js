import React from 'react'
import { StatusBar } from 'react-native'
import { Wrap } from '../../components/view/Wrapper'
import { Spinner } from '../../components/elements/Spinner/Spinner'
import { getAccount } from '../../services/storage'

function AuthLoading({ navigation }) {
  React.useEffect(() => {
    const _bootstrapAsync = async () => {
      const user = await getAccount()
      navigation.navigate(user && user.id ? 'main' : 'Register')
    }
    _bootstrapAsync()
  }, [navigation])

  return (
    <Wrap>
      <Spinner />
      <StatusBar barStyle="default" />
    </Wrap>
  )
}

export default AuthLoading
