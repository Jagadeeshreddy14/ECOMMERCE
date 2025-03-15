export const handleCardPayment = async (details) => {
  // Integrate with your card payment gateway
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Card payment successful' });
    }, 2000);
  });
};

export const handleUPIPayment = async (details) => {
  // Integrate with UPI payment gateway
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'UPI payment successful' });
    }, 2000);
  });
};

export const handleNetBankingPayment = async (details) => {
  // Integrate with net banking gateway
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Net banking payment successful' });
    }, 2000);
  });
};

export const handleWalletPayment = async (details) => {
  // Integrate with digital wallet gateway
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Wallet payment successful' });
    }, 2000);
  });
};