/*
  # Initial Schema for Worker Meal Order App

  1. New Tables
    - `meals`: Stores available meal options
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `price` (numeric)
      - `available` (boolean)
      - `created_at` (timestamp)
    
    - `orders`: Stores user orders
      - `id` (uuid, primary key)
      - `user_name` (text)
      - `room_number` (text)
      - `pickup_time` (timestamp)
      - `status` (enum)
      - `special_instructions` (text, nullable)
      - `created_at` (timestamp)
    
    - `order_items`: Links orders to meals
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `meal_id` (uuid, foreign key)
      - `quantity` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (no auth required as per requirements)
*/

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'picked_up');

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  room_number text NOT NULL,
  pickup_time timestamptz NOT NULL,
  status order_status DEFAULT 'pending',
  special_instructions text,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  meal_id uuid REFERENCES meals(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to meals" ON meals
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read/write access to orders" ON orders
  FOR ALL TO public USING (true);

CREATE POLICY "Allow public read/write access to order_items" ON order_items
  FOR ALL TO public USING (true);