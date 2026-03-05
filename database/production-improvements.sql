-- Production-Grade Database Improvements
-- Run this after your basic schema is created

-- ============================================
-- 1. PERFORMANCE OPTIMIZATIONS (Indexes)
-- ============================================

-- Index on issues for faster queries
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_created_by ON issues(created_by);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues(priority);
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues(latitude, longitude);

-- Index on comments for faster lookups
CREATE INDEX IF NOT EXISTS idx_comments_issue_id ON comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Index on likes for faster queries
CREATE INDEX IF NOT EXISTS idx_likes_issue_id ON likes(issue_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Index on notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Index on users for authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_issues_status_created ON issues(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_category_status ON issues(category, status);

-- ============================================
-- 2. DATA INTEGRITY (Constraints)
-- ============================================

-- Add check constraints for valid values
ALTER TABLE issues 
  ADD CONSTRAINT check_status 
  CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed'));

ALTER TABLE issues 
  ADD CONSTRAINT check_priority 
  CHECK (priority IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE issues 
  ADD CONSTRAINT check_category 
  CHECK (category IN ('pothole', 'garbage', 'water_leakage', 'street_light', 'drainage', 'other'));

ALTER TABLE users 
  ADD CONSTRAINT check_role 
  CHECK (role IN ('citizen', 'official', 'admin'));

-- Add check for valid coordinates
ALTER TABLE issues 
  ADD CONSTRAINT check_latitude 
  CHECK (latitude >= -90 AND latitude <= 90);

ALTER TABLE issues 
  ADD CONSTRAINT check_longitude 
  CHECK (longitude >= -180 AND longitude <= 180);

-- ============================================
-- 3. SECURITY ENHANCEMENTS
-- ============================================

-- Create read-only role for analytics
CREATE ROLE readonly_user WITH LOGIN PASSWORD 'readonly_password_change_me';
GRANT CONNECT ON DATABASE defaultdb TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Revoke dangerous permissions
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- ============================================
-- 4. AUDIT TRAIL (Track changes)
-- ============================================

-- Add audit columns to issues
ALTER TABLE issues ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id);
ALTER TABLE issues ADD COLUMN IF NOT EXISTS resolved_by INTEGER REFERENCES users(id);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_changed_at ON audit_log(changed_at DESC);

-- ============================================
-- 5. AUTOMATIC TIMESTAMPS (Triggers)
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for issues table
DROP TRIGGER IF EXISTS update_issues_updated_at ON issues;
CREATE TRIGGER update_issues_updated_at
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. DATA VALIDATION (Functions)
-- ============================================

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Add email validation constraint
ALTER TABLE users 
  ADD CONSTRAINT check_email_format 
  CHECK (is_valid_email(email));

-- ============================================
-- 7. STATISTICS & VIEWS (Performance)
-- ============================================

-- View for issue statistics
CREATE OR REPLACE VIEW issue_stats AS
SELECT 
    status,
    category,
    priority,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_resolution_hours
FROM issues
GROUP BY status, category, priority;

-- View for user activity
CREATE OR REPLACE VIEW user_activity AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT i.id) as issues_reported,
    COUNT(DISTINCT c.id) as comments_made,
    COUNT(DISTINCT l.id) as likes_given
FROM users u
LEFT JOIN issues i ON u.id = i.created_by
LEFT JOIN comments c ON u.id = c.user_id
LEFT JOIN likes l ON u.id = l.user_id
GROUP BY u.id, u.name, u.email;

-- ============================================
-- 8. CLEANUP & MAINTENANCE
-- ============================================

-- Function to delete old notifications (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days'
    AND is_read = TRUE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. BACKUP & RECOVERY
-- ============================================

-- Create backup table structure
CREATE TABLE IF NOT EXISTS issues_backup (LIKE issues INCLUDING ALL);
CREATE TABLE IF NOT EXISTS users_backup (LIKE users INCLUDING ALL);

-- ============================================
-- 10. ANALYZE TABLES (Update statistics)
-- ============================================

ANALYZE users;
ANALYZE issues;
ANALYZE comments;
ANALYZE likes;
ANALYZE notifications;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check all constraints
SELECT
    conname as constraint_name,
    conrelid::regclass as table_name,
    contype as constraint_type
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, contype;

-- Show table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
