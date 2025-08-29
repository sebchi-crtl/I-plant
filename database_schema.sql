-- =====================================================
-- MOBILE APP DATABASE SCHEMA
-- Plant Diagnosis & Token Management System
-- Supabase/PostgreSQL Compatible Version
-- =====================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. DEVICES TABLE
-- =====================================================
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    device_token VARCHAR(255) UNIQUE NOT NULL,
    device_name VARCHAR(255),
    device_model VARCHAR(255),
    os_version VARCHAR(100),
    app_version VARCHAR(50),
    fcm_token VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add unique constraint for one active device per user (universal PostgreSQL compatible)
-- We'll use a trigger instead of partial unique constraint for better compatibility
CREATE UNIQUE INDEX unique_active_device_per_user ON devices (user_id) WHERE is_active = true;

-- =====================================================
-- 3. DEVICE ACTIVATION REQUESTS TABLE
-- =====================================================
CREATE TABLE device_activation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    current_device_id UUID,
    new_device_info JSONB, -- Store device details for new device
    request_reason TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    admin_notes TEXT,
    activation_token VARCHAR(255) UNIQUE,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID, -- admin user id
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_device_id) REFERENCES devices(id) ON DELETE SET NULL
);

-- =====================================================
-- 4. TOKEN BALANCES TABLE
-- =====================================================
CREATE TABLE token_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    balance INTEGER DEFAULT 0 NOT NULL,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- =====================================================
-- 5. TOKEN TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('purchase', 'diagnostic_charge', 'refund', 'bonus', 'admin_adjustment')) NOT NULL,
    amount INTEGER NOT NULL, -- positive for credits, negative for debits
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reference_id VARCHAR(255), -- Paystack reference or diagnostic id
    description TEXT,
    metadata JSONB, -- Additional transaction details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 6. PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    paystack_reference VARCHAR(255) UNIQUE NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL, -- Amount in Naira
    tokens_purchased INTEGER NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending', 'successful', 'failed', 'cancelled')) DEFAULT 'pending',
    payment_method VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'NGN',
    metadata JSONB, -- Paystack response data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 7. DIAGNOSTICS TABLE
-- =====================================================
CREATE TABLE diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    device_id UUID NOT NULL,
    diagnostic_type TEXT CHECK (diagnostic_type IN ('image', 'text')) NOT NULL,
    input_data TEXT, -- For text-based diagnostics
    image_url VARCHAR(500), -- For image-based diagnostics
    ai_result JSONB NOT NULL, -- AI diagnosis result
    confidence_score DECIMAL(3,2), -- AI confidence (0.00 to 1.00)
    token_cost INTEGER NOT NULL, -- 100 for image, 50 for text
    processing_time_ms INTEGER, -- Time taken for AI processing
    status TEXT CHECK (status IN ('processing', 'completed', 'failed')) DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

-- =====================================================
-- 8. FEEDBACK TABLE
-- =====================================================
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostic_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    feedback_type TEXT CHECK (feedback_type IN ('accuracy', 'speed', 'usability', 'general')) DEFAULT 'general',
    is_helpful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (diagnostic_id) REFERENCES diagnostics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 9. ADMIN USERS TABLE
-- =====================================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role TEXT CHECK (role IN ('super_admin', 'admin', 'support')) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_active ON users(is_active);

-- Devices indexes
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_token ON devices(device_token);
CREATE INDEX idx_devices_active ON devices(is_active);
CREATE INDEX idx_devices_primary ON devices(is_primary);

-- Device activation requests indexes
CREATE INDEX idx_device_requests_user_id ON device_activation_requests(user_id);
CREATE INDEX idx_device_requests_status ON device_activation_requests(status);
CREATE INDEX idx_device_requests_token ON device_activation_requests(activation_token);

-- Token balances indexes
CREATE INDEX idx_token_balances_user_id ON token_balances(user_id);

-- Token transactions indexes
CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX idx_token_transactions_type ON token_transactions(transaction_type);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at);

-- Payments indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(paystack_reference);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- Diagnostics indexes
CREATE INDEX idx_diagnostics_user_id ON diagnostics(user_id);
CREATE INDEX idx_diagnostics_device_id ON diagnostics(device_id);
CREATE INDEX idx_diagnostics_type ON diagnostics(diagnostic_type);
CREATE INDEX idx_diagnostics_status ON diagnostics(status);
CREATE INDEX idx_diagnostics_created_at ON diagnostics(created_at);

-- Feedback indexes
CREATE INDEX idx_feedback_diagnostic_id ON feedback(diagnostic_id);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update updated_at timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_device_requests_updated_at BEFORE UPDATE ON device_activation_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_token_balances_updated_at BEFORE UPDATE ON token_balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGERS FOR DEVICE MANAGEMENT
-- =====================================================

-- Trigger to ensure only one active device per user
CREATE OR REPLACE FUNCTION ensure_single_active_device()
RETURNS TRIGGER AS $$
BEGIN
    -- If we're setting a device as active, deactivate all other devices for this user
    IF NEW.is_active = true THEN
        UPDATE devices 
        SET is_active = false, 
            updated_at = NOW()
        WHERE user_id = NEW.user_id 
        AND is_active = true 
        AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply device management trigger
CREATE TRIGGER before_device_insert_update
BEFORE INSERT OR UPDATE ON devices
FOR EACH ROW
EXECUTE FUNCTION ensure_single_active_device();

-- =====================================================
-- TRIGGERS FOR USER MANAGEMENT
-- =====================================================

-- Trigger to automatically create token balance when user is created
CREATE OR REPLACE FUNCTION create_user_token_balance()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO token_balances (user_id, balance, total_earned, total_spent)
    VALUES (NEW.id, 0, 0, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply user token balance trigger
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_token_balance();

-- =====================================================
-- INITIAL DATA INSERTS
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('image_diagnostic_cost', '100', 'Token cost for image-based diagnosis', true),
('text_diagnostic_cost', '50', 'Token cost for text-based diagnosis', true),
('token_exchange_rate', '1', 'Naira to token exchange rate (1:1)', true),
('max_devices_per_user', '1', 'Maximum active devices per user', true),
('activation_token_expiry_hours', '24', 'Device activation token expiry in hours', false);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- User summary view
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

-- Diagnostic summary view
CREATE VIEW diagnostic_summary AS
SELECT 
    d.id,
    d.user_id,
    u.first_name,
    u.last_name,
    d.diagnostic_type,
    d.token_cost,
    d.status,
    d.confidence_score,
    d.created_at,
    COUNT(f.id) as feedback_count,
    AVG(f.rating) as average_rating
FROM diagnostics d
JOIN users u ON d.user_id = u.id
LEFT JOIN feedback f ON d.id = f.diagnostic_id
GROUP BY d.id, d.user_id, u.first_name, u.last_name, d.diagnostic_type, d.token_cost, d.status, d.confidence_score, d.created_at;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure to process diagnostic and deduct tokens
CREATE OR REPLACE FUNCTION process_diagnostic(
    p_user_id UUID,
    p_device_id UUID,
    p_diagnostic_type TEXT,
    p_token_cost INTEGER,
    p_input_data TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_diagnostic_id UUID;
    v_current_balance INTEGER;
BEGIN
    -- Check if user has sufficient tokens
    SELECT balance INTO v_current_balance 
    FROM token_balances 
    WHERE user_id = p_user_id;
    
    IF v_current_balance < p_token_cost THEN
        RAISE EXCEPTION 'Insufficient token balance. Required: %, Available: %', p_token_cost, v_current_balance;
    END IF;
    
    -- Create diagnostic record
    INSERT INTO diagnostics (user_id, device_id, diagnostic_type, input_data, image_url, token_cost, ai_result, status)
    VALUES (p_user_id, p_device_id, p_diagnostic_type, p_input_data, p_image_url, p_token_cost, '{}', 'processing')
    RETURNING id INTO v_diagnostic_id;
    
    -- Deduct tokens
    UPDATE token_balances 
    SET balance = balance - p_token_cost,
        total_spent = total_spent + p_token_cost,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record transaction
    INSERT INTO token_transactions (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description)
    VALUES (p_user_id, 'diagnostic_charge', -p_token_cost, v_current_balance, v_current_balance - p_token_cost, v_diagnostic_id, 'Diagnostic charge');
    
    RETURN v_diagnostic_id;
END;
$$ LANGUAGE plpgsql;

-- Procedure to complete diagnostic with AI result
CREATE OR REPLACE FUNCTION complete_diagnostic(
    p_diagnostic_id UUID,
    p_ai_result JSONB,
    p_confidence_score DECIMAL DEFAULT NULL,
    p_processing_time_ms INTEGER DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE diagnostics 
    SET ai_result = p_ai_result,
        confidence_score = p_confidence_score,
        processing_time_ms = p_processing_time_ms,
        status = 'completed',
        completed_at = NOW()
    WHERE id = p_diagnostic_id;
END;
$$ LANGUAGE plpgsql;

-- Procedure to add tokens to user balance
CREATE OR REPLACE FUNCTION add_tokens(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT DEFAULT 'Admin adjustment'
) RETURNS VOID AS $$
DECLARE
    v_current_balance INTEGER;
BEGIN
    -- Get current balance
    SELECT balance INTO v_current_balance 
    FROM token_balances 
    WHERE user_id = p_user_id;
    
    -- Update token balance
    UPDATE token_balances 
    SET balance = balance + p_amount,
        total_earned = total_earned + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record transaction
    INSERT INTO token_transactions (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description)
    VALUES (p_user_id, 'admin_adjustment', p_amount, v_current_balance, v_current_balance + p_amount, NULL, p_reason);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SUPABASE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_activation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admin users can view all users (for dashboard)
CREATE POLICY "Admin users can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Admin users can view all token balances
CREATE POLICY "Admin users can view all token balances" ON token_balances
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Admin users can view all devices
CREATE POLICY "Admin users can view all devices" ON devices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Admin users can view all diagnostics
CREATE POLICY "Admin users can view all diagnostics" ON diagnostics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Admin users can view all feedback
CREATE POLICY "Admin users can view all feedback" ON feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Devices policies
CREATE POLICY "Users can view own devices" ON devices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices" ON devices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices" ON devices
    FOR UPDATE USING (auth.uid() = user_id);

-- Device activation requests policies
CREATE POLICY "Users can view own activation requests" ON device_activation_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create activation requests" ON device_activation_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Token balances policies
CREATE POLICY "Users can view own token balance" ON token_balances
    FOR SELECT USING (auth.uid() = user_id);

-- Token transactions policies
CREATE POLICY "Users can view own transactions" ON token_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Diagnostics policies
CREATE POLICY "Users can view own diagnostics" ON diagnostics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create diagnostics" ON diagnostics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view own feedback" ON feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback" ON feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- System settings policies (public read, admin write)
CREATE POLICY "Anyone can read public settings" ON system_settings
    FOR SELECT USING (is_public = true);

-- Admin users policies (admin only)
CREATE POLICY "Admin users can manage admin_users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'Main user accounts for the mobile app';
COMMENT ON TABLE devices IS 'User device management - one active device per user';
COMMENT ON TABLE device_activation_requests IS 'Device switching requests requiring admin approval';
COMMENT ON TABLE token_balances IS 'Current token balance for each user';
COMMENT ON TABLE token_transactions IS 'Audit trail of all token transactions';
COMMENT ON TABLE payments IS 'Paystack payment records for token purchases';
COMMENT ON TABLE diagnostics IS 'Plant diagnosis records (image or text-based)';
COMMENT ON TABLE feedback IS 'User feedback on diagnostic results';
COMMENT ON TABLE admin_users IS 'Admin users who can manage device activations';
COMMENT ON TABLE system_settings IS 'Configurable system settings';

COMMENT ON COLUMN diagnostics.ai_result IS 'JSON object containing AI diagnosis results';
COMMENT ON COLUMN diagnostics.confidence_score IS 'AI confidence score (0.00 to 1.00)';
COMMENT ON COLUMN device_activation_requests.new_device_info IS 'JSON object with new device details';
COMMENT ON COLUMN token_transactions.metadata IS 'Additional transaction details in JSON format';
COMMENT ON COLUMN payments.metadata IS 'Paystack response data in JSON format';
