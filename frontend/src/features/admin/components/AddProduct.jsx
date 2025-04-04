import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { addProductAsync, resetProductAddStatus, selectProductAddStatus, updateProductByIdAsync } from '../../products/ProductSlice'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery, useTheme, Paper, Checkbox, FormHelperText, Divider } from '@mui/material'
import { useForm } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories, fetchAllCategoriesAsync } from '../../categories/CategoriesSlice'
import { toast } from 'react-toastify'
import { AddCategory } from '../../categories/components/AddCategory';

export const AddProduct = () => {
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()

    const dispatch = useDispatch()
    const brands = useSelector(selectBrands)
    const categories = useSelector(selectCategories)
    const productAddStatus = useSelector(selectProductAddStatus)
    const navigate = useNavigate()
    const theme = useTheme()
    const is1100 = useMediaQuery(theme.breakpoints.down(1100))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    // Add state for category dialog
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState(0);

    // Handle newly created category
    const handleCategoryCreated = (newCategory) => {
        dispatch(fetchAllCategoriesAsync());
    };

    useEffect(() => {
        if (productAddStatus === 'fullfilled') {
            reset()
            toast.error("Error adding product, please try again later")
        }
    }, [productAddStatus])

    useEffect(() => {
        return () => {
            dispatch(resetProductAddStatus())
        }
    }, [])

    // Watch for changes in price and discountPercentage
    const price = watch('price', 0);
    const discount = watch('discountPercentage', 0);

    // Function to calculate the discounted price
    const calculateDiscountPrice = (price, discount) => {
        const parsedPrice = parseFloat(price);
        const parsedDiscount = parseFloat(discount);

        if (!isNaN(parsedPrice) && !isNaN(parsedDiscount)) {
            const discountAmount = parsedPrice * (parsedDiscount / 100);
            const finalPrice = parsedPrice - discountAmount;
            setDiscountedPrice(finalPrice.toFixed(2));
        } else {
            setDiscountedPrice(parsedPrice || 0);
        }
    };

    // Recalculate discounted price whenever price or discount changes
    useEffect(() => {
        calculateDiscountPrice(price, discount);
    }, [price, discount]);

    // Handle form submission
    const handleAddProduct = (data) => {
        try {
            const price = parseFloat(data.price);
            const discountPercentage = parseFloat(data.discountPercentage) || 0;

            calculateDiscountPrice(price, discountPercentage);

            const newProduct = {
                ...data,
                price,
                discountPercentage,
                discountedPrice: parseFloat(discountedPrice),
                images: [data.image0, data.image1, data.image2, data.image3].filter(Boolean),
                isDeleted: false,
            };

            dispatch(addProductAsync(newProduct));

            toast.success(
                `Product added successfully! Original Price: ₹${price}, Discounted Price: ₹${discountedPrice}`
            );

            reset();
        } catch (error) {
            toast.error('Error creating product');
        }
    };

    return (
        <Stack
            p={3}
            sx={{
                backgroundColor: '#f8fafc',
                minHeight: '100vh',
                alignItems: 'center'
            }}
        >
            <Stack
                width={is1100 ? "100%" : "70rem"}
                spacing={4}
                component="form"
                noValidate
                onSubmit={handleSubmit(handleAddProduct)}
                sx={{
                    backgroundColor: 'white',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0'
                }}
            >
                <Typography variant="h4" fontWeight={600} color="primary.main" mb={2}>
                    Add New Product
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Product Title */}
                <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                        Product Title *
                    </Typography>
                    <TextField
                        {...register("title", {
                            required: 'Title is required',
                            minLength: { value: 3, message: 'Title must be at least 3 characters' }
                        })}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Enter product title"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            }
                        }}
                    />
                </Stack>

                {/* Price and Discount Row */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={3}
                    alignItems="flex-start"
                >
                    <Stack flex={1} spacing={1}>
                        <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                            Price *
                        </Typography>
                        <TextField
                            type="number"
                            {...register("price", {
                                required: "Price is required",
                                min: { value: 0, message: "Price must be positive" }
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            onChange={(e) => calculateDiscountPrice(e.target.value, discount)}
                            variant="outlined"
                            fullWidth
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <Typography color="text.secondary" mr={1}>₹</Typography>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        />
                    </Stack>

                    <Stack flex={1} spacing={1}>
                        <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                            Discount (%)
                        </Typography>
                        <TextField
                            type="number"
                            {...register("discountPercentage", {
                                min: { value: 0, message: "Discount cannot be negative" },
                                max: { value: 100, message: "Discount cannot exceed 100%" }
                            })}
                            error={!!errors.discountPercentage}
                            helperText={errors.discountPercentage?.message}
                            onChange={(e) => calculateDiscountPrice(price, e.target.value)}
                            variant="outlined"
                            fullWidth
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <Typography color="text.secondary" ml={1}>%</Typography>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        />
                    </Stack>
                </Stack>

                {/* Final Price Display */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: 2
                    }}
                >
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" color="success.dark">
                            Final Price after Discount
                        </Typography>
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                            <Typography variant="h4" color="success.dark" fontWeight={700}>
                                ₹{discountedPrice}
                            </Typography>
                            {price && discount > 0 && (
                                <Typography variant="body2" color="success.main" fontWeight={500}>
                                    (You save ₹{(price - discountedPrice).toFixed(2)})
                                </Typography>
                            )}
                        </Stack>
                        {price && discount > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                Original price: ₹{price} | Discount: {discount}%
                            </Typography>
                        )}
                    </Stack>
                </Paper>

                {/* Brand and Category Section */}
                <Stack spacing={3}>
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        Product Details
                    </Typography>
                    
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        <FormControl fullWidth size="small" error={!!errors.brand}>
                            <InputLabel id="brand-selection">Brand *</InputLabel>
                            <Select 
                                {...register("brand", { required: "Brand is required" })} 
                                labelId="brand-selection" 
                                label="Brand *"
                                sx={{
                                    borderRadius: '8px',
                                }}
                            >
                                {brands.map((brand) => (
                                    <MenuItem key={brand._id} value={brand._id}>
                                        {brand.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.brand && <FormHelperText>{errors.brand.message}</FormHelperText>}
                        </FormControl>

                        <Stack direction="row" spacing={2} width="100%">
                            <FormControl fullWidth size="small" error={!!errors.category}>
                                <InputLabel id="category-selection">Category *</InputLabel>
                                <Select
                                    {...register("category", { required: "Category is required" })}
                                    labelId="category-selection"
                                    label="Category *"
                                    sx={{
                                        borderRadius: '8px',
                                    }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                            </FormControl>

                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpenCategoryDialog(true);
                                }}
                                sx={{
                                    borderRadius: '8px',
                                    minWidth: '180px'
                                }}
                            >
                                + New Category
                            </Button>
                        </Stack>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} pt={1}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                                Customizable
                            </Typography>
                            <Checkbox
                                {...register("customizable")}
                                defaultChecked={false}
                                color="primary"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                                Is Rental
                            </Typography>
                            <Checkbox
                                {...register("isRental")}
                                defaultChecked={false}
                                color="primary"
                            />
                        </Stack>
                    </Stack>

                    {/* Rental Price Field - Only shown when isRental is checked */}
                    {watch('isRental') && (
                        <Stack flex={1} spacing={1}>
                            <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                                Rental Price *
                            </Typography>
                            <TextField
                                type="number"
                                {...register("rentalPrice", {
                                    required: "Rental price is required when product is marked as rental",
                                    min: { value: 0, message: "Rental price must be positive" }
                                })}
                                error={!!errors.rentalPrice}
                                helperText={errors.rentalPrice?.message}
                                variant="outlined"
                                fullWidth
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <Typography color="text.secondary" mr={1}>₹</Typography>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                    }
                                }}
                            />
                        </Stack>
                    )}
                </Stack>

                {/* Description */}
                <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                        Description *
                    </Typography>
                    <TextField
                        multiline
                        rows={4}
                        {...register("description", { required: "Description is required" })}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        placeholder="Enter detailed product description"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            }
                        }}
                    />
                </Stack>

                {/* Stock and Thumbnail */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Stack flex={1} spacing={1}>
                        <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                            Stock Quantity *
                        </Typography>
                        <TextField
                            type='number'
                            {...register("stockQuantity", { required: "Stock Quantity is required" })}
                            error={!!errors.stockQuantity}
                            helperText={errors.stockQuantity?.message}
                            variant="outlined"
                            fullWidth
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        />
                    </Stack>
                    <Stack flex={1} spacing={1}>
                        <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                            Thumbnail URL *
                        </Typography>
                        <TextField
                            {...register("thumbnail", { required: "Thumbnail is required" })}
                            error={!!errors.thumbnail}
                            helperText={errors.thumbnail?.message}
                            variant="outlined"
                            fullWidth
                            size="small"
                            placeholder="https://example.com/image.jpg"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        />
                    </Stack>
                </Stack>

                {/* Product Images */}
                <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        Product Images (URLs)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Add up to 4 image URLs to showcase your product
                    </Typography>
                    
                    <Stack spacing={2}>
                        {[0, 1, 2, 3].map((index) => (
                            <TextField
                                key={index}
                                {...register(`image${index}`, index === 0 ? { required: "At least one image is required" } : {})}
                                error={!!errors[`image${index}`]}
                                helperText={errors[`image${index}`]?.message}
                                variant="outlined"
                                fullWidth
                                size="small"
                                placeholder={`Image ${index + 1} URL`}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                    }
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>

                {/* Discount Amount */}
                <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                        Discount Amount
                    </Typography>
                    <TextField
                        type='number'
                        {...register("discountAmount")}
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            }
                        }}
                    />
                </Stack>

                {/* Add Category Dialog */}
                <AddCategory
                    open={openCategoryDialog}
                    handleClose={() => setOpenCategoryDialog(false)}
                    onCategoryCreated={handleCategoryCreated}
                />

                {/* Action Buttons */}
                <Stack direction="row" justifyContent="flex-end" spacing={2} pt={4}>
                    <Button
                        size={is480 ? 'medium' : 'large'}
                        variant="outlined"
                        color="error"
                        component={Link}
                        to={'/admin/dashboard'}
                        sx={{
                            borderRadius: '8px',
                            px: 4,
                            borderWidth: '2px',
                            '&:hover': {
                                borderWidth: '2px'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={is480 ? 'medium' : 'large'}
                        variant="contained"
                        type="submit"
                        sx={{
                            borderRadius: '8px',
                            px: 4,
                            fontWeight: 600,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Add Product
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}