import {FormHelperText, Stack, TextField, Typography, useTheme, useMediaQuery, Container, Paper } from '@mui/material'
import React, { useEffect } from 'react'
import Lottie from 'lottie-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { ecommerceOutlookAnimation } from '../../../assets'
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser, signupAsync,selectSignupStatus, selectSignupError, clearSignupError, resetSignupStatus}from '../AuthSlice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { keyframes } from '@mui/system';
import { alpha } from '@mui/material/styles';

const gradientBg = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const pulseAnimation = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { opacity: 0.3; }
`;

export const Signup = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectSignupStatus)
  const error = useSelector(selectSignupError)
  const loggedInUser = useSelector(selectLoggedInUser)
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()
  const theme = useTheme()
  const is900 = useMediaQuery(theme.breakpoints.down(900))
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  useEffect(() => {
    if(loggedInUser && !loggedInUser?.isVerified) navigate("/verify-otp")
    else if(loggedInUser) navigate("/")
  }, [loggedInUser])

  useEffect(() => {
    if(error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if(status === 'fullfilled') {
      toast.success("Welcome! Verify your email to start shopping on Apex Store.")
      reset()
    }
    return () => {
      dispatch(clearSignupError())
      dispatch(resetSignupStatus())
    }
  }, [status])

  const handleSignup = (data) => {
    const cred = {...data}
    delete cred.confirmPassword
    dispatch(signupAsync(cred))
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Stack 
        width={'100vw'} 
        height={'100vh'} 
        flexDirection={'row'} 
        sx={{
          overflowY: "hidden",
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a237e 0%, #000000 100%)'
            : 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%, 
              ${alpha('#1976d2', 0.15)}, 
              transparent 60%),
              radial-gradient(circle at 0% 0%, 
              ${alpha('#304ffe', 0.1)}, 
              transparent 50%),
              radial-gradient(circle at 100% 100%, 
              ${alpha('#0d47a1', 0.15)}, 
              transparent 50%)`,
            animation: `${pulseAnimation} 8s ease-in-out infinite`,
            zIndex: 0
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(-45deg, #000000, #121212, #1a1a1a, #000000)',
            backgroundSize: '400% 400%',
            animation: `${gradientBg} 15s ease infinite`,
            opacity: theme.palette.mode === 'dark' ? 0.7 : 0.05,
            zIndex: 1
          }
        }}
      >
        {!is900 && (
          <Stack bgcolor={'black'} flex={1} justifyContent={'center'}>
            <Lottie animationData={ecommerceOutlookAnimation} />
          </Stack>
        )}

        <Stack 
          flex={1} 
          justifyContent={'center'} 
          alignItems={'center'}
          sx={{
            padding: { xs: '1rem', sm: '2rem', md: '3rem' },
            position: 'relative',
            zIndex: 2
          }}
        >
          <Paper 
            elevation={24}
            sx={{
              padding: { xs: '2rem', sm: '3rem' },
              borderRadius: '2rem',
              width: is480 ? "95%" : '32rem',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(6, 6, 6, 0.8)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: theme.shadows[10]
            }}
          >
            <Stack spacing={4}>
              <Stack alignItems="center" spacing={1}>
                <Typography 
                  variant='h3'
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1976d2, #304ffe)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textAlign: 'center',
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                  }}
                >
                  Create Account
                </Typography>
                <Typography 
                  variant='body1' 
                  color="text.secondary"
                  sx={{ textAlign: 'center' }}
                >
                  Join Apex Store to start shopping
                </Typography>
              </Stack>

              <Stack 
                component="form" 
                spacing={3} 
                noValidate 
                onSubmit={handleSubmit(handleSignup)}
              >
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <TextField 
                    fullWidth 
                    label="Username"
                    {...register("name", { required: "Username is required" })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1rem',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                  {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
                </motion.div>

                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <TextField 
                    fullWidth 
                    label="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                        message: "Enter a valid email"
                      }
                    })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1rem',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                  {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                </motion.div>

                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <TextField 
                    type='password' 
                    fullWidth 
                    label="Password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                        message: `Must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number`
                      }
                    })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1rem',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                  {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                </motion.div>

                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <TextField 
                    type='password' 
                    fullWidth 
                    label="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) => value === watch('password') || "Passwords don't match"
                    })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1rem',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                  {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
                </motion.div>

                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <TextField 
                    fullWidth 
                    label="Mobile Number"
                    {...register("mobile", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit number"
                      }
                    })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1rem',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                  {errors.mobile && <FormHelperText error>{errors.mobile.message}</FormHelperText>}
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <LoadingButton 
                    fullWidth
                    size="large"
                    loading={status === 'pending'}
                    type='submit'
                    variant='contained'
                    sx={{
                      borderRadius: '1rem',
                      background: 'linear-gradient(45deg, #1976d2, #304ffe)',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      py: 1.5,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #283593)',
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                      }
                    }}
                  >
                    Sign Up
                  </LoadingButton>
                </motion.div>

                <Stack direction="row" spacing={2} justifyContent="center">
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link 
                      to="/login"
                      style={{ 
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        fontWeight: 600
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Container>
  )
}