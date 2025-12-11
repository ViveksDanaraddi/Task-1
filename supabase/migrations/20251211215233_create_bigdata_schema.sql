/*
  # Create Big Data Analytics Schema

  1. New Tables
    - `data_sources`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the data source
      - `type` (text) - Type of data source (database, api, file, stream)
      - `status` (text) - Status (active, inactive, error)
      - `records_count` (bigint) - Total number of records
      - `size_bytes` (bigint) - Size in bytes
      - `last_sync` (timestamptz) - Last synchronization time
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `datasets`
      - `id` (uuid, primary key)
      - `source_id` (uuid, foreign key to data_sources)
      - `name` (text) - Dataset name
      - `description` (text) - Dataset description
      - `category` (text) - Data category
      - `records_count` (bigint) - Number of records
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `analytics_metrics`
      - `id` (uuid, primary key)
      - `metric_name` (text) - Name of the metric
      - `metric_value` (numeric) - Value of the metric
      - `metric_type` (text) - Type (performance, quality, volume)
      - `source_id` (uuid, foreign key to data_sources)
      - `timestamp` (timestamptz) - When the metric was recorded
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (for demo purposes)

  3. Indexes
    - Add indexes on frequently queried columns for performance
*/

CREATE TABLE IF NOT EXISTS data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'database',
  status text NOT NULL DEFAULT 'active',
  records_count bigint DEFAULT 0,
  size_bytes bigint DEFAULT 0,
  last_sync timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES data_sources(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'general',
  records_count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL DEFAULT 0,
  metric_type text NOT NULL DEFAULT 'performance',
  source_id uuid REFERENCES data_sources(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to data_sources"
  ON data_sources FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to data_sources"
  ON data_sources FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to data_sources"
  ON data_sources FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from data_sources"
  ON data_sources FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to datasets"
  ON datasets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to datasets"
  ON datasets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to datasets"
  ON datasets FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from datasets"
  ON datasets FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to analytics_metrics"
  ON analytics_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to analytics_metrics"
  ON analytics_metrics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_data_sources_status ON data_sources(status);
CREATE INDEX IF NOT EXISTS idx_data_sources_type ON data_sources(type);
CREATE INDEX IF NOT EXISTS idx_datasets_source_id ON datasets(source_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_source_id ON analytics_metrics(source_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_timestamp ON analytics_metrics(timestamp DESC);
