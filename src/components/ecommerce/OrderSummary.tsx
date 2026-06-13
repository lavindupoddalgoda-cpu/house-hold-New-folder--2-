'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Truck, X, Check } from 'lucide-react';
import { cn, formatCurrencyShort } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { STORE } from '@/types';

interface OrderSummaryProps {
  deliveryType?: 'standard' | 'express';
  className?: string;
}

const MOCK_COUPONS: Record<string, { type: 'percentage' | 'fixed'; value: number; minOrderValue: number }> = {
  WELCOME10: { type: 'percentage', value: 10, minOrderValue: 2000 },
  SAVE500: { type: 'fixed', value: 500, minOrderValue: 3000 },
  HOMENEST15: { type: 'percentage', value: 15, minOrderValue: 5000 },
};

export default function OrderSummary({ deliveryType = 'standard', className }: OrderSummaryProps) {
  const { cart, appliedCoupon, applyCoupon, removeCoupon, getCartTotal } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const subtotal = getCartTotal();
  const shippingFee = subtotal >= STORE.freeShippingThreshold
    ? 0
    : deliveryType === 'express'
      ? STORE.expressShippingFee
      : STORE.standardShippingFee;

  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round(subtotal * (appliedCoupon.value / 100))
      : appliedCoupon.value
    : 0;

  const total = Math.max(0, subtotal + shippingFee - discount);
  const shippingProgress = Math.min(100, (subtotal / STORE.freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, STORE.freeShippingThreshold - subtotal);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    setCouponSuccess(false);

    if (!code) {
      setCouponError('Enter a coupon code');
      return;
    }

    const coupon = MOCK_COUPONS[code];
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (subtotal < coupon.minOrderValue) {
      setCouponError(`Minimum order ${formatCurrencyShort(coupon.minOrderValue)} required`);
      return;
    }

    applyCoupon({ code, type: coupon.type, value: coupon.value });
    setCouponSuccess(true);
    setCouponInput('');
    setTimeout(() => setCouponSuccess(false), 2000);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
    setCouponError('');
    setCouponSuccess(false);
  };

  return (
    <div className={cn('space-y-5', className)}>
      {/* Free Shipping Threshold */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-emerald-600" />
          <span className="font-sans text-xs font-medium text-emerald-700">
            {remainingForFreeShipping > 0
              ? `Add ${formatCurrencyShort(remainingForFreeShipping)} more for free shipping!`
              : 'You qualify for free shipping!'}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-200">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${shippingProgress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Coupon Code */}
      <div className="space-y-2">
        <label className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
          Coupon Code
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-sans text-sm font-semibold text-emerald-700">
                {appliedCoupon.code}
              </span>
              <span className="font-sans text-xs text-emerald-600">
                {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% off` : `${formatCurrencyShort(appliedCoupon.value)} off`}
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="flex h-6 w-6 items-center justify-center rounded-full text-navy/30 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="Remove coupon"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError('');
                }}
                placeholder="Enter code"
                className="h-9 rounded-xl border-navy/10 font-sans text-sm uppercase"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <AnimatePresence>
                {couponSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              onClick={handleApplyCoupon}
              variant="outline"
              size="sm"
              className="h-9 rounded-xl border-emerald-200 font-sans text-emerald-600 hover:bg-emerald-50"
            >
              Apply
            </Button>
          </div>
        )}
        {couponError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-[11px] text-red-500"
          >
            {couponError}
          </motion.p>
        )}
      </div>

      <Separator />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-navy/50">
            Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})
          </span>
          <span className="font-sans text-sm font-medium text-navy">
            {formatCurrencyShort(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-navy/50">
            Shipping ({deliveryType === 'express' ? 'Express' : 'Standard'})
          </span>
          <span
            className={cn(
              'font-sans text-sm font-medium',
              shippingFee === 0 ? 'text-emerald-600' : 'text-navy'
            )}
          >
            {shippingFee === 0 ? 'FREE' : formatCurrencyShort(shippingFee)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-emerald-600">Discount</span>
            <span className="font-sans text-sm font-medium text-emerald-600">
              -{formatCurrencyShort(discount)}
            </span>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-sans text-base font-bold text-navy">Total</span>
          <span className="font-sans text-xl font-bold text-emerald-600">
            {formatCurrencyShort(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
