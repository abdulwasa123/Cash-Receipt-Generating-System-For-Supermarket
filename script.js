// === Utility Function to Format the Date ===
function formatDate(rawDate, format) {
    const date = new Date(rawDate);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
  
    return format === 'mm/dd/yyyy' ? `${mm}/${dd}/${yyyy}` : `${dd}/${mm}/${yyyy}`;
  }
  
  // === Core Update Function ===
  function updateReceipt() {
    const store = document.getElementById('storeName').value || 'Supermarket';
    const cashier = document.getElementById('cashierId').value;
    const receiptNo = document.getElementById('receiptNo').value;
    const rawDate = document.getElementById('receiptDate').value;
    const format = document.getElementById('dateFormat').value;
    const items = document.getElementById('itemCount').value;
    const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const payment = document.getElementById('paymentMethod').value;
    const note = document.getElementById('notes').value;
    const fontStyle = document.getElementById('fontStyle').value;
  
    const formattedDate = rawDate ? formatDate(rawDate, format) : '';
  
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discount;
  
    document.getElementById('previewStore').textContent = store;
    document.getElementById('previewCashier').textContent = cashier;
    document.getElementById('previewReceiptNo').textContent = receiptNo;
    document.getElementById('previewDate').textContent = formattedDate;
    document.getElementById('previewItems').textContent = items;
    document.getElementById('previewSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('previewTax').textContent = taxAmount.toFixed(2);
    document.getElementById('previewDiscount').textContent = discount.toFixed(2);
    document.getElementById('previewTotal').textContent = total.toFixed(2);
    document.getElementById('previewPayment').textContent = payment;
    document.getElementById('previewNote').textContent = note;
    document.getElementById('receiptPreview').style.fontFamily = fontStyle;
  }
  
  // === Real-Time Binding ===
  const fields = [
    'storeName',
    'cashierId',
    'receiptNo',
    'receiptDate',
    'dateFormat',
    'itemCount',
    'subtotal',
    'taxRate',
    'discount',
    'paymentMethod',
    'notes',
    'fontStyle'
  ];
  
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateReceipt);
      el.addEventListener('change', updateReceipt); // for select/date fields
    }
  });
  
  // === Clear Form Function ===
  function clearForm() {
    document.querySelectorAll('input, textarea').forEach(input => {
      if (input.type === 'date') input.value = '';
      else if (input.type !== 'checkbox') input.value = '';
    });
    updateReceipt();
  }
  
  // === Print Function ===
  function printReceipt() {
    const printContents = document.getElementById('receiptPreview').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write(
      '<style>body{font-family:monospace;padding:20px;} h4{text-align:center;}</style>'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
  
  // Initial render
  document.addEventListener('DOMContentLoaded', updateReceipt);
  