import React from 'react'
import { NavbarIcon } from './components/elements/Icon/Icon'
import { isIphoneX } from './utils/is-iphone-x'
import { View, TouchableOpacity } from 'react-native'
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation'
import styled from './theme'
import Home from './screens/Home/Home'
import Settings from './screens/Settings/Settings'
import Auth from './screens/Auth/Auth'

const NavItemQRBackground = styled(View)`
  border-radius: 50;
  margin-bottom: 15px;
  background: ${({ theme }) => theme.colors.quiet};
  border: 4px solid ${({ theme }) => theme.colors.quiet};
`

const NavItemQR = styled(TouchableOpacity)`
  height: 100px;
  width: 100px;
  align-items: center;
  justify-content: center;
`

const NavItem = styled(TouchableOpacity)`
  margin-bottom: 15px;
`

const TabBarContainer = styled(View)`
  height: 125px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-evenly;
  background: ${({ theme }) => theme.colors.quiet};
  position: relative;
`

const TabBarInnerBlock = styled(View)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 55;
  background: ${({ theme }) => theme.colors.white};
`

const iphoneXTabBarStyles = isIphoneX() ? { height: 65 } : {}
const iphoneXIconStyles = isIphoneX() ? { marginBottom: 22 } : {}
const iphoneXQRIconStyles = isIphoneX() ? { marginBottom: 25 } : {}

const getTabBarIcon = (routeName, isActive) => (
  <NavbarIcon name={routeName.toLowerCase()} active={isActive} />
)

const getTabBarItem = (route, routeIndex, currentNavIndex, onTabPress) => {
  const isRouteActive = routeIndex === currentNavIndex

  return route.key === 'QR-kod' ? (
    <NavItemQRBackground
      key={route.key}
      style={{
        ...iphoneXQRIconStyles,
      }}
    >
      <NavItemQR onPress={() => onTabPress({ route })}>
        {getTabBarIcon(route.key, isRouteActive)}
      </NavItemQR>
    </NavItemQRBackground>
  ) : (
    <NavItem
      onPress={() => onTabPress({ route })}
      style={{ ...iphoneXIconStyles }}
      key={route.key}
    >
      {getTabBarIcon(route.key, isRouteActive)}
    </NavItem>
  )
}

const TabBar = ({ navigation, onTabPress }) => (
  <TabBarContainer>
    <TabBarInnerBlock
      style={{
        ...iphoneXTabBarStyles,
      }}
    />
    {navigation.state.routes.map((route, routeIndex) =>
      getTabBarItem(route, routeIndex, navigation.state.index, onTabPress),
    )}
  </TabBarContainer>
)

const TabBarWithDisplayName = props => <TabBar {...props} />

const HomeNavigator = createStackNavigator({
  main: { screen: Home },
  headerMode: 'none',
})

const BottomTabNavigator = createBottomTabNavigator(
  {
    Hem: { screen: HomeNavigator },
    'QR-kod': {
      screen: Auth,
      navigationOptions: () => ({
        // Hides on camera view
        tabBarVisible: false,
      }),
    },
    Konto: { screen: Settings },
  },
  {
    // eslint-disable-next-line react/display-name
    tabBarComponent: props => <TabBarWithDisplayName {...props} />,
  },
)

export default BottomTabNavigator
