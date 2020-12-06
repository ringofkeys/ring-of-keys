const dashboardReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_POPUP':
            console.log('toggling popup', state, action)
            return { ...state, popupOpen: (state.popupOpen === action.name) ? '' : action.name }
        default:
            return state
    }
}

export default dashboardReducer