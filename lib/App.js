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
