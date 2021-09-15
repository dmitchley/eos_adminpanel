import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import { verifyAuth } from 'reduxStore/ReduxAction/authAction';
import { initialUniformNotiListener } from 'reduxStore/ReduxAction/uniformRequestAction';
import rootReducer from "./Reducer/CombinerReducer";

export default function configureStore(persistedState) {
  const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(thunkMiddleware)
  );
  store.dispatch(verifyAuth());
  // store.dispatch(initialUniformNotiListener());
  return store;
}