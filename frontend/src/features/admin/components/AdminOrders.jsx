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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { noOrdersAnimation } from '../../../assets/index';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders) || [];
  const orderFetchStatus = useSelector(selectOrderFetchStatus);
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const theme = useTheme();
  const is1620 = useMediaQuery(theme.breakpoints.down(1620));
  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is820 = useMediaQuery(theme.breakpoints.down(820));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.paymentMode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.address && order.address[0]?.street?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    order.item.some(item => 
      item.product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    dispatch(getAllOrdersAsync())
      .unwrap()
      .catch(error => {
        if (error.message?.includes('Please login')) {
          navigate('/login');
        }
        toast.error(error.message || 'Failed to fetch orders');
      });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (orderUpdateStatus === 'fulfilled') {
      toast.success('Status updated');
    } else if (orderUpdateStatus === 'rejected') {
      toast.error('Error updating order status');
    }
  }, [orderUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetOrderUpdateStatus());
    };
  }, []);

  const handleUpdateOrder = async (data) => {
    try {
      const update = { ...data, _id: filteredOrders[editIndex]._id };
      await dispatch(updateOrderByIdAsync(update)).unwrap();
      setEditIndex(-1);
      toast.success('Order updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update order');
      if (error.message?.includes('Unauthorized')) {
        navigate('/login');
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const editOptions = [
    'Pending', 
    'Dispatched', 
    'Out for delivery', 
    'Delivered', 
    'Cancelled',
    'Return Requested',
    'Return Approved',
    'Return Rejected',
    'Returned'
  ];

  const getStatusColor = (status) => {
    const colors = {
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
    return colors[status] || { bgcolor: '#F5F5F5', color: '#616161' };
  };

  const ReturnRequestDetails = ({ order }) => {
    if (!order.returnRequest || order.returnRequest.status === 'None') return null;
    
    return (
      <Box sx={{ 
        backgroundColor: '#FAFAFA', 
        borderRadius: 1, 
        p: 2, 
        mt: 1,
        borderLeft: '4px solid #5C6BC0'
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
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
                    alt={`Return image ₹{index + 1}`}
                    style={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: 4,
                      border: '1px solid #e0e0e0'
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

  if (orderFetchStatus === 'pending') {
    return (
      <Stack width="100%" height="100vh" justifyContent="center" alignItems="center">
        <CircularProgress size={60} thickness={4} sx={{ color: '#5C6BC0' }} />
      </Stack>
    );
  }

  if (orderFetchStatus === 'rejected') {
    return (
      <Stack width="100%" height="50vh" justifyContent="center" alignItems="center" spacing={2}>
        <Typography color="error" variant="h6">
          Failed to load orders
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => dispatch(getAllOrdersAsync())}
          sx={{
            backgroundColor: '#5C6BC0',
            '&:hover': { backgroundColor: '#3949AB' }
          }}
        >
          Retry
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ p: is480 ? 1 : 3 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems="center"
        mb={3}
        spacing={2}
      >
        <Typography variant="h4" sx={{ 
          fontWeight: 600,
          color: '#3F51B5',
          textAlign: is480 ? 'center' : 'left'
        }}>
          Order Management
        </Typography>
        
        <TextField
          variant="outlined"
          placeholder="Search orders..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            endAdornment: searchTerm && (
              <IconButton onClick={() => setSearchTerm('')} size="small">
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: '#F5F5F5',
              minWidth: is480 ? '100%' : 300
            }
          }}
        />
      </Stack>

      <Stack component={'form'} noValidate onSubmit={handleSubmit(handleUpdateOrder)}>
        {filteredOrders && filteredOrders.length > 0 ? (
          <Paper elevation={3} sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            border: '1px solid #E0E0E0'
          }}>
            <TableContainer sx={{ 
              maxHeight: '75vh',
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#BDBDBD',
                borderRadius: 4
              }
            }}>
              <Table stickyHeader aria-label="orders table">
                <TableHead>
                  <TableRow sx={{ 
                    '& th': { 
                      backgroundColor: '#3F51B5', 
                      color: 'white',
                      fontWeight: 600
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
                        '&:nth-of-type(even)': { backgroundColor: '#FAFAFA' },
                        '&:hover': { backgroundColor: '#F5F5F5' }
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Tooltip title={order._id} placement="top">
                          <Typography variant="body2" noWrap>
                            {order._id}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          {order.item.map((product, idx) => (
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
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>
                          ₹{order.total.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ maxWidth: 150 }}>
                        <Button 
                          variant="text" 
                          size="small"
                          onClick={() => handleViewDetails(order)}
                          sx={{ textTransform: 'none' }}
                        >
                          View Address
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={order.paymentMode} 
                          size="small"
                          sx={{ 
                            backgroundColor: order.paymentMode === 'COD' ? '#E8F5E9' : '#E3F2FD',
                            color: order.paymentMode === 'COD' ? '#2E7D32' : '#1565C0'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {editIndex === index ? (
                          <FormControl fullWidth size="small">
                            <InputLabel>Update status</InputLabel>
                            <Select
                              defaultValue={order.status}
                              label="Update status"
                              {...register('status', { required: 'Status is required' })}
                              sx={{ minWidth: 150 }}
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
                                <CheckCircleOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Edit status">
                              <IconButton 
                                onClick={() => setEditIndex(index)}
                                color="primary"
                                size="small"
                              >
                                <EditOutlinedIcon />
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
              backgroundColor: '#FAFAFA', 
              borderRadius: 2, 
              p: 4,
              border: '1px dashed #BDBDBD'
            }}
          >
            <Box sx={{ width: is480 ? 200 : 300 }}>
              <Lottie animationData={noOrdersAnimation} loop={false} />
            </Box>
            <Typography variant="h6" textAlign="center" color="text.secondary">
              {searchTerm ? 
                'No orders match your search criteria' : 
                'There are no orders currently'}
            </Typography>
            {searchTerm && (
              <Button 
                variant="outlined" 
                onClick={() => setSearchTerm('')}
                startIcon={<ClearIcon />}
              >
                Clear search
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          backgroundColor: '#3F51B5', 
          color: 'white',
          fontWeight: 600
        }}>
          Order Details
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {selectedOrder && (
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1">
                  <strong>Order ID:</strong> {selectedOrder._id}
                </Typography>
                <Chip 
                  label={selectedOrder.status} 
                  sx={getStatusColor(selectedOrder.status)}
                />
              </Stack>

              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Shipping Address
                </Typography>
                {selectedOrder.address && selectedOrder.address[0] ? (
                  <Stack spacing={0.5}>
                    <Typography>{selectedOrder.address[0].street}</Typography>
                    <Typography>
                      {selectedOrder.address[0].city}, {selectedOrder.address[0].state}
                    </Typography>
                    <Typography>{selectedOrder.address[0].postalCode}</Typography>
                    <Typography>{selectedOrder.address[0].country}</Typography>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">Address not available</Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Payment Information
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Typography>
                    <strong>Method:</strong> {selectedOrder.paymentMode}
                  </Typography>
                  <Typography>
                    <strong>Amount:</strong> ₹{selectedOrder.total.toFixed(2)}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Items
                </Typography>
                <Stack spacing={2}>
                  {selectedOrder.item.map((item, idx) => (
                    <Stack key={idx} direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        src={item.product.thumbnail} 
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={600}>{item.product.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          Price:₹{item.product.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography fontWeight={600}>
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <ReturnRequestDetails order={selectedOrder} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{ backgroundColor: '#3F51B5' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};