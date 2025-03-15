// frontend/src/features/categories/components/AddCategory.jsx
import React from 'react';
import { 
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack 
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { axiosi } from '../../../config/axios';

export const AddCategory = ({ open, handleClose, onCategoryCreated }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axiosi.post('/categories', data);
            toast.success('Category created successfully');
            reset();
            onCategoryCreated(response.data);
            handleClose();
        } catch (error) {
            toast.error('Error creating category');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ minWidth: 300, mt: 2 }}>
                        <TextField
                            label="Category Name"
                            fullWidth
                            autoFocus
                            {...register('name', { 
                                required: 'Category name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Category name must be at least 2 characters'
                                }
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">Add Category</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};