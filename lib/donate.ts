// Donation details shown on /donate. Leave a value empty ("" or null) to hide it.

// Link to an online giving page, e.g. a Paystack or Flutterwave payment page.
export const ONLINE_GIVING_URL = "";

// Bank transfer details. Set to null to hide the bank transfer option.
export const BANK_TRANSFER: { bank: string; accountName: string; accountNumber: string; note?: string } | null = null;
