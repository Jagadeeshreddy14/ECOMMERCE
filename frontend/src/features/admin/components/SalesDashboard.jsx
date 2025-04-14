import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Stack, CircularProgress, Box, Avatar, useTheme, FormControl, InputLabel, Select, MenuItem, Button, TextField, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, List, ListItem, ListItemAvatar, ListItemText
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, selectProducts } from '../../product/productSlice';
import { getAllOrdersAsync, selectOrders } from '../../order/OrderSlice';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
}));

const StyledMetricCard = styled(StyledPaper)(({ theme, color }) => ({
  borderLeft: `4px solid ${color}`,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Time');
  const [dateRange, setDateRange] = useState([null, null]);
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        dispatch(fetchProducts()),
        dispatch(getAllOrdersAsync()),
      ]);
      setLoading(false);
    };
    loadData();
  }, [dispatch]);

  // Filter orders based on the selected filter or date range
  const today = new Date();
  const todayDateString = today.toDateString();
  const currentMonth = today.getMonth();

  let filteredOrders = orders;
  if (filter === 'Today') {
    filteredOrders = orders.filter(order => new Date(order.createdAt).toDateString() === todayDateString);
  } else if (filter === 'This Month') {
    filteredOrders = orders.filter(order => new Date(order.createdAt).getMonth() === currentMonth);
  } else if (dateRange[0] && dateRange[1]) {
    filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= dateRange[0] && orderDate <= dateRange[1];
    });
  }

  // Apply product category filter
  if (productCategoryFilter !== 'All') {
    filteredOrders = filteredOrders.filter(order => {
      return order.products.some(product => product.category === productCategoryFilter);
    });
  }

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const highestSale = Math.max(...filteredOrders.map(order => order.total), 0);
  const lowestSale = Math.min(...filteredOrders.map(order => order.total), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const salesDistribution = [
    { name: 'Highest Sale', value: highestSale },
    { name: 'Lowest Sale', value: lowestSale },
    { name: 'Medium Sale', value: averageOrderValue },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

  const handleExport = () => {
    const csvData = filteredOrders.map(order => ({
      OrderID: order._id,
      Total: order.total,
      Date: new Date(order.createdAt).toLocaleDateString(),
      Status: order.status,
    }));
    const csvContent = [
      ['OrderID', 'Total', 'Date', 'Status'],
      ...csvData.map(row => Object.values(row)),
    ]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sales_data.csv';
    link.click();
  };

  // Generate revenue trend data (Weekly)
  const revenueTrendData = () => {
    const weeklyData = [];
    const startDate = new Date(Math.min(...filteredOrders.map(order => new Date(order.createdAt))));
    const endDate = new Date();
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const weekEndDate = new Date(currentDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      const weeklyOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= currentDate && orderDate <= weekEndDate;
      });

      const weeklyRevenue = weeklyOrders.reduce((sum, order) => sum + order.total, 0);

      weeklyData.push({
        date: `${currentDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`,
        revenue: weeklyRevenue,
      });

      currentDate = new Date(weekEndDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weeklyData;
  };

  // Top Selling Products
  const topSellingProducts = [...products].sort((a, b) => b.stockQuantity - a.stockQuantity).slice(0, 5);

  // New vs Returning Customers (Placeholder - needs actual customer data)
  const newVsReturningCustomers = [
    { name: 'New Customers', value: 300 },
    { name: 'Returning Customers', value: 450 },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(order => ({
    ...order,
      products: order.products ? order.products.map(product => {
        const productDetail = products.find(p => p._id === product._id);
        return {
            ...product,
            name: productDetail ? productDetail.title : 'Unknown Product'
        };
    }) : []
  }));

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress size={60} />
      </Stack>
    );
  }

  return (
    <Stack spacing={3} p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Sales Analytics Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText="Start Date"
              endText="End Date"
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} size="small" />
                  <Box sx={{ mx: 2 }}>to</Box>
                  <TextField {...endProps} size="small" />
                </>
              )}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Box display="flex" justifyContent="flex-start" alignItems="center" spacing={2}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Time Period</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Time Period"
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="All Time">All Time</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small">
          <InputLabel>Product Category</InputLabel>
          <Select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            label="Product Category"
          >
            <MenuItem value="All">All</MenuItem>
            {[...new Set(products.map(product => product.category))].map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color={theme.palette.primary.main}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                <MonetizationOnIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">{`₹${totalRevenue.toFixed(2)}`}</Typography>
                <Typography variant="subtitle2">Total Revenue</Typography>
              </Box>
            </Stack>
          </StyledMetricCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color={theme.palette.info.main}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                <ShoppingCartIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">{totalOrders}</Typography>
                <Typography variant="subtitle2">Total Orders</Typography>
              </Box>
            </Stack>
          </StyledMetricCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color={theme.palette.success.main}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">{`₹${averageOrderValue.toFixed(2)}`}</Typography>
                <Typography variant="subtitle2">Average Order Value</Typography>
              </Box>
            </Stack>
          </StyledMetricCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledMetricCard color={theme.palette.warning.main}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                <TrendingDownIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">{lowestSale.toFixed(2)}</Typography>
                <Typography variant="subtitle2">Lowest Sale</Typography>
              </Box>
            </Stack>
          </StyledMetricCard>
        </Grid>
      </Grid>

      {/* Revenue Trend Chart */}
      <StyledPaper>
        <Typography variant="h6" gutterBottom>Revenue Trend (Weekly)</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueTrendData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `₹${value.toFixed(2)}`} />
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </StyledPaper>

      {/* Sales Distribution Pie Chart */}
      <StyledPaper>
        <Typography variant="h6" gutterBottom>Sales Distribution</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={salesDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              paddingAngle={5}
              label={({ name, value, percent }) => `${name}: ₹${value.toFixed(2)} (${(percent * 100).toFixed(0)}%)`}
            >
              {salesDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </StyledPaper>

      {/* Top Selling Products */}
      <StyledPaper>
        <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
        <List>
          {topSellingProducts.map(product => (
            <ListItem key={product._id}>
              <ListItemAvatar>
                <Avatar alt={product.title} src={product.imageUrl} />
              </ListItemAvatar>
              <ListItemText primary={product.title} secondary={`Stock: ${product.stockQuantity}`} />
            </ListItem>
          ))}
        </List>
      </StyledPaper>

      {/* New vs Returning Customers */}
      <StyledPaper>
        <Typography variant="h6" gutterBottom>New vs Returning Customers</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={newVsReturningCustomers}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={theme.palette.primary.main}
              label
            >
              {newVsReturningCustomers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </StyledPaper>

      {/* Sales Data Table */}
      <StyledPaper>
        <Typography variant="h6" gutterBottom>Sales Data</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Products</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map(order => (
                <TableRow key={order._id}>
                  <TableCell component="th" scope="row">{order._id}</TableCell>
                  <TableCell>
                    <List>
                      {order.products && Array.isArray(order.products) ? (
                        order.products.map(product => (
                          <ListItem key={product._id}>
                            <ListItemText primary={product.name} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="No Products" />
                        </ListItem>
                      )}
                    </List>
                  </TableCell>
                  <TableCell align="right">₹{order.total.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
    </Stack>  
  );
};

export default SalesDashboard;