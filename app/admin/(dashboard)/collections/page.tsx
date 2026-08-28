import { getCollections } from "@/lib/store/collections";
import CollectionsManager from "@/components/CollectionsManager";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Collections</h1>
      <p className="text-sm text-warmgray mb-8 max-w-xl">
        Collections you add here appear at /collections and can be linked to products.
      </p>
      <CollectionsManager initial={collections} />
    </div>
  );
}
