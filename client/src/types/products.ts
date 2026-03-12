type SpecificationEntry = {
  value: string;
  isKeySpec?: boolean;
  icon?: string;
  deriveFromAttribute?: string;
};

type ProductSpecification = Record<string, Record<string, SpecificationEntry>>;

type ProductGallery = {
  link: string;
  alt: string;
  order: number;
};

type ProductOption = {
  sku: string;
  price: string;
  quantity: number;
  attributes: Record<string, string>;
};

type Product = {
  id: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  model: string;
  description?: string;
  specifications?: ProductSpecification;
  images: ProductGallery[];
  options: ProductOption[];
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type ProductListResponse = {
  data: Product[];
  pagination: Pagination;
};

export type {
  Product,
  ProductListResponse,
  ProductGallery,
  ProductSpecification,
  ProductOption,
  SpecificationEntry,
};
