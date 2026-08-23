"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type ProductsTable = Database["public"]["Tables"]["products"];
type ProductInsert = ProductsTable["Insert"];

export interface ProductFormState {
  error: string | null;
}

const BUCKET = "product-images";
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    throw new Error("No autorizado");
  }
  return supabase;
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugIsValid(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

interface ParsedProduct {
  values: Omit<ProductInsert, "id" | "image">;
}

function parseProductFields(
  formData: FormData
): { ok: true; data: ParsedProduct } | { ok: false; error: string } {
  const name = text(formData, "name");
  const description = text(formData, "description");
  const categoryId = text(formData, "category_id");
  const gradient = text(formData, "gradient");
  const priceRaw = text(formData, "price").replace(/[^\d]/g, "");
  const sortOrderRaw = text(formData, "sort_order");

  if (!name) return { ok: false, error: "El nombre es obligatorio." };
  if (!description) return { ok: false, error: "La descripción es obligatoria." };
  if (!categoryId) return { ok: false, error: "Selecciona una categoría." };
  if (!gradient) return { ok: false, error: "El gradiente es obligatorio." };

  const price = Number(priceRaw);
  if (!Number.isInteger(price) || price < 0) {
    return { ok: false, error: "El precio debe ser un número entero en COP." };
  }

  let sortOrder: number | undefined;
  if (sortOrderRaw !== "") {
    sortOrder = Number(sortOrderRaw);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      return { ok: false, error: "El orden debe ser un número entero positivo." };
    }
  }

  const tags = text(formData, "tags")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  let variants: unknown;
  const variantsRaw = text(formData, "variants") || "[]";
  try {
    variants = JSON.parse(variantsRaw);
  } catch {
    return { ok: false, error: "Las variantes no son JSON válido." };
  }
  if (!Array.isArray(variants)) {
    return { ok: false, error: 'Las variantes deben ser un arreglo JSON, p. ej. [{"id":"oro","name":"Oro","color":"Oro","hex":"#D4AF37"}].' };
  }
  for (const variant of variants) {
    const valid =
      typeof variant === "object" &&
      variant !== null &&
      ["id", "name", "color", "hex"].every(
        (key) =>
          key in (variant as Record<string, unknown>) &&
          typeof (variant as Record<string, unknown>)[key] === "string" &&
          ((variant as Record<string, unknown>)[key] as string).length > 0
      );
    if (!valid) {
      return {
        ok: false,
        error: 'Cada variante requiere {"id","name","color","hex"} como texto no vacío.',
      };
    }
  }

  return {
    ok: true,
    data: {
      values: {
        name,
        description,
        category_id: categoryId,
        price,
        gradient,
        tags,
        variants,
        sort_order: sortOrder,
      },
    },
  };
}

function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}

async function uploadImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  productId: string,
  file: File
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const ext = MIME_EXT[file.type];
  if (!ext) {
    return { ok: false, error: "Formato de imagen no permitido (usa JPG, PNG, WebP o AVIF)." };
  }
  const path = `products/${productId}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) {
    return { ok: false, error: `No se pudo subir la imagen: ${error.message}` };
  }
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  return { ok: true, url };
}

async function removeImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  imageUrl: string
): Promise<void> {
  const path = storagePathFromUrl(imageUrl);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]).catch(() => undefined);
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { error: "Sesión expirada o sin permisos. Vuelve a iniciar sesión." };
  }

  const parsed = parseProductFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const id = text(formData, "id");
  if (!slugIsValid(id)) {
    return {
      error:
        "El identificador debe ser un slug en minúsculas (letras, números y guiones), p. ej. coral.",
    };
  }

  const file = formData.get("image");
  let imageUrl: string | null = null;
  if (file instanceof File && file.size > 0) {
    const upload = await uploadImage(supabase, id, file);
    if (!upload.ok) return { error: upload.error };
    imageUrl = upload.url;
  } else {
    return { error: "Sube una imagen para el producto." };
  }

  let sortOrder = parsed.data.values.sort_order;
  if (sortOrder === undefined) {
    const { data } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    sortOrder = (data?.[0]?.sort_order ?? 0) + 1;
  }

  const { error: insertError } = await supabase.from("products").insert({
    ...parsed.data.values,
    id,
    image: imageUrl,
    is_active: formData.get("is_active") === "on",
    sort_order: sortOrder,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: `Ya existe un producto con el identificador "${id}".` };
    }
    return { error: `No se pudo crear el producto: ${insertError.message}` };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { error: "Sesión expirada o sin permisos. Vuelve a iniciar sesión." };
  }

  const id = text(formData, "id");
  if (!id) return { error: "Falta el identificador del producto." };

  const parsed = parseProductFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const { data: current } = await supabase
    .from("products")
    .select("image")
    .eq("id", id)
    .single();

  let imageUrl = current?.image ?? null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const upload = await uploadImage(supabase, id, file);
    if (!upload.ok) return { error: upload.error };
    imageUrl = upload.url;
    if (current?.image && current.image !== imageUrl) {
      await removeImage(supabase, current.image);
    }
  }
  if (!imageUrl) {
    return { error: "Sube una imagen para el producto." };
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      ...parsed.data.values,
      image: imageUrl,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  if (updateError) {
    return { error: `No se pudo actualizar el producto: ${updateError.message}` };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function toggleProductActive(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const active = text(formData, "active") === "true";
  if (!id) return;

  await supabase.from("products").update({ is_active: !active }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const { data: current } = await supabase
    .from("products")
    .select("image")
    .eq("id", id)
    .single();

  if (current?.image) {
    await removeImage(supabase, current.image);
  }

  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}
