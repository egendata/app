import React, { Component } from 'react'
import { Wrap } from '../view/Wrapper'
import { Paragraph } from '../typography/Typography'
import { PrimaryButton } from '../elements/Button/Button'
import { parse } from '../../utils/code'
import { Spinner } from '../elements/Spinner/Spinner'
import ScanQRCode from './ScanQRCode'

class Scan extends Component {
  state = {
    view: 'scan',
    validated: false,
  }

  componentWillMount() {
    if (this.props.egendataUrl) {
      this.onScanQRCode(this.props.egendataUrl)
    }
  }

  scan = () => {
    this.setState({ view: 'scan' })
  }

  onScanQRCode = qr => {
    try {
      this.setState(prevState => ({ ...prevState, view: 'loading' }))

      const jwt = parse(qr)
      this.props.onScan(jwt)
    } catch (error) {
      console.error('could not parse jwt', error)
      this.setState({ view: 'error', error })
    }
  }

  render() {
    switch (this.state.view) {
      case 'error':
        return (
          <Wrap>
            <Paragraph>
              Okänd kod:{'\n'}
              {this.state.code}
              {'\n'}
              Försök igen!{'\n'}
            </Paragraph>
            <PrimaryButton onPress={this.scan}>Skanna</PrimaryButton>
          </Wrap>
        )
      case 'loading':
        return (
          <Wrap>
            <Spinner />
            <Paragraph align="center" style={{ marginTop: 24 }}>
              Bearbetar förfrågan...
            </Paragraph>
          </Wrap>
        )
      case 'scan':
      default:
        return (
          <Wrap>
            <ScanQRCode
              onCancel={this.props.onCancel}
              onRead={this.onScanQRCode}
            />
          </Wrap>
        )
    }
  }
}

export default Scan
