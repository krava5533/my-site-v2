import { getProducts } from "@/lib/store/products";
import CompareClient from "@/components/CompareClient";

export default async function ComparePage() {
  const products = await getProducts();
  return <CompareClient products={products} />;
}
