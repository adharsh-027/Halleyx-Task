export type WidgetType = 'kpi' | 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'table';

export const WIDGET_TYPE_LABELS: Record<WidgetType, string> = {
  kpi: 'KPI',
  bar: 'Bar Chart',
  line: 'Line Chart',
  pie: 'Pie Chart',
  area: 'Area Chart',
  scatter: 'Scatter Plot',
  table: 'Table',
};

export const METRIC_OPTIONS = [
  'Customer ID', 'Customer name', 'Email id', 'Address',
  'Order date', 'Product', 'Created by', 'Status',
  'Total amount', 'Unit price', 'Quantity',
] as const;

export const NUMERIC_METRICS = ['Total amount', 'Unit price', 'Quantity'] as const;

export const AXIS_OPTIONS = [
  'Product', 'Quantity', 'Unit price', 'Total amount',
  'Status', 'Created by', 'Duration',
] as const;

export const PIE_DATA_OPTIONS = [
  'Product', 'Quantity', 'Unit price', 'Total amount',
  'Status', 'Created by',
] as const;

export const TABLE_COLUMN_OPTIONS = [
  'Customer ID', 'Customer name', 'Email id', 'Phone number',
  'Address', 'Order ID', 'Order date', 'Product',
  'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by',
] as const;

export type Aggregation = 'Sum' | 'Average' | 'Count';
export type DataFormat = 'Number' | 'Currency';
export type SortOrder = 'Ascending' | 'Descending' | 'Order date';

export interface KPIConfig {
  metric: string;
  aggregation: Aggregation;
  dataFormat: DataFormat;
  decimalPrecision: number;
}

export interface ChartConfig {
  xAxis: string;
  yAxis: string;
  chartColor: string;
  showDataLabel: boolean;
}

export interface PieConfig {
  chartData: string;
  showLegend: boolean;
}

export interface TableConfig {
  columns: string[];
  sortBy?: SortOrder;
  pagination?: number;
  applyFilter: boolean;
  filters: { field: string; value: string }[];
  fontSize: number;
  headerBackground: string;
}

export interface DashboardWidget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: WidgetType;
  title: string;
  description: string;
  config: KPIConfig | ChartConfig | PieConfig | TableConfig;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
}

export const DEFAULT_WIDGET_SIZES: Record<WidgetType, { w: number; h: number }> = {
  kpi: { w: 2, h: 2 },
  bar: { w: 5, h: 5 },
  line: { w: 5, h: 5 },
  pie: { w: 4, h: 4 },
  area: { w: 5, h: 5 },
  scatter: { w: 5, h: 5 },
  table: { w: 4, h: 4 },
};

export function getDefaultConfig(type: WidgetType): DashboardWidget['config'] {
  switch (type) {
    case 'kpi':
      return { metric: 'Total amount', aggregation: 'Sum', dataFormat: 'Number', decimalPrecision: 0 };
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
      return { xAxis: 'Product', yAxis: 'Total amount', chartColor: '#4F6AF6', showDataLabel: false };
    case 'pie':
      return { chartData: 'Product', showLegend: true };
    case 'table':
      return {
        columns: ['Customer name', 'Product', 'Total amount', 'Status'],
        sortBy: undefined,
        pagination: 10,
        applyFilter: false,
        filters: [],
        fontSize: 14,
        headerBackground: '#54bd95',
      };
  }
}

export type DateFilter = 'all' | 'today' | '7days' | '30days' | '90days';

export const DATE_FILTER_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
];
