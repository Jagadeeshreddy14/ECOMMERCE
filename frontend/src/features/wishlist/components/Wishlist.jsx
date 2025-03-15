import { Box, Button, Grid, IconButton, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistFetchStatus, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, resetWishlistItemUpdateStatus, selectWishlistFetchStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItemUpdateStatus, selectWishlistItems, updateWishlistItemByIdAsync } from '../WishlistSlice';
import { ProductCard } from '../../products/components/ProductCard';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { emptyWishlistAnimation, loadingAnimation } from '../../../assets';
import Lottie from 'lottie-react'; 
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useForm } from 'react-hook-form';
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion';

export const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
  const wishlistItemUpdateStatus = useSelector(selectWishlistItemUpdateStatus);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems) || [];
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const wishlistFetchStatus = useSelector(selectWishlistFetchStatus);

  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: productId };
      dispatch(createWishlistItemAsync(data));
    } else {
      const index = wishlistItems.findIndex((item) => item?.product?._id === productId);
      if (index !== -1) {
        dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
    if (wishlistItemUpdateStatus === 'fulfilled') {
      toast.success('Wishlist item updated');
    } else if (wishlistItemUpdateStatus === 'rejected') {
      toast.error('Error updating wishlist item');
    }
    setEditIndex(-1);
    setEditValue('');
  }, [wishlistItemUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetWishlistFetchStatus());
      dispatch(resetCartItemAddStatus());
      dispatch(resetWishlistItemUpdateStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
    };
  }, []);

  const handleNoteUpdate = (wishlistItemId) => {
    const update = { _id: wishlistItemId, note: editValue };
    dispatch(updateWishlistItemByIdAsync(update));
  };

  const handleEdit = (index) => {
    setEditValue(wishlistItems[index]?.note || '');
    setEditIndex(index);
  };

  return (
    <Stack justifyContent={'flex-start'} mt={is480 ? 3 : 5} mb={'14rem'} alignItems={'center'}>
      {wishlistFetchStatus === 'pending' ? (
        <Stack width={is480 ? 'auto' : '25rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} alignItems={'center'}>
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <Stack width={'70rem'} rowGap={4}>
          <Stack alignSelf={'flex-start'} flexDirection={'row'} columnGap={1} justifyContent={'center'} alignItems={'center'}>
            <motion.div whileHover={{ x: -5 }}>
              <IconButton component={Link} to={'/'}>
                <ArrowBackIcon fontSize={is480 ? 'medium' : 'large'} />
              </IconButton>
            </motion.div>
            <Typography variant='h4' fontWeight={500}>Your wishlist</Typography>
          </Stack>

          {wishlistItems.length === 0 ? (
            <Stack minHeight={'60vh'} width={'40rem'} justifySelf={'center'} alignSelf={'center'} justifyContent={'center'} alignItems={'center'}>
              <Lottie animationData={emptyWishlistAnimation} />
              <Typography variant='h6' fontWeight={300}>You have no items in your wishlist</Typography>
            </Stack>
          ) : (
            <Grid container gap={1} justifyContent={'center'}>
              {wishlistItems.filter(item => item?.product).map((item, index) => (
                <Stack key={item._id} component={Paper} elevation={1}>
                  <ProductCard 
                    brand={item.product?.brand?.name || 'Unknown'} 
                    id={item.product?._id} 
                    price={item.product?.price} 
                    stockQuantity={item.product?.stockQuantity} 
                    thumbnail={item.product?.thumbnail} 
                    title={item.product?.title} 
                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist} 
                    isWishlistCard={true} 
                  />
                </Stack>
              ))}
            </Grid>
          )}
        </Stack>
      )}
    </Stack>
  );
};
