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
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [placeholder, setPlaceholder] = React.useState('');
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const wishlistItems = useSelector(selectWishlistItems);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  
  const exampleProducts = [
    'Search for Handmade products...',
    'Search for Handmade candles...',
    'Search for wooden crafts...',
    'Search for artisanal jewelry...',
  ];

  const [currentProductIndex, setCurrentProductIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % exampleProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    }, 50);
    return () => clearInterval(typewriterInterval);
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        color: 'white',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Toolbar
        sx={{
          p: { xs: 1, sm: 2 },
          height: '5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Logo with vibrant gradient */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            fontWeight: 800,
            letterSpacing: '.15rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          <img 
            src="https://res.cloudinary.com/docnp0ctp/image/upload/v1742925244/Apex-store/oqe1wqywljqopu2vzemh.png" 
            alt="Apex Store" 
            style={{ 
              height: '2.5rem',
              marginRight: '0.75rem',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))'
            }} 
          />
          <span style={{ 
            background: 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '1.5rem'
          }}>
            pex store
          </span>
        </Typography>

        {/* Search Bar with gradient border */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '600px', margin: '0 2rem' }}>
          <TextField
            fullWidth
            placeholder={placeholder || 'Search products...'}
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.8)' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)) border-box',
                  borderRadius: '50px',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  maskComposite: 'exclude',
                },
                '&:hover fieldset': {
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2)) border-box',
                },
                '&.Mui-focused fieldset': {
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3)) border-box',
                  boxShadow: '0 0 10px rgba(255,255,255,0.3)',
                },
              },
              '& .MuiInputBase-input': {
                padding: '12px 16px',
                fontSize: '1rem',
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                  opacity: 1,
                },
              },
            }}
          />
        </form>

        {/* Right Section with colorful elements */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2.5}
          sx={{
            '& > *': {
              color: 'white',
            },
          }}
        >
          {/* User Menu with gradient avatar */}
          <Tooltip title="Account settings" arrow>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                },
              }}
            >
              <Avatar
                alt={userInfo?.name}
                src={null}
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  },
                }}
              >
                {userInfo?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            sx={{
              mt: '50px',
              '& .MuiPaper-root': {
                borderRadius: '16px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                minWidth: '220px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))',
                '& .MuiMenuItem-root': {
                  padding: '12px 20px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
                    '& a': {
                      color: '#667eea',
                      transform: 'translateX(5px)',
                    },
                  },
                },
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
                  color={'#4a5568'}
                  sx={{
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    fontWeight: 500,
                  }}
                  to="/admin/add-product"
                  textAlign="center"
                >
                  <span style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginRight: '10px'
                  }}>
                    ➕
                  </span>
                  Add Product
                </Typography>
              </MenuItem>
            )}
            {settings.map((setting) => (
              <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                <Typography
                  component={Link}
                  color={'#4a5568'}
                  sx={{
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    fontWeight: 500,
                  }}
                  to={setting.to}
                  textAlign="center"
                >
                  <span style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginRight: '10px'
                  }}>
                    {setting.name === 'Home' && '🏠'}
                    {setting.name === 'Profile' && '👤'}
                    {setting.name.includes('orders') && '📦'}
                    {setting.name === 'Logout' && '🚪'}
                  </span>
                  {setting.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* Greeting with subtle gradient */}
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              display: { xs: 'none', sm: 'block' },
              background: 'linear-gradient(90deg, #ffffff, #e0e0e0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                background: 'linear-gradient(90deg, #f6d365, #fda085)',
                WebkitBackgroundClip: 'text',
              },
            }}
          >
            {is480
              ? `${userInfo?.name.toString().split(' ')[0]}`
              : `Hey 👋, ${userInfo?.name}`}
          </Typography>

          {/* Admin Badge with vibrant gradient */}
          {loggedInUser?.isAdmin && (
            <Chip
              label="Admin"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                color: '#2d3748',
                fontWeight: 'bold',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                height: '26px',
                '& .MuiChip-label': {
                  padding: '0 10px',
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
              }}
            />
          )}

          {/* Cart Icon with gradient hover */}
          {cartItems?.length > 0 && (
            <Badge
              badgeContent={cartItems.length}
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  right: 4,
                  top: 4,
                  minWidth: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ff7676 0%, #f54ea2 100%)',
                  color: 'white',
                  boxShadow: '0 0 0 2px rgba(245,101,101,0.3)',
                },
              }}
            >
              <IconButton
                onClick={() => navigate('/cart')}
                sx={{
                  transition: 'all 0.3s ease',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  padding: '10px',
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.1)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.3))',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    '& svg': {
                      color: '#f6d365',
                    },
                  },
                }}
              >
                <ShoppingCartOutlinedIcon 
                  sx={{ 
                    fontSize: '1.7rem',
                    color: 'rgba(255,255,255,0.9)',
                    transition: 'all 0.3s ease',
                  }} 
                />
              </IconButton>
            </Badge>
          )}

          {/* Wishlist Icon with pink gradient */}
          {!loggedInUser?.isAdmin && (
            <Badge
              badgeContent={wishlistItems?.length}
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  right: 4,
                  top: 4,
                  minWidth: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ff7676 0%, #f54ea2 100%)',
                  color: 'white',
                  boxShadow: '0 0 0 2px rgba(245,101,101,0.3)',
                },
              }}
            >
              <IconButton
                component={Link}
                to="/wishlist"
                sx={{
                  transition: 'all 0.3s ease',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  padding: '10px',
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.1)',
                    background: 'linear-gradient(135deg, rgba(255,118,118,0.2), rgba(245,78,162,0.3))',
                    boxShadow: '0 8px 20px rgba(245,78,162,0.2)',
                    '& svg': {
                      color: '#f54ea2',
                    },
                  },
                }}
              >
                <FavoriteBorderIcon 
                  sx={{ 
                    fontSize: '1.7rem',
                    color: 'rgba(255,255,255,0.9)',
                    transition: 'all 0.3s ease',
                  }} 
                />
              </IconButton>
            </Badge>
          )}

          {/* Filter Icon with gradient */}
          {isProductList && (
            <IconButton
              onClick={handleToggleFilters}
              sx={{
                transition: 'all 0.3s ease',
                background: isProductFilterOpen 
                  ? 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))' 
                  : 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                padding: '10px',
                backdropFilter: 'blur(5px)',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.1)',
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.4), rgba(118,75,162,0.4))',
                  boxShadow: '0 8px 20px rgba(102,126,234,0.2)',
                },
              }}
            >
              <TuneIcon
                sx={{
                  fontSize: '1.7rem',
                  color: isProductFilterOpen ? '#f6d365' : 'rgba(255,255,255,0.9)',
                  transition: 'all 0.3s ease',
                }}
              />
            </IconButton>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};