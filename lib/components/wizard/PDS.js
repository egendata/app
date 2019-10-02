import React, { Component } from 'react'
import { Image } from 'react-native'
import { H1, Paragraph } from '../typography/Typography'
import { Wrap } from '../view/Wrapper'
import { PrimaryButton } from '../elements/Button/Button'
import { Spinner } from '../elements/Spinner/Spinner'

import dropbox from '../../services/dropbox'

export default class PDS extends Component {
  state = {
    loading: false,
  }

  connectToDropbox = async () => {
    dropbox.once('connect', pds => {
      this.props.onConnect(pds)
    })

    await dropbox.connect()
  }

  useMem = () => {
    this.setState(prevState => ({ ...prevState, loading: true }))
    this.props.onConnect({
      provider: 'memory',
      access_token: 'nope',
    })
  }

  render() {
    return this.state.loading ? (
      <Wrap>
        <Spinner />
        <Paragraph align="center" style={{ marginTop: 24 }}>
          Ansluter...
        </Paragraph>
      </Wrap>
    ) : (
      <>
        <H1>Lagring</H1>
        <Image
          source={require('./img/storage.png')}
          style={{ marginBottom: 60, marginTop: 36, width: 252, height: 162 }}
        />
        <Paragraph
          align="center"
          style={{ marginBottom: 60, width: '75%', alignSelf: 'center' }}
        >
          Dags att välja var du vill lagra din data!
        </Paragraph>
        <PrimaryButton
          style={{ marginBottom: 24 }}
          onPress={this.connectToDropbox}
          icon={{
            name: 'dropbox',
          }}
        >
          Dropbox
        </PrimaryButton>
        <PrimaryButton
          onPress={this.useMem}
          icon={{
            name: 'memory',
          }}
        >
          I minnet (DEV)
        </PrimaryButton>
      </>
    )
  }
}
