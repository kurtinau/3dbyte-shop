import React, { useReducer } from "react";
import { v4 as uuidV4 } from "uuid";
import schedules from "features/checkouts/data";
import { ProfileContext } from "./profile.context";
////TODO: change card to cards, change address to addresses, coz query field is changed.
type Action =
  | { type: "HANDLE_ON_INPUT_CHANGE"; payload: any }
  | { type: "UPDATE_CONTACT"; payload: any }
  | { type: "DELETE_CONTACT"; payload: any }
  | { type: "ADD_ADDRESS"; payload: any }
  | { type: "UPDATE_ADDRESS"; payload: any }
  | { type: "DELETE_ADDRESS"; payload: any }
  | { type: "ADD_CARD"; payload: any }
  | { type: "DELETE_CARD"; payload: any }
  | { type: "SET_PRIMARY_CONTACT"; payload: any }
  | { type: "SET_PRIMARY_ADDRESS"; payload: any }
  | { type: "SET_PRIMARY_SCHEDULE"; payload: any }
  | { type: "SET_PRIMARY_CARD"; payload: any }
  | { type: "ADD_CONTACT"; payload: any };
function reducer(state: any, action: Action): any {
  switch (action.type) {
    case "HANDLE_ON_INPUT_CHANGE":
      return { ...state, [action.payload.field]: action.payload.value };
    case "UPDATE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map((item: any) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };
    case "ADD_CONTACT":
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
      };
    case "DELETE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.filter(
          (item: any) => item.id !== action.payload
        ),
      };
    case "ADD_ADDRESS":
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      };
    case "UPDATE_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.map((item: any) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };
    case "DELETE_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.filter(
          (item: any) => item.id !== action.payload
        ),
      };
    case "ADD_CARD":
      const newCard = {
        id: action.payload.id,
        type: state.card.length === "0" ? "primary" : "secondary",
        cardType: action.payload.brand.toLowerCase(),
        name: state.name,
        lastFourDigit: action.payload.last4,
      };
      return {
        ...state,
        cards: [newCard, ...state.cards],
      };
    case "DELETE_CARD":
      return {
        ...state,
        cards: state.cards.filter((item: any) => item.id !== action.payload),
      };
    case "SET_PRIMARY_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map((item: any) =>
          item.id === action.payload
            ? { ...item, isPrimary: true }
            : { ...item, isPrimary: false }
        ),
      };
    case "SET_PRIMARY_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.map((item: any) =>
          item.id === action.payload
            ? { ...item, isPrimary: true }
            : { ...item, isPrimary: false }
        ),
      };
    case "SET_PRIMARY_SCHEDULE":
      return {
        ...state,
        schedules: state.schedules.map((item: any) =>
          item.id === action.payload
            ? { ...item, type: "primary" }
            : { ...item, type: "secondary" }
        ),
      };
    case "SET_PRIMARY_CARD":
      return {
        ...state,
        cards: state.cards.map((item: any) =>
          item.id === action.payload
            ? { ...item, type: "primary" }
            : { ...item, type: "secondary" }
        ),
      };
    default:
      return state;
  }
}

type ProfileProviderProps = {
  initData: any;
};

export const ProfileProvider: React.FunctionComponent<ProfileProviderProps> = ({
  children,
  initData,
}) => {
  const [state, dispatch] = useReducer(reducer, { ...initData, schedules });
  // console.log(state, 'profile provider state');
  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};
