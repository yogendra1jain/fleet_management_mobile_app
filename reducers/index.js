import { combineReducers } from 'redux';
import auth from './auth';
import nativeAuth from './nativeAuth';
import user from './user';
import loader from './loader';
import commonReducer from './commonReducer';


export default combineReducers({
  auth,
  nativeAuth,
  user,
  loader,
  commonReducer,
});
