"use client";

import { useOptimistic } from "react";
import { useActionState } from "react";
import { createProductAction } from "@/lib/actions/product";
import { productSchema } from "@/lib/schemas";

export function ProductForm({
  existingProducts = [],
}: {
  existingProducts?: any[];
}) {
  // 1. Optimistic State
  const [optimisticProducts, addOptimisticProduct] = useOptimistic(
    existingProducts,
    (state: any[], newProduct: any) => [
      ...state,
      { ...newProduct, id: "temp-id", pending: true },
    ],
  );

  // 2. Action State dengan Validasi Klien
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const rawData = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        unit: formData.get("unit") as string,
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        minStock: Number(formData.get("minStock")),
      };

      // Validasi menggunakan Zod schema bersama
      const validation = productSchema.safeParse(rawData);
      if (!validation.success) {
        return {
          success: false,
          validationErrors: validation.error.flatten().fieldErrors,
        };
      }

      // Update UI secara instan (Optimistic)
      addOptimisticProduct(rawData);

      // Kirim ke Server Action
      const result = await createProductAction(rawData);
      return result;
    },
    null as any,
  );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg text-black">
      <h2 className="text-xl font-bold mb-4">Tambah Produk Baru</h2>

      {state?.serverError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {state.serverError}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Produk
          </label>
          <input
            name="name"
            className="border p-2 w-full rounded mt-1"
            placeholder="Contoh: Kabel HDMI"
          />
          {state?.validationErrors?.name && (
            <p className="text-red-500 text-xs mt-1">
              {state.validationErrors.name[0]}
            </p>
          )}
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <input
            name="category"
            className="border p-2 w-full rounded mt-1"
            placeholder="Contoh: Aksesoris"
          />
          {state?.validationErrors?.category && (
            <p className="text-red-500 text-xs mt-1">
              {state.validationErrors.category[0]}
            </p>
          )}
        </div>

        {/* Satuan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Satuan
          </label>
          <input
            name="unit"
            className="border p-2 w-full rounded mt-1"
            placeholder="Contoh: Pcs, Kg, Dus"
          />
          {state?.validationErrors?.unit && (
            <p className="text-red-500 text-xs mt-1">
              {state.validationErrors.unit[0]}
            </p>
          )}
        </div>

        {/* Harga */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Harga per Unit (Rp)
          </label>
          <input
            name="price"
            type="number"
            className="border p-2 w-full rounded mt-1"
            placeholder="0"
          />
          {state?.validationErrors?.price && (
            <p className="text-red-500 text-xs mt-1">
              {state.validationErrors.price[0]}
            </p>
          )}
        </div>

        {/* Stok */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stok Saat Ini
          </label>
          <input
            name="stock"
            type="number"
            className="border p-2 w-full rounded mt-1"
            placeholder="0"
          />
          {state?.validationErrors?.stock && (
            <p className="text-red-500 text-xs mt-1">
              {state.validationErrors.stock[0]}
            </p>
          )}
        </div>

        {/* Stok Minimum */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stok Minimum
          </label>
          <input
            name="minStock"
            type="number"
            className="border p-2 w-full rounded mt-1"
            placeholder="0"
          />
          {state?.validationErrors?.minStock && (
            <p className="text-red-500 text-xs mt-1">
              {state.validationErrors.minStock[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isPending ? "Menyimpan..." : "Tambah Produk"}
        </button>
      </form>
    </div>
  );
}
