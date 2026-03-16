import { env } from "@/env";
import type { ProductListResponse, Product } from "@/types/product.types";

async function fetchProducts() {
  const response = await fetch(`${env.PUBLIC_BASE_URL}/products`);
  const data = (await response.json()) as ProductListResponse;
  return data;
}

async function fetchProduct(id: string) {
  const response = await fetch(`${env.PUBLIC_BASE_URL}/products/${id}`);
  const data = (await response.json()) as Product;
  return data;
}

export { fetchProducts, fetchProduct };
