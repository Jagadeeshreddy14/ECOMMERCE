const initialState = {
  appliedCoupon: null,
  couponError: '',
};

export const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'APPLY_COUPON_SUCCESS':
      return { ...state, appliedCoupon: action.payload, couponError: '' };
    case 'APPLY_COUPON_FAIL':
      return { ...state, appliedCoupon: null, couponError: action.payload };
    default:
      return state;
  }
};