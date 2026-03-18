import { useMemo } from 'react';
import { Order } from '@/types/order';
import { DashboardWidget, KPIConfig, NUMERIC_METRICS } from '@/types/dashboard';

function getMetricValue(orders: Order[], config: KPIConfig): number {
  if (orders.length === 0) return 0;
  const { metric, aggregation } = config;

  if (aggregation === 'Count') return orders.length;

  const numericField = metric === 'Total amount' ? 'totalAmount' :
    metric === 'Unit price' ? 'unitPrice' :
    metric === 'Quantity' ? 'quantity' : null;

  if (!numericField) return orders.length;

  const values = orders.map(o => (o as any)[numericField] as number);
  if (aggregation === 'Sum') return values.reduce((a, b) => a + b, 0);
  if (aggregation === 'Average') return values.reduce((a, b) => a + b, 0) / values.length;
  return 0;
}

export default function KPIWidget({ widget, orders, config }: { widget: DashboardWidget; orders: Order[]; config: KPIConfig }) {
  const value = useMemo(() => getMetricValue(orders, config), [orders, config]);

  const formatted = config.dataFormat === 'Currency'
    ? `$${value.toFixed(config.decimalPrecision)}`
    : value.toFixed(config.decimalPrecision);

  return (
    <div className="p-4 h-full flex flex-col justify-center">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{widget.title}</h4>
      {widget.description && <p className="text-xs text-muted-foreground mb-2">{widget.description}</p>}
      <p className="text-3xl font-bold tabular-nums text-foreground">{formatted}</p>
    </div>
  );
}
