import { applyMiddleware, createStore } from "redux";
import { combineReducers } from "redux-immutable";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { reducer as form } from "redux-form/immutable";
import app from "./app";
import auth from "./auth";
import users from "./users";

let rootReducer = combineReducers({
  form,
  app,
  auth,
  users,
});

let middleware = applyMiddleware(thunk);
if (process.env.NODE_ENV === "development")
  middleware = composeWithDevTools(middleware);

const storeFactory = initialState =>
  createStore(rootReducer, initialState, middleware);

const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__";

export default function getStore(initialState) {
  let store;
  let isCreated = false;

  if (!process.browser || process.env.NODE_ENV === "test") {
    // Always make a new store if server,
    // otherwise state is shared between requests
    store = storeFactory(initialState);
    isCreated = true;
  } else {
    if (window[__NEXT_REDUX_STORE__]) store = window[__NEXT_REDUX_STORE__];
    else store = window[__NEXT_REDUX_STORE__] = storeFactory(initialState);
  }

  return { store, isCreated };
}
