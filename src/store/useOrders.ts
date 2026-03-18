import { useState, useCallback } from 'react';
import { Order } from '@/types/order';

const STORAGE_KEY = 'dashboard-orders';

const DEFAULT_ORDERS: Order[] = [
  { id: 'ORD001', customer: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+1-234-567-8901', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'United States' }, product: 'Fiber Internet 300 Mbps', quantity: 1, unitPrice: 49.99, totalAmount: 49.99, status: 'Completed', createdBy: 'Mr. Michael Harris', createdAt: new Date(2024, 2, 1).toISOString() },
  { id: 'ORD002', customer: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '+1-234-567-8902', address: '456 Oak Ave', city: 'Boston', state: 'MA', zip: '02101', country: 'United States' }, product: '5G Unlimited Mobile Plan', quantity: 2, unitPrice: 79.99, totalAmount: 159.98, status: 'In progress', createdBy: 'Ms. Olivia Carter', createdAt: new Date(2024, 2, 2).toISOString() },
  { id: 'ORD003', customer: { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '+1-234-567-8903', address: '789 Pine Rd', city: 'Chicago', state: 'IL', zip: '60601', country: 'United States' }, product: 'Fiber Internet 1 Gbps', quantity: 1, unitPrice: 119.99, totalAmount: 119.99, status: 'Pending', createdBy: 'Mr. Ryan Cooper', createdAt: new Date(2024, 2, 3).toISOString() },
  { id: 'ORD004', customer: { firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', phone: '+1-234-567-8904', address: '321 Elm Way', city: 'Seattle', state: 'WA', zip: '98101', country: 'United States' }, product: 'Business Internet 500 Mbps', quantity: 1, unitPrice: 89.99, totalAmount: 89.99, status: 'Completed', createdBy: 'Mr. Lucas Martin', createdAt: new Date(2024, 2, 4).toISOString() },
  { id: 'ORD005', customer: { firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', phone: '+1-234-567-8905', address: '654 Birch Ln', city: 'Miami', state: 'FL', zip: '33101', country: 'United States' }, product: 'VoIP Corporate Package', quantity: 3, unitPrice: 39.99, totalAmount: 119.97, status: 'Completed', createdBy: 'Ms. Olivia Carter', createdAt: new Date(2024, 2, 5).toISOString() },
  { id: 'ORD006', customer: { firstName: 'Diana', lastName: 'Wilson', email: 'diana@example.com', phone: '+1-234-567-8906', address: '987 Cedar St', city: 'Denver', state: 'CO', zip: '80201', country: 'United States' }, product: 'Fiber Internet 300 Mbps', quantity: 2, unitPrice: 49.99, totalAmount: 99.98, status: 'In progress', createdBy: 'Mr. Michael Harris', createdAt: new Date(2024, 2, 6).toISOString() },
  { id: 'ORD007', customer: { firstName: 'Eve', lastName: 'Martinez', email: 'eve@example.com', phone: '+1-234-567-8907', address: '147 Spruce Dr', city: 'Austin', state: 'TX', zip: '73301', country: 'United States' }, product: '5G Unlimited Mobile Plan', quantity: 1, unitPrice: 79.99, totalAmount: 79.99, status: 'Pending', createdBy: 'Mr. Ryan Cooper', createdAt: new Date(2024, 2, 7).toISOString() },
  { id: 'ORD008', customer: { firstName: 'Frank', lastName: 'Garcia', email: 'frank@example.com', phone: '+1-234-567-8908', address: '258 Maple Ave', city: 'Portland', state: 'OR', zip: '97201', country: 'United States' }, product: 'Fiber Internet 1 Gbps', quantity: 1, unitPrice: 119.99, totalAmount: 119.99, status: 'Completed', createdBy: 'Mr. Lucas Martin', createdAt: new Date(2024, 2, 8).toISOString() },
  { id: 'ORD009', customer: { firstName: 'Grace', lastName: 'Lee', email: 'grace@example.com', phone: '+1-234-567-8909', address: '369 Walnut Blvd', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'United States' }, product: 'Business Internet 500 Mbps', quantity: 1, unitPrice: 89.99, totalAmount: 89.99, status: 'In progress', createdBy: 'Ms. Olivia Carter', createdAt: new Date(2024, 2, 9).toISOString() },
  { id: 'ORD010', customer: { firstName: 'Henry', lastName: 'Taylor', email: 'henry@example.com', phone: '+1-234-567-8910', address: '741 Ash Lane', city: 'Houston', state: 'TX', zip: '77001', country: 'United States' }, product: 'VoIP Corporate Package', quantity: 2, unitPrice: 39.99, totalAmount: 79.98, status: 'Completed', createdBy: 'Mr. Michael Harris', createdAt: new Date(2024, 2, 10).toISOString() },
  { id: 'ORD011', customer: { firstName: 'Iris', lastName: 'Anderson', email: 'iris@example.com', phone: '+1-234-567-8911', address: '852 Oak Street', city: 'Philadelphia', state: 'PA', zip: '19101', country: 'United States' }, product: 'Fiber Internet 300 Mbps', quantity: 1, unitPrice: 49.99, totalAmount: 49.99, status: 'Pending', createdBy: 'Mr. Ryan Cooper', createdAt: new Date(2024, 2, 11).toISOString() },
  { id: 'ORD012', customer: { firstName: 'Jack', lastName: 'White', email: 'jack@example.com', phone: '+1-234-567-8912', address: '963 Pine Road', city: 'San Antonio', state: 'TX', zip: '78201', country: 'United States' }, product: '5G Unlimited Mobile Plan', quantity: 1, unitPrice: 79.99, totalAmount: 79.99, status: 'In progress', createdBy: 'Mr. Lucas Martin', createdAt: new Date(2024, 2, 12).toISOString() },
  { id: 'ORD013', customer: { firstName: 'Karen', lastName: 'Harris', email: 'karen@example.com', phone: '+1-234-567-8913', address: '123 Birch Ave', city: 'San Diego', state: 'CA', zip: '92101', country: 'United States' }, product: 'Fiber Internet 1 Gbps', quantity: 2, unitPrice: 119.99, totalAmount: 239.98, status: 'Completed', createdBy: 'Ms. Olivia Carter', createdAt: new Date(2024, 2, 13).toISOString() },
  { id: 'ORD014', customer: { firstName: 'Leo', lastName: 'Thomas', email: 'leo@example.com', phone: '+1-234-567-8914', address: '456 Elm Street', city: 'Dallas', state: 'TX', zip: '75201', country: 'United States' }, product: 'Business Internet 500 Mbps', quantity: 1, unitPrice: 89.99, totalAmount: 89.99, status: 'Pending', createdBy: 'Mr. Michael Harris', createdAt: new Date(2024, 2, 14).toISOString() },
  { id: 'ORD015', customer: { firstName: 'Mia', lastName: 'Jackson', email: 'mia@example.com', phone: '+1-234-567-8915', address: '789 Cedar Lane', city: 'San Jose', state: 'CA', zip: '95101', country: 'United States' }, product: 'VoIP Corporate Package', quantity: 1, unitPrice: 39.99, totalAmount: 39.99, status: 'In progress', createdBy: 'Mr. Ryan Cooper', createdAt: new Date(2024, 2, 15).toISOString() },
  { id: 'ORD016', customer: { firstName: 'Oscar', lastName: 'Rodriguez', email: 'oscar@example.com', phone: '+1-234-567-8916', address: '147 Walnut St', city: 'Austin', state: 'TX', zip: '73301', country: 'United States' }, product: 'Fiber Internet 300 Mbps', quantity: 1, unitPrice: 49.99, totalAmount: 49.99, status: 'Completed', createdBy: 'Mr. Lucas Martin', createdAt: new Date(2024, 2, 16).toISOString() },
  { id: 'ORD017', customer: { firstName: 'Patricia', lastName: 'Lee', email: 'patricia@example.com', phone: '+1-234-567-8917', address: '258 Birch Ln', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'United States' }, product: '5G Unlimited Mobile Plan', quantity: 3, unitPrice: 79.99, totalAmount: 239.97, status: 'In progress', createdBy: 'Ms. Olivia Carter', createdAt: new Date(2024, 2, 17).toISOString() },
  { id: 'ORD018', customer: { firstName: 'Quinn', lastName: 'Smith', email: 'quinn@example.com', phone: '+1-234-567-8918', address: '369 Cedar Ave', city: 'New York', state: 'NY', zip: '10001', country: 'United States' }, product: 'Business Internet 500 Mbps', quantity: 2, unitPrice: 89.99, totalAmount: 179.98, status: 'Completed', createdBy: 'Mr. Michael Harris', createdAt: new Date(2024, 2, 18).toISOString() },
  { id: 'ORD019', customer: { firstName: 'Rachel', lastName: 'Brown', email: 'rachel@example.com', phone: '+1-234-567-8919', address: '741 Oak Blvd', city: 'Chicago', state: 'IL', zip: '60601', country: 'United States' }, product: 'Fiber Internet 1 Gbps', quantity: 1, unitPrice: 119.99, totalAmount: 119.99, status: 'Pending', createdBy: 'Mr. Ryan Cooper', createdAt: new Date(2024, 2, 19).toISOString() },
  { id: 'ORD020', customer: { firstName: 'Samuel', lastName: 'Jones', email: 'samuel@example.com', phone: '+1-234-567-8920', address: '852 Spruce Dr', city: 'Boston', state: 'MA', zip: '02101', country: 'United States' }, product: 'VoIP Corporate Package', quantity: 2, unitPrice: 39.99, totalAmount: 79.98, status: 'In progress', createdBy: 'Mr. Lucas Martin', createdAt: new Date(2024, 2, 20).toISOString() },
];

function loadOrders(): Order[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_ORDERS;
  } catch {
    return DEFAULT_ORDERS;
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const next = [...prev, order];
      saveOrders(next);
      return next;
    });
  }, []);

  const updateOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === order.id ? order : o);
      saveOrders(next);
      return next;
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => {
      const next = prev.filter(o => o.id !== id);
      saveOrders(next);
      return next;
    });
  }, []);

  return { orders, addOrder, updateOrder, deleteOrder };
}
