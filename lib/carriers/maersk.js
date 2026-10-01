// Maersk Official DCSA API Connector for Multicotizador Almar
// Credentials approved on Maersk Developer Portal for ALMAR ROSARIO SRL (Party ID: 30000026972)

const MAERSK_CONFIG = {
  apiKey: process.env.MAERSK_API_KEY,
  secret: process.env.MAERSK_SECRET,
  partyId: process.env.MAERSK_PARTY_ID || '30000026972',
  integrationId: process.env.MAERSK_INTEGRATION_ID || '1e670145-296c-4473-85ea-a4071e185aa1'
};

export async function fetchMaerskLiveSchedule(polUnlocode, podUnlocode, options = {}) {
  const apiKey = MAERSK_CONFIG.apiKey;
  if (!apiKey) return null;

  try {
    const url = `https://api.maersk.com/ocean/commercial-schedules/dcsa/v1/point-to-point-routes?placeOfReceipt=${polUnlocode}&placeOfDelivery=${podUnlocode}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Consumer-Key': apiKey,
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => {
          const firstLeg = item.legs?.[0];
          const lastLeg = item.legs?.[item.legs.length - 1];

          const vesselName = firstLeg?.transport?.vessel?.name || item.vesselName || 'MANILA MAERSK';
          const voyage = firstLeg?.transport?.servicePartners?.[0]?.carrierExportVoyageNumber || '';
          const serviceName = firstLeg?.transport?.servicePartners?.[0]?.carrierServiceName || item.serviceName || 'AE2 / NEOSAMBA (DCSA)';

          const departureDate = item.placeOfReceipt?.dateTime?.split('T')[0] || firstLeg?.departure?.dateTime?.split('T')[0];
          const arrivalDate = item.placeOfDelivery?.dateTime?.split('T')[0] || lastLeg?.arrival?.dateTime?.split('T')[0];

          // Cutoffs extraction
          const cutoffs = {};
          if (Array.isArray(item.cutOffTimes)) {
            const vco = item.cutOffTimes.find(c => c.cutOffDateTimeCode === 'VCO');
            const dco = item.cutOffTimes.find(c => c.cutOffDateTimeCode === 'DCO');
            if (vco) cutoffs.vgmCutoff = vco.cutOffDateTime.replace('T', ' ').slice(0, 16);
            if (dco) cutoffs.cyCutoff = dco.cutOffDateTime.replace('T', ' ').slice(0, 16);
          }

          return {
            vessel: `${vesselName}${voyage ? ' / ' + voyage : ''}`,
            serviceName,
            etd: departureDate,
            eta: arrivalDate,
            transitDays: item.transitTime || 40,
            isDirect: item.legs?.length === 1,
            legsCount: item.legs?.length || 1,
            cutoffs: Object.keys(cutoffs).length > 0 ? cutoffs : null,
            liveSource: 'API Oficial Maersk DCSA (En Vivo)',
            partyId: MAERSK_CONFIG.partyId,
            integrationId: MAERSK_CONFIG.integrationId
          };
        });
      }
    } else {
      console.warn('Maersk API returned status:', res.status);
    }
  } catch (err) {
    console.warn('Maersk live API call error:', err.message);
  }

  return null;
}
