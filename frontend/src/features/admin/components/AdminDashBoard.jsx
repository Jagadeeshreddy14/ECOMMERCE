import { Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, Stack, Typography, useMediaQuery, useTheme, Tabs, Tab, Box } from '@mui/material'
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
import { ProductCard } from '../../products/components/ProductCard'
import { deleteProductByIdAsync, fetchProductsAsync, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters, undeleteProductByIdAsync } from '../../products/ProductSlice';
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion'
import ClearIcon from '@mui/icons-material/Clear';
import { ITEMS_PER_PAGE } from '../../../constants';
import { formatPrice } from '../../../utils/formatPrice';
import { AddBrand } from '../../brands/components/AddBrand';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';

// Configure axios base URL
axios.defaults.baseURL = 'https://apex-store-backend.onrender.com';

const sortOptions=[
    {name:"Price: low to high",sort:"price",order:"asc"},
    {name:"Price: high to low",sort:"price",order:"desc"},
]

const CouponManagement = ({ coupons, setCoupons, handleOpenCouponDialog, handleEditCoupon, handleDeleteCoupon }) => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Manage Coupons</Typography>
        <Button variant="contained" onClick={handleOpenCouponDialog}>
          Add New Coupon
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid Until</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%` 
                    : `₹${coupon.discountValue}`}
                </TableCell>
                <TableCell>{new Date(coupon.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(coupon.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={coupon.isActive ? 'Active' : 'Inactive'}
                    color={coupon.isActive ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditCoupon(coupon)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCoupon(coupon._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export const AdminDashBoard = () => {
    const [filters,setFilters]=useState({})
    const brands=useSelector(selectBrands)
    const categories=useSelector(selectCategories)
    const [sort,setSort]=useState(null)
    const [page,setPage]=useState(1)
    const products=useSelector(selectProducts)
    const dispatch=useDispatch()
    const theme=useTheme()
    const is500=useMediaQuery(theme.breakpoints.down(500))
    const isProductFilterOpen=useSelector(selectProductIsFilterOpen)
    const totalResults=useSelector(selectProductTotalResults)
    
    const is1200=useMediaQuery(theme.breakpoints.down(1200))
    const is800=useMediaQuery(theme.breakpoints.down(800))
    const is700=useMediaQuery(theme.breakpoints.down(700))
    const is600=useMediaQuery(theme.breakpoints.down(600))
    const is488=useMediaQuery(theme.breakpoints.down(488))

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
    
        console.log('Sending coupon data:', formattedCouponData);
    
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

    useEffect(()=>{ 
        setPage(1)
    },[totalResults])

    useEffect(()=>{ 
        const finalFilters={...filters}
        finalFilters['pagination']={page:page,limit:ITEMS_PER_PAGE}
        finalFilters['sort']=sort
        dispatch(fetchProductsAsync(finalFilters))
    },[filters,sort,page])

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

    const handleBrandFilters=(e)=>{ 
        const filterSet=new Set(filters.brand)
        if(e.target.checked){filterSet.add(e.target.value)}
        else{filterSet.delete(e.target.value)}
        const filterArray = Array.from(filterSet);
        setFilters({...filters,brand:filterArray})
    }

    const handleCategoryFilters=(e)=>{ 
        const filterSet=new Set(filters.category)
        if(e.target.checked){filterSet.add(e.target.value)}
        else{filterSet.delete(e.target.value)}
        const filterArray = Array.from(filterSet);
        setFilters({...filters,category:filterArray})
    }

    const handleProductDelete=(productId)=>{ 
        dispatch(deleteProductByIdAsync(productId))
    }

    const handleProductUnDelete=(productId)=>{ 
        dispatch(undeleteProductByIdAsync(productId))
    }

    const handleFilterClose=()=>{ 
        dispatch(toggleFilters())
    }

    return (
        <>
            <motion.div 
                style={{
                    position:"fixed",
                    backgroundColor:"white",
                    height:"100vh",
                    padding:'1rem',
                    overflowY:"scroll",
                    width:is500?"100vw":"30rem",
                    zIndex:500
                }}  
                variants={{
                    show:{left:0},
                    hide:{left:-500}
                }} 
                initial={'hide'} 
                transition={{
                    ease:"easeInOut",
                    duration:.7,
                    type:"spring"
                }} 
                animate={isProductFilterOpen===true?"show":"hide"}
            >
                {/* filters section */}
                <Stack mb={'5rem'} sx={{scrollBehavior:"smooth",overflowY:"scroll"}}>
                    <Typography variant='h4'>New Arrivals</Typography>

                    <IconButton onClick={handleFilterClose} style={{position:"absolute",top:15,right:15}}>
                        <motion.div whileHover={{scale:1.1}} whileTap={{scale:0.9}}>
                            <ClearIcon fontSize='medium'/>
                        </motion.div>
                    </IconButton>

                    <Stack rowGap={2} mt={4} >
                        
                        <Typography sx={{cursor:"pointer"}} variant='body2'>Home-decorations</Typography>
                        <Typography sx={{cursor:"pointer"}} variant='body2'>Women-Jewellery</Typography>
                        <Typography sx={{cursor:"pointer"}} variant='body2'>WOmen-Bags</Typography>
                        <Typography sx={{cursor:"pointer"}} variant='body2'>Wallets</Typography>
                    </Stack>

                    {/* brand filters */}
                    <Stack mt={2}>
                        <Accordion>
                            <AccordionSummary expandIcon={<AddIcon />}>
                                <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
                                    <Typography>Brands</Typography>
                                    <Button 
                                        size="small" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenBrandDialog();
                                        }}
                                    >
                                        Add Brand
                                    </Button>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails sx={{p:0}}>
                                <FormGroup onChange={handleBrandFilters}>
                                    {brands?.map((brand)=>(
                                        <motion.div style={{width:"fit-content"}} whileHover={{x:5}} whileTap={{scale:0.9}}>
                                            <FormControlLabel 
                                                sx={{ml:1}} 
                                                control={<Checkbox whileHover={{scale:1.1}} />} 
                                                label={brand.name} 
                                                value={brand._id} 
                                            />
                                        </motion.div>
                                    ))}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>

                    {/* category filters */}
                    <Stack mt={2}>
                        <Accordion>
                            <AccordionSummary expandIcon={<AddIcon />} aria-controls="brand-filters" id="brand-filters">
                                <Typography>Category</Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{p:0}}>
                                <FormGroup onChange={handleCategoryFilters}>
                                    {categories?.map((category)=>(
                                        <motion.div style={{width:"fit-content"}} whileHover={{x:5}} whileTap={{scale:0.9}}>
                                            <FormControlLabel 
                                                sx={{ml:1}} 
                                                control={<Checkbox whileHover={{scale:1.1}} />} 
                                                label={category.name} 
                                                value={category._id} 
                                            />
                                        </motion.div>
                                    ))}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </Stack>
            </motion.div>

            <Stack rowGap={5} mt={is600?2:5} mb={'3rem'}>
                {/* sort options */}
                <Stack flexDirection={'row'} mr={'2rem'} justifyContent={'flex-end'} alignItems={'center'} columnGap={5}>
                    <Stack alignSelf={'flex-end'} width={'12rem'}>
                        <FormControl fullWidth>
                            <InputLabel id="sort-dropdown">Sort</InputLabel>
                            <Select
                                variant='standard'
                                labelId="sort-dropdown"
                                label="Sort"
                                onChange={(e)=>setSort(e.target.value)}
                                value={sort}
                            >
                                <MenuItem bgcolor='text.secondary' value={null}>Reset</MenuItem>
                                {sortOptions.map((option)=>(
                                    <MenuItem key={option} value={option}>{option.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
     
                <Grid gap={2} container flex={1} justifyContent={'center'} alignContent={"center"}>
                    {products.map((product)=>(
                        <Stack key={product._id}>
                            <Stack sx={{opacity:product.isDeleted?.7:1}}>
                                <ProductCard 
                                    id={product._id}
                                    title={product.title}
                                    thumbnail={product.thumbnail}
                                    images={product.images}
                                    brand={product.brand?.name}
                                    price={parseFloat(product.price)}
                                    stockQuantity={product.stockQuantity}
                                    isAdminCard={true}
                                />
                            </Stack>
                            <Stack 
                                paddingLeft={2} 
                                paddingRight={2} 
                                flexDirection={'row'} 
                                justifySelf={'flex-end'} 
                                alignSelf={'flex-end'} 
                                columnGap={is488?1:2}
                            >
                                <Button 
                                    component={Link} 
                                    to={`/admin/product-update/${product._id}`} 
                                    variant='contained'
                                >
                                    Update
                                </Button>
                                {product.isDeleted === true ? (
                                    <Button 
                                        onClick={()=>handleProductUnDelete(product._id)} 
                                        color='error' 
                                        variant='outlined'
                                    >
                                        Un-delete
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={()=>handleProductDelete(product._id)} 
                                        color='error' 
                                        variant='outlined'
                                    >
                                        Delete
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    ))}
                </Grid>

                <CouponManagement 
                  coupons={coupons}
                  setCoupons={setCoupons}
                  handleOpenCouponDialog={handleOpenCouponDialog}
                  handleEditCoupon={handleEditCoupon}
                  handleDeleteCoupon={handleDeleteCoupon}
                />

                <Stack alignSelf={is488?'center':'flex-end'} mr={is488?0:5} rowGap={2} p={is488?1:0}>
                    <Pagination 
                        size={is488?'medium':'large'} 
                        page={page}  
                        onChange={(e,page)=>setPage(page)} 
                        count={Math.ceil(totalResults/ITEMS_PER_PAGE)} 
                        variant="outlined" 
                        shape="rounded" 
                    />
                    <Typography textAlign={'center'}>
                        Showing {(page-1)*ITEMS_PER_PAGE+1} to {page*ITEMS_PER_PAGE>totalResults?totalResults:page*ITEMS_PER_PAGE} of {totalResults} results
                    </Typography>
                </Stack>    
            </Stack> 

            <AddBrand 
                open={openBrandDialog} 
                handleClose={handleCloseBrandDialog}
            />

            <Dialog open={openCouponDialog} onClose={handleCloseCouponDialog} maxWidth="sm" fullWidth>
              <DialogTitle>{selectedCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <TextField
                    label="Coupon Code"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    required
                    fullWidth
                  />
                  <FormControl fullWidth required>
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
                  />
                  <TextField
                    label="Minimum Purchase Amount"
                    type="number"
                    value={couponForm.minPurchase}
                    onChange={(e) => setCouponForm({ ...couponForm, minPurchase: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Maximum Discount"
                    type="number"
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Start Date"
                    type="date"
                    value={couponForm.startDate}
                    onChange={(e) => setCouponForm({ ...couponForm, startDate: e.target.value })}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={couponForm.endDate}
                    onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCouponDialog}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSubmitCoupon}>
                  {selectedCoupon ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Dialog>
        </>
    )
}