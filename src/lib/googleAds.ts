/** Google Ads conversion tag (gtag.js) for cholesport.co.il */
export const GOOGLE_ADS_TAG_ID = "AW-18334610743";

export const GOOGLE_ADS_GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_TAG_ID}`;

export const GOOGLE_ADS_INIT_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_TAG_ID}');`;
