-- Function to match embeddings
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  user_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.content,
    e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM
    embeddings e
  WHERE
    e.user_id = match_embeddings.user_id
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY
    e.embedding <=> query_embedding
  LIMIT
    match_count;
END;
$$;

-- Function to decrement credits safely
CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID, amount INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  current_credits INT;
BEGIN
  SELECT ai_credits INTO current_credits FROM profiles WHERE id = user_id;
  
  IF current_credits IS NULL THEN
    current_credits := 1000; -- Default value
  END IF;
  
  IF current_credits < amount THEN
    RETURN 0; -- Don't go below zero
  ELSE
    RETURN current_credits - amount;
  END IF;
END;
$$;
