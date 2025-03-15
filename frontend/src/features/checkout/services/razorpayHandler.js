export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const handleRazorpayPayment = (orderAmount, userDetails) => {
  return new Promise((resolve) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderAmount * 100,
      currency: "INR",
      name: "Apex store",
      description: "Payment for your order",
      handler: function (response) {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id
        });
      },
      prefill: {
        name: userDetails?.name || '',
        email: userDetails?.email || '',
        contact: userDetails?.phone || ''
      },
      theme: {
        color: "#1976d2"
      },
      modal: {
        ondismiss: function() {
          resolve({ success: false });
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  });
};