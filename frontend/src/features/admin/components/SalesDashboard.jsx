import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Stack, CircularProgress, Box, Avatar, useTheme, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, selectProducts } from '../../product/productSlice';
import { getAllOrdersAsync, selectOrders } from '../../order/OrderSlice';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Utility function to format prices in INR
const formatPriceInINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Time'); // Filter state

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

  // Calculate metrics based on the selected filter
  const today = new Date();
  const todayDateString = today.toDateString();
  const currentMonth = today.getMonth();

  let filteredOrders = orders;
  if (filter === 'Today') {
    filteredOrders = orders.filter(order => new Date(order.createdAt).toDateString() === todayDateString);
  } else if (filter === 'This Month') {
    filteredOrders = orders.filter(order => new Date(order.createdAt).getMonth() === currentMonth);
  }

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const highestSale = Math.max(...filteredOrders.map(order => order.total), 0);
  const lowestSale = Math.min(...filteredOrders.map(order => order.total), 0);
  const mediumSale = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

  const salesDistribution = [
    { name: 'Highest Sale', value: highestSale },
    { name: 'Lowest Sale', value: lowestSale },
    { name: 'Medium Sale', value: mediumSale },
  ];

  // Calculate sales by category (using product name)
  const categorySales = products.reduce((acc, product) => {
    const category = product.category || 'Unknown';
    acc[category] = acc[category] || {};
    acc[category][product.title] = (acc[category][product.title] || 0) + product.price * product.stockQuantity;
    return acc;
  }, {});

  const categorySalesData = Object.entries(categorySales).flatMap(([category, products]) =>
    Object.entries(products).map(([productName, value]) => ({
      category,
      productName,
      value,
    }))
  );

  // Calculate sales by brand (using product name)
  const brandSales = products.reduce((acc, product) => {
    const brand = product.brand?.name || 'Unknown';
    acc[brand] = acc[brand] || {};
    acc[brand][product.title] = (acc[brand][product.title] || 0) + product.price * product.stockQuantity;
    return acc;
  }, {});

  const brandSalesData = Object.entries(brandSales).flatMap(([brand, products]) =>
    Object.entries(products).map(([productName, value]) => ({
      brand,
      productName,
      value,
    }))
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress size={60} />
      </Stack>
    );
  }

  return (
    <Stack spacing={3} p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Sales Analytics Dashboard
        </Typography>
        {/* Filter Dropdown */}
        <FormControl variant="outlined" size="small">
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="All Time">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={formatPriceInINR(totalRevenue)}
            icon={<TrendingUpIcon fontSize="large" />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Highest Sale"
            value={formatPriceInINR(highestSale)}
            icon={<TrendingUpIcon fontSize="large" />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Lowest Sale"
            value={formatPriceInINR(lowestSale)}
            icon={<TrendingDownIcon fontSize="large" />}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Medium Sale"
            value={formatPriceInINR(mediumSale)}
            icon={<EqualizerIcon fontSize="large" />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Sales Distribution Pie Chart */}
      <Paper sx={{ p: 3 }}>
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
              label={({ name, value }) => `${name}: ${formatPriceInINR(value)}`}
            >
              {salesDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatPriceInINR(value)} />
          </PieChart>
        </ResponsiveContainer>
      </Paper>

      {/* Sales by Category Bar Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Sales by Category</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categorySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => formatPriceInINR(value)} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Sales by Category (Product Name) Bar Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Sales by Category (Product Name)</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categorySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" />
            <YAxis />
            <Tooltip formatter={(value) => formatPriceInINR(value)} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Sales by Brand Bar Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Sales by Brand</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={brandSalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip formatter={(value) => formatPriceInINR(value)} />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Sales by Brand (Product Name) Bar Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Sales by Brand (Product Name)</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={brandSalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" />
            <YAxis />
            <Tooltip formatter={(value) => formatPriceInINR(value)} />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Stack>
  );
};

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
          <Typography variant="h4" mt={1} fontWeight="bold">{value}</Typography>
        </Box>
        <Avatar sx={{ bgcolor: color + '20', width: 56, height: 56 }}>
          {React.cloneElement(icon, { sx: { color } })}
        </Avatar>
      </Stack>
    </Paper>
  );
};

export default SalesDashboard;