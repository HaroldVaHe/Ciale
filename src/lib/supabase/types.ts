export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface ProductVariantRow {
  id: string;
  name: string;
  color: string;
  hex: string;
}

export interface Category {
  Row: {
    id: string;
    label: string;
    sort_order: number;
    created_at: string;
  };
  Insert: {
    id: string;
    label: string;
    sort_order?: number;
    created_at?: string;
  };
  Update: Partial<Category["Insert"]>;
}

export interface Product {
  Row: {
    id: string;
    category_id: string | null;
    name: string;
    description: string;
    price: number;
    image: string;
    gradient: string;
    tags: string[];
    variants: Json;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id: string;
    category_id?: string | null;
    name: string;
    description?: string;
    price: number;
    image?: string;
    gradient?: string;
    tags?: string[];
    variants?: Json;
    sort_order?: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<Product["Insert"]>;
}

export interface Order {
  Row: {
    id: string;
    status: "nuevo" | "confirmado" | "enviado" | "entregado" | "cancelado";
    customer_name: string | null;
    customer_phone: string | null;
    delivery_address: string | null;
    notes: string | null;
    total: number;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    status?: Order["Row"]["status"];
    customer_name?: string | null;
    customer_phone?: string | null;
    delivery_address?: string | null;
    notes?: string | null;
    total?: number;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<Order["Insert"]>;
}

export interface OrderItem {
  Row: {
    id: string;
    order_id: string;
    product_slug: string | null;
    product_name: string;
    variant_name: string | null;
    quantity: number;
    unit_price: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    order_id: string;
    product_slug?: string | null;
    product_name: string;
    variant_name?: string | null;
    quantity: number;
    unit_price: number;
    created_at?: string;
  };
  Update: Partial<OrderItem["Insert"]>;
}

export interface ProductReview {
  Row: {
    id: string;
    product_id: string;
    author_name: string;
    rating: number;
    comment: string | null;
    is_published: boolean;
    created_at: string;
  };
  Insert: {
    id?: string;
    product_id: string;
    author_name: string;
    rating: number;
    comment?: string | null;
    is_published?: boolean;
    created_at?: string;
  };
  Update: Partial<ProductReview["Insert"]>;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category["Row"];
        Insert: Category["Insert"];
        Update: Category["Update"];
        Relationships: [];
      };
      products: {
        Row: Product["Row"];
        Insert: Product["Insert"];
        Update: Product["Update"];
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: Order["Row"];
        Insert: Order["Insert"];
        Update: Order["Update"];
        Relationships: [];
      };
      order_items: {
        Row: OrderItem["Row"];
        Insert: OrderItem["Insert"];
        Update: OrderItem["Update"];
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      product_reviews: {
        Row: ProductReview["Row"];
        Insert: ProductReview["Insert"];
        Update: ProductReview["Update"];
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
