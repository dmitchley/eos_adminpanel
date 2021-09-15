import { combineReducers } from 'redux'
import PageReducer from './PageReducer'
import StudentReducer from './Studentreducer';
import authReducer from './authReducer';
import parentReducer from './parentReducer';
import childrenReducer from './childrenReducer';
import fcmReducer from './fcmReducer';
import uniformReducer from './uniformReducer';
import notificationReducer from './notificationReducer';
import timeSlotReducer from './timeSlotReducer';
import requestCatchupReducer from './requestCatchupReducer';
import appointmentReducer from './appointmentReducer';
import dueInvoiceReducer from './dueInvoiceReducer';

export default combineReducers({
  authReducer,
  StudentReducer,
  PageReducer,
  parentReducer,
  childrenReducer,
  timeSlotReducer,
  requestCatchupReducer,
  appointmentReducer,
  dueInvoiceReducer,
  fcmReducer,
  uniformReducer,
  notificationReducer
})