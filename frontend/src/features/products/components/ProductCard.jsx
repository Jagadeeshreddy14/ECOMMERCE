import { FormHelperText, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion';
import { formatPrice } from '../../../utils/formatPrice';
import { Card, CardContent, CardMedia } from '@mui/material';

export const ProductCard = ({
  id,
  title,
  price,
  thumbnail,
  images,
  brand,
  stockQuantity,
  handleAddRemoveFromWishlist,
  isWishlistCard = false,
  isAdminCard = false,
  onClick
}) => {
  // Move useState to the top, before any conditionals
  const [imgError, setImgError] = useState(false);
  
  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems) || [];
  const dispatch = useDispatch();

  const theme = useTheme();
  const is1410 = useMediaQuery(theme.breakpoints.down(1410));
  const is932 = useMediaQuery(theme.breakpoints.down(932));
  const is752 = useMediaQuery(theme.breakpoints.down(752));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is608 = useMediaQuery(theme.breakpoints.down(608));
  const is488 = useMediaQuery(theme.breakpoints.down(488));
  const is408 = useMediaQuery(theme.breakpoints.down(408));

  // Validate the ID prop after hooks
  if (!id) {
    console.error('Product ID is missing');
    return null;
  }

  // Check if the product is already in the wishlist
  const isProductAlreadyInWishlist = wishlistItems.some(
    (item) => item?.product?._id === id
  );

  // Check if the product is already in the cart
  const isProductAlreadyInCart = cartItems.some(
    (item) => item?.product?._id === id
  );

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const data = { user: loggedInUser?._id, product: id };
    dispatch(addToCartAsync(data));
  };

  // Update the handleBuyNow function
  const handleBuyNow = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    // Navigate to checkout with product details
    navigate('/checkout', { 
      state: { 
        buyNowItem: {
          product: {
            _id: id,
            title,
            price,
            thumbnail,
            brand
          },
          quantity: 1
        }
      }
    });
  };

  // Fallback image URL
  const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image";
  
  // Function to handle image load errors
  const handleImageError = () => {
    setImgError(true);
  };

  // Get primary image - try thumbnail first, then first image from array
  const displayImage = thumbnail || (images && images[0]) || fallbackImage;

  return (
    <Card 
      sx={{ 
        width: '100%', 
        maxWidth: 345,
        borderRadius: '16px',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        backgroundColor: '#ffffff',  // Base background color
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          backgroundColor: '#fafafa',  // Slight color change on hover
        }
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={imgError ? fallbackImage : displayImage}
        alt={title}
        onError={handleImageError}
        onClick={onClick}
        sx={{
          objectFit: 'contain',
          p: 2,
          bgcolor: '#f8f9fa',  // Light gray background for image area
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        }}
      />
      <CardContent 
        sx={{ 
          p: 2,
          backgroundColor: 'transparent',  // Transparent to show card background
        }}
      >
        <Stack spacing={2}>
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{ minHeight: '60px' }}
          >
            <Stack spacing={0.5}>
              <Typography 
                variant="h6" 
                sx={{
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {title}
              </Typography>
              <Typography 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.9rem',
                  fontWeight: 400 
                }}
              >
                {brand}
              </Typography>
            </Stack>
            {!isAdminCard && (
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={isProductAlreadyInWishlist}
                  onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                  icon={<FavoriteBorder sx={{ color: '#666' }} />}
                  checkedIcon={<Favorite sx={{ color: '#ff3d47' }} />}
                />
              </motion.div>
            )}
          </Stack>

          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            {!isWishlistCard && !isProductAlreadyInCart && !isAdminCard && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleAddToCart(e)}
                style={{
                  padding: '8px 15px',
                  borderRadius: '25px',
                  outline: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.3s ease',
                  flex: 1
                }}
              >
                Add To Cart
              </motion.button>
            )}
            
            <Typography 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.2rem',
                color: 'primary.main',
                textAlign: 'center',
                flex: 1
              }}
            >
              {formatPrice(parseFloat(price) || 0)}
            </Typography>

            {!isWishlistCard && !isProductAlreadyInCart && !isAdminCard && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleBuyNow(e)}
                style={{
                  padding: '8px 15px',
                  borderRadius: '25px',
                  outline: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#ff3d47',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.3s ease',
                  flex: 1
                }}
              >
                Buy Now
              </motion.button>
            )}

            {isProductAlreadyInCart && (
              <Typography 
                sx={{ 
                  color: 'success.main',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textAlign: 'right',
                  flex: 1
                }}
              >
                Added to cart
              </Typography>
            )}
          </Stack>

          {stockQuantity <= 20 && (
            <FormHelperText 
              sx={{ 
                fontSize: '0.85rem',
                color: '#ff3d47',
                mt: 1 
              }}
            >
              {stockQuantity === 1 ? 'Only 1 item left!' : `Only ${stockQuantity} items left!`}
            </FormHelperText>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
