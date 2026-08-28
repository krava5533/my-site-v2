import { getProducts } from "@/lib/store/products";
import { getCollections } from "@/lib/store/collections";
import ProductsManager from "@/components/ProductsManager";

export default async function AdminProductsPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Products</h1>
      <p className="text-sm text-warmgray mb-8 max-w-xl">
        Products you add here appear immediately in the catalog at /products and on the homepage.
      </p>
      <ProductsManager initial={products} collections={collections} />
    </div>
  );
}
