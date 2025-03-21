exports.orderConfirmationEmail = (order, user) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #2563EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: white; margin: 0;">Order Confirmation - Apex Store</h2>
    </div>

    <p style="color: #111827; font-size: 16px;">Dear ${user.name},</p>
    <p style="color: #374151;">Thank you for shopping with us! Your order #${order._id} has been confirmed.</p>
    
    <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #1F2937; margin-top: 0;">Order Details</h3>
      <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMode}</p>
      <p style="margin: 5px 0;"><strong>Order Status:</strong> ${order.status}</p>

      <div style="margin-top: 20px;">
        <h4 style="color: #4B5563; margin-bottom: 10px;">Items Ordered:</h4>
        ${order.item.map(item => `
          <div style="display: flex; border-bottom: 1px solid #E5E7EB; padding: 10px 0;">
            <img src="${item.product.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image'}" 
                 alt="${item.product.title}" 
                 style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px; border-radius: 4px;"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80?text=No+Image'">
            <div>
              <p style="margin: 0 0 5px 0; color: #1F2937; font-weight: 500;">${item.product.title}</p>
              <p style="margin: 0 0 5px 0; color: #6B7280;">Quantity: ${item.quantity}</p>
              <p style="margin: 0; color: #2563EB;">₹${item.product.price}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
        <h4 style="color: #4B5563; margin-bottom: 10px;">Delivery Address:</h4>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #E5E7EB;">
          <p style="margin: 5px 0;">${order.address[0].type || 'N/A'}</p>
          <p style="margin: 5px 0;">${order.address[0].street || 'N/A'}</p>
          <p style="margin: 5px 0;">${order.address[0].city || 'N/A'}</p>
          <p style="margin: 5px 0;">${order.address[0].state || 'N/A'}</p>
          <p style="margin: 5px 0;">${order.address[0].country || 'N/A'} - ${order.address[0].postalCode || 'N/A'}</p>
          <p style="margin: 5px 0;">Phone: ${order.address[0].phoneNumber}</p>
        </div>
      </div>

      <div style="margin-top: 20px; text-align: center; background: #EEF2FF; padding: 15px; border-radius: 8px;">
        <p style="font-size: 20px; color: #1F2937; margin: 0;">
          <strong>Total Amount:</strong> 
          <span style="color: #2563EB;">₹${order.total}</span>
        </p>
      </div>
    </div>

    <div style="background: #EEF2FF; padding: 15px; border-radius: 8px; margin-top: 20px;">
      <p style="color: #4338CA; margin: 0;">If you have any questions about your order, please contact our customer support:-+918074563501.</p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="color: #6B7280; margin: 0;">Thank you for shopping with Apex Store!</p>
    </div>
  </div>
`;

exports.orderStatusEmail = (order, user) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #2563EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: white; margin: 0;">Order Status Update - Apex Store</h2>
    </div>

    <p style="color: #111827; font-size: 16px;">Dear ${user.name},</p>
    <p style="color: #374151;">We're writing to update you about your order #${order._id}.</p>
    
    <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <div style="background: ${
        order.status === 'Delivered' ? '#059669' :
        order.status === 'Shipped' ? '#2563EB' :
        order.status === 'Processing' ? '#D97706' : '#6B7280'
      }; color: white; padding: 15px; border-radius: 8px; text-align: center;">
        <h3 style="margin: 0;">Order Status: ${order.status}</h3>
      </div>

      ${getStatusSpecificMessage(order.status)}

      <div style="margin-top: 20px;">
        <h4 style="color: #4B5563; margin-bottom: 10px;">Order Summary:</h4>
        ${order.item.map(item => `
          <div style="display: flex; border-bottom: 1px solid #E5E7EB; padding: 10px 0;">
            <img src="${item.product.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image'}" 
                 alt="${item.product.title}" 
                 style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px; border-radius: 4px;"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80?text=No+Image'">
            <div>
              <p style="margin: 0 0 5px 0; color: #1F2937; font-weight: 500;">${item.product.title}</p>
              <p style="margin: 0 0 5px 0; color: #6B7280;">Quantity: ${item.quantity}</p>
              <p style="margin: 0; color: #2563EB;">₹${item.product.price}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 20px; text-align: center; background: #EEF2FF; padding: 15px; border-radius: 8px;">
        <p style="font-size: 20px; color: #1F2937; margin: 0;">
          <strong>Total Amount:</strong> 
          <span style="color: #2563EB;">₹${order.total}</span>
        </p>
      </div>
    </div>

    <div style="background: #EEF2FF; padding: 15px; border-radius: 8px; margin-top: 20px;">
      <p style="color: #4338CA; margin: 0;">Need help? Contact our customer support at +918074563501</p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="color: #6B7280; margin: 0;">Thank you for shopping with Apex Store!</p>
    </div>
  </div>
`;

// Helper function for status-specific messages
function getStatusSpecificMessage(status) {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = statuses.indexOf(status);

  const getStatusIcon = (step) => {
    const icons = {
      'Pending': '🛒',
      'Processing': '⚙️',
      'Shipped': '🚚',
      'Delivered': '📦'
    };
    return icons[step] || '•';
  };

  return `
    <div style="margin: 30px 0;">
      <div style="display: flex; justify-content: space-between; position: relative; max-width: 100%;">
        ${statuses.map((step, index) => `
          <div style="
            flex: 1;
            text-align: center;
            position: relative;
            ${index <= currentIndex ? 'color: #2563EB;' : 'color: #9CA3AF;'}
          ">
            <div style="
              width: 40px;
              height: 40px;
              line-height: 40px;
              border-radius: 50%;
              background-color: ${index <= currentIndex ? '#2563EB' : '#E5E7EB'};
              color: white;
              margin: 0 auto 10px;
              position: relative;
              z-index: 2;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ${getStatusIcon(step)}
            </div>
            <div style="font-size: 14px; font-weight: 500; margin-bottom: 5px;">
              ${step}
            </div>
            ${getStatusMessage(step, index <= currentIndex)}
          </div>
          ${index < statuses.length - 1 ? `
            <div style="
              position: absolute;
              left: ${((index + 1) * 25) - 12.5}%;
              right: ${((statuses.length - index - 2) * 25) + 12.5}%;
              top: 20px;
              height: 3px;
              background: ${index < currentIndex ? '#2563EB' : '#E5E7EB'};
              transition: all 0.3s ease;
            "></div>
          ` : ''}
        `).join('')}
      </div>
    </div>
  `;
}

function getStatusMessage(status, isActive) {
  const messages = {
    'Pending': 'Order placed successfully',
    'Processing': 'Order is being prepared',
    'Shipped': 'Out for delivery',
    'Delivered': 'Package received'
  };

  const dates = {
    'Pending': new Date(),
    'Processing': new Date(Date.now() + 24 * 60 * 60 * 1000),
    'Shipped': new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    'Delivered': new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  };

  return `
    <div style="
      font-size: 12px;
      margin-top: 5px;
      color: ${isActive ? '#4B5563' : '#9CA3AF'};
    ">
      <div>${messages[status]}</div>
      <div style="margin-top: 3px; font-size: 11px;">
        ${isActive ? dates[status].toLocaleDateString() : ''}
      </div>
    </div>
  `;
}

exports.returnOrderEmail = (order, user, returnDetails) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #2563EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: white; margin: 0;">Return Request - Apex Store</h2>
    </div>

    <p style="color: #111827; font-size: 16px;">Dear ${user.name},</p>
    <p style="color: #374151;">Your return request for order #${order._id} has been ${returnDetails.status}.</p>
    
    <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #1F2937; margin-top: 0;">Return Details</h3>
      <p style="margin: 5px 0;"><strong>Return Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p style="margin: 5px 0;"><strong>Return Status:</strong> ${returnDetails.status}</p>
      <p style="margin: 5px 0;"><strong>Return Reason:</strong> ${returnDetails.reason}</p>

      <div style="margin-top: 20px;">
        <h4 style="color: #4B5563; margin-bottom: 10px;">Items Being Returned:</h4>
        ${order.item.map(item => `
          <div style="display: flex; border-bottom: 1px solid #E5E7EB; padding: 10px 0;">
            <img src="${item.product.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image'}" 
                 alt="${item.product.title}" 
                 style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px; border-radius: 4px;"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80?text=No+Image'">
            <div>
              <p style="margin: 0 0 5px 0; color: #1F2937; font-weight: 500;">${item.product.title}</p>
              <p style="margin: 0 0 5px 0; color: #6B7280;">Quantity: ${item.quantity}</p>
              <p style="margin: 0; color: #2563EB;">₹${item.product.price}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 20px; padding: 15px; background: #EEF2FF; border-radius: 8px;">
        <h4 style="color: #4B5563; margin: 0 0 10px 0;">Return Instructions:</h4>
        <ol style="color: #4B5563; margin: 0; padding-left: 20px;">
          <li>Pack the item(s) securely in original packaging if possible</li>
          <li>Include original invoice copy in the package</li>
          <li>Attach the return shipping label provided</li>
          <li>Drop off at nearest courier partner location</li>
        </ol>
      </div>

      <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
        <h4 style="color: #4B5563; margin-bottom: 10px;">Return Shipping Address:</h4>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #E5E7EB;">
          <p style="margin: 5px 0;">Apex Store Returns Department</p>
          <p style="margin: 5px 0;">123 Commerce Street</p>
          <p style="margin: 5px 0;">Bangalore, Karnataka</p>
          <p style="margin: 5px 0;">India - 560001</p>
          <p style="margin: 5px 0;">Phone: +918074563501</p>
        </div>
      </div>

      <div style="margin-top: 20px; text-align: center; background: #EEF2FF; padding: 15px; border-radius: 8px;">
        <p style="font-size: 20px; color: #1F2937; margin: 0;">
          <strong>Refund Amount:</strong> 
          <span style="color: #2563EB;">₹${order.total}</span>
        </p>
        <p style="color: #6B7280; margin: 10px 0 0 0; font-size: 14px;">
          Refund will be processed within 5-7 business days after receiving the returned items
        </p>
      </div>
    </div>

    <div style="background: #EEF2FF; padding: 15px; border-radius: 8px; margin-top: 20px;">
      <p style="color: #4338CA; margin: 0;">For any questions about your return, please contact our customer support at +918074563501</p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="color: #6B7280; margin: 0;">Thank you for shopping with Apex Store!</p>
    </div>
  </div>
`;