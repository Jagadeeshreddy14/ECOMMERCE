import { Avatar, Button, Paper, Stack, Typography, useTheme, TextField, useMediaQuery, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo } from '../UserSlice'
import { addAddressAsync, resetAddressAddStatus, resetAddressDeleteStatus, resetAddressUpdateStatus, selectAddressAddStatus, selectAddressDeleteStatus, selectAddressErrors, selectAddressStatus, selectAddressUpdateStatus, selectAddresses } from '../../address/AddressSlice'
import { Address } from '../../address/components/Address'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { AddLocationAlt, Cancel, Person } from '@mui/icons-material'

export const UserProfile = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
    const status = useSelector(selectAddressStatus)
    const userInfo = useSelector(selectUserInfo)
    const addresses = useSelector(selectAddresses)
    const theme = useTheme()
    const [addAddress, setAddAddress] = useState(false)

    const addressAddStatus = useSelector(selectAddressAddStatus)
    const addressUpdateStatus = useSelector(selectAddressUpdateStatus)
    const addressDeleteStatus = useSelector(selectAddressDeleteStatus)

    const is900 = useMediaQuery(theme.breakpoints.down(900))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (addressAddStatus === 'fulfilled') {
            toast.success("Address added")
        }
        else if (addressAddStatus === 'rejected') {
            toast.error("Error adding address, please try again later")
        }
    }, [addressAddStatus])

    useEffect(() => {
        if (addressUpdateStatus === 'fulfilled') {
            toast.success("Address updated")
        }
        else if (addressUpdateStatus === 'rejected') {
            toast.error("Error updating address, please try again later")
        }
    }, [addressUpdateStatus])

    useEffect(() => {
        if (addressDeleteStatus === 'fulfilled') {
            toast.success("Address deleted")
        }
        else if (addressDeleteStatus === 'rejected') {
            toast.error("Error deleting address, please try again later")
        }
    }, [addressDeleteStatus])

    useEffect(() => {
        return () => {
            dispatch(resetAddressAddStatus())
            dispatch(resetAddressUpdateStatus())
            dispatch(resetAddressDeleteStatus())
        }
    }, [])

    const handleAddAddress = (data) => {
        const address = { ...data, user: userInfo._id }
        dispatch(addAddressAsync(address))
        setAddAddress(false)
        reset()
    }

    return (
        <Box sx={{
            minHeight: 'calc(100vh - 4rem)',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            py: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <Stack component={is480 ? '' : Paper} 
                elevation={is480 ? 0 : 3} 
                sx={{
                    width: is900 ? '95%' : '55rem',
                    p: 3,
                    borderRadius: 4,
                    background: 'white',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                    border: is480 ? 'none' : '1px solid rgba(255, 255, 255, 0.18)'
                }}>

                {/* User Profile Section */}
                <Stack sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    p: 3,
                    borderRadius: 3,
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(5px)'
                        }}>
                            <Person sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Stack>
                            <Typography variant="h6" fontWeight={600}>{userInfo?.name}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>{userInfo?.email}</Typography>
                        </Stack>
                    </Stack>
                </Stack>

                {/* Address Section */}
                <Stack spacing={3}>

                    {/* Address Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" fontWeight={500} sx={{ color: 'text.primary' }}>
                            Your Addresses
                        </Typography>
                        <Button
                            onClick={() => setAddAddress(true)}
                            variant="contained"
                            color="primary"
                            startIcon={<AddLocationAlt />}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
                                }
                            }}
                        >
                            Add Address
                        </Button>
                    </Stack>

                    {/* Add Address Form */}
                    {addAddress && (
                        <Stack component="form" 
                            onSubmit={handleSubmit(handleAddAddress)} 
                            spacing={2}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'rgba(245, 247, 250, 0.7)',
                                border: '1px solid rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 1 }}>Add New Address</Typography>
                            
                            <Stack direction={is480 ? 'column' : 'row'} spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Address Type"
                                    placeholder="Home, Office, etc."
                                    variant="outlined"
                                    {...register("type", { required: true })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    type="number"
                                    variant="outlined"
                                    {...register("phoneNumber", { required: true })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </Stack>

                            <TextField
                                fullWidth
                                label="Street Address"
                                variant="outlined"
                                {...register("street", { required: true })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />

                            <Stack direction={is480 ? 'column' : 'row'} spacing={2}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    variant="outlined"
                                    {...register("city", { required: true })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="State"
                                    variant="outlined"
                                    {...register("state", { required: true })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </Stack>

                            <Stack direction={is480 ? 'column' : 'row'} spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Postal Code"
                                    type="number"
                                    variant="outlined"
                                    {...register("postalCode", { required: true })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Country"
                                    variant="outlined"
                                    {...register("country", { required: true })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </Stack>

                            <Stack direction="row" justifyContent="flex-end" spacing={2}>
                                <Button
                                    color="error"
                                    onClick={() => setAddAddress(false)}
                                    variant="outlined"
                                    startIcon={<Cancel />}
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none'
                                    }}
                                >
                                    Cancel
                                </Button>
                                <LoadingButton
                                    loading={status === 'pending'}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
                                        }
                                    }}
                                >
                                    Save Address
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    )}

                    {/* Address List */}
                    <Stack spacing={2}>
                        {addresses.length > 0 ? (
                            addresses.map((address) => (
                                <Address 
                                    key={address._id} 
                                    id={address._id} 
                                    city={address.city} 
                                    country={address.country} 
                                    phoneNumber={address.phoneNumber} 
                                    postalCode={address.postalCode} 
                                    state={address.state} 
                                    street={address.street} 
                                    type={address.type}
                                />
                            ))
                        ) : (
                            <Box sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'rgba(245, 247, 250, 0.7)',
                                textAlign: 'center',
                                border: '1px dashed rgba(0, 0, 0, 0.1)'
                            }}>
                                <Typography variant="body1" color="text.secondary">
                                    You haven't added any addresses yet
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}