// App Configuration Constants

export const APP_CONFIG = {
  name: 'E-Commerce Admin',
  version: '1.0.0',
  description: 'Modern admin dashboard for e-commerce management',
} as const;

export const THEME = {
  colors: {
    offWhite: '#EAE7E2',
    charcoal: '#262930',
    accentRed: '#A00000',
    burntOrange: '#CC5500',
  },
} as const;

export const ROUTES = {
  dashboard: 'dashboard',
  products: 'products',
  capsules: 'capsules',
  featured: 'featured',
  orders: 'orders',
  analytics: 'analytics',
  settings: 'settings',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 3000;

export const ORDER_STATUS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
} as const;

export const PAYMENT_STATUS = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
} as const;

export const PRODUCT_STATUS = {
  active: 'Active',
  draft: 'Draft',
  outOfStock: 'Out of Stock',
} as const;
