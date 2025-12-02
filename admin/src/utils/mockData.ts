// Mock data for the admin dashboard

export const mockAdminUser = {
  id: "user_admin_001",
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  role: "admin"
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  capsuleId: string;
  capsuleName: string;
  images: string[];
  stock: number;
  tags: string[];
  status: 'active' | 'draft' | 'outOfStock';
  isFeatured: boolean;
  createdAt: string;
}

export interface Capsule {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  productCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    capsuleName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  shippingAddress: string;
  createdAt: string;
}

export const mockCapsules: Capsule[] = [
  {
    id: "cap1",
    name: "Winter Capsule",
    description: "Cozy and stylish winter essentials",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop",
    productCount: 12,
    createdAt: "2024-09-15"
  },
  {
    id: "cap2",
    name: "Streetwear Capsule",
    description: "Urban fashion for the modern generation",
    coverImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop",
    productCount: 18,
    createdAt: "2024-08-20"
  },
  {
    id: "cap3",
    name: "Summer Essentials",
    description: "Light and breezy summer collection",
    coverImage: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=600&h=400&fit=crop",
    productCount: 15,
    createdAt: "2024-05-10"
  },
  {
    id: "cap4",
    name: "Formal Collection",
    description: "Professional attire for every occasion",
    coverImage: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600&h=400&fit=crop",
    productCount: 10,
    createdAt: "2024-07-05"
  }
];

export const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Classic Wool Coat",
    description: "Premium wool blend coat perfect for cold weather",
    price: 249.99,
    capsuleId: "cap1",
    capsuleName: "Winter Capsule",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop"
    ],
    stock: 45,
    tags: ["coat", "winter", "wool"],
    status: 'active',
    isFeatured: true,
    createdAt: "2024-09-20"
  },
  {
    id: "prod2",
    name: "Oversized Hoodie",
    description: "Comfortable streetwear hoodie with premium cotton",
    price: 89.99,
    capsuleId: "cap2",
    capsuleName: "Streetwear Capsule",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop"
    ],
    stock: 120,
    tags: ["hoodie", "streetwear", "casual"],
    status: 'active',
    isFeatured: true,
    createdAt: "2024-09-18"
  },
  {
    id: "prod3",
    name: "Cashmere Sweater",
    description: "Luxurious cashmere sweater for ultimate comfort",
    price: 189.99,
    capsuleId: "cap1",
    capsuleName: "Winter Capsule",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop"
    ],
    stock: 30,
    tags: ["sweater", "cashmere", "luxury"],
    status: 'active',
    isFeatured: false,
    createdAt: "2024-09-15"
  },
  {
    id: "prod4",
    name: "Linen Summer Shirt",
    description: "Breathable linen shirt for warm days",
    price: 69.99,
    capsuleId: "cap3",
    capsuleName: "Summer Essentials",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop"
    ],
    stock: 85,
    tags: ["shirt", "linen", "summer"],
    status: 'active',
    isFeatured: true,
    createdAt: "2024-05-12"
  },
  {
    id: "prod5",
    name: "Tailored Blazer",
    description: "Sharp tailored blazer for professional settings",
    price: 299.99,
    capsuleId: "cap4",
    capsuleName: "Formal Collection",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop"
    ],
    stock: 25,
    tags: ["blazer", "formal", "professional"],
    status: 'active',
    isFeatured: false,
    createdAt: "2024-07-08"
  },
  {
    id: "prod6",
    name: "Cargo Pants",
    description: "Modern cargo pants with utility pockets",
    price: 119.99,
    capsuleId: "cap2",
    capsuleName: "Streetwear Capsule",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop"
    ],
    stock: 0,
    tags: ["pants", "cargo", "streetwear"],
    status: 'outOfStock',
    isFeatured: false,
    createdAt: "2024-08-25"
  },
  {
    id: "prod7",
    name: "Graphic T-Shirt",
    description: "Bold graphic print on premium cotton tee",
    price: 45.99,
    capsuleId: "cap2",
    capsuleName: "Streetwear Capsule",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop"
    ],
    stock: 200,
    tags: ["tshirt", "graphic", "casual"],
    status: 'active',
    isFeatured: true,
    createdAt: "2024-08-22"
  },
  {
    id: "prod8",
    name: "Denim Jacket",
    description: "Classic denim jacket with vintage wash",
    price: 159.99,
    capsuleId: "cap2",
    capsuleName: "Streetwear Capsule",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop"
    ],
    stock: 60,
    tags: ["jacket", "denim", "classic"],
    status: 'active',
    isFeatured: false,
    createdAt: "2024-08-20"
  }
];

export const mockOrders: Order[] = [
  {
    id: "ord1",
    orderId: "ORD-2025-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@example.com",
    items: [
      {
        productId: "prod1",
        productName: "Classic Wool Coat",
        capsuleName: "Winter Capsule",
        quantity: 1,
        price: 249.99
      },
      {
        productId: "prod3",
        productName: "Cashmere Sweater",
        capsuleName: "Winter Capsule",
        quantity: 2,
        price: 189.99
      }
    ],
    totalAmount: 629.97,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: "123 Main St, New York, NY 10001",
    createdAt: "2025-10-08"
  },
  {
    id: "ord2",
    orderId: "ORD-2025-002",
    customerName: "Michael Chen",
    customerEmail: "m.chen@example.com",
    items: [
      {
        productId: "prod2",
        productName: "Oversized Hoodie",
        capsuleName: "Streetwear Capsule",
        quantity: 1,
        price: 89.99
      },
      {
        productId: "prod7",
        productName: "Graphic T-Shirt",
        capsuleName: "Streetwear Capsule",
        quantity: 3,
        price: 45.99
      }
    ],
    totalAmount: 227.96,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
    createdAt: "2025-10-10"
  },
  {
    id: "ord3",
    orderId: "ORD-2025-003",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@example.com",
    items: [
      {
        productId: "prod4",
        productName: "Linen Summer Shirt",
        capsuleName: "Summer Essentials",
        quantity: 2,
        price: 69.99
      }
    ],
    totalAmount: 139.98,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: "789 Pine Rd, Miami, FL 33101",
    createdAt: "2025-10-11"
  },
  {
    id: "ord4",
    orderId: "ORD-2025-004",
    customerName: "James Wilson",
    customerEmail: "j.wilson@example.com",
    items: [
      {
        productId: "prod5",
        productName: "Tailored Blazer",
        capsuleName: "Formal Collection",
        quantity: 1,
        price: 299.99
      }
    ],
    totalAmount: 299.99,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: "321 Elm St, Chicago, IL 60601",
    createdAt: "2025-10-12"
  },
  {
    id: "ord5",
    orderId: "ORD-2025-005",
    customerName: "Sophia Kim",
    customerEmail: "sophia.k@example.com",
    items: [
      {
        productId: "prod8",
        productName: "Denim Jacket",
        capsuleName: "Streetwear Capsule",
        quantity: 1,
        price: 159.99
      }
    ],
    totalAmount: 159.99,
    status: 'cancelled',
    paymentStatus: 'failed',
    shippingAddress: "555 Maple Dr, Seattle, WA 98101",
    createdAt: "2025-10-09"
  }
];

export const mockStats = {
  totalProducts: 47,
  totalCapsules: 4,
  totalOrders: 156,
  monthlyRevenue: 45680.00,
  totalRevenue: 234500.00,
  ordersGrowth: 18.5,
  revenueGrowth: 24.3
};

export const mockOrdersOverTime = [
  { month: "Apr", orders: 28, revenue: 8400 },
  { month: "May", orders: 35, revenue: 10500 },
  { month: "Jun", orders: 42, revenue: 14200 },
  { month: "Jul", orders: 38, revenue: 12800 },
  { month: "Aug", orders: 45, revenue: 16800 },
  { month: "Sep", orders: 52, revenue: 19200 },
  { month: "Oct", orders: 48, revenue: 18500 }
];

export const mockSalesByCapsule = [
  { name: "Streetwear", sales: 35400, orders: 82 },
  { name: "Winter", sales: 28900, orders: 56 },
  { name: "Summer", sales: 18200, orders: 45 },
  { name: "Formal", sales: 12100, orders: 23 }
];

export const mockTopProducts = [
  { name: "Oversized Hoodie", sales: 124, revenue: 11150.76 },
  { name: "Classic Wool Coat", sales: 89, revenue: 22249.11 },
  { name: "Graphic T-Shirt", sales: 167, revenue: 7679.33 },
  { name: "Linen Summer Shirt", sales: 98, revenue: 6859.02 },
  { name: "Denim Jacket", sales: 76, revenue: 12159.24 }
];
