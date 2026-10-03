/**
 * DEMO DATA & BUSINESS LOGIC MODULE — Cotizador Marítimo Almar Rosario
 * Almar Rosario S.R.L. — Fase 3: Pantalla Demo Interactiva (/demo)
 * 
 * Fuentes de datos reales:
 * - Tarifarios Semanales W40/W41 de Eversail Logistics Inc.
 * - Fórmulas comerciales y cotizaciones oficiales de Almar Rosario.
 * - Itinerarios náuticos oficiales DCSA (Maersk, MSC, ONE, Hapag-Lloyd, PIL).
 * - Operatoria portuaria real: Terminal Puerto Rosario (TPR) vs. Buenos Aires (ARBUE).
 */

// ============================================================================
// 1. RECARGOS Y CONSTANTES COMERCIALES (SURCHARGES)
// ============================================================================

export const BUY_FREE_TIME_USD = 100; // 21 días libres de estadía en destino
export const VESSEL_PROTECTION_USD = 29; // Cobertura de protección de buque
export const PEAJE_HIDROVIA_USD = 175; // Peaje fluvial Dragado Hidrovía Paraná (escala TPR)
export const DEFAULT_ALMAR_MARGIN = {
  '40HC': 250, // USD 250 margen estándar Almar para 40' High Cube
  '20GP': 200, // USD 200 margen estándar Almar para 20' General Purpose
};
export const DEFAULT_ALMAR_MARGIN_40HC_USD = 250;
export const DEFAULT_ALMAR_MARGIN_20GP_USD = 200;

export const LOCAL_AGENCY_FEE_USD = 800; // Gastos de agencia marítima en destino (Exento de IVA)
export const LOCAL_DOC_FEE_USD = 75; // Documentación / BL Fee
export const LOCAL_DOC_FEE_VAT_USD = 15.75; // IVA 21% sobre Documentación ($75 * 0.21)

export const OPTIONAL_INSURANCE_MIN_USD = 60; // Mínimo de seguro de carga internacional
export const OPTIONAL_INSURANCE_RATE = 0.0055; // 0.55% sobre valor CIF mercadería
export const OPTIONAL_INSURANCE_VAT_USD = 12.60; // IVA 21% sobre mínimo de seguro ($60 * 0.21)

export const OPTIONAL_ROAD_FREIGHT_BUE_ROS_USD = 700; // Flete carretero expreso BUE -> Planta Rosario
export const HWS_SURCHARGE_USD = 200; // Recargo de sobrepeso (Heavy Weight Surcharge)
export const HWS_WEIGHT_THRESHOLD_KG = 20000; // Límite de 20.000 kg para contenedores 20'GP

export const SURCHARGES = {
  BUY_FREE_TIME_USD,
  VESSEL_PROTECTION_USD,
  PEAJE_HIDROVIA_USD,
  DEFAULT_ALMAR_MARGIN,
  DEFAULT_ALMAR_MARGIN_40HC_USD,
  DEFAULT_ALMAR_MARGIN_20GP_USD,
  LOCAL_AGENCY_FEE_USD,
  LOCAL_DOC_FEE_USD,
  LOCAL_DOC_FEE_VAT_USD,
  OPTIONAL_INSURANCE_MIN_USD,
  OPTIONAL_INSURANCE_RATE,
  OPTIONAL_INSURANCE_VAT_USD,
  OPTIONAL_ROAD_FREIGHT_BUE_ROS_USD,
  HWS_SURCHARGE_USD,
  HWS_WEIGHT_THRESHOLD_KG,
};

// ============================================================================
// 2. PUERTOS DE ORIGEN (CHINA / FAR EAST)
// ============================================================================

export const ORIGIN_PORTS = [
  {
    code: 'CNSHA',
    unlocode: 'CNSHA',
    name: 'Shanghai',
    fullName: 'Shanghai Port (Yangshan / Waigaoqiao)',
    country: 'China 🇨🇳',
    region: 'Asia Oriental',
    agentContact: 'May Gu (may-sha@eversaillogistics.com)',
    arbitraryTPR: 100,
  },
  {
    code: 'CNNGB',
    unlocode: 'CNNGB',
    name: 'Ningbo',
    fullName: 'Ningbo-Zhoushan Port',
    country: 'China 🇨🇳',
    region: 'Asia Oriental',
    agentContact: 'Sue Wang (sue-nbo@eversaillogistics.com)',
    arbitraryTPR: 100,
  },
  {
    code: 'CNSZX',
    unlocode: 'CNSZX',
    name: 'Shenzhen',
    fullName: 'Shenzhen Port (Shekou / Yantian)',
    country: 'China 🇨🇳',
    region: 'Asia Oriental',
    agentContact: 'Kamil Liu (kamil-szn@eversaillogistics.com)',
    arbitraryTPR: 100,
  },
  {
    code: 'CNTAO',
    unlocode: 'CNTAO',
    name: 'Qingdao',
    fullName: 'Qingdao Port',
    country: 'China 🇨🇳',
    region: 'Asia Oriental',
    agentContact: 'Mia Zhao (mia-qdo@eversaillogistics.com)',
    arbitraryTPR: 200, // Delta +USD 200 para TPR
  },
  {
    code: 'CNTXG',
    unlocode: 'CNTXG',
    name: 'Tianjin / Xingang',
    fullName: 'Tianjin Xingang Port',
    country: 'China 🇨🇳',
    region: 'Asia Oriental',
    agentContact: 'Mia Sun (mia-tjn@eversaillogistics.com)',
    arbitraryTPR: 200, // Delta +USD 200 para TPR
  },
];

// ============================================================================
// 3. SELECTOR DE PUERTOS DE DESTINO (PORT_OPTIONS)
// ============================================================================

export const PORT_OPTIONS = [
  {
    code: 'ARROS',
    shortCode: 'ROS',
    unlocode: 'ARROS',
    name: 'Rosario TPR',
    fullName: 'Terminal Puerto Rosario (TPR S.A.)',
    country: 'Argentina 🇦🇷',
    region: 'Sudamérica ECSA',
    share: '74%',
    shareNumber: 74,
    badgeText: '74% Operaciones',
    isPrimary: true,
    isPopular: true,
    type: 'fluvial',
    transitDaysMin: 45,
    transitDaysMax: 55,
    transitTimeText: '45-55 días (vía feeder fluvial)',
    feederMode: 'Barcaza Fluvial / Transbordo MVD o Santos',
    arbitraryFeederUSD: 100, // +100 para Shanghai/Ningbo/Shenzhen, +200 Qingdao/Tianjin
    tollHidroviaUSD: 175,
    tollDescription: 'Peaje Hidrovía Paraná (Dragado y Balizamiento)',
    allowRoadFreight: false,
    description: 'Arribo directo al Cordón Industrial Rosario vía feeder barcacero.',
  },
  {
    code: 'ARBUE',
    shortCode: 'BUE',
    unlocode: 'ARBUE',
    name: 'Buenos Aires',
    fullName: 'Puerto de Buenos Aires (TRP / Exolgan / BACTSSA)',
    country: 'Argentina 🇦🇷',
    region: 'Sudamérica ECSA',
    share: '22%',
    shareNumber: 22,
    badgeText: '22% Operaciones',
    isPrimary: true,
    isPopular: true,
    type: 'oceanic',
    transitDaysMin: 35,
    transitDaysMax: 40,
    transitTimeText: '35-40 días (directo oceánico)',
    feederMode: 'Directo Oceánico (Sin transbordo de barcaza)',
    arbitraryFeederUSD: 0,
    tollHidroviaUSD: 0,
    allowRoadFreight: true,
    roadFreightUSD: 700,
    roadFreightDescription: 'Camión portacontenedor carretero expreso a planta Rosario (+USD 700)',
    description: 'Descarga oceánica rápida en Terminales de Buenos Aires o Dock Sud.',
  },
  {
    code: 'ARZAE',
    shortCode: 'ZAR',
    unlocode: 'ARZAE',
    name: 'Zárate',
    fullName: 'Terminal Zárate (TZ Multiproposito)',
    country: 'Argentina 🇦🇷',
    region: 'Sudamérica ECSA',
    share: '2%',
    shareNumber: 2,
    badgeText: '2% Tráfico',
    isPrimary: false,
    isPopular: true,
    type: 'fluvial',
    transitDaysMin: 40,
    transitDaysMax: 48,
    transitTimeText: '40-48 días (feeder fluvial)',
    feederMode: 'Feeder Fluvial Río Paraná Guazú',
    arbitraryFeederUSD: 150,
    tollHidroviaUSD: 120,
    allowRoadFreight: false,
    description: 'Terminal multipropósito ideal para automotriz y cargas de proyecto.',
  },
  {
    code: 'UYMVD',
    shortCode: 'MVD',
    unlocode: 'UYMVD',
    name: 'Montevideo',
    fullName: 'Puerto de Montevideo (Katoen Natie / TCP)',
    country: 'Uruguay 🇺🇾',
    region: 'Sudamérica ECSA',
    share: '1%',
    shareNumber: 1,
    badgeText: 'Hub Transbordo',
    isPrimary: false,
    isPopular: true,
    type: 'oceanic',
    transitDaysMin: 33,
    transitDaysMax: 38,
    transitTimeText: '33-38 días (hub oceánico)',
    feederMode: 'Hub de Conexión Regional para Feeders',
    arbitraryFeederUSD: 0,
    tollHidroviaUSD: 0,
    allowRoadFreight: false,
    description: 'Puerto libre regional y centro de trasbordo para barcazas a TPR.',
  },
  // Puertos Internacionales / Tráficos Especiales
  {
    code: 'BRSSZ',
    shortCode: 'SSZ',
    unlocode: 'BRSSZ',
    name: 'Santos',
    fullName: 'Porto de Santos',
    country: 'Brasil 🇧🇷',
    region: 'Sudamérica ECSA',
    share: '<1%',
    isPrimary: false,
    isPopular: false,
    type: 'oceanic',
    transitDaysMin: 28,
    transitDaysMax: 32,
    transitTimeText: '28-32 días',
    feederMode: 'Directo Oceánico',
    arbitraryFeederUSD: 0,
    tollHidroviaUSD: 0,
    allowRoadFreight: false,
    description: 'Principal hub portuario de Sudamérica.',
  },
  {
    code: 'CLVAP',
    shortCode: 'VAP',
    unlocode: 'CLVAP',
    name: 'Valparaíso',
    fullName: 'Puerto de Valparaíso',
    country: 'Chile 🇨🇱',
    region: 'Sudamérica WCSA',
    share: '<1%',
    isPrimary: false,
    isPopular: false,
    type: 'oceanic',
    transitDaysMin: 35,
    transitDaysMax: 42,
    transitTimeText: '35-42 días',
    feederMode: 'Oceánico Costa Oeste',
    arbitraryFeederUSD: 0,
    tollHidroviaUSD: 0,
    allowRoadFreight: false,
    description: 'Conexión Pacífico y Corredor Bioceánico.',
  },
  {
    code: 'ITGOA',
    shortCode: 'GOA',
    unlocode: 'ITGOA',
    name: 'Génova',
    fullName: 'Port of Genoa (Vado Ligure / Sampierdarena)',
    country: 'Italia 🇮🇹',
    region: 'Mediterráneo',
    share: '<1%',
    isPrimary: false,
    isPopular: false,
    type: 'oceanic',
    transitDaysMin: 25,
    transitDaysMax: 30,
    transitTimeText: '25-30 días',
    feederMode: 'Mediterráneo Directo',
    arbitraryFeederUSD: 0,
    tollHidroviaUSD: 0,
    allowRoadFreight: false,
    description: 'Tráfico de importación maquinaria y químicos desde Italia.',
  },
  {
    code: 'DEHAM',
    shortCode: 'HAM',
    unlocode: 'DEHAM',
    name: 'Hamburgo',
    fullName: 'Port of Hamburg (HHLA)',
    country: 'Alemania 🇩🇪',
    region: 'Europa Norte',
    share: '<1%',
    isPrimary: false,
    isPopular: false,
    type: 'oceanic',
    transitDaysMin: 28,
    transitDaysMax: 34,
    transitTimeText: '28-34 días',
    feederMode: 'Europa Norte / LCL Hub MSL',
    arbitraryFeederUSD: 0,
    tollHidroviaUSD: 0,
    allowRoadFreight: false,
    description: 'Ruta clave para consolidados LCL operados vía MSL / SACO.',
  },
  {
    code: 'USCHS',
    shortCode: 'CHS',
    unlocode: 'USCHS',
    name: 'Charleston',
    fullName: 'Port of Charleston (Wando Welch Terminal)',
    country: 'EEUU 🇺🇸',
    region: 'Norteamérica',
    share: '<1%',
    isPrimary: false,
    isPopular: false,
    type: 'oceanic',
    transitDaysMin: 22,
    transitDaysMax: 28,
    transitTimeText: '22-28 días',
    feederMode: 'Costa Este USA',
    arbitraryFeederUSD: 0,
    tollHidroviaUSD: 0,
    allowRoadFreight: false,
    description: 'Cargas industriales y repuestos desde Estados Unidos.',
  },
];

// ============================================================================
// 4. BUQUES OFICIALES E ITINERARIOS DCSA EN VIVO (DCSA_VESSELS)
// ============================================================================

export const DCSA_VESSELS = [
  {
    id: 'VESSEL-001',
    vesselName: 'MANILA MAERSK',
    voyage: '638W',
    fullName: 'MANILA MAERSK / 638W',
    carrier: 'Maersk Line',
    carrierCode: 'MSK',
    carrierColor: '#00243d',
    service: 'AE2 / NEOSAMBA',
    flag: '🇩🇰 Dinamarca',
    imo: '9780445',
    builtYear: 2018,
    teuCapacity: 20568,
    etd: '2026-10-10',
    cutOff: '2026-10-07',
    etaBUE: '2026-11-18',
    etaTPR: '2026-11-29',
    transitDaysBUE: 39,
    transitDaysTPR: 50,
    feederPort: 'Montevideo (UYMVD)',
    status: 'Confirmed / On Schedule',
  },
  {
    id: 'VESSEL-002',
    vesselName: 'MARGRETHE MAERSK',
    voyage: '2640W',
    fullName: 'MARGRETHE MAERSK / 2640W',
    carrier: 'Maersk Line',
    carrierCode: 'MSK',
    carrierColor: '#00243d',
    service: 'AE2 / NEOSAMBA',
    flag: '🇩🇰 Dinamarca',
    imo: '9632064',
    builtYear: 2015,
    teuCapacity: 18270,
    etd: '2026-10-12',
    cutOff: '2026-10-09',
    etaBUE: '2026-11-20',
    etaTPR: '2026-12-01',
    transitDaysBUE: 39,
    transitDaysTPR: 50,
    feederPort: 'Montevideo (UYMVD)',
    status: 'Confirmed / On Schedule',
  },
  {
    id: 'VESSEL-003',
    vesselName: 'MSC CLEA',
    voyage: '2639S',
    fullName: 'MSC CLEA / 2639S',
    carrier: 'MSC',
    carrierCode: 'MSC',
    carrierColor: '#1a1a1a',
    accentColor: '#eab308',
    service: 'Ipanema / Albatros',
    flag: '🇵🇦 Panamá',
    imo: '9347786',
    builtYear: 2007,
    teuCapacity: 8533,
    etd: '2026-10-08',
    cutOff: '2026-10-05',
    etaBUE: '2026-11-16',
    etaTPR: '2026-11-27',
    transitDaysBUE: 39,
    transitDaysTPR: 50,
    feederPort: 'Santos (BRSSZ)',
    status: 'Confirmed / On Schedule',
  },
  {
    id: 'VESSEL-004',
    vesselName: 'YM MODERATION',
    voyage: '084E',
    fullName: 'YM MODERATION / 084E',
    carrier: 'ONE (Ocean Network Express)',
    carrierCode: 'ONE',
    carrierColor: '#E4007F',
    service: 'SX1 / SX2 Express',
    flag: '🇱🇷 Liberia',
    imo: '9664897',
    builtYear: 2014,
    teuCapacity: 8560,
    etd: '2026-10-11',
    cutOff: '2026-10-08',
    etaBUE: '2026-11-17',
    etaTPR: '2026-11-28',
    transitDaysBUE: 37,
    transitDaysTPR: 48,
    feederPort: 'Montevideo (UYMVD)',
    status: 'Confirmed / On Schedule',
  },
  {
    id: 'VESSEL-005',
    vesselName: 'King of the Seas',
    voyage: '2103N',
    fullName: 'King of the Seas / 2103N',
    carrier: 'Hapag-Lloyd',
    carrierCode: 'HAPAG',
    carrierColor: '#ea580c',
    service: 'AL5 / Great Lion Express',
    flag: '🇲🇭 Islas Marshall',
    imo: '9484948',
    builtYear: 2011,
    teuCapacity: 6589,
    etd: '2026-10-09',
    cutOff: '2026-10-06',
    etaBUE: '2026-11-19',
    etaTPR: '2026-11-30',
    transitDaysBUE: 41,
    transitDaysTPR: 52,
    feederPort: 'Santos (BRSSZ)',
    status: 'Confirmed / On Schedule',
  },
];

// ============================================================================
// 5. TARIFARIOS OFICIALES EVERSAIL LOGISTICS INC. (SEMANA 40 / 41)
// ============================================================================

export const EVERSAIL_RATES_W40_41 = [
  // --- SHANGHAI (CNSHA) ---
  {
    id: 'ES-W41-SHA-MSK',
    originCode: 'CNSHA',
    originName: 'Shanghai',
    carrier: 'Maersk Line',
    carrierCode: 'MSK',
    carrierColor: '#00243d',
    service: 'AE2 / NEOSAMBA',
    vessel: 'MANILA MAERSK / 638W',
    vesselRef: 'VESSEL-001',
    rates: {
      ARBUE: { '20GP': 5600, '40HC': 6100 },
      ARROS: { '20GP': 5700, '40HC': 6200 },
    },
    arbitraryTPR: 100, // Delta +USD 100 a TPR
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 40/41 (Válido 01 al 15 Octubre 2026)',
      validFrom: '2026-10-01',
      validTo: '2026-10-15',
    },
    contact: {
      name: 'May Gu',
      email: 'may-sha@eversaillogistics.com',
      role: 'Assistant Manager ECSA',
      office: 'Eversail Logistics Inc. Shanghai',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA VIGENTE',
    notes: 'Tarifario semanal periódico verificado. Sujeto a 21 días libres con Buy Free Time incluido.',
  },
  {
    id: 'ES-W41-SHA-MSC',
    originCode: 'CNSHA',
    originName: 'Shanghai',
    carrier: 'MSC',
    carrierCode: 'MSC',
    carrierColor: '#1a1a1a',
    accentColor: '#eab308',
    service: 'Ipanema / Albatros',
    vessel: 'MSC CLEA / 2639S',
    vesselRef: 'VESSEL-003',
    rates: {
      ARBUE: { '20GP': 5550, '40HC': 6050 },
      ARROS: { '20GP': 5650, '40HC': 6150 },
    },
    arbitraryTPR: 100,
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 40/41 (Válido 01 al 15 Octubre 2026)',
      validFrom: '2026-10-01',
      validTo: '2026-10-15',
    },
    contact: {
      name: 'May Gu',
      email: 'may-sha@eversaillogistics.com',
      role: 'Assistant Manager ECSA',
      office: 'Eversail Logistics Inc. Shanghai',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA VIGENTE',
    notes: 'Servicio conjunto Ipanema con escala feeder en Santos / Montevideo.',
  },

  // --- NINGBO (CNNGB) ---
  {
    id: 'ES-W41-NGB-MSK',
    originCode: 'CNNGB',
    originName: 'Ningbo',
    carrier: 'Maersk Line',
    carrierCode: 'MSK',
    carrierColor: '#00243d',
    service: 'AE2 / NEOSAMBA',
    vessel: 'MANILA MAERSK / 638W',
    vesselRef: 'VESSEL-001',
    rates: {
      ARBUE: { '20GP': 5040, '40HC': 5600 },
      ARROS: { '20GP': 5140, '40HC': 5700 },
    },
    arbitraryTPR: 100, // Delta +USD 100 a TPR
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 41 (PCD Oct 05 to Oct 11)',
      validFrom: '2026-10-05',
      validTo: '2026-10-15',
    },
    contact: {
      name: 'Sue Wang',
      email: 'sue-nbo@eversaillogistics.com',
      role: 'Manager ECSA',
      office: 'Eversail Logistics Inc. Ningbo',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA VIGENTE',
    notes: 'Asunto de correo: "NUEVO TARIFARIO FOB NINGBO A BUE Y ROSARIO // 1*20 + 1*40".',
  },
  {
    id: 'ES-W41-NGB-ONE',
    originCode: 'CNNGB',
    originName: 'Ningbo',
    carrier: 'ONE',
    carrierCode: 'ONE',
    carrierColor: '#E4007F',
    service: 'SX1 / SX2 Express',
    vessel: 'YM MODERATION / 084E',
    vesselRef: 'VESSEL-004',
    rates: {
      ARBUE: { '20GP': 5100, '40HC': 5650 },
      ARROS: { '20GP': 5200, '40HC': 5750 },
    },
    arbitraryTPR: 100,
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 40/41 (Válido 01 al 15 Octubre 2026)',
      validFrom: '2026-10-01',
      validTo: '2026-10-15',
    },
    contact: {
      name: 'Sue Wang',
      email: 'sue-nbo@eversaillogistics.com',
      role: 'Manager ECSA',
      office: 'Eversail Logistics Inc. Ningbo',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA VIGENTE',
    notes: 'Servicio express SX1 con excelente tiempo de tránsito (37 días a BUE).',
  },

  // --- SHENZHEN (CNSZX) ---
  {
    id: 'ES-W41-SZX-MSK',
    originCode: 'CNSZX',
    originName: 'Shenzhen',
    carrier: 'Maersk Line',
    carrierCode: 'MSK',
    carrierColor: '#00243d',
    service: 'AE2 / NEOSAMBA',
    vessel: 'MARGRETHE MAERSK / 2640W',
    vesselRef: 'VESSEL-002',
    rates: {
      ARBUE: { '20GP': 5350, '40HC': 5950 },
      ARROS: { '20GP': 5450, '40HC': 6050 },
    },
    arbitraryTPR: 100,
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 41 (Oct 05 to Oct 11)',
      validFrom: '2026-10-05',
      validTo: '2026-10-15',
    },
    contact: {
      name: 'Kamil Liu',
      email: 'kamil-szn@eversaillogistics.com',
      role: 'Manager ECSA / PA',
      office: 'Eversail Logistics Inc. Shenzhen',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA VIGENTE',
    notes: '20 dry implement HWS/OWS usd 200 for VGM weight over 20tons.',
  },
  {
    id: 'ES-W41-SZX-PIL',
    originCode: 'CNSZX',
    originName: 'Shenzhen',
    carrier: 'PIL Spot',
    carrierCode: 'PIL',
    carrierColor: '#059669',
    service: 'SSA South America Service',
    vessel: 'PIL LOTUS / 0122S',
    rates: {
      ARBUE: { '20GP': 5400, '40HC': 5500 },
      ARROS: null, // Solo BUE - No opera feeder a Rosario
    },
    arbitraryTPR: null,
    freeDays: 17, // 17 días libres en destino
    buyFreeTimeUSD: 0,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 41 (Oct 07 to Oct 14)',
      validFrom: '2026-10-07',
      validTo: '2026-10-14',
    },
    contact: {
      name: 'Kamil Liu',
      email: 'kamil-szn@eversaillogistics.com',
      role: 'Manager ECSA / PA',
      office: 'Eversail Logistics Inc. Shenzhen',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA SPOT ECONOMICA',
    notes: 'PIL SPOT USD5400/20GP USD5500/HC from 7/Oct to 14/Oct. 17 days free time. Solo arribo a Buenos Aires.',
  },

  // --- QINGDAO (CNTAO) ---
  {
    id: 'ES-W41-TAO-MSK',
    originCode: 'CNTAO',
    originName: 'Qingdao',
    carrier: 'Maersk Line',
    carrierCode: 'MSK',
    carrierColor: '#00243d',
    service: 'AE2 / NEOSAMBA',
    vessel: 'MANILA MAERSK / 638W',
    vesselRef: 'VESSEL-001',
    rates: {
      ARBUE: { '20GP': 5250, '40HC': 5800 },
      ARROS: { '20GP': 5450, '40HC': 6000 },
    },
    arbitraryTPR: 200, // Delta +USD 200 a TPR
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 41 (Valid Sep 05 to Oct 15)',
      validFrom: '2026-09-05',
      validTo: '2026-10-15',
    },
    contact: {
      name: 'Mia Zhao',
      email: 'mia-qdo@eversaillogistics.com',
      role: 'Operation Dept. (Bon Voyage Logistics / Eversail)',
      office: 'Eversail Logistics Inc. Qingdao',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA VIGENTE',
    notes: 'Arbitrario fluvial delta +USD 200 para TPR. HWS USD 200 si VGM supera 20 toneladas.',
  },
  {
    id: 'ES-W41-TAO-HAPAG',
    originCode: 'CNTAO',
    originName: 'Qingdao',
    carrier: 'Hapag-Lloyd',
    carrierCode: 'HAPAG',
    carrierColor: '#ea580c',
    service: 'AL5 / Great Lion Express',
    vessel: 'King of the Seas / 2103N',
    vesselRef: 'VESSEL-005',
    rates: {
      ARBUE: { '20GP': 5300, '40HC': 5850 },
      ARROS: { '20GP': 5500, '40HC': 6050 },
    },
    arbitraryTPR: 200,
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 40/41 (01 al 15 Octubre 2026)',
      validFrom: '2026-10-01',
      validTo: '2026-10-15',
    },
    contact: {
      name: 'Mia Zhao',
      email: 'mia-qdo@eversaillogistics.com',
      role: 'Operation Dept.',
      office: 'Eversail Logistics Inc. Qingdao',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA VIGENTE',
    notes: 'Excelente espacio asignado para contenedores 40HC en Great Lion Express.',
  },

  // --- TIANJIN / XINGANG (CNTXG) ---
  {
    id: 'ES-W41-TXG-MSK',
    originCode: 'CNTXG',
    originName: 'Tianjin / Xingang',
    carrier: 'Maersk Line',
    carrierCode: 'MSK',
    carrierColor: '#00243d',
    service: 'AE2 / NEOSAMBA',
    vessel: 'MARGRETHE MAERSK / 2640W',
    vesselRef: 'VESSEL-002',
    rates: {
      ARBUE: { '20GP': 5400, '40HC': 6000 },
      ARROS: { '20GP': 5600, '40HC': 6200 },
    },
    arbitraryTPR: 200, // Delta +USD 200 a TPR
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 41 (PCD Oct 05 to Oct 11)',
      validFrom: '2026-10-05',
      validTo: '2026-10-15',
    },
    contact: {
      name: 'Mia Sun',
      email: 'mia-tjn@eversaillogistics.com',
      role: 'Operation Dept. (Bon Voyage Logistics / Eversail)',
      office: 'Eversail Logistics Inc. Tianjin',
    },
    status: 'CONFIRMED',
    statusBadge: '● TARIFA VIGENTE',
    notes: 'Puerto siderúrgico habitual de cargas para Ternium Siderar y Tubiflex.',
  },
  {
    id: 'ES-W41-TXG-TIME',
    originCode: 'CNTXG',
    originName: 'Tianjin / Xingang',
    carrier: 'Time Freight (Broker)',
    carrierCode: 'TIME',
    carrierColor: '#7c3aed',
    service: 'Direct SX Service / DG Specialized',
    vessel: 'YM MODERATION / 084E',
    vesselRef: 'VESSEL-004',
    rates: {
      ARBUE: { '20GP': 5500, '40HC': 6100 },
      ARROS: { '20GP': 5700, '40HC': 6300 },
    },
    arbitraryTPR: 200,
    freeDays: 21,
    buyFreeTimeUSD: 100,
    vesselProtectionUSD: 29,
    validity: {
      pcd: 'Semana 41 (Valid before Oct 14th)',
      validFrom: '2026-10-01',
      validTo: '2026-10-14',
    },
    contact: {
      name: 'Scott He',
      email: 'scotthe@timefreight.cn',
      role: 'Sales & DG Specialist',
      office: 'Time Freight Ltd.',
    },
    status: 'CONFIRMED',
    statusBadge: '● ESPECIALISTA DG / QUIMICOS',
    notes: 'Tarifa broker especializada en mercancías peligrosas (IMO / DG) y químicos.',
  },
];

// ============================================================================
// 6. OPCIONES DE EQUIPO (EQUIPMENT_OPTIONS)
// ============================================================================

export const EQUIPMENT_OPTIONS = [
  {
    id: '40HC',
    code: '40HC',
    name: "40' High Cube",
    shortName: "40'HC",
    label: "1x 40' High Cube (40'HC)",
    cbm: 76.2,
    maxPayloadKg: 28600,
    defaultMarginUSD: 250,
    description: 'Mayor capacidad cúbica. Preferido para manufacturas, autopartes y bazar.',
  },
  {
    id: '20GP',
    code: '20GP',
    name: "20' General Purpose",
    shortName: "20'GP",
    label: "1x 20' General Purpose (20'GP)",
    cbm: 33.2,
    maxPayloadKg: 28000,
    defaultMarginUSD: 200,
    description: 'Carga pesada / densa. Sujeto a recargo HWS si supera 20.000 kg.',
  },
];

// ============================================================================
// 7. HELPER: FORMATO NUMÉRICO Y MONETARIO
// ============================================================================

/**
 * Formatea un número en formato monetario USD
 * @param {number} amount - Monto numérico
 * @param {boolean} withSymbol - Si incluye prefijo "USD " o "$"
 * @returns {string} Texto formateado e.g. "6.079,00" o "USD 6.079,00"
 */
export function formatUSD(amount, withSymbol = false) {
  if (amount === null || amount === undefined || isNaN(amount)) return '-';
  const num = Number(amount);
  const parts = num.toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decPart = parts[1];
  const formatted = `${intPart},${decPart}`;
  return withSymbol ? `USD ${formatted}` : formatted;
}

// ============================================================================
// 8. HELPER: calculateQuote(params) — LIQUIDACIÓN DE FLETE Y RECARGOS
// ============================================================================

/**
 * Calcula la cotización completa de flete y gastos locales en destino
 * @param {Object} params
 * @param {string} params.originCode - Código UN/LOCODE de origen (e.g. 'CNSHA', 'CNNGB')
 * @param {string} params.destinationCode - Código UN/LOCODE de destino (e.g. 'ARROS', 'ARBUE')
 * @param {string} [params.equipment='40HC'] - Tipo de equipo: '40HC' | '20GP'
 * @param {string} [params.carrier] - Naviera específica o null para mejor opción
 * @param {string} [params.carrierCode] - Código de naviera ('MSK', 'MSC', 'ONE', 'HAPAG', 'PIL')
 * @param {number} [params.cargoWeightKg=18000] - Peso bruto en kilogramos
 * @param {number} [params.marginUSD] - Margen Almar personalizado (default: 250 para 40HC, 200 para 20GP)
 * @param {boolean} [params.includeRoadFreight=false] - Flete carretero expreso BUE -> Rosario (+USD 700)
 * @param {boolean} [params.includeInsurance=false] - Seguro de carga internacional
 * @param {number} [params.cifValueUSD=0] - Valor CIF declarado para cálculo de seguro
 * @param {string} [params.clientName='Cliente Corporativo Almar'] - Nombre del cliente
 * @param {string} [params.customQuoteNumber] - Número de cotización personalizado
 * @returns {Object} Desglose económico completo y estructurado
 */
export function calculateQuote(params = {}) {
  const {
    originCode = 'CNNGB',
    destinationCode = 'ARROS',
    equipment = '40HC',
    carrier,
    carrierCode,
    cargoWeightKg = 18000,
    marginUSD = null,
    includeRoadFreight = false,
    includeInsurance = false,
    cifValueUSD = 0,
    clientName = '',
    customQuoteNumber,
  } = params;

  // 1. Normalización de puertos y destinos
  const normDest = (destinationCode === 'ROS' || destinationCode === 'ARROS') ? 'ARROS' : destinationCode;
  const isTPR = normDest === 'ARROS';
  const isBUE = normDest === 'ARBUE' || normDest === 'BUE';

  const destPort = PORT_OPTIONS.find(p => p.code === normDest) || {
    code: normDest,
    name: normDest,
    fullName: normDest,
    transitTimeText: isTPR ? '45-55 días (feeder fluvial)' : '35-40 días (directo)',
    arbitraryFeederUSD: isTPR ? 100 : 0,
    tollHidroviaUSD: isTPR ? 175 : 0,
  };

  const originPort = ORIGIN_PORTS.find(p => p.code === originCode) || {
    code: originCode,
    name: originCode,
    fullName: originCode,
    arbitraryTPR: 100,
  };

  // 2. Búsqueda de tarifa Eversail correspondiente
  let matchedRate = EVERSAIL_RATES_W40_41.find(r => {
    const matchOrigin = r.originCode === originCode;
    if (!matchOrigin) return false;
    if (carrierCode) return r.carrierCode === carrierCode;
    if (carrier) return r.carrier.toLowerCase().includes(carrier.toLowerCase());
    return true;
  });

  // Si no se encuentra tarifa exacta (ej. PIL no va a ROS), tomar la primera disponible
  if (!matchedRate) {
    matchedRate = EVERSAIL_RATES_W40_41.find(r => r.originCode === originCode && r.rates[normDest]) ||
      EVERSAIL_RATES_W40_41.find(r => r.originCode === originCode) ||
      EVERSAIL_RATES_W40_41[0];
  }

  // 3. Extracción de costo base de compra naviera
  let baseFreightUSD = 0;
  let arbitraryFeederUSD = 0;
  const isPilSpecial = matchedRate.carrierCode === 'PIL';

  if (isPilSpecial && isTPR) {
    // PIL no opera en Rosario TPR
    throw new Error('PIL Spot no opera servicio feeder a Terminal Puerto Rosario (solo Buenos Aires).');
  }

  if (matchedRate.rates && matchedRate.rates[normDest] && matchedRate.rates[normDest][equipment]) {
    baseFreightUSD = matchedRate.rates[normDest][equipment];
  } else if (matchedRate.rates && matchedRate.rates.ARBUE && matchedRate.rates.ARBUE[equipment]) {
    // Si la tarifa está definida solo para BUE y el destino es TPR, sumar arbitrario
    const bueRate = matchedRate.rates.ARBUE[equipment];
    arbitraryFeederUSD = matchedRate.arbitraryTPR || (['CNTAO', 'CNTXG'].includes(originCode) ? 200 : 100);
    baseFreightUSD = isTPR ? bueRate + arbitraryFeederUSD : bueRate;
  } else {
    // Fallback defensivo en base a promedios W41
    baseFreightUSD = equipment === '40HC' ? 5600 : 5040;
    if (isTPR) baseFreightUSD += 100;
  }

  // Diferencial explícito de barcaza TPR si se calcula contra BUE
  if (isTPR && arbitraryFeederUSD === 0) {
    arbitraryFeederUSD = matchedRate.arbitraryTPR || (['CNTAO', 'CNTXG'].includes(originCode) ? 200 : 100);
  }

  // 4. Recargos obligatorios de flete marítimo
  const buyFreeTimeUSD = matchedRate.buyFreeTimeUSD !== undefined ? matchedRate.buyFreeTimeUSD : BUY_FREE_TIME_USD;
  const vesselProtectionUSD = matchedRate.vesselProtectionUSD !== undefined ? matchedRate.vesselProtectionUSD : VESSEL_PROTECTION_USD;

  // Recargo de sobrepeso HWS (Heavy Weight Surcharge): +USD 200 si 20'GP y peso > 20.000 kg
  const appliesHWS = equipment === '20GP' && Number(cargoWeightKg) > HWS_WEIGHT_THRESHOLD_KG;
  const hwsSurchargeUSD = appliesHWS ? HWS_SURCHARGE_USD : 0;

  // 5. Margen comercial Almar Rosario
  const resolvedMarginUSD = (marginUSD !== null && marginUSD !== undefined && !isNaN(marginUSD))
    ? Number(marginUSD)
    : (equipment === '40HC' ? DEFAULT_ALMAR_MARGIN['40HC'] : DEFAULT_ALMAR_MARGIN['20GP']);

  // Costo total de compra (sin margen comercial)
  const oceanFreightCostUSD = Number((baseFreightUSD + buyFreeTimeUSD + vesselProtectionUSD + hwsSurchargeUSD).toFixed(2));

  // Flete internacional marítimo de venta (Costo compra + margen comercial)
  const oceanFreightTotalUSD = Number((oceanFreightCostUSD + resolvedMarginUSD).toFixed(2));

  // 6. Gastos locales en Argentina (Destino)
  const agencyFeeUSD = LOCAL_AGENCY_FEE_USD; // $800 Exento
  const docFeeUSD = LOCAL_DOC_FEE_USD; // $75
  const docFeeVatUSD = Number((docFeeUSD * 0.21).toFixed(2)); // $15.75
  const peajeHidroviaUSD = isTPR ? PEAJE_HIDROVIA_USD : 0; // $175 solo si escala TPR

  // Flete carretero opcional BUE -> Rosario (solo disponible si arribo es BUE)
  const roadFreightUSD = (isBUE && includeRoadFreight) ? OPTIONAL_ROAD_FREIGHT_BUE_ROS_USD : 0;

  // Seguro de carga internacional opcional (0.55% CIF con mín $60 + IVA 21%)
  let insuranceUSD = 0;
  let insuranceVatUSD = 0;
  if (includeInsurance) {
    const calculatedIns = Math.max(OPTIONAL_INSURANCE_MIN_USD, Number(((cifValueUSD || 0) * OPTIONAL_INSURANCE_RATE).toFixed(2)));
    insuranceUSD = Number(calculatedIns.toFixed(2));
    insuranceVatUSD = Number((insuranceUSD * 0.21).toFixed(2));
  }

  // Agrupación de gastos en destino por condición impositiva
  const destinationChargesExemptUSD = Number((agencyFeeUSD + peajeHidroviaUSD).toFixed(2));
  const destinationChargesTaxableUSD = Number((docFeeUSD + roadFreightUSD + insuranceUSD).toFixed(2));
  const destinationChargesVatUSD = Number((docFeeVatUSD + insuranceVatUSD).toFixed(2));
  const destinationChargesTotalUSD = Number((destinationChargesExemptUSD + destinationChargesTaxableUSD + destinationChargesVatUSD).toFixed(2));

  // 7. Gran Total Presupuestado (Landed Total)
  const grandTotalUSD = Number((oceanFreightTotalUSD + destinationChargesTotalUSD).toFixed(2));

  // 8. Buque e Itinerario oficial asociado
  const vesselInfo = DCSA_VESSELS.find(v => v.fullName === matchedRate.vessel) ||
    DCSA_VESSELS.find(v => v.carrierCode === matchedRate.carrierCode) ||
    DCSA_VESSELS[0];

  const transitTimeText = isTPR ? destPort.transitTimeText : (destPort.transitTimeText || '35-40 días (directo)');
  const freeDays = matchedRate.freeDays || 21;
  const quoteNumber = customQuoteNumber || `COT-2026-${Math.floor(1400 + Math.random() * 200)}`;

  return {
    quoteNumber,
    clientName,
    originCode,
    originName: originPort.name,
    originFullName: originPort.fullName,
    destinationCode: normDest,
    destinationName: destPort.name,
    destinationFullName: destPort.fullName,
    isTPR,
    isBUE,
    equipment,
    equipmentName: equipment === '40HC' ? "40' High Cube (40'HC)" : "20' General Purpose (20'GP)",
    carrier: matchedRate.carrier,
    carrierCode: matchedRate.carrierCode,
    carrierColor: matchedRate.carrierColor,
    service: matchedRate.service,
    vessel: matchedRate.vessel || vesselInfo.fullName,
    vesselName: vesselInfo.vesselName,
    voyage: vesselInfo.voyage,
    etd: vesselInfo.etd,
    eta: isTPR ? vesselInfo.etaTPR : vesselInfo.etaBUE,
    cutOff: vesselInfo.cutOff,
    transitTimeText,
    freeDays,
    cargoWeightKg,
    appliesHWS,
    validity: matchedRate.validity,
    validityToText: matchedRate.validity?.validTo || '15/Oct/2026',
    contact: matchedRate.contact,
    statusBadge: matchedRate.statusBadge,

    // Desglose de Tarifas y Recargos (USD)
    pricing: {
      baseFreightUSD,
      buyFreeTimeUSD,
      vesselProtectionUSD,
      arbitraryFeederUSD,
      hwsSurchargeUSD,
      marginUSD: resolvedMarginUSD,
      oceanFreightCostUSD,
      oceanFreightTotalUSD, // Flete Venta al cliente
      agencyFeeUSD,
      docFeeUSD,
      docFeeVatUSD,
      peajeHidroviaUSD,
      roadFreightUSD,
      insuranceUSD,
      insuranceVatUSD,
      destinationChargesExemptUSD,
      destinationChargesTaxableUSD,
      destinationChargesVatUSD,
      destinationChargesTotalUSD,
      grandTotalUSD,
    },

    // Formateo de Texto Precalculado para Vista Rápida
    formatted: {
      baseFreight: formatUSD(baseFreightUSD, true),
      buyFreeTime: formatUSD(buyFreeTimeUSD, true),
      vesselProtection: formatUSD(vesselProtectionUSD, true),
      arbitraryFeeder: formatUSD(arbitraryFeederUSD, true),
      hwsSurcharge: formatUSD(hwsSurchargeUSD, true),
      margin: formatUSD(resolvedMarginUSD, true),
      oceanFreightCost: formatUSD(oceanFreightCostUSD, true),
      oceanFreightTotal: formatUSD(oceanFreightTotalUSD, true),
      agencyFee: formatUSD(agencyFeeUSD, true),
      docFee: formatUSD(docFeeUSD, true),
      docFeeVat: formatUSD(docFeeVatUSD, true),
      peajeHidrovia: formatUSD(peajeHidroviaUSD, true),
      roadFreight: formatUSD(roadFreightUSD, true),
      insurance: formatUSD(insuranceUSD, true),
      insuranceVat: formatUSD(insuranceVatUSD, true),
      destinationChargesTotal: formatUSD(destinationChargesTotalUSD, true),
      grandTotal: formatUSD(grandTotalUSD, true),
    },
  };
}

// ============================================================================
// 9. HELPER: formatWhatsAppMessage(quote) — SINTAXIS FORMAL COMERCIAL
// ============================================================================

/**
 * Genera el texto formal oficial que el área comercial envía por WhatsApp o correo a clientes
 * @param {Object} quote - Objeto retornado por calculateQuote
 * @returns {string} Mensaje redactado con cortesía empresarial y desglose
 */
export function formatWhatsAppMessage(quote) {
  if (!quote) return '';

  const q = quote.pricing ? quote : calculateQuote(quote);
  const p = q.pricing;

  const freeTimeText = `${q.freeDays} días libres en destino`;
  const hidrovíaLine = q.isTPR ? `\n   - Peaje Hidrovía Paraná: USD ${formatUSD(p.peajeHidroviaUSD)}` : '';
  const roadFreightLine = p.roadFreightUSD > 0 ? `\n   - Flete Carretero Puerto BUE ➔ Planta Rosario: USD ${formatUSD(p.roadFreightUSD)}` : '';
  const insuranceLine = p.insuranceUSD > 0 ? `\n   - Seguro Internacional de Carga: USD ${formatUSD(p.insuranceUSD)} + IVA` : '';
  const hwsLine = p.hwsSurchargeUSD > 0 ? `\n   - Recargo Heavy Weight (HWS >20tn): USD ${formatUSD(p.hwsSurchargeUSD)}` : '';

  const greeting = q.clientName && q.clientName.trim()
    ? `Estimados ${q.clientName.trim()},`
    : `Estimado cliente,`;

  return `🚢 ALMAR ROSARIO S.R.L. // PROPUESTA COMERCIAL
Cotización N° ${q.quoteNumber} | Validez: ${q.validityToText}

${greeting}
Detallamos la cotización de flete marítimo para su embarque:

• Origen: ${q.originName} (${q.originCode})
• Destino: ${q.destinationName} (${q.destinationCode})
• Equipo: 1x ${q.equipmentName}
• Naviera: ${q.carrier} | Servicio: ${q.service}
• Buque / Viaje: ${q.vessel}
• Tránsito Estimado: ${q.transitTimeText}
• Días Libres en Destino: ${freeTimeText}

DESGLOSE ECONÓMICO (USD):
1. Flete Internacional Marítimo: USD ${formatUSD(p.oceanFreightTotalUSD)} (incluye VP USD 29 y ${q.freeDays} días libres)${hwsLine}
2. Gastos en Destino ${q.destinationName}:
   - Gastos de Agencia: USD ${formatUSD(p.agencyFeeUSD)} (Exento)
   - Documentación de Embarque: USD ${formatUSD(p.docFeeUSD)} + IVA (21% = USD ${formatUSD(p.docFeeVatUSD)})${hidrovíaLine}${roadFreightLine}${insuranceLine}

Total Estimado: USD ${formatUSD(p.grandTotalUSD)} + IVA local
Condiciones: Flete pagadero al tipo de cambio BNA billete vendedor.
Saludos cordiales,
Departamento Comercial & Pricing | Almar Rosario S.R.L.`;
}

// ============================================================================
// 10. HELPER: formatKipintochTSV(quote) — CADENA TSV PARA KIPINTOCH ERP (Ctrl+V)
// ============================================================================

/**
 * Genera la fila estructurada en TSV (Tab-Separated Values) y los campos individuales
 * para pegar con Ctrl+V en el ERP Kipintoch sin costo de API
 * @param {Object} quote - Objeto retornado por calculateQuote
 * @returns {Object} Objeto con tsvRow, tsvHeader, tsvFull y mapeo de campos individuales
 */
export function formatKipintochTSV(quote) {
  if (!quote) return {};

  const q = quote.pricing ? quote : calculateQuote(quote);
  const p = q.pricing;
  const today = new Date().toISOString().split('T')[0];

  const tsvHeader = [
    'Cotizacion',
    'Fecha',
    'Cliente',
    'Origen_UNLOCODE',
    'Destino_UNLOCODE',
    'Equipo',
    'Naviera',
    'Buque_Viaje',
    'Costo_Compra_USD',
    'Margen_Almar_USD',
    'Flete_Venta_USD',
    'Gastos_Locales_USD',
    'Total_Presupuesto_USD',
    'Dias_Libres',
    'Validez_PCD',
    'Operador_Comercial',
  ].join('\t');

  const rowValues = [
    q.quoteNumber,
    today,
    q.clientName?.trim() || 'A designar',
    q.originCode,
    q.destinationCode,
    q.equipment,
    q.carrier,
    q.vessel,
    p.oceanFreightCostUSD.toFixed(2),
    p.marginUSD.toFixed(2),
    p.oceanFreightTotalUSD.toFixed(2),
    p.destinationChargesTotalUSD.toFixed(2),
    p.grandTotalUSD.toFixed(2),
    `${q.freeDays} días`,
    q.validityToText,
    'Dpto. Comercial',
  ];

  const tsvRow = rowValues.join('\t');
  const tsvFull = `${tsvHeader}\n${tsvRow}`;

  return {
    tsvHeader,
    tsvRow,
    tsvFull,
    fields: {
      cotizacion: q.quoteNumber,
      fecha: today,
      cliente: q.clientName?.trim() || 'A designar',
      origen: q.originCode,
      destino: q.destinationCode,
      equipo: q.equipment,
      naviera: q.carrier,
      buque: q.vessel,
      costoCompraUSD: p.oceanFreightCostUSD.toFixed(2),
      margenAlmarUSD: p.marginUSD.toFixed(2),
      fleteVentaUSD: p.oceanFreightTotalUSD.toFixed(2),
      gastosLocalesUSD: p.destinationChargesTotalUSD.toFixed(2),
      totalUSD: p.grandTotalUSD.toFixed(2),
      diasLibres: `${q.freeDays} días`,
      validez: q.validityToText,
      operador: 'Dpto. Comercial',
    },
  };
}

// ============================================================================
// 11. HELPER: generateSpotTicket(params) — TICKET SPOT-2026-XXXX
// ============================================================================

/**
 * Genera un ticket operativo para cargas spot (Europa, USA, IMO, Flat Rack)
 * asignado a la Mesa Operativa de Pricing con SLA de 45 minutos
 * @param {Object} params
 * @returns {Object} Ficha de ticket estructurada
 */
export function generateSpotTicket(params = {}) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketId = params.ticketId || `SPOT-2026-${randomNum}`;
  const now = new Date();
  const slaDeadline = new Date(now.getTime() + 45 * 60 * 1000); // SLA de 45 minutos

  return {
    ticketId,
    createdAt: now.toISOString(),
    createdAtFormatted: now.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour12: false,
    }),
    slaMinutes: 45,
    slaDeadline: slaDeadline.toISOString(),
    slaDeadlineFormatted: slaDeadline.toLocaleTimeString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    assignedTo: 'pricing@almarrosario.com',
    assignedName: 'Mesa Operativa de Pricing',
    sender: 'comercial@almarrosario.com',
    senderName: 'Departamento Comercial',
    status: 'ASIGNADO_MESA_OPERATIVA',
    statusBadge: '🟡 EN REVISIÓN SPOT',
    priority: params.priority || 'HIGH',
    client: params.client || 'A designar',
    origin: params.origin || 'DEHAM - Hamburgo, Alemania',
    destination: params.destination || 'ARROS - Rosario TPR',
    equipment: params.equipment || "40'HC",
    cargoType: params.cargoType || 'Carga General / On-Demand',
    commodity: params.commodity || 'Mercadería general no peligrosa',
    weightKg: params.weightKg || 18000,
    specialRequirements: params.specialRequirements || 'Cotización spot con navieras directas / consolidadores LCL (MSL/SACO/Craft)',
    targetRateUSD: params.targetRateUSD || null,
    slaMessage: 'Mesa Operativa de Pricing: tiempo de respuesta estimado en menos de 45 minutos hábiles.',
    internalNotes: params.internalNotes || 'Solicitud generada desde el cotizador web de Almar.',
  };
}

// ============================================================================
// 12. HELPER: getDemoRates(params) — LISTADO COMPLETO ORDENADO PARA LA DEMO
// ============================================================================

/**
 * Retorna todas las alternativas disponibles para un origen, destino y equipo dados
 * @param {Object} params
 * @returns {Array<Object>} Lista de cotizaciones completas listas para renderizar en la UI
 */
export function getDemoRates(params = {}) {
  const {
    originCode = 'CNNGB',
    destinationCode = 'ARROS',
    equipment = '40HC',
    cargoWeightKg = 18000,
    marginUSD = null,
    includeRoadFreight = false,
    includeInsurance = false,
    cifValueUSD = 0,
    clientName = '',
  } = params;

  const matchingRates = EVERSAIL_RATES_W40_41.filter(r => r.originCode === originCode);

  const quotes = [];
  for (const rate of matchingRates) {
    try {
      const q = calculateQuote({
        originCode,
        destinationCode,
        equipment,
        carrier: rate.carrier,
        carrierCode: rate.carrierCode,
        cargoWeightKg,
        marginUSD,
        includeRoadFreight,
        includeInsurance,
        cifValueUSD,
        clientName,
      });
      quotes.push(q);
    } catch (err) {
      // Si un operador no opera el puerto (ej. PIL no va a ROS), omitir limpiamente
      continue;
    }
  }

  // Ordenar por precio de venta de menor a mayor
  quotes.sort((a, b) => a.pricing.oceanFreightTotalUSD - b.pricing.oceanFreightTotalUSD);
  return quotes;
}

// ============================================================================
// EXPORT DEFAULT INTEGRAL
// ============================================================================

const demoData = {
  SURCHARGES,
  BUY_FREE_TIME_USD,
  VESSEL_PROTECTION_USD,
  PEAJE_HIDROVIA_USD,
  DEFAULT_ALMAR_MARGIN,
  DEFAULT_ALMAR_MARGIN_40HC_USD,
  DEFAULT_ALMAR_MARGIN_20GP_USD,
  LOCAL_AGENCY_FEE_USD,
  LOCAL_DOC_FEE_USD,
  LOCAL_DOC_FEE_VAT_USD,
  OPTIONAL_INSURANCE_MIN_USD,
  OPTIONAL_INSURANCE_RATE,
  OPTIONAL_INSURANCE_VAT_USD,
  OPTIONAL_ROAD_FREIGHT_BUE_ROS_USD,
  HWS_SURCHARGE_USD,
  HWS_WEIGHT_THRESHOLD_KG,
  ORIGIN_PORTS,
  PORT_OPTIONS,
  DCSA_VESSELS,
  EVERSAIL_RATES_W40_41,
  EQUIPMENT_OPTIONS,
  formatUSD,
  calculateQuote,
  formatWhatsAppMessage,
  formatKipintochTSV,
  generateSpotTicket,
  getDemoRates,
};

export default demoData;
