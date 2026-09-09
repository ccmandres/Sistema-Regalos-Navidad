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
      audit_logs: {
        Row: {
          accion: string
          datos_nuevos: Json | null
          datos_previos: Json | null
          id: string
          tabla_afectada: string
          timestamp: string | null
          usuario_id: string | null
        }
        Insert: {
          accion: string
          datos_nuevos?: Json | null
          datos_previos?: Json | null
          id?: string
          tabla_afectada: string
          timestamp?: string | null
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          datos_nuevos?: Json | null
          datos_previos?: Json | null
          id?: string
          tabla_afectada?: string
          timestamp?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      beneficiarios: {
        Row: {
          apellidos: string
          created_at: string | null
          created_by: string | null
          edad: number
          estado: string | null
          fecha_nacimiento: string
          id: string
          nombre_adulto_responsable: string
          nombres: string
          rango_etario: string | null
          rut_adulto_responsable: string
          rut_menor: string
          sexo: string | null
          territorio_id: string | null
        }
        Insert: {
          apellidos: string
          created_at?: string | null
          created_by?: string | null
          edad: number
          estado?: string | null
          fecha_nacimiento: string
          id?: string
          nombre_adulto_responsable: string
          nombres: string
          rango_etario?: string | null
          rut_adulto_responsable: string
          rut_menor: string
          sexo?: string | null
          territorio_id?: string | null
        }
        Update: {
          apellidos?: string
          created_at?: string | null
          created_by?: string | null
          edad?: number
          estado?: string | null
          fecha_nacimiento?: string
          id?: string
          nombre_adulto_responsable?: string
          nombres?: string
          rango_etario?: string | null
          rut_adulto_responsable?: string
          rut_menor?: string
          sexo?: string | null
          territorio_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beneficiarios_territorio_id_fkey"
            columns: ["territorio_id"]
            isOneToOne: false
            referencedRelation: "territorios"
            referencedColumns: ["id"]
          },
        ]
      }
      entregas: {
        Row: {
          beneficiario_id: string | null
          entregado_por: string | null
          fecha_entrega: string | null
          id: string
          metodo_validacion: string | null
          observaciones: string | null
        }
        Insert: {
          beneficiario_id?: string | null
          entregado_por?: string | null
          fecha_entrega?: string | null
          id?: string
          metodo_validacion?: string | null
          observaciones?: string | null
        }
        Update: {
          beneficiario_id?: string | null
          entregado_por?: string | null
          fecha_entrega?: string | null
          id?: string
          metodo_validacion?: string | null
          observaciones?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entregas_beneficiario_id_fkey"
            columns: ["beneficiario_id"]
            isOneToOne: true
            referencedRelation: "beneficiarios"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          created_at: string | null
          id: string
          nombre_completo: string | null
          rol: string
          territorio_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          nombre_completo?: string | null
          rol: string
          territorio_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre_completo?: string | null
          rol?: string
          territorio_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfiles_territorio_id_fkey"
            columns: ["territorio_id"]
            isOneToOne: false
            referencedRelation: "territorios"
            referencedColumns: ["id"]
          },
        ]
      }
      territorios: {
        Row: {
          created_at: string | null
          id: string
          nombre_jjvv: string
          numero_territorio: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre_jjvv: string
          numero_territorio: number
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre_jjvv?: string
          numero_territorio?: number
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
