import { StyleSheet } from 'react-native'
import { theme } from './'

export const containerShadowStyle = StyleSheet.create({
  shadow: {
    shadowColor: theme.colors.shadow,
    shadowRadius: 5,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    backgroundColor: theme.colors.white,
    elevation: theme.sizes.elevation,
  },
})
