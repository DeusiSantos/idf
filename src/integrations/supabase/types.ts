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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      agricultural_certificates: {
        Row: {
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          certificate_number: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at: string
          crops: string[]
          expiry_date: string | null
          farmer_id: string | null
          id: string
          incer_economic_agent_id: string | null
          incer_grain_classification: string | null
          incer_lab_analysis_id: string | null
          incer_lot_id: string | null
          incer_qr_token: string | null
          issue_date: string | null
          issued_at: string | null
          issued_by: string | null
          lot_code: string | null
          production_history_id: string | null
          qr_code_data: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          season: string
          status: Database["public"]["Enums"]["workflow_status"]
          submitted_at: string | null
          submitted_by: string | null
          total_area_ha: number | null
          total_quantity_kg: number | null
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          validation_notes: string | null
          verification_url: string | null
          year: number
        }
        Insert: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          certificate_number: string
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          crops: string[]
          expiry_date?: string | null
          farmer_id?: string | null
          id?: string
          incer_economic_agent_id?: string | null
          incer_grain_classification?: string | null
          incer_lab_analysis_id?: string | null
          incer_lot_id?: string | null
          incer_qr_token?: string | null
          issue_date?: string | null
          issued_at?: string | null
          issued_by?: string | null
          lot_code?: string | null
          production_history_id?: string | null
          qr_code_data?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          season: string
          status?: Database["public"]["Enums"]["workflow_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          total_area_ha?: number | null
          total_quantity_kg?: number | null
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_notes?: string | null
          verification_url?: string | null
          year: number
        }
        Update: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          certificate_number?: string
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          crops?: string[]
          expiry_date?: string | null
          farmer_id?: string | null
          id?: string
          incer_economic_agent_id?: string | null
          incer_grain_classification?: string | null
          incer_lab_analysis_id?: string | null
          incer_lot_id?: string | null
          incer_qr_token?: string | null
          issue_date?: string | null
          issued_at?: string | null
          issued_by?: string | null
          lot_code?: string | null
          production_history_id?: string | null
          qr_code_data?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          season?: string
          status?: Database["public"]["Enums"]["workflow_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          total_area_ha?: number | null
          total_quantity_kg?: number | null
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_notes?: string | null
          verification_url?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "agricultural_certificates_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_certificates_incer_economic_agent_id_fkey"
            columns: ["incer_economic_agent_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_certificates_incer_lab_analysis_id_fkey"
            columns: ["incer_lab_analysis_id"]
            isOneToOne: false
            referencedRelation: "incer_lab_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_certificates_incer_lot_id_fkey"
            columns: ["incer_lot_id"]
            isOneToOne: false
            referencedRelation: "incer_warehouse_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_certificates_production_history_id_fkey"
            columns: ["production_history_id"]
            isOneToOne: false
            referencedRelation: "production_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_certificates_production_history_id_fkey"
            columns: ["production_history_id"]
            isOneToOne: false
            referencedRelation: "v_incer_production_full"
            referencedColumns: ["ph_id"]
          },
        ]
      }
      agricultural_infrastructure: {
        Row: {
          address: string | null
          built_year: number | null
          capacity: number | null
          capacity_unit: string | null
          commune_id: string | null
          condition: string | null
          created_at: string
          created_by: string | null
          current_occupancy: number | null
          description: string | null
          id: string
          incer_available_capacity: number | null
          incer_capacity_unit: Database["public"]["Enums"]["incer_unit"] | null
          incer_conservation_state: string | null
          incer_economic_agent_id: string | null
          incer_has_humidity_control: boolean | null
          incer_has_security: boolean | null
          incer_has_ventilation: boolean | null
          incer_infra_type:
            | Database["public"]["Enums"]["incer_infra_type"]
            | null
          incer_silo_subtype: string | null
          infrastructure_type: string
          last_inspection_date: string | null
          latitude: number | null
          longitude: number | null
          manager_contact: string | null
          manager_name: string | null
          municipality_id: string | null
          name: string
          province_id: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          built_year?: number | null
          capacity?: number | null
          capacity_unit?: string | null
          commune_id?: string | null
          condition?: string | null
          created_at?: string
          created_by?: string | null
          current_occupancy?: number | null
          description?: string | null
          id?: string
          incer_available_capacity?: number | null
          incer_capacity_unit?: Database["public"]["Enums"]["incer_unit"] | null
          incer_conservation_state?: string | null
          incer_economic_agent_id?: string | null
          incer_has_humidity_control?: boolean | null
          incer_has_security?: boolean | null
          incer_has_ventilation?: boolean | null
          incer_infra_type?:
            | Database["public"]["Enums"]["incer_infra_type"]
            | null
          incer_silo_subtype?: string | null
          infrastructure_type: string
          last_inspection_date?: string | null
          latitude?: number | null
          longitude?: number | null
          manager_contact?: string | null
          manager_name?: string | null
          municipality_id?: string | null
          name: string
          province_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          built_year?: number | null
          capacity?: number | null
          capacity_unit?: string | null
          commune_id?: string | null
          condition?: string | null
          created_at?: string
          created_by?: string | null
          current_occupancy?: number | null
          description?: string | null
          id?: string
          incer_available_capacity?: number | null
          incer_capacity_unit?: Database["public"]["Enums"]["incer_unit"] | null
          incer_conservation_state?: string | null
          incer_economic_agent_id?: string | null
          incer_has_humidity_control?: boolean | null
          incer_has_security?: boolean | null
          incer_has_ventilation?: boolean | null
          incer_infra_type?:
            | Database["public"]["Enums"]["incer_infra_type"]
            | null
          incer_silo_subtype?: string | null
          infrastructure_type?: string
          last_inspection_date?: string | null
          latitude?: number | null
          longitude?: number | null
          manager_contact?: string | null
          manager_name?: string | null
          municipality_id?: string | null
          name?: string
          province_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agricultural_infrastructure_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_infrastructure_incer_economic_agent_id_fkey"
            columns: ["incer_economic_agent_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_infrastructure_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_infrastructure_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      agricultural_scores: {
        Row: {
          calculated_at: string
          calculated_by: string | null
          compliance_level: string | null
          created_at: string
          farmer_id: string
          id: string
          mechanization_score: number | null
          notes: string | null
          package_score: number | null
          planting_score: number | null
          production_score: number | null
          season: string
          total_score: number | null
          updated_at: string
        }
        Insert: {
          calculated_at?: string
          calculated_by?: string | null
          compliance_level?: string | null
          created_at?: string
          farmer_id: string
          id?: string
          mechanization_score?: number | null
          notes?: string | null
          package_score?: number | null
          planting_score?: number | null
          production_score?: number | null
          season: string
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          calculated_at?: string
          calculated_by?: string | null
          compliance_level?: string | null
          created_at?: string
          farmer_id?: string
          id?: string
          mechanization_score?: number | null
          notes?: string | null
          package_score?: number | null
          planting_score?: number | null
          production_score?: number | null
          season?: string
          total_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agricultural_scores_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      alternative_guarantees: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          document_reference: string | null
          document_url: string | null
          estimated_value_aoa: number | null
          farmer_id: string
          guarantee_type: string
          id: string
          is_active: boolean | null
          score_impact_points: number | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          document_reference?: string | null
          document_url?: string | null
          estimated_value_aoa?: number | null
          farmer_id: string
          guarantee_type: string
          id?: string
          is_active?: boolean | null
          score_impact_points?: number | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          document_reference?: string | null
          document_url?: string | null
          estimated_value_aoa?: number | null
          farmer_id?: string
          guarantee_type?: string
          id?: string
          is_active?: boolean | null
          score_impact_points?: number | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alternative_guarantees_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
          user_ip: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
          user_ip?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
          user_ip?: string | null
        }
        Relationships: []
      }
      card_export_job_logs: {
        Row: {
          created_at: string
          farmer_id: string | null
          id: string
          job_id: string
          level: Database["public"]["Enums"]["card_export_log_level"]
          message: string
          metadata: Json
        }
        Insert: {
          created_at?: string
          farmer_id?: string | null
          id?: string
          job_id: string
          level?: Database["public"]["Enums"]["card_export_log_level"]
          message: string
          metadata?: Json
        }
        Update: {
          created_at?: string
          farmer_id?: string | null
          id?: string
          job_id?: string
          level?: Database["public"]["Enums"]["card_export_log_level"]
          message?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "card_export_job_logs_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_export_job_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "card_export_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      card_export_jobs: {
        Row: {
          created_at: string
          error_message: string | null
          failed: number
          farmer_ids: string[]
          file_path: string | null
          finished_at: string | null
          id: string
          options: Json | null
          processed: number
          requested_by: string
          started_at: string | null
          status: Database["public"]["Enums"]["export_job_status"]
          succeeded: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          failed?: number
          farmer_ids?: string[]
          file_path?: string | null
          finished_at?: string | null
          id?: string
          options?: Json | null
          processed?: number
          requested_by: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["export_job_status"]
          succeeded?: number
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          failed?: number
          farmer_ids?: string[]
          file_path?: string | null
          finished_at?: string | null
          id?: string
          options?: Json | null
          processed?: number
          requested_by?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["export_job_status"]
          succeeded?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_export_jobs_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_export_jobs_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      climate_occurrences: {
        Row: {
          affected_area_ha: number | null
          affected_farmers_count: number | null
          ai_classification: Json | null
          assigned_to: string | null
          best_practices: string[] | null
          commune_id: string | null
          created_at: string
          description: string | null
          estimated_loss_aoa: number | null
          id: string
          latitude: number | null
          longitude: number | null
          municipality_id: string | null
          occurrence_type: string
          province_id: string | null
          report_date: string
          reported_by: string | null
          resolution_date: string | null
          resolution_notes: string | null
          severity: string
          source: string
          source_phone: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_area_ha?: number | null
          affected_farmers_count?: number | null
          ai_classification?: Json | null
          assigned_to?: string | null
          best_practices?: string[] | null
          commune_id?: string | null
          created_at?: string
          description?: string | null
          estimated_loss_aoa?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipality_id?: string | null
          occurrence_type: string
          province_id?: string | null
          report_date?: string
          reported_by?: string | null
          resolution_date?: string | null
          resolution_notes?: string | null
          severity?: string
          source?: string
          source_phone?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_area_ha?: number | null
          affected_farmers_count?: number | null
          ai_classification?: Json | null
          assigned_to?: string | null
          best_practices?: string[] | null
          commune_id?: string | null
          created_at?: string
          description?: string | null
          estimated_loss_aoa?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipality_id?: string | null
          occurrence_type?: string
          province_id?: string | null
          report_date?: string
          reported_by?: string | null
          resolution_date?: string | null
          resolution_notes?: string | null
          severity?: string
          source?: string
          source_phone?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "climate_occurrences_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "climate_occurrences_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "climate_occurrences_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      coffee_lots: {
        Row: {
          bags_count: number | null
          buyer_name: string | null
          created_at: string
          created_by: string | null
          destination_country: string | null
          dispatched_at: string | null
          export_declaration_number: string | null
          exported_at: string | null
          exporter_id: string | null
          exporter_name: string | null
          harvest_season: string | null
          harvest_year: number | null
          id: string
          lot_code: string
          notes: string | null
          origin_commune_id: string | null
          origin_location: string | null
          origin_municipality_id: string | null
          origin_province_id: string | null
          processing_method: string | null
          producers_count: number | null
          quality_grade: string | null
          registered_at: string | null
          status: string
          transport_document_number: string | null
          updated_at: string
          updated_by: string | null
          variety: string | null
          volume_kg: number
        }
        Insert: {
          bags_count?: number | null
          buyer_name?: string | null
          created_at?: string
          created_by?: string | null
          destination_country?: string | null
          dispatched_at?: string | null
          export_declaration_number?: string | null
          exported_at?: string | null
          exporter_id?: string | null
          exporter_name?: string | null
          harvest_season?: string | null
          harvest_year?: number | null
          id?: string
          lot_code: string
          notes?: string | null
          origin_commune_id?: string | null
          origin_location?: string | null
          origin_municipality_id?: string | null
          origin_province_id?: string | null
          processing_method?: string | null
          producers_count?: number | null
          quality_grade?: string | null
          registered_at?: string | null
          status?: string
          transport_document_number?: string | null
          updated_at?: string
          updated_by?: string | null
          variety?: string | null
          volume_kg?: number
        }
        Update: {
          bags_count?: number | null
          buyer_name?: string | null
          created_at?: string
          created_by?: string | null
          destination_country?: string | null
          dispatched_at?: string | null
          export_declaration_number?: string | null
          exported_at?: string | null
          exporter_id?: string | null
          exporter_name?: string | null
          harvest_season?: string | null
          harvest_year?: number | null
          id?: string
          lot_code?: string
          notes?: string | null
          origin_commune_id?: string | null
          origin_location?: string | null
          origin_municipality_id?: string | null
          origin_province_id?: string | null
          processing_method?: string | null
          producers_count?: number | null
          quality_grade?: string | null
          registered_at?: string | null
          status?: string
          transport_document_number?: string | null
          updated_at?: string
          updated_by?: string | null
          variety?: string | null
          volume_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "coffee_lots_exporter_id_fkey"
            columns: ["exporter_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coffee_lots_origin_commune_id_fkey"
            columns: ["origin_commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coffee_lots_origin_municipality_id_fkey"
            columns: ["origin_municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coffee_lots_origin_province_id_fkey"
            columns: ["origin_province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      communes: {
        Row: {
          code: string | null
          created_at: string
          id: string
          municipality_id: string
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          municipality_id: string
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          municipality_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "communes_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
        ]
      }
      companion_devices: {
        Row: {
          api_key_hash: string
          assigned_to: string | null
          capabilities: string[] | null
          created_at: string
          device_name: string
          device_serial: string | null
          id: string
          last_seen_at: string | null
          province_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          api_key_hash: string
          assigned_to?: string | null
          capabilities?: string[] | null
          created_at?: string
          device_name: string
          device_serial?: string | null
          id?: string
          last_seen_at?: string | null
          province_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          api_key_hash?: string
          assigned_to?: string | null
          capabilities?: string[] | null
          created_at?: string
          device_name?: string
          device_serial?: string | null
          id?: string
          last_seen_at?: string | null
          province_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companion_devices_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      cooperative_details: {
        Row: {
          aggregated_area_ha: number | null
          board_contacts: Json | null
          created_at: string
          created_by: string | null
          degree: string | null
          dncm_registration_number: string | null
          farmer_id: string
          infrastructures: string[] | null
          legal_constitution_date: string | null
          license_url: string | null
          minimum_quota_aoa: number | null
          nif: string | null
          notes: string | null
          president_name: string | null
          president_phone: string | null
          secretary_name: string | null
          share_capital_aoa: number | null
          statutes_url: string | null
          total_members: number | null
          treasurer_name: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          aggregated_area_ha?: number | null
          board_contacts?: Json | null
          created_at?: string
          created_by?: string | null
          degree?: string | null
          dncm_registration_number?: string | null
          farmer_id: string
          infrastructures?: string[] | null
          legal_constitution_date?: string | null
          license_url?: string | null
          minimum_quota_aoa?: number | null
          nif?: string | null
          notes?: string | null
          president_name?: string | null
          president_phone?: string | null
          secretary_name?: string | null
          share_capital_aoa?: number | null
          statutes_url?: string | null
          total_members?: number | null
          treasurer_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          aggregated_area_ha?: number | null
          board_contacts?: Json | null
          created_at?: string
          created_by?: string | null
          degree?: string | null
          dncm_registration_number?: string | null
          farmer_id?: string
          infrastructures?: string[] | null
          legal_constitution_date?: string | null
          license_url?: string | null
          minimum_quota_aoa?: number | null
          nif?: string | null
          notes?: string | null
          president_name?: string | null
          president_phone?: string | null
          secretary_name?: string | null
          share_capital_aoa?: number | null
          statutes_url?: string | null
          total_members?: number | null
          treasurer_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cooperative_details_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: true
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_dossiers: {
        Row: {
          attached_documents: Json | null
          certificate_id: string | null
          created_at: string
          created_by: string | null
          credit_score: number | null
          dossier_number: string
          expires_at: string | null
          farmer_id: string
          financial_profile_id: string | null
          georeferenced_maps: Json | null
          id: string
          insurance_score_id: string | null
          pdf_url: string | null
          qr_code_data: string | null
          recommended_credit_aoa: number | null
          risk_classification: string | null
          simulation_id: string | null
          status: string | null
          submission_response: Json | null
          submitted_at: string | null
          submitted_to: string | null
          updated_at: string
          updated_by: string | null
          verification_url: string | null
        }
        Insert: {
          attached_documents?: Json | null
          certificate_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_score?: number | null
          dossier_number: string
          expires_at?: string | null
          farmer_id: string
          financial_profile_id?: string | null
          georeferenced_maps?: Json | null
          id?: string
          insurance_score_id?: string | null
          pdf_url?: string | null
          qr_code_data?: string | null
          recommended_credit_aoa?: number | null
          risk_classification?: string | null
          simulation_id?: string | null
          status?: string | null
          submission_response?: Json | null
          submitted_at?: string | null
          submitted_to?: string | null
          updated_at?: string
          updated_by?: string | null
          verification_url?: string | null
        }
        Update: {
          attached_documents?: Json | null
          certificate_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_score?: number | null
          dossier_number?: string
          expires_at?: string | null
          farmer_id?: string
          financial_profile_id?: string | null
          georeferenced_maps?: Json | null
          id?: string
          insurance_score_id?: string | null
          pdf_url?: string | null
          qr_code_data?: string | null
          recommended_credit_aoa?: number | null
          risk_classification?: string | null
          simulation_id?: string | null
          status?: string | null
          submission_response?: Json | null
          submitted_at?: string | null
          submitted_to?: string | null
          updated_at?: string
          updated_by?: string | null
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_dossiers_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "production_history_certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_dossiers_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_dossiers_financial_profile_id_fkey"
            columns: ["financial_profile_id"]
            isOneToOne: false
            referencedRelation: "farmer_financial_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_dossiers_insurance_score_id_fkey"
            columns: ["insurance_score_id"]
            isOneToOne: false
            referencedRelation: "insurance_risk_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_dossiers_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "credit_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_insurance_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: string
          app_sent_at: string | null
          created_at: string
          email_sent_at: string | null
          expires_at: string | null
          farmer_id: string
          id: string
          message: string
          priority: string | null
          read_at: string | null
          send_app: boolean | null
          send_email: boolean | null
          send_sms: boolean | null
          sms_sent_at: string | null
          target_extensionist: boolean | null
          target_farmer: boolean | null
          target_institution: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type: string
          app_sent_at?: string | null
          created_at?: string
          email_sent_at?: string | null
          expires_at?: string | null
          farmer_id: string
          id?: string
          message: string
          priority?: string | null
          read_at?: string | null
          send_app?: boolean | null
          send_email?: boolean | null
          send_sms?: boolean | null
          sms_sent_at?: string | null
          target_extensionist?: boolean | null
          target_farmer?: boolean | null
          target_institution?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: string
          app_sent_at?: string | null
          created_at?: string
          email_sent_at?: string | null
          expires_at?: string | null
          farmer_id?: string
          id?: string
          message?: string
          priority?: string | null
          read_at?: string | null
          send_app?: boolean | null
          send_email?: boolean | null
          send_sms?: boolean | null
          sms_sent_at?: string | null
          target_extensionist?: boolean | null
          target_farmer?: boolean | null
          target_institution?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_insurance_alerts_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_simulations: {
        Row: {
          average_production_costs_aoa: number
          created_at: string
          created_by: string | null
          estimated_interest_rate: number | null
          estimated_net_margin_aoa: number
          expected_annual_revenue_aoa: number
          farmer_id: string
          id: string
          margin_percentage: number | null
          max_credit_amount_aoa: number | null
          max_monthly_payment_aoa: number | null
          qr_code_data: string | null
          recommended_credit_amount_aoa: number | null
          recommended_term_months: number | null
          report_generated: boolean | null
          report_url: string | null
          scenario_type: string
          simulation_date: string
          simulation_params: Json | null
          verification_url: string | null
        }
        Insert: {
          average_production_costs_aoa?: number
          created_at?: string
          created_by?: string | null
          estimated_interest_rate?: number | null
          estimated_net_margin_aoa?: number
          expected_annual_revenue_aoa?: number
          farmer_id: string
          id?: string
          margin_percentage?: number | null
          max_credit_amount_aoa?: number | null
          max_monthly_payment_aoa?: number | null
          qr_code_data?: string | null
          recommended_credit_amount_aoa?: number | null
          recommended_term_months?: number | null
          report_generated?: boolean | null
          report_url?: string | null
          scenario_type?: string
          simulation_date?: string
          simulation_params?: Json | null
          verification_url?: string | null
        }
        Update: {
          average_production_costs_aoa?: number
          created_at?: string
          created_by?: string | null
          estimated_interest_rate?: number | null
          estimated_net_margin_aoa?: number
          expected_annual_revenue_aoa?: number
          farmer_id?: string
          id?: string
          margin_percentage?: number | null
          max_credit_amount_aoa?: number | null
          max_monthly_payment_aoa?: number | null
          qr_code_data?: string | null
          recommended_credit_amount_aoa?: number | null
          recommended_term_months?: number | null
          report_generated?: boolean | null
          report_url?: string | null
          scenario_type?: string
          simulation_date?: string
          simulation_params?: Json | null
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_simulations_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lab_access_requests: {
        Row: {
          approved_until: string | null
          created_at: string
          dataset_ids: string[]
          expected_duration_days: number | null
          geographic_scope: string[] | null
          id: string
          organization_id: string | null
          output_format: string | null
          purpose: string
          request_number: string
          requested_fields: string[] | null
          research_description: string | null
          researcher_id: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          temporal_scope_end: string | null
          temporal_scope_start: string | null
          updated_at: string
        }
        Insert: {
          approved_until?: string | null
          created_at?: string
          dataset_ids: string[]
          expected_duration_days?: number | null
          geographic_scope?: string[] | null
          id?: string
          organization_id?: string | null
          output_format?: string | null
          purpose: string
          request_number: string
          requested_fields?: string[] | null
          research_description?: string | null
          researcher_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          temporal_scope_end?: string | null
          temporal_scope_start?: string | null
          updated_at?: string
        }
        Update: {
          approved_until?: string | null
          created_at?: string
          dataset_ids?: string[]
          expected_duration_days?: number | null
          geographic_scope?: string[] | null
          id?: string
          organization_id?: string | null
          output_format?: string | null
          purpose?: string
          request_number?: string
          requested_fields?: string[] | null
          research_description?: string | null
          researcher_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          temporal_scope_end?: string | null
          temporal_scope_start?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_lab_access_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "data_lab_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lab_access_requests_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "data_lab_researchers"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lab_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          organization_id: string | null
          researcher_id: string | null
          resource_id: string | null
          resource_type: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          organization_id?: string | null
          researcher_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          organization_id?: string | null
          researcher_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_lab_audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "data_lab_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lab_audit_log_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "data_lab_researchers"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lab_datasets: {
        Row: {
          aggregation_required: boolean | null
          available_fields: string[] | null
          code: string
          created_at: string
          data_category: string
          description: string | null
          id: string
          is_active: boolean | null
          min_aggregation_level: string | null
          name: string
          restricted_fields: string[] | null
          row_filter: string | null
          sensitivity_level: string
          source_table: string
          updated_at: string
        }
        Insert: {
          aggregation_required?: boolean | null
          available_fields?: string[] | null
          code: string
          created_at?: string
          data_category?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          min_aggregation_level?: string | null
          name: string
          restricted_fields?: string[] | null
          row_filter?: string | null
          sensitivity_level?: string
          source_table: string
          updated_at?: string
        }
        Update: {
          aggregation_required?: boolean | null
          available_fields?: string[] | null
          code?: string
          created_at?: string
          data_category?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          min_aggregation_level?: string | null
          name?: string
          restricted_fields?: string[] | null
          row_filter?: string | null
          sensitivity_level?: string
          source_table?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_lab_exports: {
        Row: {
          created_at: string
          dataset_ids: string[] | null
          download_token: string | null
          downloaded_at: string | null
          expires_at: string | null
          export_format: string
          file_size_bytes: number | null
          filters_applied: Json | null
          geographic_scope: string[] | null
          id: string
          ip_address: string | null
          purpose: string | null
          query_history_id: string | null
          researcher_id: string | null
          row_count: number | null
          temporal_scope_end: string | null
          temporal_scope_start: string | null
        }
        Insert: {
          created_at?: string
          dataset_ids?: string[] | null
          download_token?: string | null
          downloaded_at?: string | null
          expires_at?: string | null
          export_format: string
          file_size_bytes?: number | null
          filters_applied?: Json | null
          geographic_scope?: string[] | null
          id?: string
          ip_address?: string | null
          purpose?: string | null
          query_history_id?: string | null
          researcher_id?: string | null
          row_count?: number | null
          temporal_scope_end?: string | null
          temporal_scope_start?: string | null
        }
        Update: {
          created_at?: string
          dataset_ids?: string[] | null
          download_token?: string | null
          downloaded_at?: string | null
          expires_at?: string | null
          export_format?: string
          file_size_bytes?: number | null
          filters_applied?: Json | null
          geographic_scope?: string[] | null
          id?: string
          ip_address?: string | null
          purpose?: string | null
          query_history_id?: string | null
          researcher_id?: string | null
          row_count?: number | null
          temporal_scope_end?: string | null
          temporal_scope_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_lab_exports_query_history_id_fkey"
            columns: ["query_history_id"]
            isOneToOne: false
            referencedRelation: "data_lab_query_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lab_exports_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "data_lab_researchers"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lab_organizations: {
        Row: {
          agreement_end_date: string | null
          agreement_reference: string | null
          agreement_start_date: string | null
          allowed_datasets: string[] | null
          code: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          id: string
          is_active: boolean | null
          max_concurrent_users: number | null
          name: string
          notes: string | null
          organization_type: string
          updated_at: string
        }
        Insert: {
          agreement_end_date?: string | null
          agreement_reference?: string | null
          agreement_start_date?: string | null
          allowed_datasets?: string[] | null
          code: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_concurrent_users?: number | null
          name: string
          notes?: string | null
          organization_type?: string
          updated_at?: string
        }
        Update: {
          agreement_end_date?: string | null
          agreement_reference?: string | null
          agreement_start_date?: string | null
          allowed_datasets?: string[] | null
          code?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_concurrent_users?: number | null
          name?: string
          notes?: string | null
          organization_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_lab_query_history: {
        Row: {
          dataset_id: string | null
          executed_at: string
          execution_time_ms: number | null
          export_format: string | null
          id: string
          ip_address: string | null
          query_config: Json
          researcher_id: string | null
          rows_returned: number | null
          saved_query_id: string | null
          user_agent: string | null
          was_exported: boolean | null
        }
        Insert: {
          dataset_id?: string | null
          executed_at?: string
          execution_time_ms?: number | null
          export_format?: string | null
          id?: string
          ip_address?: string | null
          query_config: Json
          researcher_id?: string | null
          rows_returned?: number | null
          saved_query_id?: string | null
          user_agent?: string | null
          was_exported?: boolean | null
        }
        Update: {
          dataset_id?: string | null
          executed_at?: string
          execution_time_ms?: number | null
          export_format?: string | null
          id?: string
          ip_address?: string | null
          query_config?: Json
          researcher_id?: string | null
          rows_returned?: number | null
          saved_query_id?: string | null
          user_agent?: string | null
          was_exported?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "data_lab_query_history_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "data_lab_datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lab_query_history_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "data_lab_researchers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lab_query_history_saved_query_id_fkey"
            columns: ["saved_query_id"]
            isOneToOne: false
            referencedRelation: "data_lab_saved_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lab_researchers: {
        Row: {
          access_level: string
          allowed_datasets: string[] | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          expires_at: string | null
          exports_this_month: number | null
          full_name: string
          id: string
          is_active: boolean | null
          last_export_reset: string | null
          max_exports_per_month: number | null
          notes: string | null
          organization_id: string | null
          phone: string | null
          position: string | null
          research_area: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_level?: string
          allowed_datasets?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          expires_at?: string | null
          exports_this_month?: number | null
          full_name: string
          id?: string
          is_active?: boolean | null
          last_export_reset?: string | null
          max_exports_per_month?: number | null
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          research_area?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_level?: string
          allowed_datasets?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string | null
          exports_this_month?: number | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_export_reset?: string | null
          max_exports_per_month?: number | null
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          research_area?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_lab_researchers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "data_lab_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lab_saved_queries: {
        Row: {
          created_at: string
          dataset_id: string | null
          description: string | null
          execution_count: number | null
          id: string
          is_public: boolean | null
          is_template: boolean | null
          last_executed_at: string | null
          name: string
          query_config: Json
          researcher_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dataset_id?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          last_executed_at?: string | null
          name: string
          query_config: Json
          researcher_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dataset_id?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          last_executed_at?: string | null
          name?: string
          query_config?: Json
          researcher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_lab_saved_queries_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "data_lab_datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_lab_saved_queries_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "data_lab_researchers"
            referencedColumns: ["id"]
          },
        ]
      }
      eligibility_alert_thresholds: {
        Row: {
          baseline_days: number
          baseline_multiplier: number
          created_at: string
          created_by: string | null
          farmer_type: string
          id: string
          is_active: boolean
          min_absolute_count: number
          notes: string | null
          priority: number
          reason_pattern: string
          severity: string
          target_table: string
          updated_at: string
          updated_by: string | null
          window_minutes: number
        }
        Insert: {
          baseline_days?: number
          baseline_multiplier?: number
          created_at?: string
          created_by?: string | null
          farmer_type: string
          id?: string
          is_active?: boolean
          min_absolute_count?: number
          notes?: string | null
          priority?: number
          reason_pattern?: string
          severity?: string
          target_table: string
          updated_at?: string
          updated_by?: string | null
          window_minutes?: number
        }
        Update: {
          baseline_days?: number
          baseline_multiplier?: number
          created_at?: string
          created_by?: string | null
          farmer_type?: string
          id?: string
          is_active?: boolean
          min_absolute_count?: number
          notes?: string | null
          priority?: number
          reason_pattern?: string
          severity?: string
          target_table?: string
          updated_at?: string
          updated_by?: string | null
          window_minutes?: number
        }
        Relationships: []
      }
      eligibility_block_log: {
        Row: {
          attempted_by: string | null
          attempted_payload: Json | null
          created_at: string
          farmer_id: string | null
          farmer_type: Database["public"]["Enums"]["farmer_type"] | null
          id: string
          reason: string
          target_table: string
        }
        Insert: {
          attempted_by?: string | null
          attempted_payload?: Json | null
          created_at?: string
          farmer_id?: string | null
          farmer_type?: Database["public"]["Enums"]["farmer_type"] | null
          id?: string
          reason: string
          target_table: string
        }
        Update: {
          attempted_by?: string | null
          attempted_payload?: Json | null
          created_at?: string
          farmer_id?: string | null
          farmer_type?: Database["public"]["Enums"]["farmer_type"] | null
          id?: string
          reason?: string
          target_table?: string
        }
        Relationships: []
      }
      eligibility_rules: {
        Row: {
          created_at: string
          id: string
          is_mandatory: boolean | null
          operator: string
          program_id: string
          rule_name: string
          rule_type: string
          value: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          operator?: string
          program_id: string
          rule_name: string
          rule_type: string
          value: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          operator?: string
          program_id?: string
          rule_name?: string
          rule_type?: string
          value?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eligibility_rules_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "incentive_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      eudr_approval_batches: {
        Row: {
          batch_number: string | null
          created_at: string
          created_by: string | null
          current_level: number
          description: string | null
          finalized_at: string | null
          id: string
          province_id: string | null
          status: Database["public"]["Enums"]["eudr_batch_status"]
          title: string
          total_items: number
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          created_by?: string | null
          current_level?: number
          description?: string | null
          finalized_at?: string | null
          id?: string
          province_id?: string | null
          status?: Database["public"]["Enums"]["eudr_batch_status"]
          title: string
          total_items?: number
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          created_by?: string | null
          current_level?: number
          description?: string | null
          finalized_at?: string | null
          id?: string
          province_id?: string | null
          status?: Database["public"]["Enums"]["eudr_batch_status"]
          title?: string
          total_items?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "eudr_approval_batches_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      eudr_approval_decisions: {
        Row: {
          batch_id: string
          comment: string | null
          decided_at: string
          decided_by: string
          decided_by_role: Database["public"]["Enums"]["user_role"] | null
          decision: Database["public"]["Enums"]["eudr_decision_type"]
          id: string
          level_name: string
          level_order: number
        }
        Insert: {
          batch_id: string
          comment?: string | null
          decided_at?: string
          decided_by: string
          decided_by_role?: Database["public"]["Enums"]["user_role"] | null
          decision: Database["public"]["Enums"]["eudr_decision_type"]
          id?: string
          level_name: string
          level_order: number
        }
        Update: {
          batch_id?: string
          comment?: string | null
          decided_at?: string
          decided_by?: string
          decided_by_role?: Database["public"]["Enums"]["user_role"] | null
          decision?: Database["public"]["Enums"]["eudr_decision_type"]
          id?: string
          level_name?: string
          level_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "eudr_approval_decisions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "eudr_approval_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      eudr_batch_item_attachments: {
        Row: {
          attachment_type: string
          batch_id: string
          created_at: string
          description: string | null
          file_name: string
          id: string
          item_id: string
          mime_type: string | null
          sha256: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          attachment_type?: string
          batch_id: string
          created_at?: string
          description?: string | null
          file_name: string
          id?: string
          item_id: string
          mime_type?: string | null
          sha256?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          attachment_type?: string
          batch_id?: string
          created_at?: string
          description?: string | null
          file_name?: string
          id?: string
          item_id?: string
          mime_type?: string | null
          sha256?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eudr_batch_item_attachments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "eudr_approval_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eudr_batch_item_attachments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "eudr_batch_items"
            referencedColumns: ["id"]
          },
        ]
      }
      eudr_batch_items: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          notes: string | null
          reference_id: string
          reference_type: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          id?: string
          notes?: string | null
          reference_id: string
          reference_type?: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          reference_id?: string
          reference_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "eudr_batch_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "eudr_approval_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      eudr_notification_log: {
        Row: {
          batch_id: string
          channel: string
          created_at: string
          error: string | null
          id: string
          level_name: string
          level_order: number
          payload: Json | null
          recipient: string | null
          required_role: string
          sent_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          batch_id: string
          channel: string
          created_at?: string
          error?: string | null
          id?: string
          level_name: string
          level_order: number
          payload?: Json | null
          recipient?: string | null
          required_role: string
          sent_at?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          batch_id?: string
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          level_name?: string
          level_order?: number
          payload?: Json | null
          recipient?: string | null
          required_role?: string
          sent_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eudr_notification_log_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "eudr_approval_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_campaigns: {
        Row: {
          created_at: string
          crop: string
          current_phase: number
          expected_harvest: string | null
          farmer_id: string
          id: string
          notes: string | null
          parcel_id: string | null
          start_date: string
          status: string
          total_phases: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop: string
          current_phase?: number
          expected_harvest?: string | null
          farmer_id: string
          id?: string
          notes?: string | null
          parcel_id?: string | null
          start_date?: string
          status?: string
          total_phases?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop?: string
          current_phase?: number
          expected_harvest?: string | null
          farmer_id?: string
          id?: string
          notes?: string | null
          parcel_id?: string | null
          start_date?: string
          status?: string
          total_phases?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_campaigns_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_campaigns_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "farmer_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_card_events: {
        Row: {
          actor_id: string | null
          card_id: string
          created_at: string
          event_type: Database["public"]["Enums"]["card_event_type"]
          id: string
          metadata: Json | null
        }
        Insert: {
          actor_id?: string | null
          card_id: string
          created_at?: string
          event_type: Database["public"]["Enums"]["card_event_type"]
          id?: string
          metadata?: Json | null
        }
        Update: {
          actor_id?: string | null
          card_id?: string
          created_at?: string
          event_type?: Database["public"]["Enums"]["card_event_type"]
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "farmer_card_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_card_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_card_events_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "farmer_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_cards: {
        Row: {
          card_status: Database["public"]["Enums"]["card_status"]
          created_at: string
          delivered_at: string | null
          delivered_by: string | null
          farmer_id: string
          id: string
          issued_at: string
          issued_by: string | null
          printed_at: string | null
          printed_by: string | null
          qr_token: string
          revoked_at: string | null
          revoked_by: string | null
          revoked_reason: string | null
          serial: string | null
          snapshot: Json
          updated_at: string
          version: number
        }
        Insert: {
          card_status?: Database["public"]["Enums"]["card_status"]
          created_at?: string
          delivered_at?: string | null
          delivered_by?: string | null
          farmer_id: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          printed_at?: string | null
          printed_by?: string | null
          qr_token?: string
          revoked_at?: string | null
          revoked_by?: string | null
          revoked_reason?: string | null
          serial?: string | null
          snapshot?: Json
          updated_at?: string
          version?: number
        }
        Update: {
          card_status?: Database["public"]["Enums"]["card_status"]
          created_at?: string
          delivered_at?: string | null
          delivered_by?: string | null
          farmer_id?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          printed_at?: string | null
          printed_by?: string | null
          qr_token?: string
          revoked_at?: string | null
          revoked_by?: string | null
          revoked_reason?: string | null
          serial?: string | null
          snapshot?: Json
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "farmer_cards_delivered_by_fkey"
            columns: ["delivered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_cards_delivered_by_fkey"
            columns: ["delivered_by"]
            isOneToOne: false
            referencedRelation: "profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_cards_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_cards_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_cards_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_cards_printed_by_fkey"
            columns: ["printed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_cards_printed_by_fkey"
            columns: ["printed_by"]
            isOneToOne: false
            referencedRelation: "profiles_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_cards_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_cards_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "profiles_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_data_consents: {
        Row: {
          consent_given_at: string
          consent_scope: string[]
          created_at: string
          farmer_id: string
          id: string
          institution_code: string | null
          institution_name: string | null
          institution_type: string
          is_active: boolean | null
          revocation_reason: string | null
          revoked_at: string | null
          valid_until: string | null
        }
        Insert: {
          consent_given_at?: string
          consent_scope?: string[]
          created_at?: string
          farmer_id: string
          id?: string
          institution_code?: string | null
          institution_name?: string | null
          institution_type: string
          is_active?: boolean | null
          revocation_reason?: string | null
          revoked_at?: string | null
          valid_until?: string | null
        }
        Update: {
          consent_given_at?: string
          consent_scope?: string[]
          created_at?: string
          farmer_id?: string
          id?: string
          institution_code?: string | null
          institution_name?: string | null
          institution_type?: string
          is_active?: boolean | null
          revocation_reason?: string | null
          revoked_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farmer_data_consents_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_financial_profiles: {
        Row: {
          average_annual_production_kg: number | null
          climate_events_count: number | null
          climate_losses_aoa: number | null
          created_at: string
          credit_score: number | null
          credit_score_factors: Json | null
          eligibility_notes: string | null
          farmer_id: string
          id: string
          incentives_count: number | null
          is_credit_eligible: boolean | null
          is_insurance_eligible: boolean | null
          last_calculated_at: string | null
          last_climate_event_date: string | null
          last_incentive_date: string | null
          main_crops: string[] | null
          production_stability_pct: number | null
          production_years: number | null
          productive_area_ha: number | null
          risk_classification: string | null
          territorial_risk_factors: Json | null
          territorial_risk_level: string | null
          total_incentives_received_aoa: number | null
          updated_at: string
        }
        Insert: {
          average_annual_production_kg?: number | null
          climate_events_count?: number | null
          climate_losses_aoa?: number | null
          created_at?: string
          credit_score?: number | null
          credit_score_factors?: Json | null
          eligibility_notes?: string | null
          farmer_id: string
          id?: string
          incentives_count?: number | null
          is_credit_eligible?: boolean | null
          is_insurance_eligible?: boolean | null
          last_calculated_at?: string | null
          last_climate_event_date?: string | null
          last_incentive_date?: string | null
          main_crops?: string[] | null
          production_stability_pct?: number | null
          production_years?: number | null
          productive_area_ha?: number | null
          risk_classification?: string | null
          territorial_risk_factors?: Json | null
          territorial_risk_level?: string | null
          total_incentives_received_aoa?: number | null
          updated_at?: string
        }
        Update: {
          average_annual_production_kg?: number | null
          climate_events_count?: number | null
          climate_losses_aoa?: number | null
          created_at?: string
          credit_score?: number | null
          credit_score_factors?: Json | null
          eligibility_notes?: string | null
          farmer_id?: string
          id?: string
          incentives_count?: number | null
          is_credit_eligible?: boolean | null
          is_insurance_eligible?: boolean | null
          last_calculated_at?: string | null
          last_climate_event_date?: string | null
          last_incentive_date?: string | null
          main_crops?: string[] | null
          production_stability_pct?: number | null
          production_years?: number | null
          productive_area_ha?: number | null
          risk_classification?: string | null
          territorial_risk_factors?: Json | null
          territorial_risk_level?: string | null
          total_incentives_received_aoa?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_financial_profiles_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_parcels: {
        Row: {
          area_ha: number | null
          commune_id: string | null
          created_at: string
          crops: string[] | null
          farmer_id: string
          id: string
          irrigation_system: string | null
          latitude: number | null
          longitude: number | null
          main_crop: string | null
          municipality_id: string | null
          name: string
          province_id: string | null
          soil_type: string | null
          status: string
          updated_at: string
          water_source: string | null
        }
        Insert: {
          area_ha?: number | null
          commune_id?: string | null
          created_at?: string
          crops?: string[] | null
          farmer_id: string
          id?: string
          irrigation_system?: string | null
          latitude?: number | null
          longitude?: number | null
          main_crop?: string | null
          municipality_id?: string | null
          name: string
          province_id?: string | null
          soil_type?: string | null
          status?: string
          updated_at?: string
          water_source?: string | null
        }
        Update: {
          area_ha?: number | null
          commune_id?: string | null
          created_at?: string
          crops?: string[] | null
          farmer_id?: string
          id?: string
          irrigation_system?: string | null
          latitude?: number | null
          longitude?: number | null
          main_crop?: string | null
          municipality_id?: string | null
          name?: string
          province_id?: string | null
          soil_type?: string | null
          status?: string
          updated_at?: string
          water_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farmer_parcels_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_parcels_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_parcels_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_parcels_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_representatives: {
        Row: {
          bi: string | null
          created_at: string
          farmer_id: string
          fingerprint_complete: boolean | null
          fingers_captured: number | null
          id: string
          municipality_id: string | null
          name: string
          phone: string | null
          photo_url: string | null
          province_id: string | null
          relationship: string
          synced: boolean | null
          updated_at: string
        }
        Insert: {
          bi?: string | null
          created_at?: string
          farmer_id: string
          fingerprint_complete?: boolean | null
          fingers_captured?: number | null
          id?: string
          municipality_id?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          province_id?: string | null
          relationship: string
          synced?: boolean | null
          updated_at?: string
        }
        Update: {
          bi?: string | null
          created_at?: string
          farmer_id?: string
          fingerprint_complete?: boolean | null
          fingers_captured?: number | null
          id?: string
          municipality_id?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          province_id?: string | null
          relationship?: string
          synced?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_representatives_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_representatives_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_representatives_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_wallet_pins: {
        Row: {
          pin_hash: string
          updated_at: string
          wallet_id: string
        }
        Insert: {
          pin_hash: string
          updated_at?: string
          wallet_id: string
        }
        Update: {
          pin_hash?: string
          updated_at?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_wallet_pins_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: true
            referencedRelation: "farmer_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_wallets: {
        Row: {
          balance_aoa: number
          created_at: string
          farmer_id: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          balance_aoa?: number
          created_at?: string
          farmer_id: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          balance_aoa?: number
          created_at?: string
          farmer_id?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_wallets_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: true
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      farmers: {
        Row: {
          activity_category: string
          address: string | null
          bi_nif: string | null
          card_generated_at: string | null
          card_number: string | null
          card_qr_code: string | null
          children_15_to_18: number | null
          children_5_to_14: number | null
          children_count: number | null
          children_under_5: number | null
          commune_id: string | null
          created_at: string
          created_by: string | null
          cultivated_area_ha: number | null
          dependents_count: number | null
          document_bi_url: string | null
          document_license_url: string | null
          document_nif_url: string | null
          document_other_url: string | null
          email: string | null
          family_workers_count: number | null
          farmer_type: Database["public"]["Enums"]["farmer_type"]
          field_school_id: string | null
          fingerprint_data: string | null
          head_of_household: boolean | null
          household_members_count: number | null
          household_notes: string | null
          id: string
          incer_avg_annual_production: number | null
          incer_fomento_program: string | null
          incer_has_own_warehouse: boolean | null
          incer_production_system: string | null
          irrigation_type: string | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          main_crops: string[] | null
          municipality_id: string | null
          name: string
          parent_cooperative_id: string | null
          pfnl_collection_area_ha: number | null
          pfnl_forest_authorization_ref: string | null
          pfnl_products: string[] | null
          pfnl_seasonality: string | null
          pfnl_target_species: string[] | null
          phone: string | null
          photo_url: string | null
          province_id: string | null
          registering_entity: string | null
          registering_entity_other: string | null
          registration_date: string | null
          registration_number: string | null
          secondary_crops: string[] | null
          spouse_bi_nif: string | null
          spouse_name: string | null
          status: Database["public"]["Enums"]["workflow_status"] | null
          technician_id: string | null
          total_area_ha: number | null
          trade_name: string | null
          updated_at: string
          updated_by: string | null
          village: string | null
        }
        Insert: {
          activity_category?: string
          address?: string | null
          bi_nif?: string | null
          card_generated_at?: string | null
          card_number?: string | null
          card_qr_code?: string | null
          children_15_to_18?: number | null
          children_5_to_14?: number | null
          children_count?: number | null
          children_under_5?: number | null
          commune_id?: string | null
          created_at?: string
          created_by?: string | null
          cultivated_area_ha?: number | null
          dependents_count?: number | null
          document_bi_url?: string | null
          document_license_url?: string | null
          document_nif_url?: string | null
          document_other_url?: string | null
          email?: string | null
          family_workers_count?: number | null
          farmer_type?: Database["public"]["Enums"]["farmer_type"]
          field_school_id?: string | null
          fingerprint_data?: string | null
          head_of_household?: boolean | null
          household_members_count?: number | null
          household_notes?: string | null
          id?: string
          incer_avg_annual_production?: number | null
          incer_fomento_program?: string | null
          incer_has_own_warehouse?: boolean | null
          incer_production_system?: string | null
          irrigation_type?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          main_crops?: string[] | null
          municipality_id?: string | null
          name: string
          parent_cooperative_id?: string | null
          pfnl_collection_area_ha?: number | null
          pfnl_forest_authorization_ref?: string | null
          pfnl_products?: string[] | null
          pfnl_seasonality?: string | null
          pfnl_target_species?: string[] | null
          phone?: string | null
          photo_url?: string | null
          province_id?: string | null
          registering_entity?: string | null
          registering_entity_other?: string | null
          registration_date?: string | null
          registration_number?: string | null
          secondary_crops?: string[] | null
          spouse_bi_nif?: string | null
          spouse_name?: string | null
          status?: Database["public"]["Enums"]["workflow_status"] | null
          technician_id?: string | null
          total_area_ha?: number | null
          trade_name?: string | null
          updated_at?: string
          updated_by?: string | null
          village?: string | null
        }
        Update: {
          activity_category?: string
          address?: string | null
          bi_nif?: string | null
          card_generated_at?: string | null
          card_number?: string | null
          card_qr_code?: string | null
          children_15_to_18?: number | null
          children_5_to_14?: number | null
          children_count?: number | null
          children_under_5?: number | null
          commune_id?: string | null
          created_at?: string
          created_by?: string | null
          cultivated_area_ha?: number | null
          dependents_count?: number | null
          document_bi_url?: string | null
          document_license_url?: string | null
          document_nif_url?: string | null
          document_other_url?: string | null
          email?: string | null
          family_workers_count?: number | null
          farmer_type?: Database["public"]["Enums"]["farmer_type"]
          field_school_id?: string | null
          fingerprint_data?: string | null
          head_of_household?: boolean | null
          household_members_count?: number | null
          household_notes?: string | null
          id?: string
          incer_avg_annual_production?: number | null
          incer_fomento_program?: string | null
          incer_has_own_warehouse?: boolean | null
          incer_production_system?: string | null
          irrigation_type?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          main_crops?: string[] | null
          municipality_id?: string | null
          name?: string
          parent_cooperative_id?: string | null
          pfnl_collection_area_ha?: number | null
          pfnl_forest_authorization_ref?: string | null
          pfnl_products?: string[] | null
          pfnl_seasonality?: string | null
          pfnl_target_species?: string[] | null
          phone?: string | null
          photo_url?: string | null
          province_id?: string | null
          registering_entity?: string | null
          registering_entity_other?: string | null
          registration_date?: string | null
          registration_number?: string | null
          secondary_crops?: string[] | null
          spouse_bi_nif?: string | null
          spouse_name?: string | null
          status?: Database["public"]["Enums"]["workflow_status"] | null
          technician_id?: string | null
          total_area_ha?: number | null
          trade_name?: string | null
          updated_at?: string
          updated_by?: string | null
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farmers_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_field_school_id_fkey"
            columns: ["field_school_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_parent_cooperative_id_fkey"
            columns: ["parent_cooperative_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "field_technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      field_captures: {
        Row: {
          capture_type: string
          captured_at: string
          created_at: string
          device_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          match_score: number | null
          operator_id: string | null
          raw_payload: Json | null
        }
        Insert: {
          capture_type: string
          captured_at?: string
          created_at?: string
          device_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          match_score?: number | null
          operator_id?: string | null
          raw_payload?: Json | null
        }
        Update: {
          capture_type?: string
          captured_at?: string
          created_at?: string
          device_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          match_score?: number | null
          operator_id?: string | null
          raw_payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "field_captures_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "companion_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_captures_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      field_school_details: {
        Row: {
          avg_age_range: string | null
          avg_education_level: string | null
          created_at: string
          created_by: string | null
          curriculum_modules: string[] | null
          demo_crops: string[] | null
          demo_latitude: number | null
          demo_longitude: number | null
          demo_parcel_area_ha: number | null
          duration_months: number | null
          facilitator_id: string | null
          farmer_id: string
          focus_crop: string | null
          funding_source: string | null
          linked_project: string | null
          notes: string | null
          participants_count: number | null
          participants_female: number | null
          participants_male: number | null
          promoter_entity: string | null
          promoter_name: string | null
          session_schedule: Json | null
          start_date: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avg_age_range?: string | null
          avg_education_level?: string | null
          created_at?: string
          created_by?: string | null
          curriculum_modules?: string[] | null
          demo_crops?: string[] | null
          demo_latitude?: number | null
          demo_longitude?: number | null
          demo_parcel_area_ha?: number | null
          duration_months?: number | null
          facilitator_id?: string | null
          farmer_id: string
          focus_crop?: string | null
          funding_source?: string | null
          linked_project?: string | null
          notes?: string | null
          participants_count?: number | null
          participants_female?: number | null
          participants_male?: number | null
          promoter_entity?: string | null
          promoter_name?: string | null
          session_schedule?: Json | null
          start_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avg_age_range?: string | null
          avg_education_level?: string | null
          created_at?: string
          created_by?: string | null
          curriculum_modules?: string[] | null
          demo_crops?: string[] | null
          demo_latitude?: number | null
          demo_longitude?: number | null
          demo_parcel_area_ha?: number | null
          duration_months?: number | null
          facilitator_id?: string | null
          farmer_id?: string
          focus_crop?: string | null
          funding_source?: string | null
          linked_project?: string | null
          notes?: string | null
          participants_count?: number | null
          participants_female?: number | null
          participants_male?: number | null
          promoter_entity?: string | null
          promoter_name?: string | null
          session_schedule?: Json | null
          start_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_school_details_facilitator_id_fkey"
            columns: ["facilitator_id"]
            isOneToOne: false
            referencedRelation: "field_technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_school_details_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: true
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      field_technicians: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          employee_number: string
          full_name: string
          id: string
          max_farmers: number | null
          municipality_id: string | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          province_id: string | null
          specialization: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          employee_number: string
          full_name: string
          id?: string
          max_farmers?: number | null
          municipality_id?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          province_id?: string | null
          specialization?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          employee_number?: string
          full_name?: string
          id?: string
          max_farmers?: number | null
          municipality_id?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          province_id?: string | null
          specialization?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_technicians_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_technicians_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      file_integrity: {
        Row: {
          bucket: string
          entity_id: string | null
          entity_type: string | null
          id: string
          mime: string
          path: string
          sha256: string
          size_bytes: number
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          bucket: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          mime: string
          path: string
          sha256: string
          size_bytes: number
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          bucket?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          mime?: string
          path?: string
          sha256?: string
          size_bytes?: number
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      forest_certificates: {
        Row: {
          certificate_number: string | null
          classification: string
          created_at: string
          created_by: string | null
          criteria: Json | null
          id: string
          issue_date: string
          license_id: string | null
          notes: string | null
          operator_id: string | null
          province_id: string | null
          qr_token: string | null
          score: number | null
          status: string
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          certificate_number?: string | null
          classification?: string
          created_at?: string
          created_by?: string | null
          criteria?: Json | null
          id?: string
          issue_date?: string
          license_id?: string | null
          notes?: string | null
          operator_id?: string | null
          province_id?: string | null
          qr_token?: string | null
          score?: number | null
          status?: string
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          certificate_number?: string | null
          classification?: string
          created_at?: string
          created_by?: string | null
          criteria?: Json | null
          id?: string
          issue_date?: string
          license_id?: string | null
          notes?: string | null
          operator_id?: string | null
          province_id?: string | null
          qr_token?: string | null
          score?: number | null
          status?: string
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_certificates_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_certificates_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_certificates_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_checkpoint_logs: {
        Row: {
          arrival_at: string
          cargo_verified: boolean | null
          checkpoint_id: string
          created_at: string
          decision: string | null
          departure_at: string | null
          detention_reason: string | null
          discrepancies_found: boolean | null
          discrepancy_notes: string | null
          documents_verified: boolean | null
          id: string
          inspector_id: string | null
          inspector_name: string | null
          notes: string | null
          photos: Json | null
          species_matches: boolean | null
          transport_permit_id: string
          volume_matches: boolean | null
        }
        Insert: {
          arrival_at?: string
          cargo_verified?: boolean | null
          checkpoint_id: string
          created_at?: string
          decision?: string | null
          departure_at?: string | null
          detention_reason?: string | null
          discrepancies_found?: boolean | null
          discrepancy_notes?: string | null
          documents_verified?: boolean | null
          id?: string
          inspector_id?: string | null
          inspector_name?: string | null
          notes?: string | null
          photos?: Json | null
          species_matches?: boolean | null
          transport_permit_id: string
          volume_matches?: boolean | null
        }
        Update: {
          arrival_at?: string
          cargo_verified?: boolean | null
          checkpoint_id?: string
          created_at?: string
          decision?: string | null
          departure_at?: string | null
          detention_reason?: string | null
          discrepancies_found?: boolean | null
          discrepancy_notes?: string | null
          documents_verified?: boolean | null
          id?: string
          inspector_id?: string | null
          inspector_name?: string | null
          notes?: string | null
          photos?: Json | null
          species_matches?: boolean | null
          transport_permit_id?: string
          volume_matches?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_checkpoint_logs_checkpoint_id_fkey"
            columns: ["checkpoint_id"]
            isOneToOne: false
            referencedRelation: "forest_checkpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_checkpoint_logs_transport_permit_id_fkey"
            columns: ["transport_permit_id"]
            isOneToOne: false
            referencedRelation: "forest_transport_permits"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_checkpoints: {
        Row: {
          address: string | null
          checkpoint_type: string
          code: string
          created_at: string
          id: string
          is_active: boolean | null
          latitude: number
          longitude: number
          municipality_id: string | null
          name: string
          operating_hours: string | null
          province_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          checkpoint_type?: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude: number
          longitude: number
          municipality_id?: string | null
          name: string
          operating_hours?: string | null
          province_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          checkpoint_type?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number
          longitude?: number
          municipality_id?: string | null
          name?: string
          operating_hours?: string | null
          province_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_checkpoints_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_checkpoints_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_complaints: {
        Row: {
          actions_taken: string | null
          assigned_at: string | null
          assigned_to: string | null
          commune_id: string | null
          complainant_email: string | null
          complainant_name: string | null
          complainant_phone: string | null
          complaint_number: string
          complaint_type: string
          created_at: string
          description: string
          id: string
          infraction_id: string | null
          investigation_notes: string | null
          is_anonymous: boolean | null
          latitude: number | null
          location_description: string
          longitude: number | null
          municipality_id: string | null
          occurrence_date: string | null
          photos: Json | null
          province_id: string | null
          received_at: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
          verification_result: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          actions_taken?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          commune_id?: string | null
          complainant_email?: string | null
          complainant_name?: string | null
          complainant_phone?: string | null
          complaint_number: string
          complaint_type: string
          created_at?: string
          description: string
          id?: string
          infraction_id?: string | null
          investigation_notes?: string | null
          is_anonymous?: boolean | null
          latitude?: number | null
          location_description: string
          longitude?: number | null
          municipality_id?: string | null
          occurrence_date?: string | null
          photos?: Json | null
          province_id?: string | null
          received_at?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
          verification_result?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          actions_taken?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          commune_id?: string | null
          complainant_email?: string | null
          complainant_name?: string | null
          complainant_phone?: string | null
          complaint_number?: string
          complaint_type?: string
          created_at?: string
          description?: string
          id?: string
          infraction_id?: string | null
          investigation_notes?: string | null
          is_anonymous?: boolean | null
          latitude?: number | null
          location_description?: string
          longitude?: number | null
          municipality_id?: string | null
          occurrence_date?: string | null
          photos?: Json | null
          province_id?: string | null
          received_at?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
          verification_result?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_complaints_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_complaints_infraction_id_fkey"
            columns: ["infraction_id"]
            isOneToOne: false
            referencedRelation: "forest_infractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_complaints_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_complaints_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_fee_table: {
        Row: {
          base_fee_aoa: number
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          license_type: Database["public"]["Enums"]["forest_license_type"]
          notes: string | null
          province_id: string | null
          species_category: Database["public"]["Enums"]["forest_species_category"]
          unit: Database["public"]["Enums"]["forest_fee_unit"]
          updated_at: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          base_fee_aoa: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          license_type: Database["public"]["Enums"]["forest_license_type"]
          notes?: string | null
          province_id?: string | null
          species_category?: Database["public"]["Enums"]["forest_species_category"]
          unit?: Database["public"]["Enums"]["forest_fee_unit"]
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          base_fee_aoa?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          license_type?: Database["public"]["Enums"]["forest_license_type"]
          notes?: string | null
          province_id?: string | null
          species_category?: Database["public"]["Enums"]["forest_species_category"]
          unit?: Database["public"]["Enums"]["forest_fee_unit"]
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_fee_table_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_felling_operations: {
        Row: {
          created_at: string
          estimated_volume_m3: number | null
          felled_at: string
          felled_by: string | null
          id: string
          latitude: number | null
          license_id: string
          logs_generated: number
          longitude: number | null
          notes: string | null
          operator_id: string | null
          photos: Json | null
          status: string
          total_log_volume_m3: number
          tree_id: string
          updated_at: string
          variance_pct: number | null
        }
        Insert: {
          created_at?: string
          estimated_volume_m3?: number | null
          felled_at?: string
          felled_by?: string | null
          id?: string
          latitude?: number | null
          license_id: string
          logs_generated?: number
          longitude?: number | null
          notes?: string | null
          operator_id?: string | null
          photos?: Json | null
          status?: string
          total_log_volume_m3?: number
          tree_id: string
          updated_at?: string
          variance_pct?: number | null
        }
        Update: {
          created_at?: string
          estimated_volume_m3?: number | null
          felled_at?: string
          felled_by?: string | null
          id?: string
          latitude?: number | null
          license_id?: string
          logs_generated?: number
          longitude?: number | null
          notes?: string | null
          operator_id?: string | null
          photos?: Json | null
          status?: string
          total_log_volume_m3?: number
          tree_id?: string
          updated_at?: string
          variance_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_felling_operations_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_felling_operations_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_felling_operations_tree_id_fkey"
            columns: ["tree_id"]
            isOneToOne: true
            referencedRelation: "forest_trees"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_import_licenses: {
        Row: {
          address: string | null
          cif_value: number | null
          created_at: string
          created_by: string | null
          currency: string | null
          document_number: string
          document_url: string | null
          email: string | null
          entry_point: string | null
          expiry_date: string | null
          id: string
          importer_name: string
          issue_date: string | null
          issued_location: string | null
          legal_reference: string | null
          license_number: string | null
          notes: string | null
          origin_country: string
          person_type: Database["public"]["Enums"]["import_person_type"]
          phone: string | null
          product_category: Database["public"]["Enums"]["import_product_category"]
          product_description: string
          proforma_invoice_date: string | null
          proforma_invoice_number: string | null
          province_id: string | null
          quantity: number
          requires_phytosanitary_cert: boolean
          status: Database["public"]["Enums"]["import_license_status"]
          unit: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          cif_value?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          document_number: string
          document_url?: string | null
          email?: string | null
          entry_point?: string | null
          expiry_date?: string | null
          id?: string
          importer_name: string
          issue_date?: string | null
          issued_location?: string | null
          legal_reference?: string | null
          license_number?: string | null
          notes?: string | null
          origin_country: string
          person_type: Database["public"]["Enums"]["import_person_type"]
          phone?: string | null
          product_category: Database["public"]["Enums"]["import_product_category"]
          product_description: string
          proforma_invoice_date?: string | null
          proforma_invoice_number?: string | null
          province_id?: string | null
          quantity?: number
          requires_phytosanitary_cert?: boolean
          status?: Database["public"]["Enums"]["import_license_status"]
          unit?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          cif_value?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          document_number?: string
          document_url?: string | null
          email?: string | null
          entry_point?: string | null
          expiry_date?: string | null
          id?: string
          importer_name?: string
          issue_date?: string | null
          issued_location?: string | null
          legal_reference?: string | null
          license_number?: string | null
          notes?: string | null
          origin_country?: string
          person_type?: Database["public"]["Enums"]["import_person_type"]
          phone?: string | null
          product_category?: Database["public"]["Enums"]["import_product_category"]
          product_description?: string
          proforma_invoice_date?: string | null
          proforma_invoice_number?: string | null
          province_id?: string | null
          quantity?: number
          requires_phytosanitary_cert?: boolean
          status?: Database["public"]["Enums"]["import_license_status"]
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_import_licenses_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_infractions: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          closed_by: string | null
          closure_notes: string | null
          contest_date: string | null
          contest_decision: string | null
          contest_decision_date: string | null
          contest_reason: string | null
          contested: boolean | null
          created_at: string
          description: string
          evidence_description: string | null
          fine_amount_aoa: number | null
          fine_paid: boolean | null
          fine_paid_at: string | null
          id: string
          infraction_number: string
          infraction_type: Database["public"]["Enums"]["infraction_type"]
          infractor_address: string | null
          infractor_document: string | null
          infractor_name: string | null
          investigated_at: string | null
          investigation_notes: string | null
          latitude: number | null
          location_description: string | null
          longitude: number | null
          municipality_id: string | null
          occurrence_date: string
          operator_id: string | null
          photos: Json | null
          province_id: string | null
          related_license_id: string | null
          related_transport_id: string | null
          reported_at: string | null
          reported_by: string | null
          sanction_type: string | null
          seized_materials: Json | null
          seized_species: string[] | null
          seized_volume_m3: number | null
          severity: string
          status: Database["public"]["Enums"]["infraction_status"]
          suspension_days: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          closed_by?: string | null
          closure_notes?: string | null
          contest_date?: string | null
          contest_decision?: string | null
          contest_decision_date?: string | null
          contest_reason?: string | null
          contested?: boolean | null
          created_at?: string
          description: string
          evidence_description?: string | null
          fine_amount_aoa?: number | null
          fine_paid?: boolean | null
          fine_paid_at?: string | null
          id?: string
          infraction_number: string
          infraction_type: Database["public"]["Enums"]["infraction_type"]
          infractor_address?: string | null
          infractor_document?: string | null
          infractor_name?: string | null
          investigated_at?: string | null
          investigation_notes?: string | null
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          municipality_id?: string | null
          occurrence_date: string
          operator_id?: string | null
          photos?: Json | null
          province_id?: string | null
          related_license_id?: string | null
          related_transport_id?: string | null
          reported_at?: string | null
          reported_by?: string | null
          sanction_type?: string | null
          seized_materials?: Json | null
          seized_species?: string[] | null
          seized_volume_m3?: number | null
          severity?: string
          status?: Database["public"]["Enums"]["infraction_status"]
          suspension_days?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          closed_by?: string | null
          closure_notes?: string | null
          contest_date?: string | null
          contest_decision?: string | null
          contest_decision_date?: string | null
          contest_reason?: string | null
          contested?: boolean | null
          created_at?: string
          description?: string
          evidence_description?: string | null
          fine_amount_aoa?: number | null
          fine_paid?: boolean | null
          fine_paid_at?: string | null
          id?: string
          infraction_number?: string
          infraction_type?: Database["public"]["Enums"]["infraction_type"]
          infractor_address?: string | null
          infractor_document?: string | null
          infractor_name?: string | null
          investigated_at?: string | null
          investigation_notes?: string | null
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          municipality_id?: string | null
          occurrence_date?: string
          operator_id?: string | null
          photos?: Json | null
          province_id?: string | null
          related_license_id?: string | null
          related_transport_id?: string | null
          reported_at?: string | null
          reported_by?: string | null
          sanction_type?: string | null
          seized_materials?: Json | null
          seized_species?: string[] | null
          seized_volume_m3?: number | null
          severity?: string
          status?: Database["public"]["Enums"]["infraction_status"]
          suspension_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_infractions_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_infractions_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_infractions_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_infractions_related_license_id_fkey"
            columns: ["related_license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_infractions_related_transport_id_fkey"
            columns: ["related_transport_id"]
            isOneToOne: false
            referencedRelation: "forest_transport_permits"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_inventory: {
        Row: {
          annual_allowable_cut_m3: number | null
          boundary_geojson: Json | null
          concession_name: string
          created_at: string
          created_by: string | null
          dominant_species: string[] | null
          estimated_standing_volume_m3: number | null
          exploitation_status: string | null
          forest_status: string
          forest_type: string
          harvestable_volume_m3: number | null
          harvested_volume_m3: number | null
          id: string
          inventory_code: string
          inventory_notes: string | null
          last_inventory_date: string | null
          latitude: number | null
          license_id: string | null
          longitude: number | null
          municipality_id: string | null
          next_inventory_date: string | null
          province_id: string | null
          reposition_rate_pct: number | null
          total_area_ha: number
          trees_planted: number | null
          trees_required: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          annual_allowable_cut_m3?: number | null
          boundary_geojson?: Json | null
          concession_name: string
          created_at?: string
          created_by?: string | null
          dominant_species?: string[] | null
          estimated_standing_volume_m3?: number | null
          exploitation_status?: string | null
          forest_status?: string
          forest_type: string
          harvestable_volume_m3?: number | null
          harvested_volume_m3?: number | null
          id?: string
          inventory_code: string
          inventory_notes?: string | null
          last_inventory_date?: string | null
          latitude?: number | null
          license_id?: string | null
          longitude?: number | null
          municipality_id?: string | null
          next_inventory_date?: string | null
          province_id?: string | null
          reposition_rate_pct?: number | null
          total_area_ha?: number
          trees_planted?: number | null
          trees_required?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          annual_allowable_cut_m3?: number | null
          boundary_geojson?: Json | null
          concession_name?: string
          created_at?: string
          created_by?: string | null
          dominant_species?: string[] | null
          estimated_standing_volume_m3?: number | null
          exploitation_status?: string | null
          forest_status?: string
          forest_type?: string
          harvestable_volume_m3?: number | null
          harvested_volume_m3?: number | null
          id?: string
          inventory_code?: string
          inventory_notes?: string | null
          last_inventory_date?: string | null
          latitude?: number | null
          license_id?: string | null
          longitude?: number | null
          municipality_id?: string | null
          next_inventory_date?: string | null
          province_id?: string | null
          reposition_rate_pct?: number | null
          total_area_ha?: number
          trees_planted?: number | null
          trees_required?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_inventory_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_inventory_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_inventory_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_licenses: {
        Row: {
          application_date: string | null
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          attachments: Json | null
          authorized_species: string[] | null
          authorized_volume_m3: number | null
          commune_id: string | null
          concession_area_ha: number | null
          concession_area_name: string | null
          created_at: string
          created_by: string | null
          expiry_date: string | null
          fee_paid: boolean | null
          harvested_volume_m3: number | null
          id: string
          issue_date: string | null
          latitude: number | null
          license_fee_aoa: number | null
          license_number: string
          license_type: Database["public"]["Enums"]["forest_license_type"]
          longitude: number | null
          municipality_id: string | null
          notes: string | null
          operator_id: string
          payment_date: string | null
          payment_reference: string | null
          province_id: string | null
          qr_code_data: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["forest_license_status"]
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
          updated_by: string | null
          verification_url: string | null
        }
        Insert: {
          application_date?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attachments?: Json | null
          authorized_species?: string[] | null
          authorized_volume_m3?: number | null
          commune_id?: string | null
          concession_area_ha?: number | null
          concession_area_name?: string | null
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          fee_paid?: boolean | null
          harvested_volume_m3?: number | null
          id?: string
          issue_date?: string | null
          latitude?: number | null
          license_fee_aoa?: number | null
          license_number: string
          license_type: Database["public"]["Enums"]["forest_license_type"]
          longitude?: number | null
          municipality_id?: string | null
          notes?: string | null
          operator_id: string
          payment_date?: string | null
          payment_reference?: string | null
          province_id?: string | null
          qr_code_data?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["forest_license_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          updated_by?: string | null
          verification_url?: string | null
        }
        Update: {
          application_date?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attachments?: Json | null
          authorized_species?: string[] | null
          authorized_volume_m3?: number | null
          commune_id?: string | null
          concession_area_ha?: number | null
          concession_area_name?: string | null
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          fee_paid?: boolean | null
          harvested_volume_m3?: number | null
          id?: string
          issue_date?: string | null
          latitude?: number | null
          license_fee_aoa?: number | null
          license_number?: string
          license_type?: Database["public"]["Enums"]["forest_license_type"]
          longitude?: number | null
          municipality_id?: string | null
          notes?: string | null
          operator_id?: string
          payment_date?: string | null
          payment_reference?: string | null
          province_id?: string | null
          qr_code_data?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["forest_license_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          updated_by?: string | null
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_licenses_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_licenses_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_licenses_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_licenses_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_logs: {
        Row: {
          created_at: string
          current_latitude: number | null
          current_location_name: string | null
          current_longitude: number | null
          destination_name: string | null
          destination_sawmill_id: string | null
          diameter_cm: number | null
          id: string
          length_m: number | null
          license_id: string
          log_code: string
          logged_at: string | null
          logged_by: string | null
          notes: string | null
          photos: Json | null
          qr_code_data: string | null
          species: string
          status: Database["public"]["Enums"]["tracking_status"]
          tree_id: string | null
          updated_at: string
          volume_m3: number
          wood_class: Database["public"]["Enums"]["wood_classification"]
        }
        Insert: {
          created_at?: string
          current_latitude?: number | null
          current_location_name?: string | null
          current_longitude?: number | null
          destination_name?: string | null
          destination_sawmill_id?: string | null
          diameter_cm?: number | null
          id?: string
          length_m?: number | null
          license_id: string
          log_code: string
          logged_at?: string | null
          logged_by?: string | null
          notes?: string | null
          photos?: Json | null
          qr_code_data?: string | null
          species: string
          status?: Database["public"]["Enums"]["tracking_status"]
          tree_id?: string | null
          updated_at?: string
          volume_m3: number
          wood_class: Database["public"]["Enums"]["wood_classification"]
        }
        Update: {
          created_at?: string
          current_latitude?: number | null
          current_location_name?: string | null
          current_longitude?: number | null
          destination_name?: string | null
          destination_sawmill_id?: string | null
          diameter_cm?: number | null
          id?: string
          length_m?: number | null
          license_id?: string
          log_code?: string
          logged_at?: string | null
          logged_by?: string | null
          notes?: string | null
          photos?: Json | null
          qr_code_data?: string | null
          species?: string
          status?: Database["public"]["Enums"]["tracking_status"]
          tree_id?: string | null
          updated_at?: string
          volume_m3?: number
          wood_class?: Database["public"]["Enums"]["wood_classification"]
        }
        Relationships: [
          {
            foreignKeyName: "forest_logs_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_logs_tree_id_fkey"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "forest_trees"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_management_plans: {
        Row: {
          annual_allowable_cut_m3: number | null
          approved_at: string | null
          approved_by: string | null
          attachments: Json | null
          created_at: string
          created_by: string | null
          cutting_cycle_years: number | null
          end_date: string | null
          eudr_compliant: boolean | null
          eudr_evidence: Json | null
          geometry: Json | null
          id: string
          license_id: string | null
          municipality_id: string | null
          notes: string | null
          operator_id: string | null
          plan_number: string | null
          productive_area_ha: number | null
          province_id: string | null
          species: Json | null
          start_date: string | null
          status: string
          title: string
          total_area_ha: number
          updated_at: string
        }
        Insert: {
          annual_allowable_cut_m3?: number | null
          approved_at?: string | null
          approved_by?: string | null
          attachments?: Json | null
          created_at?: string
          created_by?: string | null
          cutting_cycle_years?: number | null
          end_date?: string | null
          eudr_compliant?: boolean | null
          eudr_evidence?: Json | null
          geometry?: Json | null
          id?: string
          license_id?: string | null
          municipality_id?: string | null
          notes?: string | null
          operator_id?: string | null
          plan_number?: string | null
          productive_area_ha?: number | null
          province_id?: string | null
          species?: Json | null
          start_date?: string | null
          status?: string
          title: string
          total_area_ha?: number
          updated_at?: string
        }
        Update: {
          annual_allowable_cut_m3?: number | null
          approved_at?: string | null
          approved_by?: string | null
          attachments?: Json | null
          created_at?: string
          created_by?: string | null
          cutting_cycle_years?: number | null
          end_date?: string | null
          eudr_compliant?: boolean | null
          eudr_evidence?: Json | null
          geometry?: Json | null
          id?: string
          license_id?: string | null
          municipality_id?: string | null
          notes?: string | null
          operator_id?: string | null
          plan_number?: string | null
          productive_area_ha?: number | null
          province_id?: string | null
          species?: Json | null
          start_date?: string | null
          status?: string
          title?: string
          total_area_ha?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_management_plans_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_management_plans_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_management_plans_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_management_plans_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_nurseries: {
        Row: {
          address: string | null
          area_ha: number | null
          capacity_seedlings: number | null
          code: string
          created_at: string
          current_stock: number | null
          email: string | null
          established_date: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          manager_name: string | null
          municipality_id: string | null
          name: string
          notes: string | null
          nursery_type: string
          operator_id: string | null
          phone: string | null
          photos: Json | null
          province_id: string | null
          species_produced: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          area_ha?: number | null
          capacity_seedlings?: number | null
          code: string
          created_at?: string
          current_stock?: number | null
          email?: string | null
          established_date?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          manager_name?: string | null
          municipality_id?: string | null
          name: string
          notes?: string | null
          nursery_type?: string
          operator_id?: string | null
          phone?: string | null
          photos?: Json | null
          province_id?: string | null
          species_produced?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          area_ha?: number | null
          capacity_seedlings?: number | null
          code?: string
          created_at?: string
          current_stock?: number | null
          email?: string | null
          established_date?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          manager_name?: string | null
          municipality_id?: string | null
          name?: string
          notes?: string | null
          nursery_type?: string
          operator_id?: string | null
          phone?: string | null
          photos?: Json | null
          province_id?: string | null
          species_produced?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_nurseries_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_nurseries_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_nurseries_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_occurrences: {
        Row: {
          affected_area_ha: number | null
          attachments: Json | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          municipality_id: string | null
          occurrence_number: string | null
          occurrence_type: string
          province_id: string | null
          reported_at: string
          reported_by: string | null
          resolution_notes: string | null
          resolved_at: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          affected_area_ha?: number | null
          attachments?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipality_id?: string | null
          occurrence_number?: string | null
          occurrence_type: string
          province_id?: string | null
          reported_at?: string
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          affected_area_ha?: number | null
          attachments?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipality_id?: string | null
          occurrence_number?: string | null
          occurrence_type?: string
          province_id?: string | null
          reported_at?: string
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_occurrences_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_occurrences_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_operators: {
        Row: {
          address: string | null
          authorized_activities: string[]
          created_at: string
          created_by: string | null
          documents: Json
          email: string | null
          id: string
          is_active: boolean | null
          legal_form: string | null
          legal_representative: string | null
          legal_representatives: Json
          license_class: string | null
          municipality_id: string | null
          name: string
          nif: string
          notes: string | null
          operator_type: string
          phone: string | null
          province_id: string | null
          registration_date: string
          registration_number: string | null
          status: Database["public"]["Enums"]["forest_operator_status"]
          trade_name: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          authorized_activities?: string[]
          created_at?: string
          created_by?: string | null
          documents?: Json
          email?: string | null
          id?: string
          is_active?: boolean | null
          legal_form?: string | null
          legal_representative?: string | null
          legal_representatives?: Json
          license_class?: string | null
          municipality_id?: string | null
          name: string
          nif: string
          notes?: string | null
          operator_type?: string
          phone?: string | null
          province_id?: string | null
          registration_date?: string
          registration_number?: string | null
          status?: Database["public"]["Enums"]["forest_operator_status"]
          trade_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          authorized_activities?: string[]
          created_at?: string
          created_by?: string | null
          documents?: Json
          email?: string | null
          id?: string
          is_active?: boolean | null
          legal_form?: string | null
          legal_representative?: string | null
          legal_representatives?: Json
          license_class?: string | null
          municipality_id?: string | null
          name?: string
          nif?: string
          notes?: string | null
          operator_type?: string
          phone?: string | null
          province_id?: string | null
          registration_date?: string
          registration_number?: string | null
          status?: Database["public"]["Enums"]["forest_operator_status"]
          trade_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_operators_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_operators_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_payment_transactions: {
        Row: {
          agt_reference: string | null
          agt_response: Json | null
          base_amount_aoa: number
          created_at: string
          created_by: string | null
          duc_due_date: string | null
          duc_issued_at: string | null
          duc_number: string | null
          duc_payer_name: string | null
          duc_payer_nif: string | null
          duc_payment_channel: string | null
          id: string
          license_id: string | null
          notes: string | null
          operator_id: string | null
          paid_at: string | null
          permit_id: string | null
          province_id: string | null
          reference_type: string
          status: string
          surcharge_rl_aoa: number
          total_amount_aoa: number | null
          transaction_number: string | null
          updated_at: string
        }
        Insert: {
          agt_reference?: string | null
          agt_response?: Json | null
          base_amount_aoa?: number
          created_at?: string
          created_by?: string | null
          duc_due_date?: string | null
          duc_issued_at?: string | null
          duc_number?: string | null
          duc_payer_name?: string | null
          duc_payer_nif?: string | null
          duc_payment_channel?: string | null
          id?: string
          license_id?: string | null
          notes?: string | null
          operator_id?: string | null
          paid_at?: string | null
          permit_id?: string | null
          province_id?: string | null
          reference_type: string
          status?: string
          surcharge_rl_aoa?: number
          total_amount_aoa?: number | null
          transaction_number?: string | null
          updated_at?: string
        }
        Update: {
          agt_reference?: string | null
          agt_response?: Json | null
          base_amount_aoa?: number
          created_at?: string
          created_by?: string | null
          duc_due_date?: string | null
          duc_issued_at?: string | null
          duc_number?: string | null
          duc_payer_name?: string | null
          duc_payer_nif?: string | null
          duc_payment_channel?: string | null
          id?: string
          license_id?: string | null
          notes?: string | null
          operator_id?: string | null
          paid_at?: string | null
          permit_id?: string | null
          province_id?: string | null
          reference_type?: string
          status?: string
          surcharge_rl_aoa?: number
          total_amount_aoa?: number | null
          transaction_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_payment_transactions_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_payment_transactions_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_payment_transactions_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "forest_transport_permits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_payment_transactions_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_products: {
        Row: {
          batch_id: string
          created_at: string
          destination: string | null
          id: string
          length_m: number | null
          notes: string | null
          parent_log_id: string | null
          product_code: string | null
          product_type: Database["public"]["Enums"]["forest_product_type"]
          qr_code: string | null
          quantity: number
          species: string
          status: Database["public"]["Enums"]["forest_product_status"]
          thickness_cm: number | null
          updated_at: string
          volume_m3: number
          width_cm: number | null
        }
        Insert: {
          batch_id: string
          created_at?: string
          destination?: string | null
          id?: string
          length_m?: number | null
          notes?: string | null
          parent_log_id?: string | null
          product_code?: string | null
          product_type: Database["public"]["Enums"]["forest_product_type"]
          qr_code?: string | null
          quantity?: number
          species: string
          status?: Database["public"]["Enums"]["forest_product_status"]
          thickness_cm?: number | null
          updated_at?: string
          volume_m3: number
          width_cm?: number | null
        }
        Update: {
          batch_id?: string
          created_at?: string
          destination?: string | null
          id?: string
          length_m?: number | null
          notes?: string | null
          parent_log_id?: string | null
          product_code?: string | null
          product_type?: Database["public"]["Enums"]["forest_product_type"]
          qr_code?: string | null
          quantity?: number
          species?: string
          status?: Database["public"]["Enums"]["forest_product_status"]
          thickness_cm?: number | null
          updated_at?: string
          volume_m3?: number
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_products_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "forest_transformation_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_products_parent_log_id_fkey"
            columns: ["parent_log_id"]
            isOneToOne: false
            referencedRelation: "forest_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_reforestation_activities: {
        Row: {
          activity_date: string
          activity_type: string
          area_covered_ha: number | null
          cost_aoa: number | null
          created_at: string
          created_by: string | null
          id: string
          mortality_count: number | null
          nursery_id: string | null
          observations: string | null
          photos: Json | null
          program_id: string
          seedlings_planted: number | null
          seedlings_replaced: number | null
          species_planted: Json | null
          survival_count: number | null
          team_leader: string | null
          team_size: number | null
        }
        Insert: {
          activity_date: string
          activity_type: string
          area_covered_ha?: number | null
          cost_aoa?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          mortality_count?: number | null
          nursery_id?: string | null
          observations?: string | null
          photos?: Json | null
          program_id: string
          seedlings_planted?: number | null
          seedlings_replaced?: number | null
          species_planted?: Json | null
          survival_count?: number | null
          team_leader?: string | null
          team_size?: number | null
        }
        Update: {
          activity_date?: string
          activity_type?: string
          area_covered_ha?: number | null
          cost_aoa?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          mortality_count?: number | null
          nursery_id?: string | null
          observations?: string | null
          photos?: Json | null
          program_id?: string
          seedlings_planted?: number | null
          seedlings_replaced?: number | null
          species_planted?: Json | null
          survival_count?: number | null
          team_leader?: string | null
          team_size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_reforestation_activities_nursery_id_fkey"
            columns: ["nursery_id"]
            isOneToOne: false
            referencedRelation: "forest_nurseries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_reforestation_activities_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "forest_reforestation_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_reforestation_programs: {
        Row: {
          actual_end_date: string | null
          area_polygon: Json | null
          budget_aoa: number | null
          code: string
          coordinator_name: string | null
          coordinator_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          documents: Json | null
          id: string
          implementing_entity: string | null
          latitude: number | null
          longitude: number | null
          municipality_id: string | null
          name: string
          objectives: string | null
          photos: Json | null
          planted_area_ha: number | null
          planted_seedlings: number | null
          program_type: string
          province_id: string | null
          spent_aoa: number | null
          start_date: string
          status: string
          survival_rate: number | null
          target_area_ha: number
          target_end_date: string | null
          target_seedlings: number
          target_species: string[] | null
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          area_polygon?: Json | null
          budget_aoa?: number | null
          code: string
          coordinator_name?: string | null
          coordinator_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          documents?: Json | null
          id?: string
          implementing_entity?: string | null
          latitude?: number | null
          longitude?: number | null
          municipality_id?: string | null
          name: string
          objectives?: string | null
          photos?: Json | null
          planted_area_ha?: number | null
          planted_seedlings?: number | null
          program_type?: string
          province_id?: string | null
          spent_aoa?: number | null
          start_date: string
          status?: string
          survival_rate?: number | null
          target_area_ha: number
          target_end_date?: string | null
          target_seedlings: number
          target_species?: string[] | null
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          area_polygon?: Json | null
          budget_aoa?: number | null
          code?: string
          coordinator_name?: string | null
          coordinator_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          documents?: Json | null
          id?: string
          implementing_entity?: string | null
          latitude?: number | null
          longitude?: number | null
          municipality_id?: string | null
          name?: string
          objectives?: string | null
          photos?: Json | null
          planted_area_ha?: number | null
          planted_seedlings?: number | null
          program_type?: string
          province_id?: string | null
          spent_aoa?: number | null
          start_date?: string
          status?: string
          survival_rate?: number | null
          target_area_ha?: number
          target_end_date?: string | null
          target_seedlings?: number
          target_species?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_reforestation_programs_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_reforestation_programs_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_sawmills: {
        Row: {
          address: string | null
          authorized_loss_pct: number
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          monthly_capacity_m3: number | null
          municipality_id: string | null
          name: string
          nif: string | null
          notes: string | null
          operator_id: string | null
          province_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          authorized_loss_pct?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          monthly_capacity_m3?: number | null
          municipality_id?: string | null
          name: string
          nif?: string | null
          notes?: string | null
          operator_id?: string | null
          province_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          authorized_loss_pct?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          monthly_capacity_m3?: number | null
          municipality_id?: string | null
          name?: string
          nif?: string | null
          notes?: string | null
          operator_id?: string | null
          province_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_sawmills_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_sawmills_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_sawmills_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_seedling_stock: {
        Row: {
          age_months: number | null
          cost_per_unit_aoa: number | null
          created_at: string
          expected_ready_date: string | null
          height_cm_avg: number | null
          id: string
          notes: string | null
          nursery_id: string
          production_date: string | null
          quantity: number
          ready_for_planting: boolean | null
          species: string
          updated_at: string
          variety: string | null
          wood_class: Database["public"]["Enums"]["wood_classification"] | null
        }
        Insert: {
          age_months?: number | null
          cost_per_unit_aoa?: number | null
          created_at?: string
          expected_ready_date?: string | null
          height_cm_avg?: number | null
          id?: string
          notes?: string | null
          nursery_id: string
          production_date?: string | null
          quantity: number
          ready_for_planting?: boolean | null
          species: string
          updated_at?: string
          variety?: string | null
          wood_class?: Database["public"]["Enums"]["wood_classification"] | null
        }
        Update: {
          age_months?: number | null
          cost_per_unit_aoa?: number | null
          created_at?: string
          expected_ready_date?: string | null
          height_cm_avg?: number | null
          id?: string
          notes?: string | null
          nursery_id?: string
          production_date?: string | null
          quantity?: number
          ready_for_planting?: boolean | null
          species?: string
          updated_at?: string
          variety?: string | null
          wood_class?: Database["public"]["Enums"]["wood_classification"] | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_seedling_stock_nursery_id_fkey"
            columns: ["nursery_id"]
            isOneToOne: false
            referencedRelation: "forest_nurseries"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_tags: {
        Row: {
          created_at: string
          entity_id: string
          entity_kind: Database["public"]["Enums"]["tag_entity_kind"]
          id: string
          issued_at: string
          issued_by: string | null
          metadata: Json | null
          notes: string | null
          revoke_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          status: Database["public"]["Enums"]["tag_status"]
          tag_code: string
          tag_kind: Database["public"]["Enums"]["tag_kind"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_kind: Database["public"]["Enums"]["tag_entity_kind"]
          id?: string
          issued_at?: string
          issued_by?: string | null
          metadata?: Json | null
          notes?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          status?: Database["public"]["Enums"]["tag_status"]
          tag_code: string
          tag_kind: Database["public"]["Enums"]["tag_kind"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_kind?: Database["public"]["Enums"]["tag_entity_kind"]
          id?: string
          issued_at?: string
          issued_by?: string | null
          metadata?: Json | null
          notes?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          status?: Database["public"]["Enums"]["tag_status"]
          tag_code?: string
          tag_kind?: Database["public"]["Enums"]["tag_kind"]
          updated_at?: string
        }
        Relationships: []
      }
      forest_transformation_batches: {
        Row: {
          batch_code: string | null
          created_at: string
          finished_at: string | null
          id: string
          loss_pct: number
          notes: string | null
          sawmill_id: string
          started_at: string
          status: Database["public"]["Enums"]["forest_transformation_status"]
          technician_id: string | null
          total_input_m3: number
          total_output_m3: number
          updated_at: string
          variance_flagged: boolean
        }
        Insert: {
          batch_code?: string | null
          created_at?: string
          finished_at?: string | null
          id?: string
          loss_pct?: number
          notes?: string | null
          sawmill_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["forest_transformation_status"]
          technician_id?: string | null
          total_input_m3?: number
          total_output_m3?: number
          updated_at?: string
          variance_flagged?: boolean
        }
        Update: {
          batch_code?: string | null
          created_at?: string
          finished_at?: string | null
          id?: string
          loss_pct?: number
          notes?: string | null
          sawmill_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["forest_transformation_status"]
          technician_id?: string | null
          total_input_m3?: number
          total_output_m3?: number
          updated_at?: string
          variance_flagged?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "forest_transformation_batches_sawmill_id_fkey"
            columns: ["sawmill_id"]
            isOneToOne: false
            referencedRelation: "forest_sawmills"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_transformation_inputs: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          log_id: string
          volume_used_m3: number
        }
        Insert: {
          batch_id: string
          created_at?: string
          id?: string
          log_id: string
          volume_used_m3: number
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          log_id?: string
          volume_used_m3?: number
        }
        Relationships: [
          {
            foreignKeyName: "forest_transformation_inputs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "forest_transformation_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_transformation_inputs_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "forest_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_transport_checkpoints: {
        Row: {
          checkpoint_name: string
          created_at: string
          distance_from_corridor_km: number | null
          flags: Json | null
          id: string
          is_within_corridor: boolean | null
          is_within_validity: boolean | null
          latitude: number | null
          longitude: number | null
          observations: string | null
          permit_id: string
          scanned_at: string
          scanned_by: string | null
        }
        Insert: {
          checkpoint_name: string
          created_at?: string
          distance_from_corridor_km?: number | null
          flags?: Json | null
          id?: string
          is_within_corridor?: boolean | null
          is_within_validity?: boolean | null
          latitude?: number | null
          longitude?: number | null
          observations?: string | null
          permit_id: string
          scanned_at?: string
          scanned_by?: string | null
        }
        Update: {
          checkpoint_name?: string
          created_at?: string
          distance_from_corridor_km?: number | null
          flags?: Json | null
          id?: string
          is_within_corridor?: boolean | null
          is_within_validity?: boolean | null
          latitude?: number | null
          longitude?: number | null
          observations?: string | null
          permit_id?: string
          scanned_at?: string
          scanned_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forest_transport_checkpoints_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "forest_transport_permits"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_transport_permits: {
        Row: {
          arrival_at: string | null
          checkpoints_passed: Json | null
          created_at: string
          created_by: string | null
          departure_at: string | null
          destination_latitude: number | null
          destination_location: string
          destination_longitude: number | null
          destination_province_id: string | null
          driver_document: string | null
          driver_name: string
          driver_phone: string | null
          id: string
          issue_date: string
          license_id: string
          log_ids: string[] | null
          notes: string | null
          operator_id: string
          origin_latitude: number | null
          origin_location: string
          origin_longitude: number | null
          origin_province_id: string | null
          permit_number: string
          qr_code_data: string | null
          species_summary: Json | null
          status: string
          total_logs: number | null
          total_volume_m3: number | null
          updated_at: string
          valid_until: string
          vehicle_plate: string
        }
        Insert: {
          arrival_at?: string | null
          checkpoints_passed?: Json | null
          created_at?: string
          created_by?: string | null
          departure_at?: string | null
          destination_latitude?: number | null
          destination_location: string
          destination_longitude?: number | null
          destination_province_id?: string | null
          driver_document?: string | null
          driver_name: string
          driver_phone?: string | null
          id?: string
          issue_date: string
          license_id: string
          log_ids?: string[] | null
          notes?: string | null
          operator_id: string
          origin_latitude?: number | null
          origin_location: string
          origin_longitude?: number | null
          origin_province_id?: string | null
          permit_number: string
          qr_code_data?: string | null
          species_summary?: Json | null
          status?: string
          total_logs?: number | null
          total_volume_m3?: number | null
          updated_at?: string
          valid_until: string
          vehicle_plate: string
        }
        Update: {
          arrival_at?: string | null
          checkpoints_passed?: Json | null
          created_at?: string
          created_by?: string | null
          departure_at?: string | null
          destination_latitude?: number | null
          destination_location?: string
          destination_longitude?: number | null
          destination_province_id?: string | null
          driver_document?: string | null
          driver_name?: string
          driver_phone?: string | null
          id?: string
          issue_date?: string
          license_id?: string
          log_ids?: string[] | null
          notes?: string | null
          operator_id?: string
          origin_latitude?: number | null
          origin_location?: string
          origin_longitude?: number | null
          origin_province_id?: string | null
          permit_number?: string
          qr_code_data?: string | null
          species_summary?: Json | null
          status?: string
          total_logs?: number | null
          total_volume_m3?: number | null
          updated_at?: string
          valid_until?: string
          vehicle_plate?: string
        }
        Relationships: [
          {
            foreignKeyName: "forest_transport_permits_destination_province_id_fkey"
            columns: ["destination_province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_transport_permits_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_transport_permits_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forest_transport_permits_origin_province_id_fkey"
            columns: ["origin_province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      forest_trees: {
        Row: {
          actual_volume_m3: number | null
          created_at: string
          diameter_cm: number | null
          estimated_volume_m3: number | null
          felled_at: string | null
          felled_by: string | null
          health_status: string | null
          height_m: number | null
          id: string
          latitude: number
          license_id: string
          longitude: number
          marked_at: string | null
          marked_by: string | null
          national_code: string | null
          notes: string | null
          photos: Json | null
          plot_number: string | null
          species: string
          status: Database["public"]["Enums"]["tracking_status"]
          tree_code: string
          updated_at: string
          wood_class: Database["public"]["Enums"]["wood_classification"]
        }
        Insert: {
          actual_volume_m3?: number | null
          created_at?: string
          diameter_cm?: number | null
          estimated_volume_m3?: number | null
          felled_at?: string | null
          felled_by?: string | null
          health_status?: string | null
          height_m?: number | null
          id?: string
          latitude: number
          license_id: string
          longitude: number
          marked_at?: string | null
          marked_by?: string | null
          national_code?: string | null
          notes?: string | null
          photos?: Json | null
          plot_number?: string | null
          species: string
          status?: Database["public"]["Enums"]["tracking_status"]
          tree_code: string
          updated_at?: string
          wood_class: Database["public"]["Enums"]["wood_classification"]
        }
        Update: {
          actual_volume_m3?: number | null
          created_at?: string
          diameter_cm?: number | null
          estimated_volume_m3?: number | null
          felled_at?: string | null
          felled_by?: string | null
          health_status?: string | null
          height_m?: number | null
          id?: string
          latitude?: number
          license_id?: string
          longitude?: number
          marked_at?: string | null
          marked_by?: string | null
          national_code?: string | null
          notes?: string | null
          photos?: Json | null
          plot_number?: string | null
          species?: string
          status?: Database["public"]["Enums"]["tracking_status"]
          tree_code?: string
          updated_at?: string
          wood_class?: Database["public"]["Enums"]["wood_classification"]
        }
        Relationships: [
          {
            foreignKeyName: "forest_trees_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      forestry_campaigns: {
        Row: {
          created_at: string
          created_by: string | null
          diploma_reference: string | null
          end_date: string
          id: string
          name: string
          notes: string | null
          start_date: string
          status: Database["public"]["Enums"]["forestry_campaign_status"]
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          diploma_reference?: string | null
          end_date: string
          id?: string
          name: string
          notes?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["forestry_campaign_status"]
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          diploma_reference?: string | null
          end_date?: string
          id?: string
          name?: string
          notes?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["forestry_campaign_status"]
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      forestry_compliance_rules: {
        Row: {
          campaign_id: string
          code: string
          config: Json
          created_at: string
          description: string
          id: string
          is_active: boolean
          scope: string
          severity: Database["public"]["Enums"]["forestry_rule_severity"]
          updated_at: string
        }
        Insert: {
          campaign_id: string
          code: string
          config?: Json
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          scope: string
          severity?: Database["public"]["Enums"]["forestry_rule_severity"]
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          code?: string
          config?: Json
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          scope?: string
          severity?: Database["public"]["Enums"]["forestry_rule_severity"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forestry_compliance_rules_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      forestry_compliance_violations: {
        Row: {
          attempted_by: string | null
          campaign_id: string | null
          created_at: string
          id: string
          payload: Json
          reason: string
          rule_code: string
          severity: string
          target_id: string | null
          target_table: string
        }
        Insert: {
          attempted_by?: string | null
          campaign_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          reason: string
          rule_code: string
          severity: string
          target_id?: string | null
          target_table: string
        }
        Update: {
          attempted_by?: string | null
          campaign_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          reason?: string
          rule_code?: string
          severity?: string
          target_id?: string | null
          target_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "forestry_compliance_violations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      forestry_export_processes: {
        Row: {
          campaign_id: string
          certificate_of_origin_id: string | null
          created_at: string
          created_by: string | null
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          declared_fob_price_usd: number | null
          declared_quantity: number | null
          declared_volume_m3: number | null
          destination_country: string
          eudr_batch_id: string | null
          id: string
          issued_at: string | null
          issued_by: string | null
          market_block: string
          notes: string | null
          operator_id: string | null
          phytosanitary_doc_url: string | null
          process_number: string | null
          product_form: Database["public"]["Enums"]["forestry_product_form"]
          qr_token: string | null
          species_id: string | null
          status: Database["public"]["Enums"]["forestry_export_status"]
          submitted_at: string | null
          unit: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          campaign_id: string
          certificate_of_origin_id?: string | null
          created_at?: string
          created_by?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_notes?: string | null
          declared_fob_price_usd?: number | null
          declared_quantity?: number | null
          declared_volume_m3?: number | null
          destination_country: string
          eudr_batch_id?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          market_block?: string
          notes?: string | null
          operator_id?: string | null
          phytosanitary_doc_url?: string | null
          process_number?: string | null
          product_form: Database["public"]["Enums"]["forestry_product_form"]
          qr_token?: string | null
          species_id?: string | null
          status?: Database["public"]["Enums"]["forestry_export_status"]
          submitted_at?: string | null
          unit?: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          campaign_id?: string
          certificate_of_origin_id?: string | null
          created_at?: string
          created_by?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_notes?: string | null
          declared_fob_price_usd?: number | null
          declared_quantity?: number | null
          declared_volume_m3?: number | null
          destination_country?: string
          eudr_batch_id?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          market_block?: string
          notes?: string | null
          operator_id?: string | null
          phytosanitary_doc_url?: string | null
          process_number?: string | null
          product_form?: Database["public"]["Enums"]["forestry_product_form"]
          qr_token?: string | null
          species_id?: string | null
          status?: Database["public"]["Enums"]["forestry_export_status"]
          submitted_at?: string | null
          unit?: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forestry_export_processes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_export_processes_certificate_of_origin_id_fkey"
            columns: ["certificate_of_origin_id"]
            isOneToOne: false
            referencedRelation: "forest_certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_export_processes_eudr_batch_id_fkey"
            columns: ["eudr_batch_id"]
            isOneToOne: false
            referencedRelation: "eudr_approval_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_export_processes_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_export_processes_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "forestry_species"
            referencedColumns: ["id"]
          },
        ]
      }
      forestry_global_parameters: {
        Row: {
          campaign_id: string
          confirmed: boolean
          created_at: string
          eudr_markets: string[]
          id: string
          notes: string | null
          raw_export_definition: string | null
          suspension_diploma: string | null
          suspension_end_date: string | null
          suspension_export_raw: Database["public"]["Enums"]["forestry_suspension_status"]
          suspension_start_date: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          campaign_id: string
          confirmed?: boolean
          created_at?: string
          eudr_markets?: string[]
          id?: string
          notes?: string | null
          raw_export_definition?: string | null
          suspension_diploma?: string | null
          suspension_end_date?: string | null
          suspension_export_raw?: Database["public"]["Enums"]["forestry_suspension_status"]
          suspension_start_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          campaign_id?: string
          confirmed?: boolean
          created_at?: string
          eudr_markets?: string[]
          id?: string
          notes?: string | null
          raw_export_definition?: string | null
          suspension_diploma?: string | null
          suspension_end_date?: string | null
          suspension_export_raw?: Database["public"]["Enums"]["forestry_suspension_status"]
          suspension_start_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forestry_global_parameters_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: true
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      forestry_pfnl_harvests: {
        Row: {
          campaign_id: string
          created_at: string
          created_by: string | null
          harvest_date: string
          harvest_number: string | null
          id: string
          latitude: number | null
          license_id: string | null
          longitude: number | null
          municipality_id: string | null
          notes: string | null
          operator_id: string | null
          product_kind: string
          province_id: string | null
          qr_token: string | null
          quantity: number
          species_id: string | null
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          created_by?: string | null
          harvest_date?: string
          harvest_number?: string | null
          id?: string
          latitude?: number | null
          license_id?: string | null
          longitude?: number | null
          municipality_id?: string | null
          notes?: string | null
          operator_id?: string | null
          product_kind: string
          province_id?: string | null
          qr_token?: string | null
          quantity: number
          species_id?: string | null
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          created_by?: string | null
          harvest_date?: string
          harvest_number?: string | null
          id?: string
          latitude?: number | null
          license_id?: string | null
          longitude?: number | null
          municipality_id?: string | null
          notes?: string | null
          operator_id?: string | null
          product_kind?: string
          province_id?: string | null
          qr_token?: string | null
          quantity?: number
          species_id?: string | null
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forestry_pfnl_harvests_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_pfnl_harvests_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_pfnl_harvests_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_pfnl_harvests_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_pfnl_harvests_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_pfnl_harvests_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "forestry_species"
            referencedColumns: ["id"]
          },
        ]
      }
      forestry_public_scan_log: {
        Row: {
          id: string
          ip_hash: string | null
          qr_token: string
          scanned_at: string
          user_agent: string | null
        }
        Insert: {
          id?: string
          ip_hash?: string | null
          qr_token: string
          scanned_at?: string
          user_agent?: string | null
        }
        Update: {
          id?: string
          ip_hash?: string | null
          qr_token?: string
          scanned_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      forestry_quota_ledger: {
        Row: {
          campaign_id: string
          created_at: string
          created_by: string | null
          id: string
          license_id: string | null
          movement_type: Database["public"]["Enums"]["forestry_quota_movement"]
          notes: string | null
          province_id: string | null
          reference_id: string | null
          reference_table: string | null
          species_id: string | null
          unit: string
          volume_m3: number
        }
        Insert: {
          campaign_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          license_id?: string | null
          movement_type: Database["public"]["Enums"]["forestry_quota_movement"]
          notes?: string | null
          province_id?: string | null
          reference_id?: string | null
          reference_table?: string | null
          species_id?: string | null
          unit?: string
          volume_m3: number
        }
        Update: {
          campaign_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          license_id?: string | null
          movement_type?: Database["public"]["Enums"]["forestry_quota_movement"]
          notes?: string | null
          province_id?: string | null
          reference_id?: string | null
          reference_table?: string | null
          species_id?: string | null
          unit?: string
          volume_m3?: number
        }
        Relationships: [
          {
            foreignKeyName: "forestry_quota_ledger_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_quota_ledger_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_quota_ledger_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_quota_ledger_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "forestry_species"
            referencedColumns: ["id"]
          },
        ]
      }
      forestry_quotas: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          notes: string | null
          product_kind: Database["public"]["Enums"]["forestry_product_kind"]
          province_id: string
          quantity: number
          species_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          notes?: string | null
          product_kind: Database["public"]["Enums"]["forestry_product_kind"]
          province_id: string
          quantity: number
          species_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          product_kind?: Database["public"]["Enums"]["forestry_product_kind"]
          province_id?: string
          quantity?: number
          species_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forestry_quotas_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_quotas_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_quotas_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "forestry_species"
            referencedColumns: ["id"]
          },
        ]
      }
      forestry_species: {
        Row: {
          category: string
          common_name: string
          created_at: string
          id: string
          is_forbidden: boolean
          local_names: string[] | null
          notes: string | null
          rarity_status: string | null
          scientific_name: string
          updated_at: string
        }
        Insert: {
          category?: string
          common_name: string
          created_at?: string
          id?: string
          is_forbidden?: boolean
          local_names?: string[] | null
          notes?: string | null
          rarity_status?: string | null
          scientific_name: string
          updated_at?: string
        }
        Update: {
          category?: string
          common_name?: string
          created_at?: string
          id?: string
          is_forbidden?: boolean
          local_names?: string[] | null
          notes?: string | null
          rarity_status?: string | null
          scientific_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      forestry_species_parameters: {
        Row: {
          campaign_id: string
          created_at: string
          dap_min_cm: number | null
          defeso_end_month: number | null
          defeso_start_month: number | null
          id: string
          max_conversion_ratio: number | null
          min_price_export_usd: number | null
          min_price_internal_aoa: number | null
          notes: string | null
          province_id: string | null
          species_id: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          dap_min_cm?: number | null
          defeso_end_month?: number | null
          defeso_start_month?: number | null
          id?: string
          max_conversion_ratio?: number | null
          min_price_export_usd?: number | null
          min_price_internal_aoa?: number | null
          notes?: string | null
          province_id?: string | null
          species_id: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          dap_min_cm?: number | null
          defeso_end_month?: number | null
          defeso_start_month?: number | null
          id?: string
          max_conversion_ratio?: number | null
          min_price_export_usd?: number | null
          min_price_internal_aoa?: number | null
          notes?: string | null
          province_id?: string | null
          species_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forestry_species_parameters_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_species_parameters_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_species_parameters_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "forestry_species"
            referencedColumns: ["id"]
          },
        ]
      }
      incentive_alerts: {
        Row: {
          actual_value: number | null
          alert_type: string
          allocation_id: string | null
          created_at: string
          expected_value: number | null
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          message: string
          metric_name: string | null
          program_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
        }
        Insert: {
          actual_value?: number | null
          alert_type: string
          allocation_id?: string | null
          created_at?: string
          expected_value?: number | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message: string
          metric_name?: string | null
          program_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
        }
        Update: {
          actual_value?: number | null
          alert_type?: string
          allocation_id?: string | null
          created_at?: string
          expected_value?: number | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string
          metric_name?: string | null
          program_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "incentive_alerts_allocation_id_fkey"
            columns: ["allocation_id"]
            isOneToOne: false
            referencedRelation: "incentive_allocations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incentive_alerts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "incentive_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      incentive_allocations: {
        Row: {
          allocation_date: string
          amount_aoa: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          disbursed_at: string | null
          disbursement_reference: string | null
          eligibility_details: Json | null
          eligibility_score: number | null
          farmer_id: string
          id: string
          notes: string | null
          program_id: string
          status: string
          updated_at: string
        }
        Insert: {
          allocation_date?: string
          amount_aoa: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          disbursed_at?: string | null
          disbursement_reference?: string | null
          eligibility_details?: Json | null
          eligibility_score?: number | null
          farmer_id: string
          id?: string
          notes?: string | null
          program_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          allocation_date?: string
          amount_aoa?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          disbursed_at?: string | null
          disbursement_reference?: string | null
          eligibility_details?: Json | null
          eligibility_score?: number | null
          farmer_id?: string
          id?: string
          notes?: string | null
          program_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incentive_allocations_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incentive_allocations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "incentive_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      incentive_impacts: {
        Row: {
          allocation_id: string
          area_after_ha: number | null
          area_before_ha: number | null
          area_change_pct: number | null
          compliance_score: number | null
          created_at: string
          evaluation_date: string
          evaluation_type: string
          evaluator_id: string | null
          id: string
          income_after_aoa: number | null
          income_before_aoa: number | null
          income_change_pct: number | null
          jobs_created: number | null
          notes: string | null
          production_after_kg: number | null
          production_before_kg: number | null
          production_change_pct: number | null
        }
        Insert: {
          allocation_id: string
          area_after_ha?: number | null
          area_before_ha?: number | null
          area_change_pct?: number | null
          compliance_score?: number | null
          created_at?: string
          evaluation_date: string
          evaluation_type: string
          evaluator_id?: string | null
          id?: string
          income_after_aoa?: number | null
          income_before_aoa?: number | null
          income_change_pct?: number | null
          jobs_created?: number | null
          notes?: string | null
          production_after_kg?: number | null
          production_before_kg?: number | null
          production_change_pct?: number | null
        }
        Update: {
          allocation_id?: string
          area_after_ha?: number | null
          area_before_ha?: number | null
          area_change_pct?: number | null
          compliance_score?: number | null
          created_at?: string
          evaluation_date?: string
          evaluation_type?: string
          evaluator_id?: string | null
          id?: string
          income_after_aoa?: number | null
          income_before_aoa?: number | null
          income_change_pct?: number | null
          jobs_created?: number | null
          notes?: string | null
          production_after_kg?: number | null
          production_before_kg?: number | null
          production_change_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incentive_impacts_allocation_id_fkey"
            columns: ["allocation_id"]
            isOneToOne: false
            referencedRelation: "incentive_allocations"
            referencedColumns: ["id"]
          },
        ]
      }
      incentive_programs: {
        Row: {
          actual_beneficiaries: number | null
          allocated_aoa: number | null
          budget_aoa: number | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          disbursed_aoa: number | null
          end_date: string | null
          id: string
          name: string
          program_type: string
          sector: string
          start_date: string
          status: string
          target_beneficiaries: number | null
          target_provinces: string[] | null
          updated_at: string
        }
        Insert: {
          actual_beneficiaries?: number | null
          allocated_aoa?: number | null
          budget_aoa?: number | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          disbursed_aoa?: number | null
          end_date?: string | null
          id?: string
          name: string
          program_type?: string
          sector?: string
          start_date: string
          status?: string
          target_beneficiaries?: number | null
          target_provinces?: string[] | null
          updated_at?: string
        }
        Update: {
          actual_beneficiaries?: number | null
          allocated_aoa?: number | null
          budget_aoa?: number | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          disbursed_aoa?: number | null
          end_date?: string | null
          id?: string
          name?: string
          program_type?: string
          sector?: string
          start_date?: string
          status?: string
          target_beneficiaries?: number | null
          target_provinces?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      incer_attachments: {
        Row: {
          client_upload_id: string | null
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          file_name: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          client_upload_id?: string | null
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          client_upload_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      incer_compliance_violations: {
        Row: {
          attempted_by: string | null
          context: Json
          created_at: string
          entity_id: string | null
          entity_table: string
          id: string
          reason: string
          rule_code: string
          severity: string
        }
        Insert: {
          attempted_by?: string | null
          context?: Json
          created_at?: string
          entity_id?: string | null
          entity_table: string
          id?: string
          reason: string
          rule_code: string
          severity?: string
        }
        Update: {
          attempted_by?: string | null
          context?: Json
          created_at?: string
          entity_id?: string | null
          entity_table?: string
          id?: string
          reason?: string
          rule_code?: string
          severity?: string
        }
        Relationships: []
      }
      incer_document_audit: {
        Row: {
          action: string
          actor_id: string | null
          actor_ip: string | null
          changes: Json | null
          created_at: string
          device_meta: Json | null
          document_code: string
          entity_id: string
          entity_type: string
          id: string
          issue_id: string | null
          notes: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_ip?: string | null
          changes?: Json | null
          created_at?: string
          device_meta?: Json | null
          document_code: string
          entity_id: string
          entity_type: string
          id?: string
          issue_id?: string | null
          notes?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_ip?: string | null
          changes?: Json | null
          created_at?: string
          device_meta?: Json | null
          document_code?: string
          entity_id?: string
          entity_type?: string
          id?: string
          issue_id?: string | null
          notes?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_document_audit_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "incer_document_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_document_issues: {
        Row: {
          content_hash: string | null
          document_code: string
          document_number: string
          entity_id: string
          entity_type: string
          id: string
          issued_at: string
          issued_by: string | null
          qr_token: string
          verification_url: string
        }
        Insert: {
          content_hash?: string | null
          document_code: string
          document_number: string
          entity_id: string
          entity_type: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          qr_token: string
          verification_url: string
        }
        Update: {
          content_hash?: string | null
          document_code?: string
          document_number?: string
          entity_id?: string
          entity_type?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          qr_token?: string
          verification_url?: string
        }
        Relationships: []
      }
      incer_economic_agents: {
        Row: {
          activity_license: string | null
          address: string | null
          agent_type: Database["public"]["Enums"]["incer_agent_type"]
          annual_capacity_tons: number | null
          commercial_registration: string | null
          created_at: string
          created_by: string | null
          does_export: boolean | null
          does_import: boolean | null
          email: string | null
          farmer_id: string | null
          has_warehouse: boolean | null
          id: string
          legal_documents: Json | null
          license_expiry: string | null
          municipality_id: string | null
          name: string
          nif: string | null
          phone: string | null
          products: string[] | null
          province_id: string | null
          status: Database["public"]["Enums"]["incer_operation_status"]
          updated_at: string
        }
        Insert: {
          activity_license?: string | null
          address?: string | null
          agent_type: Database["public"]["Enums"]["incer_agent_type"]
          annual_capacity_tons?: number | null
          commercial_registration?: string | null
          created_at?: string
          created_by?: string | null
          does_export?: boolean | null
          does_import?: boolean | null
          email?: string | null
          farmer_id?: string | null
          has_warehouse?: boolean | null
          id?: string
          legal_documents?: Json | null
          license_expiry?: string | null
          municipality_id?: string | null
          name: string
          nif?: string | null
          phone?: string | null
          products?: string[] | null
          province_id?: string | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          updated_at?: string
        }
        Update: {
          activity_license?: string | null
          address?: string | null
          agent_type?: Database["public"]["Enums"]["incer_agent_type"]
          annual_capacity_tons?: number | null
          commercial_registration?: string | null
          created_at?: string
          created_by?: string | null
          does_export?: boolean | null
          does_import?: boolean | null
          email?: string | null
          farmer_id?: string | null
          has_warehouse?: boolean | null
          id?: string
          legal_documents?: Json | null
          license_expiry?: string | null
          municipality_id?: string | null
          name?: string
          nif?: string | null
          phone?: string | null
          products?: string[] | null
          province_id?: string | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incer_economic_agents_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_economic_agents_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_economic_agents_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_fee_notes: {
        Row: {
          amount_due: number
          bank_account: string | null
          cancelled_reason: string | null
          charge_type: string
          created_at: string
          created_by: string | null
          document_number: string | null
          due_date: string
          entity_name: string
          id: string
          issued_at: string | null
          issued_by: string | null
          nif: string
          paid_at: string | null
          payment_reference: string | null
          process_ref: string | null
          province_id: string | null
          qr_token: string | null
          service_description: string
          status: string
          updated_at: string
          verification_url: string | null
        }
        Insert: {
          amount_due: number
          bank_account?: string | null
          cancelled_reason?: string | null
          charge_type: string
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          due_date: string
          entity_name: string
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          nif: string
          paid_at?: string | null
          payment_reference?: string | null
          process_ref?: string | null
          province_id?: string | null
          qr_token?: string | null
          service_description: string
          status?: string
          updated_at?: string
          verification_url?: string | null
        }
        Update: {
          amount_due?: number
          bank_account?: string | null
          cancelled_reason?: string | null
          charge_type?: string
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          due_date?: string
          entity_name?: string
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          nif?: string
          paid_at?: string | null
          payment_reference?: string | null
          process_ref?: string | null
          province_id?: string | null
          qr_token?: string | null
          service_description?: string
          status?: string
          updated_at?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_fee_notes_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_grain_exports: {
        Row: {
          commercial_docs: Json | null
          commercial_value: number | null
          created_at: string
          created_by: string | null
          destination_country: string
          exit_point: string
          expected_departure: string
          exporter_id: string
          id: string
          lot_id: string | null
          origin_certificate_id: string | null
          product: string
          quality_certificate_id: string | null
          quantity: number
          status: Database["public"]["Enums"]["incer_operation_status"]
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at: string
        }
        Insert: {
          commercial_docs?: Json | null
          commercial_value?: number | null
          created_at?: string
          created_by?: string | null
          destination_country: string
          exit_point: string
          expected_departure: string
          exporter_id: string
          id?: string
          lot_id?: string | null
          origin_certificate_id?: string | null
          product: string
          quality_certificate_id?: string | null
          quantity: number
          status?: Database["public"]["Enums"]["incer_operation_status"]
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
        }
        Update: {
          commercial_docs?: Json | null
          commercial_value?: number | null
          created_at?: string
          created_by?: string | null
          destination_country?: string
          exit_point?: string
          expected_departure?: string
          exporter_id?: string
          id?: string
          lot_id?: string | null
          origin_certificate_id?: string | null
          product?: string
          quality_certificate_id?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["incer_operation_status"]
          unit?: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incer_grain_exports_exporter_id_fkey"
            columns: ["exporter_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_exports_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "incer_warehouse_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_exports_origin_certificate_id_fkey"
            columns: ["origin_certificate_id"]
            isOneToOne: false
            referencedRelation: "agricultural_certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_exports_origin_certificate_id_fkey"
            columns: ["origin_certificate_id"]
            isOneToOne: false
            referencedRelation: "incer_certificate_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_exports_quality_certificate_id_fkey"
            columns: ["quality_certificate_id"]
            isOneToOne: false
            referencedRelation: "agricultural_certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_exports_quality_certificate_id_fkey"
            columns: ["quality_certificate_id"]
            isOneToOne: false
            referencedRelation: "incer_certificate_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_grain_imports: {
        Row: {
          commercial_docs: Json | null
          commercial_value: number | null
          conformity_result:
            | Database["public"]["Enums"]["incer_lab_result"]
            | null
          created_at: string
          created_by: string | null
          entry_port: string
          expected_arrival: string
          id: string
          importer_id: string
          origin_certificate_url: string | null
          origin_country: string
          product: string
          quantity: number
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          requires_lab: boolean
          sample_id: string | null
          sanitary_docs: Json | null
          status: Database["public"]["Enums"]["incer_operation_status"]
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at: string
        }
        Insert: {
          commercial_docs?: Json | null
          commercial_value?: number | null
          conformity_result?:
            | Database["public"]["Enums"]["incer_lab_result"]
            | null
          created_at?: string
          created_by?: string | null
          entry_port: string
          expected_arrival: string
          id?: string
          importer_id: string
          origin_certificate_url?: string | null
          origin_country: string
          product: string
          quantity: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requires_lab?: boolean
          sample_id?: string | null
          sanitary_docs?: Json | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
        }
        Update: {
          commercial_docs?: Json | null
          commercial_value?: number | null
          conformity_result?:
            | Database["public"]["Enums"]["incer_lab_result"]
            | null
          created_at?: string
          created_by?: string | null
          entry_port?: string
          expected_arrival?: string
          id?: string
          importer_id?: string
          origin_certificate_url?: string | null
          origin_country?: string
          product?: string
          quantity?: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requires_lab?: boolean
          sample_id?: string | null
          sanitary_docs?: Json | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          unit?: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incer_grain_imports_importer_id_fkey"
            columns: ["importer_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_imports_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "incer_lab_samples"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_grain_production: {
        Row: {
          area_ha: number
          campaign_id: string | null
          commune_id: string | null
          created_at: string
          created_by: string | null
          crop: string
          farmer_id: string | null
          harvest_date: string
          id: string
          municipality_id: string | null
          notes: string | null
          parcel_id: string | null
          production_history_id: string | null
          production_kg: number
          program_id: string | null
          province_id: string | null
          season: string | null
          status: Database["public"]["Enums"]["incer_operation_status"]
          updated_at: string
          variety: string | null
          yield_kg_ha: number | null
        }
        Insert: {
          area_ha: number
          campaign_id?: string | null
          commune_id?: string | null
          created_at?: string
          created_by?: string | null
          crop: string
          farmer_id?: string | null
          harvest_date: string
          id?: string
          municipality_id?: string | null
          notes?: string | null
          parcel_id?: string | null
          production_history_id?: string | null
          production_kg: number
          program_id?: string | null
          province_id?: string | null
          season?: string | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          updated_at?: string
          variety?: string | null
          yield_kg_ha?: number | null
        }
        Update: {
          area_ha?: number
          campaign_id?: string | null
          commune_id?: string | null
          created_at?: string
          created_by?: string | null
          crop?: string
          farmer_id?: string | null
          harvest_date?: string
          id?: string
          municipality_id?: string | null
          notes?: string | null
          parcel_id?: string | null
          production_history_id?: string | null
          production_kg?: number
          program_id?: string | null
          province_id?: string | null
          season?: string | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          updated_at?: string
          variety?: string | null
          yield_kg_ha?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_grain_production_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "farmer_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "farmer_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_production_history_id_fkey"
            columns: ["production_history_id"]
            isOneToOne: false
            referencedRelation: "production_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_production_history_id_fkey"
            columns: ["production_history_id"]
            isOneToOne: false
            referencedRelation: "v_incer_production_full"
            referencedColumns: ["ph_id"]
          },
          {
            foreignKeyName: "incer_grain_production_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "incer_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_infrastructure_certificates: {
        Row: {
          applicable_standards: string | null
          certificate_number: string
          conformity_declaration: string | null
          created_at: string
          created_by: string | null
          director_name: string | null
          economic_agent_id: string | null
          expiry_date: string | null
          id: string
          infrastructure_id: string
          inspection_id: string | null
          inspector_name: string | null
          inspector_professional_id: string | null
          issue_date: string
          notes: string | null
          qr_token: string
          revocation_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          status: string
          updated_at: string
          verification_url: string | null
        }
        Insert: {
          applicable_standards?: string | null
          certificate_number: string
          conformity_declaration?: string | null
          created_at?: string
          created_by?: string | null
          director_name?: string | null
          economic_agent_id?: string | null
          expiry_date?: string | null
          id?: string
          infrastructure_id: string
          inspection_id?: string | null
          inspector_name?: string | null
          inspector_professional_id?: string | null
          issue_date?: string
          notes?: string | null
          qr_token?: string
          revocation_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          status?: string
          updated_at?: string
          verification_url?: string | null
        }
        Update: {
          applicable_standards?: string | null
          certificate_number?: string
          conformity_declaration?: string | null
          created_at?: string
          created_by?: string | null
          director_name?: string | null
          economic_agent_id?: string | null
          expiry_date?: string | null
          id?: string
          infrastructure_id?: string
          inspection_id?: string | null
          inspector_name?: string | null
          inspector_professional_id?: string | null
          issue_date?: string
          notes?: string | null
          qr_token?: string
          revocation_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          status?: string
          updated_at?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_infrastructure_certificates_economic_agent_id_fkey"
            columns: ["economic_agent_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_infrastructure_certificates_infrastructure_id_fkey"
            columns: ["infrastructure_id"]
            isOneToOne: false
            referencedRelation: "agricultural_infrastructure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_infrastructure_certificates_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "incer_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_input_distributions: {
        Row: {
          approved_quantity: number
          cost_share_percent: number
          created_at: string
          created_by: string | null
          crop: string
          crops: string[]
          delivered_by: string | null
          delivery_date: string
          farmer_id: string | null
          id: string
          incer_economic_agent_id: string | null
          input_name: string
          input_type: Database["public"]["Enums"]["incer_input_type"]
          input_types: string[]
          origin_infrastructure_id: string | null
          program_id: string | null
          proof_url: string | null
          received_by_name: string
          requested_quantity: number
          signature_data: string | null
          status: Database["public"]["Enums"]["incer_operation_status"]
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at: string
        }
        Insert: {
          approved_quantity: number
          cost_share_percent?: number
          created_at?: string
          created_by?: string | null
          crop: string
          crops?: string[]
          delivered_by?: string | null
          delivery_date: string
          farmer_id?: string | null
          id?: string
          incer_economic_agent_id?: string | null
          input_name: string
          input_type: Database["public"]["Enums"]["incer_input_type"]
          input_types?: string[]
          origin_infrastructure_id?: string | null
          program_id?: string | null
          proof_url?: string | null
          received_by_name: string
          requested_quantity: number
          signature_data?: string | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
        }
        Update: {
          approved_quantity?: number
          cost_share_percent?: number
          created_at?: string
          created_by?: string | null
          crop?: string
          crops?: string[]
          delivered_by?: string | null
          delivery_date?: string
          farmer_id?: string | null
          id?: string
          incer_economic_agent_id?: string | null
          input_name?: string
          input_type?: Database["public"]["Enums"]["incer_input_type"]
          input_types?: string[]
          origin_infrastructure_id?: string | null
          program_id?: string | null
          proof_url?: string | null
          received_by_name?: string
          requested_quantity?: number
          signature_data?: string | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          unit?: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incer_input_distributions_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_input_distributions_incer_economic_agent_id_fkey"
            columns: ["incer_economic_agent_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_input_distributions_origin_infrastructure_id_fkey"
            columns: ["origin_infrastructure_id"]
            isOneToOne: false
            referencedRelation: "agricultural_infrastructure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_input_distributions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "incer_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_inspection_checklist_items: {
        Row: {
          conformant: boolean | null
          created_at: string
          id: string
          inspection_id: string
          item: string
          note: string | null
        }
        Insert: {
          conformant?: boolean | null
          created_at?: string
          id?: string
          inspection_id: string
          item: string
          note?: string | null
        }
        Update: {
          conformant?: boolean | null
          created_at?: string
          id?: string
          inspection_id?: string
          item?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_inspection_checklist_items_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "incer_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_inspection_state_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_state:
            | Database["public"]["Enums"]["incer_operation_status"]
            | null
          id: string
          inspection_id: string
          reason: string | null
          to_state: Database["public"]["Enums"]["incer_operation_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_state?:
            | Database["public"]["Enums"]["incer_operation_status"]
            | null
          id?: string
          inspection_id: string
          reason?: string | null
          to_state: Database["public"]["Enums"]["incer_operation_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_state?:
            | Database["public"]["Enums"]["incer_operation_status"]
            | null
          id?: string
          inspection_id?: string
          reason?: string | null
          to_state?: Database["public"]["Enums"]["incer_operation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "incer_inspection_state_history_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "incer_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_inspections: {
        Row: {
          agent_id: string | null
          checklist_a: Json | null
          checklist_b: Json | null
          checklist_c: Json | null
          checklist_d: Json | null
          commune_id: string | null
          corrective_measures: string | null
          created_at: string
          created_by: string | null
          documents_checklist: Json | null
          entity_kind: string
          evidences: Json | null
          farmer_id: string | null
          fine_amount: number | null
          fine_applicable: boolean
          id: string
          infrastructure_id: string | null
          infrastructure_snapshot: Json | null
          inspection_date: string
          inspection_time: string | null
          inspection_type: Database["public"]["Enums"]["incer_inspection_type"]
          inspector_id: string | null
          latitude: number | null
          location_text: string
          longitude: number | null
          lot_id: string | null
          measurements: Json | null
          motive: string
          municipality_id: string | null
          needs_certification: string | null
          new_inspection_date: string | null
          new_inspection_required: boolean | null
          non_conformity: boolean
          non_conformity_description: string | null
          nonconformities: Json | null
          objective: string | null
          operator_snapshot: Json | null
          preliminary_result: string | null
          process_number: string | null
          product: string | null
          province_id: string | null
          regularization_deadline: string | null
          representative_name: string | null
          representative_role: string | null
          risk_grade: string | null
          sample_code: string | null
          sample_collected: boolean
          signatures: Json | null
          status: Database["public"]["Enums"]["incer_operation_status"]
          team: Json | null
          technical_opinion: string | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          checklist_a?: Json | null
          checklist_b?: Json | null
          checklist_c?: Json | null
          checklist_d?: Json | null
          commune_id?: string | null
          corrective_measures?: string | null
          created_at?: string
          created_by?: string | null
          documents_checklist?: Json | null
          entity_kind: string
          evidences?: Json | null
          farmer_id?: string | null
          fine_amount?: number | null
          fine_applicable?: boolean
          id?: string
          infrastructure_id?: string | null
          infrastructure_snapshot?: Json | null
          inspection_date: string
          inspection_time?: string | null
          inspection_type: Database["public"]["Enums"]["incer_inspection_type"]
          inspector_id?: string | null
          latitude?: number | null
          location_text: string
          longitude?: number | null
          lot_id?: string | null
          measurements?: Json | null
          motive: string
          municipality_id?: string | null
          needs_certification?: string | null
          new_inspection_date?: string | null
          new_inspection_required?: boolean | null
          non_conformity?: boolean
          non_conformity_description?: string | null
          nonconformities?: Json | null
          objective?: string | null
          operator_snapshot?: Json | null
          preliminary_result?: string | null
          process_number?: string | null
          product?: string | null
          province_id?: string | null
          regularization_deadline?: string | null
          representative_name?: string | null
          representative_role?: string | null
          risk_grade?: string | null
          sample_code?: string | null
          sample_collected?: boolean
          signatures?: Json | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          team?: Json | null
          technical_opinion?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          checklist_a?: Json | null
          checklist_b?: Json | null
          checklist_c?: Json | null
          checklist_d?: Json | null
          commune_id?: string | null
          corrective_measures?: string | null
          created_at?: string
          created_by?: string | null
          documents_checklist?: Json | null
          entity_kind?: string
          evidences?: Json | null
          farmer_id?: string | null
          fine_amount?: number | null
          fine_applicable?: boolean
          id?: string
          infrastructure_id?: string | null
          infrastructure_snapshot?: Json | null
          inspection_date?: string
          inspection_time?: string | null
          inspection_type?: Database["public"]["Enums"]["incer_inspection_type"]
          inspector_id?: string | null
          latitude?: number | null
          location_text?: string
          longitude?: number | null
          lot_id?: string | null
          measurements?: Json | null
          motive?: string
          municipality_id?: string | null
          needs_certification?: string | null
          new_inspection_date?: string | null
          new_inspection_required?: boolean | null
          non_conformity?: boolean
          non_conformity_description?: string | null
          nonconformities?: Json | null
          objective?: string | null
          operator_snapshot?: Json | null
          preliminary_result?: string | null
          process_number?: string | null
          product?: string | null
          province_id?: string | null
          regularization_deadline?: string | null
          representative_name?: string | null
          representative_role?: string | null
          risk_grade?: string | null
          sample_code?: string | null
          sample_collected?: boolean
          signatures?: Json | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          team?: Json | null
          technical_opinion?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incer_inspections_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_inspections_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_inspections_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_inspections_infrastructure_id_fkey"
            columns: ["infrastructure_id"]
            isOneToOne: false
            referencedRelation: "agricultural_infrastructure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_inspections_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "incer_warehouse_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_inspections_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_inspections_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_lab_analyses: {
        Row: {
          analysis_date: string
          analysis_type: string
          analyst_id: string | null
          created_at: string
          created_by: string | null
          id: string
          laboratory_name: string
          overall_result: Database["public"]["Enums"]["incer_lab_result"]
          reception_date: string
          report_url: string | null
          sample_id: string
          status: Database["public"]["Enums"]["incer_operation_status"]
          technical_opinion: string
          updated_at: string
        }
        Insert: {
          analysis_date: string
          analysis_type: string
          analyst_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          laboratory_name: string
          overall_result: Database["public"]["Enums"]["incer_lab_result"]
          reception_date: string
          report_url?: string | null
          sample_id: string
          status?: Database["public"]["Enums"]["incer_operation_status"]
          technical_opinion: string
          updated_at?: string
        }
        Update: {
          analysis_date?: string
          analysis_type?: string
          analyst_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          laboratory_name?: string
          overall_result?: Database["public"]["Enums"]["incer_lab_result"]
          reception_date?: string
          report_url?: string | null
          sample_id?: string
          status?: Database["public"]["Enums"]["incer_operation_status"]
          technical_opinion?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incer_lab_analyses_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "incer_lab_samples"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_lab_parameters: {
        Row: {
          acceptable_limit: string | null
          analysis_id: string
          conformant: boolean | null
          created_at: string
          id: string
          parameter: string
          result_value: string
          unit: string | null
        }
        Insert: {
          acceptable_limit?: string | null
          analysis_id: string
          conformant?: boolean | null
          created_at?: string
          id?: string
          parameter: string
          result_value: string
          unit?: string | null
        }
        Update: {
          acceptable_limit?: string | null
          analysis_id?: string
          conformant?: boolean | null
          created_at?: string
          id?: string
          parameter?: string
          result_value?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_lab_parameters_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "incer_lab_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_lab_samples: {
        Row: {
          chain_of_custody: Json | null
          collected_by: string | null
          collection_date: string
          collection_location: string
          created_at: string
          created_by: string | null
          id: string
          laboratory_name: string
          latitude: number | null
          longitude: number | null
          lot_id: string | null
          origin: Database["public"]["Enums"]["incer_sample_origin"]
          photos: Json | null
          product: string
          purpose: string
          quantity: number
          responsible_entity: string
          sample_code: string
          sample_conditions: string | null
          status: Database["public"]["Enums"]["incer_operation_status"]
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at: string
        }
        Insert: {
          chain_of_custody?: Json | null
          collected_by?: string | null
          collection_date?: string
          collection_location: string
          created_at?: string
          created_by?: string | null
          id?: string
          laboratory_name: string
          latitude?: number | null
          longitude?: number | null
          lot_id?: string | null
          origin: Database["public"]["Enums"]["incer_sample_origin"]
          photos?: Json | null
          product: string
          purpose: string
          quantity: number
          responsible_entity: string
          sample_code?: string
          sample_conditions?: string | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
        }
        Update: {
          chain_of_custody?: Json | null
          collected_by?: string | null
          collection_date?: string
          collection_location?: string
          created_at?: string
          created_by?: string | null
          id?: string
          laboratory_name?: string
          latitude?: number | null
          longitude?: number | null
          lot_id?: string | null
          origin?: Database["public"]["Enums"]["incer_sample_origin"]
          photos?: Json | null
          product?: string
          purpose?: string
          quantity?: number
          responsible_entity?: string
          sample_code?: string
          sample_conditions?: string | null
          status?: Database["public"]["Enums"]["incer_operation_status"]
          unit?: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incer_lab_samples_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "incer_warehouse_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_meeting_decisions: {
        Row: {
          created_at: string
          deadline: string | null
          decision: string
          id: string
          item_number: number
          meeting_id: string
          responsible: string | null
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          decision: string
          id?: string
          item_number: number
          meeting_id: string
          responsible?: string | null
        }
        Update: {
          created_at?: string
          deadline?: string | null
          decision?: string
          id?: string
          item_number?: number
          meeting_id?: string
          responsible?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_meeting_decisions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "incer_meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_meeting_minutes: {
        Row: {
          agenda: string[]
          created_at: string
          created_by: string | null
          document_number: string | null
          end_time: string | null
          final_notes: string | null
          id: string
          issued_at: string | null
          issued_by: string | null
          location: string
          meeting_date: string
          meeting_type: string
          organ_unit: string
          presided_by: string
          qr_token: string | null
          secretariat: string | null
          start_time: string | null
          status: string
          updated_at: string
          verification_url: string | null
        }
        Insert: {
          agenda?: string[]
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          end_time?: string | null
          final_notes?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          location: string
          meeting_date: string
          meeting_type: string
          organ_unit: string
          presided_by: string
          qr_token?: string | null
          secretariat?: string | null
          start_time?: string | null
          status?: string
          updated_at?: string
          verification_url?: string | null
        }
        Update: {
          agenda?: string[]
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          end_time?: string | null
          final_notes?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          location?: string
          meeting_date?: string
          meeting_type?: string
          organ_unit?: string
          presided_by?: string
          qr_token?: string | null
          secretariat?: string | null
          start_time?: string | null
          status?: string
          updated_at?: string
          verification_url?: string | null
        }
        Relationships: []
      }
      incer_meeting_participants: {
        Row: {
          created_at: string
          id: string
          meeting_id: string
          name: string
          role: string | null
          signed: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          meeting_id: string
          name: string
          role?: string | null
          signed?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          meeting_id?: string
          name?: string
          role?: string | null
          signed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "incer_meeting_participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "incer_meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_partnerships: {
        Row: {
          counterpart_obligations: string
          created_at: string
          created_by: string | null
          end_date: string
          financial_value: number | null
          id: string
          incer_obligations: string
          instrument_type: Database["public"]["Enums"]["incer_partnership_type"]
          internal_responsible_id: string | null
          legal_opinion: string | null
          legal_opinion_url: string | null
          object_description: string
          partner_name: string
          partner_nif: string | null
          related_area: string
          signed_document_url: string | null
          start_date: string
          status: Database["public"]["Enums"]["incer_partnership_status"]
          technical_opinion: string | null
          technical_opinion_url: string | null
          updated_at: string
        }
        Insert: {
          counterpart_obligations: string
          created_at?: string
          created_by?: string | null
          end_date: string
          financial_value?: number | null
          id?: string
          incer_obligations: string
          instrument_type: Database["public"]["Enums"]["incer_partnership_type"]
          internal_responsible_id?: string | null
          legal_opinion?: string | null
          legal_opinion_url?: string | null
          object_description: string
          partner_name: string
          partner_nif?: string | null
          related_area: string
          signed_document_url?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["incer_partnership_status"]
          technical_opinion?: string | null
          technical_opinion_url?: string | null
          updated_at?: string
        }
        Update: {
          counterpart_obligations?: string
          created_at?: string
          created_by?: string | null
          end_date?: string
          financial_value?: number | null
          id?: string
          incer_obligations?: string
          instrument_type?: Database["public"]["Enums"]["incer_partnership_type"]
          internal_responsible_id?: string | null
          legal_opinion?: string | null
          legal_opinion_url?: string | null
          object_description?: string
          partner_name?: string
          partner_nif?: string | null
          related_area?: string
          signed_document_url?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["incer_partnership_status"]
          technical_opinion?: string | null
          technical_opinion_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      incer_program_inputs: {
        Row: {
          created_at: string
          id: string
          input_name: string
          input_type: Database["public"]["Enums"]["incer_input_type"]
          notes: string | null
          planned_quantity: number
          program_id: string
          supplier: string | null
          unit: Database["public"]["Enums"]["incer_unit"]
        }
        Insert: {
          created_at?: string
          id?: string
          input_name: string
          input_type: Database["public"]["Enums"]["incer_input_type"]
          notes?: string | null
          planned_quantity: number
          program_id: string
          supplier?: string | null
          unit: Database["public"]["Enums"]["incer_unit"]
        }
        Update: {
          created_at?: string
          id?: string
          input_name?: string
          input_type?: Database["public"]["Enums"]["incer_input_type"]
          notes?: string | null
          planned_quantity?: number
          program_id?: string
          supplier?: string | null
          unit?: Database["public"]["Enums"]["incer_unit"]
        }
        Relationships: [
          {
            foreignKeyName: "incer_program_inputs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "incer_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_programs: {
        Row: {
          beneficiaries_target: number
          code: string
          created_at: string
          created_by: string | null
          crop: string
          crops: string[]
          description: string | null
          id: string
          name: string
          partners: Json
          period_end: string
          period_start: string
          province_id: string | null
          province_ids: string[]
          status: Database["public"]["Enums"]["incer_operation_status"]
          target_area_ha: number
          target_production_t: number
          targets_by_crop: Json
          updated_at: string
        }
        Insert: {
          beneficiaries_target?: number
          code: string
          created_at?: string
          created_by?: string | null
          crop: string
          crops?: string[]
          description?: string | null
          id?: string
          name: string
          partners?: Json
          period_end: string
          period_start: string
          province_id?: string | null
          province_ids?: string[]
          status?: Database["public"]["Enums"]["incer_operation_status"]
          target_area_ha?: number
          target_production_t?: number
          targets_by_crop?: Json
          updated_at?: string
        }
        Update: {
          beneficiaries_target?: number
          code?: string
          created_at?: string
          created_by?: string | null
          crop?: string
          crops?: string[]
          description?: string | null
          id?: string
          name?: string
          partners?: Json
          period_end?: string
          period_start?: string
          province_id?: string | null
          province_ids?: string[]
          status?: Database["public"]["Enums"]["incer_operation_status"]
          target_area_ha?: number
          target_production_t?: number
          targets_by_crop?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incer_programs_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_public_scan_log: {
        Row: {
          document_code: string | null
          document_number: string | null
          id: string
          ip_hash: string | null
          qr_token: string
          scanned_at: string
        }
        Insert: {
          document_code?: string | null
          document_number?: string | null
          id?: string
          ip_hash?: string | null
          qr_token: string
          scanned_at?: string
        }
        Update: {
          document_code?: string | null
          document_number?: string | null
          id?: string
          ip_hash?: string | null
          qr_token?: string
          scanned_at?: string
        }
        Relationships: []
      }
      incer_stats_alerts: {
        Row: {
          alert_type: string
          created_at: string
          current_value: number | null
          grain_type: Database["public"]["Enums"]["grain_type"]
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          message: string
          metric_name: string | null
          province_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          threshold_value: number | null
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          current_value?: number | null
          grain_type?: Database["public"]["Enums"]["grain_type"]
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message: string
          metric_name?: string | null
          province_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          threshold_value?: number | null
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          current_value?: number | null
          grain_type?: Database["public"]["Enums"]["grain_type"]
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string
          metric_name?: string | null
          province_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          threshold_value?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rice_alerts_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_stats_consumption: {
        Row: {
          created_at: string
          data_source: string | null
          grain_type: Database["public"]["Enums"]["grain_type"]
          id: string
          notes: string | null
          per_capita_kg: number
          population: number
          province_id: string | null
          total_consumption_tonnes: number | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          data_source?: string | null
          grain_type?: Database["public"]["Enums"]["grain_type"]
          id?: string
          notes?: string | null
          per_capita_kg: number
          population: number
          province_id?: string | null
          total_consumption_tonnes?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          data_source?: string | null
          grain_type?: Database["public"]["Enums"]["grain_type"]
          id?: string
          notes?: string | null
          per_capita_kg?: number
          population?: number
          province_id?: string | null
          total_consumption_tonnes?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "rice_consumption_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_stats_imports: {
        Row: {
          created_at: string
          created_by: string | null
          grain_type: Database["public"]["Enums"]["grain_type"]
          id: string
          importer_name: string | null
          month: number
          notes: string | null
          origin_country: string
          port_of_entry: string | null
          price_cif_usd: number | null
          price_fob_usd: number | null
          rice_type: string | null
          total_value_usd: number | null
          updated_at: string
          volume_tonnes: number
          year: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          grain_type?: Database["public"]["Enums"]["grain_type"]
          id?: string
          importer_name?: string | null
          month: number
          notes?: string | null
          origin_country: string
          port_of_entry?: string | null
          price_cif_usd?: number | null
          price_fob_usd?: number | null
          rice_type?: string | null
          total_value_usd?: number | null
          updated_at?: string
          volume_tonnes?: number
          year: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          grain_type?: Database["public"]["Enums"]["grain_type"]
          id?: string
          importer_name?: string | null
          month?: number
          notes?: string | null
          origin_country?: string
          port_of_entry?: string | null
          price_cif_usd?: number | null
          price_fob_usd?: number | null
          rice_type?: string | null
          total_value_usd?: number | null
          updated_at?: string
          volume_tonnes?: number
          year?: number
        }
        Relationships: []
      }
      incer_stats_parameters: {
        Row: {
          description: string | null
          id: string
          parameter_name: string
          parameter_value: number
          unit: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          parameter_name: string
          parameter_value: number
          unit?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          parameter_name?: string
          parameter_value?: number
          unit?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      incer_stats_prices: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string | null
          exchange_rate_usd: number | null
          grain_type: Database["public"]["Enums"]["grain_type"]
          id: string
          market_name: string | null
          notes: string | null
          province_id: string | null
          recorded_date: string
          retail_price_aoa: number
          rice_type: string | null
          wholesale_price_aoa: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          exchange_rate_usd?: number | null
          grain_type?: Database["public"]["Enums"]["grain_type"]
          id?: string
          market_name?: string | null
          notes?: string | null
          province_id?: string | null
          recorded_date: string
          retail_price_aoa: number
          rice_type?: string | null
          wholesale_price_aoa?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          exchange_rate_usd?: number | null
          grain_type?: Database["public"]["Enums"]["grain_type"]
          id?: string
          market_name?: string | null
          notes?: string | null
          province_id?: string | null
          recorded_date?: string
          retail_price_aoa?: number
          rice_type?: string | null
          wholesale_price_aoa?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rice_prices_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_stats_production: {
        Row: {
          created_at: string
          created_by: string | null
          cultivated_area_ha: number
          grain_type: Database["public"]["Enums"]["grain_type"]
          harvested_area_ha: number
          id: string
          irrigation_type: string | null
          municipality_id: string | null
          notes: string | null
          production_tonnes: number
          productivity_kg_ha: number | null
          province_id: string | null
          season: string
          updated_at: string
          variety: string | null
          year: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cultivated_area_ha?: number
          grain_type?: Database["public"]["Enums"]["grain_type"]
          harvested_area_ha?: number
          id?: string
          irrigation_type?: string | null
          municipality_id?: string | null
          notes?: string | null
          production_tonnes?: number
          productivity_kg_ha?: number | null
          province_id?: string | null
          season?: string
          updated_at?: string
          variety?: string | null
          year: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cultivated_area_ha?: number
          grain_type?: Database["public"]["Enums"]["grain_type"]
          harvested_area_ha?: number
          id?: string
          irrigation_type?: string | null
          municipality_id?: string | null
          notes?: string | null
          production_tonnes?: number
          productivity_kg_ha?: number | null
          province_id?: string | null
          season?: string
          updated_at?: string
          variety?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "rice_production_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rice_production_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_technical_assistance: {
        Row: {
          assigned_technician_id: string | null
          assistance_type: Database["public"]["Enums"]["incer_assistance_type"]
          assistance_types: string[]
          brigade: string | null
          created_at: string
          created_by: string | null
          crop: string
          crops: string[]
          diagnosis: string | null
          farmer_id: string | null
          follow_up_required: boolean | null
          id: string
          incer_economic_agent_id: string | null
          latitude: number | null
          location_text: string | null
          longitude: number | null
          municipality_id: string | null
          photos: Json | null
          problem_description: string
          province_id: string | null
          recommendations: string | null
          requested_date: string
          status: Database["public"]["Enums"]["incer_operation_status"]
          updated_at: string
          urgency: string
          visit_date: string | null
        }
        Insert: {
          assigned_technician_id?: string | null
          assistance_type: Database["public"]["Enums"]["incer_assistance_type"]
          assistance_types?: string[]
          brigade?: string | null
          created_at?: string
          created_by?: string | null
          crop: string
          crops?: string[]
          diagnosis?: string | null
          farmer_id?: string | null
          follow_up_required?: boolean | null
          id?: string
          incer_economic_agent_id?: string | null
          latitude?: number | null
          location_text?: string | null
          longitude?: number | null
          municipality_id?: string | null
          photos?: Json | null
          problem_description: string
          province_id?: string | null
          recommendations?: string | null
          requested_date?: string
          status?: Database["public"]["Enums"]["incer_operation_status"]
          updated_at?: string
          urgency: string
          visit_date?: string | null
        }
        Update: {
          assigned_technician_id?: string | null
          assistance_type?: Database["public"]["Enums"]["incer_assistance_type"]
          assistance_types?: string[]
          brigade?: string | null
          created_at?: string
          created_by?: string | null
          crop?: string
          crops?: string[]
          diagnosis?: string | null
          farmer_id?: string | null
          follow_up_required?: boolean | null
          id?: string
          incer_economic_agent_id?: string | null
          latitude?: number | null
          location_text?: string | null
          longitude?: number | null
          municipality_id?: string | null
          photos?: Json | null
          problem_description?: string
          province_id?: string | null
          recommendations?: string | null
          requested_date?: string
          status?: Database["public"]["Enums"]["incer_operation_status"]
          updated_at?: string
          urgency?: string
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_technical_assistance_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "field_technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_technical_assistance_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_technical_assistance_incer_economic_agent_id_fkey"
            columns: ["incer_economic_agent_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_technical_assistance_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_technical_assistance_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_warehouse_entries: {
        Row: {
          certificate_id: string | null
          created_at: string
          created_by: string | null
          entry_date: string
          entry_guide_url: string | null
          humidity: number
          id: string
          impurity: number | null
          infrastructure_id: string
          internal_location: string | null
          lot_id: string | null
          net_weight: number
          origin: string
          product: string
          quantity: number
          received_by: string | null
          sample_id: string | null
          state: string
          supplier_agent_id: string | null
          supplier_farmer_id: string | null
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at: string
          variety: string | null
        }
        Insert: {
          certificate_id?: string | null
          created_at?: string
          created_by?: string | null
          entry_date?: string
          entry_guide_url?: string | null
          humidity: number
          id?: string
          impurity?: number | null
          infrastructure_id: string
          internal_location?: string | null
          lot_id?: string | null
          net_weight: number
          origin: string
          product: string
          quantity: number
          received_by?: string | null
          sample_id?: string | null
          state?: string
          supplier_agent_id?: string | null
          supplier_farmer_id?: string | null
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
          variety?: string | null
        }
        Update: {
          certificate_id?: string | null
          created_at?: string
          created_by?: string | null
          entry_date?: string
          entry_guide_url?: string | null
          humidity?: number
          id?: string
          impurity?: number | null
          infrastructure_id?: string
          internal_location?: string | null
          lot_id?: string | null
          net_weight?: number
          origin?: string
          product?: string
          quantity?: number
          received_by?: string | null
          sample_id?: string | null
          state?: string
          supplier_agent_id?: string | null
          supplier_farmer_id?: string | null
          unit?: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_warehouse_entries_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "agricultural_certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_warehouse_entries_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "incer_certificate_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_warehouse_entries_infrastructure_id_fkey"
            columns: ["infrastructure_id"]
            isOneToOne: false
            referencedRelation: "agricultural_infrastructure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_warehouse_entries_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "incer_warehouse_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_warehouse_entries_supplier_agent_id_fkey"
            columns: ["supplier_agent_id"]
            isOneToOne: false
            referencedRelation: "incer_economic_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_warehouse_entries_supplier_farmer_id_fkey"
            columns: ["supplier_farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_warehouse_exits: {
        Row: {
          authorization_doc_url: string | null
          authorized_by: string | null
          created_at: string
          created_by: string | null
          delivered_by: string | null
          destination: string
          exit_date: string
          exit_guide_code: string | null
          id: string
          infrastructure_id: string
          lot_id: string
          quantity: number
          reason: string
          transport: string | null
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at: string
          vehicle_plate: string | null
        }
        Insert: {
          authorization_doc_url?: string | null
          authorized_by?: string | null
          created_at?: string
          created_by?: string | null
          delivered_by?: string | null
          destination: string
          exit_date?: string
          exit_guide_code?: string | null
          id?: string
          infrastructure_id: string
          lot_id: string
          quantity: number
          reason: string
          transport?: string | null
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
          vehicle_plate?: string | null
        }
        Update: {
          authorization_doc_url?: string | null
          authorized_by?: string | null
          created_at?: string
          created_by?: string | null
          delivered_by?: string | null
          destination?: string
          exit_date?: string
          exit_guide_code?: string | null
          id?: string
          infrastructure_id?: string
          lot_id?: string
          quantity?: number
          reason?: string
          transport?: string | null
          unit?: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
          vehicle_plate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_warehouse_exits_infrastructure_id_fkey"
            columns: ["infrastructure_id"]
            isOneToOne: false
            referencedRelation: "agricultural_infrastructure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_warehouse_exits_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "incer_warehouse_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_warehouse_lots: {
        Row: {
          created_at: string
          current_stock: number
          humidity: number | null
          id: string
          impurity: number | null
          infrastructure_id: string
          internal_location: string | null
          lot_code: string
          product: string
          state: string
          unit: Database["public"]["Enums"]["incer_unit"]
          updated_at: string
          variety: string | null
        }
        Insert: {
          created_at?: string
          current_stock?: number
          humidity?: number | null
          id?: string
          impurity?: number | null
          infrastructure_id: string
          internal_location?: string | null
          lot_code: string
          product: string
          state?: string
          unit?: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
          variety?: string | null
        }
        Update: {
          created_at?: string
          current_stock?: number
          humidity?: number | null
          id?: string
          impurity?: number | null
          infrastructure_id?: string
          internal_location?: string | null
          lot_code?: string
          product?: string
          state?: string
          unit?: Database["public"]["Enums"]["incer_unit"]
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_warehouse_lots_infrastructure_id_fkey"
            columns: ["infrastructure_id"]
            isOneToOne: false
            referencedRelation: "agricultural_infrastructure"
            referencedColumns: ["id"]
          },
        ]
      }
      institutional_access_logs: {
        Row: {
          access_result: string | null
          access_type: string
          accessed_by: string | null
          consent_given_at: string | null
          created_at: string
          data_accessed: Json | null
          error_message: string | null
          farmer_consent_id: string | null
          farmer_id: string | null
          id: string
          institution_code: string | null
          institution_name: string
          institution_type: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          access_result?: string | null
          access_type: string
          accessed_by?: string | null
          consent_given_at?: string | null
          created_at?: string
          data_accessed?: Json | null
          error_message?: string | null
          farmer_consent_id?: string | null
          farmer_id?: string | null
          id?: string
          institution_code?: string | null
          institution_name: string
          institution_type: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          access_result?: string | null
          access_type?: string
          accessed_by?: string | null
          consent_given_at?: string | null
          created_at?: string
          data_accessed?: Json | null
          error_message?: string | null
          farmer_consent_id?: string | null
          farmer_id?: string | null
          id?: string
          institution_code?: string | null
          institution_name?: string
          institution_type?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutional_access_logs_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claims: {
        Row: {
          affected_area_ha: number | null
          approved_amount_aoa: number | null
          claim_number: string
          created_at: string
          created_by: string | null
          description: string | null
          estimated_loss_aoa: number | null
          event_date: string
          event_type: string
          evidence_urls: string[] | null
          farmer_id: string
          gps_latitude: number | null
          gps_longitude: number | null
          id: string
          ndvi_at_event: number | null
          paid_at: string | null
          parametric_trigger: string | null
          payment_reference: string | null
          policy_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affected_area_ha?: number | null
          approved_amount_aoa?: number | null
          claim_number: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_loss_aoa?: number | null
          event_date: string
          event_type: string
          evidence_urls?: string[] | null
          farmer_id: string
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          ndvi_at_event?: number | null
          paid_at?: string | null
          parametric_trigger?: string | null
          payment_reference?: string | null
          policy_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affected_area_ha?: number | null
          approved_amount_aoa?: number | null
          claim_number?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_loss_aoa?: number | null
          event_date?: string
          event_type?: string
          evidence_urls?: string[] | null
          farmer_id?: string
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          ndvi_at_event?: number | null
          paid_at?: string | null
          parametric_trigger?: string | null
          payment_reference?: string | null
          policy_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "insurance_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_policies: {
        Row: {
          area_ha: number
          cancellation_reason: string | null
          cancelled_at: string | null
          coverage_details: Json | null
          coverage_end: string
          coverage_start: string
          created_at: string
          created_by: string | null
          crop: string
          farmer_id: string
          id: string
          municipality_id: string | null
          policy_number: string
          policy_type: string
          premium_aoa: number
          province_id: string | null
          quote_id: string | null
          status: string
          sum_insured_aoa: number
          updated_at: string
        }
        Insert: {
          area_ha: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          coverage_details?: Json | null
          coverage_end: string
          coverage_start: string
          created_at?: string
          created_by?: string | null
          crop: string
          farmer_id: string
          id?: string
          municipality_id?: string | null
          policy_number: string
          policy_type?: string
          premium_aoa?: number
          province_id?: string | null
          quote_id?: string | null
          status?: string
          sum_insured_aoa?: number
          updated_at?: string
        }
        Update: {
          area_ha?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          coverage_details?: Json | null
          coverage_end?: string
          coverage_start?: string
          created_at?: string
          created_by?: string | null
          crop?: string
          farmer_id?: string
          id?: string
          municipality_id?: string | null
          policy_number?: string
          policy_type?: string
          premium_aoa?: number
          province_id?: string | null
          quote_id?: string | null
          status?: string
          sum_insured_aoa?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_policies_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_policies_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_policies_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "insurance_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_quotes: {
        Row: {
          area_ha: number
          coverage_details: Json | null
          coverage_type: string
          created_at: string
          created_by: string | null
          crop: string
          farmer_id: string
          id: string
          premium_aoa: number
          premium_rate: number | null
          quote_number: string
          status: string
          sum_insured_aoa: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          area_ha: number
          coverage_details?: Json | null
          coverage_type?: string
          created_at?: string
          created_by?: string | null
          crop: string
          farmer_id: string
          id?: string
          premium_aoa?: number
          premium_rate?: number | null
          quote_number: string
          status?: string
          sum_insured_aoa?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          area_ha?: number
          coverage_details?: Json | null
          coverage_type?: string
          created_at?: string
          created_by?: string | null
          crop?: string
          farmer_id?: string
          id?: string
          premium_aoa?: number
          premium_rate?: number | null
          quote_number?: string
          status?: string
          sum_insured_aoa?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_quotes_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_risk_scores: {
        Row: {
          calculated_at: string
          climate_history_score: number | null
          coverage_recommendations: Json | null
          created_at: string
          crop_risk_score: number | null
          extreme_events_score: number | null
          farmer_id: string
          id: string
          insurable_risk_class: string | null
          overall_risk_score: number | null
          pest_frequency_score: number | null
          practices_score: number | null
          risk_factors_detail: Json | null
          risk_mitigation_suggestions: string[] | null
          suggested_coverage_types: string[] | null
          suggested_deductible_pct: number | null
          suggested_premium_multiplier: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          calculated_at?: string
          climate_history_score?: number | null
          coverage_recommendations?: Json | null
          created_at?: string
          crop_risk_score?: number | null
          extreme_events_score?: number | null
          farmer_id: string
          id?: string
          insurable_risk_class?: string | null
          overall_risk_score?: number | null
          pest_frequency_score?: number | null
          practices_score?: number | null
          risk_factors_detail?: Json | null
          risk_mitigation_suggestions?: string[] | null
          suggested_coverage_types?: string[] | null
          suggested_deductible_pct?: number | null
          suggested_premium_multiplier?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          calculated_at?: string
          climate_history_score?: number | null
          coverage_recommendations?: Json | null
          created_at?: string
          crop_risk_score?: number | null
          extreme_events_score?: number | null
          farmer_id?: string
          id?: string
          insurable_risk_class?: string | null
          overall_risk_score?: number | null
          pest_frequency_score?: number | null
          practices_score?: number | null
          risk_factors_detail?: Json | null
          risk_mitigation_suggestions?: string[] | null
          suggested_coverage_types?: string[] | null
          suggested_deductible_pct?: number | null
          suggested_premium_multiplier?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_risk_scores_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_series: {
        Row: {
          code: Database["public"]["Enums"]["invoice_series_type"]
          created_at: string
          id: string
          is_active: boolean
          last_number: number
          prefix: string
          updated_at: string
        }
        Insert: {
          code: Database["public"]["Enums"]["invoice_series_type"]
          created_at?: string
          id?: string
          is_active?: boolean
          last_number?: number
          prefix: string
          updated_at?: string
        }
        Update: {
          code?: Database["public"]["Enums"]["invoice_series_type"]
          created_at?: string
          id?: string
          is_active?: boolean
          last_number?: number
          prefix?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          communicated_at: string | null
          created_at: string
          farmer_id: string | null
          hash_anterior: string | null
          hash_fiscal: string | null
          id: string
          invoice_number: string
          is_offline: boolean
          issued_at: string
          iva_total_aoa: number
          notes: string | null
          operator_id: string | null
          qr_data: string | null
          sale_id: string | null
          series_code: Database["public"]["Enums"]["invoice_series_type"]
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal_aoa: number
          system_id: string
          total_aoa: number
          updated_at: string
          xml_data: string | null
        }
        Insert: {
          communicated_at?: string | null
          created_at?: string
          farmer_id?: string | null
          hash_anterior?: string | null
          hash_fiscal?: string | null
          id?: string
          invoice_number: string
          is_offline?: boolean
          issued_at?: string
          iva_total_aoa?: number
          notes?: string | null
          operator_id?: string | null
          qr_data?: string | null
          sale_id?: string | null
          series_code?: Database["public"]["Enums"]["invoice_series_type"]
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_aoa?: number
          system_id?: string
          total_aoa?: number
          updated_at?: string
          xml_data?: string | null
        }
        Update: {
          communicated_at?: string | null
          created_at?: string
          farmer_id?: string | null
          hash_anterior?: string | null
          hash_fiscal?: string | null
          id?: string
          invoice_number?: string
          is_offline?: boolean
          issued_at?: string
          iva_total_aoa?: number
          notes?: string | null
          operator_id?: string | null
          qr_data?: string | null
          sale_id?: string | null
          series_code?: Database["public"]["Enums"]["invoice_series_type"]
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_aoa?: number
          system_id?: string
          total_aoa?: number
          updated_at?: string
          xml_data?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "pos_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      market_infrastructure: {
        Row: {
          address: string | null
          capacity_sqm: number | null
          commune_id: string | null
          condition: string | null
          created_at: string
          created_by: string | null
          current_occupancy: number | null
          daily_visitors_estimate: number | null
          description: string | null
          id: string
          last_inspection_date: string | null
          latitude: number | null
          longitude: number | null
          manager_contact: string | null
          manager_name: string | null
          market_type: string
          municipality_id: string | null
          name: string
          products: string[] | null
          province_id: string | null
          stalls_count: number | null
          status: string
          updated_at: string
          updated_by: string | null
          vendors_count: number | null
        }
        Insert: {
          address?: string | null
          capacity_sqm?: number | null
          commune_id?: string | null
          condition?: string | null
          created_at?: string
          created_by?: string | null
          current_occupancy?: number | null
          daily_visitors_estimate?: number | null
          description?: string | null
          id?: string
          last_inspection_date?: string | null
          latitude?: number | null
          longitude?: number | null
          manager_contact?: string | null
          manager_name?: string | null
          market_type: string
          municipality_id?: string | null
          name: string
          products?: string[] | null
          province_id?: string | null
          stalls_count?: number | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          vendors_count?: number | null
        }
        Update: {
          address?: string | null
          capacity_sqm?: number | null
          commune_id?: string | null
          condition?: string | null
          created_at?: string
          created_by?: string | null
          current_occupancy?: number | null
          daily_visitors_estimate?: number | null
          description?: string | null
          id?: string
          last_inspection_date?: string | null
          latitude?: number | null
          longitude?: number | null
          manager_contact?: string | null
          manager_name?: string | null
          market_type?: string
          municipality_id?: string | null
          name?: string
          products?: string[] | null
          province_id?: string | null
          stalls_count?: number | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          vendors_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_infrastructure_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_infrastructure_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_infrastructure_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanization_centers: {
        Row: {
          address: string | null
          center_type: string
          commune_id: string | null
          created_at: string
          created_by: string | null
          id: string
          latitude: number | null
          longitude: number | null
          manager_name: string | null
          manager_phone: string | null
          municipality_id: string | null
          name: string
          notes: string | null
          operational_machines: number | null
          province_id: string | null
          status: string
          total_machines: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          center_type?: string
          commune_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          manager_name?: string | null
          manager_phone?: string | null
          municipality_id?: string | null
          name: string
          notes?: string | null
          operational_machines?: number | null
          province_id?: string | null
          status?: string
          total_machines?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          center_type?: string
          commune_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          manager_name?: string | null
          manager_phone?: string | null
          municipality_id?: string | null
          name?: string
          notes?: string | null
          operational_machines?: number | null
          province_id?: string | null
          status?: string
          total_machines?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanization_centers_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mechanization_centers_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mechanization_centers_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanization_validations: {
        Row: {
          area_deviation_pct: number | null
          calculated_area_ha: number | null
          created_at: string
          declared_area_ha: number | null
          id: string
          satellite_image_url: string | null
          service_order_id: string
          updated_at: string
          validated_by: string | null
          validation_method: string | null
          validation_notes: string | null
          validation_status: string | null
          worked_polygon: Json | null
        }
        Insert: {
          area_deviation_pct?: number | null
          calculated_area_ha?: number | null
          created_at?: string
          declared_area_ha?: number | null
          id?: string
          satellite_image_url?: string | null
          service_order_id: string
          updated_at?: string
          validated_by?: string | null
          validation_method?: string | null
          validation_notes?: string | null
          validation_status?: string | null
          worked_polygon?: Json | null
        }
        Update: {
          area_deviation_pct?: number | null
          calculated_area_ha?: number | null
          created_at?: string
          declared_area_ha?: number | null
          id?: string
          satellite_image_url?: string | null
          service_order_id?: string
          updated_at?: string
          validated_by?: string | null
          validation_method?: string | null
          validation_notes?: string | null
          validation_status?: string | null
          worked_polygon?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanization_validations_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      module_permissions: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          module: Database["public"]["Enums"]["app_module"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          module: Database["public"]["Enums"]["app_module"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          module?: Database["public"]["Enums"]["app_module"]
          user_id?: string
        }
        Relationships: []
      }
      monitoring_alerts: {
        Row: {
          affected_area_ha: number | null
          affected_farmers_count: number | null
          alert_number: string
          alert_type: string
          assigned_to: string | null
          commune_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          municipality_id: string | null
          province_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          response_status: string
          severity: string
          source: string
          source_phone: string | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_area_ha?: number | null
          affected_farmers_count?: number | null
          alert_number: string
          alert_type?: string
          assigned_to?: string | null
          commune_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipality_id?: string | null
          province_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          response_status?: string
          severity?: string
          source?: string
          source_phone?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_area_ha?: number | null
          affected_farmers_count?: number | null
          alert_number?: string
          alert_type?: string
          assigned_to?: string | null
          commune_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipality_id?: string | null
          province_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          response_status?: string
          severity?: string
          source?: string
          source_phone?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitoring_alerts_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitoring_alerts_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitoring_alerts_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      municipalities: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name: string
          province_id: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name: string
          province_id: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name?: string
          province_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "municipalities_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      ndvi_readings: {
        Row: {
          created_at: string
          farmer_id: string | null
          id: string
          metadata: Json | null
          ndvi_value: number
          reading_date: string
          source: string | null
          stress_level: string | null
        }
        Insert: {
          created_at?: string
          farmer_id?: string | null
          id?: string
          metadata?: Json | null
          ndvi_value: number
          reading_date: string
          source?: string | null
          stress_level?: string | null
        }
        Update: {
          created_at?: string
          farmer_id?: string | null
          id?: string
          metadata?: Json | null
          ndvi_value?: number
          reading_date?: string
          source?: string | null
          stress_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ndvi_readings_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      occurrence_alerts: {
        Row: {
          alert_type: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          message: string
          occurrence_id: string
          recipient_email: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          occurrence_id: string
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          occurrence_id?: string
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "occurrence_alerts_occurrence_id_fkey"
            columns: ["occurrence_id"]
            isOneToOne: false
            referencedRelation: "climate_occurrences"
            referencedColumns: ["id"]
          },
        ]
      }
      occurrence_surveys: {
        Row: {
          completed_at: string | null
          created_at: string
          farmer_id: string | null
          id: string
          occurrence_id: string | null
          province_id: string | null
          questions: Json
          responses: Json | null
          sent_at: string | null
          status: string
          survey_type: string
          target_phone: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          farmer_id?: string | null
          id?: string
          occurrence_id?: string | null
          province_id?: string | null
          questions: Json
          responses?: Json | null
          sent_at?: string | null
          status?: string
          survey_type: string
          target_phone: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          farmer_id?: string | null
          id?: string
          occurrence_id?: string | null
          province_id?: string | null
          questions?: Json
          responses?: Json | null
          sent_at?: string | null
          status?: string
          survey_type?: string
          target_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "occurrence_surveys_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occurrence_surveys_occurrence_id_fkey"
            columns: ["occurrence_id"]
            isOneToOne: false
            referencedRelation: "climate_occurrences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occurrence_surveys_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_biometrics: {
        Row: {
          captured_by: string | null
          created_at: string
          device_id: string | null
          finger_position: string
          id: string
          operator_id: string | null
          quality_score: number | null
          template_data: string
        }
        Insert: {
          captured_by?: string | null
          created_at?: string
          device_id?: string | null
          finger_position: string
          id?: string
          operator_id?: string | null
          quality_score?: number | null
          template_data: string
        }
        Update: {
          captured_by?: string | null
          created_at?: string
          device_id?: string | null
          finger_position?: string
          id?: string
          operator_id?: string | null
          quality_score?: number | null
          template_data?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_biometrics_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "companion_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_biometrics_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_nfc_cards: {
        Row: {
          created_at: string
          id: string
          issued_at: string
          nfc_uid: string
          operator_id: string | null
          revoked_at: string | null
          revoked_reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          issued_at?: string
          nfc_uid: string
          operator_id?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          issued_at?: string
          nfc_uid?: string
          operator_id?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_nfc_cards_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "forest_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      parametric_rules: {
        Row: {
          created_at: string
          created_by: string | null
          crop: string | null
          description: string | null
          id: string
          is_active: boolean | null
          monitoring_period_days: number | null
          operator: string
          parameter: string
          payout_percentage: number
          province_id: string | null
          rule_name: string
          rule_type: string
          threshold_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          crop?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          monitoring_period_days?: number | null
          operator?: string
          parameter: string
          payout_percentage?: number
          province_id?: string | null
          rule_name: string
          rule_type?: string
          threshold_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          crop?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          monitoring_period_days?: number | null
          operator?: string
          parameter?: string
          payout_percentage?: number
          province_id?: string | null
          rule_name?: string
          rule_type?: string
          threshold_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parametric_rules_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_polygons: {
        Row: {
          created_at: string
          id: string
          parcel_id: string
          polygon: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          parcel_id: string
          polygon?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          parcel_id?: string
          polygon?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parcel_polygons_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "farmer_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_config: {
        Row: {
          config_data: Json
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          is_sandbox: boolean
          provider: string
          updated_at: string
        }
        Insert: {
          config_data?: Json
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean
          is_sandbox?: boolean
          provider: string
          updated_at?: string
        }
        Update: {
          config_data?: Json
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          is_sandbox?: boolean
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      pos_products: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          is_exempt: boolean
          iva_rate: number
          name: string
          price_aoa: number
          stock: number
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_exempt?: boolean
          iva_rate?: number
          name: string
          price_aoa?: number
          stock?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_exempt?: boolean
          iva_rate?: number
          name?: string
          price_aoa?: number
          stock?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      pos_sale_items: {
        Row: {
          created_at: string
          id: string
          is_exempt: boolean
          iva_rate: number
          iva_value_aoa: number
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
          subtotal_aoa: number
          unit_price_aoa: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_exempt?: boolean
          iva_rate?: number
          iva_value_aoa?: number
          product_id: string
          product_name: string
          quantity?: number
          sale_id: string
          subtotal_aoa?: number
          unit_price_aoa?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_exempt?: boolean
          iva_rate?: number
          iva_value_aoa?: number
          product_id?: string
          product_name?: string
          quantity?: number
          sale_id?: string
          subtotal_aoa?: number
          unit_price_aoa?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "pos_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "pos_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sales: {
        Row: {
          created_at: string
          farmer_id: string
          hash_anterior: string | null
          hash_fiscal: string | null
          id: string
          is_offline: boolean
          iva_total_aoa: number
          notes: string | null
          operator_id: string | null
          payment_method: Database["public"]["Enums"]["pos_payment_method"]
          payment_reference: string | null
          qr_data: string | null
          representative_bi: string | null
          representative_name: string | null
          representative_relationship: string | null
          status: string
          subtotal_aoa: number
          synced_at: string | null
          total_aoa: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          farmer_id: string
          hash_anterior?: string | null
          hash_fiscal?: string | null
          id?: string
          is_offline?: boolean
          iva_total_aoa?: number
          notes?: string | null
          operator_id?: string | null
          payment_method?: Database["public"]["Enums"]["pos_payment_method"]
          payment_reference?: string | null
          qr_data?: string | null
          representative_bi?: string | null
          representative_name?: string | null
          representative_relationship?: string | null
          status?: string
          subtotal_aoa?: number
          synced_at?: string | null
          total_aoa?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          farmer_id?: string
          hash_anterior?: string | null
          hash_fiscal?: string | null
          id?: string
          is_offline?: boolean
          iva_total_aoa?: number
          notes?: string | null
          operator_id?: string | null
          payment_method?: Database["public"]["Enums"]["pos_payment_method"]
          payment_reference?: string | null
          qr_data?: string | null
          representative_bi?: string | null
          representative_name?: string | null
          representative_relationship?: string | null
          status?: string
          subtotal_aoa?: number
          synced_at?: string | null
          total_aoa?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_sales_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      production_history: {
        Row: {
          actual_yield_kg: number | null
          area_planted_ha: number | null
          created_at: string
          crop_type: string
          expected_yield_kg: number | null
          farmer_id: string
          harvest_date: string | null
          id: string
          incer_area_seeded_ha: number | null
          incer_estimated_production: number | null
          incer_grain_production_id: string | null
          incer_info_source: string | null
          incer_loss_cause:
            | Database["public"]["Enums"]["incer_loss_cause"]
            | null
          incer_losses: number | null
          notes: string | null
          quality_grade: string | null
          season: string
          updated_at: string
          year: number
          yield_per_ha: number | null
        }
        Insert: {
          actual_yield_kg?: number | null
          area_planted_ha?: number | null
          created_at?: string
          crop_type: string
          expected_yield_kg?: number | null
          farmer_id: string
          harvest_date?: string | null
          id?: string
          incer_area_seeded_ha?: number | null
          incer_estimated_production?: number | null
          incer_grain_production_id?: string | null
          incer_info_source?: string | null
          incer_loss_cause?:
            | Database["public"]["Enums"]["incer_loss_cause"]
            | null
          incer_losses?: number | null
          notes?: string | null
          quality_grade?: string | null
          season: string
          updated_at?: string
          year: number
          yield_per_ha?: number | null
        }
        Update: {
          actual_yield_kg?: number | null
          area_planted_ha?: number | null
          created_at?: string
          crop_type?: string
          expected_yield_kg?: number | null
          farmer_id?: string
          harvest_date?: string | null
          id?: string
          incer_area_seeded_ha?: number | null
          incer_estimated_production?: number | null
          incer_grain_production_id?: string | null
          incer_info_source?: string | null
          incer_loss_cause?:
            | Database["public"]["Enums"]["incer_loss_cause"]
            | null
          incer_losses?: number | null
          notes?: string | null
          quality_grade?: string | null
          season?: string
          updated_at?: string
          year?: number
          yield_per_ha?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "production_history_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_history_incer_grain_production_id_fkey"
            columns: ["incer_grain_production_id"]
            isOneToOne: false
            referencedRelation: "incer_grain_production"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_history_incer_grain_production_id_fkey"
            columns: ["incer_grain_production_id"]
            isOneToOne: false
            referencedRelation: "v_incer_production_full"
            referencedColumns: ["incer_id"]
          },
        ]
      }
      production_history_certificates: {
        Row: {
          agricultural_practices: string[] | null
          average_productivity: number | null
          certificate_number: string
          certified_productions: Json
          created_at: string
          digital_signature: string | null
          farmer_id: string
          id: string
          is_valid: boolean | null
          issued_by: string | null
          period_end_year: number
          period_start_year: number
          productive_area_ha: number | null
          qr_code_data: string | null
          revocation_reason: string | null
          signed_at: string | null
          signed_by: string | null
          status: string | null
          total_production_kg: number | null
          updated_at: string
          validity_expiry: string | null
          verification_url: string | null
        }
        Insert: {
          agricultural_practices?: string[] | null
          average_productivity?: number | null
          certificate_number: string
          certified_productions?: Json
          created_at?: string
          digital_signature?: string | null
          farmer_id: string
          id?: string
          is_valid?: boolean | null
          issued_by?: string | null
          period_end_year: number
          period_start_year: number
          productive_area_ha?: number | null
          qr_code_data?: string | null
          revocation_reason?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: string | null
          total_production_kg?: number | null
          updated_at?: string
          validity_expiry?: string | null
          verification_url?: string | null
        }
        Update: {
          agricultural_practices?: string[] | null
          average_productivity?: number | null
          certificate_number?: string
          certified_productions?: Json
          created_at?: string
          digital_signature?: string | null
          farmer_id?: string
          id?: string
          is_valid?: boolean | null
          issued_by?: string | null
          period_end_year?: number
          period_start_year?: number
          productive_area_ha?: number | null
          qr_code_data?: string | null
          revocation_reason?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: string | null
          total_production_kg?: number | null
          updated_at?: string
          validity_expiry?: string | null
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_history_certificates_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          entity_id: string | null
          full_name: string
          id: string
          is_active: boolean
          municipality_id: string | null
          phone: string | null
          position: string | null
          province_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          entity_id?: string | null
          full_name: string
          id: string
          is_active?: boolean
          municipality_id?: string | null
          phone?: string | null
          position?: string | null
          province_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          entity_id?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          municipality_id?: string | null
          phone?: string | null
          position?: string | null
          province_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      province_risk_metrics: {
        Row: {
          critical_occurrences: number | null
          high_occurrences: number | null
          id: string
          low_occurrences: number | null
          medium_occurrences: number | null
          month: number
          province_id: string
          risk_score: number | null
          total_affected_area_ha: number | null
          total_affected_farmers: number | null
          total_estimated_loss_aoa: number | null
          total_occurrences: number | null
          updated_at: string
          year: number
        }
        Insert: {
          critical_occurrences?: number | null
          high_occurrences?: number | null
          id?: string
          low_occurrences?: number | null
          medium_occurrences?: number | null
          month: number
          province_id: string
          risk_score?: number | null
          total_affected_area_ha?: number | null
          total_affected_farmers?: number | null
          total_estimated_loss_aoa?: number | null
          total_occurrences?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          critical_occurrences?: number | null
          high_occurrences?: number | null
          id?: string
          low_occurrences?: number | null
          medium_occurrences?: number | null
          month?: number
          province_id?: string
          risk_score?: number | null
          total_affected_area_ha?: number | null
          total_affected_farmers?: number | null
          total_estimated_loss_aoa?: number | null
          total_occurrences?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "province_risk_metrics_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      provinces: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      purchase_package_items: {
        Row: {
          created_at: string
          id: string
          max_quantity: number
          package_id: string
          product_id: string | null
          product_name: string
          unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_quantity?: number
          package_id: string
          product_id?: string | null
          product_name: string
          unit?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_quantity?: number
          package_id?: string
          product_id?: string | null
          product_name?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_package_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "purchase_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_package_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "pos_products"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_packages: {
        Row: {
          campaign: string
          campaign_year: number
          created_at: string
          created_by: string | null
          crop_type: string | null
          farmer_id: string | null
          id: string
          municipality_id: string | null
          notes: string | null
          province_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign: string
          campaign_year?: number
          created_at?: string
          created_by?: string | null
          crop_type?: string | null
          farmer_id?: string | null
          id?: string
          municipality_id?: string | null
          notes?: string | null
          province_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          campaign?: string
          campaign_year?: number
          created_at?: string
          created_by?: string | null
          crop_type?: string | null
          farmer_id?: string | null
          id?: string
          municipality_id?: string | null
          notes?: string | null
          province_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_packages_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_packages_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_packages_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          area_ha: number | null
          center_id: string | null
          completed_at: string | null
          cost_aoa: number | null
          created_at: string
          created_by: string | null
          farmer_id: string | null
          id: string
          machine_name: string | null
          municipality_id: string | null
          notes: string | null
          operator_name: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          province_id: string | null
          requested_date: string
          scheduled_date: string | null
          service_type: string
          started_at: string | null
          status: string
          updated_at: string
          updated_by: string | null
          validated_at: string | null
        }
        Insert: {
          area_ha?: number | null
          center_id?: string | null
          completed_at?: string | null
          cost_aoa?: number | null
          created_at?: string
          created_by?: string | null
          farmer_id?: string | null
          id?: string
          machine_name?: string | null
          municipality_id?: string | null
          notes?: string | null
          operator_name?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          province_id?: string | null
          requested_date?: string
          scheduled_date?: string | null
          service_type?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          validated_at?: string | null
        }
        Update: {
          area_ha?: number | null
          center_id?: string | null
          completed_at?: string | null
          cost_aoa?: number | null
          created_at?: string
          created_by?: string | null
          farmer_id?: string | null
          id?: string
          machine_name?: string | null
          municipality_id?: string | null
          notes?: string | null
          operator_name?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          province_id?: string | null
          requested_date?: string
          scheduled_date?: string | null
          service_type?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "mechanization_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_received: {
        Row: {
          ai_interpretation: string | null
          alert_id: string | null
          id: string
          parsed_data: Json | null
          processed: boolean | null
          processed_at: string | null
          province_id: string | null
          raw_message: string
          received_at: string
          sender_phone: string
        }
        Insert: {
          ai_interpretation?: string | null
          alert_id?: string | null
          id?: string
          parsed_data?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          province_id?: string | null
          raw_message: string
          received_at?: string
          sender_phone: string
        }
        Update: {
          ai_interpretation?: string | null
          alert_id?: string | null
          id?: string
          parsed_data?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          province_id?: string | null
          raw_message?: string
          received_at?: string
          sender_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_received_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "monitoring_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_received_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_sent: {
        Row: {
          delivery_status: string | null
          id: string
          message_text: string
          municipality_id: string | null
          province_id: string | null
          recipient_phone: string
          sent_at: string
          sent_by: string | null
          target_zone: string | null
          template_code: string | null
        }
        Insert: {
          delivery_status?: string | null
          id?: string
          message_text: string
          municipality_id?: string | null
          province_id?: string | null
          recipient_phone: string
          sent_at?: string
          sent_by?: string | null
          target_zone?: string | null
          template_code?: string | null
        }
        Update: {
          delivery_status?: string | null
          id?: string
          message_text?: string
          municipality_id?: string | null
          province_id?: string | null
          recipient_phone?: string
          sent_at?: string
          sent_by?: string | null
          target_zone?: string | null
          template_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_sent_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_sent_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      subsidized_purchases: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          copayment_value_aoa: number
          created_at: string
          farmer_id: string
          id: string
          is_deferred: boolean
          notes: string | null
          order_service_id: string | null
          product_id: string | null
          product_name: string
          purchase_package_id: string | null
          quantity: number
          rejection_reason: string | null
          status: Database["public"]["Enums"]["purchase_status"]
          subsidy_percentage: number
          subsidy_value_aoa: number
          supplier: string | null
          total_value_aoa: number
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          copayment_value_aoa?: number
          created_at?: string
          farmer_id: string
          id?: string
          is_deferred?: boolean
          notes?: string | null
          order_service_id?: string | null
          product_id?: string | null
          product_name: string
          purchase_package_id?: string | null
          quantity?: number
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["purchase_status"]
          subsidy_percentage?: number
          subsidy_value_aoa?: number
          supplier?: string | null
          total_value_aoa?: number
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          copayment_value_aoa?: number
          created_at?: string
          farmer_id?: string
          id?: string
          is_deferred?: boolean
          notes?: string | null
          order_service_id?: string | null
          product_id?: string | null
          product_name?: string
          purchase_package_id?: string | null
          quantity?: number
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["purchase_status"]
          subsidy_percentage?: number
          subsidy_value_aoa?: number
          supplier?: string | null
          total_value_aoa?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subsidized_purchases_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subsidized_purchases_package_fk"
            columns: ["purchase_package_id"]
            isOneToOne: false
            referencedRelation: "purchase_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subsidized_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "pos_products"
            referencedColumns: ["id"]
          },
        ]
      }
      system_notifications: {
        Row: {
          category: string
          created_at: string
          expires_at: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          is_starred: boolean | null
          link: string | null
          message: string
          notification_type: string
          read_at: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          link?: string | null
          message: string
          notification_type?: string
          read_at?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          link?: string | null
          message?: string
          notification_type?: string
          read_at?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      trees: {
        Row: {
          common_name: string | null
          concession_id: string | null
          created_at: string
          created_by: string | null
          height: number | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          notes: string | null
          photo_url: string | null
          planting_date: string | null
          rfid_code: string
          scientific_name: string | null
          species: string | null
          status: Database["public"]["Enums"]["tree_health_status"]
          trunk_diameter: number | null
          updated_at: string
        }
        Insert: {
          common_name?: string | null
          concession_id?: string | null
          created_at?: string
          created_by?: string | null
          height?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notes?: string | null
          photo_url?: string | null
          planting_date?: string | null
          rfid_code: string
          scientific_name?: string | null
          species?: string | null
          status?: Database["public"]["Enums"]["tree_health_status"]
          trunk_diameter?: number | null
          updated_at?: string
        }
        Update: {
          common_name?: string | null
          concession_id?: string | null
          created_at?: string
          created_by?: string | null
          height?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notes?: string | null
          photo_url?: string | null
          planting_date?: string | null
          rfid_code?: string
          scientific_name?: string | null
          species?: string | null
          status?: Database["public"]["Enums"]["tree_health_status"]
          trunk_diameter?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trees_concession_id_fkey"
            columns: ["concession_id"]
            isOneToOne: false
            referencedRelation: "forest_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          dashboard_layout: Json | null
          default_province_id: string | null
          id: string
          language: string | null
          notifications_email: boolean | null
          notifications_push: boolean | null
          notifications_sms: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_layout?: Json | null
          default_province_id?: string | null
          id?: string
          language?: string | null
          notifications_email?: boolean | null
          notifications_push?: boolean | null
          notifications_sms?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_layout?: Json | null
          default_province_id?: string | null
          id?: string
          language?: string | null
          notifications_email?: boolean | null
          notifications_push?: boolean | null
          notifications_sms?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_default_province_id_fkey"
            columns: ["default_province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_configs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_optional: boolean
          level_name: string
          level_order: number
          required_role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          workflow_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_optional?: boolean
          level_name: string
          level_order: number
          required_role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          workflow_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_optional?: boolean
          level_name?: string
          level_order?: number
          required_role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          workflow_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      card_verification_view: {
        Row: {
          card_status: Database["public"]["Enums"]["card_status"] | null
          cultivated_area_ha: number | null
          farmer_name: string | null
          farmer_type: Database["public"]["Enums"]["farmer_type"] | null
          is_active: boolean | null
          issued_at: string | null
          main_crops: string[] | null
          municipality_name: string | null
          photo_url: string | null
          province_name: string | null
          qr_token: string | null
          serial: string | null
          updated_at: string | null
          version: number | null
        }
        Relationships: []
      }
      certificate_verification_public: {
        Row: {
          certificate_number: string | null
          certificate_type:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          expiry_date: string | null
          issue_date: string | null
          season: string | null
          status: Database["public"]["Enums"]["workflow_status"] | null
          verification_url: string | null
          year: number | null
        }
        Insert: {
          certificate_number?: string | null
          certificate_type?:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          expiry_date?: string | null
          issue_date?: string | null
          season?: string | null
          status?: Database["public"]["Enums"]["workflow_status"] | null
          verification_url?: string | null
          year?: number | null
        }
        Update: {
          certificate_number?: string | null
          certificate_type?:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          expiry_date?: string | null
          issue_date?: string | null
          season?: string | null
          status?: Database["public"]["Enums"]["workflow_status"] | null
          verification_url?: string | null
          year?: number | null
        }
        Relationships: []
      }
      coffee_verification_public: {
        Row: {
          harvest_season: string | null
          harvest_year: number | null
          lot_code: string | null
          origin_location: string | null
          processing_method: string | null
          quality_grade: string | null
          status: string | null
          variety: string | null
        }
        Insert: {
          harvest_season?: string | null
          harvest_year?: number | null
          lot_code?: string | null
          origin_location?: string | null
          processing_method?: string | null
          quality_grade?: string | null
          status?: string | null
          variety?: string | null
        }
        Update: {
          harvest_season?: string | null
          harvest_year?: number | null
          lot_code?: string | null
          origin_location?: string | null
          processing_method?: string | null
          quality_grade?: string | null
          status?: string | null
          variety?: string | null
        }
        Relationships: []
      }
      forestry_quota_balance_view: {
        Row: {
          admin_adj_m3: number | null
          allocated_m3: number | null
          balance_m3: number | null
          campaign_id: string | null
          felled_m3: number | null
          license_id: string | null
          province_id: string | null
          reversed_m3: number | null
          species_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forestry_quota_ledger_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "forestry_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_quota_ledger_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "forest_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_quota_ledger_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forestry_quota_ledger_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "forestry_species"
            referencedColumns: ["id"]
          },
        ]
      }
      grain_production_by_municipality: {
        Row: {
          area_ha: number | null
          avg_productivity_kg_ha: number | null
          grain_type: string | null
          harvested_ha: number | null
          municipality_id: string | null
          municipality_name: string | null
          production_tonnes: number | null
          province_id: string | null
          province_name: string | null
          records: number | null
          season: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rice_production_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rice_production_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      grain_production_by_province: {
        Row: {
          area_ha: number | null
          avg_productivity_kg_ha: number | null
          grain_type: string | null
          harvested_ha: number | null
          production_tonnes: number | null
          province_id: string | null
          province_name: string | null
          records: number | null
          season: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rice_production_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      incer_certificate_public_view: {
        Row: {
          certificate_number: string | null
          certificate_type:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          created_at: string | null
          crops: string[] | null
          expiry_date: string | null
          id: string | null
          incer_grain_classification: string | null
          incer_qr_token: string | null
          season: string | null
          status: Database["public"]["Enums"]["workflow_status"] | null
          total_area_ha: number | null
          total_quantity_kg: number | null
          year: number | null
        }
        Insert: {
          certificate_number?: string | null
          certificate_type?:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          created_at?: string | null
          crops?: string[] | null
          expiry_date?: string | null
          id?: string | null
          incer_grain_classification?: string | null
          incer_qr_token?: string | null
          season?: string | null
          status?: Database["public"]["Enums"]["workflow_status"] | null
          total_area_ha?: number | null
          total_quantity_kg?: number | null
          year?: number | null
        }
        Update: {
          certificate_number?: string | null
          certificate_type?:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          created_at?: string | null
          crops?: string[] | null
          expiry_date?: string | null
          id?: string | null
          incer_grain_classification?: string | null
          incer_qr_token?: string | null
          season?: string | null
          status?: Database["public"]["Enums"]["workflow_status"] | null
          total_area_ha?: number | null
          total_quantity_kg?: number | null
          year?: number | null
        }
        Relationships: []
      }
      license_verification_public: {
        Row: {
          expiry_date: string | null
          issue_date: string | null
          license_number: string | null
          license_type:
            | Database["public"]["Enums"]["forest_license_type"]
            | null
          status: Database["public"]["Enums"]["forest_license_status"] | null
        }
        Insert: {
          expiry_date?: string | null
          issue_date?: string | null
          license_number?: string | null
          license_type?:
            | Database["public"]["Enums"]["forest_license_type"]
            | null
          status?: Database["public"]["Enums"]["forest_license_status"] | null
        }
        Update: {
          expiry_date?: string | null
          issue_date?: string | null
          license_number?: string | null
          license_type?:
            | Database["public"]["Enums"]["forest_license_type"]
            | null
          status?: Database["public"]["Enums"]["forest_license_status"] | null
        }
        Relationships: []
      }
      log_verification_public: {
        Row: {
          log_code: string | null
          logged_at: string | null
          species: string | null
          status: Database["public"]["Enums"]["tracking_status"] | null
        }
        Insert: {
          log_code?: string | null
          logged_at?: string | null
          species?: string | null
          status?: Database["public"]["Enums"]["tracking_status"] | null
        }
        Update: {
          log_code?: string | null
          logged_at?: string | null
          species?: string | null
          status?: Database["public"]["Enums"]["tracking_status"] | null
        }
        Relationships: []
      }
      permit_verification_public: {
        Row: {
          issue_date: string | null
          permit_number: string | null
          status: string | null
          valid_until: string | null
        }
        Insert: {
          issue_date?: string | null
          permit_number?: string | null
          status?: string | null
          valid_until?: string | null
        }
        Update: {
          issue_date?: string | null
          permit_number?: string | null
          status?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      profiles_safe: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string | null
          entity_id: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          municipality_id: string | null
          phone: string | null
          position: string | null
          province_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: never
          entity_id?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          municipality_id?: string | null
          phone?: never
          position?: string | null
          province_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: never
          entity_id?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          municipality_id?: string | null
          phone?: never
          position?: string | null
          province_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      public_agriculture_by_province: {
        Row: {
          approved_count: number | null
          farmer_count: number | null
          province_name: string | null
        }
        Relationships: []
      }
      public_agriculture_stats: {
        Row: {
          approved_farmers: number | null
          certificates_issued: number | null
          company_count: number | null
          cooperative_count: number | null
          family_farmers: number | null
          field_school_count: number | null
          individual_farmers: number | null
          provinces_with_farmers: number | null
          total_cultivated_ha: number | null
          total_farmers: number | null
          total_production_kg: number | null
        }
        Relationships: []
      }
      public_climate_alerts: {
        Row: {
          affected_area_ha: number | null
          affected_farmers_count: number | null
          occurrence_type: string | null
          province_name: string | null
          report_date: string | null
          severity: string | null
          title: string | null
        }
        Relationships: []
      }
      public_coffee_stats: {
        Row: {
          exported_lots: number | null
          in_transit_lots: number | null
          premium_lots: number | null
          registered_lots: number | null
          standard_lots: number | null
          total_bags: number | null
          total_lots: number | null
          total_volume_kg: number | null
          varieties_count: number | null
        }
        Relationships: []
      }
      public_farmer_registry: {
        Row: {
          farmer_type: Database["public"]["Enums"]["farmer_type"] | null
          municipality_name: string | null
          name: string | null
          province_name: string | null
          registration_date: string | null
          registration_number: string | null
          status: string | null
        }
        Relationships: []
      }
      public_forestry_stats: {
        Row: {
          active_licenses: number | null
          planted_area_ha: number | null
          planted_seedlings: number | null
          reforestation_programs: number | null
          target_reforestation_ha: number | null
          target_seedlings: number | null
          total_complaints: number | null
          total_infractions: number | null
          total_licenses: number | null
          total_trees_registered: number | null
        }
        Relationships: []
      }
      public_indicators_by_year: {
        Row: {
          crop_type: string | null
          num_records: number | null
          productivity_kg_ha: number | null
          province_name: string | null
          total_area_ha: number | null
          total_quantity_kg: number | null
          year: number | null
        }
        Relationships: []
      }
      public_rice_stats: {
        Row: {
          avg_retail_price_aoa: number | null
          import_records: number | null
          production_records: number | null
          total_area_ha: number | null
          total_imports_tonnes: number | null
          total_production_tonnes: number | null
        }
        Relationships: []
      }
      risk_overlay_events: {
        Row: {
          affected_area_ha: number | null
          affected_farmers_count: number | null
          description: string | null
          estimated_loss_aoa: number | null
          event_date: string | null
          id: string | null
          latitude: number | null
          longitude: number | null
          municipality_id: string | null
          province_id: string | null
          risk_category: string | null
          severity: string | null
          source: string | null
          status: string | null
          title: string | null
        }
        Relationships: []
      }
      v_incer_production_full: {
        Row: {
          actual_yield_kg: number | null
          area_ha: number | null
          campaign_id: string | null
          commune_id: string | null
          crop: string | null
          expected_yield_kg: number | null
          farmer_id: string | null
          harvest_date: string | null
          incer_id: string | null
          municipality_id: string | null
          ph_id: string | null
          ph_year: number | null
          production_history_id: string | null
          production_kg: number | null
          program_id: string | null
          province_id: string | null
          quality_grade: string | null
          season: string | null
          status: Database["public"]["Enums"]["incer_operation_status"] | null
          variety: string | null
          yield_kg_ha: number | null
          yield_per_ha: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incer_grain_production_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "farmer_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_production_history_id_fkey"
            columns: ["production_history_id"]
            isOneToOne: false
            referencedRelation: "production_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_production_history_id_fkey"
            columns: ["production_history_id"]
            isOneToOne: false
            referencedRelation: "v_incer_production_full"
            referencedColumns: ["ph_id"]
          },
          {
            foreignKeyName: "incer_grain_production_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "incer_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incer_grain_production_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _incer_req_ip: { Args: never; Returns: string }
      _incer_req_ua: { Args: never; Returns: string }
      calculate_forest_fee: {
        Args: {
          _license_type: Database["public"]["Enums"]["forest_license_type"]
          _province_id?: string
          _quantity?: number
          _species_category?: Database["public"]["Enums"]["forest_species_category"]
        }
        Returns: {
          base_fee_aoa: number
          fee_id: string
          matched_category: Database["public"]["Enums"]["forest_species_category"]
          matched_province: string
          quantity: number
          total_aoa: number
          unit: Database["public"]["Enums"]["forest_fee_unit"]
        }[]
      }
      calculate_risk_score: {
        Args: {
          p_affected_area: number
          p_affected_farmers: number
          p_critical: number
          p_high: number
          p_low: number
          p_medium: number
        }
        Returns: number
      }
      can_access_municipality: {
        Args: { _municipality_id: string; _user_id: string }
        Returns: boolean
      }
      can_access_province:
        | { Args: { _province_id: string }; Returns: boolean }
        | { Args: { _province_id: string; _user_id: string }; Returns: boolean }
      can_manage_user: {
        Args: {
          _manager_id: string
          _target_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      dblink: { Args: { "": string }; Returns: Record<string, unknown>[] }
      dblink_cancel_query: { Args: { "": string }; Returns: string }
      dblink_close: { Args: { "": string }; Returns: string }
      dblink_connect: { Args: { "": string }; Returns: string }
      dblink_connect_u: { Args: { "": string }; Returns: string }
      dblink_current_query: { Args: never; Returns: string }
      dblink_disconnect:
        | { Args: never; Returns: string }
        | { Args: { "": string }; Returns: string }
      dblink_error_message: { Args: { "": string }; Returns: string }
      dblink_exec: { Args: { "": string }; Returns: string }
      dblink_fdw_validator: {
        Args: { catalog: unknown; options: string[] }
        Returns: undefined
      }
      dblink_get_connections: { Args: never; Returns: string[] }
      dblink_get_notify:
        | { Args: { conname: string }; Returns: Record<string, unknown>[] }
        | { Args: never; Returns: Record<string, unknown>[] }
      dblink_get_pkey: {
        Args: { "": string }
        Returns: Database["public"]["CompositeTypes"]["dblink_pkey_results"][]
        SetofOptions: {
          from: "*"
          to: "dblink_pkey_results"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      dblink_get_result: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      dblink_is_busy: { Args: { "": string }; Returns: number }
      detect_eligibility_block_anomalies: { Args: never; Returns: number }
      fn_volume_within_tolerance: {
        Args: { _available: number; _used: number }
        Returns: boolean
      }
      forestry_active_campaign: { Args: never; Returns: string }
      forestry_active_campaign_id: { Args: never; Returns: string }
      forestry_block: {
        Args: {
          _payload: Json
          _reason: string
          _rule_code: string
          _severity: string
          _target_id: string
          _target_table: string
        }
        Returns: undefined
      }
      forestry_get_quota_balance: {
        Args: { _campaign_id: string; _license_id: string; _species_id: string }
        Returns: number
      }
      forestry_lock_license: {
        Args: { _license_id: string }
        Returns: undefined
      }
      forestry_raise_block: {
        Args: {
          _code: string
          _payload: Json
          _reason: string
          _ref: string
          _table: string
        }
        Returns: undefined
      }
      forestry_rule_active: {
        Args: { _code: string }
        Returns: {
          config: Json
          is_active: boolean
          rule_id: string
          severity: string
        }[]
      }
      forestry_seed_rules_for_campaign: {
        Args: { _campaign_id: string }
        Returns: number
      }
      geo_consistency_report: { Args: never; Returns: Json }
      geo_fix_orphan_communes: { Args: never; Returns: Json }
      geo_fix_placeholder_communes: { Args: never; Returns: Json }
      get_my_module_permissions: {
        Args: never
        Returns: Database["public"]["Enums"]["app_module"][]
      }
      get_user_municipality: { Args: { _user_id: string }; Returns: string }
      get_user_province: { Args: { _user_id: string }; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["user_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_module_access: {
        Args: {
          _module: Database["public"]["Enums"]["app_module"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      incer_block: {
        Args: {
          _context?: Json
          _entity_id: string
          _entity_table: string
          _reason: string
          _rule_code: string
        }
        Returns: undefined
      }
      incer_can_transition_inspection: {
        Args: {
          _current: Database["public"]["Enums"]["incer_operation_status"]
          _next: Database["public"]["Enums"]["incer_operation_status"]
          _user_id: string
        }
        Returns: boolean
      }
      incer_log_document_action: {
        Args: {
          _action: string
          _changes?: Json
          _device_meta?: Json
          _document_code: string
          _entity_id: string
          _entity_type: string
          _notes?: string
        }
        Returns: string
      }
      incer_next_document_number: {
        Args: { _document_code: string }
        Returns: string
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_national_admin: { Args: { _user_id: string }; Returns: boolean }
      is_national_level: { Args: { _user_id: string }; Returns: boolean }
      is_technician_or_admin: { Args: { _user_id: string }; Returns: boolean }
      log_card_scan: {
        Args: { _meta?: Json; _qr_token: string }
        Returns: undefined
      }
      log_eligibility_block: {
        Args: {
          _attempted_by: string
          _farmer_id: string
          _farmer_type: Database["public"]["Enums"]["farmer_type"]
          _payload: Json
          _reason: string
          _target_table: string
        }
        Returns: undefined
      }
      notify_eudr_level_reviewers: {
        Args: { _batch_id: string }
        Returns: number
      }
      regenerate_card_qr: { Args: { _card_id: string }; Returns: string }
      revoke_farmer_card: {
        Args: { _card_id: string; _reason: string }
        Returns: undefined
      }
      scan_transport_checkpoint: {
        Args: {
          _checkpoint_name: string
          _lat: number
          _lng: number
          _max_corridor_km?: number
          _observations?: string
          _permit_number: string
        }
        Returns: {
          checkpoint_name: string
          created_at: string
          distance_from_corridor_km: number | null
          flags: Json | null
          id: string
          is_within_corridor: boolean | null
          is_within_validity: boolean | null
          latitude: number | null
          longitude: number | null
          observations: string | null
          permit_id: string
          scanned_at: string
          scanned_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "forest_transport_checkpoints"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_farmer_wallet_pin: {
        Args: { _pin_hash: string; _wallet_id: string }
        Returns: undefined
      }
      submit_eudr_batch: {
        Args: { _batch_id: string }
        Returns: {
          batch_number: string | null
          created_at: string
          created_by: string | null
          current_level: number
          description: string | null
          finalized_at: string | null
          id: string
          province_id: string | null
          status: Database["public"]["Enums"]["eudr_batch_status"]
          title: string
          total_items: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "eudr_approval_batches"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      verify_card_by_code: {
        Args: { _code: string }
        Returns: {
          card_status: string
          cultivated_area_ha: number
          farmer_name: string
          farmer_type: string
          is_active: boolean
          issued_at: string
          main_crops: string[]
          match_kind: string
          municipality_name: string
          photo_url: string
          province_name: string
          qr_token: string
          serial: string
          updated_at: string
          version: number
        }[]
      }
      verify_data_integrity: {
        Args: never
        Returns: {
          check_key: string
          description: string
          offending_count: number
          sample_ids: Json
          severity: string
        }[]
      }
      verify_farmer_wallet_pin: {
        Args: { _pin_hash: string; _wallet_id: string }
        Returns: boolean
      }
      verify_forestry_document: {
        Args: { _qr: string }
        Returns: {
          compliance_seal: string
          destination_country: string
          doc_kind: string
          doc_number: string
          doc_status: string
          issue_date: string
          operator_legal_name: string
          product_form: string
          province_name: string
          species_name: string
          unit: string
          valid_until: string
          volume_or_qty: number
        }[]
      }
      verify_incer_certificate: { Args: { _token: string }; Returns: Json }
      verify_incer_document: { Args: { _token: string }; Returns: Json }
      verify_transport_permit: {
        Args: { _permit_number: string }
        Returns: {
          arrival_at: string
          departure_at: string
          destination_location: string
          id: string
          issue_date: string
          origin_location: string
          permit_number: string
          species_summary: Json
          status: string
          total_volume_m3: number
          valid_until: string
          vehicle_plate: string
        }[]
      }
    }
    Enums: {
      app_module:
        | "farmers"
        | "forestry"
        | "coffee"
        | "rice"
        | "pos"
        | "mechanization"
        | "credit_insurance"
        | "incentives"
        | "climate_risk"
        | "ipn"
        | "data_lab"
        | "occurrences"
        | "grains"
      card_event_type:
        | "generated"
        | "printed"
        | "delivered"
        | "revoked"
        | "reissued"
        | "qr_regenerated"
        | "scanned"
      card_export_log_level: "info" | "warning" | "error"
      card_status: "rascunho" | "gerado" | "impresso" | "entregue" | "revogado"
      certificate_type:
        | "production"
        | "organic"
        | "quality"
        | "origin"
        | "good_practices"
      eudr_batch_status:
        | "draft"
        | "in_review"
        | "approved"
        | "rejected"
        | "cancelled"
      eudr_decision_type: "approve" | "reject" | "request_changes"
      export_job_status: "pending" | "processing" | "done" | "error"
      farmer_type:
        | "individual"
        | "family"
        | "cooperative"
        | "field_school"
        | "company"
      forest_fee_unit: "m3" | "ha" | "unit" | "license"
      forest_license_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "active"
        | "suspended"
        | "expired"
        | "revoked"
        | "rejected"
      forest_license_type:
        | "exploitation"
        | "transport"
        | "export"
        | "sawmill"
        | "processing"
      forest_operator_status: "ativo" | "suspenso" | "inativo" | "cancelado"
      forest_operator_type:
        | "singular"
        | "coletiva"
        | "cooperativa"
        | "comunitaria"
        | "publica"
      forest_product_status:
        | "em_stock"
        | "reservado"
        | "transferido"
        | "exportado"
        | "vendido"
        | "perda"
      forest_product_type:
        | "tabua"
        | "viga"
        | "contraplacado"
        | "lasca"
        | "poste"
        | "dormente"
        | "outro"
      forest_species_category: "classe_1" | "classe_2" | "classe_3" | "todas"
      forest_transformation_status:
        | "em_processamento"
        | "concluido"
        | "flagged"
        | "cancelado"
      forestry_campaign_status:
        | "rascunho"
        | "activa"
        | "encerrada"
        | "arquivada"
      forestry_export_status:
        | "rascunho"
        | "submetido"
        | "validado"
        | "aprovado"
        | "recusado"
        | "emitido"
      forestry_product_form: "bruto" | "serrado" | "transformado" | "pfnl"
      forestry_product_kind:
        | "madeira_toro"
        | "madeira_serrada"
        | "varas"
        | "estacas"
        | "postes"
        | "cascas"
        | "combustivel_vegetal"
        | "fibras"
        | "pfnl"
      forestry_quota_movement:
        | "atribuicao"
        | "corte"
        | "estorno"
        | "ajuste_admin"
      forestry_rule_severity: "dura" | "suave" | "desactivada"
      forestry_suspension_status:
        | "vigente"
        | "prorrogada"
        | "caducada"
        | "indefinida"
      grain_type:
        | "arroz"
        | "milho"
        | "trigo"
        | "sorgo"
        | "massambala"
        | "massango"
        | "cevada"
        | "aveia"
      import_license_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "issued"
        | "rejected"
        | "expired"
        | "revoked"
      import_person_type: "singular" | "colectiva"
      import_product_category:
        | "madeira"
        | "sementes"
        | "mudas"
        | "fertilizantes"
        | "pesticidas"
        | "equipamento"
        | "racao"
        | "outro"
      incer_agent_type:
        | "comerciante"
        | "armazenista"
        | "importador"
        | "exportador"
        | "transformador"
        | "outro"
        | "produtor"
      incer_assistance_type:
        | "agronomica"
        | "pragas"
        | "solos"
        | "irrigacao"
        | "pos_colheita"
        | "outra"
      incer_infra_type:
        | "armazem"
        | "silo"
        | "centro_beneficiamento"
        | "laboratorio"
        | "outro"
      incer_input_type:
        | "semente"
        | "fertilizante"
        | "pesticida"
        | "correctivo"
        | "outro"
      incer_inspection_type:
        | "rotina"
        | "denuncia"
        | "renovacao"
        | "certificacao"
        | "outra"
      incer_lab_result: "aprovado" | "reprovado" | "inconclusivo"
      incer_loss_cause: "pragas" | "seca" | "enchente" | "armazenagem" | "outra"
      incer_operation_status:
        | "rascunho"
        | "submetido"
        | "em_analise"
        | "devolvido"
        | "aprovado"
        | "rejeitado"
        | "suspenso"
        | "concluido"
        | "arquivado"
        | "bloqueado"
        | "validado"
        | "emitido"
      incer_partnership_status:
        | "proposta"
        | "em_parecer"
        | "aprovado"
        | "activo"
        | "encerrado"
        | "arquivado"
      incer_partnership_type:
        | "contrato"
        | "protocolo"
        | "memorando"
        | "acordo"
        | "parceria"
      incer_sample_origin:
        | "produtor"
        | "armazem"
        | "importacao"
        | "fiscalizacao"
        | "certificacao"
      incer_unit:
        | "toneladas"
        | "kg"
        | "sacos"
        | "litros"
        | "unidade"
        | "g"
        | "ml"
      infraction_status:
        | "reported"
        | "investigating"
        | "confirmed"
        | "contested"
        | "sanctioned"
        | "appealed"
        | "closed"
        | "archived"
      infraction_type:
        | "illegal_cutting"
        | "transport_without_license"
        | "exceeded_quota"
        | "protected_species"
        | "false_declaration"
        | "document_forgery"
        | "unauthorized_area"
        | "environmental_damage"
        | "other"
      invoice_series_type: "FE" | "FR" | "NC"
      invoice_status:
        | "emitida"
        | "pendente"
        | "comunicada"
        | "aceite"
        | "rejeitada"
      pos_payment_method: "agropay" | "unitel_money" | "deferred"
      purchase_status: "pending" | "approved" | "rejected" | "completed"
      tag_entity_kind: "tree" | "log" | "product"
      tag_kind: "qr" | "rfid" | "nfc" | "paint"
      tag_status: "active" | "revoked" | "lost" | "replaced"
      tracking_status:
        | "at_origin"
        | "felled"
        | "logged"
        | "in_transport"
        | "at_checkpoint"
        | "at_sawmill"
        | "processed"
        | "in_storage"
        | "exported"
        | "at_destination"
      tree_health_status: "saudavel" | "em_risco" | "doente" | "removida"
      user_role:
        | "admin_national"
        | "admin_provincial"
        | "admin_municipal"
        | "technician_national"
        | "technician_provincial"
        | "technician_municipal"
        | "private_entity"
        | "viewer"
      wood_classification:
        | "precious"
        | "first_class"
        | "second_class"
        | "common"
      workflow_status:
        | "draft"
        | "submitted"
        | "validated"
        | "approved"
        | "issued"
        | "rejected"
        | "expired"
    }
    CompositeTypes: {
      dblink_pkey_results: {
        position: number | null
        colname: string | null
      }
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
    Enums: {
      app_module: [
        "farmers",
        "forestry",
        "coffee",
        "rice",
        "pos",
        "mechanization",
        "credit_insurance",
        "incentives",
        "climate_risk",
        "ipn",
        "data_lab",
        "occurrences",
        "grains",
      ],
      card_event_type: [
        "generated",
        "printed",
        "delivered",
        "revoked",
        "reissued",
        "qr_regenerated",
        "scanned",
      ],
      card_export_log_level: ["info", "warning", "error"],
      card_status: ["rascunho", "gerado", "impresso", "entregue", "revogado"],
      certificate_type: [
        "production",
        "organic",
        "quality",
        "origin",
        "good_practices",
      ],
      eudr_batch_status: [
        "draft",
        "in_review",
        "approved",
        "rejected",
        "cancelled",
      ],
      eudr_decision_type: ["approve", "reject", "request_changes"],
      export_job_status: ["pending", "processing", "done", "error"],
      farmer_type: [
        "individual",
        "family",
        "cooperative",
        "field_school",
        "company",
      ],
      forest_fee_unit: ["m3", "ha", "unit", "license"],
      forest_license_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "active",
        "suspended",
        "expired",
        "revoked",
        "rejected",
      ],
      forest_license_type: [
        "exploitation",
        "transport",
        "export",
        "sawmill",
        "processing",
      ],
      forest_operator_status: ["ativo", "suspenso", "inativo", "cancelado"],
      forest_operator_type: [
        "singular",
        "coletiva",
        "cooperativa",
        "comunitaria",
        "publica",
      ],
      forest_product_status: [
        "em_stock",
        "reservado",
        "transferido",
        "exportado",
        "vendido",
        "perda",
      ],
      forest_product_type: [
        "tabua",
        "viga",
        "contraplacado",
        "lasca",
        "poste",
        "dormente",
        "outro",
      ],
      forest_species_category: ["classe_1", "classe_2", "classe_3", "todas"],
      forest_transformation_status: [
        "em_processamento",
        "concluido",
        "flagged",
        "cancelado",
      ],
      forestry_campaign_status: [
        "rascunho",
        "activa",
        "encerrada",
        "arquivada",
      ],
      forestry_export_status: [
        "rascunho",
        "submetido",
        "validado",
        "aprovado",
        "recusado",
        "emitido",
      ],
      forestry_product_form: ["bruto", "serrado", "transformado", "pfnl"],
      forestry_product_kind: [
        "madeira_toro",
        "madeira_serrada",
        "varas",
        "estacas",
        "postes",
        "cascas",
        "combustivel_vegetal",
        "fibras",
        "pfnl",
      ],
      forestry_quota_movement: [
        "atribuicao",
        "corte",
        "estorno",
        "ajuste_admin",
      ],
      forestry_rule_severity: ["dura", "suave", "desactivada"],
      forestry_suspension_status: [
        "vigente",
        "prorrogada",
        "caducada",
        "indefinida",
      ],
      grain_type: [
        "arroz",
        "milho",
        "trigo",
        "sorgo",
        "massambala",
        "massango",
        "cevada",
        "aveia",
      ],
      import_license_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "issued",
        "rejected",
        "expired",
        "revoked",
      ],
      import_person_type: ["singular", "colectiva"],
      import_product_category: [
        "madeira",
        "sementes",
        "mudas",
        "fertilizantes",
        "pesticidas",
        "equipamento",
        "racao",
        "outro",
      ],
      incer_agent_type: [
        "comerciante",
        "armazenista",
        "importador",
        "exportador",
        "transformador",
        "outro",
        "produtor",
      ],
      incer_assistance_type: [
        "agronomica",
        "pragas",
        "solos",
        "irrigacao",
        "pos_colheita",
        "outra",
      ],
      incer_infra_type: [
        "armazem",
        "silo",
        "centro_beneficiamento",
        "laboratorio",
        "outro",
      ],
      incer_input_type: [
        "semente",
        "fertilizante",
        "pesticida",
        "correctivo",
        "outro",
      ],
      incer_inspection_type: [
        "rotina",
        "denuncia",
        "renovacao",
        "certificacao",
        "outra",
      ],
      incer_lab_result: ["aprovado", "reprovado", "inconclusivo"],
      incer_loss_cause: ["pragas", "seca", "enchente", "armazenagem", "outra"],
      incer_operation_status: [
        "rascunho",
        "submetido",
        "em_analise",
        "devolvido",
        "aprovado",
        "rejeitado",
        "suspenso",
        "concluido",
        "arquivado",
        "bloqueado",
        "validado",
        "emitido",
      ],
      incer_partnership_status: [
        "proposta",
        "em_parecer",
        "aprovado",
        "activo",
        "encerrado",
        "arquivado",
      ],
      incer_partnership_type: [
        "contrato",
        "protocolo",
        "memorando",
        "acordo",
        "parceria",
      ],
      incer_sample_origin: [
        "produtor",
        "armazem",
        "importacao",
        "fiscalizacao",
        "certificacao",
      ],
      incer_unit: ["toneladas", "kg", "sacos", "litros", "unidade", "g", "ml"],
      infraction_status: [
        "reported",
        "investigating",
        "confirmed",
        "contested",
        "sanctioned",
        "appealed",
        "closed",
        "archived",
      ],
      infraction_type: [
        "illegal_cutting",
        "transport_without_license",
        "exceeded_quota",
        "protected_species",
        "false_declaration",
        "document_forgery",
        "unauthorized_area",
        "environmental_damage",
        "other",
      ],
      invoice_series_type: ["FE", "FR", "NC"],
      invoice_status: [
        "emitida",
        "pendente",
        "comunicada",
        "aceite",
        "rejeitada",
      ],
      pos_payment_method: ["agropay", "unitel_money", "deferred"],
      purchase_status: ["pending", "approved", "rejected", "completed"],
      tag_entity_kind: ["tree", "log", "product"],
      tag_kind: ["qr", "rfid", "nfc", "paint"],
      tag_status: ["active", "revoked", "lost", "replaced"],
      tracking_status: [
        "at_origin",
        "felled",
        "logged",
        "in_transport",
        "at_checkpoint",
        "at_sawmill",
        "processed",
        "in_storage",
        "exported",
        "at_destination",
      ],
      tree_health_status: ["saudavel", "em_risco", "doente", "removida"],
      user_role: [
        "admin_national",
        "admin_provincial",
        "admin_municipal",
        "technician_national",
        "technician_provincial",
        "technician_municipal",
        "private_entity",
        "viewer",
      ],
      wood_classification: [
        "precious",
        "first_class",
        "second_class",
        "common",
      ],
      workflow_status: [
        "draft",
        "submitted",
        "validated",
        "approved",
        "issued",
        "rejected",
        "expired",
      ],
    },
  },
} as const
