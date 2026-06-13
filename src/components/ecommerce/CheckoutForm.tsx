'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  Banknote,
  Building2,
  ChevronRight,
  ChevronLeft,
  Check,
  ShoppingBag,
  ArrowRight,
  Package,
} from 'lucide-react';
import { cn, formatCurrencyShort, isValidSLPhone, generateOrderId } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { SL_DISTRICTS, STORE } from '@/types';

// Step 1 schema
const customerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.email('Enter a valid email'),
  phone: z.string().refine(isValidSLPhone, 'Enter a valid Sri Lankan phone number (e.g., 0771234567)'),
});

// Step 2 schema
const addressSchema = z.object({
  line1: z.string().min(5, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(1, 'Select a district'),
  postalCode: z.string().optional(),
  deliveryType: z.enum(['standard', 'express']),
});

// Step 3 schema
const paymentSchema = z.object({
  paymentMethod: z.enum(['payhere', 'bank_transfer', 'cod']),
});

type CustomerData = z.infer<typeof customerSchema>;
type AddressData = z.infer<typeof addressSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

const STEPS = [
  { label: 'Customer Info', icon: User },
  { label: 'Delivery', icon: Truck },
  { label: 'Payment', icon: CreditCard },
];

export default function CheckoutForm() {
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const { clearCart, appliedCoupon, removeCoupon } = useStore();
  const { cart, getCartTotal } = useCart();

  const customerForm = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { fullName: '', email: '', phone: '' },
  });

  const addressForm = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      line1: '', line2: '', city: '', district: '', postalCode: '', deliveryType: 'standard',
    },
  });

  const paymentForm = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: 'cod' },
  });

  const subtotal = getCartTotal();
  const deliveryType = addressForm.watch('deliveryType');
  const shippingFee = subtotal >= STORE.freeShippingThreshold
    ? 0
    : deliveryType === 'express' ? STORE.expressShippingFee : STORE.standardShippingFee;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round(subtotal * (appliedCoupon.value / 100))
      : appliedCoupon.value
    : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const nextStep = async () => {
    let valid = false;
    if (step === 0) valid = await customerForm.trigger();
    if (step === 1) valid = await addressForm.trigger();
    if (valid) setStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const placeOrder = async () => {
    const valid = await paymentForm.trigger();
    if (!valid) return;

    // Simulate order placement
    const id = generateOrderId();
    setOrderId(id);
    setOrderPlaced(true);
    clearCart();
    removeCoupon();
  };

  const progress = ((step + 1) / 3) * 100;

  // Success state
  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.2 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
        >
          <Check className="h-10 w-10 text-emerald-600" />
        </motion.div>
        <h2 className="font-sans text-2xl font-bold text-navy">Order Placed!</h2>
        <p className="mt-2 font-sans text-sm text-navy/50">
          Your order <span className="font-semibold text-emerald-600">#{orderId}</span> has been placed successfully.
        </p>
        <p className="mt-1 font-sans text-xs text-navy/30">
          You will receive a confirmation email shortly.
        </p>
        <Button
          className="mt-8 gap-2 rounded-xl bg-emerald-500 font-sans hover:bg-emerald-600"
          onClick={() => window.location.reload()}
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => { if (i < step) setStep(i); }}
              className={cn(
                'flex items-center gap-2 font-sans text-xs font-medium transition-colors',
                i <= step ? 'text-emerald-600' : 'text-navy/30'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  i < step
                    ? 'bg-emerald-500 text-white'
                    : i === step
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-cream text-navy/30'
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
        <Progress value={progress} className="h-1.5 bg-cream [&>div]:bg-emerald-500" />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Customer Info */}
        {step === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-sans text-lg font-bold text-navy">Customer Information</h3>

            <div className="space-y-1.5">
              <Label className="font-sans text-xs text-navy/60">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
                <Input
                  {...customerForm.register('fullName')}
                  placeholder="Amal Perera"
                  className="h-10 rounded-xl border-navy/10 pl-9 font-sans text-sm"
                />
              </div>
              {customerForm.formState.errors.fullName && (
                <p className="font-sans text-[11px] text-red-500">
                  {customerForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-sans text-xs text-navy/60">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
                <Input
                  {...customerForm.register('email')}
                  type="email"
                  placeholder="amal@example.com"
                  className="h-10 rounded-xl border-navy/10 pl-9 font-sans text-sm"
                />
              </div>
              {customerForm.formState.errors.email && (
                <p className="font-sans text-[11px] text-red-500">
                  {customerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-sans text-xs text-navy/60">Phone (Sri Lanka)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
                <Input
                  {...customerForm.register('phone')}
                  type="tel"
                  placeholder="0771234567"
                  className="h-10 rounded-xl border-navy/10 pl-9 font-sans text-sm"
                />
              </div>
              {customerForm.formState.errors.phone && (
                <p className="font-sans text-[11px] text-red-500">
                  {customerForm.formState.errors.phone.message}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Delivery Address */}
        {step === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-sans text-lg font-bold text-navy">Delivery Address</h3>

            <div className="space-y-1.5">
              <Label className="font-sans text-xs text-navy/60">Address Line 1</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-navy/30" />
                <Input
                  {...addressForm.register('line1')}
                  placeholder="42, Galle Road"
                  className="h-10 rounded-xl border-navy/10 pl-9 font-sans text-sm"
                />
              </div>
              {addressForm.formState.errors.line1 && (
                <p className="font-sans text-[11px] text-red-500">
                  {addressForm.formState.errors.line1.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-sans text-xs text-navy/60">Address Line 2 (Optional)</Label>
              <Input
                {...addressForm.register('line2')}
                placeholder="Apt, Suite, etc."
                className="h-10 rounded-xl border-navy/10 font-sans text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="font-sans text-xs text-navy/60">City</Label>
                <Input
                  {...addressForm.register('city')}
                  placeholder="Colombo"
                  className="h-10 rounded-xl border-navy/10 font-sans text-sm"
                />
                {addressForm.formState.errors.city && (
                  <p className="font-sans text-[11px] text-red-500">
                    {addressForm.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="font-sans text-xs text-navy/60">District</Label>
                <select
                  {...addressForm.register('district')}
                  className="flex h-10 w-full rounded-xl border border-navy/10 bg-white px-3 font-sans text-sm text-navy outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select district</option>
                  {SL_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {addressForm.formState.errors.district && (
                  <p className="font-sans text-[11px] text-red-500">
                    {addressForm.formState.errors.district.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-sans text-xs text-navy/60">Postal Code (Optional)</Label>
              <Input
                {...addressForm.register('postalCode')}
                placeholder="00300"
                className="h-10 w-40 rounded-xl border-navy/10 font-sans text-sm"
              />
            </div>

            <Separator />

            {/* Delivery Method */}
            <div className="space-y-3">
              <Label className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
                Delivery Method
              </Label>
              <RadioGroup
                value={addressForm.watch('deliveryType')}
                onValueChange={(val) => addressForm.setValue('deliveryType', val as 'standard' | 'express')}
                className="grid gap-3 sm:grid-cols-2"
              >
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all',
                    addressForm.watch('deliveryType') === 'standard'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-navy/10 hover:border-emerald-200'
                  )}
                >
                  <RadioGroupItem value="standard" className="text-emerald-600" />
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">Standard Delivery</p>
                    <p className="font-sans text-[11px] text-navy/40">3–5 business days · {formatCurrencyShort(STORE.standardShippingFee)}</p>
                  </div>
                  <Truck className="ml-auto h-5 w-5 text-navy/20" />
                </label>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all',
                    addressForm.watch('deliveryType') === 'express'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-navy/10 hover:border-emerald-200'
                  )}
                >
                  <RadioGroupItem value="express" className="text-emerald-600" />
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">Express Delivery</p>
                    <p className="font-sans text-[11px] text-navy/40">1–2 business days · {formatCurrencyShort(STORE.expressShippingFee)}</p>
                  </div>
                  <Package className="ml-auto h-5 w-5 text-navy/20" />
                </label>
              </RadioGroup>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment & Confirm */}
        {step === 2 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <h3 className="font-sans text-lg font-bold text-navy">Payment & Confirmation</h3>

            {/* Order Summary */}
            <div className="rounded-2xl border border-navy/5 bg-cream/50 p-4 space-y-3">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
                Order Summary
              </h4>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <span className="font-sans text-sm text-navy/70">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-sans text-sm font-medium text-navy">
                      {formatCurrencyShort(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="font-sans text-navy/50">Subtotal</span>
                <span className="font-sans font-medium text-navy">{formatCurrencyShort(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-sans text-navy/50">Shipping</span>
                <span className={cn('font-sans font-medium', shippingFee === 0 ? 'text-emerald-600' : 'text-navy')}>
                  {shippingFee === 0 ? 'FREE' : formatCurrencyShort(shippingFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="font-sans text-emerald-600">Discount</span>
                  <span className="font-sans font-medium text-emerald-600">-{formatCurrencyShort(discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-sans text-base font-bold text-navy">Total</span>
                <span className="font-sans text-lg font-bold text-emerald-600">{formatCurrencyShort(total)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
                Payment Method
              </Label>
              <RadioGroup
                value={paymentForm.watch('paymentMethod')}
                onValueChange={(val) => paymentForm.setValue('paymentMethod', val as 'payhere' | 'bank_transfer' | 'cod')}
                className="space-y-2"
              >
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all',
                    paymentForm.watch('paymentMethod') === 'payhere'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-navy/10 hover:border-emerald-200'
                  )}
                >
                  <RadioGroupItem value="payhere" className="text-emerald-600" />
                  <CreditCard className="h-5 w-5 text-navy/30" />
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">PayHere</p>
                    <p className="font-sans text-[11px] text-navy/40">Card, bank transfer, or mobile wallet</p>
                  </div>
                </label>

                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all',
                    paymentForm.watch('paymentMethod') === 'bank_transfer'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-navy/10 hover:border-emerald-200'
                  )}
                >
                  <RadioGroupItem value="bank_transfer" className="text-emerald-600" />
                  <Building2 className="h-5 w-5 text-navy/30" />
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">Bank Transfer</p>
                    <p className="font-sans text-[11px] text-navy/40">Direct transfer to our bank account</p>
                  </div>
                </label>

                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all',
                    paymentForm.watch('paymentMethod') === 'cod'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-navy/10 hover:border-emerald-200'
                  )}
                >
                  <RadioGroupItem value="cod" className="text-emerald-600" />
                  <Banknote className="h-5 w-5 text-navy/30" />
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">Cash on Delivery</p>
                    <p className="font-sans text-[11px] text-navy/40">Pay when you receive your order</p>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {step > 0 ? (
          <Button
            variant="ghost"
            onClick={prevStep}
            className="gap-1 font-sans text-navy/50 hover:text-navy"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 2 ? (
          <Button
            onClick={nextStep}
            className="gap-1.5 rounded-xl bg-emerald-500 font-sans hover:bg-emerald-600"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={placeOrder}
            disabled={cart.length === 0}
            className="gap-2 rounded-xl bg-emerald-500 px-8 font-sans font-semibold hover:bg-emerald-600"
          >
            <ArrowRight className="h-4 w-4" />
            Place Order — {formatCurrencyShort(total)}
          </Button>
        )}
      </div>
    </div>
  );
}
