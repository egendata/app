import React from 'react'
import { Image, View } from 'react-native'
import SvgIcon from 'react-native-svg-icon'
import styled, { theme } from '../../../theme'
import icons from './img/icons'

const StyledQRIcon = styled(View)`
  width: 130px;
  height: 130px;
`

const HomeIcon = ({ active }) => (
  <Image
    style={{ width: 30, height: 24 }}
    source={
      active
        ? require('./img/home_active.png')
        : require('./img/home_inactive.png')
    }
  />
)

const ConsentIcon = () => (
  <StyledQRIcon>
    <Icon
      name={'qr'}
      stroke={theme.colors.quiet}
      width="100%"
      height="100%"
      fill="none"
    />
  </StyledQRIcon>
)

const AccountIcon = ({ active }) => (
  <Image
    style={{ width: 24, height: 24 }}
    source={
      active
        ? require('./img/account_active.png')
        : require('./img/account_inactive.png')
    }
  />
)

const getNavbarIcon = (name, active) => {
  switch (name) {
    case 'konto':
      return <AccountIcon active={active} />
    case 'qr-kod':
      return <ConsentIcon />
    case 'hem':
      return <HomeIcon active={active} />
  }
}

export const NavbarIcon = ({ name, active }) => getNavbarIcon(name, active)

export const Icon = props => <SvgIcon {...props} svgs={icons} />
