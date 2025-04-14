import { 
  Button, FormControl, Grid, IconButton, InputLabel, 
  MenuItem, Pagination, Select, Stack, Typography, 
  useMediaQuery, useTheme, Tabs, Tab, Box, 
  TextField, Paper, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Divider, Avatar,
  Tooltip, Badge
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import { selectBrands } from '../../brands/BrandSlice'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { selectCategories } from '../../categories/CategoriesSlice'
import ProductCard from '../../products/components/ProductCard'
import { 
  deleteProductByIdAsync, 
  fetchProductsAsync, 
  selectProductIsFilterOpen, 
  selectProductTotalResults, 
  selectProducts, 
  toggleFilters, 
  undeleteProductByIdAsync 
} from '../../products/ProductSlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'
import ClearIcon from '@mui/icons-material/Clear';
import { ITEMS_PER_PAGE } from '../../../constants';
import { formatPrice } from '../../../utils/formatPrice';
import { AddBrand } from '../../brands/components/AddBrand';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { toast } from 'react-toastify';
import SalesDashboard from './SalesDashboard';
import { CouponManagement } from './CouponManagement';

// Configure axios base URL
axios.defaults.baseURL = 'https://apex-store-backend.onrender.com';

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
]

export const AdminDashBoard = () => {
  const [filters, setFilters] = useState({})
  const brands = useSelector(selectBrands)
  const categories = useSelector(selectCategories)
  const [sort, setSort] = useState(null)
  const [page, setPage] = useState(1)
  const products = useSelector(selectProducts)
  const dispatch = useDispatch()
  const theme = useTheme()
  const is500 = useMediaQuery(theme.breakpoints.down(500))
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen)
  const totalResults = useSelector(selectProductTotalResults)
  const [searchTerm, setSearchTerm] = useState('')
  
  const is1200 = useMediaQuery(theme.breakpoints.down(1200))
  const is800 = useMediaQuery(theme.breakpoints.down(800))
  const is700 = useMediaQuery(theme.breakpoints.down(700))
  const is600 = useMediaQuery(theme.breakpoints.down(600))
  const is488 = useMediaQuery(theme.breakpoints.down(488))

  const [openBrandDialog, setOpenBrandDialog] = useState(false);
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
  });
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenBrandDialog = () => setOpenBrandDialog(true);
  const handleCloseBrandDialog = () => setOpenBrandDialog(false);
  const handleOpenCouponDialog = () => {
    setOpenCouponDialog(true);
  };
  
  const handleCloseCouponDialog = () => {
    setOpenCouponDialog(false);
    setSelectedCoupon(null);
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
    });
  };
  
  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase,
      maxDiscount: coupon.maxDiscount,
      startDate: coupon.startDate.split('T')[0],
      endDate: coupon.endDate.split('T')[0],
    });
    setOpenCouponDialog(true);
  };
  
  const handleDeleteCoupon = async (couponId) => {
    try {
      await axios.delete(`/coupons/${couponId}`);
      setCoupons(coupons.filter(coupon => coupon._id !== couponId));
      toast.success('Coupon deleted successfully');
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };
  
  const handleSubmitCoupon = async () => {
    try {
      const formattedCouponData = {
        ...couponForm,
        startDate: new Date(couponForm.startDate).toISOString(),
        endDate: new Date(couponForm.endDate).toISOString(),
        discountValue: Number(couponForm.discountValue),
        minPurchase: Number(couponForm.minPurchase),
        maxDiscount: Number(couponForm.maxDiscount)
      };

      if (selectedCoupon) {
        const response = await axios.put(`/coupons/${selectedCoupon._id}`, formattedCouponData);
        const updatedCoupons = coupons.map(coupon =>
          coupon._id === selectedCoupon._id ? response.data : coupon
        );
        setCoupons(updatedCoupons);
        toast.success('Coupon updated successfully');
      } else {
        const response = await axios.post('/coupons', formattedCouponData);
        setCoupons([...coupons, response.data]);
        toast.success('Coupon created successfully');
      }
      handleCloseCouponDialog();
    } catch (error) {
      console.error('Coupon error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Error saving coupon');
    }
  };

  const handleToggleCouponStatus = async (couponId, newStatus) => {
    try {
      // Make an API call to update the coupon status
      const response = await axios.patch(`/api/coupons/${couponId}/status`, { isActive: newStatus });

      // Update the local state with the new status
      setCoupons((prevCoupons) =>
        prevCoupons.map((coupon) =>
          coupon._id === couponId ? { ...coupon, isActive: response.data.isActive } : coupon
        )
      );

      toast.success(`Coupon ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle coupon status:', error);
      toast.success('Successfull to update coupon status');
    }
  };

  useEffect(() => { 
    setPage(1)
  }, [totalResults])

  useEffect(() => { 
    const finalFilters = { ...filters }
    finalFilters['pagination'] = { page: page, limit: ITEMS_PER_PAGE }
    finalFilters['sort'] = sort
    if (searchTerm) {
      finalFilters['search'] = searchTerm
    }
    dispatch(fetchProductsAsync(finalFilters))
  }, [filters, sort, page, searchTerm])

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('/coupons');
        setCoupons(response.data);
      } catch (error) {
        toast.error('Failed to fetch coupons');
      }
    };
    fetchCoupons();
  }, []);

  const handleBrandFilters = (e) => { 
    const filterSet = new Set(filters.brand || [])
    if (e.target.checked) { filterSet.add(e.target.value) }
    else { filterSet.delete(e.target.value) }
    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, brand: filterArray })
  }

  const handleCategoryFilters = (e) => { 
    const filterSet = new Set(filters.category || [])
    if (e.target.checked) { filterSet.add(e.target.value) }
    else { filterSet.delete(e.target.value) }
    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, category: filterArray })
  }

  const handleProductDelete = (productId) => { 
    dispatch(deleteProductByIdAsync(productId))
  }

  const handleProductUnDelete = (productId) => { 
    dispatch(undeleteProductByIdAsync(productId))
  }

  const handleFilterClose = () => { 
    dispatch(toggleFilters())
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredProducts = products.filter(product => 
    searchTerm === '' ||
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category && product.category.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Products" />
            <Tab label="Sales Dashboard" />
            <Tab label="Coupons" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" color="primary" fontWeight="bold">
                Product Management
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" />,
                  endAdornment: searchTerm && (
                    <IconButton onClick={() => setSearchTerm('')} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ),
                  sx: { borderRadius: 2, backgroundColor: '#fff' }
                }}
                sx={{ width: is500 ? '100%' : 300 }}
              />
            </Stack>

            <motion.div 
              style={{
                position: "fixed",
                backgroundColor: "#fff",
                height: "100vh",
                padding: '2rem',
                overflowY: "scroll",
                width: is500 ? "100vw" : "30rem",
                zIndex: 500,
                boxShadow: '0 0 20px rgba(0,0,0,0.1)'
              }}  
              variants={{
                show: { left: 0 },
                hide: { left: -500 }
              }} 
              initial={'hide'} 
              transition={{
                ease: "easeInOut",
                duration: 0.7,
                type: "spring"
              }} 
              animate={isProductFilterOpen === true ? "show" : "hide"}
            >
              <Stack mb={'5rem'} sx={{ scrollBehavior: "smooth", overflowY: "scroll" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant='h5' color="primary">Filters</Typography>
                  <IconButton onClick={handleFilterClose}>
                    <ClearIcon fontSize='medium' color="primary" />
                  </IconButton>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* brand filters */}
                <Accordion elevation={0} sx={{ border: '1px solid #eee', mb: 2 }}>
                  <AccordionSummary expandIcon={<AddIcon color="primary" />}>
                    <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
                      <Typography fontWeight="500">Brands</Typography>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBrandDialog();
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        Add Brand
                      </Button>
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleBrandFilters}>
                      {brands?.map((brand) => (
                        <motion.div key={brand._id} whileHover={{ x: 5 }}>
                          <FormControlLabel 
                            sx={{ ml: 1 }} 
                            control={
                              <Checkbox 
                                color="primary"
                                value={brand._id} 
                              />
                            } 
                            label={brand.name} 
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>

                {/* category filters */}
                <Accordion elevation={0} sx={{ border: '1px solid #eee' }}>
                  <AccordionSummary expandIcon={<AddIcon color="primary" />}>
                    <Typography fontWeight="500">Categories</Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleCategoryFilters}>
                      {categories?.map((category) => (
                        <motion.div key={category._id} whileHover={{ x: 5 }}>
                          <FormControlLabel 
                            sx={{ ml: 1 }} 
                            control={
                              <Checkbox 
                                color="primary"
                                value={category._id} 
                              />
                            } 
                            label={category.name} 
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </motion.div>

            <Stack rowGap={5} mt={is600 ? 2 : 5} mb={'3rem'}>
              {/* sort options */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredProducts.length} of {totalResults} products
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="sort-dropdown">Sort By</InputLabel>
                  <Select
                    labelId="sort-dropdown"
                    label="Sort By"
                    onChange={(e) => setSort(e.target.value)}
                    value={sort}
                    sx={{ backgroundColor: '#fff' }}
                  >
                    <MenuItem value={null}>Default</MenuItem>
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name} value={option}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
      
              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Paper elevation={2} sx={{ 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      opacity: product.isDeleted ? 0.7 : 1,
                      position: 'relative'
                    }}>
                      {product.isDeleted && (
                        <Chip 
                          label="Deleted" 
                          color="error" 
                          size="small"
                          sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                        />
                      )}
                      <ProductCard 
                        id={product._id}
                        title={product.title}
                        thumbnail={product.thumbnail}
                        images={product.images}
                        brand={product.brand?.name}
                        price={parseFloat(product.price)}
                        discountAmount={parseFloat(product.discountAmount || 0)}
                        stockQuantity={product.stockQuantity}
                        isAdminCard={true}
                      />
                      <Stack 
                        direction="row" 
                        spacing={1}
                        p={2}
                        justifyContent="space-between"
                        sx={{ backgroundColor: '#f5f5f5' }}
                      >
                        <Button 
                          component={Link} 
                          to={`/admin/product-update/${product._id}`} 
                          variant="contained"
                          size="small"
                          color="primary"
                          sx={{ flex: 1 }}
                        >
                          Update
                        </Button>
                        {product.isDeleted ? (
                          <Button 
                            onClick={() => handleProductUnDelete(product._id)} 
                            variant="outlined"
                            size="small"
                            color="success"
                            sx={{ flex: 1 }}
                          >
                            Restore
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleProductDelete(product._id)} 
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{ flex: 1 }}
                          >
                            Delete
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Stack alignItems="center" rowGap={2}>
                <Pagination 
                  size={is488 ? 'medium' : 'large'} 
                  page={page}  
                  onChange={(e, page) => setPage(page)} 
                  count={Math.ceil(totalResults / ITEMS_PER_PAGE)} 
                  variant="outlined" 
                  shape="rounded" 
                  color="primary"
                />
                <Typography variant="body2" color="text.secondary">
                  Page {page} of {Math.ceil(totalResults / ITEMS_PER_PAGE)}
                </Typography>
              </Stack>    
            </Stack> 
          </motion.div>
        )}

        {activeTab === 1 && (
          <SalesDashboard />
        )}

        {activeTab === 2 && (
          <CouponManagement 
            coupons={coupons}
            handleOpenCouponDialog={handleOpenCouponDialog}
            handleEditCoupon={handleEditCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
            handleToggleCouponStatus={handleToggleCouponStatus}
          />
        )}
      </Paper>

      {/* Dialogs */}
      <AddBrand 
        open={openBrandDialog} 
        handleClose={handleCloseBrandDialog}
      />

      <Dialog 
        open={openCouponDialog} 
        onClose={handleCloseCouponDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white',
          fontWeight: 600
        }}>
          {selectedCoupon ? 'Edit Coupon' : 'Create New Coupon'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Coupon Code"
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
              required
              fullWidth
              variant="outlined"
              size="small"
            />
            <FormControl fullWidth required size="small">
              <InputLabel>Discount Type</InputLabel>
              <Select
                value={couponForm.discountType}
                onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                label="Discount Type"
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Discount Value"
              type="number"
              value={couponForm.discountValue}
              onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
              required
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Minimum Purchase Amount"
              type="number"
              value={couponForm.minPurchase}
              onChange={(e) => setCouponForm({ ...couponForm, minPurchase: e.target.value })}
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Maximum Discount"
              type="number"
              value={couponForm.maxDiscount}
              onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
              fullWidth
              variant="outlined"
              size="small"
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Start Date"
                type="date"
                value={couponForm.startDate}
                onChange={(e) => setCouponForm({ ...couponForm, startDate: e.target.value })}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
              <TextField
                label="End Date"
                type="date"
                value={couponForm.endDate}
                onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseCouponDialog}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmitCoupon}
          >
            {selectedCoupon ? 'Update Coupon' : 'Create Coupon'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
