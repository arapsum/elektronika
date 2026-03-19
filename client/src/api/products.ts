import { env } from "@/env";

async function fetchProducts() {
  const response = await fetch(`${env.PUBLIC_BASE_URL}/products`);
  if (!response.ok) {
    const errorResponse = await response.json();
    console.error(errorResponse);
    throw new Error(errorResponse.message || "Failed to fetch products");
  }
  const data = await response.json();
  return data;
}

async function fetchProduct(id: string) {
  const response = await fetch(`${env.PUBLIC_BASE_URL}/products/${id}`);
  const data = await response.json();
  return data;
}

export { fetchProducts, fetchProduct };
