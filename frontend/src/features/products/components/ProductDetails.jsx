import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectSelectedProduct,
} from '../ProductSlice';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
} from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import {
  fetchReviewsByProductIdAsync,
  resetReviewFetchStatus,
  selectReviewFetchStatus,
  selectReviews,
} from '../../review/ReviewSlice';
import { Reviews } from '../../review/components/Reviews';
import { toast } from 'react-toastify';
import { MotionConfig, motion } from 'framer-motion';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import Favorite from '@mui/icons-material/Favorite';
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from '../../wishlist/WishlistSlice';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';
import Lottie from 'lottie-react';
import { loadingAnimation } from '../../../assets';
import { formatPrice } from '../../../utils/formatPrice';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['#020202', '#F6F6F6', '#B82222', '#BEA9A9', '#E2BB8D'];
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const ProductDetails = () => {
  const { id } = useParams();
  const product = useSelector(selectSelectedProduct);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart?.items) ?? [];
  const wishlistItems = useSelector(state => state.wishlist?.items) ?? [];
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
  const reviews = useSelector(selectReviews);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const theme = useTheme();
  const is1420 = useMediaQuery(theme.breakpoints.down(1420));
  const is990 = useMediaQuery(theme.breakpoints.down(990));
  const is840 = useMediaQuery(theme.breakpoints.down(840));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is387 = useMediaQuery(theme.breakpoints.down(387));
  const is340 = useMediaQuery(theme.breakpoints.down(340));
  const [customization, setCustomization] = useState('');

  const isProductAlreadyInCart = useMemo(() => {
    return product && cartItems?.some(item => 
      item?.product?._id === product?._id
    ) || false;
  }, [product, cartItems]);

  const isProductAlreadyinWishlist = useMemo(() => {
    return product && wishlistItems?.some(item => 
      item?._id === product?._id
    ) || false;
  }, [product, wishlistItems]);

  const productFetchStatus = useSelector(selectProductFetchStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);

  const totalReviewRating = reviews?.reduce((acc, review) => 
    acc + (Number(review?.rating) || 0), 0) || 0;
  const totalReviews = reviews?.length || 0;
  const averageRating = useMemo(() => {
    return totalReviews > 0 ? 
      Math.ceil(totalReviewRating / totalReviews) : 
      0;
  }, [totalReviews, totalReviewRating]);

  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
      dispatch(fetchReviewsByProductIdAsync(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (cartItemAddStatus === 'fulfilled') {
      toast.success('Product added to cart');
    } else if (cartItemAddStatus === 'rejected') {
      toast.error('Error adding product to cart, please try again later');
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistItemAddStatus === 'fulfilled') {
      toast.success('Product added to wishlist');
    } else if (wishlistItemAddStatus === 'rejected') {
      toast.error('Error adding product to wishlist, please try again later');
    }
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === 'fulfilled') {
      toast.success('Product removed from wishlist');
    } else if (wishlistItemDeleteStatus === 'rejected') {
      toast.error('Error removing product from wishlist, please try again later');
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (productFetchStatus === 'rejected') {
      toast.error('Error fetching product details, please try again later');
    }
  }, [productFetchStatus]);

  useEffect(() => {
    if (reviewFetchStatus === 'rejected') {
      toast.error('Error fetching product reviews, please try again later');
    }
  }, [reviewFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductFetchStatus());
      dispatch(resetReviewFetchStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, []);

  const handleAddToCart = () => {
    if (!loggedInUser?._id) {
      toast.error('Please log in to add items to the cart');
      navigate('/login');
      return;
    }
    
    if (!product?._id) {
      toast.error('Product not found');
      return;
    }
  
    const item = { 
      user: loggedInUser._id, 
      product: id, 
      quantity,
      customization: product.customizable ? customization : null, // Include customization if enabled
    };
    dispatch(addToCartAsync(item));
    setQuantity(1);
  };

  const handleDecreaseQty = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (quantity < 20 && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddRemoveFromWishlist = (e) => {
    if (!loggedInUser?._id) {
      toast.error('Please log in to manage your wishlist');
      navigate('/login');
      return;
    }
  
    if (!product?._id) {
      toast.error('Product not found');
      return;
    }
  
    if (e.target.checked) {
      const data = { user: loggedInUser._id, product: id };
      dispatch(createWishlistItemAsync(data));
    } else {
      const wishlistItem = wishlistItems?.find(item => item?.product?._id === id);
      if (wishlistItem?._id) {
        dispatch(deleteWishlistItemByIdAsync(wishlistItem._id));
      }
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = product?.images?.length || 0;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  if (productFetchStatus === 'pending') {
    return (
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (!product) {
    return (
      <Stack height="50vh" justifyContent="center" alignItems="center">
        <Typography variant="h5">Product not found</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Stack>
    );
  }
  return (
    <Box sx={{
      bgcolor: '#f9f9f9',
      minHeight: '100vh',
      py: 6,
      px: { xs: 2, sm: 4, md: 6 }
    }}>
      {/* Loading State */}
      {productFetchStatus === 'pending' && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh'
        }}>
          <CircularProgress size={80} thickness={4} sx={{ color: 'primary.main' }} />
        </Box>
      )}

      {/* Product Content */}
      {product && (
        <Box sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          bgcolor: 'white',
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <Grid container>
            {/* Image Gallery */}
            <Grid item xs={12} md={6} sx={{
              p: 4,
              borderRight: { md: '1px solid #eee' }
            }}>
              <Box sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#f5f5f5',
                aspectRatio: '1/1',
                mb: 3
              }}>
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    mixBlendMode: 'multiply'
                  }}
                />
              </Box>

              {/* Image Thumbnails */}
              <Stack direction="row" spacing={2} sx={{
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'primary.main',
                  borderRadius: 3
                }
              }}>
                {product.images.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: `2px solid ${selectedImageIndex === index ? theme.palette.primary.main : '#eee'}`,
                      borderRadius: 8,
                      overflow: 'hidden',
                      width: 80,
                      height: 80
                    }}
                  >
                    <img
                      src={img}
                      alt={`Variant ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </motion.div>
                ))}
              </Stack>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6} sx={{ p: 4 }}>
              {/* Title & Rating */}
              <Typography variant="h3" sx={{
                fontWeight: 700,
                mb: 1,
                color: 'text.primary',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                {product.title}
              </Typography>
              
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <Rating 
                  value={averageRating} 
                  precision={0.5} 
                  readOnly 
                  sx={{ color: '#ffb400' }} 
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </Typography>
                <Chip 
                  label={product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'} 
                  sx={{ 
                    bgcolor: product.stockQuantity > 0 ? '#e8f5e9' : '#ffebee',
                    color: product.stockQuantity > 0 ? '#2e7d32' : '#c62828',
                    fontWeight: 500
                  }} 
                />
              </Stack>

              {/* Pricing */}
              <Box sx={{ mb: 4 }}>
                {product.discountAmount > 0 && (
                  <Typography variant="h5" sx={{ 
                    color: 'text.secondary',
                    textDecoration: 'line-through',
                    mb: 0.5
                  }}>
                    {formatPrice(product.price)}
                  </Typography>
                )}
                <Stack direction="row" alignItems="baseline" spacing={2}>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800,
                    color: 'primary.main',
                    fontSize: { xs: '2.5rem', md: '3rem' }
                  }}>
                    {formatPrice(product.price - product.discountAmount)}
                  </Typography>
                  {product.discountAmount > 0 && (
                    <Chip 
                      label={`Save ${formatPrice(product.discountAmount)}`} 
                      sx={{ 
                        bgcolor: '#fff3e0', 
                        color: '#ef6c00',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }} 
                    />
                  )}
                </Stack>
              </Box>

              {/* Description */}
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                lineHeight: 1.6,
                mb: 4
              }}>
                {product.description}
              </Typography>

              {/* Customization */}
              {product.customizable && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Customization Details"
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  sx={{ mb: 4 }}
                />
              )}

              {/* Color Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  color: 'text.primary'
                }}>
                  Select Color
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  {COLORS.map((color, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedColorIndex(index)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: `3px solid ${selectedColorIndex === index ? theme.palette.primary.main : 'transparent'}`,
                        padding: 2,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Box sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        bgcolor: color,
                        border: color === '#F6F6F6' ? '1px solid #ddd' : 'none',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} />
                    </motion.div>
                  ))}
                </Stack>
              </Box>

              {/* Size Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  color: 'text.primary'
                }}>
                  Select Size
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {SIZES.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSizeSelect(size)}
                      style={{
                        minWidth: 48,
                        height: 48,
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                        background: selectedSize === size ? theme.palette.primary.main : '#f5f5f5',
                        color: selectedSize === size ? 'white' : 'inherit',
                        fontWeight: 600,
                        margin: 4,
                        fontSize: '1rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </Stack>
              </Box>

              {/* Quantity & Actions */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      onClick={handleDecreaseQty}
                      sx={{ 
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        '&:hover': { 
                          bgcolor: 'primary.light',
                          color: 'primary.main'
                        }
                      }}
                    >
                      <Remove />
                    </IconButton>
                    <Typography variant="h6" sx={{ 
                      minWidth: 40, 
                      textAlign: 'center',
                      fontWeight: 600
                    }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={handleIncreaseQty}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { 
                          bgcolor: 'primary.dark',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={isProductAlreadyInCart}
                    sx={{
                      height: 48,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: 16,
                      fontWeight: 600,
                      bgcolor: isProductAlreadyInCart ? '#e0e0e0' : 'primary.main',
                      color: isProductAlreadyInCart ? 'text.secondary' : 'white',
                      '&:hover': {
                        bgcolor: isProductAlreadyInCart ? '#e0e0e0' : 'primary.dark',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isProductAlreadyInCart ? 'Added to Cart' : 'Add to Cart'}
                  </Button>

                  <IconButton
                    onClick={() => handleAddRemoveFromWishlist({ target: { checked: !isProductAlreadyinWishlist } })}
                    sx={{
                      border: '1px solid #ddd',
                      borderRadius: 2,
                      color: isProductAlreadyinWishlist ? '#e53935' : 'inherit',
                      '&:hover': {
                        bgcolor: isProductAlreadyinWishlist ? '#ffebee' : '#f5f5f5',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isProductAlreadyinWishlist ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </Stack>
              </Box>

              {/* Product Features */}
              <Box sx={{ 
                bgcolor: '#f8f9fa',
                borderRadius: 3,
                p: 3,
                mb: 4
              }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LocalShippingOutlinedIcon sx={{ 
                      color: 'primary.main', 
                      fontSize: 32 
                    }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Free Shipping
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Arrives in 3-5 business days
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CachedOutlinedIcon sx={{ 
                      color: 'primary.main', 
                      fontSize: 32 
                    }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Easy Returns
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        07-day free returns policy
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {/* Reviews Section */}
          <Box sx={{ 
            bgcolor: '#f9f9f9',
            p: 4,
            borderTop: '1px solid #eee'
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              mb: 4,
              color: 'text.primary'
            }}>
              Customer Reviews
            </Typography>
            <Reviews productId={id} averageRating={averageRating} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetails;