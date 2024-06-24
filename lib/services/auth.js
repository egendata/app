import { verify } from './jwt'
import { getConnection, storeConnection } from './storage'
import Config from 'react-native-config'
import { createConnectionInit } from './serviceAdapter'

import {
  createLogin,
  createLoginResponse,
  createConnection,
} from './operatorAdapter'

export const authenticationRequestHandler = async ({ payload }) => {
  const existingConnection = await getConnection(payload.iss)

  if (existingConnection) {
    return { existingConnection, sessionId: payload.sid }
  } else {
    const connectionRequest = await initConnection(payload)
    return { connectionRequest, sessionId: payload.sid }
  }
}

export const initConnection = async authRequest => {
  const connectionInit = await createConnectionInit(authRequest)
  try {
    const response = await fetch(authRequest.eventsURI, {
      method: 'POST',
      headers: { 'content-type': 'application/jwt' },
      body: connectionInit,
    })
    const JWTConnectionRequest = await response.text()
    const { payload: connectionRequest } = await verify(JWTConnectionRequest)
    return connectionRequest
  } catch (error) {
    console.error(error)
    throw Error('CONNECTION_INIT failed')
  }
}

export const approveConnection = async (connectionRequest, approved) => {
  try {
    const connectionId = await createConnection(connectionRequest, approved)

    await storeConnection({
      serviceId: connectionRequest.iss,
      displayName: connectionRequest.displayName,
      description: connectionRequest.description,
      iconURI: connectionRequest.iconURI,
      permissions: connectionRequest.permissions,
      connectionId,
    })
    return connectionId
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const approveLogin = async ({ connection, sessionId }) => {
  try {
    const login = await createLogin(connection, sessionId)
    const loginResponse = await createLoginResponse(login)
    const response = await fetch(Config.OPERATOR_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/jwt' },
      body: loginResponse,
    })
    return response.text()
  } catch (error) {
    console.error('error', error)
    throw Error('Could not approve Login')
  }
}
