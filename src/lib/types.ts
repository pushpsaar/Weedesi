export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface SizeStock {
  size: Size;
  stock: number;
}

export interface ProductVariant {
  color: string;
  colorHex: string;
  images: string[]; // paths under /products/...
  sizes: SizeStock[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  collection?: string;
  description: string;
  fabric?: string;
  washCare?: string;
  mrp: number;
  salePrice: number;
  variants: ProductVariant[];
  tags: string[]; // e.g. "new-arrival", "best-seller", "sale"
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  size: Size;
  qty: number;
  price: number;
}

export type OrderStatus = "pending" | "paid" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "created" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  subtotal: number;
  gst: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  payment: {
    status: PaymentStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    method?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  active: boolean;
  minOrderValue?: number;
}
