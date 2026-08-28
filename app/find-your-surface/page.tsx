import { getProducts } from "@/lib/store/products";
import FindYourSurfaceClient from "@/components/FindYourSurfaceClient";

export default async function FindYourSurfacePage() {
  const products = await getProducts();
  return <FindYourSurfaceClient products={products} />;
}
