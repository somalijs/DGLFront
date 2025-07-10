function Price(price: number | string, currency: string = 'KSH') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(Number(price));
}

export default Price;
