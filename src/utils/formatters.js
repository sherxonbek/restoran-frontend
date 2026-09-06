export const formatUzbekPhoneNumber = (input) => {
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

/**
 * Stol nomidan xona nomini ajratib, toza stol nomini qaytaradi
 * Masalan: "Xona 1 / 2-stol" -> "2-stol"
 */
export const formatTableName = (name, fallbackId) => {
  if (!name) return fallbackId ? `№${fallbackId}` : "Nomsiz stol";
  return name.includes("/") ? name.split("/")[1]?.trim() : name;
};

/**
 * Pul miqdorini o'zbek so'mi formatida chiqaradi
 * Masalan: 35000 -> "35,000 so'm"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "0 so'm";
  return `${Number(amount).toLocaleString()} so'm`;
};
