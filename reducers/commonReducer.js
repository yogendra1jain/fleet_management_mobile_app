import { LOGOUT_USER } from '../actions/auth';

const commonReducer = (state = {
  type: '',
  isFetching: false,
  appLanguage: 'en',
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
    case `SET_APP_LANGUAGE`:
      return ({
        ...state,
        type: action.type,
        isFetching: false,
        appLanguage: action.language,
      });
    case `${action.identifier}_CUSTOM_INIT`:
      return ({
        ...state,
        type: action.type,
        [`${action.key}`]: action.data,
      });
    case LOGOUT_USER:
      return {
        languageDetails: state.languageDetails,
        appLanguage: state.appLanguage,
      };
    default:
      return state;
  }
};

export default commonReducer;
