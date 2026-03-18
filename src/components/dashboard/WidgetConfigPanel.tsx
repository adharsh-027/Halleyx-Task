import { DashboardWidget, WidgetType, WIDGET_TYPE_LABELS, METRIC_OPTIONS, NUMERIC_METRICS, AXIS_OPTIONS, PIE_DATA_OPTIONS, TABLE_COLUMN_OPTIONS, KPIConfig, ChartConfig, PieConfig, TableConfig } from '@/types/dashboard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Props {
  widget: DashboardWidget;
  onUpdate: (w: DashboardWidget) => void;
  onClose: () => void;
}

export default function WidgetConfigPanel({ widget, onUpdate, onClose }: Props) {
  const update = (partial: Partial<DashboardWidget>) => onUpdate({ ...widget, ...partial });
  const updateConfig = (partial: Partial<DashboardWidget['config']>) => onUpdate({ ...widget, config: { ...widget.config, ...partial } as any });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-96 bg-card shadow-xl border-l border-border overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-sm font-semibold">Widget Settings</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* General */}
          <div className="space-y-3">
            <div>
              <Label>Widget title *</Label>
              <Input value={widget.title} onChange={e => update({ title: e.target.value })} />
            </div>
            <div>
              <Label>Widget type</Label>
              <Input readOnly value={WIDGET_TYPE_LABELS[widget.type]} className="bg-muted" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={widget.description} onChange={e => update({ description: e.target.value })} rows={2} />
            </div>
          </div>

          {/* Size */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Widget Size</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Width (Columns)</Label>
                <Input type="number" min={1} max={12} value={widget.w} onChange={e => update({ w: Math.max(1, parseInt(e.target.value) || 1) })} />
              </div>
              <div>
                <Label>Height (Rows)</Label>
                <Input type="number" min={1} value={widget.h} onChange={e => update({ h: Math.max(1, parseInt(e.target.value) || 1) })} />
              </div>
            </div>
          </div>

          {/* Type-specific config */}
          {widget.type === 'kpi' && <KPIConfigPanel config={widget.config as KPIConfig} onUpdate={updateConfig} />}
          {(['bar', 'line', 'area', 'scatter'].includes(widget.type)) && <ChartConfigPanel config={widget.config as ChartConfig} onUpdate={updateConfig} />}
          {widget.type === 'pie' && <PieConfigPanel config={widget.config as PieConfig} onUpdate={updateConfig} />}
          {widget.type === 'table' && <TableConfigPanel config={widget.config as TableConfig} onUpdate={updateConfig} />}
        </div>
      </div>
    </div>
  );
}

function KPIConfigPanel({ config, onUpdate }: { config: KPIConfig; onUpdate: (p: Partial<KPIConfig>) => void }) {
  const isNumeric = (NUMERIC_METRICS as readonly string[]).includes(config.metric);
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data Settings</h4>
      <div className="space-y-3">
        <div>
          <Label>Select metric *</Label>
          <Select value={config.metric} onValueChange={v => onUpdate({ metric: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{METRIC_OPTIONS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Aggregation *</Label>
          <Select value={config.aggregation} onValueChange={v => onUpdate({ aggregation: v as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Count">Count</SelectItem>
              <SelectItem value="Sum" disabled={!isNumeric}>Sum</SelectItem>
              <SelectItem value="Average" disabled={!isNumeric}>Average</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Data format *</Label>
          <Select value={config.dataFormat} onValueChange={v => onUpdate({ dataFormat: v as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Number">Number</SelectItem>
              <SelectItem value="Currency">Currency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Decimal Precision *</Label>
          <Input type="number" min={0} value={config.decimalPrecision} onChange={e => onUpdate({ decimalPrecision: Math.max(0, parseInt(e.target.value) || 0) })} />
        </div>
      </div>
    </div>
  );
}

function ChartConfigPanel({ config, onUpdate }: { config: ChartConfig; onUpdate: (p: Partial<ChartConfig>) => void }) {
  return (
    <>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data Settings</h4>
        <div className="space-y-3">
          <div>
            <Label>X-Axis data *</Label>
            <Select value={config.xAxis} onValueChange={v => onUpdate({ xAxis: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{AXIS_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Y-Axis data *</Label>
            <Select value={config.yAxis} onValueChange={v => onUpdate({ yAxis: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{AXIS_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Styling</h4>
        <div className="space-y-3">
          <div>
            <Label>Chart color</Label>
            <div className="flex gap-2">
              <input type="color" value={config.chartColor} onChange={e => onUpdate({ chartColor: e.target.value })} className="w-10 h-9 rounded border border-border cursor-pointer" />
              <Input value={config.chartColor} onChange={e => onUpdate({ chartColor: e.target.value })} className="flex-1" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={config.showDataLabel} onCheckedChange={v => onUpdate({ showDataLabel: !!v })} />
            <Label className="mb-0">Show data labels</Label>
          </div>
        </div>
      </div>
    </>
  );
}

function PieConfigPanel({ config, onUpdate }: { config: PieConfig; onUpdate: (p: Partial<PieConfig>) => void }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data Settings</h4>
      <div className="space-y-3">
        <div>
          <Label>Chart data *</Label>
          <Select value={config.chartData} onValueChange={v => onUpdate({ chartData: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{PIE_DATA_OPTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={config.showLegend} onCheckedChange={v => onUpdate({ showLegend: !!v })} />
          <Label className="mb-0">Show legend</Label>
        </div>
      </div>
    </div>
  );
}

function TableConfigPanel({ config, onUpdate }: { config: TableConfig; onUpdate: (p: Partial<TableConfig>) => void }) {
  const toggleColumn = (col: string) => {
    const cols = config.columns.includes(col)
      ? config.columns.filter(c => c !== col)
      : [...config.columns, col];
    onUpdate({ columns: cols });
  };

  return (
    <>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data Settings</h4>
        <div className="space-y-3">
          <div>
            <Label>Choose columns *</Label>
            <div className="max-h-40 overflow-y-auto border border-border rounded-md p-2 space-y-1 mt-1">
              {TABLE_COLUMN_OPTIONS.map(col => (
                <label key={col} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded">
                  <Checkbox checked={config.columns.includes(col)} onCheckedChange={() => toggleColumn(col)} />
                  {col}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>Sort by</Label>
            <Select value={config.sortBy || 'none'} onValueChange={v => onUpdate({ sortBy: v === 'none' ? undefined : v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="Ascending">Ascending</SelectItem>
                <SelectItem value="Descending">Descending</SelectItem>
                <SelectItem value="Order date">Order date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pagination</Label>
            <Select value={String(config.pagination || 'none')} onValueChange={v => onUpdate({ pagination: v === 'none' ? undefined : parseInt(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Styling</h4>
        <div className="space-y-3">
          <div>
            <Label>Font size</Label>
            <Input type="number" min={12} max={18} value={config.fontSize} onChange={e => {
              const v = parseInt(e.target.value) || 14;
              onUpdate({ fontSize: Math.min(18, Math.max(12, v)) });
            }} />
          </div>
          <div>
            <Label>Header background</Label>
            <div className="flex gap-2">
              <input type="color" value={config.headerBackground} onChange={e => onUpdate({ headerBackground: e.target.value })} className="w-10 h-9 rounded border border-border cursor-pointer" />
              <Input value={config.headerBackground} onChange={e => onUpdate({ headerBackground: e.target.value })} className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
