import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Paper,
  Divider
} from '@mui/material';
import {
  PayPalScriptProvider,
  PayPalButtons
} from "@paypal/react-paypal-js";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

export const PaymentGateway = ({ totalAmount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);

  // Payment handlers
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCashOnDelivery = async () => {
    try {
      setProcessing(true);
      // Process COD order
      await dispatch(createOrderAsync({ 
        paymentMethod: 'cod',
        paymentStatus: 'pending'
      }));
      navigate('/order-success');
    } catch (error) {
      toast.error('Order processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
      // Initialize Stripe payment
      const session = await createStripeSession(totalAmount);
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });
      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  const handlePayPalPayment = async (data) => {
    try {
      // Process PayPal payment success
      await dispatch(createOrderAsync({
        paymentMethod: 'paypal',
        paymentStatus: 'completed',
        transactionId: data.orderID
      }));
      navigate('/order-success');
    } catch (error) {
      toast.error('PayPal payment failed');
    }
  };

  return (
    <Stack spacing={3} component={Paper} elevation={3} p={3}>
      <Typography variant="h6">Select Payment Method</Typography>
      <Divider />
      
      <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
        <FormControlLabel 
          value="cod" 
          control={<Radio />} 
          label="Cash on Delivery" 
        />
        <FormControlLabel 
          value="stripe" 
          control={<Radio />} 
          label="Credit/Debit Card (Stripe)" 
        />
        <FormControlLabel 
          value="paypal" 
          control={<Radio />} 
          label="PayPal" 
        />
      </RadioGroup>

      {paymentMethod === 'cod' && (
        <Button 
          variant="contained" 
          onClick={handleCashOnDelivery}
          disabled={processing}
        >
          Place Order (₹{totalAmount})
        </Button>
      )}

      {paymentMethod === 'stripe' && (
        <Button 
          variant="contained" 
          onClick={handleStripePayment}
          disabled={processing}
        >
          Pay with Stripe (₹{totalAmount})
        </Button>
      )}

      {paymentMethod === 'paypal' && (
        <PayPalScriptProvider options={{ 
          "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID 
        }}>
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: totalAmount
                  }
                }]
              });
            }}
            onApprove={(data, actions) => handlePayPalPayment(data)}
          />
        </PayPalScriptProvider>
      )}
    </Stack>
  );
};