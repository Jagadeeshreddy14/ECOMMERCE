import { LoadingButton } from '@mui/lab';
import { Button, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddressByIdAsync, selectAddressErrors, selectAddressStatus, updateAddressByIdAsync } from '../AddressSlice';
import { motion } from 'framer-motion';

export const Address = ({ id, type, street, postalCode, country, phoneNumber, state, city }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [edit, setEdit] = useState(false);
  const status = useSelector(selectAddressStatus);
  const error = useSelector(selectAddressErrors);

  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleRemoveAddress = () => {
    dispatch(deleteAddressByIdAsync(id));
  };

  const handleUpdateAddress = (data) => {
    const update = { ...data, _id: id };
    setEdit(false);
    dispatch(updateAddressByIdAsync(update));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Stack
        width={'100%'}
        p={is480 ? 0 : 1}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        {/* Address Type */}
        <Stack
          color={'whitesmoke'}
          p={'.5rem'}
          borderRadius={'.2rem'}
          bgcolor={theme.palette.primary.main}
          sx={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        >
          <Typography variant="subtitle1">{type?.toUpperCase()}</Typography>
        </Stack>

        {/* Address Details */}
        <Stack
          p={2}
          flexDirection={'column'}
          rowGap={1}
          component={'form'}
          noValidate
          onSubmit={handleSubmit(handleUpdateAddress)}
        >
          {/* Edit Mode */}
          {edit ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack rowGap={2}>
                <Stack>
                  <Typography gutterBottom>Type</Typography>
                  <TextField
                    {...register('type', { required: true, value: type })}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        borderColor: '#ccc',
                      },
                    }}
                  />
                </Stack>

                <Stack>
                  <Typography gutterBottom>Street</Typography>
                  <TextField
                    {...register('street', { required: true, value: street })}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        borderColor: '#ccc',
                      },
                    }}
                  />
                </Stack>

                <Stack>
                  <Typography gutterBottom>Postal Code</Typography>
                  <TextField
                    type="number"
                    {...register('postalCode', { required: true, value: postalCode })}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        borderColor: '#ccc',
                      },
                    }}
                  />
                </Stack>

                <Stack>
                  <Typography gutterBottom>Country</Typography>
                  <TextField
                    {...register('country', { required: true, value: country })}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        borderColor: '#ccc',
                      },
                    }}
                  />
                </Stack>

                <Stack>
                  <Typography gutterBottom>Phone Number</Typography>
                  <TextField
                    type="number"
                    {...register('phoneNumber', { required: true, value: phoneNumber })}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        borderColor: '#ccc',
                      },
                    }}
                  />
                </Stack>

                <Stack>
                  <Typography gutterBottom>State</Typography>
                  <TextField
                    {...register('state', { required: true, value: state })}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        borderColor: '#ccc',
                      },
                    }}
                  />
                </Stack>

                <Stack>
                  <Typography gutterBottom>City</Typography>
                  <TextField
                    {...register('city', { required: true, value: city })}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        borderColor: '#ccc',
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Stack rowGap={1}>
                <Typography>Street - {street}</Typography>
                <Typography>Postal Code - {postalCode}</Typography>
                <Typography>Country - {country}</Typography>
                <Typography>Phone Number - {phoneNumber}</Typography>
                <Typography>State - {state}</Typography>
                <Typography>City - {city}</Typography>
              </Stack>
            </motion.div>
          )}

          {/* Action Buttons */}
          <Stack
            position={is480 ? 'static' : edit ? 'static' : 'absolute'}
            bottom={4}
            right={4}
            mt={is480 ? 2 : 4}
            flexDirection={'row'}
            alignSelf={'flex-end'}
            columnGap={1}
          >
            {/* Save Changes Button */}
            {edit ? (
              <LoadingButton
                loading={status === 'pending'}
                size="small"
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: theme.palette.success.dark,
                  },
                }}
              >
                Save Changes
              </LoadingButton>
            ) : (
              <Button
                size="small"
                onClick={() => setEdit(true)}
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Edit
              </Button>
            )}

            {/* Cancel or Remove Button */}
            {edit ? (
              <Button
                size="small"
                onClick={() => {
                  setEdit(false);
                  reset();
                }}
                variant="outlined"
                color="error"
                sx={{
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  '&:hover': {
                    borderColor: theme.palette.error.dark,
                    color: theme.palette.error.dark,
                  },
                }}
              >
                Cancel
              </Button>
            ) : (
              <LoadingButton
                loading={status === 'pending'}
                size="small"
                onClick={handleRemoveAddress}
                variant="outlined"
                color="error"
                sx={{
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  '&:hover': {
                    borderColor: theme.palette.error.dark,
                    color: theme.palette.error.dark,
                  },
                }}
              >
                Remove
              </LoadingButton>
            )}
          </Stack>
        </Stack>
      </Stack>
    </motion.div>
  );
};