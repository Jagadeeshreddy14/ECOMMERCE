import React, { useEffect, useState } from 'react';
import { 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    TextField,
    Stack 
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { axiosi } from '../../../config/axios';
import { fetchAllBrandsAsync } from '../BrandSlice';

export const AddBrand = ({ open, handleClose, onBrandCreated }) => {
    const { register, handleSubmit, reset } = useForm();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        try {
            const response = await axiosi.post('/brands', data);
            toast.success('Brand created successfully');
            dispatch(fetchAllBrandsAsync()); // Refresh brands list
            reset();
            onBrandCreated(response.data); // Pass back the new brand
            handleClose();
        } catch (error) {
            toast.error('Error creating brand');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Brand</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={3}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Brand Name"
                            fullWidth
                            {...register('name', { required: 'Brand name is required' })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">Add</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};