const dashboardReducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_POPUP":
            console.log("toggling popup", state, action)
            return {
                ...state,
                popupOpen: state.popupOpen === action.name ? "" : action.name,
            }
        case "SET_STRIPEID":
            return { ...state, hasStripeID: action.payload }
        default:
            return state
    }
}

export default dashboardReducer
