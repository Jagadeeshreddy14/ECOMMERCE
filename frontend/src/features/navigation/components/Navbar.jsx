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
          <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8ODhAQDhAPDhANDxEPDREVDg8QDxAQFREWFiAWExUYHSgsGBoxIBgTLT0hJTU3Oi4uFyIzRDMsQyg5LisBCgoKDg0OGxAQGi0dHR8tLS0tLS0tLS0tLS0rKy0rLSsrLSstLS0tLS0rLSstLS0tKy0tLSstLS0tLS0tLS0tLf/AABEIAMgAyAMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcBBQgEAwL/xAA9EAACAQICBAkKBgIDAQAAAAAAAQIDEQQFBxIhgQYTFDFRYXFykRciMkFSgpKhotIjYnOTssKxwUJD4TP/xAAaAQEAAgMBAAAAAAAAAAAAAAAAAQQDBQYC/8QAKhEBAAIBAgcAAQQDAQEAAAAAAAEDAgURBBITITFBURUiUmFxMkLBkSP/2gAMAwEAAhEDEQA/ALxAAAAAAAAAYAjuf8M8Fgm4Tm6tVc9OmlKSf5nzIvcNp91/fGNo+sedkYobjNKVdv8ABw9KC9WvKU38rWNvhoOMf5ZMU3vJ5Tcf7GG+Cf3GT8HT9l567HlNx/sYb4J/cPwdX2Tr5HlNx/sYb4J/cPwdX2Tr5PthdKGLUlxtGhUj61HXhLxu/wDB4z0LDbtO0pi9YXBvhDQzClr0W1KFlUpuynBvp6Vz7TRcVwlnDZbZwz458zclZ7AAAAAAAAAAAAAAAAAABWekDhrKMpYTBy1XHza9VPbf2IP1dbOg0vTOf/62R29Qr22/FatnSY4xj47K07yE7beEBP8AYAAkHvuN/wABMxlhsxoNPza01RqL1OM9m3sdnuNbqlMZ8PO/mPDJVl3XucWugAAAAAAAAAAAAAAADAEe4c5y8FgZzg7Vaj4qj1Sl69y1nuLun8P17ox9MdmW0KLbvtfrO4iNo2UglAAAAABHmRIOAWAeIzKgv+NKXHTfQobV89VbzXarbycPMfWWqP1br2OLXQAAAAAAAAAAAAAAABgSKl0tZnxmKp4eL2YaGtPvzSe33dX4jqNEo5cJsn3/AMVb577IIb5XAAAAAADfselpaIss1aVbEyW2rJUqfdjtbXa39Jy2t381kV/FuiO26xDRM4AAAAAAAAAAAAAAAA+WIrRpwlObtGEXKT6EldnrHGcpiI9ontDnjNcbLE4irWlz1qkp9ib2Ls5jvOFqiqqMFDOe7ylh5AAAAAAzCLk0km3J2S6W3bZ1njPLlxmZTHd0Jwfy9YTCUaCt+FTSl1ze2T8WzguJtm2zLP6v4Rti2JhegAAAAAAAAAAAAAAABENJuZ8Rl8oJ2niZKku7zyfZZW3mz0mjqXxM+IYrctoUwdl/CmEoAAAAAAkujzLOU5jSurwofjT921vq1fA1WrX8lG0eZZa43yXgccusgAAAAAAAAAAAAAACBgCndKeZ8djlRTvHCw1ffklJ/wBVuOt0Wjkp5/eSpfO6GG6YAAAAACAJFsaJcs4vC1MRJbcRPVh3INr+Wt4HJa1fzWRhH+q3RjtCemmZwgQ/SbnMsLg1ClJwqYmWomnaSgleTX0r3jaaVw3Vu3mO0MVuW2KE6N87nQx0KU5y4rE3g023FVLXi0um+z3jdatweOVHPEd4YaslzHIrbJIAAAAAAAAAAHmzDFRoUqlWfo0oSnLsirnqvCc8oxj2iZc8YzEyrVZ1Z7ZVZynLtk7+B39GEVVxjHhQmd3xMvh5gAAAAAeR+6NKU5xhFXlOSjFdLbSX+jHZny4zKYdDZRgY4bD0qMealTjC/S0tr3s4G6ybc5yn22GMbPaY0sEeRTGk7M+Px8qad4YWKpro1350v9L3Tr9Go5Kef9yndO87InRqShKM4u0oSUovoaaat8jaWYc2MxPtiidpdDZNj44rDUa8earTjLsdtq3O5wV9U1WTjPpfxns9xiegAAAAAAAABgCE6Vsz4rBRop2lip2f6cGpN+Op4m30ejnv5v2sN07Y7KgOvUwAAAAAAPCV6NMs5RmEJtXhhouq+jW5o77u/umn1i/p0cn7mamN8t11nIrgB481xscNQq1pc1KnKb67LmMlNc2ZxhHt5ynaHPOIrSqTlObvKpJzk+lybb/2d9VhGGEYwoTPd8z36R6WvokzPXw9XDSe2hPXh3Jtv+V/iOV1qjlsiz6t05bxsn5pGcAAAAAAAAAYApXSXmfKMwnFO8MMlSj3ueW+7t7p1+j0dOnn+qd075bIobdhAAAAAAA8rf0U5ZxWClWatLFTuv04Xivnr+JyGs389/L+1cqx2xTc1DMAQPS1mfF4Wnh4vbiZ3n+nCz/lq+BudFo57eef9WG7LaFSnWKYTumO6RcAMz5LmNFt2hWfE1OyfNf3tU1mq8P1KJn3D3TltlsvQ4xeAAAAAAAAAHhzjHRw2Gq15c1KnKXa0ti3uxloqmyyMI9vOU7Q56rVZTlKcneU5OUn0tt3v8zvq8IwxjFRme78Ht5AAAAAA+2Dw0q1WFKG2VWcYR7ZOxiusiuucp9PWMby6Hy/CxoUadKHo0oRhHsikjgbM5zynKfa/jHZ6TGlgkUfpDzPlOY1bO8KH4MPdvf6tY7HSaOnRE+5Urst5Ro2s+WIARbTTWxrat3Qeco3jZMOguDeZLF4OhX9dSC1++tkvmmcFxdPStyw+L+E7w2ZgemQAAAAAAAIBpbzPUw1LDRe3ET1p9yDT/lb4TdaLRz2zn8YLstoVQdX/KoEgAAAAAEy0WZZx2O41q8cLDX9+S1Y3+p7jS61fyVRhHtnpx3XGckthMjXcIMxWEwlau7fh0249c3sivFozcNVNtuOH15znaHPk5OTbbbcndvpbd9vWd9hHJEQoT3YJQEgBZ+iHM7wrYWT9BqtT7JbJW6r6vxHL65Ry5RZ9WqJ3hYxoFhkkAAAABgABRukDM+U5jWad4UfwYe5e/1ax2WlUdKiJ9ypXZbyjhtJ8sQAAAABE9wJmRc2jHLOIy9VGrTxUnVfTqejHdZX9443Vr+pxExHjFdpx2hLzVsoQK70u5nq0qOFi9tSTq1O7HYr9rv8JvtEo5s5s+K9+WyrjqVUAAAN3wMzPkmPoVG7QcuLqdyfm7epbHuKGpUdXh5iPLJXO2S+jiF5kAAAAAMEDW8JMxWEwdev66cHqd97I/NoscLT1bccPrznO0OfZNttt3bd2+m/Sd7jEYxEKE92CUBIAAAAeIJenK8FLEV6VGPPWnGC6k3z/wCfAwcTbFdM5vWMOiMNRjThGEFaMIqEV0JKyOByy5spmfa/4fQ8pCYFD8N8z5VmFead4QlxVPuw2bO16z3nbaZR0qIj3KjbO8tEbBjAAAAeZ8bJ8L74HZnyvA0Krd5aupU6deHmu/ba+84XjaOjflivYTvi3ZVewAAAAYArnS9mdoUcLF7Zt1qndjsjfqu5fCb7RKN85s+K9+SsDqFUAAAAAANz2nWibLOMxVTESXm4aFofqTVtnu63iaHW7uWuK/qxTj33W4cutAGm4WZnyTA16ydpKDjT78vNXzd9xZ4OnrXY4vGc7QoI7uI2j+lGfIekAAAAI3Fj6IcztKvhZP0kq1PtXmy/r4HOa5w+3LbCzRKzznVkAAAAGCIFC8M8z5Xj69RO8VLi6fRqQ83Z1Pa952+m0dKjGPajbO8tIbBjAAAAAACfB5Xdo7yzk2XUrq06/wCNP3ub6dU4jUr+tfM/Oy9VG2KUFBkAK40w41qGGoJ7JynVl7qSX8pG/wBCqic8s/jBdKsDp/MKgAAAABEjZ8Gcy5JjaFfmUJpVO5Jasvk34FTjqOtTlh/491ztLoKLuu04WV9kAAAAaThhmfJMDXqp2lqalPp15+avC99xa4Knq3Y4vGc7QoQ7uI2hRnvISgAAAAAD35BlzxeLo0F/21EpdUFtk/BMq8Zd0ass3uuN5dCQgopJKySsl6kkcJMzM7yvR4fshIBU2l+/K6HRxGz45f8Ah02g/wCGX9qt6BG/8ywBKAAAAACJjdK8+AWZ8qy+jJu86S4mp2w2K/Xq6r3nEajR0eIyj6u1TvikRRZGQAACsNL2Z3lQwsX6Kdap27VH+3idDodHebJVrslcHSyrAAAAAAALC0RZZrVa2JktlKKpU+9La/BW+I53XL+0Vx7WaMVpnNrLIACudMGBbp4euv8AhKdKfvJSV/hfib7Q7ds8sPqvfCrzqPCqAAAAAAAn+iPM9SvVw0nsrx4ymvzw57dbT+k57W6N8Ysj15WKJ77LWOaWvbIAgflu24nYc/cJ8y5Xja9bnjOdqfcilGPyXzO64GjpU44qFmW8tYXPbz6AgAAAAifSQjfseV78B8s5Jl9GDVpzjxtTp1p7dvYrLccNx93WvyyXq42hvik9skgBqOFOW8rwVeja8pQvT78fOXzSLHB3dG+M3nON8VANHeRPbdQnsHpAAAAAAHtyTHvC4qjXV/wqik+uN7Nb1crcXT1apw+veE/q3dC0qinFSi7qSUovpTVzg8o2naV6O76EJYI8wI7w9zPkuX1pJ2nVXE0+2ezZu1nuL2n09W/GGOzLaFGHcRHbdS8gQEgAAAB7S23BPLOV46hRavFz1qncitZ38LbyjqF3Royyh7qx3lf9jh15kAAAwR/Ionh1lnJcwrRStCo+Op92e3wT1luO20u/q0RM+YUbY2yaA2LGAAAAAAIT4jddejfM+UZfTi3eeHboy7Ftj9LXgcXqlHT4idvErlU74pWa5lYAqnS5mevXpYaL2UY8ZUX552tvS/kdNodG2M2T7Vb8kAOgVwAAAAAAj4LK0Q5Z/wDfFSXRRp/yl/TwOY1y/fKK1qnFZhoFgAAAMAV7pdyzWo0cTFbaMuLqdyfNfsa+o3mh38tk1z7V78d4VYdUqgAAAAAB7T6TfRRmfFYydCT83FQ2fqQvJfLXNFrdHNVGcev+s1E7St45ZbfirUUIuUnZRTlJ9CSJxicp2hHpz1nePeKxNau7/i1HJdUb2S3Kx3nCU9KrHBRzneXiLLwAAAAAAIynaN0xHdf/AAVyzkmCoUbWlGF6nfl5z+bZwfGXdW7LNewjaG3Kz2AAAGAPBn2XrF4WtQf/AG02l1S50/FIy8Pb07Izj085xvDnqpBxbjJWcW010NP19Z32GW8RKhLB7lAAAAAA8wl6MuxcsPWp1oelSqRmuvVa2PqMHEVxbVOM+04ztLojCYiNWnCpB3jUhGcX0qSujgc8ZxmY+L8I7pHzB4fLaurslXcaK7Jc/wBKkX9LqiziIifXd4tnbFSJ2qj5CQAAAAADfcBss5VmFGDV4U5cbU7sNu3qb1VvNdqd/S4eZjzLJVG+S9zif7XmSQAAAAACkNIuWcmzGo0rQxCVaHvbJfUpeJ2OkX9SjafMKVsbZbowbX+mPfcCAAAAACBcui7MHWy9QlteGqSpe76S/wA23HG6vTycRM/V2qf0vtpKy+WIy6bgryoTjWsudximn8m3uPOl2xXxETPvsm2N8VKHafyo+AkAAAAAImdkre0Y8HpYWhLEVo6tXEpasXzwpLauxvn3I5HV+M61nLj4xW6sNo3Tc1G7MyAAAAAACHaSOD8sZhlUpLWrYa8oxXPOD9KK69ie7rNppfFxTZtl/jLFbjvCmjsYnfHeFPbYJQAAAAAQLj0W5fKjgNeas8TUdSK/JZRX+G95x2r3dS/aPS7VG2KYtX5zVeJ3ZZhX3CLRrCrN1MHUjRcm26Uk+Lu/Za9HsN7wms5Vxy2RzMGVW7QPRnmHtYb9yf2l785T8lj6MseTPMPaw37s/tH5yn5J0ZPJnmHtYb9yf2j85T8k6EnkzzD2sN+5P7R+cp+SdGX7p6Msc3508PFdOvN/1InXK/MRMnRmUs4N6PsPhJKpWlymrHbG8dWnFroj695q+L1a27tH6YZsKohNDVMoAAAAAAAAIEO4S8AcPjJOrTbw1aW2TUVKnN9Mo9PWja8JqttH6Z/VixZ1RkiFXRjjk7RqYeS9T15x+WqbXHXa/jD0ZfjyZ5h7WG/cn9pP5yn5J0ZPJnmHtYb9yf2j85T8k6EnkzzD2sN+5P7R+cp+SdCTyZ5h7WG/dn9o/OVfJOi3mQ6M1Canjakaii0+Kgnqt/mk+ddVinxOtZZxtXGz3jRCxIxUUklZJWSXMkaKZ38rD//Z" alt="Apex Store" style={{ height: '2rem' }} />
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