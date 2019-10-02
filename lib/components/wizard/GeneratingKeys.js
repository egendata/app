import React from 'react'
import { Paragraph } from '../typography/Typography'
import { Spinner } from '../elements/Spinner/Spinner'
import Logo from './logotype'

function GeneratingKeys({ status }) {
  return (
    <>
      <Logo style={{ marginBottom: 72 }} />
      <Paragraph
        align="center"
        style={{ paddingHorizontal: 24, marginBottom: 72, height: 25 }}
      >
        {status}
      </Paragraph>
      <Spinner />
    </>
  )
}

export default GeneratingKeys
