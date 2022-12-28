const initialState = {
    message: '',
}

const notifierReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case 'SET_MESSAGE': {
            return { ...state, message: actions.payload }
        }
        default: {
            return state
        }
    }
}

export default notifierReducer