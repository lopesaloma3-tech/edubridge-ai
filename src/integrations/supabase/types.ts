export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      system_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_audit_log: {
        Row: {
          id: string;
          actor_id: string;
          action: string;
          target_type: string | null;
          target_id: string | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id: string;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          details?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          code: string;
          created_at: string;
          description: string | null;
          head_user_id: string | null;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          description?: string | null;
          head_user_id?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string | null;
          head_user_id?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      academic_terms: {
        Row: {
          academic_year: string;
          created_at: string;
          end_date: string;
          id: string;
          is_current: boolean;
          name: string;
          start_date: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          academic_year: string;
          created_at?: string;
          end_date: string;
          id?: string;
          is_current?: boolean;
          name: string;
          start_date: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          academic_year?: string;
          created_at?: string;
          end_date?: string;
          id?: string;
          is_current?: boolean;
          name?: string;
          start_date?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          code: string;
          created_at: string;
          credits: number | null;
          department_id: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          credits?: number | null;
          department_id: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          credits?: number | null;
          department_id?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          code: string;
          created_at: string;
          delivery_mode: string | null;
          department_id: string;
          description: string | null;
          id: string;
          next_session_at: string | null;
          progress_percent: number;
          status: string;
          subject_id: string | null;
          teacher_id: string | null;
          term_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          delivery_mode?: string | null;
          department_id: string;
          description?: string | null;
          id?: string;
          next_session_at?: string | null;
          progress_percent?: number;
          status?: string;
          subject_id?: string | null;
          teacher_id?: string | null;
          term_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          delivery_mode?: string | null;
          department_id?: string;
          description?: string | null;
          id?: string;
          next_session_at?: string | null;
          progress_percent?: number;
          status?: string;
          subject_id?: string | null;
          teacher_id?: string | null;
          term_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_profiles: {
        Row: {
          admission_date: string | null;
          created_at: string;
          current_term_id: string | null;
          date_of_birth: string | null;
          department_id: string | null;
          status: string;
          student_number: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admission_date?: string | null;
          created_at?: string;
          current_term_id?: string | null;
          date_of_birth?: string | null;
          department_id?: string | null;
          status?: string;
          student_number?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admission_date?: string | null;
          created_at?: string;
          current_term_id?: string | null;
          date_of_birth?: string | null;
          department_id?: string | null;
          status?: string;
          student_number?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      teacher_profiles: {
        Row: {
          created_at: string;
          department_id: string | null;
          designation: string | null;
          employee_number: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          department_id?: string | null;
          designation?: string | null;
          employee_number?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          department_id?: string | null;
          designation?: string | null;
          employee_number?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      parent_student_links: {
        Row: {
          created_at: string;
          id: string;
          is_primary: boolean;
          parent_user_id: string;
          relationship: string | null;
          student_user_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          parent_user_id: string;
          relationship?: string | null;
          student_user_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          parent_user_id?: string;
          relationship?: string | null;
          student_user_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_enrollments: {
        Row: {
          course_id: string;
          created_at: string;
          enrolled_at: string;
          final_grade: string | null;
          final_score: number | null;
          id: string;
          status: string;
          student_user_id: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          enrolled_at?: string;
          final_grade?: string | null;
          final_score?: number | null;
          id?: string;
          status?: string;
          student_user_id: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          enrolled_at?: string;
          final_grade?: string | null;
          final_score?: number | null;
          id?: string;
          status?: string;
          student_user_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_materials: {
        Row: {
          course_id: string;
          created_at: string;
          description: string | null;
          external_url: string | null;
          id: string;
          is_published: boolean;
          material_type: string;
          published_at: string | null;
          storage_path: string | null;
          title: string;
          updated_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          description?: string | null;
          external_url?: string | null;
          id?: string;
          is_published?: boolean;
          material_type: string;
          published_at?: string | null;
          storage_path?: string | null;
          title: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          description?: string | null;
          external_url?: string | null;
          id?: string;
          is_published?: boolean;
          material_type?: string;
          published_at?: string | null;
          storage_path?: string | null;
          title?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [];
      };
      assignments: {
        Row: {
          course_id: string;
          created_at: string;
          created_by: string | null;
          description: string | null;
          due_at: string | null;
          id: string;
          instructions: string | null;
          max_score: number | null;
          published_at: string | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_at?: string | null;
          id?: string;
          instructions?: string | null;
          max_score?: number | null;
          published_at?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_at?: string | null;
          id?: string;
          instructions?: string | null;
          max_score?: number | null;
          published_at?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assignment_submissions: {
        Row: {
          assignment_id: string;
          created_at: string;
          feedback: string | null;
          graded_at: string | null;
          graded_by: string | null;
          id: string;
          score: number | null;
          status: string;
          storage_path: string | null;
          student_user_id: string;
          submission_text: string | null;
          submitted_at: string | null;
          updated_at: string;
        };
        Insert: {
          assignment_id: string;
          created_at?: string;
          feedback?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
          id?: string;
          score?: number | null;
          status?: string;
          storage_path?: string | null;
          student_user_id: string;
          submission_text?: string | null;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Update: {
          assignment_id?: string;
          created_at?: string;
          feedback?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
          id?: string;
          score?: number | null;
          status?: string;
          storage_path?: string | null;
          student_user_id?: string;
          submission_text?: string | null;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          close_at: string | null;
          course_id: string;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          max_score: number | null;
          open_at: string | null;
          question_count: number;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          close_at?: string | null;
          course_id: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          max_score?: number | null;
          open_at?: string | null;
          question_count?: number;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          close_at?: string | null;
          course_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          max_score?: number | null;
          open_at?: string | null;
          question_count?: number;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          attempt_no: number;
          created_at: string;
          id: string;
          quiz_id: string;
          score: number | null;
          started_at: string | null;
          status: string;
          student_user_id: string;
          submitted_at: string | null;
          updated_at: string;
        };
        Insert: {
          attempt_no?: number;
          created_at?: string;
          id?: string;
          quiz_id: string;
          score?: number | null;
          started_at?: string | null;
          status?: string;
          student_user_id: string;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Update: {
          attempt_no?: number;
          created_at?: string;
          id?: string;
          quiz_id?: string;
          score?: number | null;
          started_at?: string | null;
          status?: string;
          student_user_id?: string;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      attendance_sessions: {
        Row: {
          course_id: string;
          created_at: string;
          ended_at: string | null;
          id: string;
          marked_by: string | null;
          session_date: string;
          started_at: string | null;
          status: string;
          topic: string | null;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          ended_at?: string | null;
          id?: string;
          marked_by?: string | null;
          session_date: string;
          started_at?: string | null;
          status?: string;
          topic?: string | null;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          ended_at?: string | null;
          id?: string;
          marked_by?: string | null;
          session_date?: string;
          started_at?: string | null;
          status?: string;
          topic?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      attendance_records: {
        Row: {
          created_at: string;
          id: string;
          marked_at: string;
          remark: string | null;
          session_id: string;
          status: string;
          student_user_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          marked_at?: string;
          remark?: string | null;
          session_id: string;
          status?: string;
          student_user_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          marked_at?: string;
          remark?: string | null;
          session_id?: string;
          status?: string;
          student_user_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          assessment_date: string | null;
          assessment_type: string;
          course_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          max_score: number;
          published_at: string | null;
          term_id: string | null;
          title: string;
          updated_at: string;
          weight_percent: number | null;
        };
        Insert: {
          assessment_date?: string | null;
          assessment_type: string;
          course_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          max_score: number;
          published_at?: string | null;
          term_id?: string | null;
          title: string;
          updated_at?: string;
          weight_percent?: number | null;
        };
        Update: {
          assessment_date?: string | null;
          assessment_type?: string;
          course_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          max_score?: number;
          published_at?: string | null;
          term_id?: string | null;
          title?: string;
          updated_at?: string;
          weight_percent?: number | null;
        };
        Relationships: [];
      };
      assessment_results: {
        Row: {
          assessment_id: string;
          created_at: string;
          grade: string | null;
          id: string;
          published_at: string | null;
          remarks: string | null;
          score: number;
          student_user_id: string;
          updated_at: string;
        };
        Insert: {
          assessment_id: string;
          created_at?: string;
          grade?: string | null;
          id?: string;
          published_at?: string | null;
          remarks?: string | null;
          score: number;
          student_user_id: string;
          updated_at?: string;
        };
        Update: {
          assessment_id?: string;
          created_at?: string;
          grade?: string | null;
          id?: string;
          published_at?: string | null;
          remarks?: string | null;
          score?: number;
          student_user_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      term_results: {
        Row: {
          aggregate_score: number | null;
          course_id: string;
          created_at: string;
          credits_earned: number | null;
          final_grade: string | null;
          gpa_points: number | null;
          id: string;
          rank_in_course: number | null;
          student_user_id: string;
          term_id: string;
          updated_at: string;
        };
        Insert: {
          aggregate_score?: number | null;
          course_id: string;
          created_at?: string;
          credits_earned?: number | null;
          final_grade?: string | null;
          gpa_points?: number | null;
          id?: string;
          rank_in_course?: number | null;
          student_user_id: string;
          term_id: string;
          updated_at?: string;
        };
        Update: {
          aggregate_score?: number | null;
          course_id?: string;
          created_at?: string;
          credits_earned?: number | null;
          final_grade?: string | null;
          gpa_points?: number | null;
          id?: string;
          rank_in_course?: number | null;
          student_user_id?: string;
          term_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          audience_role: Database["public"]["Enums"]["app_role"] | null;
          audience_type: string;
          body: string;
          course_id: string | null;
          created_at: string;
          department_id: string | null;
          id: string;
          is_published: boolean;
          posted_by: string | null;
          published_at: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          audience_role?: Database["public"]["Enums"]["app_role"] | null;
          audience_type?: string;
          body: string;
          course_id?: string | null;
          created_at?: string;
          department_id?: string | null;
          id?: string;
          is_published?: boolean;
          posted_by?: string | null;
          published_at?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          audience_role?: Database["public"]["Enums"]["app_role"] | null;
          audience_type?: string;
          body?: string;
          course_id?: string | null;
          created_at?: string;
          department_id?: string | null;
          id?: string;
          is_published?: boolean;
          posted_by?: string | null;
          published_at?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_events: {
        Row: {
          body: string;
          created_at: string;
          created_by: string | null;
          id: string;
          source_id: string | null;
          source_table: string | null;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          source_id?: string | null;
          source_table?: string | null;
          title: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          source_id?: string | null;
          source_table?: string | null;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      fee_invoices: {
        Row: {
          amount: number;
          created_at: string;
          due_date: string;
          id: string;
          invoice_number: string;
          label: string;
          receipt_url: string | null;
          status: string;
          student_user_id: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          due_date: string;
          id?: string;
          invoice_number: string;
          label: string;
          receipt_url?: string | null;
          status?: string;
          student_user_id: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          due_date?: string;
          id?: string;
          invoice_number?: string;
          label?: string;
          receipt_url?: string | null;
          status?: string;
          student_user_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_conversations: {
        Row: {
          created_at: string;
          id: string;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          sender: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          sender: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          sender?: string;
        };
        Relationships: [];
      };
      user_notifications: {
        Row: {
          channel: string;
          created_at: string;
          delivered_at: string | null;
          id: string;
          notification_event_id: string;
          read_at: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          channel?: string;
          created_at?: string;
          delivered_at?: string | null;
          id?: string;
          notification_event_id: string;
          read_at?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          channel?: string;
          created_at?: string;
          delivered_at?: string | null;
          id?: string;
          notification_event_id?: string;
          read_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      message_threads: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          subject: string | null;
          thread_type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          subject?: string | null;
          thread_type?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          subject?: string | null;
          thread_type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      message_thread_participants: {
        Row: {
          created_at: string;
          id: string;
          last_read_at: string | null;
          thread_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_read_at?: string | null;
          thread_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_read_at?: string | null;
          thread_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          body: string;
          created_at: string;
          edited_at: string | null;
          id: string;
          sender_user_id: string;
          sent_at: string;
          thread_id: string;
          updated_at: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          edited_at?: string | null;
          id?: string;
          sender_user_id: string;
          sent_at?: string;
          thread_id: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          edited_at?: string | null;
          id?: string;
          sender_user_id?: string;
          sent_at?: string;
          thread_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_adminish: {
        Args: {
          _user_id: string;
        };
        Returns: boolean;
      };
      is_teacher_of_course: {
        Args: {
          _course_id: string;
          _user_id: string;
        };
        Returns: boolean;
      };
      is_enrolled_in_course: {
        Args: {
          _course_id: string;
          _user_id: string;
        };
        Returns: boolean;
      };
      is_parent_of_student: {
        Args: {
          _parent_user_id: string;
          _student_user_id: string;
        };
        Returns: boolean;
      };
      can_access_course: {
        Args: {
          _course_id: string;
          _user_id: string;
        };
        Returns: boolean;
      };
      can_access_student: {
        Args: {
          _student_user_id: string;
          _viewer_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "student" | "teacher" | "parent" | "admin" | "super_admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "parent", "admin", "super_admin"],
    },
  },
} as const;
