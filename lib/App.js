import React from 'react'
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation'
import Home from './screens/Home/Home'
import Settings from './screens/Settings/Settings'
import Wizard from './screens/Account/Account'
import Auth from './screens/Auth/Auth'
import AuthLoading from './screens/AuthLoading/AuthLoading'
import { ThemeProvider, theme as myDataTheme } from './theme'
import { NavbarIcon } from './components/elements/Icon/Icon'
import { isIphoneX } from './utils/is-iphone-x'

const getTabBarIcon = (navigation, active) => {
  const { routeName } = navigation.state

  return <NavbarIcon name={routeName.toLowerCase()} active={active} />
}

const iphoneXTabBarStyles = isIphoneX() ? { height: 0, marginTop: 20 } : {}
const iphoneXTabStyles = isIphoneX() ? { marginTop: 4 } : {}

const AppStack = createBottomTabNavigator(
  {
    Hem: { screen: Home },
    'QR-kod': {
      screen: Auth,
      navigationOptions: () => ({
        // Hides on
        tabBarVisible: false,
      }),
    },
    Konto: { screen: Settings },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, _tintColor }) =>
        getTabBarIcon(navigation, focused),
    }),
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      style: {
        height: 60,
        ...iphoneXTabBarStyles,
        borderTopColor: 'transparent',
      },
      tabStyle: {
        ...iphoneXTabStyles,
        height: '100%',
      },
      labelStyle: { fontFamily: 'Karla-Bold', fontSize: 12, marginTop: 4 },
      inactiveTintColor: myDataTheme.colors.lightGrey,
      activeTintColor: myDataTheme.colors.primary,
    },
  }
)
const RegisterStack = createStackNavigator({
  Register: { screen: Wizard, navigationOptions: () => ({ header: null }) },
})

const AppSwitchContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      App: AppStack,
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
