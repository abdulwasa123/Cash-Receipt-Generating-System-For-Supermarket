// === Utility Function to Format the Date ===
function formatDate(rawDate, format) {
  const date = new Date(rawDate);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return format === 'mm/dd/yyyy' ? `${mm}/${dd}/${yyyy}` : `${dd}/${mm}/${yyyy}`;
}

// === Generate Unique Receipt Number ===
function generateReceiptNumber() {
  const now = new Date();
  const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 900 + 100); // 3-digit
  return `SMK-${yyyymmdd}-${random}`;
}

// === Arrays to Track Items ===
let fixedItemsArray = [];
let customItemsArray = [];

// === Add Fixed Item Function ===
function addFixedItem() {
  const dropdown = document.getElementById('fixedItemDropdown');
  const selected = dropdown.value;
  if (!selected) return;

  const [itemName, priceStr] = selected.split('|');
  const price = parseFloat(priceStr);

  // Add to array
  fixedItemsArray.push({ name: itemName, price });

  // Update subtotal & count
  updateSubtotalAndCount(price);

  // Add to UI
  const list = document.getElementById('fixedItemList');
  const li = document.createElement('li');
  li.textContent = `${itemName} - $${price.toFixed(2)}`;
  list.appendChild(li);

  dropdown.selectedIndex = 0;
  updateReceipt();
}

// === Add Custom Item Function ===
function addCustomItem() {
  const nameInput = document.getElementById('customItemName');
  const priceInput = document.getElementById('customItemPrice');
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!name || isNaN(price)) return;

  customItemsArray.push({ name, price });

  // Update subtotal & count
  updateSubtotalAndCount(price);

  // Add to UI
  const list = document.getElementById('customItemList');
  const li = document.createElement('li');
  li.textContent = `${name} - $${price.toFixed(2)}`;
  list.appendChild(li);

  nameInput.value = '';
  priceInput.value = '';
  updateReceipt();
}

// === Helper: Update Subtotal and Item Count ===
function updateSubtotalAndCount(price) {
  const subtotalInput = document.getElementById('subtotal');
  const itemCountInput = document.getElementById('itemCount');

  const currentSubtotal = parseFloat(subtotalInput.value) || 0;
  const currentCount = parseInt(itemCountInput.value) || 0;

  subtotalInput.value = (currentSubtotal + price).toFixed(2);
  itemCountInput.value = currentCount + 1;
}

// === Update Receipt Preview ===
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

  // ✅ Update Item List in Preview
  const previewList = document.getElementById('previewItemList');
  previewList.innerHTML = '';

  const allItems = [...fixedItemsArray, ...customItemsArray];
  if (allItems.length > 0) {
    const ul = document.createElement('ul');
    ul.style.paddingLeft = '20px';
    allItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
      ul.appendChild(li);
    });
    previewList.appendChild(ul);
  }
}

// === Real-Time Input Syncing ===
const fields = [
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
    el.addEventListener('change', updateReceipt);
  }
});

// === Clear Form ===
function clearForm() {
  document.getElementById('cashierId').value = '';
  document.getElementById('receiptDate').value = '';
  document.getElementById('itemCount').value = '';
  document.getElementById('subtotal').value = '';
  document.getElementById('taxRate').value = '';
  document.getElementById('discount').value = '';
  document.getElementById('paymentMethod').value = 'Cash';
  document.getElementById('notes').value = '';
  document.getElementById('receiptNo').value = generateReceiptNumber();

  // Reset item arrays
  fixedItemsArray = [];
  customItemsArray = [];

  // Clear item lists
  document.getElementById('fixedItemList').innerHTML = '';
  document.getElementById('customItemList').innerHTML = '';
  document.getElementById('previewItemList').innerHTML = '';

  updateReceipt();
}

// === Print Receipt ===
function printReceipt() {
  const newReceiptNumber = generateReceiptNumber();
  document.getElementById('receiptNo').value = newReceiptNumber;
  updateReceipt();

  const printContents = document.getElementById('receiptPreview').innerHTML;
  const printWindow = window.open('', '', 'height=600,width=400');
  printWindow.document.write('<html><head><title>Print Receipt</title>');
  printWindow.document.write('<style>body{font-family:monospace;padding:20px;} h4{text-align:center;}</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(printContents);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

// === On Page Load ===
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('storeName').value = 'AYOMIDE GROCERY MART';
  document.getElementById('storeName').readOnly = true;
  document.getElementById('receiptNo').value = generateReceiptNumber();
  updateReceipt();
});
