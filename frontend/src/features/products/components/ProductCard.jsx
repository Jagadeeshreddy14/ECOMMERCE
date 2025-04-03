import { Box, Card, CardContent, CardMedia, Checkbox, Stack, Typography, FormHelperText, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion';
import { formatPrice } from '../../../utils/formatPrice';

export default function ProductCard({
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
  onClick,
  discountAmount = 0
}) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems) || [];
  const dispatch = useDispatch();
  const theme = useTheme();

  // Media queries
  const is1410 = useMediaQuery(theme.breakpoints.down(1410));
  const is932 = useMediaQuery(theme.breakpoints.down(932));
  const is752 = useMediaQuery(theme.breakpoints.down(752));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is608 = useMediaQuery(theme.breakpoints.down(608));
  const is488 = useMediaQuery(theme.breakpoints.down(488));
  const is408 = useMediaQuery(theme.breakpoints.down(408));

  if (!id) {
    console.error('Product ID is missing');
    return null;
  }

  const isProductAlreadyInWishlist = wishlistItems.some(
    (item) => item?.product?._id === id
  );

  const isProductAlreadyInCart = cartItems.some(
    (item) => item?.product?._id === id
  );

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const data = { user: loggedInUser?._id, product: id };
    dispatch(addToCartAsync(data));
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
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

  const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image";
  const handleImageError = () => setImgError(true);
  const displayImage = thumbnail || (images && images[0]) || fallbackImage;
  const discountedPrice = price - discountAmount;

  return (
    <Card 
      sx={{ 
        width: '100%', 
        maxWidth: 345,
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
        }
      }}
    >
      {/* Product Image with Gradient Overlay */}
      <Box sx={{ position: 'relative' }}>
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
            bgcolor: '#f5f7fa',
            cursor: 'pointer',
            transition: 'transform 0.4s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        />
        {discountAmount > 0 && (
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'error.main',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1
          }}>
            {Math.round((discountAmount/price)*100)}% OFF
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Title and Wishlist Button */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  lineHeight: 1.3,
                  color: '#2d3748',
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
                variant="body2"
                sx={{ 
                  color: '#718096',
                  fontWeight: 500,
                  fontSize: '0.9rem'
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
                  icon={<FavoriteBorder sx={{ color: '#a0aec0' }} />}
                  checkedIcon={<Favorite sx={{ 
                    color: '#ff3d47',
                    filter: 'drop-shadow(0 2px 4px rgba(255, 61, 71, 0.3))'
                  }} />}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 61, 71, 0.08)'
                    }
                  }}
                />
              </motion.div>
            )}
          </Stack>

          {/* Price Section */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {discountAmount > 0 && (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: '#a0aec0',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(price)}
              </Typography>
            )}
            <Typography 
              variant="h5"
              sx={{ 
                fontWeight: 700,
                color: '#4a5568',
                background: discountAmount > 0 ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'none',
                WebkitBackgroundClip: discountAmount > 0 ? 'text' : 'none',
                WebkitTextFillColor: discountAmount > 0 ? 'transparent' : 'none',
              }}
            >
              {formatPrice(discountedPrice)}
            </Typography>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            {!isWishlistCard && !isProductAlreadyInCart && !isAdminCard && (
              <>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleAddToCart(e)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #2d3748, #1a202c)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add To Cart
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(255,61,71,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleBuyNow(e)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #ff3d47, #e53545)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(255,61,71,0.2)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Buy Now
                </motion.button>
              </>
            )}

            {isProductAlreadyInCart && (
              <Typography 
                sx={{ 
                  color: 'success.main',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  width: '100%',
                  py: 1.5,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(72, 187, 120, 0.1)'
                }}
              >
                ✓ Added to cart
              </Typography>
            )}
          </Stack>

          {/* Stock Quantity Indicator */}
          {stockQuantity <= 20 && (
            <Box sx={{
              mt: 1,
              p: 1,
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 61, 71, 0.08)',
              textAlign: 'center'
            }}>
              <Typography 
                variant="caption"
                sx={{ 
                  color: '#ff3d47',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                {stockQuantity === 1 ? 'Only 1 item left!' : `Only ${stockQuantity} items left!`}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}