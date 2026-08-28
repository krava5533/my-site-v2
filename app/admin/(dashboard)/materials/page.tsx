import { getMaterials } from "@/lib/store/materials";
import MaterialsManager from "@/components/MaterialsManager";

export default async function AdminMaterialsPage() {
  const materials = await getMaterials();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Materials</h1>
      <p className="text-sm text-warmgray mb-8 max-w-xl">
        Material pages you add here appear at /materials and are linked from matching products.
      </p>
      <MaterialsManager initial={materials} />
    </div>
  );
}
