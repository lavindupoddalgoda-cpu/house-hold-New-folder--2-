'use client';

import { useState } from 'react';
import type { Coupon, Banner } from '@/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Tag, ImageIcon } from 'lucide-react';

const mockCoupons: Coupon[] = [
  {
    code: 'WELCOME500',
    type: 'fixed',
    value: 500,
    minOrderValue: 3000,
    maxUses: 100,
    usedCount: 47,
    expiresAt: { seconds: Date.now() / 1000 + 2592000, nanoseconds: 0 },
    isActive: true,
  },
  {
    code: 'SUMMER20',
    type: 'percentage',
    value: 20,
    minOrderValue: 5000,
    maxUses: 200,
    usedCount: 123,
    expiresAt: { seconds: Date.now() / 1000 + 7776000, nanoseconds: 0 },
    isActive: true,
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 350,
    minOrderValue: 2000,
    maxUses: 500,
    usedCount: 289,
    expiresAt: { seconds: Date.now() / 1000 + 5184000, nanoseconds: 0 },
    isActive: true,
  },
  {
    code: 'FLASH10',
    type: 'percentage',
    value: 10,
    minOrderValue: 1000,
    maxUses: 50,
    usedCount: 50,
    expiresAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
    isActive: false,
  },
];

const mockBanners: Banner[] = [
  {
    id: 'b1',
    title: 'Summer Sale',
    subtitle: 'Up to 30% off on selected items',
    ctaText: 'Shop Now',
    ctaLink: '/catalog?sale=summer',
    imageURL: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'b2',
    title: 'New Arrivals',
    subtitle: 'Check out our latest collection',
    ctaText: 'Explore',
    ctaLink: '/catalog?sort=newest',
    imageURL: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'b3',
    title: 'Free Shipping',
    subtitle: 'On orders over Rs. 5,000',
    ctaText: 'Learn More',
    ctaLink: '/catalog',
    imageURL: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    displayOrder: 3,
    isActive: false,
  },
];

export default function MarketingPage() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [banners, setBanners] = useState(mockBanners);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Coupon form state
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrderValue: '',
    maxUses: '',
    isActive: true,
  });

  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    imageURL: '',
    displayOrder: '1',
    isActive: true,
  });

  const openNewCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({ code: '', type: 'percentage', value: '', minOrderValue: '', maxUses: '', isActive: true });
    setCouponDialogOpen(true);
  };

  const openEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minOrderValue: String(coupon.minOrderValue),
      maxUses: String(coupon.maxUses),
      isActive: coupon.isActive,
    });
    setCouponDialogOpen(true);
  };

  const saveCoupon = () => {
    const newCoupon: Coupon = {
      code: couponForm.code.toUpperCase(),
      type: couponForm.type,
      value: Number(couponForm.value),
      minOrderValue: Number(couponForm.minOrderValue),
      maxUses: Number(couponForm.maxUses),
      usedCount: editingCoupon?.usedCount || 0,
      expiresAt: editingCoupon?.expiresAt || { seconds: Date.now() / 1000 + 2592000, nanoseconds: 0 },
      isActive: couponForm.isActive,
    };

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.code === editingCoupon.code ? newCoupon : c))
      );
    } else {
      setCoupons((prev) => [...prev, newCoupon]);
    }
    setCouponDialogOpen(false);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const openNewBanner = () => {
    setEditingBanner(null);
    setBannerForm({ title: '', subtitle: '', ctaText: '', ctaLink: '', imageURL: '', displayOrder: '1', isActive: true });
    setBannerDialogOpen(true);
  };

  const openEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      imageURL: banner.imageURL,
      displayOrder: String(banner.displayOrder),
      isActive: banner.isActive,
    });
    setBannerDialogOpen(true);
  };

  const saveBanner = () => {
    const newBanner: Banner = {
      id: editingBanner?.id || 'b' + Date.now(),
      title: bannerForm.title,
      subtitle: bannerForm.subtitle,
      ctaText: bannerForm.ctaText,
      ctaLink: bannerForm.ctaLink,
      imageURL: bannerForm.imageURL,
      displayOrder: Number(bannerForm.displayOrder),
      isActive: bannerForm.isActive,
    };

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) => (b.id === editingBanner.id ? newBanner : b))
      );
    } else {
      setBanners((prev) => [...prev, newBanner]);
    }
    setBannerDialogOpen(false);
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Coupons Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-semibold text-slate-900">Coupons</h2>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
              {coupons.length}
            </Badge>
          </div>
          <Button onClick={openNewCoupon} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Coupon
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Min. Order</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usage</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expires</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.code} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-slate-900">{coupon.code}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{coupon.type}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(coupon.minOrderValue)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {coupon.usedCount}/{coupon.maxUses}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(coupon.expiresAt)}</td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        'text-xs font-medium border',
                        coupon.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                      )}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditCoupon(coupon)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteCoupon(coupon.code)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Banners Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-semibold text-slate-900">Banners</h2>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
              {banners.length}
            </Badge>
          </div>
          <Button onClick={openNewBanner} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Banner
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <Card key={banner.id} className="rounded-2xl shadow overflow-hidden">
              <div className="w-full h-36 bg-slate-100 overflow-hidden relative">
                {banner.imageURL && (
                  <img
                    src={banner.imageURL}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={cn(
                    'text-xs font-medium border',
                    banner.isActive ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-500 text-white border-slate-600'
                  )}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-900">{banner.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{banner.subtitle}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400">Order: {banner.displayOrder}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditBanner(banner)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteBanner(banner.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coupon Dialog */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Coupon Code</Label>
              <Input
                placeholder="e.g. SUMMER20"
                value={couponForm.code}
                onChange={(e) => setCouponForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={couponForm.type}
                  onValueChange={(v) => setCouponForm((p) => ({ ...p, type: v as 'percentage' | 'fixed' }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={couponForm.value}
                  onChange={(e) => setCouponForm((p) => ({ ...p, value: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min. Order Value</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={couponForm.minOrderValue}
                  onChange={(e) => setCouponForm((p) => ({ ...p, minOrderValue: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Max Uses</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={couponForm.maxUses}
                  onChange={(e) => setCouponForm((p) => ({ ...p, maxUses: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={couponForm.isActive}
                onCheckedChange={(checked) => setCouponForm((p) => ({ ...p, isActive: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCouponDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCoupon} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {editingCoupon ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner Dialog */}
      <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={bannerForm.title} onChange={(e) => setBannerForm((p) => ({ ...p, title: e.target.value }))} className="mt-1.5" />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input value={bannerForm.subtitle} onChange={(e) => setBannerForm((p) => ({ ...p, subtitle: e.target.value }))} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTA Text</Label>
                <Input value={bannerForm.ctaText} onChange={(e) => setBannerForm((p) => ({ ...p, ctaText: e.target.value }))} className="mt-1.5" />
              </div>
              <div>
                <Label>CTA Link</Label>
                <Input value={bannerForm.ctaLink} onChange={(e) => setBannerForm((p) => ({ ...p, ctaLink: e.target.value }))} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={bannerForm.imageURL} onChange={(e) => setBannerForm((p) => ({ ...p, imageURL: e.target.value }))} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={bannerForm.displayOrder} onChange={(e) => setBannerForm((p) => ({ ...p, displayOrder: e.target.value }))} className="mt-1.5" />
              </div>
              <div className="flex items-center justify-between pt-6">
                <Label>Active</Label>
                <Switch checked={bannerForm.isActive} onCheckedChange={(checked) => setBannerForm((p) => ({ ...p, isActive: checked }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveBanner} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {editingBanner ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
