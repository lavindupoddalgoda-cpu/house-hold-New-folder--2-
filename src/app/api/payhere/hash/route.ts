import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, currency } = await request.json();
    if (!orderId || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID || 'sandbox-merchant';
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'sandbox-secret';

    const secretHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const hashInput = `${merchantId}${orderId}${parseFloat(String(amount)).toFixed(2)}${currency}${secretHash}`;
    const hash = crypto.createHash('md5').update(hashInput).digest('hex').toUpperCase();

    return NextResponse.json({ hash, merchantId });
  } catch (err) {
    console.error('PayHere hash error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
