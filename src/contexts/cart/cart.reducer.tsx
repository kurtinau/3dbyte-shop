// export const cartItemsTotalPrice = (items, { discountInPercent = 0 } = {}) => {
export const cartItemsTotalPrice = (items, coupon = null) => {
  if (items === null || items.length === 0) return 0;
  const itemCost = items.reduce((total, item) => {
    if (item.salePrice) {
      return total + item.salePrice * item.quantity;
    }
    return total + item.price * item.quantity;
  }, 0);
  // const discountRate = 1 - discountInPercent;
  const discount = coupon
    ? (itemCost * Number(coupon.discountInPercent)) / 100
    : 0;
  // itemCost * discountRate * TAX_RATE + shipping;
  // return itemCost * discountRate;
  return itemCost - discount;
};

////TODO: fix bug for normal product details page

// cartItems, cartItemToAdd
const addItemToCart = (state, action) => {
  const existingCartItemIndex = state.items.findIndex(
    (item) => {
      if (!action.payload.variant) {
        return item.id === action.payload.id;
      } else {
        return (item.id === action.payload.id && item.variant.index === action.payload.variant.index);
      }
    }
  );

  if (existingCartItemIndex > -1) {
    const newState = [...state.items];
    newState[existingCartItemIndex].quantity += action.payload.quantity;
    return newState;
  }
  return [...state.items, action.payload];
};

// cartItems, cartItemToRemove
const removeItemFromCart = (state, action) => {
  return state.items.reduce((acc, item) => {
    let itemCondition = item.id === action.payload.id;
    if (action.payload.variant) {
      itemCondition = item.id === action.payload.id && item.variant.index === action.payload.variant.index;
    }
    if (itemCondition) {
      const newQuantity = item.quantity - action.payload.quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
};

const clearItemFromCart = (state, action) => {
  console.log('cart-reducer::action.payload:: ', action.payload);
  console.log('cart-reducer::state.items:: ', state.items);
  const result = state.items.filter((item) => {

    if(item.id !== action.payload.id){
      return true;
    }else{
      if(!action.payload.variant){
        return false;
      }else{
        return item.variant.index !== action.payload.variant.index;
      }
    }

    // if (!action.payload.variant) {
    //   return item.id !== action.payload.id;
    // } else {
    //   if (item.variant) {
    //     console.log('cart-reducer::item.variant.index:: ', item);
    //     console.log('cart-reducer::action.variant.index:: ', action.payload);
    //     console.log('fasdf:: ', item.id !== action.payload.id && item.variant.index !== action.payload.variant.index);
    //     if (item.id === action.payload.id) {
    //       return item.variant.index !== action.payload.variant.index;
    //     }
    //     return item.variant.index !== action.payload.variant.index;
    //   } else {
    //     return item.id !== action.payload.id;
    //   }
    // }
  });
  console.log('cart-reducer::result::: ', result);
  return result;
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'REHYDRATE':
      return { ...state, ...action.payload };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'ADD_ITEM':
      return { ...state, items: addItemToCart(state, action) };
    case 'REMOVE_ITEM':
      return { ...state, items: removeItemFromCart(state, action) };
    case 'CLEAR_ITEM_FROM_CART':
      return { ...state, items: clearItemFromCart(state, action) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    case 'TOGGLE_RESTAURANT':
      return { ...state, isRestaurant: !state.isRestaurant };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};
