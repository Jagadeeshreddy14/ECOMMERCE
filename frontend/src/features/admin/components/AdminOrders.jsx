import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllOrdersAsync,
  resetOrderUpdateStatus,
  selectOrderUpdateStatus,
  selectOrders,
  updateOrderByIdAsync,
  selectOrderFetchStatus,
} from '../../order/OrderSlice';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircleOutlined,
  Clear,
  EditOutlined,
  FilterList,
  LocalShipping,
  LocationOn,
  Payment,
  Search,
  ShoppingBasket
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Lottie from 'lottie-react';
import { noOrdersAnimation } from '../../../assets/index';

// Custom color palette
const colors = {
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  secondary: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  background: '#F9FAFB',
  paper: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  grey100: '#F3F4F6',
  grey200: '#E5E7EB'
};

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders) || [];
  const orderFetchStatus = useSelector(selectOrderFetchStatus);
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);
  
  // State management
  const [editIndex, setEditIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);

  const { register, handleSubmit, reset } = useForm();
  const isMobile = useMediaQuery('(max-width:600px)');

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.paymentMode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.address?.[0]?.street?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.item.some(item => 
        item.product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentMode === paymentFilter;
    
    const orderDate = new Date(order.createdAt);
    const [startDate, endDate] = dateRange;
    const matchesDateRange = 
      (!startDate || orderDate >= new Date(startDate)) && 
      (!endDate || orderDate <= new Date(endDate));

    return matchesSearch && matchesStatus && matchesPayment && matchesDateRange;
  });

  // Count orders by status for tabs
  const orderCounts = orders.reduce((acc, order) => {
    acc.all++;
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, { all: 0 });

  // Status and payment options
  const statusOptions = ['all', 'Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled'];
  const paymentOptions = ['all', 'COD', 'Card', 'NetBanking', 'UPI'];
  const editOptions = ['Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled'];

  // Fetch orders on mount
  useEffect(() => {
    dispatch(getAllOrdersAsync())
      .unwrap()
      .catch(error => {
        if (error.message?.includes('Please login')) navigate('/login');
        toast.error(error.message || 'Failed to fetch orders');
      });
  }, [dispatch, navigate]);

  // Handle order update notifications
  useEffect(() => {
    if (orderUpdateStatus === 'fulfilled') {
      toast.success('Order status updated successfully');
      setEditIndex(-1); // Close edit mode after successful update
      reset(); // Reset form
    } else if (orderUpdateStatus === 'rejected') {
      toast.error('Failed to update order status');
    }
    return () => dispatch(resetOrderUpdateStatus());
  }, [orderUpdateStatus, dispatch, reset]);

  // Status color mapping
  const getStatusColor = (status) => {
    const colorMap = {
      'Pending': { bgcolor: '#FFF3E0', color: '#E65100' },
      'Dispatched': { bgcolor: '#E1F5FE', color: '#0288D1' },
      'Out for delivery': { bgcolor: '#E8F5E9', color: '#388E3C' },
      'Delivered': { bgcolor: '#E8F5E9', color: '#2E7D32' },
      'Cancelled': { bgcolor: '#FFEBEE', color: '#C62828' },
      'Return Requested': { bgcolor: '#FFF8E1', color: '#FF8F00' },
      'Return Approved': { bgcolor: '#E0F7FA', color: '#00ACC1' },
      'Return Rejected': { bgcolor: '#FCE4EC', color: '#AD1457' },
      'Returned': { bgcolor: '#EDE7F6', color: '#5E35B1' }
    };
    return colorMap[status] || { bgcolor: colors.grey100, color: colors.textSecondary };
  };

  // Handle order status update
  const handleUpdateOrder = async (data) => {
    try {
      const orderToUpdate = filteredOrders[editIndex];
      if (!orderToUpdate) {
        toast.error('No order selected for update');
        return;
      }

      const update = { ...data, _id: orderToUpdate._id };
      await dispatch(updateOrderByIdAsync(update)).unwrap();

      // Show success message
      toast.success('Order status updated successfully');

      // Wait for 5 seconds before closing the edit mode
      setTimeout(() => {
        setEditIndex(-1);
        reset();
      }, 100000);

    } catch (error) {
      toast.error(error.message || 'Failed to update order');
      if (error.message?.includes('Unauthorized')) navigate('/login');
    }
  };

  // View order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  // Tab change handler
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setStatusFilter(newValue === 'all' ? 'all' : newValue);
    setEditIndex(-1); // Reset editIndex
  };

  // Filter change handler
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') setStatusFilter(value);
    if (filterType === 'payment') setPaymentFilter(value);
    if (filterType === 'dateRange') setDateRange(value);
    setEditIndex(-1); // Reset editIndex
  };

  // Return request details component
  const ReturnRequestDetails = ({ order }) => {
    if (!order.returnRequest || order.returnRequest.status === 'None') return null;
    
    return (
      <Box sx={{ 
        backgroundColor: colors.grey100, 
        borderRadius: 1, 
        p: 2, 
        mt: 2,
        borderLeft: `4px solid ${colors.primary}`
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: colors.textPrimary }}>
          Return Request Details
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Reason:</strong> {order.returnRequest?.reason || 'Not specified'}
          </Typography>
          <Typography variant="body2">
            <strong>Request Date:</strong> {new Date(order.returnRequest?.requestDate).toLocaleString()}
          </Typography>
          {order.returnRequest?.images?.length > 0 && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Images:</Typography>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1 }}>
                {order.returnRequest.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image}
                    alt={`Return image ${index + 1}`}
                    style={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: 4,
                      border: `1px solid ${colors.border}`
                    }}
                  />
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    );
  };

  // Loading state
  if (orderFetchStatus === 'pending') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: colors.background
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: colors.primary }} />
      </Box>
    );
  }

  // Error state
  if (orderFetchStatus === 'rejected') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        gap: 2,
        backgroundColor: colors.background
      }}>
        <Typography variant="h6" color="error">
          Failed to load orders
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => dispatch(getAllOrdersAsync())}
          sx={{
            backgroundColor: colors.primary,
            '&:hover': { backgroundColor: colors.primaryLight }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 3, 
      backgroundColor: colors.background, 
      minHeight: '100vh'
    }}>
      {/* Header and Search */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems="center"
        mb={3}
        gap={2}
      >
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: colors.primary,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          Order Management
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center" width={isMobile ? '100%' : 'auto'}>
          <TextField
            variant="outlined"
            placeholder="Search orders..."
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setEditIndex(-1); // Close edit mode when searching
            }}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              endAdornment: searchTerm && (
                <IconButton 
                  onClick={() => {
                    setSearchTerm('');
                    setEditIndex(-1);
                  }} 
                  size="small"
                >
                  <Clear fontSize="small" />
                </IconButton>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: colors.paper,
                width: isMobile ? '100%' : 300,
              }
            }}
          />
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            onClick={() => {
              setShowFilters(!showFilters);
              setEditIndex(-1); // Close edit mode when toggling filters
            }}
            sx={{
              borderRadius: 2,
              borderColor: colors.border,
              color: colors.textSecondary,
              '&:hover': {
                borderColor: colors.primary,
                color: colors.primary
              }
            }}
          >
            Filters
          </Button>
        </Stack>
      </Stack>

      {/* Filters Section */}
      {showFilters && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: colors.paper,
          border: `1px solid ${colors.border}`,
        }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: colors.textPrimary }}>
            Filter Orders
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option === 'all' ? 'All Statuses' : option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentFilter}
                  onChange={(e) => handleFilterChange('payment', e.target.value)}
                  label="Payment Method"
                >
                  {paymentOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option === 'all' ? 'All Methods' : option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <DatePicker
                    label="Start date"
                    value={dateRange[0]}
                    onChange={(newValue) => handleFilterChange('dateRange', [newValue, dateRange[1]])}
                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                  />
                  <Typography variant="body2">to</Typography>
                  <DatePicker
                    label="End date"
                    value={dateRange[1]}
                    onChange={(newValue) => handleFilterChange('dateRange', [dateRange[0], newValue])}
                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                    minDate={dateRange[0]}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Status Tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: colors.primary,
              height: 3
            }
          }}
        >
          <Tab 
            label={
              <Badge badgeContent={orderCounts.all} color="primary" max={999}>
                <Typography sx={{ px: 1 }}>All</Typography>
              </Badge>
            } 
            value="all"
            sx={{
              textTransform: 'none',
              minWidth: 'unset',
              '&.Mui-selected': { color: colors.primary }
            }}
          />
          {statusOptions.slice(1).map((status) => (
            <Tab 
              key={status}
              label={
                <Badge badgeContent={orderCounts[status] || 0} color="primary" max={999}>
                  <Typography sx={{ px: 1 }}>{status}</Typography>
                </Badge>
              }
              value={status}
              sx={{
                textTransform: 'none',
                minWidth: 'unset',
                '&.Mui-selected': { color: colors.primary }
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Orders Table */}
      <Stack component="form" noValidate onSubmit={handleSubmit(handleUpdateOrder)}>
        {filteredOrders.length > 0 ? (
          <Paper elevation={0} sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.paper,
          }}>
            <TableContainer sx={{ 
              maxHeight: '65vh',
              '&::-webkit-scrollbar': { width: 8, height: 8 },
              '&::-webkit-scrollbar-thumb': { backgroundColor: colors.grey200, borderRadius: 4 }
            }}>
              <Table stickyHeader aria-label="orders table">
                <TableHead>
                  <TableRow sx={{ 
                    '& th': { 
                      backgroundColor: colors.primary, 
                      color: colors.paper,
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }
                  }}>
                    <TableCell>#</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell align="right">Payment</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order, index) => (
                    <TableRow 
                      key={order._id} 
                      hover
                      sx={{ 
                        '&:nth-of-type(even)': { backgroundColor: colors.grey100 },
                        '&:hover': { backgroundColor: colors.grey200 }
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ maxWidth: 150 }}>
                        <Tooltip title={order._id} placement="top">
                          <Typography variant="body2" noWrap sx={{ color: colors.textPrimary }}>
                            {order._id.substring(0, 8)}...
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          {order.item.slice(0, 2).map((product, idx) => (
                            <Stack key={idx} direction="row" alignItems="center" spacing={1}>
                              <Avatar 
                                src={product.product.thumbnail} 
                                sx={{ width: 40, height: 40 }}
                              />
                              <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                {product.product.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                (x{product.quantity})
                              </Typography>
                            </Stack>
                          ))}
                          {order.item.length > 2 && (
                            <Typography variant="caption" color="text.secondary">
                              +{order.item.length - 2} more items
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>
                          ₹{order.total.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          variant="text" 
                          size="small"
                          onClick={() => handleViewDetails(order)}
                          sx={{ 
                            textTransform: 'none',
                            color: colors.primary,
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={order.paymentMode} 
                          size="small"
                          sx={{ 
                            backgroundColor: order.paymentMode === 'COD' ? '#E8F5E9' : '#E3F2FD',
                            color: order.paymentMode === 'COD' ? '#2E7D32' : '#1565C0',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {editIndex === index ? (
                          <FormControl fullWidth size="small">
                            <Select
                              defaultValue={order.status}
                              {...register('status', { required: true })}
                              sx={{ 
                                minWidth: 150,
                                '& .MuiSelect-select': { py: 0.65 }
                              }}
                            >
                              {editOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Chip 
                            label={order.status} 
                            sx={getStatusColor(order.status)}
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {editIndex === index ? (
                            <Tooltip title="Confirm">
                              <IconButton 
                                type="submit"
                                color="success"
                                size="small"
                              >
                                <CheckCircleOutlined />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Edit status">
                              <IconButton 
                                onClick={() => setEditIndex(index)} // Automatically set editIndex
                                color="primary"
                                size="small"
                              >
                                <EditOutlined />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <Stack 
            alignItems="center" 
            justifyContent="center" 
            spacing={3}
            sx={{ 
              backgroundColor: colors.paper, 
              borderRadius: 2, 
              p: 4,
              border: `1px dashed ${colors.border}`,
            }}
          >
            <Box sx={{ width: isMobile ? 200 : 300 }}>
              <Lottie animationData={noOrdersAnimation} loop={false} />
            </Box>
            <Typography variant="h6" textAlign="center" color="text.secondary">
              {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || dateRange.some(Boolean) ? 
                'No orders match your filters' : 
                'No orders found'}
            </Typography>
            {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || dateRange.some(Boolean)) && (
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                  setDateRange([null, null]);
                  setActiveTab('all');
                }}
                startIcon={<Clear />}
                sx={{
                  borderColor: colors.border,
                  '&:hover': {
                    borderColor: colors.primary,
                  }
                }}
              >
                Clear filters
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      {/* Order Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: colors.primary, 
          color: colors.paper,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LocalShipping fontSize="small" />
          <Typography variant="h6">Order Details</Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {selectedOrder && (
            <Stack spacing={3}>
              {/* Order ID and Status */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">
                  <strong>Order ID:</strong> {selectedOrder._id}
                </Typography>
                <Chip 
                  label={selectedOrder.status} 
                  sx={getStatusColor(selectedOrder.status)}
                />
              </Stack>

              <Divider />

              {/* Shipping Address */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <LocationOn fontSize="small" />
                  Shipping Address
                </Typography>
                {selectedOrder.address?.[0] ? (
                  <Stack spacing={0.5} sx={{ 
                    backgroundColor: colors.grey100, 
                    p: 2, 
                    borderRadius: 1 
                  }}>
                    <Typography>{selectedOrder.address[0].street}</Typography>
                    <Typography>
                      {selectedOrder.address[0].city}, {selectedOrder.address[0].state}
                    </Typography>
                    <Typography>{selectedOrder.address[0].postalCode}</Typography>
                    <Typography>{selectedOrder.address[0].country}</Typography>
                    <Typography mt={1}>
                      <strong>Phone:</strong> {selectedOrder.address[0].phone}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">Address not available</Typography>
                )}
              </Box>

              <Divider />

              {/* Payment Information */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Payment fontSize="small" />
                  Payment Information
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 3 }}
                  sx={{ 
                    backgroundColor: colors.grey100, 
                    p: 2, 
                    borderRadius: 1 
                  }}
                >
                  <Typography>
                    <strong>Method:</strong> {selectedOrder.paymentMode}
                  </Typography>
                  <Typography>
                    <strong>Amount:</strong> ₹{selectedOrder.total.toFixed(2)}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {selectedOrder.paymentStatus || 'Completed'}
                  </Typography>
                </Stack>
              </Box>

              <Divider />

              {/* Order Items */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <ShoppingBasket fontSize="small" />
                  Order Items ({selectedOrder.item.length})
                </Typography>
                <Stack spacing={2}>
                  {selectedOrder.item.map((item, idx) => (
                    <Paper 
                      key={idx} 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        borderRadius: 1,
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.grey100
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          src={item.product.thumbnail} 
                          sx={{ width: 60, height: 60 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600}>
                            {item.product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography variant="body2">
                            Price: ₹{item.product.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Typography fontWeight={600}>
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              {/* Return Request Details */}
              <ReturnRequestDetails order={selectedOrder} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{ 
              backgroundColor: colors.primary,
              '&:hover': {
                backgroundColor: colors.primaryLight
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};