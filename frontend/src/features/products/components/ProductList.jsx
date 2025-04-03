import {FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery, useTheme, Box, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync, resetProductFetchStatus, selectProductFetchStatus, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters } from '../ProductSlice';
import ProductCard from './ProductCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import { selectBrands } from '../../brands/BrandSlice';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { selectCategories } from '../../categories/CategoriesSlice';
import Pagination from '@mui/material/Pagination';
import { ITEMS_PER_PAGE } from '../../../constants';
import {createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems} from '../../wishlist/WishlistSlice';
import {selectLoggedInUser} from '../../auth/AuthSlice';
import {toast} from 'react-toastify';
import {banner1, banner2, banner3, banner4, loadingAnimation} from '../../../assets';
import { resetCartItemAddStatus, selectCartItemAddStatus } from '../../cart/CartSlice';
import { motion } from 'framer-motion';
import ClearIcon from '@mui/icons-material/Clear';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';

const sortOptions = [
    {name:"Price: low to high", sort:"price", order:"asc"},
    {name:"Price: high to low", sort:"price", order:"desc"},
];

const bannerImages = [banner1, banner3, banner2, banner4];

export const ProductList = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState(null);
    const theme = useTheme();

    const is1200 = useMediaQuery(theme.breakpoints.down(1200));
    const is800 = useMediaQuery(theme.breakpoints.down(800));
    const is700 = useMediaQuery(theme.breakpoints.down(700));
    const is600 = useMediaQuery(theme.breakpoints.down(600));
    const is500 = useMediaQuery(theme.breakpoints.down(500));
    const is488 = useMediaQuery(theme.breakpoints.down(488));

    const brands = useSelector(selectBrands);
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const totalResults = useSelector(selectProductTotalResults);
    const loggedInUser = useSelector(selectLoggedInUser);

    const productFetchStatus = useSelector(selectProductFetchStatus);
    const wishlistItems = useSelector(selectWishlistItems);
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
    const cartItemAddStatus = useSelector(selectCartItemAddStatus);
    const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

    const dispatch = useDispatch();

    const handleBrandFilters = (e) => {
        const filterSet = new Set(filters.brand);
        if(e.target.checked) { filterSet.add(e.target.value) }
        else { filterSet.delete(e.target.value) }
        const filterArray = Array.from(filterSet);
        setFilters({...filters, brand: filterArray});
    };

    const handleCategoryFilters = (e) => {
        const filterSet = new Set(filters.category);
        if(e.target.checked) { filterSet.add(e.target.value) }
        else { filterSet.delete(e.target.value) }
        const filterArray = Array.from(filterSet);
        setFilters({...filters, category: filterArray});
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, []);

    useEffect(() => {
        setPage(1);
    }, [totalResults]);

    useEffect(() => {
        const finalFilters = {...filters};
        finalFilters['pagination'] = {page: page, limit: ITEMS_PER_PAGE};
        finalFilters['sort'] = sort;
        if(!loggedInUser?.isAdmin) {
            finalFilters['user'] = true;
        }
        dispatch(fetchProductsAsync(finalFilters));
    }, [filters, page, sort]);

    const handleAddRemoveFromWishlist = (e, productId) => {
        if(e.target.checked) {
            const data = {user: loggedInUser?._id, product: productId};
            dispatch(createWishlistItemAsync(data));
        } else if(!e.target.checked) {
            const index = wishlistItems.findIndex((item) => item.product._id === productId);
            dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    };

    const handleFilterClose = () => {
        dispatch(toggleFilters());
    };

    const handleProductClick = (productId) => {
        navigate(`/product-details/${productId}`);
    };

    return (
        <Box sx={{ 
            position: 'relative', 
            minHeight: '100vh',
            background: '#f5f5f5', // Light gray background
            padding: '24px'
        }}>
            {/* Static Banner Background */}
            {!is600 && (
                <Box sx={{
                    position: 'relative',
                    height: is800 ? '300px' : is1200 ? '400px' : '500px',
                    width: '100%',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${bannerImages[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.7
                    }
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                        textAlign: 'center',
                        p: 4,
                        color: 'white'
                    }}>
                        <Typography variant="h2" sx={{ 
                            fontWeight: 700, 
                            mb: 2,
                            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                            background: 'linear-gradient(90deg, #ffffff, #e0f7fa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Shop our selection of<br />Makeup products
                        </Typography>
                        <Typography variant="body1" sx={{ 
                            maxWidth: '800px',
                            textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
                            fontSize: '1.1rem'
                        }}>
                            We are displaying products that ship to your location. You can select a different location in the menu above.
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Main Content */}
            <Box sx={{
                position: 'relative',
                zIndex: 1,
                mt: !is600 ? '-70px' : 0,
                backgroundColor: 'white',
                borderRadius: !is600 ? '24px 24px 0 0' : '0',
                boxShadow: !is600 ? '0 -10px 30px rgba(0,0,0,0.1)' : 'none',
                p: 3,
                minHeight: 'calc(100vh - 70px)'
            }}>
                {productFetchStatus === 'pending' ? (
                    <Stack width={is500 ? "35vh" : '25rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} marginRight={'auto'} marginLeft={'auto'}>
                        <Lottie animationData={loadingAnimation}/>
                    </Stack>
                ) : (
                    <>
                        {/* Filters Sidebar - Fixed to top */}
                        {isProductFilterOpen && (
                            <Paper 
                                sx={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    zIndex: 1200,
                                    width: '100%',
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                    p: 3,
                                    borderRadius: 0,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
                                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <Typography variant='h4' sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: 700
                                    }}>
                                        Filters
                                    </Typography>
                                    <IconButton 
                                        onClick={handleFilterClose}
                                        sx={{
                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(102, 126, 234, 0.2)'
                                            }
                                        }}
                                    >
                                        <ClearIcon sx={{ color: '#667eea' }}/>
                                    </IconButton>
                                </Box>

                                <Stack spacing={3}>
                                    {/* Quick Categories */}
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: '#4a5568' }}>
                                            Quick Categories
                                        </Typography>
                                        <Stack direction="row" flexWrap="wrap" gap={1}>
                                            {['Totes', 'Backpacks', 'Travel Bags', 'Hip Bags', 'Laptop Sleeves'].map((item) => (
                                                <Paper 
                                                    key={item}
                                                    sx={{
                                                        px: 2,
                                                        py: 1,
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                                            transform: 'translateY(-2px)'
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {item}
                                                    </Typography>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    </Box>

                                    {/* Brand Filters */}
                                    <Accordion 
                                        defaultExpanded
                                        sx={{
                                            borderRadius: '12px !important',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            '&:before': { display: 'none' }
                                        }}
                                    >
                                        <AccordionSummary 
                                            expandIcon={<AddIcon sx={{ color: '#667eea' }}/>}
                                            sx={{
                                                background: 'rgba(102, 126, 234, 0.05)',
                                                borderRadius: '12px',
                                                '&:hover': {
                                                    background: 'rgba(102, 126, 234, 0.1)'
                                                }
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 600, color: '#4a5568' }}>Brands</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ p: 2 }}>
                                            <FormGroup>
                                                {brands?.map((brand) => (
                                                    <motion.div 
                                                        key={brand._id}
                                                        whileHover={{ x: 5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FormControlLabel 
                                                            control={
                                                                <Checkbox 
                                                                    onChange={handleBrandFilters}
                                                                    value={brand._id}
                                                                    sx={{
                                                                        color: '#a0aec0',
                                                                        '&.Mui-checked': {
                                                                            color: '#667eea',
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            label={
                                                                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                                                                    {brand.name}
                                                                </Typography>
                                                            }
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </FormGroup>
                                        </AccordionDetails>
                                    </Accordion>

                                    {/* Category Filters */}
                                    <Accordion 
                                        defaultExpanded
                                        sx={{
                                            borderRadius: '12px !important',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            '&:before': { display: 'none' }
                                        }}
                                    >
                                        <AccordionSummary 
                                            expandIcon={<AddIcon sx={{ color: '#667eea' }}/>}
                                            sx={{
                                                background: 'rgba(102, 126, 234, 0.05)',
                                                borderRadius: '12px',
                                                '&:hover': {
                                                    background: 'rgba(102, 126, 234, 0.1)'
                                                }
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 600, color: '#4a5568' }}>Categories</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ p: 2 }}>
                                            <FormGroup>
                                                {categories?.map((category) => (
                                                    <motion.div 
                                                        key={category._id}
                                                        whileHover={{ x: 5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FormControlLabel 
                                                            control={
                                                                <Checkbox 
                                                                    onChange={handleCategoryFilters}
                                                                    value={category._id}
                                                                    sx={{
                                                                        color: '#a0aec0',
                                                                        '&.Mui-checked': {
                                                                            color: '#667eea',
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            label={
                                                                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                                                                    {category.name}
                                                                </Typography>
                                                            }
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </FormGroup>
                                        </AccordionDetails>
                                    </Accordion>
                                </Stack>
                            </Paper>
                        )}

                        {/* Products Section */}
                        <Box sx={{ 
                            mt: isProductFilterOpen ? (is500 ? 'calc(80vh + 16px)' : 'calc(80vh + 24px)') : 0,
                            transition: 'margin-top 0.3s ease'
                        }}>
                            {/* Sort Options */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 4,
                                p: 3,
                                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.08)'
                            }}>
                                <Typography variant="h6" sx={{ color: '#4a5568', fontWeight: 600 }}>
                                    {totalResults} Products Found
                                </Typography>
                                <FormControl sx={{ minWidth: '220px' }}>
                                    <InputLabel id="sort-dropdown" sx={{ color: '#4a5568' }}>Sort Products</InputLabel>
                                    <Select
                                        labelId="sort-dropdown"
                                        label="Sort Products"
                                        onChange={(e) => setSort(e.target.value)}
                                        value={sort}
                                        sx={{
                                            borderRadius: '8px',
                                            backgroundColor: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(102, 126, 234, 0.2)',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#667eea',
                                            }
                                        }}
                                    >
                                        <MenuItem value={null} sx={{ color: '#a0aec0' }}>Reset Sort</MenuItem>
                                        {sortOptions.map((option) => (
                                            <MenuItem 
                                                key={option.name} 
                                                value={option}
                                                sx={{
                                                    '&:hover': {
                                                        background: 'rgba(102, 126, 234, 0.1)',
                                                        color: '#667eea'
                                                    }
                                                }}
                                            >
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Product Grid */}
                            <Grid container spacing={3} sx={{ 
                                mb: 4,
                                justifyContent: 'center',
                                maxWidth: '1400px',
                                margin: '0 auto'
                            }}>
                                {products.map((product) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                        <motion.div
                                            whileHover={{ y: -8 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <ProductCard 
                                                id={product._id} 
                                                title={product.title} 
                                                thumbnail={product.thumbnail} 
                                                brand={product.brand.name} 
                                                price={product.price} 
                                                discountAmount={product.discountAmount}
                                                handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                                onClick={() => handleProductClick(product._id)}
                                                sx={{ 
                                                    height: '100%',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)',
                                                    }
                                                }}
                                            />
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Pagination */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: 4,
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.08)',
                                background: 'linear-gradient(to right, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))'
                            }}>
                                <Pagination 
                                    page={page}  
                                    onChange={(e, page) => setPage(page)} 
                                    count={Math.ceil(totalResults/ITEMS_PER_PAGE)} 
                                    variant="outlined" 
                                    shape="rounded" 
                                    size="large"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: '#4a5568',
                                            borderColor: 'rgba(102, 126, 234, 0.2)',
                                            fontSize: '1rem',
                                            '&:hover': {
                                                background: 'rgba(102, 126, 234, 0.1)'
                                            }
                                        },
                                        '& .MuiPaginationItem-root.Mui-selected': {
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            borderColor: 'transparent',
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a6fd1 0%, #6a42a0 100%)'
                                            }
                                        }
                                    }}
                                />
                                <Typography variant="body1" sx={{ 
                                    mt: 2, 
                                    color: '#4a5568',
                                    fontWeight: 500
                                }}>
                                    Showing {(page-1)*ITEMS_PER_PAGE+1} to {page*ITEMS_PER_PAGE>totalResults?totalResults:page*ITEMS_PER_PAGE} of {totalResults} results
                                </Typography>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};