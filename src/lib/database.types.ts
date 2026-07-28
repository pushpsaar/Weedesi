export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          hash: string
          id: string
          salt: string
          username: string
        }
        Insert: {
          hash: string
          id: string
          salt: string
          username: string
        }
        Update: {
          hash?: string
          id?: string
          salt?: string
          username?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          min_order_value: number | null
          type: string
          value: number
        }
        Insert: {
          active: boolean
          code: string
          min_order_value?: number | null
          type: string
          value: number
        }
        Update: {
          active?: boolean
          code?: string
          min_order_value?: number | null
          type?: string
          value?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string
          customer: Json
          discount: number
          gst: number
          id: string
          items: Json
          payment: Json
          shipping: number
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at: string
          customer: Json
          discount: number
          gst: number
          id: string
          items: Json
          payment: Json
          shipping: number
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          customer?: Json
          discount?: number
          gst?: number
          id?: string
          items?: Json
          payment?: Json
          shipping?: number
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          collection: string | null
          created_at: string
          description: string
          fabric: string | null
          id: string
          is_active: boolean
          mrp: number
          name: string
          sale_price: number
          sku: string
          slug: string
          tags: string[]
          variants: Json
          wash_care: string | null
        }
        Insert: {
          category: string
          collection?: string | null
          created_at: string
          description: string
          fabric?: string | null
          id: string
          is_active: boolean
          mrp: number
          name: string
          sale_price: number
          sku: string
          slug: string
          tags: string[]
          variants: Json
          wash_care?: string | null
        }
        Update: {
          category?: string
          collection?: string | null
          created_at?: string
          description?: string
          fabric?: string | null
          id?: string
          is_active?: boolean
          mrp?: number
          name?: string
          sale_price?: number
          sku?: string
          slug?: string
          tags?: string[]
          variants?: Json
          wash_care?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          id: string
        }
        Insert: {
          content: Json
          id: string
        }
        Update: {
          content?: Json
          id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_blocked: boolean
          last_login_at: string | null
          name: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at: string
          email: string
          id: string
          is_blocked?: boolean
          last_login_at?: string | null
          name: string
          password_hash: string
          updated_at: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_blocked?: boolean
          last_login_at?: string | null
          name?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
