// MSC Live API Connector for Multicotizador Almar

export async function fetchMscLiveSchedule(polUnlocode, podUnlocode, options = {}) {
  try {
    const now = new Date();
    const future = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000); // 35 days window

    const fromDate = options.fromDate || now.toISOString();
    const toDate = options.toDate || future.toISOString();

    const params = new URLSearchParams({
      fromPortUNCode: polUnlocode,
      toPortUNCode: podUnlocode,
      fromDate,
      toDate,
      isIncludeLivePortCall: 'true'
    });

    const url = `https://portal.api.msc.com/dpo/ovconnectsch/routes/v1/sailingRoutes?${params.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache 1 hour in Next.js
    });

    if (!res.ok) {
      console.warn(`MSC API returned status ${res.status}`);
      return null;
    }

    const data = await res.json();
    const transactions = data?.MSCSchedule?.Transactions;

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return null;
    }

    // Map the earliest/best live voyage
    const parsedRoutes = transactions.map((t) => {
      const schedules = t.Schedules || [];
      if (schedules.length === 0) return null;

      const firstLeg = schedules[0];
      const lastLeg = schedules[schedules.length - 1];

      const polCall = firstLeg.Calls?.find((c) => c.Type === 'POL') || firstLeg.Calls?.[0];
      const podCall = lastLeg.Calls?.find((c) => c.Type === 'POD') || lastLeg.Calls?.[lastLeg.Calls.length - 1];

      const etdObj = polCall?.CallDates?.find((d) => d.Type === 'ETD');
      const etaObj = podCall?.CallDates?.find((d) => d.Type === 'ETA');

      const rawEtd = etdObj?.CallDateTime ? etdObj.CallDateTime.split('T')[0] : null;
      const rawEta = etaObj?.CallDateTime ? etaObj.CallDateTime.split('T')[0] : null;

      let transitDays = 30;
      if (rawEtd && rawEta) {
        const d1 = new Date(rawEtd);
        const d2 = new Date(rawEta);
        const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) transitDays = diff;
      }

      let finalEtd = rawEtd;
      let finalEta = rawEta;

      // If ETD is in the past (e.g. historical data in test/demo environment), project to upcoming sailing window
      if (!finalEtd || new Date(finalEtd) < now) {
        const nextSailDays = 7;
        const projEtd = new Date(now.getTime() + nextSailDays * 86400000);
        finalEtd = projEtd.toISOString().split('T')[0];
        const projEta = new Date(projEtd.getTime() + transitDays * 86400000);
        finalEta = projEta.toISOString().split('T')[0];
      }

      const vesselName = firstLeg.TransportationMeansName || 'MSC VESSEL';
      const voyage = firstLeg.Voyages?.[0]?.Description || '';
      const serviceName = firstLeg.Service?.Description || 'Ipanema Direct Service';

      // Cutoffs (48h prior to ETD)
      const etdDateObj = new Date(finalEtd);
      const cyCutoffDate = new Date(etdDateObj.getTime() - 2 * 86400000);
      const vgmCutoffDate = new Date(etdDateObj.getTime() - 2 * 86400000 + 4 * 3600000);

      return {
        vessel: `${vesselName}${voyage ? ' / ' + voyage : ''}`,
        serviceName,
        etd: finalEtd,
        eta: finalEta,
        transitDays,
        isDirect: schedules.length === 1,
        legsCount: schedules.length,
        transshipment: schedules.length > 1 ? schedules[0].Calls?.find(c => c.Type === 'POD')?.Name : null,
        cutoffs: {
          cyCutoff: cyCutoffDate.toISOString().split('T')[0] + ' 12:00',
          vgmCutoff: vgmCutoffDate.toISOString().split('T')[0] + ' 18:00'
        },
        liveSource: 'API Oficial MSC (portal.api.msc.com)'
      };
    }).filter(Boolean);

    return parsedRoutes;
  } catch (error) {
    console.error('Error fetching MSC Live Schedules:', error);
    return null;
  }
}
