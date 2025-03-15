import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderByUserIdAsync, resetOrderFetchStatus, selectOrderFetchStatus, selectOrders } from '../OrderSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { Button, IconButton, Paper, Stack, Typography, useMediaQuery, useTheme, Stepper, Step, StepLabel, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice';
import Lottie from 'lottie-react';
import { loadingAnimation, noOrdersAnimation } from '../../../assets';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import ReplayIcon from '@mui/icons-material/Replay';
import { useForm } from 'react-hook-form';
import { createReturnAsync, selectReturnStatus } from '../../returns/ReturnSlice';

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

    const handleReturn = (orderId) => {
        setReturnOrderId(orderId);
    };

    const handleReturnSubmit = async (data) => {
        const formData = new FormData();
        formData.append('orderId', returnOrderId);
        formData.append('reason', data.reason);
        formData.append('userId', loggedInUser._id);
        
        // Append each image file
        if (data.returnImages) {
          for (let i = 0; i < data.returnImages.length; i++) {
            formData.append('images', data.returnImages[i]);
          }
        }
    
        await dispatch(createReturnAsync(formData));
        
        if (returnStatus === 'fulfilled') {
          toast.success('Return request submitted successfully');
          setReturnOrderId(null);
        } else if (returnStatus === 'failed') {
          toast.error('Failed to submit return request');
        }
    };

    const renderReturnForm = () => (
        <Stack 
            component="form" 
            onSubmit={handleSubmit(handleReturnSubmit)} 
            spacing={2} 
            sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
        >
            <Typography variant="h6">Return Request Form</Typography>
            
            <TextField
              label="Reason for Return"
              {...register("reason", { 
                required: "Reason is required",
                minLength: {
                  value: 20,
                  message: "Please provide a detailed reason (minimum 20 characters)"
                }
              })}
              multiline
              rows={4}
              error={Boolean(errors.reason)}
              helperText={errors.reason?.message}
            />
    
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Upload Images (Max 3 images)
              </Typography>
              <input
                type="file"
                accept="image/*"
                {...register("returnImages", { 
                  required: "Please upload at least one image",
                  validate: (files) => 
                    files.length <= 3 || "Maximum 3 images allowed"
                })}
                multiple
              />
              {errors.returnImages && (
                <Typography color="error" variant="caption">
                  {errors.returnImages.message}
                </Typography>
              )}
            </Stack>
    
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button 
                variant="outlined" 
                onClick={() => setReturnOrderId(null)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={returnStatus === 'loading'}
              >
                Submit Return Request
              </Button>
            </Stack>
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
                                                onClick={() => handleReturn(order._id)}
                                            >
                                                Return Order
                                            </Button>
                                        )}
                                    </Stack>
                                    {returnOrderId === order._id && renderReturnForm()}
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