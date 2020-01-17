import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import Wizard from './screens/Account/Account'
import AuthLoading from './screens/AuthLoading/AuthLoading'
import AppNavigator from './Navigation'
import NavigationService from './NavigationService'
import { ThemeProvider, theme as myDataTheme } from './theme'
import { Linking } from 'react-native'
// YellowBox is enabled by default in debug mode (when you run it locally)
// We want to disable it since we run Detox tests versus a debug version since it's faster than building the app every time
console.disableYellowBox = true // eslint-disable-line

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
  React.useEffect(() => {
    const handleOpenURL = event => {
      const { navigate } = NavigationService
      navigate('QR-kod', { egendataUrl: event.url })
    }

    Linking.addEventListener('url', handleOpenURL)

    Linking.getInitialURL().then(url => {
      if (url) handleOpenURL({ url })
    })

    return () => {
      Linking.removeEventListener('url', handleOpenURL)
    }
  }, [])

  return (
    <ThemeProvider theme={myDataTheme}>
      <AppSwitchContainer
        {...props}
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef)
        }}
      />
    </ThemeProvider>
  )
}

export default App
