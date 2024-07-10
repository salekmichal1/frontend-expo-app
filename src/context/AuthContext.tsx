import React, { createContext, Dispatch, useEffect, useReducer } from "react";
import { UserElement } from "../model/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum UserSateType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  AUTH_IS_READY = "AUTH_IS_READY",
}

type AuthContextProviderProps = {
  children: React.ReactNode;
};

type UserActions = {
  type: UserSateType;
  payload: UserElement | null;
};

type InitialState = {
  user: UserElement | null;
  authIsReady: boolean;
};

const initialState: InitialState = {
  user: null,
  authIsReady: false,
};

export const AuthContext = createContext<{
  state: InitialState;
  dispatch: Dispatch<UserActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

// setting up auth context options
export const authReducer = function (state: InitialState, action: UserActions) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

// passing reducer properties and wraping children components
export const AuthContextProvider = function ({
  children,
}: AuthContextProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // if (localStorage.getItem("token") !== null) {
    //   const findUserByToken = async function () {
    //     try {
    //       const res = await fetch(
    //         "https://front-end-app-server.onrender.com/users"
    //       );
    //       if (!res.ok) {
    //         throw Error(res.statusText);
    //       }
    //       const data: UserElement[] = await res.json();

    //       const user: UserElement | undefined = data.find((user) => {
    //         return user.token === localStorage.getItem("token");
    //       });

    //       if (user) {
    //         dispatch({ type: UserSateType.AUTH_IS_READY, payload: user });
    //       } else {
    //         dispatch({ type: UserSateType.AUTH_IS_READY, payload: null });
    //       }
    //     } catch (err: any) {
    //       console.error(err.message);
    //     }
    //   };

    //   findUserByToken();
    // } else {
    //   dispatch({ type: UserSateType.AUTH_IS_READY, payload: null });
    // }
    // dispatch({
    //   type: UserSateType.AUTH_IS_READY,
    //   payload: {
    //     email: "abc@gmail.com",
    //     id: 1,
    //     name: "Tomek Tomek",
    //     password: "zaq1@WSX",
    //     phone: "1-770-736-8031 x56442",
    //     token:
    //       "set7iu7r89r57zfnp6ful4dneb00scum6-09kxnrjy4npan9kmgi2cnxn0dz9riuyhzf",
    //     username: "Tom",
    //   },
    // });
    const checkAndFindUserByToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token !== null) {
        const findUserByToken = async function () {
          try {
            const res = await fetch(
              "https://front-end-app-server.onrender.com/users"
            );
            if (!res.ok) {
              throw Error(res.statusText);
            }
            const data: UserElement[] = await res.json();

            const user: UserElement | undefined = data.find(
              (user) => user.token === token
            );

            if (user) {
              dispatch({ type: UserSateType.AUTH_IS_READY, payload: user });
            } else {
              dispatch({ type: UserSateType.AUTH_IS_READY, payload: null });
            }
          } catch (err: any) {
            console.error(err.message);
          }
        };

        findUserByToken();
      } else {
        dispatch({ type: UserSateType.AUTH_IS_READY, payload: null });
      }
    };

    checkAndFindUserByToken();
  }, []);
  console.log(state);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
