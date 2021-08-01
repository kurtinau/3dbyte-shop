import React, { useReducer } from 'react';
import { AuthContext } from './auth.context';
const isBrowser = typeof window !== 'undefined';
const INITIAL_STATE = {
  currentForm: 'signIn',
};

function reducer(state: any = INITIAL_STATE, action: any) {
  switch (action.type) {
    case 'SIGNIN':
      return {
        ...state,
        currentForm: 'signIn',
      };
    // case 'SIGNIN_SUCCESS':
    //   return {
    //     ...state,
    //   };
    // case 'SIGN_OUT':
    //   return {
    //     ...state,
    //   };
    case 'SIGNUP':
      return {
        ...state,
        currentForm: 'signUp',
      };
    case 'FORGOTPASS':
      return {
        ...state,
        currentForm: 'forgotPass',
      };
    default:
      return state;
  }
}

export const MyAuthProvider: React.FunctionComponent = ({ children }) => {
  const [authState, authDispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

