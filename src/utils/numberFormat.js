export const formatCurrency = (amount) => {
  // Handle undefined, null, or zero
  if (!amount && amount !== 0) return '₱0.00';
  
  // Take absolute value and limit to 2 decimals
  const absValue = Math.abs(Number(amount));
  const formattedValue = absValue.toFixed(2);
  
  // Split number by decimal point
  const [whole, decimal] = formattedValue.split('.');
  
  // Add commas for thousands
  let formattedWhole = '';
  for (let i = 0; i < whole.length; i++) {
    if (i > 0 && (whole.length - i) % 3 === 0) {
      formattedWhole += ',';
    }
    formattedWhole += whole[i];
  }
  
  return `₱${formattedWhole}.${decimal}`;
};

export const formatNumber = (number) => {
  if (!number && number !== 0) return '0.00';
  
  // Take absolute value and limit to 2 decimals
  const absValue = Math.abs(Number(number));
  const formattedValue = absValue.toFixed(2);
  
  // Split number by decimal point
  const [whole, decimal] = formattedValue.split('.');
  
  // Add commas for thousands
  let formattedWhole = '';
  for (let i = 0; i < whole.length; i++) {
    if (i > 0 && (whole.length - i) % 3 === 0) {
      formattedWhole += ',';
    }
    formattedWhole += whole[i];
  }
  
  return `${formattedWhole}.${decimal}`;
};
