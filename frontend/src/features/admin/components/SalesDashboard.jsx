import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Paper, 
    Typography, 
    Stack,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    Box,
    Divider,
    IconButton,
    Tooltip,
    alpha,
    CircularProgress // Add this
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import { 
    TrendingUp, 
    ShoppingCart, 
    Payment,
    InfoOutlined,
    Inventory, // Add this
    Warning // Add this
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrders } from '../../order/OrderSlice';
import { selectProducts, fetchProducts, selectProductStatus } from '../../product/productSlice'; // Update this
import { formatPrice } from '../../../utils/formatPrice';
import { DASHBOARD_COLORS } from '../../../constants/colors';

// Update the COLORS constant
const COLORS = DASHBOARD_COLORS.chart;

// Update StatsCard component styles
const StatsCard = ({ title, value, icon, color }) => (
    <Card sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, white 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 20px ${alpha(color, 0.2)}`
        }
    }}>
        <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: alpha(color, 0.1),
                    color: color,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: alpha(color, 0.15)
                    }
                }}>
                    {icon}
                </Box>
                <Stack spacing={0.5}>
                    <Typography color="text.secondary" variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ color }}>
                        {value}
                    </Typography>
                </Stack>
            </Stack>
        </CardContent>
    </Card>
);

export const SalesDashboard = () => {
    const dispatch = useDispatch();
    
    // Add this useEffect
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const orders = useSelector(selectOrders);
    const products = useSelector(selectProducts); // Add this
    const productStatus = useSelector(selectProductStatus); // Add this
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        recentOrders: [],
        monthlyRevenue: [],
        categoryDistribution: [],
        totalProducts: 0,
        inStockProducts: 0,
        outOfStockProducts: 0,
        lowStockProducts: 0
    });

    useEffect(() => {
        if (orders?.length) {
            calculateStats(orders);
        }
    }, [orders]);

    useEffect(() => {
        if (products?.length) {
            calculateProductStats(products);
        }
    }, [products]);

    const calculateStats = (orders) => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const averageOrderValue = totalRevenue / orders.length;
        
        // Calculate monthly revenue
        const monthlyData = orders.reduce((acc, order) => {
            const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + order.total;
            return acc;
        }, {});

        // Calculate category distribution
        const categoryData = orders.reduce((acc, order) => {
            order.items?.forEach(item => {
                const category = item.product.category?.name || 'Uncategorized';
                acc[category] = (acc[category] || 0) + (item.product.price * item.quantity);
            });
            return acc;
        }, {});

        setStats({
            totalRevenue,
            totalOrders: orders.length,
            averageOrderValue,
            recentOrders: orders.slice(-5),
            monthlyRevenue: Object.entries(monthlyData).map(([month, revenue]) => ({
                month,
                revenue
            })),
            categoryDistribution: Object.entries(categoryData).map(([name, value]) => ({
                name,
                value
            }))
        });
    };

    const calculateProductStats = (products) => {
        const inStock = products.filter(p => p.stock > 0).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;

        setStats(prev => ({
            ...prev,
            totalProducts: products.length,
            inStockProducts: inStock,
            outOfStockProducts: outOfStock,
            lowStockProducts: lowStock
        }));
    };

    // Add loading check before rendering
    if (productStatus === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={3} p={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Sales Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Total Revenue"
                        value={formatPrice(stats.totalRevenue)}
                        icon={<Payment sx={{ fontSize: 24 }} />}
                        color={DASHBOARD_COLORS.primary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingCart sx={{ fontSize: 24 }} />}
                        color={DASHBOARD_COLORS.success.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Average Order Value"
                        value={formatPrice(stats.averageOrderValue)}
                        icon={<TrendingUp sx={{ fontSize: 24 }} />}
                        color={DASHBOARD_COLORS.warning.main}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={2}>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={<Inventory sx={{ fontSize: 24 }} />}
                        color={DASHBOARD_COLORS.info.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="In Stock Products"
                        value={`${stats.inStockProducts} (${Math.round((stats.inStockProducts / stats.totalProducts) * 100)}%)`}
                        icon={<Inventory sx={{ fontSize: 24 }} />}
                        color={DASHBOARD_COLORS.success.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard
                        title="Out of Stock"
                        value={stats.outOfStockProducts}
                        icon={<Warning sx={{ fontSize: 24 }} />}
                        color={DASHBOARD_COLORS.error.main}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ 
                        p: 3, 
                        height: '100%',
                        boxShadow: 2,
                        '&:hover': { boxShadow: 4 }
                    }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                            <Typography variant="h6">Monthly Revenue</Typography>
                            <Tooltip title="Revenue trend over the past months">
                                <IconButton size="small">
                                    <InfoOutlined fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={stats.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke={DASHBOARD_COLORS.primary.main}
                                    strokeWidth={2}
                                    dot={{ 
                                        r: 4, 
                                        fill: DASHBOARD_COLORS.primary.main,
                                        strokeWidth: 2
                                    }}
                                    activeDot={{ 
                                        r: 6, 
                                        fill: DASHBOARD_COLORS.primary.light,
                                        strokeWidth: 0 
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: 3, 
                        height: '100%',
                        boxShadow: 2,
                        '&:hover': { boxShadow: 4 }
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Sales by Category
                        </Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={stats.categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
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
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ 
                p: 3,
                boxShadow: 2,
                '&:hover': { boxShadow: 4 }
            }}>
                <Typography variant="h6" gutterBottom>
                    Recent Orders
                </Typography>
                <Stack spacing={2}>
                    {stats.recentOrders.map((order) => (
                        <Paper 
                            key={order._id} 
                            sx={{ 
                                p: 2,
                                border: 1,
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                            elevation={0}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography color="text.secondary" variant="body2">
                                        Order ID
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {order._id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography color="text.secondary" variant="body2">
                                        Amount
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" color="primary">
                                        {formatPrice(order.total)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography color="text.secondary" variant="body2">
                                        Date
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Stack>
            </Paper>
        </Stack>
    );
};