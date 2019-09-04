import React from 'react'
import { Paragraph } from './typography/Typography'
import { Spinner } from './elements/Spinner/Spinner'
import { generateKeys } from '../services/crypto'

function KeyPair({ keys, onGenerate }) {
  const [state, setState] = React.useState(_ => ({ keys: {}, status: '' }))

  React.useEffect(() => {
    const generate = async () => {
      setState(prevState => ({ ...prevState, status: 'Genererar nycklar...' }))

      const generatedKeys = await generateKeys(2048)

      setState(prevState => ({ ...prevState, status: 'Nycklar genererade' }))

      onGenerate(generatedKeys)
    }

    if (keys) {
      setState({
        keys,
        status: 'Nycklar genererade',
      })
    } else {
      generate()
    }
  }, [keys, onGenerate])

  return (
    <>
      <Spinner />
      <Paragraph align="center" style={{ marginTop: 24 }}>
        {state.status}
      </Paragraph>
    </>
  )
}

export default KeyPair
