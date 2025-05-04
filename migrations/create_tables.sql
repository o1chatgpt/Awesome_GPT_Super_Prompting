-- Create scraping_tasks table
CREATE TABLE IF NOT EXISTS scraping_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  content_type TEXT NOT NULL,
  depth TEXT NOT NULL,
  format TEXT NOT NULL,
  schedule_type TEXT NOT NULL,
  schedule_frequency TEXT,
  schedule_time TEXT,
  schedule_day TEXT,
  status TEXT NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scraping_results table
CREATE TABLE IF NOT EXISTS scraping_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES scraping_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_data TEXT NOT NULL,
  formatted_data TEXT,
  ai_analysis JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_ratings table
CREATE TABLE IF NOT EXISTS task_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES scraping_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  relevance FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scraping_tasks_user_id ON scraping_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_scraping_tasks_status ON scraping_tasks(status);
CREATE INDEX IF NOT EXISTS idx_scraping_results_task_id ON scraping_results(task_id);
CREATE INDEX IF NOT EXISTS idx_task_ratings_task_id ON task_ratings(task_id);
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);

-- Add RLS (Row Level Security) policies
ALTER TABLE scraping_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create policies for scraping_tasks
CREATE POLICY "Users can view their own tasks" 
  ON scraping_tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
  ON scraping_tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON scraping_tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON scraping_tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for scraping_results
CREATE POLICY "Users can view their own results" 
  ON scraping_results FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results" 
  ON scraping_results FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policies for task_ratings
CREATE POLICY "Users can view their own ratings" 
  ON task_ratings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ratings" 
  ON task_ratings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
  ON task_ratings FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for memories
CREATE POLICY "Users can view their own memories" 
  ON memories FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memories" 
  ON memories FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
