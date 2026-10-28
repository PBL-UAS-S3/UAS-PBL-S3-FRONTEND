"use server";

import { productSchema } from "@/lib/schemas";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

export const createProductAction = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput }) => {
    const { name, category, unit, price, stock, minStock } = parsedInput;

    // Logika simpan ke database Stockin kamu
    console.log("Menyimpan produk:", { name, category, unit, price, stock, minStock });

    revalidatePath("/dashboard/master-data");
    return { success: true, message: "Produk berhasil ditambahkan ke gudang!" };
  });