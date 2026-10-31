import QRCode from "qrcode";
import { CopyButton } from "./CopyButton";

// QR code for the plain address, which every wallet and exchange app can scan.
async function qrSvg(address: string) {
  return QRCode.toString(address, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: "#22493c", light: "#ffffff" },
  });
}

export async function BitcoinDonation({ address, note }: { address: string; note?: string }) {
  const svg = await qrSvg(address);
  return (
    <article className="donate-option donate-crypto" id="bitcoin">
      <div
        className="donate-qr"
        role="img"
        aria-label="QR code of the OASIS Bitcoin address"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="donate-crypto-body">
        <h3>Give in Bitcoin (BTC)</h3>
        <p>Scan the QR code with your wallet or exchange app, or copy the address below.</p>
        <p className="crypto-label">Bitcoin address · Network: Bitcoin (BTC)</p>
        <code className="crypto-address">{address}</code>
        <div className="crypto-actions">
          <CopyButton text={address} label="Copy address" />
          <a className="btn btn-small btn-outline" href={`bitcoin:${address}`}>
            Open in wallet app
          </a>
        </div>
        <p className="crypto-warning">
          <strong>Send only Bitcoin (BTC) on the Bitcoin network.</strong> Other coins, or BTC sent on another network
          such as BEP20, ERC20, TRC20 or Lightning, cannot be recovered.
        </p>
        {note && <p>{note}</p>}
        <p className="small">Would you like a receipt? Email us the transaction ID after you give.</p>
      </div>
    </article>
  );
}
