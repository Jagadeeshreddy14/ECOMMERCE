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
  Checkbox,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  Button,
  CircularProgress,
} from '@mui/material';
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
import { useTheme } from '@mui/material';
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
      quantity 
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
    <>
      {!(productFetchStatus === 'rejected' && reviewFetchStatus === 'rejected') && (
        <Stack
          sx={{ justifyContent: 'center', alignItems: 'center', mb: '2rem', rowGap: '2rem' }}
        >
          {(productFetchStatus || reviewFetchStatus) === 'pending' ? (
            <Stack
              width={is500 ? '35vh' : '25rem'}
              height={'calc(100vh - 4rem)'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Lottie animationData={loadingAnimation} />
            </Stack>
          ) : !product ? (
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
          ) : (
            <Stack
              sx={{ justifyContent: 'center', alignItems: 'center', mb: '2rem', rowGap: '2rem' }}
            >
              <Stack
                width={is480 ? 'auto' : is1420 ? 'auto' : '88rem'}
                p={is480 ? 2 : 0}
                height={is840 ? 'auto' : '50rem'}
                rowGap={5}
                mt={is840 ? 0 : 5}
                justifyContent={'center'}
                mb={5}
                flexDirection={is840 ? 'column' : 'row'}
                columnGap={is990 ? '2rem' : '5rem'}
              >
                {/* Left Stack (Images) */}
                <Stack
                  sx={{ flexDirection: 'row', columnGap: '2.5rem', alignSelf: 'flex-start', height: '100%' }}
                >
                  {/* Image Selection */}
                  {!is1420 && (
                    <Stack sx={{ display: 'flex', rowGap: '1.5rem', height: '100%', overflowY: 'scroll' }}>
                      {product &&
                        product.images.map((image, index) => (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 1 }}
                            style={{ width: '200px', cursor: 'pointer' }}
                            onClick={() => setSelectedImageIndex(index)}
                            key={index}
                          >
                            <img
                              style={{ width: '100%', objectFit: 'contain' }}
                              src={image}
                              alt={`${product.title} image`}
                            />
                          </motion.div>
                        ))}
                    </Stack>
                  )}

                  {/* Selected Image */}
                  <Stack mt={is480 ? '0rem' : '5rem'}>
                    {is1420 ? (
                      <Stack width={is480 ? '100%' : is990 ? '400px' : '500px'}>
                        <AutoPlaySwipeableViews
                          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                          index={activeStep}
                          onChangeIndex={handleStepChange}
                          enableMouseEvents
                        >
                          {product?.images.map((image, index) => (
                            <div key={index} style={{ width: '100%', height: '100%' }}>
                              {Math.abs(activeStep - index) <= 2 ? (
                                <Box
                                  component="img"
                                  sx={{ width: '100%', objectFit: 'contain', overflow: 'hidden', aspectRatio: 1 / 1 }}
                                  src={image}
                                  alt={product?.title}
                                />
                              ) : null}
                            </div>
                          ))}
                        </AutoPlaySwipeableViews>

                        <MobileStepper
                          steps={maxSteps}
                          position="static"
                          activeStep={activeStep}
                          nextButton={
                            <Button
                              size="small"
                              onClick={handleNext}
                              disabled={activeStep === maxSteps - 1}
                            >
                              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                              Next
                            </Button>
                          }
                          backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                              Back
                            </Button>
                          }
                        />
                      </Stack>
                    ) : (
                      <div style={{ width: '100%' }}>
                        <img
                          style={{ width: '100%', objectFit: 'contain', aspectRatio: 1 / 1 }}
                          src={product?.images?.[selectedImageIndex] || ''}
                          alt={product?.title || 'Product image'}
                        />
                      </div>
                    )}
                  </Stack>
                </Stack>

                {/* Right Stack - About Product */}
                <Stack rowGap={'1.5rem'} width={is480 ? '100%' : '25rem'}>
                  {/* Title, Rating, Price */}
                  <Stack rowGap={'.5rem'}>
                    <Typography variant="h4" fontWeight={600}>
                      {product?.title}
                    </Typography>
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        columnGap: is340 ? '.5rem' : '1rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        rowGap: '1rem',
                      }}
                    >
                      <Rating 
                        value={Number(averageRating) || 0} 
                        readOnly 
                        precision={0.5}
                      />
                      <Typography>
                        ({totalReviews === 0 ? 'No reviews' : totalReviews === 1 ? `${totalReviews} Review` : `${totalReviews} Reviews`})
                      </Typography>
                      <Typography
                        color={
                          product?.stockQuantity <= 10
                            ? 'error'
                            : product?.stockQuantity <= 20
                            ? 'orange'
                            : 'green'
                        }
                      >
                        {product?.stockQuantity <= 10
                          ? `Only ${product?.stockQuantity} left`
                          : product?.stockQuantity <= 20
                          ? 'Only few left'
                          : 'In Stock'}
                      </Typography>
                    </Stack>
                    <Typography>{formatPrice(product?.price || 0)}</Typography>
                  </Stack>

                  {/* Description */}
                  <Stack rowGap={'.8rem'}>
                    <Typography>{product?.description}</Typography>
                    <hr />
                  </Stack>

                  {/* Color, Size, and Add-to-Cart */}
                  {!loggedInUser?.isAdmin && (
                    <Stack sx={{ rowGap: '1.3rem' }} width={'fit-content'}>
                      {/* Colors */}
                      <Stack flexDirection={'row'} alignItems={'center'} columnGap={is387 ? '5px' : '1rem'} width={'fit-content'}>
                        <Typography>Colors: </Typography>
                        <Stack flexDirection={'row'} columnGap={is387 ? '.5rem' : '.2rem'}>
                          {COLORS.map((color, index) => (
                            <div
                              style={{
                                backgroundColor: 'white',
                                border: selectedColorIndex === index ? `1px solid ${theme.palette.primary.dark}` : '',
                                width: is340 ? '40px' : '50px',
                                height: is340 ? '40px' : '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '100%',
                              }}
                              onClick={() => setSelectedColorIndex(index)}
                              key={index}
                            >
                              <div
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  border: color === '#F6F6F6' ? '1px solid grayText' : '',
                                  backgroundColor: color,
                                  borderRadius: '100%',
                                }}
                              ></div>
                            </div>
                          ))}
                        </Stack>
                      </Stack>

                      {/* Size */}
                      <Stack flexDirection={'row'} alignItems={'center'} columnGap={is387 ? '5px' : '1rem'} width={'fit-content'}>
                        <Typography>Size: </Typography>
                        <Stack flexDirection={'row'} columnGap={is387 ? '.5rem' : '1rem'}>
                          {SIZES.map((size) => (
                            <motion.div
                              onClick={() => handleSizeSelect(size)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 1 }}
                              style={{
                                border: selectedSize === size ? '' : '1px solid grayText',
                                borderRadius: '8px',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '1.2rem',
                                backgroundColor: selectedSize === size ? '#DB4444' : 'whitesmoke',
                                color: selectedSize === size ? 'white' : '',
                              }}
                              key={size}
                            >
                              <p>{size}</p>
                            </motion.div>
                          ))}
                        </Stack>
                      </Stack>

                      {/* Quantity, Add to Cart, and Wishlist */}
                      <Stack flexDirection={'row'} columnGap={is387 ? '.3rem' : '1.5rem'} width={'100%'}>
                        {/* Quantity */}
                        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                          <MotionConfig whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }}>
                            <motion.button
                              onClick={handleDecreaseQty}
                              style={{
                                padding: '10px 15px',
                                fontSize: '1.05rem',
                                backgroundColor: '',
                                color: 'black',
                                outline: 'none',
                                border: '1px solid black',
                                borderRadius: '8px',
                              }}
                            >
                              -
                            </motion.button>
                            <p style={{ margin: '0 1rem', fontSize: '1.1rem', fontWeight: '400' }}>{quantity}</p>
                            <motion.button
                              onClick={handleIncreaseQty}
                              style={{
                                padding: '10px 15px',
                                fontSize: '1.05rem',
                                backgroundColor: 'black',
                                color: 'white',
                                outline: 'none',
                                border: 'none',
                                borderRadius: '8px',
                              }}
                            >
                              +
                            </motion.button>
                          </MotionConfig>
                        </Stack>

                        {/* Add to Cart */}
                        {isProductAlreadyInCart ? (
                          <button
                            style={{
                              padding: '10px 15px',
                              fontSize: '1.05rem',
                              backgroundColor: 'black',
                              color: 'white',
                              outline: 'none',
                              border: 'none',
                              borderRadius: '8px',
                            }}
                            onClick={() => navigate('/cart')}
                          >
                            In Cart
                          </button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1 }}
                            onClick={handleAddToCart}
                            style={{
                              padding: '10px 15px',
                              fontSize: '1.05rem',
                              backgroundColor: 'black',
                              color: 'white',
                              outline: 'none',
                              border: 'none',
                              borderRadius: '8px',
                            }}
                          >
                            Add To Cart
                          </motion.button>
                        )}

                        {/* Wishlist */}
                        <motion.div
                          style={{
                            border: '1px solid grayText',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Checkbox
                            checked={isProductAlreadyinWishlist}
                            onChange={(e) => handleAddRemoveFromWishlist(e)}
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite sx={{ color: 'red' }} />}
                          />
                        </motion.div>
                      </Stack>
                    </Stack>
                  )}

                  {/* Product Perks */}
                  <Stack mt={3} sx={{ justifyContent: 'center', alignItems: 'center', border: '1px grayText solid', borderRadius: '7px' }}>
                    <Stack p={2} flexDirection={'row'} alignItems={'center'} columnGap={'1rem'} width={'100%'} justifyContent={'flex-start'}>
                      <Box>
                        <LocalShippingOutlinedIcon />
                        <Typography>Free Delivery</Typography>
                      </Box>
                      <Stack>
                        <Typography>Enter your postal for delivery availability</Typography>
                      </Stack>
                    </Stack>
                    <hr style={{ width: '100%' }} />
                    <Stack p={2} flexDirection={'row'} alignItems={'center'} width={'100%'} columnGap={'1rem'} justifyContent={'flex-start'}>
                      <Box>
                        <CachedOutlinedIcon />
                        <Typography>Return Delivery</Typography>
                      </Box>
                      <Stack>
                        <Typography>Free 30 Days Delivery Returns</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              {/* Reviews */}
              <Stack width={is1420 ? 'auto' : '88rem'} p={is480 ? 2 : 0}>
                <Reviews productId={id} averageRating={averageRating} />
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
};

export default ProductDetails;