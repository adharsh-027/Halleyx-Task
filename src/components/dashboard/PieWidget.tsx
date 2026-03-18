import { useMemo } from 'react';
import { Order } from '@/types/order';
import { DashboardWidget, PieConfig } from '@/types/dashboard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4F6AF6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#EC4899'];

function getFieldValue(order: Order, field: string): string {
  switch (field) {
    case 'Product': return order.product;
    case 'Status': return order.status;
    case 'Created by': return order.createdBy;
    default: return String((order as any)[field.toLowerCase()] ?? '');
  }
}

function isNumericField(field: string): boolean {
  return ['Quantity', 'Unit price', 'Total amount'].includes(field);
}

function getNumericValue(order: Order, field: string): number {
  switch (field) {
    case 'Quantity': return order.quantity;
    case 'Unit price': return order.unitPrice;
    case 'Total amount': return order.totalAmount;
    default: return 1;
  }
}

function aggregateForPie(orders: Order[], field: string) {
  if (isNumericField(field)) {
    // For numeric fields, group by product and sum the field
    const groups: Record<string, number> = {};
    orders.forEach(o => {
      const key = o.product;
      groups[key] = (groups[key] || 0) + getNumericValue(o, field);
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }
  // For categorical fields, count occurrences
  const counts: Record<string, number> = {};
  orders.forEach(o => {
    const key = getFieldValue(o, field);
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export default function PieWidget({ widget, orders, config }: { widget: DashboardWidget; orders: Order[]; config: PieConfig }) {
  const data = useMemo(() => aggregateForPie(orders, config.chartData), [orders, config.chartData]);

  return (
    <div className="p-4 h-full flex flex-col">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{widget.title}</h4>
      {widget.description && <p className="text-xs text-muted-foreground mb-2">{widget.description}</p>}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%" label>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            {config.showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
