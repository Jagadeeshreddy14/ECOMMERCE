import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import SearchIcon from '@mui/icons-material/Search';


export const Navbar = ({ isProductList = false }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [placeholder, setPlaceholder] = React.useState(''); // State for animated placeholder
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const wishlistItems = useSelector(selectWishlistItems);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  

  // List of example product names for the placeholder animation
  const exampleProducts = [
    'Search for Handmade products...',
    'Search for Handmade candles...',
    'Search for wooden crafts...',
    'Search for artisanal jewelry...',
  ];

  // Index to track the current example product
  const [currentProductIndex, setCurrentProductIndex] = React.useState(0);

  // Effect to cycle through example product names
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % exampleProducts.length);
    }, 3000); // Change placeholder every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Effect to update the placeholder text with a typewriter effect
  React.useEffect(() => {
    let currentText = '';
    let currentCharIndex = 0;
    const targetText = exampleProducts[currentProductIndex];
    const typewriterInterval = setInterval(() => {
      if (currentCharIndex < targetText.length) {
        currentText += targetText[currentCharIndex];
        setPlaceholder(currentText);
        currentCharIndex++;
      } else {
        clearInterval(typewriterInterval);
      }
    }, 50); // Speed of typing effect
    return () => clearInterval(typewriterInterval); // Cleanup on unmount or change
  }, [currentProductIndex]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFilters = () => {
    dispatch(toggleFilters());
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const settings = [
    { name: 'Home', to: '/' },
    { name: 'Profile', to: loggedInUser?.isAdmin ? '/admin/profile' : '/profile' },
    { name: loggedInUser?.isAdmin ? 'Orders' : 'My orders', to: loggedInUser?.isAdmin ? '/admin/orders' : '/orders' },
    { name: 'Logout', to: '/logout' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#ffffff',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        color: 'text.primary',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', // Subtle shadow on hover
        },
      }}
    >
      <Toolbar
        sx={{
          p: 1,
          height: '4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontWeight: 700,
            letterSpacing: '.1rem',
            color: 'primary.main',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          <img src="https://res.cloudinary.com/docnp0ctp/image/upload/v1742925244/Apex-store/oqe1wqywljqopu2vzemh.png" alt="Apex Store" style={{ height: '2rem' }} />
          pex store
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder={placeholder || 'Search products...'}
          value={searchQuery}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: '300px',
            borderRadius: '25px',
            backgroundColor: 'background.paper',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
                borderRadius:'25px' 
              },
              '&:hover fieldset': {
                borderColor: 'primary.main', // Show border on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main', // Show border when focused
              },
            },
            '& .MuiInputBase-input': {
              padding: '8px 12px',
              fontSize: '0.875rem',
            },
          }}
        />

        {/* Right Section */}
        <Stack
          flexDirection={'row'}
          alignItems={'center'}
          columnGap={2}
          sx={{
            '& > *': {
              color: 'text.primary',
            },
          }}
        >
          {/* User Menu */}
          <Tooltip title="Open settings">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)', // Slight zoom effect on hover
                },
              }}
            >
              <Avatar
                alt={userInfo?.name}
                src="null"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)', // Slight zoom effect on hover
                  },
                }}
              >
                {userInfo?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{
              mt: '45px',
              '& .MuiPaper-root': {
                borderRadius: '12px', // Rounded corners for menu
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Stronger shadow for depth
              },
            }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {loggedInUser?.isAdmin && (
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography
                  component={Link}
                  color={'text.primary'}
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  to="/admin/add-product"
                  textAlign="center"
                >
                  Add new Product
                </Typography>
              </MenuItem>
            )}
            {settings.map((setting) => (
              <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                <Typography
                  component={Link}
                  color={'text.primary'}
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  to={setting.to}
                  textAlign="center"
                >
                  {setting.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* Greeting */}
          <Typography
            variant="body1"
            fontWeight={300}
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: 'text.secondary',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {is480
              ? `${userInfo?.name.toString().split(' ')[0]}`
              : `Hey 👋, ${userInfo?.name}`}
          </Typography>

          {/* Admin Badge */}
          {loggedInUser?.isAdmin && (
            <Chip
              label="Admin"
              size="small"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '16px', // Pill-shaped badge
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            />
          )}

          {/* Cart Icon */}
          {cartItems?.length > 0 && (
            <Badge
              badgeContent={cartItems.length}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  right: 6,
                  top: 6,
                  padding: '0 4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                },
              }}
            >
              <IconButton
                onClick={() => navigate('/cart')}
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)', // Slight zoom effect on hover
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ShoppingCartOutlinedIcon sx={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Badge>
          )}

          {/* Wishlist Icon */}
          {!loggedInUser?.isAdmin && (
            <Badge
              badgeContent={wishlistItems?.length}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  right: 6,
                  top: 6,
                  padding: '0 4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                },
              }}
            >
              <IconButton
                component={Link}
                to="/wishlist"
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)', // Slight zoom effect on hover
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <FavoriteBorderIcon sx={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Badge>
          )}

          {/* Filter Icon */}
          {isProductList && (
            <IconButton
              onClick={handleToggleFilters}
              sx={{
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)', // Slight zoom effect on hover
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <TuneIcon
                sx={{
                  fontSize: '1.5rem',
                  color: isProductFilterOpen ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.3s ease',
                }}
              />
            </IconButton>
          )}
        </Stack>
        
      </Toolbar>
    </AppBar>
  );
};