import { Stack, TextField, Typography, Button, Menu, MenuItem, Select, Grid, FormControl, Radio, Paper, IconButton, Box, useTheme, useMediaQuery, Divider, Alert, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { Cart } from '../../cart/components/Cart';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice';
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING, TAXES } from '../../../constants';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { formatPrice } from '../../../utils/formatPrice';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';

// Update the THEME_COLORS constant
const THEME_COLORS = {
  background: '#F3F4F6', // Light gray background
  cardBg: '#FFFFFF',     // Pure white for cards
  primary: '#2563EB',    // Vibrant blue
  primaryLight: '#DBEAFE', // Light blue for hover/selected states
  secondary: '#64748B',  // Muted blue-gray
  success: '#10B981',    // Fresh green
  error: '#EF4444',      // Bright red
  border: '#E2E8F0',     // Light gray border
  hover: '#F8FAFC',      // Very light blue hover
  text: {
    primary: '#1F2937',  // Dark gray for primary text
    secondary: '#6B7280' // Medium gray for secondary text
  },
  gradient: {
    primary: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  }
};

const PriceDetail = ({ label, value, type = "regular" }) => (
  <Stack 
    direction="row" 
    justifyContent="space-between" 
    alignItems="center"
    sx={{ 
      py: type === "total" ? 2 : 1,
      borderTop: type === "total" ? 1 : 0,
      borderColor: 'divider'
    }}
  >
    <Typography 
      color={type === "discount" ? "success.main" : "text.secondary"}
      variant={type === "total" ? "subtitle1" : "body2"}
      fontWeight={type === "total" ? 600 : 400}
    >
      {label}
    </Typography>
    <Typography 
      variant={type === "total" ? "h6" : "body2"}
      color={type === "discount" ? "success.main" : type === "total" ? "primary.main" : "text.primary"}
      fontWeight={type === "total" ? 600 : 400}
    >
      {type === "discount" ? "-" : ""}{formatPrice(value)}
    </Typography>
  </Stack>
);

const OrderSummaryCard = ({ cartItem }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      mb: 1,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      '&:hover': { bgcolor: 'grey.50' }
    }}
  >
    <Stack direction="row" spacing={2}>
      <Box
        component="img"
        src={cartItem.product.images[0]}
        alt={cartItem.product.title}
        sx={{
          width: 60,
          height: 60,
          borderRadius: 1,
          objectFit: 'cover'
        }}
      />
      <Stack flex={1} justifyContent="space-between">
        <Typography variant="subtitle2" noWrap>
          {cartItem.product.title}
        </Typography>
        <Stack 
          direction="row" 
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Qty: {cartItem.quantity} × {formatPrice(cartItem.product.price)}
          </Typography>
          <Typography variant="subtitle2" color="primary.main">
            {formatPrice(cartItem.product.price * cartItem.quantity)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  </Paper>
);

const StyledTextField = ({ icon, ...props }) => (
  <TextField
    {...props}
    fullWidth
    variant="outlined"
    InputProps={{
      startAdornment: icon && (
        <Box sx={{ color: 'text.secondary', mr: 1 }}>
          {icon}
        </Box>
      )
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: 'primary.main',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'primary.main',
        }
      }
    }}
  />
);

export const OrderSummarySection = ({ 
  orderTotal,
  cartItems,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  appliedCoupon,
  couponError,
  calculateDiscount,
  orderStatus,
  handleCreateOrder,
  selectedPaymentMethod
}) => {
  const finalAmount = orderTotal + SHIPPING + TAXES - (appliedCoupon ? calculateDiscount(appliedCoupon) : 0);

  return (
    <Paper 
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        border: '1px solid',
        borderColor: THEME_COLORS.border,
        borderRadius: 3,
        bgcolor: THEME_COLORS.cardBg,
        position: 'sticky',
        top: 24,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        maxHeight: 'calc(100vh - 48px)',
        overflow: 'auto'
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1}
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            pb: 2,
            borderBottom: 1,
            borderColor: 'divider',
            zIndex: 1
          }}
        >
          <ShoppingBagIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Order Summary ({cartItems.length} items)
          </Typography>
        </Stack>

        {/* Order Items */}
        <Stack 
          spacing={1}
          sx={{
            maxHeight: '30vh',
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: 6,
              borderRadius: 10
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.300',
              borderRadius: 10
            }
          }}
        >
          {cartItems.map(item => (
            <OrderSummaryCard key={item.product._id} cartItem={item} />
          ))}
        </Stack>

        {/* Coupon Section */}
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2,
            bgcolor: 'grey.50',
            borderStyle: 'dashed'
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalOfferIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={500}>
                Apply Coupon
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                error={!!couponError}
                helperText={couponError}
                sx={{ bgcolor: 'white' }}
              />
              <LoadingButton
                variant="contained"
                onClick={handleApplyCoupon}
                disabled={!couponCode}
                sx={{ minWidth: '80px' }}
              >
                Apply
              </LoadingButton>
            </Stack>
          </Stack>
        </Paper>

        {/* Price Breakdown */}
        <Stack 
          spacing={2}
          sx={{
            py: 2,
            borderTop: 1,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <PriceDetail label="Subtotal" value={orderTotal} />
          <PriceDetail label="Shipping" value={SHIPPING} />
          <PriceDetail label="Tax" value={TAXES} />
          
          {appliedCoupon && (
            <PriceDetail 
              label={`Discount (${appliedCoupon.code})`}
              value={calculateDiscount(appliedCoupon)}
              type="discount"
            />
          )}
        </Stack>

        {/* Final Amount */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
          sx={{
            p: 3,
            background: THEME_COLORS.gradient.primary,
            borderRadius: 2,
            color: 'white',
            boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.2)'
          }}
        >
          <Typography variant="h6">
            Total Amount
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {formatPrice(finalAmount)}
          </Typography>
        </Stack>

        {/* Place Order Button */}
        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          loading={orderStatus === 'pending'}
          onClick={handleCreateOrder}
          sx={{
            py: 2,
            borderRadius: 2,
            background: THEME_COLORS.gradient.primary,
            boxShadow: '0 4px 12px rgb(37 99 235 / 0.2)',
            '&:hover': {
              background: THEME_COLORS.gradient.primary,
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgb(37 99 235 / 0.25)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {selectedPaymentMethod === 'CARD' ? 'Proceed to Payment' : 'Place Order'}
        </LoadingButton>
      </Stack>
    </Paper>
  );
};

export const Checkout = () => {
  const status = '';
  const addresses = useSelector(selectAddresses);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const addressStatus = useSelector(selectAddressStatus);
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const orderStatus = useSelector(selectOrderStatus);
  const currentOrder = useSelector(selectCurrentOrder);
  const orderTotal = cartItems.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0);
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const formValidation = {
    type: { required: "Address type is required" },
    street: { required: "Street address is required" },
    phoneNumber: {
      required: "Phone number is required",
      pattern: {
        value: /^\d{10}$/,
        message: "Please enter a valid 10-digit phone number"
      }
    },
    country: { required: "Country is required" },
    city: { required: "City is required" },
    state: { required: "State is required" },
    postalCode: {
      required: "Postal code is required",
      pattern: {
        value: /^\d{6}$/,
        message: "Please enter a valid 6-digit postal code"
      }
    }
  };

  const calculateDiscount = (coupon) => {
    if (!coupon || !orderTotal) return 0;

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderTotal * coupon.discountValue) / 100;
      // Apply maximum discount limit if set
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      // Fixed amount discount
      discount = Math.min(coupon.discountValue, orderTotal);
    }

    // Ensure discount doesn't exceed order total
    return Math.min(Math.round(discount), orderTotal);
  };

  useEffect(() => {
    if (addressStatus === 'fulfilled') {
      reset();
      toast.success('Address saved successfully!');
    } else if (addressStatus === 'rejected') {
      toast.error('Failed to save address');
    }
  }, [addressStatus, reset]);

  useEffect(() => {
    if (currentOrder && currentOrder?._id) {
      dispatch(resetCartByUserIdAsync(loggedInUser?._id));
      navigate(`/order-success/${currentOrder?._id}`);
    }
  }, [currentOrder]);

  const handleAddAddress = async (data) => {
    if (!loggedInUser?._id) {
      toast.error('Please login to add address');
      return;
    }
  
    const addressData = {
      ...data,
      user: loggedInUser._id
    };
  
    try {
      await dispatch(addAddressAsync(addressData)).unwrap();
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (selectedPaymentMethod === 'CARD') {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: "rzp_live_kYGlb6Srm9dDRe", // Replace with your test key
          amount: (orderTotal + SHIPPING + TAXES) * 100, // Amount in paise
          currency: "INR",
          name: "Apex Store",
          description: "Order Payment",
          handler: function (response) {
            // On successful payment
            if (response.razorpay_payment_id) {
              // Create order after payment success
              const order = {
                user: loggedInUser._id,
                item: cartItems,
                address: selectedAddress,
                paymentMode: selectedPaymentMethod,
                total: orderTotal + SHIPPING + TAXES,
                paymentId: response.razorpay_payment_id
              };
              dispatch(createOrderAsync(order));
              toast.success('Payment Successful!');
            }
          },
          prefill: {
            name: loggedInUser?.name || '',
            email: loggedInUser?.email || '',
            contact: selectedAddress?.phoneNumber || ''
          },
          theme: {
            color: "#1976d2"
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };
    } else {
      // Handle COD order
      const order = {
        user: loggedInUser._id,
        item: cartItems,
        address: selectedAddress,
        paymentMode: selectedPaymentMethod,
        total: orderTotal + SHIPPING + TAXES
      };
      dispatch(createOrderAsync(order));
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode, cartTotal: orderTotal }),
      });

      if (!response.ok) {
        throw new Error('Coupon validation failed');
      }

      const data = await response.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponError('');
        toast.success(`Coupon applied! You saved ₹${calculateDiscount(data.coupon)}`);
      } else {
        setCouponError('Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError(error.message || 'Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  return (
    <Box sx={{ 
      bgcolor: THEME_COLORS.background, 
      minHeight: '100vh',
      py: 4 
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Left Column - Shipping & Payment */}
          <Grid item xs={12} md={8}>
            <Stack rowGap={4}>

              {/* heading */}
              <Stack flexDirection={'row'} columnGap={is480 ? 0.3 : 1} alignItems={'center'}>
                <motion.div whileHover={{ x: -5 }}>
                  <IconButton component={Link} to={"/cart"}><ArrowBackIcon fontSize={is480 ? "medium" : 'large'} /></IconButton>
                </motion.div>
                <Typography variant='h4'>Shipping Information</Typography>
              </Stack>

              {/* address form */}
              <Stack 
                component="form" 
                noValidate 
                spacing={3} 
                onSubmit={handleSubmit(handleAddAddress)}
                sx={{
                  p: 4,
                  border: '1px solid',
                  borderColor: THEME_COLORS.border,
                  borderRadius: 3,
                  bgcolor: THEME_COLORS.cardBg,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  '&:hover': {
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="h6">Add New Address</Typography>
                </Stack>

                <Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <StyledTextField
      icon={<HomeIcon />}
      label="Address Type"
      placeholder="Home, Office, etc."
      {...register("type", formValidation.type)}
      error={!!errors.type}
      helperText={errors.type?.message}
    />
  </Grid>
  
  <Grid item xs={12}>
    <StyledTextField
      icon={<LocationOnIcon />}
      label="Street Address"
      multiline
      rows={2}
      {...register("street", formValidation.street)}
      error={!!errors.street}
      helperText={errors.street?.message}
    />
  </Grid>

  <Grid item xs={12} sm={6}>
    <StyledTextField
      icon={<PhoneIcon />}
      label="Phone Number"
      type="tel"
      {...register("phoneNumber", formValidation.phoneNumber)}
      error={!!errors.phoneNumber}
      helperText={errors.phoneNumber?.message}
    />
  </Grid>

  <Grid item xs={12} sm={6}>
    <StyledTextField
      icon={<PublicIcon />}
      label="Country"
      {...register("country", formValidation.country)}
      error={!!errors.country}
      helperText={errors.country?.message}
    />
  </Grid>

  <Grid item xs={12} sm={4}>
    <StyledTextField
      icon={<LocationCityIcon />}
      label="City"
      {...register("city", formValidation.city)}
      error={!!errors.city}
      helperText={errors.city?.message}
    />
  </Grid>

  <Grid item xs={12} sm={4}>
    <StyledTextField
      icon={<LocationCityIcon />}
      label="State"
      {...register("state", formValidation.state)}
      error={!!errors.state}
      helperText={errors.state?.message}
    />
  </Grid>

  <Grid item xs={12} sm={4}>
    <StyledTextField
      icon={<LocationOnIcon />}
      label="Postal Code"
      type="number"
      {...register("postalCode", formValidation.postalCode)}
      error={!!errors.postalCode}
      helperText={errors.postalCode?.message}
    />
  </Grid>
</Grid>

                <Stack 
                  direction="row" 
                  spacing={2} 
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => reset()}
                    startIcon={<ClearIcon />}
                  >
                    Reset
                  </Button>
                  <LoadingButton
                    loading={status === 'pending'}
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                  >
                    Save Address
                  </LoadingButton>
                </Stack>
              </Stack>

              {/* existing address */}
              <Stack rowGap={3}>

                <Stack>
                  <Typography variant='h6'>Address</Typography>
                  <Typography variant='body2' color={'text.secondary'}>Choose from existing Addresses</Typography>
                </Stack>

                <Grid container spacing={2}>
                  {addresses.map((address, index) => (
                    <Grid item xs={12} sm={6} key={address._id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          cursor: 'pointer',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: selectedAddress === address ? THEME_COLORS.primary : THEME_COLORS.border,
                          bgcolor: selectedAddress === address ? THEME_COLORS.primaryLight : THEME_COLORS.cardBg,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: THEME_COLORS.primary,
                            bgcolor: THEME_COLORS.primaryLight,
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 15px -3px rgb(37 99 235 / 0.1)'
                          }
                        }}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <Stack spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Radio 
                              checked={selectedAddress === address}
                              onChange={() => setSelectedAddress(address)}
                            />
                            {address.type.toLowerCase() === 'home' ? 
                              <HomeIcon color="primary" /> : 
                              <BusinessIcon color="primary" />
                            }
                            <Typography variant="subtitle1" fontWeight={500}>
                              {address.type}
                            </Typography>
                          </Stack>
                          
                          <Divider />
                          
                          <Stack spacing={1}>
                            <Typography variant="body2">
                              {address.street}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {address.city}, {address.state}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {address.country} - {address.postalCode}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {address.phoneNumber}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

              </Stack>

              {/* payment methods */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: THEME_COLORS.border,
                  bgcolor: THEME_COLORS.cardBg,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
              >
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight={600} color={THEME_COLORS.secondary}>
                    Payment Methods
                  </Typography>
                  
                  {['COD', 'CARD'].map((method) => (
                    <Paper
                      key={method}
                      elevation={0}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: selectedPaymentMethod === method ? THEME_COLORS.primary : THEME_COLORS.border,
                        bgcolor: selectedPaymentMethod === method ? THEME_COLORS.primaryLight : THEME_COLORS.cardBg,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: THEME_COLORS.primary,
                          bgcolor: THEME_COLORS.primaryLight,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 12px -3px rgb(37 99 235 / 0.1)'
                        }
                      }}
                      onClick={() => setSelectedPaymentMethod(method)}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Radio 
                          checked={selectedPaymentMethod === method}
                          sx={{
                            '&.Mui-checked': {
                              color: THEME_COLORS.primary
                            }
                          }}
                        />
                        {method === 'COD' ? <AttachMoneyIcon /> : <PaymentIcon />}
                        <Stack>
                          <Typography variant="subtitle2">
                            {method === 'COD' ? 'Cash on Delivery' : 'Pay Online'}
                          </Typography>
                          <Typography variant="caption" color={THEME_COLORS.secondary}>
                            {method === 'COD' ? 'Pay when you receive' : 'Secure payment via Razorpay'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} md={4}>
            <OrderSummarySection 
              orderTotal={orderTotal}
              cartItems={cartItems}  // Add this prop
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              handleApplyCoupon={handleApplyCoupon}
              appliedCoupon={appliedCoupon}
              couponError={couponError}
              calculateDiscount={calculateDiscount}
              orderStatus={orderStatus}
              handleCreateOrder={handleCreateOrder}
              selectedPaymentMethod={selectedPaymentMethod}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};