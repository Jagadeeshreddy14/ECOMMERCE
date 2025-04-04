import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderByUserIdAsync, resetOrderFetchStatus, selectOrderFetchStatus, selectOrders } from '../OrderSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { Button, IconButton, Paper, Stack, Typography, useMediaQuery, useTheme, Stepper, Step, StepLabel, TextField, Box, FormControl, FormLabel, Select, MenuItem, FormHelperText, RadioGroup, FormControlLabel, Radio, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link } from 'react-router-dom';
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice';
import Lottie from 'lottie-react';
import { loadingAnimation, noOrdersAnimation } from '../../../assets';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import ReplayIcon from '@mui/icons-material/Replay';
import { useForm } from 'react-hook-form';
import { selectReturnStatus, createReturnAsync } from '../../returns/ReturnSlice';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import InfoIcon from '@mui/icons-material/Info';
import { cancelOrderById } from '../OrderApi'; // Adjust the path based on the actual location

const ReturnForm = ({ order, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down("480"));
  
  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM'
  ];

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3} sx={{ p: 3 }}>
      <Typography variant="h6">Return Request</Typography>

      {/* Return Reason */}
      <FormControl error={Boolean(errors.reason)}>
        <FormLabel>Reason for Return</FormLabel>
        <Select
          {...register('reason', { required: 'Please select a reason' })}
          defaultValue=""
        >
          <MenuItem value="">Select a reason</MenuItem>
          <MenuItem value="Damaged Product">Damaged Product</MenuItem>
          <MenuItem value="Wrong Item Received">Wrong Item Received</MenuItem>
          <MenuItem value="Size/Fit Issue">Size/Fit Issue</MenuItem>
          <MenuItem value="Quality Issue">Quality Issue</MenuItem>
          <MenuItem value="Change of Mind">Change of Mind</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        {errors.reason && (
          <FormHelperText>{errors.reason.message}</FormHelperText>
        )}
      </FormControl>

      {/* Return Mode */}
      <FormControl>
        <FormLabel>Return Mode</FormLabel>
        <RadioGroup
          defaultValue="Pickup"
          {...register('returnMode')}
        >
          <FormControlLabel 
            value="Pickup" 
            control={<Radio />} 
            label="Pickup from my address" 
          />
          <FormControlLabel 
            value="Self-Shipping" 
            control={<Radio />} 
            label="Self-shipping (Coming soon)" 
            disabled 
          />
        </RadioGroup>
      </FormControl>

      {/* Pickup Schedule */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Pickup Date"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          minDate={dayjs().add(1, 'day')}
          maxDate={dayjs().add(7, 'day')}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      {/* Time Slot */}
      <FormControl>
        <FormLabel>Select Time Slot</FormLabel>
        <Select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          {timeSlots.map((slot) => (
            <MenuItem key={slot} value={slot}>{slot}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Images Upload */}
      <Stack spacing={1}>
        <Typography variant="subtitle2">
          Upload Images (Max 3, showing the issue)
        </Typography>
        <input
          type="file"
          accept="image/*"
          multiple
          {...register('images', {
            required: 'Please upload at least one image',
            validate: (files) => 
              files?.length <= 3 || 'Maximum 3 images allowed'
          })}
        />
        {errors.images && (
          <Typography color="error" variant="caption">
            {errors.images.message}
          </Typography>
        )}
      </Stack>

      {/* Return Policy */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Return Policy:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Item must be in original condition" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Pack with original packaging and accessories" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Refund will be processed in 5-7 business days" />
          </ListItem>
        </List>
      </Paper>

      {/* Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={false}
        >
          Submit Return Request
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export const UserOrders = () => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector(selectLoggedInUser);
    const orders = useSelector(selectOrders) || [];
    const cartItems = useSelector(selectCartItems) || [];
    const orderFetchStatus = useSelector(selectOrderFetchStatus);
    const cartItemAddStatus = useSelector(selectCartItemAddStatus);
    const returnStatus = useSelector(selectReturnStatus);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [returnOrderId, setReturnOrderId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const theme = useTheme();
    const is1200 = useMediaQuery(theme.breakpoints.down("1200"));
    const is768 = useMediaQuery(theme.breakpoints.down("768"));
    const is660 = useMediaQuery(theme.breakpoints.down(660));
    const is480 = useMediaQuery(theme.breakpoints.down("480"));

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, []);

    useEffect(() => {
        if (loggedInUser?._id) {
            dispatch(getOrderByUserIdAsync(loggedInUser._id));
        }
    }, [dispatch, loggedInUser]);

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart");
        } else if (cartItemAddStatus === 'rejected') {
            toast.error('Error adding product to cart, please try again later');
        }
    }, [cartItemAddStatus]);

    useEffect(() => {
        if (orderFetchStatus === 'rejected') {
            toast.error("Error fetching orders, please try again later");
        }
    }, [orderFetchStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetOrderFetchStatus());
            dispatch(resetCartItemAddStatus());
        };
    }, [dispatch]);

    const handleAddToCart = (product) => {
        if (product?._id && loggedInUser?._id) {
            const item = { user: loggedInUser._id, product: product._id, quantity: 1 };
            dispatch(addToCartAsync(item));
        }
    };

    const handleReturn = async (order) => {
        // Validate return eligibility
        if (!isWithinReturnWindow(order.createdAt)) {
            toast.error('Return window has expired (7 days)');
            return;
        }

        if (order.status !== 'Delivered') {
            toast.error('Only delivered orders can be returned');
            return;
        }

        // Show return form
        setReturnOrderId(order._id);
    };

    const handleReturnSubmit = async (data) => {
        try {
            const returnData = {
                orderId: returnOrderId,
                reason: data.reason,
                returnMode: data.returnMode || 'Pickup',
                pickupDate: selectedDate?.toISOString(),
                timeSlot: data.timeSlot,
                // Add any other required fields from the form
            };
        
            await dispatch(createReturnAsync(returnData)).unwrap();
            toast.success('Return request submitted successfully');
            setReturnOrderId(null); // Close the return form
        } catch (error) {
            toast.error(error.message || 'Failed to submit return request');
        }
    };

    const handleCancelOrder = async (orderId) => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) {
            toast.error('Cancellation reason is required');
            return;
        }

        try {
            await cancelOrderById(orderId, reason);
            toast.success('Order cancelled successfully');
            dispatch(getOrderByUserIdAsync(loggedInUser._id)); // Refresh orders
        } catch (error) {
            toast.error(error.message || 'Failed to cancel order');
        }
    };

    const renderReturnForm = () => (
        <Stack component="form" onSubmit={handleSubmit(handleReturnSubmit)} spacing={2}>
            <Typography variant="h6">Return Request</Typography>

            <FormControl error={Boolean(errors.reason)}>
                <FormLabel>Reason for Return</FormLabel>
                <Select
                    {...register('reason', { required: 'Please select a reason' })}
                    defaultValue=""
                >
                    <MenuItem value="">Select a reason</MenuItem>
                    <MenuItem value="Damaged Product">Damaged Product</MenuItem>
                    <MenuItem value="Wrong Item">Wrong Item</MenuItem>
                    <MenuItem value="Quality Issue">Quality Issue</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.reason && (
                    <FormHelperText>{errors.reason.message}</FormHelperText>
                )}
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Select Pickup Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    minDate={dayjs().add(1, 'day')}
                    maxDate={dayjs().add(7, 'day')}
                />
            </LocalizationProvider>

            <FormControl>
                <FormLabel>Select Time Slot</FormLabel>
                <Select
                    {...register('timeSlot', { required: 'Please select a time slot' })}
                    defaultValue=""
                >
                    <MenuItem value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</MenuItem>
                    <MenuItem value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</MenuItem>
                    <MenuItem value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</MenuItem>
                </Select>
                {errors.timeSlot && (
                    <FormHelperText>{errors.timeSlot.message}</FormHelperText>
                )}
            </FormControl>

            <LoadingButton
                type="submit"
                variant="contained"
                loading={returnStatus === 'loading'}
            >
                Submit Return Request
            </LoadingButton>
        </Stack>
    );

    const getStepNumber = (status) => {
        switch (status) {
            case 'Pending':
                return 0;
            case 'Dispatched':
                return 1;
            case 'Out for delivery':
                return 2;
            case 'Delivered':
                return 3;
            case 'Cancelled':
                return -1;
            default:
                return 0;
        }
    };

    const isWithinReturnWindow = (orderDate) => {
        const orderDateObj = new Date(orderDate);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - orderDateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    const renderOrderItem = (item, index) => {
        // Add null checks and type validation
        if (!item || typeof item !== 'object') return null;

        // Check if product exists and has required properties
        const product = item.product;
        if (!product) return null;

        return (
            <Stack
                key={product._id || index}
                mt={2}
                flexDirection={'row'}
                rowGap={is768 ? '2rem' : ''}
                columnGap={4}
                flexWrap={is768 ? "wrap" : "nowrap"}
            >
                <Stack>
                    {product.images && product.images.length > 0 && (
                        <img
                            style={{
                                width: "100%",
                                aspectRatio: is480 ? 3 / 2 : 1 / 1,
                                objectFit: "contain"
                            }}
                            src={product.images[0]}
                            alt={product.title || ""}
                        />
                    )}
                </Stack>
                <Stack rowGap={1} width={'100%'}>
                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                        <Stack>
                            <Typography variant='h6' fontSize={'1rem'} fontWeight={500}>
                                {product.title}
                            </Typography>
                            {product.brand && (
                                <Typography variant='body1' fontSize={'.9rem'} color={'text.secondary'}>
                                    {product.brand.name}
                                </Typography>
                            )}
                            <Typography color={'text.secondary'} fontSize={'.9rem'}>
                                Qty: {item.quantity || 1}
                            </Typography>
                        </Stack>
                        <Typography>₹{product.price}</Typography>
                    </Stack>
                    {product.description && (
                        <Typography color={'text.secondary'}>
                            {product.description}
                        </Typography>
                    )}
                    <Stack mt={2} alignSelf={is480 ? "flex-start" : 'flex-end'} flexDirection={'row'} columnGap={2}>
                        <Button
                            size='small'
                            component={Link}
                            to={`/product-details/${product._id}`}
                            variant='outlined'
                        >
                            View Product
                        </Button>
                        {cartItems?.some(cartItem => cartItem.product?._id === product._id) ? (
                            <Button size='small' variant='contained' component={Link} to={"/cart"}>
                                Already in Cart
                            </Button>
                        ) : (
                            <Button
                                size='small'
                                variant='contained'
                                onClick={() => handleAddToCart(product)}
                            >
                                Buy Again
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        );
    };

    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            {orderFetchStatus === 'pending' ? (
                <Stack width={is480 ? 'auto' : '25rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} alignItems={'center'}>
                    <Lottie animationData={loadingAnimation} />
                </Stack>
            ) : (
                <Stack width={is1200 ? "auto" : "60rem"} p={is480 ? 2 : 4} mb={'5rem'}>
                    <Stack flexDirection={'row'} columnGap={2}>
                        {!is480 && (
                            <motion.div whileHover={{ x: -5 }} style={{ alignSelf: "center" }}>
                                <IconButton component={Link} to={"/"}>
                                    <ArrowBackIcon fontSize='large' />
                                </IconButton>
                            </motion.div>
                        )}
                        <Stack rowGap={1}>
                            <Typography variant='h4' fontWeight={500}>Order history</Typography>
                            <Typography sx={{ wordWrap: "break-word" }} color={'text.secondary'}>
                                Check the status of recent orders, manage returns, and discover similar products.
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack mt={5} rowGap={5}>
                        {Array.isArray(orders) && orders.map((order) => {
                            if (!order?.item || !Array.isArray(order.item)) return null;

                            return (
                                <Stack key={order._id} p={is480 ? 0 : 2} component={is480 ? "" : Paper} elevation={1} rowGap={2}>
                                    <Stack flexDirection={'row'} rowGap={'1rem'} justifyContent={'space-between'} flexWrap={'wrap'}>
                                        <Stack flexDirection={'row'} columnGap={4} rowGap={'1rem'} flexWrap={'wrap'}>
                                            <Stack>
                                                <Typography>Order Number</Typography>
                                                <Typography color={'text.secondary'}>{order._id}</Typography>
                                            </Stack>
                                            <Stack>
                                                <Typography>Date Placed</Typography>
                                                <Typography color={'text.secondary'}>
                                                    {new Date(order.createdAt).toDateString()}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack>
                                            <Typography>Total Amount</Typography>
                                            <Typography>₹{order.total}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack>
                                        <Typography>Item: {order.item.length}</Typography>
                                    </Stack>
                                    <Stack rowGap={2}>
                                        {order.item.map((item, index) => renderOrderItem(item, index))}
                                    </Stack>
                                    <Stack sx={{ width: '100%', mb: 2 }}>
                                        <Stepper
                                            alternativeLabel={!is480}
                                            activeStep={getStepNumber(order.status)}
                                            orientation={is480 ? "vertical" : "horizontal"}
                                        >
                                            <Step>
                                                <StepLabel>Order Placed</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel>Dispatched</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel>Out for Delivery</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel>Delivered</StepLabel>
                                            </Step>
                                        </Stepper>
                                    </Stack>
                                    <Stack mt={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                        <Typography mb={2}>Status: {order.status}</Typography>
                                        {order.status === 'Delivered' && isWithinReturnWindow(order.createdAt) && (
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<ReplayIcon />}
                                                size="small"
                                                onClick={() => handleReturn(order)}
                                            >
                                                Return Order
                                            </Button>
                                        )}
                                        {order.status === 'Pending' && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleCancelOrder(order._id)}
                                            >
                                                Cancel Order
                                            </Button>
                                        )}
                                        {order.status === 'Cancelled' && (
                                            <Stack spacing={1}>
                                                <Typography color="error">Order Cancelled</Typography>
                                                <Typography variant="body2">Reason: {order.cancellation.reason}</Typography>
                                                <Typography variant="body2">Cancelled At: {new Date(order.cancellation.cancelledAt).toLocaleString()}</Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                    {returnOrderId === order._id && <ReturnForm order={order} onSubmit={handleReturnSubmit} onCancel={() => setReturnOrderId(null)} />}
                                </Stack>
                            );
                        })}
                        {(!orders || orders.length === 0) && (
                            <Stack mt={is480 ? '2rem' : 0} mb={'7rem'} alignSelf={'center'} rowGap={2}>
                                <Stack width={is660 ? "auto" : '30rem'} height={is660 ? "auto" : '30rem'}>
                                    <Lottie animationData={noOrdersAnimation} />
                                </Stack>
                                <Typography textAlign={'center'} alignSelf={'center'} variant='h6'>
                                    Oh! Looks like you haven't been shopping lately
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
};