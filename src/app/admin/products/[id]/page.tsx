'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { SEED_PRODUCTS, SEED_CATEGORIES, STORE } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Plus, X, Save, RefreshCw } from 'lucide-react';

function generateSKU(category: string) {
  const prefix: Record<string, string> = {
    Kitchen: 'KIT',
    Bedroom: 'BED',
    Bathroom: 'BTH',
    'Living Room': 'LIV',
    Storage: 'STG',
    Cleaning: 'CLN',
  };
  const code = prefix[category] || 'GEN';
  const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `HN-${code}-${num}`;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const product = SEED_PRODUCTS.find((p) => p.id === id);

  const [form, setForm] = useState({
    productName: product?.productName || '',
    sku: product?.sku || '',
    category: product?.category || '',
    brand: product?.brand || 'HomeNest',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    costPrice: String(product?.costPrice || ''),
    sellingPrice: String(product?.sellingPrice || ''),
    discountPrice: String(product?.discountPrice || ''),
    stock: String(product?.stock || ''),
    weight: String(product?.weight || ''),
    length: String(product?.dimensions?.length || ''),
    width: String(product?.dimensions?.width || ''),
    height: String(product?.dimensions?.height || ''),
    tags: product?.tags?.join(', ') || '',
    featured: product?.featured || false,
    isActive: product?.isActive ?? true,
    imageUrls: product?.images?.length ? [...product.images] : [''],
  });

  const [variants, setVariants] = useState<{ type: string; values: string }[]>(
    product?.variants?.map((v) => ({ type: v.type, values: v.values.join(', ') })) || []
  );
  const [saving, setSaving] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    const catName = SEED_CATEGORIES.find((c) => c.id === category)?.name || category;
    setForm((prev) => ({ ...prev, category: catName }));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { type: '', values: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: 'type' | 'values', value: string) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const addImageUrl = () => {
    setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const updateImageUrl = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, i) => (i === index ? value : url)),
    }));
  };

  const removeImageUrl = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const sellingPrice = Number(form.sellingPrice) || 0;
  const discountPrice = Number(form.discountPrice) || 0;
  const costPrice = Number(form.costPrice) || 0;
  const displayPrice = discountPrice > 0 ? discountPrice : sellingPrice;
  const profit = displayPrice - costPrice;
  const margin = displayPrice > 0 ? ((profit / displayPrice) * 100).toFixed(1) : '0';
  const discountPercent =
    sellingPrice > 0 && discountPrice > 0
      ? (((sellingPrice - discountPrice) / sellingPrice) * 100).toFixed(0)
      : '0';

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    router.push('/admin/products');
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-slate-500">Product not found</p>
        <Button variant="outline" onClick={() => router.push('/admin/products')} className="mt-4">
          Back to Products
        </Button>
      </div>
    );
  }

  const categoryValue = SEED_CATEGORIES.find((c) => c.name === form.category)?.id || '';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Edit Product</h2>
          <p className="text-sm text-slate-500">
            Editing: {product.productName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={form.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input id="sku" value={form.sku} onChange={(e) => updateField('sku', e.target.value)} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateField('sku', generateSKU(form.category))}
                      title="Regenerate SKU"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select value={categoryValue} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEED_CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" value={form.brand} onChange={(e) => updateField('brand', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" value={form.tags} onChange={(e) => updateField('tags', e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input id="shortDescription" value={form.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => updateField('description', e.target.value)} className="mt-1.5 min-h-24" />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="costPrice">Cost Price ({STORE.symbol})</Label>
                  <Input id="costPrice" type="number" value={form.costPrice} onChange={(e) => updateField('costPrice', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="sellingPrice">Selling Price ({STORE.symbol}) *</Label>
                  <Input id="sellingPrice" type="number" value={form.sellingPrice} onChange={(e) => updateField('sellingPrice', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="discountPrice">Discount Price ({STORE.symbol})</Label>
                  <Input id="discountPrice" type="number" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)} className="mt-1.5" />
                </div>
              </div>
              {sellingPrice > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing Preview</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-slate-500">Selling Price</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(sellingPrice)}</p>
                    </div>
                    {discountPrice > 0 && (
                      <div>
                        <p className="text-xs text-slate-500">Discount</p>
                        <p className="text-sm font-bold text-emerald-600">-{discountPercent}%</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-500">Profit</p>
                      <p className={`text-sm font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(profit)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Margin</p>
                      <p className="text-sm font-bold text-slate-900">{margin}%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Inventory & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input id="stock" type="number" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input id="weight" type="number" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input id="length" type="number" value={form.length} onChange={(e) => updateField('length', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input id="width" type="number" value={form.width} onChange={(e) => updateField('width', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" value={form.height} onChange={(e) => updateField('height', e.target.value)} className="mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card className="rounded-2xl shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Variants</CardTitle>
              <Button variant="outline" size="sm" onClick={addVariant} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add Group
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No variants added.</p>
              )}
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label>Variant Type</Label>
                    <Input value={variant.type} onChange={(e) => updateVariant(index, 'type', e.target.value)} className="mt-1.5" />
                  </div>
                  <div className="flex-[2]">
                    <Label>Values (comma-separated)</Label>
                    <Input value={variant.values} onChange={(e) => updateVariant(index, 'values', e.target.value)} className="mt-1.5" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="rounded-2xl shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Product Images</CardTitle>
              <Button variant="outline" size="sm" onClick={addImageUrl} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add Image
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {form.imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input value={url} onChange={(e) => updateImageUrl(index, e.target.value)} />
                  {form.imageUrls.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeImageUrl(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Featured Product</p>
                  <p className="text-xs text-slate-500">Show on homepage</p>
                </div>
                <Switch checked={form.featured} onCheckedChange={(checked) => updateField('featured', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Active</p>
                  <p className="text-xs text-slate-500">Visible to customers</p>
                </div>
                <Switch checked={form.isActive} onCheckedChange={(checked) => updateField('isActive', checked)} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {form.imageUrls[0] && (
                  <div className="w-full aspect-square rounded-xl bg-slate-100 overflow-hidden">
                    <img src={form.imageUrls[0]} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
                <p className="text-sm font-medium text-slate-900">{form.productName || 'Product Name'}</p>
                {form.category && <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">{form.category}</Badge>}
                <div className="flex items-baseline gap-2">
                  {discountPrice > 0 ? (
                    <>
                      <span className="text-lg font-bold text-slate-900">{formatCurrency(discountPrice)}</span>
                      <span className="text-sm text-slate-400 line-through">{formatCurrency(sellingPrice)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-slate-900">{sellingPrice > 0 ? formatCurrency(sellingPrice) : STORE.symbol + ' 0.00'}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white gap-2 h-12">
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
