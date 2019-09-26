import styled, { ThemeProvider } from 'styled-components/native'

const colors = {
  inactive: '#E0E7EB',
  primary: '#04ABFF',
  quiet: '#fafafa',
  shadow: '#B1ACEC',
  white: '#FFFFFF',
  lightGrey: '#EAEAF1',
  border: '#EBEAFA',
  accept: '#0AC238',
  deny: '#F20D0D',
  loading: '#81A1B1',
  text: {
    primary: '#454F54',
  },
}

const fontSize = {
  small: '14px',
  regular: '18px',
  medium: '32px',
  large: '48px',
}

const typography = {
  contrast: 'Rubik-Medium',
  regular: 'Karla-Regular',
  bold: 'Karla-Bold',
}

const theme = {
  colors,
  fontSize,
  typography,
}

export { theme, styled as default, ThemeProvider }
