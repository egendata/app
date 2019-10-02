import styled, { ThemeProvider } from 'styled-components/native'

const colors = {
  inactive: '#E0E7EB',
  primary: '#04ABFF',
  quiet: '#FAFAFA',
  shadow: 'grey',
  white: '#FFFFFF',
  lightGrey: '#EAEAF1',
  border: '#EBEAFA',
  accept: '#0AC238',
  deny: '#FF5374',
  loading: '#81A1B1',
  text: {
    pre: '#81A1B1',
    primary: '#454F54',
  },
}

const sizes = {
  elevation: 6,
}

const spacing = {
  small: '12px',
  medium: '24px',
  large: '48px',
}

const fontSize = {
  small: '14px',
  regular: '18px',
  regularMedium: '24px',
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
  sizes,
  spacing,
}

export { theme, styled as default, ThemeProvider }
