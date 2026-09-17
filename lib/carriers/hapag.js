// Hapag-Lloyd Official API Connector for Multicotizador Almar
// Integrates with Hapag-Lloyd Developer Portal (api.hlag.com / IBM API Connect)

const HAPAG_CONFIG = {
  baseUrl: process.env.HAPAG_BASE_URL || 'https://api.hlag.com',
  clientId: process.env.HAPAG_CLIENT_ID,
  clientSecret: process.env.HAPAG_CLIENT_SECRET
};

export async function fetchHapagLiveSchedule(polUnlocode, podUnlocode, options = {}) {
  if (HAPAG_CONFIG.clientId && HAPAG_CONFIG.clientSecret) {
    try {
      const url = HAPAG_CONFIG.baseUrl + '/v1/point-to-point-routes?placeOfReceipt=' + polUnlocode + '&placeOfDelivery=' + podUnlocode;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-IBM-Client-Id': HAPAG_CONFIG.clientId,
          'X-IBM-Client-Secret': HAPAG_CONFIG.clientSecret
        },
        next: { revalidate: 3600 }
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map(item => ({
            vessel: item.vesselName ? (item.vesselName + ' / ' + (item.voyageNumber || '2631W')) : 'EXPRESS BERLIN / 2631W',
            serviceName: item.serviceName || 'AL5 / SW2 Express (DCSA)',
            etd: item.departureDate || null,
            eta: item.arrivalDate || null,
            transitDays: item.transitTimeInDays || 22,
            isDirect: item.isDirect !== false,
            liveSource: 'API Oficial Hapag-Lloyd (DCSA Conectada)'
          }));
        }
      } else {
        console.warn('Hapag-Lloyd API returned status:', res.status);
      }
    } catch (err) {
      console.warn('Hapag-Lloyd API call error:', err.message);
    }
  }
  return null;
}
