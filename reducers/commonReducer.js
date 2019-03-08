
const commonReducer = (state = {
    type: '',
    isFetching: false,
    error: '',
  }, action) => {
    switch (action.type) {
        case `${action.identifier}_INIT`:
        console.log('in INIT reducer', action);
            return ({
                ...state,
                type: action.type,
                isFetching: true,
                [`${action.key}`]: [],
            });
        case `${action.identifier}_SUCCESS`:
            console.log('in success reducer', action);
            return ({
                ...state,
                type: action.type,
                isFetching: false,
                [`${action.key}`]: action.data,
            });
        case `${action.identifier}_ERROR`:
            return ({
                ...state,
                type: action.type,
                isFetching: false,
                error: action.error,
            });
        default:
            return state;
    }
};

export default commonReducer;
