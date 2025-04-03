import { Box, Card, CardContent, CardMedia, Checkbox, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  const discountPercentage = Math.round((discountAmount/price)*100);

  return (
    <Card 
      sx={{ 
        width: '100%', 
        maxWidth: 345,
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: '#ffffff',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      {/* Discount Ribbon */}
      {discountAmount > 0 && (
        <Box sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          bgcolor: 'error.main',
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {discountPercentage}% OFF
        </Box>
      )}

      {/* Product Image */}
      <Box sx={{ 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f9f9f9'
      }}>
        <CardMedia
          component="img"
          height="250"
          image={imgError ? fallbackImage : displayImage}
          alt={title}
          onError={handleImageError}
          onClick={onClick}
          sx={{
            objectFit: 'contain',
            p: 3,
            cursor: 'pointer',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          {/* Title and Brand */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  lineHeight: 1.3,
                  color: '#1a1a1a',
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
                  color: '#666',
                  fontWeight: 500,
                  fontSize: '0.85rem'
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
                  icon={<FavoriteBorder sx={{ color: '#ccc' }} />}
                  checkedIcon={<Favorite sx={{ 
                    color: '#ff3d47',
                    filter: 'drop-shadow(0 2px 4px rgba(255, 61, 71, 0.3))'
                  }} />}
                  sx={{
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 61, 71, 0.08)'
                    }
                  }}
                />
              </motion.div>
            )}
          </Stack>

          {/* Price Section */}
          <Box sx={{ mt: 1 }}>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography 
                variant="h6"
                sx={{ 
                  fontWeight: 700,
                  color: '#1a1a1a',
                  fontSize: '1.25rem'
                }}
              >
                {formatPrice(discountedPrice)}
              </Typography>
              
              {discountAmount > 0 && (
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    color: '#999',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(price)}
                </Typography>
              )}
            </Stack>
            
            {discountAmount > 0 && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mt: 0.5
              }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#666',
                  }}
                >
                  You save {formatPrice(discountAmount)}
                </Typography>
                <Box sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '4px',
                  bgcolor: 'error.light',
                  display: 'inline-flex',
                }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'error.contrastText',
                    }}
                  >
                    {discountPercentage}% OFF
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
            {!isWishlistCard && !isProductAlreadyInCart && !isAdminCard && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleAddToCart(e)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: '#f5f5f5',
                    color: '#333',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 10V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V10M4 9H20L19.1651 19.1811C19.0719 20.2112 18.208 21 17.1739 21H6.82607C5.79203 21 4.92809 20.2112 4.8349 19.1811L4 9Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add to Cart
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleBuyNow(e)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #3f51b5, #2196f3)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 10L12 13L21 4M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C14.0301 4 15.908 4.77857 17.368 6M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Buy Now
                </motion.button>
              </>
            )}

            {isProductAlreadyInCart && (
              <Typography 
                sx={{ 
                  color: 'success.main',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  width: '100%',
                  py: 1,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)'
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
              p: 0.75,
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 61, 71, 0.08)',
              textAlign: 'center'
            }}>
              <Typography 
                variant="caption"
                sx={{ 
                  color: '#ff3d47',
                  fontWeight: 600,
                  fontSize: '0.75rem'
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