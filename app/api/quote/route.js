import { NextResponse } from 'next/server';
import { fetchAllCarrierRates } from '../../../lib/scrapers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pol = searchParams.get('pol') || 'CNSHA';
  const pod = searchParams.get('pod') || 'BUE';
  const equipment = searchParams.get('equipment') || "40'HC";

  try {
    const rates = await fetchAllCarrierRates(pol, pod, equipment);
    return NextResponse.json({
      success: true,
      pol,
      pod,
      equipment,
      timestamp: new Date().toISOString(),
      rates
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
