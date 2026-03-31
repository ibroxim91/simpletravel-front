const onlyNumber = (digits: string | number) => {
  const phone = digits.toString();
  return phone.replace(/\D/g, '');
};

export default onlyNumber;
