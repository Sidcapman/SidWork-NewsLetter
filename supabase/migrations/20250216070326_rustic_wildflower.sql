/*
  # Initial Schema Setup for Newsletter Application

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)
    - `subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
    - `sent_newsletters`
      - `id` (uuid, primary key)
      - `sent_at` (timestamp)
      - `content` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their articles
    - Add policies for public access to subscribe
*/

-- Articles table
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view articles"
  ON articles
  FOR SELECT
  TO public
  USING (true);

-- Subscribers table
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin can view subscribers"
  ON subscribers
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = current_setting('app.admin_email', true)
  ));

-- Sent newsletters table
CREATE TABLE sent_newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_at timestamptz DEFAULT now(),
  content text NOT NULL
);

ALTER TABLE sent_newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sent newsletters"
  ON sent_newsletters
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage newsletters"
  ON sent_newsletters
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = current_setting('app.admin_email', true)
  ));