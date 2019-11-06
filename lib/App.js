import React from 'react'
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation'
import Wizard from './screens/Account/Account'
import AuthLoading from './screens/AuthLoading/AuthLoading'
import BottomTabNavigator from './Navigation'
import { ThemeProvider, theme as myDataTheme } from './theme'
import jose from 'react-native-jose'
;(async function foo() {
  try {
    await jose.sign(
      `eyJhbGciOiJSUzUxMiJ9.VGhlIHRydWUgc2lnbiBvZiBpbnRlbGxpZ2VuY2UgaXMgbm90IGtub3dsZWRnZSBidXQgaW1hZ2luYXRpb24u.dar4u
    Qfhg7HpAXDrFJEP3T6cPePUIstu3tCLiz-HBEx1yAQXxLweQrKOYvIWOlt_HfxjjhxfGDoSXjnQMVHZTJaAYFNtK382pfOKpJAxE6UvkhLtvS-A
    6BKLWMS_aUVgqizOIXH0IeuVz1COpSLlsQ5KICUaqsxYyPfD28vbbQ9IfJ4RyJmSqEEx-M8BY2r4v_HHL-kyvjqGbSoF7o9Z6Cg1CetPJ5OHPBM
    XZa_Aj3LkNWn1GSw5B4WQueb8E0uJVAzLSNbxA-ZNowlOgDtKHOEkwbZu6zj7WvLEm8xovgmAha_y7HssoXnH26Nu-8RMUYw-LXUJz6Fny1F_xc
    v_TA`
    )
  } catch (ex) {}
})()
const RegisterStack = createStackNavigator({
  Register: { screen: Wizard, navigationOptions: () => ({ header: null }) },
})

const AppSwitchContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      App: BottomTabNavigator,
      Register: RegisterStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
)

const App = props => {
  return (
    <ThemeProvider theme={myDataTheme}>
      <AppSwitchContainer {...props} />
    </ThemeProvider>
  )
}

export default App
