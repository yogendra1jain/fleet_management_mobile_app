import { combineReducers } from 'redux';
import auth from './auth';
import nativeAuth from './nativeAuth';
import user from './user';
import orders from './order';
import loader from './loader';


export default combineReducers({
  auth,
  nativeAuth,
  user,
  loader,
  orders,
});
