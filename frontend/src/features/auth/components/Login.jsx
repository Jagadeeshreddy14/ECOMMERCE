import {Box, FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme, Container, Paper } from '@mui/material'
import React, { useEffect } from 'react'
import Lottie from 'lottie-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { ecommerceOutlookAnimation, shoppingBagAnimation} from '../../../assets'
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser,loginAsync,selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus} from '../AuthSlice'
import { toast } from 'react-toastify'
import {MotionConfig, motion} from 'framer-motion'
import { alpha } from '@mui/material/styles';

export const Login = () => {
  const dispatch=useDispatch()
  const status=useSelector(selectLoginStatus)
  const error=useSelector(selectLoginError)
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const theme=useTheme()
  const is900=useMediaQuery(theme.breakpoints.down(900))
  const is480=useMediaQuery(theme.breakpoints.down(480))
  
  // handles user redirection
  useEffect(()=>{
    if(loggedInUser && loggedInUser?.isVerified){
      navigate("/")
    }
    else if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
  },[loggedInUser])

  // handles login error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  // handles login status and dispatches reset actions to relevant states in cleanup
  useEffect(()=>{
    if(status==='fullfilled' && loggedInUser?.isVerified===true){
      toast.success(`Login successful`)
      reset()
    }
    return ()=>{
      dispatch(clearLoginError())
      dispatch(resetLoginStatus())
    }
  },[status])

  const handleLogin=(data)=>{
    const cred={...data}
    delete cred.confirmPassword
    dispatch(loginAsync(cred))
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Stack width={'100vw'} height={'100vh'} flexDirection={'row'} sx={{
        overflowY: "hidden",
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1a237e 0%, #000000 100%)'
          : 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)',
      }}>
        {!is900 && 
         <Stack bgcolor={'black'} flex={1} justifyContent={'center'} >
         <Lottie animationData={ecommerceOutlookAnimation}/>
       </Stack>
        }

        <Stack 
          flex={1} 
          justifyContent={'center'} 
          alignItems={'center'}
          sx={{
            padding: { xs: '1rem', sm: '2rem', md: '3rem' },
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
                  Welcome Back
                </Typography>
                <Typography 
                  variant='body1' 
                  color="text.secondary"
                  sx={{ textAlign: 'center' }}
                >
                  Sign in to continue to Apex Store
                </Typography>
              </Stack>

              <Stack 
                component="form"
                noValidate 
                onSubmit={handleSubmit(handleLogin)}
                spacing={3}
              >
                <motion.div whileHover={{y:-2}} transition={{duration: 0.2}}>
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

                <motion.div whileHover={{y:-2}} transition={{duration: 0.2}}>
                  <TextField 
                    fullWidth 
                    type='password'
                    label="Password" 
                    {...register("password",{required:"Password is required"})}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1rem',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                  {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                </motion.div>

                <motion.div whileHover={{scale:1.01}} whileTap={{scale:0.99}}>
                  <LoadingButton 
                    fullWidth  
                    size="large"
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
                    loading={status==='pending'} 
                    type='submit' 
                    variant='contained'
                  >
                    Sign In
                  </LoadingButton>
                </motion.div>
              </Stack>

              <Stack spacing={2} alignItems="center">
                <Link 
                  to="/forgot-password"
                  style={{ 
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    Forgot password?
                  </Typography>
                </Link>

                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup"
                    style={{ 
                      textDecoration: 'none',
                      color: theme.palette.primary.main,
                      fontWeight: 600
                    }}
                  >
                    Sign up now
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Container>
  )
}
