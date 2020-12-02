const dashboardReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_POPUP':
            return { ...state, popupOpen: (state.popupOpen === action.name) ? '' : action.name }
        default:
            return state
    }
}

export default dashboardReducer