export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Card {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  isActive: boolean;
}

export interface Order {
  _id: string;
  user: User;
  card: Card;
  quantity: number;
  customPrice: number;
  customText?: string;
  totalAmount: number;
  advanceAmount?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  phone: string;
  serviceType?: 'wedding-cards' | 'billbooks' | 'visiting-cards' | 'rubber-stamps' | 'bookbinding';
  createdAt: string;
}