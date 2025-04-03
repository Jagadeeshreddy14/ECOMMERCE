import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Paper, 
    Typography, 
    Stack, 
    Card, 
    CardContent, 
    Box, 
    Tooltip, 
    IconButton, 
    alpha, 
    CircularProgress, 
    Chip,
    Tab,
    Tabs,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider
} from '@mui/material';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip as RechartsTooltip, 
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    AreaChart,
    Area,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ScatterChart,
    Scatter,
    ZAxis
} from 'recharts';
import { 
    TrendingUp, 
    ShoppingCart, 
    Payment, 
    InfoOutlined, 
    Inventory, 
    Warning,
    LocalShipping, 
    CancelOutlined,
    CheckCircleOutline,
    LocalOffer,
    Category,
    Timeline,
    People,
    Star,
    MonetizationOn,
    Receipt,
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    ShowChart
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrders } from '../../order/OrderSlice';
import { selectProducts, fetchProducts, selectProductStatus } from '../../product/productSlice';
import { selectCoupons, fetchCoupons } from '../../coupon/couponSlice';
import { formatPrice } from '../../../utils/formatPrice';
import { DASHBOARD_COLORS } from '../../../constants/colors';

const StatsCard = ({ title, value, icon, color, trend, tooltip }) => (
    <Tooltip title={tooltip} arrow>
        <Card
            sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, white 100%)`,
                border: `1px solid ${alpha(color, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 20px ${alpha(color, 0.2)}`,
                },
            }}
        >
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(color, 0.1),
                            color: color,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: alpha(color, 0.15),
                            },
                        }}
                    >
                        {icon}
                    </Box>
                    <Stack spacing={0.5} flexGrow={1}>
                        <Typography color="text.secondary" variant="body2">
                            {title}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" sx={{ color }}>
                            {value}
                        </Typography>
                        {trend && (
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    color: trend.value > 0 ? DASHBOARD_COLORS.success.main : DASHBOARD_COLORS.error.main
                                }}
                            >
                                <TrendingUp sx={{ 
                                    fontSize: 16, 
                                    transform: trend.value > 0 ? 'none' : 'rotate(180deg)',
                                    mr: 0.5 
                                }} />
                                {Math.abs(trend.value)}% {trend.label}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    </Tooltip>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{ p: 2, boxShadow: 3 }}>
                <Typography variant="subtitle2">{label}</Typography>
                {payload.map((item, index) => (
                    <Typography key={index} variant="body2" sx={{ color: item.color }}>
                        {item.name}: {item.name.includes('Revenue') || item.name.includes('Value') 
                            ? formatPrice(item.value) 
                            : item.value}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
            {`${name}: ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export const SalesDashboard = () => {
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const [timeRange, setTimeRange] = useState('monthly');
    
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCoupons());
    }, [dispatch]);

    const orders = useSelector(selectOrders) || [];
    const products = useSelector(selectProducts) || [];
    const coupons = useSelector(selectCoupons) || [];
    const productStatus = useSelector(selectProductStatus);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        recentOrders: [],
        monthlyRevenue: [],
        weeklyRevenue: [],
        dailyRevenue: [],
        categoryDistribution: [],
        productDistribution: [],
        totalProducts: 0,
        inStockProducts: 0,
        outOfStockProducts: 0,
        lowStockProducts: 0,
        topSellingProducts: [],
        worstSellingProducts: [],
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        userGrowth: 0,
        activeCoupons: 0,
        orderStatusCounts: {},
        revenueTrend: 0,
        orderTrend: 0,
        customerSatisfaction: 4.5,
        refundRate: 0.02,
        repeatCustomerRate: 0.35,
        activeRentals: 0,
        rentalRevenue: 0,
        availableRentals: 0,
        lateReturns: 0,
        shortTermRentals: 0,
        weeklyRentals: 0,
        longTermRentals: 0,
        durationData: [],
        rentalTrends: [],
        recentRentals: []
    });

    useEffect(() => {
        if (orders.length) {
            calculateStats(orders);
            calculateTopSellingProducts(orders);
        }
    }, [orders, coupons]);

    useEffect(() => {
        if (products.length) {
            calculateProductStats(products);
        }
    }, [products]);

    const calculateStats = (orders) => {
        try {
            // Sort orders by date
            const sortedOrders = [...orders].sort((a, b) => 
                new Date(a.createdAt) - new Date(b.createdAt)
            );
            
            // Calculate base metrics
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
            const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;
            
            // Time-based calculations
            const currentDate = new Date();
            
            // Monthly revenue data
            const monthlyRevenue = [];
            const monthlyData = orders.reduce((acc, order) => {
                if (order.createdAt) {
                    const month = new Date(order.createdAt)
                        .toLocaleString('default', { month: 'short', year: 'numeric' });
                    acc[month] = (acc[month] || 0) + (order.total || 0);
                }
                return acc;
            }, {});
            
            Object.entries(monthlyData).forEach(([month, revenue]) => {
                monthlyRevenue.push({ month, revenue });
            });

            // Weekly revenue data
            const weeklyRevenue = [];
            for (let i = 7; i >= 0; i--) {
                const weekStart = new Date(currentDate);
                weekStart.setDate(weekStart.getDate() - (i * 7));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                
                const week = `${weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`;
                
                const revenue = orders
                    .filter(order => {
                        const orderDate = new Date(order.createdAt);
                        return orderDate >= weekStart && orderDate <= weekEnd;
                    })
                    .reduce((sum, order) => sum + (order.total || 0), 0);
                
                weeklyRevenue.push({ week, revenue });
            }

            // Daily revenue data
            const dailyRevenue = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(currentDate);
                date.setDate(date.getDate() - i);
                const day = date.toLocaleDateString('default', { weekday: 'short', day: 'numeric' });
                
                const revenue = orders
                    .filter(order => {
                        const orderDate = new Date(order.createdAt);
                        return orderDate.toDateString() === date.toDateString();
                    })
                    .reduce((sum, order) => sum + (order.total || 0), 0);
                
                dailyRevenue.push({ day, revenue });
            }

            // Calculate order status distribution
            const orderStatusCounts = orders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, {});

            // Calculate category distribution
            const categoryData = orders.reduce((acc, order) => {
                order.items?.forEach(item => {
                    if (item?.product?.category?.name) {
                        const category = item.product.category.name;
                        acc[category] = (acc[category] || 0) + ((item.product.price || 0) * (item.quantity || 0));
                    }
                });
                return acc;
            }, {});

            const categoryDistribution = Object.entries(categoryData).map(([name, value]) => ({
                name,
                value
            }));

            // Calculate trends
            const last30Days = new Date(currentDate);
            last30Days.setDate(last30Days.getDate() - 30);
            
            const last30DaysRevenue = orders
                .filter(order => new Date(order.createdAt) >= last30Days)
                .reduce((sum, order) => sum + (order.total || 0), 0);
                
            const prev30DaysRevenue = orders
                .filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= new Date(last30Days.setDate(last30Days.getDate() - 30)) && 
                           orderDate < last30Days;
                })
                .reduce((sum, order) => sum + (order.total || 0), 0);

            const revenueTrend = prev30DaysRevenue ? 
                ((last30DaysRevenue - prev30DaysRevenue) / prev30DaysRevenue) * 100 : 0;

            setStats(prev => ({
                ...prev,
                totalRevenue,
                totalOrders: orders.length,
                averageOrderValue,
                monthlyRevenue,
                weeklyRevenue,
                dailyRevenue,
                categoryDistribution,
                orderStatusCounts,
                revenueTrend: Math.round(revenueTrend),
                recentOrders: sortedOrders.slice(-5)
            }));

        } catch (error) {
            console.error('Error calculating stats:', error);
        }
    };

    const calculateProductStats = (products) => {
        try {
            const inStock = products.filter(p => (p.stock || 0) > 0).length;
            const outOfStock = products.filter(p => !p.stock || p.stock === 0).length;
            const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;

            setStats(prev => ({
                ...prev,
                totalProducts: products.length,
                inStockProducts: inStock,
                outOfStockProducts: outOfStock,
                lowStockProducts: lowStock
            }));
        } catch (error) {
            console.error('Error calculating product stats:', error);
        }
    };

    const calculateTopSellingProducts = (orders) => {
        try {
            const productSales = {};
            
            orders.forEach(order => {
                order.items?.forEach(item => {
                    if (item?.product?._id) {
                        const productId = item.product._id;
                        if (!productSales[productId]) {
                            productSales[productId] = {
                                id: productId,
                                name: item.product.title,
                                quantity: 0,
                                revenue: 0,
                                category: item.product.category?.name || 'Uncategorized'
                            };
                        }
                        productSales[productId].quantity += item.quantity || 0;
                        productSales[productId].revenue += (item.product.price * item.quantity) || 0;
                    }
                });
            });

            const topProducts = Object.values(productSales)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);
                
            const worstProducts = Object.values(productSales)
                .sort((a, b) => a.revenue - b.revenue)
                .slice(0, 5);

            setStats(prev => ({
                ...prev,
                topSellingProducts: topProducts,
                worstSellingProducts: worstProducts
            }));
        } catch (error) {
            console.error('Error calculating top products:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleTimeRangeChange = (newRange) => {
        setTimeRange(newRange);
    };

    const getRevenueData = () => {
        switch(timeRange) {
            case 'daily': return stats.dailyRevenue;
            case 'weekly': return stats.weeklyRevenue;
            default: return stats.monthlyRevenue;
        }
    };

    const getRevenueLabel = () => {
        switch(timeRange) {
            case 'daily': return 'Day';
            case 'weekly': return 'Week';
            default: return 'Month';
        }
    };

    if (productStatus === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    const orderStatusData = Object.entries(stats.orderStatusCounts).map(([name, value]) => ({
        name,
        value
    }));

    const customerData = [
        { name: 'Satisfaction', value: stats.customerSatisfaction * 20, fullMark: 100 },
        { name: 'Repeat Rate', value: stats.repeatCustomerRate * 100, fullMark: 100 },
        { name: 'Refund Rate', value: stats.refundRate * 100, fullMark: 100 },
    ];

    return (
        <Stack spacing={3} p={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Sales Dashboard
            </Typography>

            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Overview" icon={<BarChartIcon />} />
                <Tab label="Products" icon={<Inventory />} />
                <Tab label="Customers" icon={<People />} />
                <Tab label="Analytics" icon={<Timeline />} />
                <Tab label="Rentals" icon={<LocalShipping />} />
            </Tabs>

            {tabValue === 0 && (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Total Revenue"
                                value={formatPrice(stats.totalRevenue)}
                                icon={<MonetizationOn sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.primary.main}
                                trend={{
                                    value: stats.revenueTrend,
                                    label: stats.revenueTrend > 0 ? 'increase' : 'decrease'
                                }}
                                tooltip="Total revenue from all orders"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Total Orders"
                                value={stats.totalOrders}
                                icon={<Receipt sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.success.main}
                                trend={{
                                    value: stats.orderTrend,
                                    label: stats.orderTrend > 0 ? 'increase' : 'decrease'
                                }}
                                tooltip="Total number of orders placed"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Avg. Order Value"
                                value={formatPrice(stats.averageOrderValue)}
                                icon={<TrendingUp sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.warning.main}
                                tooltip="Average value of each order"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Customer Satisfaction"
                                value={`${stats.customerSatisfaction}/5`}
                                icon={<Star sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.info.main}
                                tooltip="Average customer rating from reviews"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h6">Revenue Trend</Typography>
                                        <Tooltip title={`Revenue trend over ${timeRange} periods`}>
                                            <IconButton size="small">
                                                <InfoOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                    <Stack direction="row" spacing={1}>
                                        <Chip 
                                            label="Daily" 
                                            variant={timeRange === 'daily' ? 'filled' : 'outlined'} 
                                            onClick={() => handleTimeRangeChange('daily')}
                                            size="small"
                                        />
                                        <Chip 
                                            label="Weekly" 
                                            variant={timeRange === 'weekly' ? 'filled' : 'outlined'} 
                                            onClick={() => handleTimeRangeChange('weekly')}
                                            size="small"
                                        />
                                        <Chip 
                                            label="Monthly" 
                                            variant={timeRange === 'monthly' ? 'filled' : 'outlined'} 
                                            onClick={() => handleTimeRangeChange('monthly')}
                                            size="small"
                                        />
                                    </Stack>
                                </Stack>
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={getRevenueData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                                        <XAxis dataKey={timeRange === 'daily' ? 'day' : timeRange === 'weekly' ? 'week' : 'month'} />
                                        <YAxis />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke={DASHBOARD_COLORS.primary.main}
                                            fill={alpha(DASHBOARD_COLORS.primary.main, 0.2)}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Order Status Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={orderStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {orderStatusData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={DASHBOARD_COLORS.chart[index % DASHBOARD_COLORS.chart.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Top Selling Products
                                </Typography>
                                <List>
                                    {stats.topSellingProducts.map((product, index) => (
                                        <React.Fragment key={product.id}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: DASHBOARD_COLORS.chart[index] }}>
                                                        {index + 1}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={product.name}
                                                    secondary={`${product.quantity} sold • ${formatPrice(product.revenue)}`}
                                                />
                                                <Chip 
                                                    label={product.category} 
                                                    size="small" 
                                                    variant="outlined" 
                                                    sx={{ ml: 2 }}
                                                />
                                            </ListItem>
                                            {index < stats.topSellingProducts.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Recent Orders
                                </Typography>
                                <DataGrid
                                    rows={stats.recentOrders}
                                    getRowId={(row) => row._id}
                                    columns={[
                                        { 
                                            field: '_id', 
                                            headerName: 'Order ID', 
                                            width: 120,
                                            renderCell: (params) => (
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                    #{params.value.slice(-6)}
                                                </Typography>
                                            )
                                        },
                                        { 
                                            field: 'status', 
                                            headerName: 'Status', 
                                            width: 120,
                                            renderCell: (params) => (
                                                <Chip
                                                    label={params.value}
                                                    color={
                                                        params.value === 'Delivered' ? 'success' :
                                                        params.value === 'Pending' ? 'warning' :
                                                        params.value === 'Cancelled' ? 'error' : 'default'
                                                    }
                                                    size="small"
                                                />
                                            )
                                        },
                                        { 
                                            field: 'total', 
                                            headerName: 'Amount', 
                                            width: 100,
                                            renderCell: (params) => formatPrice(params.value),
                                            align: 'right',
                                            headerAlign: 'right'
                                        },
                                        {
                                            field: 'createdAt',
                                            headerName: 'Date',
                                            width: 150,
                                            renderCell: (params) => new Date(params.value).toLocaleDateString(),
                                            valueGetter: (params) => new Date(params.value)
                                        }
                                    ]}
                                    autoHeight
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    disableSelectionOnClick
                                    components={{
                                        Toolbar: GridToolbar,
                                    }}
                                    sx={{
                                        '& .MuiDataGrid-cell': {
                                            borderColor: 'divider'
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}

            {tabValue === 1 && (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Total Products"
                                value={stats.totalProducts}
                                icon={<Inventory sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.info.main}
                                tooltip="Total number of products in inventory"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="In Stock"
                                value={`${stats.inStockProducts} (${Math.round((stats.inStockProducts / stats.totalProducts) * 100)}%)`}
                                icon={<Inventory sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.success.main}
                                tooltip="Products currently available in stock"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Out of Stock"
                                value={stats.outOfStockProducts}
                                icon={<Warning sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.error.main}
                                tooltip="Products currently out of stock"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Low Stock"
                                value={stats.lowStockProducts}
                                icon={<Warning sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.warning.main}
                                tooltip="Products with low stock (≤ 5 items)"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Product Performance
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart
                                        data={stats.productDistribution.slice(0, 10)}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis 
                                            dataKey="name" 
                                            type="category" 
                                            width={100}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" fill={DASHBOARD_COLORS.primary.main}>
                                            {stats.productDistribution.slice(0, 10).map((entry, index) => (
                                                <Cell key={index} fill={DASHBOARD_COLORS.chart[index % DASHBOARD_COLORS.chart.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h6">Top vs Worst Selling</Typography>
                                    <Tooltip title="Comparison between top and worst selling products">
                                        <IconButton size="small">
                                            <InfoOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                <ResponsiveContainer width="100%" height={350}>
                                    <ScatterChart
                                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                    >
                                        <CartesianGrid />
                                        <XAxis 
                                            type="number" 
                                            dataKey="revenue" 
                                            name="Revenue" 
                                            label={{ value: 'Revenue', position: 'bottom' }}
                                        />
                                        <YAxis 
                                            type="number" 
                                            dataKey="quantity" 
                                            name="Quantity" 
                                            label={{ value: 'Quantity Sold', angle: -90, position: 'left' }}
                                        />
                                        <ZAxis range={[100, 400]} />
                                        <RechartsTooltip 
                                            cursor={{ strokeDasharray: '3 3' }} 
                                            formatter={(value, name) => 
                                                name === 'Revenue' ? formatPrice(value) : value
                                            }
                                        />
                                        <Legend />
                                        <Scatter 
                                            name="Top Sellers" 
                                            data={stats.topSellingProducts} 
                                            fill={DASHBOARD_COLORS.success.main} 
                                        />
                                        <Scatter 
                                            name="Worst Sellers" 
                                            data={stats.worstSellingProducts} 
                                            fill={DASHBOARD_COLORS.error.main} 
                                        />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Sales by Category
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.categoryDistribution}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="name" />
                                        <PolarRadiusAxis />
                                        <Radar 
                                            name="Sales" 
                                            dataKey="value" 
                                            stroke={DASHBOARD_COLORS.primary.main}
                                            fill={alpha(DASHBOARD_COLORS.primary.main, 0.6)}
                                        />
                                        <RechartsTooltip 
                                            formatter={(value) => formatPrice(value)}
                                        />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Category Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={stats.categoryDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {stats.categoryDistribution.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={DASHBOARD_COLORS.chart[index % DASHBOARD_COLORS.chart.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            formatter={(value) => formatPrice(value)}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}

            {tabValue === 2 && (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Total Customers"
                                value={stats.totalUsers}
                                icon={<People sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.info.main}
                                tooltip="Total number of registered customers"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Active Customers"
                                value={stats.activeUsers}
                                icon={<People sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.success.main}
                                tooltip="Customers with activity in last 30 days"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="New Customers"
                                value={stats.newUsers}
                                icon={<People sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.primary.main}
                                tooltip="New customers in last 30 days"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Repeat Rate"
                                value={`${(stats.repeatCustomerRate * 100).toFixed(1)}%`}
                                icon={<TrendingUp sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.warning.main}
                                tooltip="Percentage of customers with multiple orders"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Customer Metrics
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={customerData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="name" />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar 
                                            name="Customer" 
                                            dataKey="value" 
                                            stroke={DASHBOARD_COLORS.primary.main}
                                            fill={alpha(DASHBOARD_COLORS.primary.main, 0.6)}
                                            fillOpacity={0.6}
                                        />
                                        <RechartsTooltip />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Customer Value Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart
                                        data={[
                                            { name: 'High Value', value: 15 },
                                            { name: 'Medium Value', value: 35 },
                                            { name: 'Low Value', value: 50 },
                                        ]}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Bar dataKey="value" fill={DASHBOARD_COLORS.primary.main}>
                                            <Cell fill={DASHBOARD_COLORS.success.main} />
                                            <Cell fill={DASHBOARD_COLORS.warning.main} />
                                            <Cell fill={DASHBOARD_COLORS.error.main} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}

            {tabValue === 3 && (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Revenue vs Orders
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart
                                        data={stats.monthlyRevenue.map((month, index) => ({
                                            month: month.month,
                                            revenue: month.revenue,
                                            orders: Math.floor(Math.random() * 100) + 50 // Simulated data
                                        }))}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line 
                                            yAxisId="left" 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke={DASHBOARD_COLORS.primary.main}
                                            activeDot={{ r: 8 }}
                                            name="Revenue"
                                        />
                                        <Line 
                                            yAxisId="right" 
                                            type="monotone" 
                                            dataKey="orders" 
                                            stroke={DASHBOARD_COLORS.success.main}
                                            name="Orders"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Order Value Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart
                                        data={[
                                            { range: '$0-$50', count: 120 },
                                            { range: '$50-$100', count: 80 },
                                            { range: '$100-$200', count: 45 },
                                            { range: '$200-$500', count: 20 },
                                            { range: '$500+', count: 5 },
                                        ]}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="range" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Bar dataKey="count" fill={DASHBOARD_COLORS.primary.main}>
                                            <Cell fill={DASHBOARD_COLORS.chart[0]} />
                                            <Cell fill={DASHBOARD_COLORS.chart[1]} />
                                            <Cell fill={DASHBOARD_COLORS.chart[2]} />
                                            <Cell fill={DASHBOARD_COLORS.chart[3]} />
                                            <Cell fill={DASHBOARD_COLORS.chart[4]} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Product Category Performance
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart
                                        data={stats.categoryDistribution}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip 
                                            formatter={(value) => formatPrice(value)}
                                        />
                                        <Bar dataKey="value" fill={DASHBOARD_COLORS.primary.main}>
                                            {stats.categoryDistribution.map((entry, index) => (
                                                <Cell key={index} fill={DASHBOARD_COLORS.chart[index % DASHBOARD_COLORS.chart.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Sales Composition
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={stats.categoryDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {stats.categoryDistribution.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={DASHBOARD_COLORS.chart[index % DASHBOARD_COLORS.chart.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            formatter={(value) => formatPrice(value)}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}

            {tabValue === 4 && (
                <>
                    <Grid container spacing={3} mb={3}>
                        {/* Rental Overview Cards */}
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Active Rentals"
                                value={stats.activeRentals || 0}
                                icon={<LocalShipping sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.primary.main}
                                trend={{
                                    value: stats.rentalTrend,
                                    label: 'from last month'
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Rental Revenue"
                                value={formatPrice(stats.rentalRevenue)}
                                icon={<MonetizationOn sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.success.main}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Available Items"
                                value={stats.availableRentals}
                                icon={<Inventory sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.info.main}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard
                                title="Late Returns"
                                value={stats.lateReturns}
                                icon={<Warning sx={{ fontSize: 24 }} />}
                                color={DASHBOARD_COLORS.error.main}
                            />
                        </Grid>
                    </Grid>

                    {/* Rental Analytics */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Rental Duration Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: '1-3 days', value: stats.shortTermRentals },
                                                { name: '4-7 days', value: stats.weeklyRentals },
                                                { name: '8-30 days', value: stats.longTermRentals }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                        >
                                            {stats.durationData?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={DASHBOARD_COLORS.chart[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Rental Performance
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={stats.rentalTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke={DASHBOARD_COLORS.primary.main}
                                            name="Revenue"
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="orders"
                                            stroke={DASHBOARD_COLORS.success.main}
                                            name="Orders"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* Recent Rental Orders */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Recent Rental Orders
                                </Typography>
                                <DataGrid
                                    rows={stats.recentRentals || []}
                                    columns={[
                                        { field: 'id', headerName: 'Order ID', width: 120 },
                                        { field: 'productName', headerName: 'Product', width: 200 },
                                        { 
                                            field: 'startDate', 
                                            headerName: 'Start Date', 
                                            width: 120,
                                            valueFormatter: (params) => new Date(params.value).toLocaleDateString()
                                        },
                                        { 
                                            field: 'endDate', 
                                            headerName: 'End Date', 
                                            width: 120,
                                            valueFormatter: (params) => new Date(params.value).toLocaleDateString()
                                        },
                                        { 
                                            field: 'status', 
                                            headerName: 'Status', 
                                            width: 130,
                                            renderCell: (params) => (
                                                <Chip
                                                    label={params.value}
                                                    color={
                                                        params.value === 'active' ? 'success' :
                                                        params.value === 'overdue' ? 'error' :
                                                        params.value === 'completed' ? 'default' : 'warning'
                                                    }
                                                    size="small"
                                                />
                                            )
                                        },
                                        { 
                                            field: 'amount', 
                                            headerName: 'Amount', 
                                            width: 120,
                                            valueFormatter: (params) => formatPrice(params.value)
                                        }
                                    ]}
                                    autoHeight
                                    pageSize={5}
                                    disableSelectionOnClick
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Stack>
    );
};