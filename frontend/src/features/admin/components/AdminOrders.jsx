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
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { noOrdersAnimation } from '../../../assets/index';
import Lottie from 'lottie-react';

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders) || []; // Provide default empty array
  const orderFetchStatus = useSelector(selectOrderFetchStatus);
  const [editIndex, setEditIndex] = useState(-1);
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);
  const theme = useTheme();
  const is1620 = useMediaQuery(theme.breakpoints.down(1620));
  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is820 = useMediaQuery(theme.breakpoints.down(820));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Debugging: Log the Redux state
  const state = useSelector((state) => state);
  console.log('Redux State:', state);

  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, [dispatch]);

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

  const handleUpdateOrder = (data) => {
    const update = { ...data, _id: orders[editIndex]._id };
    setEditIndex(-1);
    dispatch(updateOrderByIdAsync(update));
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
    if (status === 'Pending') {
      return { bgcolor: '#dfc9f7', color: '#7c59a4' };
    } else if (status === 'Dispatched') {
      return { bgcolor: '#feed80', color: '#927b1e' };
    } else if (status === 'Out for delivery') {
      return { bgcolor: '#AACCFF', color: '#4793AA' };
    } else if (status === 'Delivered') {
      return { bgcolor: '#b3f5ca', color: '#548c6a' };
    } else if (status === 'Cancelled') {
      return { bgcolor: '#fac0c0', color: '#cc6d72' };
    }
    switch(status) {
      case 'Return Requested':
        return { bgcolor: '#fff3cd', color: '#856404' };
      case 'Return Approved':
        return { bgcolor: '#d4edda', color: '#155724' };
      case 'Return Rejected':
        return { bgcolor: '#f8d7da', color: '#721c24' };
      case 'Returned':
        return { bgcolor: '#cce5ff', color: '#004085' };
    }
  };

  const ReturnRequestDetails = ({ order }) => {
    return (
      <Stack spacing={2} p={2}>
        <Typography variant="subtitle1">Return Request Details</Typography>
        <Typography>Reason: {order.returnRequest?.reason}</Typography>
        <Typography>Request Date: {new Date(order.returnRequest?.requestDate).toLocaleString()}</Typography>
        {order.returnRequest?.images?.length > 0 && (
          <Stack direction="row" spacing={1}>
            {order.returnRequest.images.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`Return image ${index + 1}`}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    );
  };

  // Add loading state handling
  if (orderFetchStatus === 'pending') {
    return (
      <Stack width="100%" height="100vh" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  // Add error state handling
  if (orderFetchStatus === 'rejected') {
    return (
      <Stack width="100%" height="50vh" justifyContent="center" alignItems="center">
        <Typography color="error">Failed to load orders. Please try again.</Typography>
        <Button onClick={() => dispatch(getAllOrdersAsync())}>Retry</Button>
      </Stack>
    );
  }

  return (
    <Stack justifyContent={'center'} alignItems={'center'}>
      <Stack mt={5} mb={3} component={'form'} noValidate onSubmit={handleSubmit(handleUpdateOrder)}>
        {orders && orders.length > 0 ? (
          <TableContainer sx={{ width: is1620 ? '95vw' : 'auto', overflowX: 'auto' }} component={Paper} elevation={2}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell align="left">Id</TableCell>
                  <TableCell align="left">Item</TableCell>
                  <TableCell align="right">Total Amount</TableCell>
                  <TableCell align="right">Shipping Address</TableCell>
                  <TableCell align="right">Payment Method</TableCell>
                  <TableCell align="right">Order Date</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{index}</TableCell>
                    <TableCell align="right">{order._id}</TableCell>
                    <TableCell align="right">
                      {order.item.map((product) => (
                        <Stack mt={2} flexDirection={'row'} alignItems={'center'} columnGap={2}>
                          <Avatar src={product.product.thumbnail}></Avatar>
                          <Typography>{product.product.title}</Typography>
                        </Stack>
                      ))}
                    </TableCell>
                    <TableCell align="right">{order.total}</TableCell>
                    <TableCell align="right">
                      <Stack>
                        {order.address && Array.isArray(order.address) && order.address.length > 0 ? (
                          <>
                            <Typography>{order.address[0].street || 'N/A'}</Typography>
                            <Typography>{order.address[0].city || 'N/A'}</Typography>
                            <Typography>{order.address[0].state || 'N/A'}</Typography>
                            <Typography>{order.address[0].postalCode || 'N/A'}</Typography>
                          </>
                        ) : (
                          <Typography>Address not provided</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{order.paymentMode}</TableCell>
                    <TableCell align="right">{new Date(order.createdAt).toDateString()}</TableCell>
                    {/* Order status */}
                    <TableCell align="right">
                      {editIndex === index ? (
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Update status</InputLabel>
                          <Select
                            defaultValue={order.status}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Update status"
                            {...register('status', { required: 'Status is required' })}
                          >
                            {editOptions.map((option) => (
                              <MenuItem value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip label={order.status} sx={getStatusColor(order.status)} />
                      )}
                    </TableCell>
                    {/* Actions */}
                    <TableCell align="right">
                      {editIndex === index ? (
                        <Button>
                          <IconButton type="submit">
                            <CheckCircleOutlinedIcon />
                          </IconButton>
                        </Button>
                      ) : (
                        <IconButton onClick={() => setEditIndex(index)}>
                          <EditOutlinedIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.returnRequest?.status !== 'None' && (
                        <ReturnRequestDetails order={order} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack width={is480 ? 'auto' : '30rem'} justifyContent={'center'}>
            <Stack rowGap={'1rem'}>
              <Lottie animationData={noOrdersAnimation} />
              <Typography textAlign={'center'} alignSelf={'center'} variant="h6" fontWeight={400}>
                There are no orders currently
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};