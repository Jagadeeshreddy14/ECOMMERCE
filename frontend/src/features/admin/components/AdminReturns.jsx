// frontend/src/features/admin/components/AdminReturns.jsx
import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Stack, Typography, Button, Select, 
  MenuItem, FormControl, InputLabel, CircularProgress 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReturnsAsync, updateReturnStatusAsync } from '../../returns/ReturnSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const AdminReturns = () => {
  const dispatch = useDispatch();
  const returns = useSelector(state => state.return.returns);
  const [selectedReturn, setSelectedReturn] = useState(null);

  useEffect(() => {
    dispatch(getAllReturnsAsync());
  }, [dispatch]);

  const handleStatusUpdate = (returnId, newStatus) => {
    dispatch(updateReturnStatusAsync({ 
      returnId, 
      status: newStatus 
    }));
    toast.success('Return status updated');
  };

  return (
    <Stack spacing={3} p={3}>
      <Typography variant="h4">Return Orders Management</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Return ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returns.map((returnOrder) => (
              <TableRow key={returnOrder._id}>
                <TableCell>{returnOrder._id}</TableCell>
                <TableCell>{returnOrder.order}</TableCell>
                <TableCell>{returnOrder.user.name}</TableCell>
                <TableCell>{returnOrder.reason}</TableCell>
                <TableCell>
                  {returnOrder.images.map((img, idx) => (
                    <img 
                      src={img} 
                      alt={`Return image ${idx + 1}`} 
                      style={{ width: 50, height: 50, marginRight: 5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>{returnOrder.status}</TableCell>
                <TableCell>
                  <FormControl>
                    <Select
                      value={returnOrder.status}
                      onChange={(e) => handleStatusUpdate(returnOrder._id, e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};