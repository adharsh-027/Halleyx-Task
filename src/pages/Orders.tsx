import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Order, COUNTRIES, PRODUCTS, STATUSES, CREATORS } from '@/types/order';
import { useOrders } from '@/store/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Package } from 'lucide-react';

const emptyOrder = (): Omit<Order, 'id' | 'createdAt' | 'totalAmount'> => ({
  customer: {
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'United States',
  },
  product: 'Fiber Internet 300 Mbps',
  quantity: 1,
  unitPrice: 0,
  status: 'Pending',
  createdBy: 'Mr. Michael Harris',
});

export default function OrdersPage() {
  const { orders, addOrder, updateOrder, deleteOrder } = useOrders();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState(emptyOrder());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openCreate = () => {
    setEditingOrder(null);
    setForm(emptyOrder());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setForm({
      customer: { ...order.customer },
      product: order.product,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      status: order.status,
      createdBy: order.createdBy,
    });
    setErrors({});
    setDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) deleteOrder(deleteId);
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const c = form.customer;
    if (!c.firstName.trim()) e['firstName'] = 'Please fill the field';
    if (!c.lastName.trim()) e['lastName'] = 'Please fill the field';
    if (!c.email.trim()) e['email'] = 'Please fill the field';
    if (!c.phone.trim()) e['phone'] = 'Please fill the field';
    if (!c.address.trim()) e['address'] = 'Please fill the field';
    if (!c.city.trim()) e['city'] = 'Please fill the field';
    if (!c.state.trim()) e['state'] = 'Please fill the field';
    if (!c.zip.trim()) e['zip'] = 'Please fill the field';
    if (form.unitPrice <= 0) e['unitPrice'] = 'Please fill the field';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const total = form.quantity * form.unitPrice;
    if (editingOrder) {
      updateOrder({ ...editingOrder, ...form, totalAmount: total });
    } else {
      addOrder({ ...form, id: uuid(), totalAmount: total, createdAt: new Date().toISOString() });
    }
    setDialogOpen(false);
  };

  const updateCustomer = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value },
    }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const totalAmount = form.quantity * form.unitPrice;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Customer Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer order records</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Create Order
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-lg border border-dashed border-border bg-card">
          <Package size={48} className="text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click "Create Order" to add your first order.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-accent text-accent-foreground">
                  <th className="text-left px-4 py-3 font-semibold">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Product</th>
                  <th className="text-right px-4 py-3 font-semibold">Qty</th>
                  <th className="text-right px-4 py-3 font-semibold">Unit Price</th>
                  <th className="text-right px-4 py-3 font-semibold">Total</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Created By</th>
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <ContextMenu key={order.id}>
                    <ContextMenuTrigger asChild>
                      <tr className="border-t border-border hover:bg-muted/50 transition-colors cursor-context-menu">
                        <td className="px-4 py-3 font-medium">{order.customer.firstName} {order.customer.lastName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{order.customer.email}</td>
                        <td className="px-4 py-3">{order.product}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{order.quantity}</td>
                        <td className="px-4 py-3 text-right tabular-nums">${order.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'Completed' ? 'bg-success/10 text-success' :
                            order.status === 'In progress' ? 'bg-info/10 text-info' :
                            'bg-warning/10 text-warning'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{order.createdBy}</td>
                        <td className="px-4 py-3 text-muted-foreground tabular-nums">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => openEdit(order)}>Edit</ContextMenuItem>
                      <ContextMenuItem onClick={() => confirmDelete(order.id)} className="text-destructive">Delete</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOrder ? 'Edit Order' : 'Create Order'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First name *</Label>
                  <Input value={form.customer.firstName} onChange={e => updateCustomer('firstName', e.target.value)} />
                  {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label>Last name *</Label>
                  <Input value={form.customer.lastName} onChange={e => updateCustomer('lastName', e.target.value)} />
                  {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={form.customer.email} onChange={e => updateCustomer('email', e.target.value)} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label>Phone number *</Label>
                  <Input value={form.customer.phone} onChange={e => updateCustomer('phone', e.target.value)} />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="col-span-2">
                  <Label>Street Address *</Label>
                  <Input value={form.customer.address} onChange={e => updateCustomer('address', e.target.value)} />
                  {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label>City *</Label>
                  <Input value={form.customer.city} onChange={e => updateCustomer('city', e.target.value)} />
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label>State / Province *</Label>
                  <Input value={form.customer.state} onChange={e => updateCustomer('state', e.target.value)} />
                  {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <Label>Postal code *</Label>
                  <Input value={form.customer.zip} onChange={e => updateCustomer('zip', e.target.value)} />
                  {errors.zip && <p className="text-destructive text-xs mt-1">{errors.zip}</p>}
                </div>
                <div>
                  <Label>Country *</Label>
                  <Select value={form.customer.country} onValueChange={v => updateCustomer('country', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Order Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product *</Label>
                  <Select value={form.product} onValueChange={v => setForm(p => ({ ...p, product: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRODUCTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quantity *</Label>
                  <Input type="number" min={1} value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: Math.max(1, parseInt(e.target.value) || 1) }))} />
                </div>
                <div>
                  <Label>Unit price ($) *</Label>
                  <Input type="number" min={0} step="0.01" value={form.unitPrice || ''} onChange={e => {
                    const val = parseFloat(e.target.value) || 0;
                    setForm(p => ({ ...p, unitPrice: val }));
                    if (errors.unitPrice && val > 0) setErrors(prev => { const n = { ...prev }; delete n.unitPrice; return n; });
                  }} />
                  {errors.unitPrice && <p className="text-destructive text-xs mt-1">{errors.unitPrice}</p>}
                </div>
                <div>
                  <Label>Total amount</Label>
                  <Input readOnly value={`$${totalAmount.toFixed(2)}`} className="bg-muted" />
                </div>
                <div>
                  <Label>Status *</Label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Created by *</Label>
                  <Select value={form.createdBy} onValueChange={v => setForm(p => ({ ...p, createdBy: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CREATORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this order? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
