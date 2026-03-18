export const COUNTRIES = [
  'United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'
] as const;

export const PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet 500 Mbps',
  'VoIP Corporate Package',
] as const;

export const STATUSES = ['Pending', 'In progress', 'Completed'] as const;

export const CREATORS = [
  'Mr. Michael Harris',
  'Mr. Ryan Cooper',
  'Ms. Olivia Carter',
  'Mr. Lucas Martin',
] as const;

export interface Order {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: typeof COUNTRIES[number];
  };
  product: typeof PRODUCTS[number];
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: typeof STATUSES[number];
  createdBy: typeof CREATORS[number];
  createdAt: string;
}
