import { useMemo } from 'react';
import { Order } from '@/types/order';
import { DashboardWidget, ChartConfig } from '@/types/dashboard';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label as ReLabel } from 'recharts';

function getFieldValue(order: Order, field: string): any {
  switch (field) {
    case 'Product': return order.product;
    case 'Quantity': return order.quantity;
    case 'Unit price': return order.unitPrice;
    case 'Total amount': return order.totalAmount;
    case 'Status': return order.status;
    case 'Created by': return order.createdBy;
    case 'Duration': return Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 86400000);
    default: return '';
  }
}

function aggregateData(orders: Order[], xAxis: string, yAxis: string) {
  const groups: Record<string, number[]> = {};
  orders.forEach(o => {
    const key = String(getFieldValue(o, xAxis));
    if (!groups[key]) groups[key] = [];
    const yVal = getFieldValue(o, yAxis);
    groups[key].push(typeof yVal === 'number' ? yVal : 1);
  });
  return Object.entries(groups).map(([name, values]) => ({
    name,
    value: values.reduce((a, b) => a + b, 0),
  }));
}

export default function ChartWidget({ widget, orders, config }: { widget: DashboardWidget; orders: Order[]; config: ChartConfig }) {
  const data = useMemo(() => aggregateData(orders, config.xAxis, config.yAxis), [orders, config.xAxis, config.yAxis]);
  const color = config.chartColor || '#4F6AF6';

  return (
    <div className="p-4 h-full flex flex-col">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{widget.title}</h4>
      {widget.description && <p className="text-xs text-muted-foreground mb-2">{widget.description}</p>}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {widget.type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} label={config.showDataLabel ? { position: 'top', fontSize: 10 } : false} />
            </BarChart>
          ) : widget.type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} label={config.showDataLabel ? { position: 'top', fontSize: 10 } : false} />
            </LineChart>
          ) : widget.type === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} label={config.showDataLabel ? { position: 'top', fontSize: 10 } : false} />
            </AreaChart>
          ) : (
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} name={config.xAxis} />
              <YAxis dataKey="value" tick={{ fontSize: 11 }} name={config.yAxis} />
              <Tooltip />
              <Scatter data={data} fill={color} />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
