import { CookieSharp } from '@mui/icons-material';
import Cookies from 'js-cookie';
import {createContext, useReducer} from 'react';
export const Store = createContext();
const initialState = {
    darkMode: Cookies.get('darkMode') == 'ON' ? true : false,
    cart: {
        cartItems: Cookies.get('cartItems') ? JSON.parse( Cookies.get('cartItems')) : [],
        shippingAddress: Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')) : {},
        paymentMethod: Cookies.get('paymentMethod') ? Cookies.get('paymentMethod') : '',
    },
    userInfo: Cookies.get('userInfo') ? JSON?.parse(Cookies.get('userInfo')) : {},
}
const reducer = (state, action) => {
    switch(action.type) {
        case 'DARK_ON':
            return {...state, darkMode: true};
        case 'DARK_OFF':
            return {...state, darkMode: false};
        case 'CART_ADD_ITEM': {
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item?._key === newItem?._key
              );
            console.log('existItem',existItem);
            const cartItems = existItem ? state.cart.cartItems?.map(item => {
                if (item?._key == existItem?._key) {
                    return item = newItem;
                } else {
                    return item;
                }
            }) : [...state.cart.cartItems, newItem];
            Cookies.set('cartItems', JSON.stringify(cartItems))
            return {...state,
                cart: {...state.cart, cartItems},
            }
        }
        case 'CART_REMOVE_ITEM': {
            // console.log(action.payload?.item?._key ==  state?.cart?.cartItems[0]?._key)
            const cartItems = state.cart.cartItems?.filter(item => item?._key != action.payload?.item?._key)
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return {...state,
                cart: {...state.cart, cartItems},
            };
        }
        case 'USER_LOGIN': {
            Cookies.set('userInfo', JSON.stringify(action.payload));
            return {...state, userInfo: action.payload};
        }
        case 'USER_LOGOUT': {
            return {...state, userInfo: null,cart: {
                cartItems: [],
                shippingAddress: {},
            }};
        }
        case 'SAVE_SHIPPING_ADDRESS': {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.payload,
                }
            }
        }
        case 'SAVE_PAYMENT_METHOD': {
            return {
                ...state,
                caer: {
                    ...state.cart,
                    paymentMethod: action.payload,
                }
            }
        }
        case 'CART_CLEAR': {
            return {...state, cart: {...state.cart, cartItems: []}}
        }
        default: 
        return state;
    }
}
export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};
    return (
        <Store.Provider value={value}>
            {props.children}
        </Store.Provider>
    );
}