export const amountFormat = (amount, format = true) => {
    const strAmount = String(amount); // 🛠 Convert to string
    const rawValue = strAmount.replace(/\D/g, '');

    if (format)
        return rawValue ? new Intl.NumberFormat('en-IN').format(rawValue) : '';
    else
        return Number(strAmount.replace(/,/g, ''));
};
