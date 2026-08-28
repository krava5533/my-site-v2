import { getProducts } from "@/lib/store/products";
import FavoritesClient from "@/components/FavoritesClient";

export default async function FavoritesPage() {
  const products = await getProducts();
  return <FavoritesClient products={products} />;
}
