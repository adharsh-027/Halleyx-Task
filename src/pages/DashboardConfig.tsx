import { useState, useCallback, useRef } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/store/useDashboard';
import { useOrders } from '@/store/useOrders';
import { DashboardWidget, WidgetType, WIDGET_TYPE_LABELS, DEFAULT_WIDGET_SIZES, getDefaultConfig, KPIConfig, ChartConfig, PieConfig, TableConfig } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, ArrowLeft, Save } from 'lucide-react';
import WidgetPalette from '@/components/dashboard/WidgetPalette';
import WidgetConfigPanel from '@/components/dashboard/WidgetConfigPanel';
import KPIWidget from '@/components/dashboard/KPIWidget';
import ChartWidget from '@/components/dashboard/ChartWidget';
import PieWidget from '@/components/dashboard/PieWidget';
import TableWidget from '@/components/dashboard/TableWidget';
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

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardConfigPage() {
  const { widgets, updateWidgets, addWidget, removeWidget, updateWidget, commitConfiguration } = useDashboard();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [configWidget, setConfigWidget] = useState<DashboardWidget | null>(null);
  const [deleteWidget, setDeleteWidget] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    updateWidgets(widgets.map(w => {
      const l = layout.find(item => item.i === w.i);
      if (l) return { ...w, x: l.x, y: l.y, w: l.w, h: l.h };
      return w;
    }));
  }, [widgets, updateWidgets]);

  const handleAddWidget = useCallback((type: WidgetType) => {
    const size = DEFAULT_WIDGET_SIZES[type];
    const newWidget: DashboardWidget = {
      i: uuid(),
      x: 0,
      y: Infinity,
      w: size.w,
      h: size.h,
      type,
      title: 'Untitled',
      description: '',
      config: getDefaultConfig(type),
    };
    addWidget(newWidget);
  }, [addWidget]);

  const handleDeleteConfirm = () => {
    if (deleteWidget) removeWidget(deleteWidget);
    setDeleteWidget(null);
  };

  const handleSave = () => {
    commitConfiguration();
    navigate('/');
  };

  const gridLayouts = {
    lg: widgets.map(w => ({ i: w.i, x: w.x, y: w.y, w: w.w, h: w.h, minW: 1, minH: 1 })),
    md: widgets.map(w => ({ i: w.i, x: w.x % 8, y: w.y, w: Math.min(w.w, 8), h: w.h, minW: 1, minH: 1 })),
    sm: widgets.map(w => ({ i: w.i, x: 0, y: w.y, w: 4, h: w.h, minW: 1, minH: 1 })),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard Configuration</h1>
            <p className="text-sm text-muted-foreground mt-1">Drag and drop widgets to build your dashboard</p>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save size={16} /> Commit Configuration
        </Button>
      </div>

      <div className="flex gap-6">
        <WidgetPalette onAdd={handleAddWidget} />

        <div ref={containerRef} className="flex-1 min-h-[600px] rounded-lg config-grid-bg p-4 border border-border">
          {widgets.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Drag widgets from the palette or click to add them here
            </div>
          ) : (
            <ResponsiveGridLayout
              layouts={gridLayouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768 }}
              cols={{ lg: 12, md: 8, sm: 4 }}
              rowHeight={60}
              onLayoutChange={handleLayoutChange}
              draggableHandle=".widget-drag-handle"
              isResizable
              isDraggable
              compactType="vertical"
              margin={[16, 16]}
            >
              {widgets.map(widget => (
                <div key={widget.i} className="group">
                  <div className="h-full rounded-lg bg-card shadow-card hover:shadow-card-hover transition-shadow overflow-hidden relative widget-drag-handle cursor-grab active:cursor-grabbing">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfigWidget(widget); }}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        title="Settings"
                      >
                        <Settings size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteWidget(widget.i); }}
                        className="p-1.5 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <WidgetPreview widget={widget} orders={orders} />
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </div>
      </div>

      {/* Config Panel */}
      {configWidget && (
        <WidgetConfigPanel
          widget={configWidget}
          onUpdate={(w) => { updateWidget(w); setConfigWidget(w); }}
          onClose={() => setConfigWidget(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteWidget} onOpenChange={() => setDeleteWidget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Widget</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to remove this widget from the dashboard?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function WidgetPreview({ widget, orders }: { widget: DashboardWidget; orders: any[] }) {
  switch (widget.type) {
    case 'kpi':
      return <KPIWidget widget={widget} orders={orders} config={widget.config as KPIConfig} />;
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
      return <ChartWidget widget={widget} orders={orders} config={widget.config as ChartConfig} />;
    case 'pie':
      return <PieWidget widget={widget} orders={orders} config={widget.config as PieConfig} />;
    case 'table':
      return <TableWidget widget={widget} orders={orders} config={widget.config as TableConfig} />;
    default:
      return <div className="p-4 text-sm text-muted-foreground">{WIDGET_TYPE_LABELS[widget.type]}</div>;
  }
}
