export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string | null
          product_id: number
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          product_id: number
          quantity: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          product_id?: number
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          price_at_purchase: number
          product_id: number
          quantity: number
          status: string
        }
        Insert: {
          id?: number
          order_id: number
          price_at_purchase: number
          product_id: number
          quantity: number
          status?: string
        }
        Update: {
          id?: number
          order_id?: number
          price_at_purchase?: number
          product_id?: number
          quantity?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: number
          status: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: string
          total: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: string
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          id: number
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          id?: number
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          id?: number
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          categories: string[] | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          name: string
          price: number
          sale_price: number | null
          stock: number
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          price: number
          sale_price?: number | null
          stock: number
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          sale_price?: number | null
          stock?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string | null
          email: string | null
          id: string
          is_admin: boolean | null
          is_suspended: boolean | null
          name: string | null
          phone: string | null
        }
        Insert: {
          country?: string | null
          email?: string | null
          id: string
          is_admin?: boolean | null
          is_suspended?: boolean | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          country?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean | null
          is_suspended?: boolean | null
          name?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          cta_link: string | null
          cta_text: string | null
          description: string | null
          discount_percentage: number | null
          id: number
          image_url: string | null
          is_active: boolean | null
          target_category: string | null
          title: string
        }
        Insert: {
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          target_category?: string | null
          title: string
        }
        Update: {
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          target_category?: string | null
          title?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          id: number
          product_id: number
          rating: number
          review_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          product_id: number
          rating: number
          review_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          product_id?: number
          rating?: number
          review_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          description: string | null
          icon_name: string | null
          id: number
          is_active: boolean | null
          title: string
        }
        Insert: {
          description?: string | null
          icon_name?: string | null
          id?: number
          is_active?: boolean | null
          title: string
        }
        Update: {
          description?: string | null
          icon_name?: string | null
          id?: number
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          about_story_content: string | null
          about_story_image_url: string | null
          about_story_title: string | null
          about_subtitle: string | null
          about_team_title: string | null
          about_title: string | null
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_subtitle: string | null
          contact_title: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: number
          sales_banner_end_date: string | null
          sales_banner_is_active: boolean | null
          sales_banner_subtitle: string | null
          sales_banner_title: string | null
          services_subtitle: string | null
          services_title: string | null
          site_name: string | null
          social_instagram: string | null
          social_tiktok: string | null
          theme_accent: string | null
          theme_primary: string | null
          theme_secondary: string | null
        }
        Insert: {
          about_story_content?: string | null
          about_story_image_url?: string | null
          about_story_title?: string | null
          about_subtitle?: string | null
          about_team_title?: string | null
          about_title?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_subtitle?: string | null
          contact_title?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: number
          sales_banner_end_date?: string | null
          sales_banner_is_active?: boolean | null
          sales_banner_subtitle?: string | null
          sales_banner_title?: string | null
          services_subtitle?: string | null
          services_title?: string | null
          site_name?: string | null
          social_instagram?: string | null
          social_tiktok?: string | null
          theme_accent?: string | null
          theme_primary?: string | null
          theme_secondary?: string | null
        }
        Update: {
          about_story_content?: string | null
          about_story_image_url?: string | null
          about_story_title?: string | null
          about_subtitle?: string | null
          about_team_title?: string | null
          about_title?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_subtitle?: string | null
          contact_title?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: number
          sales_banner_end_date?: string | null
          sales_banner_is_active?: boolean | null
          sales_banner_subtitle?: string | null
          sales_banner_title?: string | null
          services_subtitle?: string | null
          services_title?: string | null
          site_name?: string | null
          social_instagram?: string | null
          social_tiktok?: string | null
          theme_accent?: string | null
          theme_primary?: string | null
          theme_secondary?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: number
          image_url: string | null
          name: string | null
          title: string | null
        }
        Insert: {
          id?: number
          image_url?: string | null
          name?: string | null
          title?: string | null
        }
        Update: {
          id?: number
          image_url?: string | null
          name?: string | null
          title?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string | null
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          aud: string
          role: string
          email: string
          encrypted_password: string
          email_confirmed_at: string
          invited_at: string
          confirmation_token: string
          confirmation_sent_at: string
          recovery_token: string
          recovery_sent_at: string
          last_sign_in_at: string
          raw_app_meta_data: Json
          raw_user_meta_data: Json
          created_at: string
          updated_at: string
          phone: string
          phone_confirmed_at: string
          email_change: string
          email_change_token_new: string
          email_change_token_current: string
          email_change_sent_at: string
        }
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// Custom App-Specific Types using generated types for clarity

export type Product = Tables<'products'>;
export type Profile = Tables<'profiles'>;
export type Promotion = Tables<'promotions'>;
export type Category = Tables<'categories'>;
export type TeamMember = Tables<'team_members'>;
export type Review = Tables<'reviews'>;
export type Service = Tables<'services'>;
export type Page = Tables<'pages'>;

// CartItem is a product with a quantity property, derived from cart_items table
export interface CartItem extends Product {
  quantity: number;
}

// OrderItem combines product details with order specifics
export type OrderItem = Tables<'order_items'> & { products: Product | null };

// Order includes related items and user info
export interface Order extends Tables<'orders'> {
    items: OrderItem[];
    profiles: Profile | null;
}

export interface SiteContent extends Tables<'site_content'> {
    team_members: TeamMember[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export enum AdminTab {
  PRODUCTS = 'Products',
  CATEGORIES = 'Categories',
  USERS = 'Users',
  ORDERS = 'Orders',
  ANALYTICS = 'Analytics',
  SITE_CONTENT = 'Site Content',
  PROMOTIONS = 'Promotions',
  SERVICES = 'Services',
  PAGES = 'Pages',
}
