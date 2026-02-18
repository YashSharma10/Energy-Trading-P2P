import logger from "./logger.js";

/**
 * Generate transaction receipt HTML
 * This creates a professional receipt that can be displayed in browser or converted to PDF
 */
export const generateReceiptHTML = (transaction) => {
  const {
    _id,
    buyer,
    seller,
    listing,
    quantity,
    pricePerCredit,
    totalAmount,
    paymentStatus,
    purchaseDate,
  } = transaction;

  const formattedDate = new Date(purchaseDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaction Receipt - ${_id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .receipt-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .receipt-header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .receipt-header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .receipt-header p {
      font-size: 16px;
      opacity: 0.9;
    }
    .receipt-body {
      padding: 40px;
    }
    .receipt-section {
      margin-bottom: 30px;
    }
    .receipt-section h2 {
      font-size: 18px;
      color: #10b981;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .info-item {
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
    }
    .info-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 16px;
      color: #111827;
      font-weight: 500;
    }
    .transaction-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .transaction-table th,
    .transaction-table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .transaction-table th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }
    .transaction-table td {
      font-size: 15px;
    }
    .total-row {
      background: #f0fdf4;
      font-weight: 600;
      font-size: 18px;
    }
    .total-row td {
      padding: 20px 15px;
      color: #10b981;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-completed {
      background: #d1fae5;
      color: #065f46;
    }
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    .status-failed {
      background: #fee2e2;
      color: #991b1b;
    }
    .receipt-footer {
      background: #f9fafb;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .receipt-footer p {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .carbon-impact {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .carbon-impact h3 {
      color: #065f46;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .carbon-impact .impact-value {
      font-size: 36px;
      font-weight: 700;
      color: #10b981;
      margin-bottom: 5px;
    }
    .carbon-impact .impact-label {
      font-size: 14px;
      color: #059669;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .receipt-container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="receipt-header">
      <h1>🌱 CarbonEase</h1>
      <p>Transaction Receipt</p>
    </div>

    <div class="receipt-body">
      <div class="receipt-section">
        <h2>Transaction Details</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Transaction ID</div>
            <div class="info-value">${_id}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date & Time</div>
            <div class="info-value">${formattedDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Buyer</div>
            <div class="info-value">${buyer?.email || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Seller</div>
            <div class="info-value">${seller?.email || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Payment Status</div>
            <div class="info-value">
              <span class="status-badge status-${paymentStatus}">${paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="receipt-section">
        <h2>Carbon Credit Details</h2>
        <table class="transaction-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Quantity</th>
              <th>Price per Credit</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${listing?.title || "Carbon Credits"}</td>
              <td>${quantity} credits</td>
              <td>₹${pricePerCredit?.toLocaleString()}</td>
              <td>₹${(quantity * pricePerCredit)?.toLocaleString()}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Total Amount</strong></td>
              <td><strong>₹${totalAmount?.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="carbon-impact">
        <h3>🌍 Environmental Impact</h3>
        <div class="impact-value">${quantity}</div>
        <div class="impact-label">Tons of CO₂ Offset</div>
        <p style="margin-top: 10px; color: #059669; font-size: 13px;">
          This purchase contributes to global carbon reduction efforts and supports sustainable projects.
        </p>
      </div>

      <div class="receipt-section">
        <h2>Project Information</h2>
        <div class="info-item">
          <div class="info-label">Project Type</div>
          <div class="info-value">${listing?.projectType || "General"}</div>
        </div>
        <div class="info-item" style="margin-top: 10px;">
          <div class="info-label">Location</div>
          <div class="info-value">${listing?.location || "N/A"}</div>
        </div>
        <div class="info-item" style="margin-top: 10px;">
          <div class="info-label">Description</div>
          <div class="info-value">${listing?.description || "N/A"}</div>
        </div>
      </div>
    </div>

    <div class="receipt-footer">
      <p><strong>Thank you for contributing to a sustainable future!</strong></p>
      <p>For questions about this transaction, please contact support@carbonease.com</p>
      <p style="margin-top: 15px; font-size: 12px;">
        This is an official receipt generated by CarbonEase Platform.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate receipt data for API response
 */
export const generateReceiptData = (transaction) => {
  try {
    const html = generateReceiptHTML(transaction);
    
    logger.info(`Receipt generated for transaction ${transaction._id}`);
    
    return {
      success: true,
      receiptHTML: html,
      transaction: {
        id: transaction._id,
        date: transaction.purchaseDate,
        amount: transaction.totalAmount,
        status: transaction.paymentStatus,
      },
    };
  } catch (error) {
    logger.error("Error generating receipt:", error);
    throw error;
  }
};
