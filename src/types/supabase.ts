export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      themes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          preview_image: string | null;
          config: Json;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          preview_image?: string | null;
          config?: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          preview_image?: string | null;
          config?: Json;
          is_public?: boolean;
          updated_at?: string;
        };
      };
      profile_pages: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          title: string | null;
          description: string | null;
          avatar_url: string | null;
          theme_id: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          title?: string | null;
          description?: string | null;
          avatar_url?: string | null;
          theme_id?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          title?: string | null;
          description?: string | null;
          avatar_url?: string | null;
          theme_id?: string | null;
          is_published?: boolean;
          updated_at?: string;
        };
      };
      profile_links: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          url: string;
          icon: string | null;
          position: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          url: string;
          icon?: string | null;
          position: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          url?: string;
          icon?: string | null;
          position?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      profile_socials: {
        Row: {
          id: string;
          profile_id: string;
          platform: string;
          url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          platform: string;
          url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          platform?: string;
          url?: string;
          updated_at?: string;
        };
      };
      link_clicks: {
        Row: {
          id: string;
          link_id: string;
          clicked_at: string;
          country: string | null;
          city: string | null;
          referer: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          link_id: string;
          clicked_at?: string;
          country?: string | null;
          city?: string | null;
          referer?: string | null;
          user_agent?: string | null;
        };
        Update: {
          country?: string | null;
          city?: string | null;
          referer?: string | null;
          user_agent?: string | null;
        };
      };
    };
    Views: {
      public_profile_view: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          title: string | null;
          description: string | null;
          avatar_url: string | null;
          theme: Json | null;
          links: Json;
          socials: Json;
        };
      };
      dashboard_profile_view: {
        Row: {
          profile_id: string;
          user_id: string;
          username: string;
          title: string | null;
          description: string | null;
          avatar_url: string | null;
          theme_id: string | null;
          total_links: number;
          total_socials: number;
          total_clicks: number;
          created_at: string;
        };
      };
      analytics_summary_view: {
        Row: {
          profile_id: string;
          total_clicks: number;
          clicks_today: number;
          clicks_last_7_days: number;
          clicks_last_30_days: number;
        };
      };
    };
    Functions: {
      get_profile_by_username: {
        Args: {
          username: string;
        };
        Returns: Json | null;
      };
      get_dashboard: {
        Args: Record<string, never>;
        Returns: Json | null;
      };
      increment_link_click: {
        Args: {
          link_id: string;
          request_referer?: string | null;
          request_user_agent?: string | null;
          request_country?: string | null;
          request_city?: string | null;
        };
        Returns: Json;
      };
    };
  };
}
