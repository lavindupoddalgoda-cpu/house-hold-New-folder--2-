import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const fields = Object.fromEntries(data) as Record<string, string>;
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = fields;

    // Verify PayHere signature
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'sandbox-secret';
    const secretHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const localSig = crypto.createHash('md5')
      .update(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${secretHash}`)
      .digest('hex').toUpperCase();

    if (localSig !== md5sig) {
      console.error('PayHere signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const statusMap: Record<string, string> = { '2': 'paid', '-1': 'cancelled', '-2': 'failed', '-3': 'chargebacked' };
    const newStatus = statusMap[status_code] || 'unknown';

    // In production, update Firestore order here
    console.log(`Order ${order_id} status updated to: ${newStatus}`);

    return new NextResponse('OK', { status: 200 });
  } catch (err) {
    console.error('PayHere notify error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
