exports.orderConfirmationEmail = (order, user) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 2rem; background: #f8fafc;">
    <!-- Header -->
    <div style="background: #2563EB; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <img src="https://res.cloudinary.com/docnp0ctp/image/upload/v1742925244/Apex-store/oqe1wqywljqopu2vzemh.png" alt="Logo" style="height: 48px; margin-bottom: 1.5rem;">
      <h1 style="color: white; margin: 0; font-weight: 600; letter-spacing: -0.025em;">Order Confirmed!</h1>
      <p style="color: #BFDBFE; margin: 0.5rem 0 0; font-size: 1.125rem;">Order #${order._id}</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
      <!-- Greeting -->
      <div style="margin-bottom: 2rem;">
        <p style="color: #1e293b; font-size: 1.125rem; margin: 0 0 1rem;">Hi ${user.name},</p>
        <p style="color: #64748b; margin: 0; line-height: 1.5;">Thank you for your order! We're preparing your items and will notify you when they ship.</p>
      </div>

      <!-- Order Summary -->
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 2rem;">
        <div style="background: #f8fafc; padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0;">
          <h3 style="color: #1e293b; margin: 0; font-size: 1.125rem; font-weight: 600;">Order Summary</h3>
        </div>
        ${order.item.map(item => `
          <div style="display: flex; padding: 1.5rem; border-bottom: 1px solid #e2e8f0; align-items: center;">
            <div style="flex: 0 0 80px; margin-right: 1.5rem;">
              <img src="${item.product.thumbnail}" 
                   alt="${item.product.title}" 
                   style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;">
            </div>
            <div style="flex: 1;">
              <p style="color: #1e293b; margin: 0 0 0.25rem; font-weight: 500;">${item.product.title}</p>
              <p style="color: #64748b; margin: 0 0 0.5rem; font-size: 0.875rem;">Qty: ${item.quantity}</p>
              <p style="color: #2563EB; margin: 0; font-weight: 600;">₹${item.product.price}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Order Details Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px;">
          <h4 style="color: #64748b; margin: 0 0 1rem; font-size: 0.875rem; font-weight: 500;">DELIVERY ADDRESS</h4>
          <div style="color: #1e293b; line-height: 1.5;">
            <p style="margin: 0 0 0.25rem;">${order.address[0].street}</p>
            <p style="margin: 0 0 0.25rem;">${order.address[0].city}, ${order.address[0].state}</p>
            <p style="margin: 0 0 0.25rem;">${order.address[0].country} - ${order.address[0].postalCode}</p>
            <p style="margin: 0; color: #2563EB;">${order.address[0].phoneNumber}</p>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px;">
          <h4 style="color: #64748b; margin: 0 0 1rem; font-size: 0.875rem; font-weight: 500;">PAYMENT DETAILS</h4>
          <div style="color: #1e293b; line-height: 1.5;">
            <p style="margin: 0 0 0.5rem;">
              <span style="display: inline-block; width: 100px;">Method:</span>
              <strong>${order.paymentMode}</strong>
            </p>
            <p style="margin: 0 0 0.5rem;">
              <span style="display: inline-block; width: 100px;">Total:</span>
              <strong style="color: #2563EB;">₹${order.total}</strong>
            </p>
            <p style="margin: 0;">
              <span style="display: inline-block; width: 100px;">Order Date:</span>
              ${new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div style="background: #f1f5f9; padding: 1.5rem; border-radius: 8px; text-align: center;">
        <p style="color: #64748b; margin: 0 0 1rem; font-size: 0.875rem;">Need help with your order?</p>
        <a href="mailto:support@apexstore.com" 
           style="display: inline-block; background: #2563EB; color: white; padding: 0.75rem 1.5rem; 
                  border-radius: 6px; text-decoration: none; font-weight: 500; transition: all 0.2s ease;"
           onMouseOver="this.style.backgroundColor='#1d4ed8'" 
           onMouseOut="this.style.backgroundColor='#2563EB'">
          Contact Support
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 2rem 0 1rem;">
      <p style="color: #64748b; margin: 0 0 0.5rem; font-size: 0.875rem;">
        © ${new Date().getFullYear()} Apex Store. All rights reserved.
      </p>
      <div style="display: flex; justify-content: center; gap: 1rem;">
        <a href="#" style="color: #2563EB; text-decoration: none; font-size: 0.875rem;">Privacy Policy</a>
        <a href="#" style="color: #2563EB; text-decoration: none; font-size: 0.875rem;">Terms of Service</a>
      </div>
    </div>
  </div>
`;
exports.orderStatusEmail = (order, user) => `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 0; background: #f8fafc;">
    <!-- Email Header -->
    <div style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); padding: 32px; text-align: center; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Order Status Update</h1>
      <p style="color: #BFDBFE; margin: 8px 0 0; font-size: 16px;">Order #${order._id}</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px;">
      <!-- Greeting -->
      <div style="margin-bottom: 24px;">
        <p style="color: #1e293b; font-size: 18px; margin: 0 0 8px; font-weight: 500;">Hi ${user.name},</p>
        <p style="color: #64748b; margin: 0; line-height: 1.5;">Your order status has been updated:</p>
      </div>

      <!-- Status Card -->
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        ${getStatusSpecificMessage(order.status)}
      </div>

      <!-- Order Summary -->
      <div style="background: white; border-radius: 12px; padding: 0; margin-bottom: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <div style="background: #f8fafc; padding: 16px 24px; border-bottom: 1px solid #e2e8f0;">
          <h3 style="color: #1e293b; margin: 0; font-size: 18px; font-weight: 600;">Order Summary</h3>
        </div>
        ${order.item.map(item => `
          <div style="display: flex; padding: 20px; border-bottom: 1px solid #e2e8f0; align-items: center;">
            <div style="flex: 0 0 80px; margin-right: 20px;">
              <img src="${item.product.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image'}" 
                   alt="${item.product.title}" 
                   style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;">
            </div>
            <div style="flex: 1;">
              <p style="color: #1e293b; margin: 0 0 4px; font-weight: 500;">${item.product.title}</p>
              <p style="color: #64748b; margin: 0 0 8px; font-size: 14px;">Qty: ${item.quantity}</p>
              <p style="color: #2563EB; margin: 0; font-weight: 600;">₹${item.product.price}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Total Amount -->
      <div style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 32px;">
        <p style="color: white; font-size: 20px; margin: 0; font-weight: 600;">
          Total Amount: ₹${order.total}
        </p>
      </div>

      <!-- Support CTA -->
      <div style="text-align: center;">
        <p style="color: #64748b; margin: 0 0 16px; font-size: 15px;">Need help with your order?</p>
        <a href="mailto:support@apexstore.com" 
           style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; 
                  border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px; transition: all 0.2s ease;"
           onMouseOver="this.style.backgroundColor='#1d4ed8'" 
           onMouseOut="this.style.backgroundColor='#2563EB'">
          Contact Support
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px; background: #f1f5f9; border-radius: 16px 16px 0 0;">
      <img src="https://res.cloudinary.com/docnp0ctp/image/upload/v1742925244/Apex-store/oqe1wqywljqopu2vzemh.png" alt="Apex Store Logo" style="height: 32px; margin-bottom: 16px;">
      <p style="color: #64748b; margin: 0 0 12px; font-size: 14px;">
        © ${new Date().getFullYear()} Apex Store. All rights reserved.
      </p>
      <div style="display: flex; justify-content: center; gap: 16px;">
        <a href="#" style="color: #2563EB; text-decoration: none; font-size: 14px;">Privacy Policy</a>
        <a href="#" style="color: #2563EB; text-decoration: none; font-size: 14px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

// Enhanced Status Timeline Component
function getStatusSpecificMessage(status) {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = statuses.indexOf(status);

  const getStatusIcon = (step, isActive) => {
    const icons = {
      'Pending': '📦',
      'Processing': '🔄',
      'Shipped': '🚚',
      'Delivered': '✅'
    };

    return `
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${isActive ? '#2563EB' : '#E2E8F0'};
        color: ${isActive ? 'white' : '#64748B'};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin: 0 auto 8px;
        transition: all 0.3s ease;
      ">
        ${icons[step] || '•'}
      </div>
    `;
  };

  const getStatusMessage = (step, isActive) => {
    const messages = {
      'Pending': 'Order received',
      'Processing': 'Preparing your order',
      'Shipped': 'On the way',
      'Delivered': 'Delivered'
    };

    const dates = {
      'Pending': new Date(),
      'Processing': new Date(Date.now() + 24 * 60 * 60 * 1000),
      'Shipped': new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      'Delivered': new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    };

    return `
      <div style="text-align: center;">
        <p style="
          color: ${isActive ? '#1E293B' : '#94A3B8'};
          margin: 0 0 4px;
          font-weight: ${isActive ? '600' : '500'};
          font-size: 14px;
        ">
          ${messages[step]}
        </p>
        <p style="
          color: ${isActive ? '#64748B' : '#CBD5E1'};
          margin: 0;
          font-size: 12px;
        ">
          ${isActive ? dates[step].toLocaleDateString() : ''}
        </p>
      </div>
    `;
  };

  return `
    <div style="margin: 0 0 16px;">
      <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: 24px;">
        ${statuses.map((step, index) => `
          <div style="flex: 1; position: relative; z-index: 2;">
            ${getStatusIcon(step, index <= currentIndex)}
            ${getStatusMessage(step, index <= currentIndex)}
          </div>
          ${index < statuses.length - 1 ? `
            <div style="
              position: absolute;
              left: ${((index + 1) * 25)}%;
              right: ${((statuses.length - index - 2) * 25)}%;
              top: 22px;
              height: 2px;
              background: ${index < currentIndex ? '#2563EB' : '#E2E8F0'};
              transition: all 0.3s ease;
            "></div>
          ` : ''}
        `).join('')}
      </div>
      
      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px; text-align: center;">
        <p style="color: #1E293B; margin: 0; font-size: 15px;">
          ${status === 'Delivered' ? 'Your order has been delivered!' :
      status === 'Shipped' ? 'Your order is on its way!' :
        'We\'re processing your order'}
        </p>
      </div>
    </div>
  `;
}