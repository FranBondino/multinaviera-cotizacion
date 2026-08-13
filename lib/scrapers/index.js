import { scrapeMaersk } from './maersk';
import { scrapeCma } from './cma';
import { scrapeHapag } from './hapag';
import { scrapeMsc } from './msc';

export async function fetchAllCarrierRates(pol, pod, equipment) {
  const results = await Promise.allSettled([
    scrapeMaersk(pol, pod, equipment),
    scrapeCma(pol, pod, equipment),
    scrapeHapag(pol, pod, equipment),
    scrapeMsc(pol, pod, equipment)
  ]);

  return results.map((res, index) => {
    if (res.status === 'fulfilled') {
      return res.value;
    } else {
      const carriers = ['Maersk', 'CMA CGM', 'Hapag-Lloyd', 'MSC'];
      return {
        carrier: carriers[index],
        error: true,
        message: 'No se pudo obtener la tarifa en tiempo real'
      };
    }
  });
}
