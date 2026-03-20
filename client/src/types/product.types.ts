import { Decimal } from "decimal.js";

type SpecificationEntry<T extends keyof CategoryAttributes> = {
  value: string;
  isKeySpec?: boolean;
  icon?: string;
  derivedFromAttribute?: keyof CategoryAttributes[T];
};

type ProductSpecification<T extends keyof CategoryAttributes> = Record<
  string,
  Record<string, SpecificationEntry<T>>
>;

type ProductGallery = {
  link: string;
  alt: string;
  order: number;
};

type LaptopAttributes = {
  memory: string;
  storage: string;
  processor: string;
  colour: string;
  colourhex: string;
};

type CategoryAttributes = {
  laptop: LaptopAttributes;
};

type ProductOption<C extends keyof CategoryAttributes> = {
  id: string;
  sku: string;
  price: Decimal;
  quantity: number;
  discount: number;
  attributes: CategoryAttributes[C];
};

type CategoryTree = {
  id: string;
  name: string;
  parent_id: string | null;
  slug: string;
  depth: number;
};

type Product<C extends keyof CategoryAttributes> = {
  id: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  model: string;
  summary: string;
  description?: string;
  specifications?: ProductSpecification<C>;
  images: ProductGallery[];
  options: ProductOption<C>[];
  categoryTree: CategoryTree[];
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

type ProductListResponse<c extends keyof CategoryAttributes> = {
  data: Product<c>[];
  pagination: Pagination;
};

export type {
  Product,
  ProductListResponse,
  ProductGallery,
  ProductSpecification,
  ProductOption,
  SpecificationEntry,
  CategoryTree,
  CategoryAttributes,
  LaptopAttributes,
};
