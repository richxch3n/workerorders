export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      meals: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          price: number
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          price: number
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          price?: number
          available?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_name: string
          room_number: string
          pickup_time: string
          status: 'pending' | 'preparing' | 'ready' | 'picked_up'
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_name: string
          room_number: string
          pickup_time: string
          status?: 'pending' | 'preparing' | 'ready' | 'picked_up'
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_name?: string
          room_number?: string
          pickup_time?: string
          status?: 'pending' | 'preparing' | 'ready' | 'picked_up'
          special_instructions?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          meal_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          meal_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          meal_id?: string
          quantity?: number
          created_at?: string
        }
      }
    }
  }
}