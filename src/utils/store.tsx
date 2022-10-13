import React, { createContext, useReducer, Dispatch } from 'react';
import Cookies from 'js-cookie';

export interface Product {
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  quantity: number;
}

interface defaultState {
  cart: { cartItems: Product[] };
}

export enum CartActionType {
  CartAddItem,
  CartRemoveItem,
}

interface CartAddItem {
  type: CartActionType.CartAddItem;
  payload: Product;
}

interface CartRemoveItem {
  type: CartActionType.CartRemoveItem;
  payload: Product;
}

type ProductActions = CartAddItem | CartRemoveItem;

const initState: defaultState = {
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart')!)
    : { cartItems: [] },
};

export const Store = createContext<{
  state: defaultState;
  dispatch: React.Dispatch<ProductActions>;
}>({
  state: initState,
  dispatch: () => undefined,
});

const reducer = (state: defaultState, action: ProductActions): defaultState => {
  switch (action.type) {
    case CartActionType.CartAddItem: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case CartActionType.CartRemoveItem: {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
};

interface Props {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
