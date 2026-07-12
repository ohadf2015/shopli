export interface Product {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  originalPrice?: number;
  imageUrl: string;
  affiliateLink: string;
  commissionRate: number;
  rating: number;
  reviewCount: number;
  volume: number;
  tags: string[];
  category: string;
  region: string;
  isHot: boolean;
  discount?: string;
  shopName?: string;
  freeShipping: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  productCount: number;
  regions: string[];
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}