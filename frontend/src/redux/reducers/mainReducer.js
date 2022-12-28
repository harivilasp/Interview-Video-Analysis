const initialState = {
    loggedIn: false,
    isInterviewer: false,
    username:'',
    name:'',
}

const mainReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case 'UPDATE_USER_DETAILS': {
            return { ...state, ...actions.payload }
        }

        default: return state
    }
}

export default mainReducer