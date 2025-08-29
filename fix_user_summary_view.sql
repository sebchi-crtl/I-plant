-- =====================================================
-- FIX USER_SUMMARY VIEW
-- Drop and recreate the view with correct columns
-- =====================================================

-- Drop the existing view if it exists
DROP VIEW IF EXISTS user_summary;

-- Recreate the user_summary view with all required columns
CREATE VIEW user_summary AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active,
    u.created_at,
    COALESCE(tb.balance, 0) as token_balance,
    COUNT(DISTINCT d.id) as total_diagnostics,
    COUNT(DISTINCT f.id) as total_feedback,
    MAX(d.created_at) as last_diagnostic_date
FROM users u
LEFT JOIN token_balances tb ON u.id = tb.user_id
LEFT JOIN diagnostics d ON u.id = d.user_id
LEFT JOIN feedback f ON u.id = f.user_id
GROUP BY u.id, u.email, u.first_name, u.last_name, u.is_active, u.created_at, tb.balance;

-- Add comment
COMMENT ON VIEW user_summary IS 'Summary view of users with their token balances, diagnostics, and feedback counts';

-- Enable RLS on the view
ALTER VIEW user_summary ENABLE ROW LEVEL SECURITY;

-- Admin users can view all users from the summary view
CREATE POLICY "Admin users can view user_summary" ON user_summary
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );
