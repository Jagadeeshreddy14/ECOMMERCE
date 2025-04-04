import {
    Stack,
    Typography,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton,
    Paper
  } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  
  export const CouponManagement = ({ coupons, setCoupons, handleOpenCouponDialog, handleEditCoupon, handleDeleteCoupon }) => {
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