import { useState, useCallback } from 'react';
import { DashboardWidget } from '@/types/dashboard';

const STORAGE_KEY = 'dashboard-layout';
const DEFAULT_STORAGE_KEY = 'dashboard-layout-default';

const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    i: 'kpi-1',
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    type: 'kpi',
    title: 'Total Revenue',
    description: 'Sum of all order amounts',
    config: { metric: 'Total amount', aggregation: 'Sum', dataFormat: 'Currency', decimalPrecision: 2 },
  },
  {
    i: 'kpi-2',
    x: 2,
    y: 0,
    w: 2,
    h: 2,
    type: 'kpi',
    title: 'Total Orders',
    description: 'Count of all orders',
    config: { metric: 'Total amount', aggregation: 'Count', dataFormat: 'Number', decimalPrecision: 0 },
  },
  {
    i: 'kpi-3',
    x: 4,
    y: 0,
    w: 2,
    h: 2,
    type: 'kpi',
    title: 'Avg Order Value',
    description: 'Average order amount',
    config: { metric: 'Total amount', aggregation: 'Average', dataFormat: 'Currency', decimalPrecision: 2 },
  },
  {
    i: 'kpi-4',
    x: 6,
    y: 0,
    w: 2,
    h: 2,
    type: 'kpi',
    title: 'Total Units Sold',
    description: 'Sum of ordered quantities',
    config: { metric: 'Quantity', aggregation: 'Sum', dataFormat: 'Number', decimalPrecision: 0 },
  },
  {
    i: 'chart-1',
    x: 0,
    y: 2,
    w: 6,
    h: 5,
    type: 'bar',
    title: 'Revenue by Product',
    description: 'Total revenue by product line',
    config: { xAxis: 'Product', yAxis: 'Total amount', chartColor: '#3b82f6', showDataLabel: true },
  },
  {
    i: 'chart-line',
    x: 6,
    y: 2,
    w: 6,
    h: 5,
    type: 'line',
    title: 'Order Trend',
    description: 'Quantity orders over time',
    config: { xAxis: 'Created by', yAxis: 'Quantity', chartColor: '#10b981', showDataLabel: false },
  },
  {
    i: 'pie-1',
    x: 0,
    y: 7,
    w: 4,
    h: 5,
    type: 'pie',
    title: 'Sales by Status',
    description: 'Order distribution by status',
    config: { chartData: 'Status', showLegend: true },
  },
  {
    i: 'pie-2',
    x: 4,
    y: 7,
    w: 4,
    h: 5,
    type: 'pie',
    title: 'Team Performance',
    description: 'Orders by team member',
    config: { chartData: 'Created by', showLegend: true },
  },
  {
    i: 'table-1',
    x: 8,
    y: 7,
    w: 4,
    h: 5,
    type: 'table',
    title: 'Recent Orders',
    description: 'Latest 10 customer orders',
    config: {
      columns: ['Customer name', 'Product', 'Quantity', 'Total amount', 'Status'],
      sortBy: 'Order date',
      pagination: 10,
      applyFilter: false,
      filters: [],
      fontSize: 11,
      headerBackground: '#e5e7eb',
    },
  },
];

function loadLayout(): DashboardWidget[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_WIDGETS;
  } catch {
    return DEFAULT_WIDGETS;
  }
}

function saveLayout(widgets: DashboardWidget[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

function saveAsDefault(widgets: DashboardWidget[]) {
  localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(widgets));
}

function loadDefaultLayout(): DashboardWidget[] {
  try {
    const data = localStorage.getItem(DEFAULT_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_WIDGETS;
  } catch {
    return DEFAULT_WIDGETS;
  }
}

export function useDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(loadLayout);
  const [savedWidgets, setSavedWidgets] = useState<DashboardWidget[]>(loadLayout);
  const [defaultLayout] = useState<DashboardWidget[]>(loadDefaultLayout);

  const updateWidgets = useCallback((w: DashboardWidget[]) => {
    setWidgets(w);
  }, []);

  const addWidget = useCallback((widget: DashboardWidget) => {
    setWidgets(prev => [...prev, widget]);
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.i !== id));
  }, []);

  const updateWidget = useCallback((widget: DashboardWidget) => {
    setWidgets(prev => {
      const next = prev.map(w => w.i === widget.i ? widget : w);
      saveLayout(next);
      return next;
    });
  }, []);

  const commitConfiguration = useCallback(() => {
    saveLayout(widgets);
    setSavedWidgets([...widgets]);
  }, [widgets]);

  const resetToSaved = useCallback(() => {
    setWidgets([...savedWidgets]);
  }, [savedWidgets]);

  const resetToDefault = useCallback(() => {
    saveLayout(DEFAULT_WIDGETS);
    setWidgets([...DEFAULT_WIDGETS]);
    setSavedWidgets([...DEFAULT_WIDGETS]);
  }, []);

  const savePersonalLayout = useCallback(() => {
    saveLayout(widgets);
    setSavedWidgets([...widgets]);
  }, [widgets]);

  return { 
    widgets, 
    savedWidgets, 
    updateWidgets, 
    addWidget, 
    removeWidget, 
    updateWidget, 
    commitConfiguration, 
    resetToSaved,
    resetToDefault,
    savePersonalLayout,
    defaultLayout,
    isPersonalized: JSON.stringify(widgets) !== JSON.stringify(defaultLayout),
  };
}
