exports.orderConfirmationEmail = (order, user) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563EB;">Order Confirmation - Apex Store</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for your order #${order._id}.</p>
    
    <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Order Details:</h3>
      <p>Total Amount: ₹${order.total}</p>
      <p>Payment Method: ${order.paymentMode}</p>
      
      <h3>Items:</h3>
      ${order.item.map(item => `
        <div style="border-bottom: 1px solid #E5E7EB; padding: 10px 0;">
          <p style="margin: 5px 0;">${item.product.title} x ${item.quantity}</p>
          <p style="margin: 5px 0; color: #6B7280;">Price: ₹${item.product.price}</p>
        </div>
      `).join('')}
    </div>

    <p>Your order will be delivered to:</p>
    <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
      <p style="margin: 5px 0;">${order.address.street}</p>
      <p style="margin: 5px 0;">${order.address.city}, ${order.address.state}</p>
      <p style="margin: 5px 0;">${order.address.country} - ${order.address.postalCode}</p>
    </div>
  </div>
`;

exports.orderStatusEmail = (order, user) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563EB;">Order Status Update</h2>
    <p>Dear ${user.name},</p>
    
    <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p>Your order #${order._id} has been ${order.status.toLowerCase()}.</p>
      ${order.status === 'Delivered' ? `
        <p style="color: #059669;">Your order has been successfully delivered!</p>
        <p>If you have any issues with your order, you can request a return within 7 days.</p>
      ` : `
        <p>We'll keep you updated on any further changes to your order status.</p>
      `}
    </div>

    <p style="color: #6B7280;">Thank you for shopping with Apex Store!</p>
  </div>
`;