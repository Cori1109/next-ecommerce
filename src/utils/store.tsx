import React, { createContext, useReducer, Dispatch } from 'react';
import Cookies from 'js-cookie';

export interface IProduct {
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

export interface IShippingAddr {
  fullName: string;
  address: string;
  city: string;
  postalCode: any;
  country: any;
}

interface defaultState {
  cart: { cartItems: IProduct[]; shippingAddress: any; paymentMethod: any };
}

export enum CartActionType {
  CartAddItem,
  CartRemoveItem,
  CartReset,
  SaveShippingAddress,
  SavePaymentAddress,
}

interface CartAddItem {
  type: CartActionType.CartAddItem;
  payload: IProduct;
}

interface CartRemoveItem {
  type: CartActionType.CartRemoveItem;
  payload: IProduct;
}

interface CartReset {
  type: CartActionType.CartReset;
}

interface SaveShippingAddress {
  type: CartActionType.SaveShippingAddress;
  payload: IShippingAddr;
}

interface SavePaymentAddress {
  type: CartActionType.SavePaymentAddress;
  payload: any;
}

type ProductActions =
  | CartAddItem
  | CartRemoveItem
  | CartReset
  | SaveShippingAddress
  | SavePaymentAddress;

const initState: defaultState = {
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart')!)
    : { cartItems: [], shippingAddress: {} },
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
    case CartActionType.CartReset: {
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    }
    case CartActionType.SaveShippingAddress: {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: { ...state.cart.shippingAddress, ...action.payload },
        },
      };
    }
    case CartActionType.SavePaymentAddress: {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
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
