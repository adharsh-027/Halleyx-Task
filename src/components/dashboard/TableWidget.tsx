import { useMemo, useState } from 'react';
import { Order } from '@/types/order';
import { DashboardWidget, TableConfig } from '@/types/dashboard';

function getColumnValue(order: Order, col: string): string {
  switch (col) {
    case 'Customer ID': return order.id.slice(0, 8);
    case 'Customer name': return `${order.customer.firstName} ${order.customer.lastName}`;
    case 'Email id': return order.customer.email;
    case 'Phone number': return order.customer.phone;
    case 'Address': return `${order.customer.address}, ${order.customer.city}`;
    case 'Order ID': return order.id.slice(0, 8);
    case 'Order date': return new Date(order.createdAt).toLocaleDateString();
    case 'Product': return order.product;
    case 'Quantity': return String(order.quantity);
    case 'Unit price': return `$${order.unitPrice.toFixed(2)}`;
    case 'Total amount': return `$${order.totalAmount.toFixed(2)}`;
    case 'Status': return order.status;
    case 'Created by': return order.createdBy;
    default: return '';
  }
}

export default function TableWidget({ widget, orders, config }: { widget: DashboardWidget; orders: Order[]; config: TableConfig }) {
  const [page, setPage] = useState(0);
  const pageSize = config.pagination || orders.length;

  const sortedOrders = useMemo(() => {
    const sorted = [...orders];
    if (config.sortBy === 'Ascending') sorted.sort((a, b) => a.totalAmount - b.totalAmount);
    else if (config.sortBy === 'Descending') sorted.sort((a, b) => b.totalAmount - a.totalAmount);
    else if (config.sortBy === 'Order date') sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted;
  }, [orders, config.sortBy]);

  const paginatedOrders = pageSize > 0 ? sortedOrders.slice(page * pageSize, (page + 1) * pageSize) : sortedOrders;
  const totalPages = pageSize > 0 ? Math.ceil(sortedOrders.length / pageSize) : 1;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{widget.title}</h4>
        {widget.description && <p className="text-xs text-muted-foreground mt-1">{widget.description}</p>}
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs" style={{ fontSize: config.fontSize || 14 }}>
          <thead>
            <tr>
              {config.columns.map(col => (
                <th key={col} className="text-left px-3 py-2 font-semibold text-accent-foreground sticky top-0" style={{ backgroundColor: config.headerBackground || '#54bd95' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr><td colSpan={config.columns.length} className="px-3 py-4 text-center text-muted-foreground">No data</td></tr>
            ) : (
              paginatedOrders.map(order => (
                <tr key={order.id} className="border-t border-border hover:bg-muted/30">
                  {config.columns.map(col => (
                    <td key={col} className="px-3 py-2 tabular-nums">{getColumnValue(order, col)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs">
          <span className="text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-2 py-1 rounded hover:bg-muted disabled:opacity-40">Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-2 py-1 rounded hover:bg-muted disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
