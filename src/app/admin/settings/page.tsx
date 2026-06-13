'use client';

import { useState } from 'react';
import { STORE, SEED_CATEGORIES } from '@/types';
import type { Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Store, Truck, CreditCard, FolderOpen, Save } from 'lucide-react';

export default function SettingsPage() {
  // Store info state
  const [storeInfo, setStoreInfo] = useState({
    name: STORE.name,
    tagline: STORE.tagline,
    email: STORE.email,
    phone: STORE.phone,
    address: STORE.address,
    adminEmail: STORE.adminEmail,
  });

  // Delivery state
  const [delivery, setDelivery] = useState({
    standardFee: String(STORE.standardShippingFee),
    expressFee: String(STORE.expressShippingFee),
    freeThreshold: String(STORE.freeShippingThreshold),
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState({
    payhere: true,
    bankTransfer: true,
    cod: true,
  });

  // Categories state
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '',
    displayOrder: '1',
    isActive: true,
  });

  const openNewCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', icon: '', displayOrder: String(categories.length + 1), isActive: true });
    setCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      icon: cat.icon,
      displayOrder: String(cat.displayOrder),
      isActive: cat.isActive,
    });
    setCategoryDialogOpen(true);
  };

  const saveCategory = () => {
    const newCat: Category = {
      id: editingCategory?.id || 'cat-' + Date.now(),
      name: categoryForm.name,
      icon: categoryForm.icon,
      displayOrder: Number(categoryForm.displayOrder),
      isActive: categoryForm.isActive,
    };

    if (editingCategory) {
      setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? newCat : c)));
    } else {
      setCategories((prev) => [...prev, newCat]);
    }
    setCategoryDialogOpen(false);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-4xl">
      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="bg-white shadow rounded-xl h-auto p-1">
          <TabsTrigger value="store" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg">
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Store Info</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg">
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">Delivery</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
        </TabsList>

        {/* Store Info */}
        <TabsContent value="store">
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, name: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={storeInfo.tagline}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, tagline: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeEmail">Contact Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeInfo.email}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, email: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={storeInfo.phone}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, phone: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeAddress">Address</Label>
                  <Input
                    id="storeAddress"
                    value={storeInfo.address}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, address: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={storeInfo.adminEmail}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, adminEmail: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery */}
        <TabsContent value="delivery">
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Delivery Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="standardFee">Standard Shipping Fee (Rs.)</Label>
                  <Input
                    id="standardFee"
                    type="number"
                    value={delivery.standardFee}
                    onChange={(e) => setDelivery((p) => ({ ...p, standardFee: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="expressFee">Express Shipping Fee (Rs.)</Label>
                  <Input
                    id="expressFee"
                    type="number"
                    value={delivery.expressFee}
                    onChange={(e) => setDelivery((p) => ({ ...p, expressFee: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="freeThreshold">Free Shipping Threshold (Rs.)</Label>
                  <Input
                    id="freeThreshold"
                    type="number"
                    value={delivery.freeThreshold}
                    onChange={(e) => setDelivery((p) => ({ ...p, freeThreshold: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl">
                <p className="text-sm text-emerald-800">
                  <strong>Note:</strong> Orders above Rs. {delivery.freeThreshold} qualify for free standard shipping.
                  Express delivery is always paid.
                </p>
              </div>
              <div className="pt-2">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payment">
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">PayHere</p>
                    <p className="text-xs text-slate-500">Online payment gateway for Sri Lanka</p>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.payhere}
                  onCheckedChange={(checked) =>
                    setPaymentMethods((p) => ({ ...p, payhere: checked }))
                  }
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Bank Transfer</p>
                    <p className="text-xs text-slate-500">Direct bank deposit / wire transfer</p>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.bankTransfer}
                  onCheckedChange={(checked) =>
                    setPaymentMethods((p) => ({ ...p, bankTransfer: checked }))
                  }
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Cash on Delivery (COD)</p>
                    <p className="text-xs text-slate-500">Pay when order is delivered</p>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.cod}
                  onCheckedChange={(checked) =>
                    setPaymentMethods((p) => ({ ...p, cod: checked }))
                  }
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="pt-2">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories">
          <Card className="rounded-2xl shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Categories</CardTitle>
              <Button onClick={openNewCategory} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{category.name}</p>
                          <p className="text-xs text-slate-500">Order: {category.displayOrder}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            category.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs'
                              : 'bg-slate-50 text-slate-600 border border-slate-200 text-xs'
                          }
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditCategory(category)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                className="mt-1.5"
                placeholder="e.g. Kitchen"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon (emoji)</Label>
                <Input
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, icon: e.target.value }))}
                  className="mt-1.5"
                  placeholder="e.g. 🍳"
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={categoryForm.displayOrder}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, displayOrder: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={categoryForm.isActive}
                onCheckedChange={(checked) =>
                  setCategoryForm((p) => ({ ...p, isActive: checked }))
                }
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
