// Loads the Cashfree v3 SDK from CDN (no npm package) and opens checkout.
const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';
let sdkPromise = null;

function loadSdk() {
  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK_URL;
    s.onload = () => resolve(window.Cashfree);
    s.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

// Opens the Cashfree checkout modal for a payment session.
// mode: 'sandbox' (TEST) | 'production'. Returns the checkout result.
export async function openCashfreeCheckout(paymentSessionId, mode = 'sandbox') {
  const Cashfree = await loadSdk();
  const cashfree = Cashfree({ mode: mode === 'TEST' ? 'sandbox' : mode === 'PROD' ? 'production' : mode });
  return cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' });
}
