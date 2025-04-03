import React, { useEffect, useState } from 'react';
import { CartItem } from './CartItem';
import { 
    Button, 
    Chip, 
    Stack, 
    Typography, 
    useMediaQuery, 
    useTheme, 
    Box, 
    Divider,
    Grid,
    CircularProgress 
} from '@mui/material';
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { SHIPPING, TAXES } from '../../../constants';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { formatPrice } from '../../../utils/formatPrice';

export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems);
    const subtotal = items?.reduce((acc, item) => (item?.product?.price - (item?.product?.discountAmount || 0)) * item?.quantity + acc, 0) || 0;
    const totalItems = items?.reduce((acc, item) => acc + item?.quantity, 0) || 0;
    const navigate = useNavigate();
    const theme = useTheme();
    const is900 = useMediaQuery(theme.breakpoints.down(900));

    const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, []);

    useEffect(() => {
        if (items?.length === 0) {
            navigate("/");
        }
    }, [items, navigate]);

    useEffect(() => {
        if (cartItemRemoveStatus === 'fulfilled') {
            toast.success("Product removed from cart");
        } else if (cartItemRemoveStatus === 'rejected') {
            toast.error("Error removing product from cart, please try again later");
        }
    }, [cartItemRemoveStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus());
        };
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{
            bgcolor: '#f8f9fa',
            minHeight: '100vh',
            py: 6,
            px: { xs: 2, sm: 4 }
        }}>
            <Box sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                bgcolor: 'white',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                p: 4
            }}>
                {isLoading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px'
                    }}>
                        <CircularProgress 
                            size={60}
                            thickness={4}
                            sx={{
                                color: 'primary.main',
                                '& .MuiCircularProgress-circle': {
                                    strokeLinecap: 'round',
                                }
                            }}
                        />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h4" sx={{
                            fontWeight: 700,
                            mb: 4,
                            color: 'text.primary',
                            borderBottom: '1px solid #eee',
                            pb: 2
                        }}>
                            {checkout ? 'Order Summary' : 'Your Shopping Cart'}
                        </Typography>

                        {items?.length > 0 ? (
                            <Grid container spacing={4}>
                                {/* Cart Items */}
                                <Grid item xs={12} md={8}>
                                    <Stack spacing={3}>
                                        {items?.map((item) => (
                                            <motion.div
                                                key={item._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <CartItem
                                                    id={item._id}
                                                    title={item.product?.title}
                                                    brand={item.product?.brand?.name}
                                                    category={item.product?.category?.name}
                                                    price={item.product?.price}
                                                    discountAmount={item.product?.discountAmount || 0}
                                                    quantity={item.quantity}
                                                    thumbnail={item.product?.thumbnail}
                                                    stockQuantity={item.product?.stockQuantity}
                                                    productId={item.product?._id}
                                                />
                                            </motion.div>
                                        ))}
                                    </Stack>
                                </Grid>

                                {/* Order Summary */}
                                <Grid item xs={12} md={4}>
                                    <Box sx={{
                                        bgcolor: '#fafafa',
                                        borderRadius: 3,
                                        p: 3,
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                        border: '1px solid #eee'
                                    }}>
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 600,
                                            mb: 3,
                                            color: 'text.primary'
                                        }}>
                                            Order Summary
                                        </Typography>

                                        <Stack spacing={2} sx={{ mb: 3 }}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body1">Subtotal ({totalItems} items)</Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {formatPrice(subtotal)}
                                                </Typography>
                                            </Stack>

                                            {checkout && (
                                                <>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body1">Shipping</Typography>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {formatPrice(SHIPPING)}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body1">Taxes</Typography>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {formatPrice(TAXES)}
                                                        </Typography>
                                                    </Stack>
                                                </>
                                            )}

                                            <Divider sx={{ my: 1 }} />

                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body1" fontWeight={600}>
                                                    {checkout ? 'Total' : 'Estimated Total'}
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700} color="primary.main">
                                                    {formatPrice(checkout ? subtotal + SHIPPING + TAXES : subtotal)}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        {!checkout ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    component={Link}
                                                    to="/checkout"
                                                    sx={{
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                        textTransform: 'none',
                                                        boxShadow: 'none',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    Proceed to Checkout
                                                </Button>
                                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                    <motion.div whileHover={{ scale: 1.05 }}>
                                                        <Chip
                                                            component={Link}
                                                            to="/"
                                                            label="Continue Shopping"
                                                            variant="outlined"
                                                            sx={{
                                                                cursor: "pointer",
                                                                borderRadius: 2,
                                                                px: 2,
                                                                '&:hover': {
                                                                    borderColor: 'primary.main',
                                                                    color: 'primary.main'
                                                                }
                                                            }}
                                                        />
                                                    </motion.div>
                                                </Box>
                                            </>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                Shipping and tax calculated at checkout
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 8,
                                textAlign: 'center'
                            }}>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                    Your cart is empty
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                    Start adding some amazing products to your cart!
                                </Typography>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '1rem'
                                    }}
                                >
                                    Continue Shopping
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};