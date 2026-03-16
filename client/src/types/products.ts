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

type LaptopAttributes = {
  memory: string;
  storage: string;
  colour: string;
  colourHex: string;
};

type CategoryAttributes = {
  laptop: LaptopAttributes;
};

type ProductOption<c extends keyof CategoryAttributes> = {
  id: string;
  sku: string;
  price: string;
  quantity: number;
  attributes: CategoryAttributes[c];
};

type CategoryTree = {
  id: string;
  name: string;
  parent_id: string | null;
  slug: string;
  depth: number;
};

type Product<c extends keyof CategoryAttributes> = {
  id: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  model: string;
  summary: string;
  description?: string;
  specifications?: ProductSpecification;
  images: ProductGallery[];
  options: ProductOption<c>[];
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
