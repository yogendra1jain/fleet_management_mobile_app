
const initialState = {
    loading: false,
};


export default function loader(state = initialState, action) {
    switch (action.type) {
        case 'SET_LOADING_TRUE':
            return Object.assign({}, state, {
                loading: true,
            });
        case 'SET_LOADING_FALSE':
            return Object.assign({}, state, {
                loading: false,
            });
        default:
            return state;
    }
}
