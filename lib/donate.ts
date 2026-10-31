// Donation details shown on /donate. Leave a value empty ("" or null) to hide it.

// Link to an online giving page, e.g. a Paystack or Flutterwave payment page.
export const ONLINE_GIVING_URL = "";

// Bank transfer details. Set to null to hide the bank transfer option.
export const BANK_TRANSFER: { bank: string; accountName: string; accountNumber: string; note?: string } | null = null;

// Bitcoin donations, shown with a QR code. Set to null to hide the Bitcoin option.
// Only use a legacy (1…), P2SH (3…) or native SegWit (bc1…) Bitcoin mainnet address.
export const BITCOIN: { address: string; note?: string } | null = {
  address: "1CqXBwo9yiSyrdWeGEss5oSNBobU6Ke2vb",
};
