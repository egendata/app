import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from '../../../theme'
import { Icon } from '../Icon/Icon'
import { BaseButton, BaseButtonText } from './BaseButton'

export const StyledPrimaryButton = styled(BaseButton)`
  background-color: ${({ theme, red }) =>
    red ? theme.colors.deny : theme.colors.primary};
`

export const PrimaryButtonText = styled(BaseButtonText)`
  color: ${({ theme }) => theme.colors.white};
`

export const PrimaryButton = ({ children, icon, style, red, ...props }) => {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', ...style }} {...props}>
      <StyledPrimaryButton
        red={red}
        style={{
          shadowColor: 'lightgrey',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.5,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {icon ? (
          <Icon
            name={icon.name || ''}
            width={icon.width || 24}
            height={icon.height || 24}
            fill={icon.fill || 'white'}
          />
        ) : null}
        <PrimaryButtonText>{children}</PrimaryButtonText>
      </StyledPrimaryButton>
    </TouchableOpacity>
  )
}

export const SecondaryButton = ({ children, ...props }) => (
  <TouchableOpacity {...props}>
    <BaseButton
      style={{
        shadowColor: '#B1ACEC',
        shadowRadius: 14,
        shadowOpacity: 0.2,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        marginBottom: 32,
      }}
    >
      <BaseButtonText>{children}</BaseButtonText>
    </BaseButton>
  </TouchableOpacity>
)
