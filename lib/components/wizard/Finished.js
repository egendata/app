import React from 'react'
import { Image } from 'react-native'
import { H1, Paragraph } from '../typography/Typography'
import { PrimaryButton } from '../elements/Button/Button'

function Finished({ onFinished }) {
  return (
    <>
      <H1>Klart!</H1>
      <Image
        source={require('./img/finished.png')}
        style={{ marginBottom: 60, marginTop: 36, width: 264, height: 187 }}
      />
      <Paragraph align="center" style={{ marginBottom: 60 }}>
        Du kommer nu att kunna vara i full kontroll över din data och över vilka
        som använder den!
      </Paragraph>
      <PrimaryButton onPress={onFinished}>Börja använd</PrimaryButton>
    </>
  )
}

export default Finished
