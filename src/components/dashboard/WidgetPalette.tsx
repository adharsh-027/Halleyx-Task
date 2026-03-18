import { WidgetType, WIDGET_TYPE_LABELS } from '@/types/dashboard';
import { BarChart3, LineChart, PieChart, AreaChart, ScatterChart as ScatterIcon, Table, Activity } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const WIDGET_GROUPS = [
  {
    label: 'Charts',
    items: [
      { type: 'bar' as WidgetType, icon: BarChart3, label: 'Bar Chart' },
      { type: 'line' as WidgetType, icon: LineChart, label: 'Line Chart' },
      { type: 'pie' as WidgetType, icon: PieChart, label: 'Pie Chart' },
      { type: 'area' as WidgetType, icon: AreaChart, label: 'Area Chart' },
      { type: 'scatter' as WidgetType, icon: ScatterIcon, label: 'Scatter Plot' },
    ],
  },
  {
    label: 'Tables',
    items: [
      { type: 'table' as WidgetType, icon: Table, label: 'Table' },
    ],
  },
  {
    label: 'KPIs',
    items: [
      { type: 'kpi' as WidgetType, icon: Activity, label: 'KPI Value' },
    ],
  },
];

export default function WidgetPalette({ onAdd }: { onAdd: (type: WidgetType) => void }) {
  return (
    <div className="w-64 shrink-0">
      <div className="rounded-lg border border-border bg-card shadow-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Widgets</h3>
        <Accordion type="multiple" defaultValue={['Charts', 'Tables', 'KPIs']}>
          {WIDGET_GROUPS.map(group => (
            <AccordionItem key={group.label} value={group.label} className="border-none">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 hover:no-underline">
                {group.label}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button
                      key={item.type}
                      onClick={() => onAdd(item.type)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-foreground"
                    >
                      <item.icon size={14} className="text-muted-foreground" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
