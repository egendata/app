const SET_CONNECTIONS = 'setConnections'
const IS_LOADING = 'isLoading'

export default (state, { type, payload }) => {
  switch (type) {
    case SET_CONNECTIONS:
      return { ...state, connections: [...state.connections, payload] }
    case IS_LOADING:
      return { ...state, isLoading: payload }
    default:
      return { ...state }
  }
}
