import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import Wizard from './screens/Account/Account'
import AuthLoading from './screens/AuthLoading/AuthLoading'
import AppNavigator from './Navigation'
import { ThemeProvider, theme as myDataTheme } from './theme'

const AppSwitchContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      App: AppNavigator,
      Register: Wizard,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
)

const App = props => {
  return (
    <ThemeProvider theme={myDataTheme}>
      <AppSwitchContainer {...props} />
    </ThemeProvider>
  )
}

export default App
