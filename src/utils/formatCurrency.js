export const formatCurrency = (amount, currencyCode = 'IDR') => {
  if (!amount && amount !== 0) return currencyCode === 'IDR' ? 'Rp 0' : '$0';
  return new Intl.NumberFormat(currencyCode === 'IDR' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount);
};
