import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, { message: "Nama produk minimal 3 karakter" }),
  category: z.string().min(1, { message: "Kategori wajib diisi" }),
  unit: z.string().min(1, { message: "Satuan wajib diisi" }),
  price: z.coerce.number().positive({ message: "Harga harus lebih dari 0" }),
  stock: z.coerce.number().gt(0, { message: "Stok wajib lebih dari 0" }),       // Mengubah min(0) jadi gt(0)
  minStock: z.coerce.number().gt(0, { message: "Stok minimum wajib lebih dari 0" }), // Mengubah min(0) jadi gt(0)
});

export type ProductInput = z.infer<typeof productSchema>;