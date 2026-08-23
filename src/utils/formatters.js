export const formatUzbekPhoneNumber = (input, currentPhone) => {
  if (input.length < 5) return "+998 ";

  const rawNumbers = input.slice(5).replace(/\D/g, "");
  const limitedNumbers = rawNumbers.substring(0, 9);

  let formatted = "+998 ";
  if (limitedNumbers.length > 0) formatted += "(" + limitedNumbers.substring(0, 2);
  if (limitedNumbers.length >= 3) formatted += ") " + limitedNumbers.substring(2, 5);
  if (limitedNumbers.length >= 6) formatted += "-" + limitedNumbers.substring(5, 7);
  if (limitedNumbers.length >= 8) formatted += "-" + limitedNumbers.substring(7, 9);

  return formatted;
};
