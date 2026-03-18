import { useMemo } from 'react';
import { Order } from '@/types/order';
import { DashboardWidget, DateFilter, ChartConfig, PieConfig, KPIConfig, TableConfig } from '@/types/dashboard';
import { useOrders } from '@/store/useOrders';
import { useDashboard } from '@/store/useDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DATE_FILTER_OPTIONS } from '@/types/dashboard';
import { Settings, LayoutDashboard, RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';
import KPIWidget from '@/components/dashboard/KPIWidget';
import ChartWidget from '@/components/dashboard/ChartWidget';
import PieWidget from '@/components/dashboard/PieWidget';
import TableWidget from '@/components/dashboard/TableWidget';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

function filterOrders(orders: Order[], filter: DateFilter): Order[] {
  if (filter === 'all') return orders;
  const now = new Date();
  const days = filter === 'today' ? 0 : filter === '7days' ? 7 : filter === '30days' ? 30 : 90;
  const cutoff = new Date(now);
  if (filter === 'today') {
    cutoff.setHours(0, 0, 0, 0);
  } else {
    cutoff.setDate(cutoff.getDate() - days);
  }
  return orders.filter(o => new Date(o.createdAt) >= cutoff);
}

export default function DashboardPage() {
  const { orders } = useOrders();
  const { savedWidgets, updateWidget, resetToDefault, savePersonalLayout, isPersonalized } = useDashboard();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const filteredOrders = useMemo(() => filterOrders(orders, dateFilter), [orders, dateFilter]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    newLayout.forEach(item => {
      const widget = savedWidgets.find(w => w.i === item.i);
      if (widget && (widget.x !== item.x || widget.y !== item.y || widget.w !== item.w || widget.h !== item.h)) {
        updateWidget({
          ...widget,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        });
      }
    });
  };

  if (savedWidgets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Operations Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Your personalized dashboard</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-lg border border-dashed border-border bg-card">
          <LayoutDashboard size={48} className="text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Your canvas is empty</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Start by adding widgets to visualize your order flow.</p>
          <Button onClick={() => navigate('/dashboard/configure')} className="gap-2">
            <Settings size={16} /> Configure Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Operations Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Your personalized dashboard</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show data for</span>
            <Select value={dateFilter} onValueChange={v => setDateFilter(v as DateFilter)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_FILTER_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isPersonalized && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={savePersonalLayout}
              className="gap-2"
            >
              <Save size={16} /> Save Layout
            </Button>
          )}

          {isPersonalized && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetToDefault}
              className="gap-2"
            >
              <RotateCcw size={16} /> Reset to Default
            </Button>
          )}

          <Button variant="outline" onClick={() => navigate('/dashboard/configure')} className="gap-2">
            <Settings size={16} /> Configure Dashboard
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-background">
        <GridLayout
          className="w-full"
          layout={savedWidgets.map(w => ({ i: w.i, x: w.x, y: w.y, w: w.w, h: w.h, static: false }))}
          cols={12}
          rowHeight={60}
          width={1200}
          onLayoutChange={handleLayoutChange}
          containerPadding={[0, 0]}
          margin={[16, 16]}
          compactType="vertical"
          preventCollision={false}
          useCSSTransforms={true}
        >
          {savedWidgets.map(widget => (
            <div
              key={widget.i}
              className="rounded-lg bg-card shadow-card hover:shadow-card-hover transition-shadow overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <WidgetRenderer widget={widget} orders={filteredOrders} />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}

function WidgetRenderer({ widget, orders }: { widget: DashboardWidget; orders: Order[] }) {
  const config = widget.config;
  switch (widget.type) {
    case 'kpi':
      return <KPIWidget widget={widget} orders={orders} config={config as KPIConfig} />;
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
      return <ChartWidget widget={widget} orders={orders} config={config as ChartConfig} />;
    case 'pie':
      return <PieWidget widget={widget} orders={orders} config={config as PieConfig} />;
    case 'table':
      return <TableWidget widget={widget} orders={orders} config={config as TableConfig} />;
    default:
      return null;
  }
}
