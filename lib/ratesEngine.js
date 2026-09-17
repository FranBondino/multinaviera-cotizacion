import { GLOBAL_PORTS } from './portsData';

// Carrier baseline metadata and route structure
// STRICT DATA INTEGRITY POLICY: Zero simulated or benchmark rates.
// Tariffs are only populated when verified live from an official spot API, quotation robot, or confirmed Almar contract.
export function calculateCarrierRates(polCode, podCode, equipment) {
  const pol = GLOBAL_PORTS.find(p => p.code === polCode) || { region: 'Asia Oriental', name: 'Shanghai' };
  const pod = GLOBAL_PORTS.find(p => p.code === podCode) || { region: 'Sudamérica ECSA', name: 'Buenos Aires' };

  let baseTransit = 24;
  if (pol.region?.includes('Asia') && pod.region?.includes('Sudamérica')) {
    baseTransit = 28;
  } else if (pol.region?.includes('Europa') && pod.region?.includes('Sudamérica')) {
    baseTransit = 20;
  } else if (pol.region?.includes('Norteamérica') && pod.region?.includes('Sudamérica')) {
    baseTransit = 16;
  }

  const now = Date.now();

  return [
    {
      carrier: 'MSC',
      logo: '🛥️',
      color: '#1a1a1a',
      accentColor: '#eab308',
      serviceName: 'Ipanema / Albatros Service',
      transitDays: baseTransit + 6,
      etd: new Date(now + 6 * 86400000).toISOString().split('T')[0],
      eta: new Date(now + (6 + baseTransit + 6) * 86400000).toISOString().split('T')[0],
      vessel: 'MSC VESSEL',
      baseFreight: null,
      thc: null,
      baf: null,
      currency: 'USD',
      apiSource: 'API Oficial MSC (DPO Connect)',
      isRateVerified: false,
      rateStatus: 'Tarifa Spot / Convenio a cotizar'
    },
    {
      carrier: 'ONE',
      logo: '🌸',
      color: '#3b0024',
      accentColor: '#E4007F',
      serviceName: 'SX1 / SX2 Express',
      transitDays: baseTransit + 3,
      etd: new Date(now + 5 * 86400000).toISOString().split('T')[0],
      eta: new Date(now + (5 + baseTransit + 3) * 86400000).toISOString().split('T')[0],
      vessel: 'ONE VESSEL',
      baseFreight: null,
      thc: null,
      baf: null,
      currency: 'USD',
      apiSource: 'API Oficial ONE (ecomm.one-line.com)',
      isRateVerified: false,
      rateStatus: 'Tarifa Spot / Convenio a cotizar'
    },
    {
      carrier: 'Maersk',
      logo: '🚢',
      color: '#00243d',
      accentColor: '#06b6d4',
      serviceName: 'AE1 / FE4 Express',
      transitDays: baseTransit,
      etd: new Date(now + 6 * 86400000).toISOString().split('T')[0],
      eta: new Date(now + (6 + baseTransit) * 86400000).toISOString().split('T')[0],
      vessel: 'MAERSK VESSEL',
      baseFreight: null,
      thc: null,
      baf: null,
      currency: 'USD',
      apiSource: 'API Oficial Maersk DCSA',
      isRateVerified: false,
      rateStatus: 'Tarifa Spot / Convenio a cotizar'
    },
    {
      carrier: 'CMA CGM',
      logo: '⚓',
      color: '#002554',
      accentColor: '#ef4444',
      serviceName: 'SEAS 1 Direct Service',
      transitDays: baseTransit + 4,
      etd: new Date(now + 8 * 86400000).toISOString().split('T')[0],
      eta: new Date(now + (8 + baseTransit + 4) * 86400000).toISOString().split('T')[0],
      vessel: 'CMA CGM VESSEL',
      baseFreight: null,
      thc: null,
      baf: null,
      currency: 'USD',
      apiSource: 'CMA CGM Portal',
      isRateVerified: false,
      rateStatus: 'Tarifa Spot / Convenio a cotizar'
    },
    {
      carrier: 'Hapag-Lloyd',
      logo: '🌐',
      color: '#003056',
      accentColor: '#f97316',
      serviceName: 'AL5 / SW2 Express',
      transitDays: Math.max(12, baseTransit - 2),
      etd: new Date(now + 5 * 86400000).toISOString().split('T')[0],
      eta: new Date(now + (5 + baseTransit - 2) * 86400000).toISOString().split('T')[0],
      vessel: 'HAPAG VESSEL',
      baseFreight: null,
      thc: null,
      baf: null,
      currency: 'USD',
      apiSource: 'Hapag-Lloyd Portal',
      isRateVerified: false,
      rateStatus: 'Tarifa Spot / Convenio a cotizar'
    }
  ];
}
