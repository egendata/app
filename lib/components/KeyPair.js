import React from 'react'
import { generateKeys } from '../services/crypto'
import GeneratingKeys from './wizard/GeneratingKeys'

function KeyPair({ keys, onGenerate }) {
  const [state, setState] = React.useState(_ => ({ keys: {}, status: '' }))

  React.useEffect(() => {
    const generate = async () => {
      setState(prevState => ({
        ...prevState,
        status: 'Egendata genererar dina personliga nycklar.',
      }))
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

  return <GeneratingKeys status={state.status} />
}

export default KeyPair
