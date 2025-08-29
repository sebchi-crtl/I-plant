-- =====================================================
-- MOBILE APP DATABASE SCHEMA
-- Plant Diagnosis & Token Management System
-- MySQL/MariaDB Compatible Version
-- =====================================================

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. DEVICES TABLE
-- =====================================================
CREATE TABLE devices (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    device_token VARCHAR(255) UNIQUE NOT NULL,
    device_name VARCHAR(255),
    device_model VARCHAR(255),
    os_version VARCHAR(100),
    app_version VARCHAR(50),
    fcm_token VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add unique constraint for one active device per user (MySQL compatible)
ALTER TABLE devices ADD CONSTRAINT unique_active_device_per_user 
UNIQUE KEY (user_id, is_active);

-- =====================================================
-- 3. DEVICE ACTIVATION REQUESTS TABLE
-- =====================================================
CREATE TABLE device_activation_requests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    current_device_id CHAR(36),
    new_device_info JSON, -- Store device details for new device
    request_reason TEXT,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    admin_notes TEXT,
    activation_token VARCHAR(255) UNIQUE,
    token_expires_at TIMESTAMP,
    approved_by CHAR(36), -- admin user id
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_device_id) REFERENCES devices(id) ON DELETE SET NULL
);

-- =====================================================
-- 4. TOKEN BALANCES TABLE
-- =====================================================
CREATE TABLE token_balances (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    balance INT DEFAULT 0 NOT NULL,
    total_earned INT DEFAULT 0,
    total_spent INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- =====================================================
-- 5. TOKEN TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE token_transactions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    transaction_type ENUM('purchase', 'diagnostic_charge', 'refund', 'bonus', 'admin_adjustment') NOT NULL,
    amount INT NOT NULL, -- positive for credits, negative for debits
    balance_before INT NOT NULL,
    balance_after INT NOT NULL,
    reference_id VARCHAR(255), -- Paystack reference or diagnostic id
    description TEXT,
    metadata JSON, -- Additional transaction details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 6. PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    paystack_reference VARCHAR(255) UNIQUE NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL, -- Amount in Naira
    tokens_purchased INT NOT NULL,
    payment_status ENUM('pending', 'successful', 'failed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'NGN',
    metadata JSON, -- Paystack response data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 7. DIAGNOSTICS TABLE
-- =====================================================
CREATE TABLE diagnostics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    device_id CHAR(36) NOT NULL,
    diagnostic_type ENUM('image', 'text') NOT NULL,
    input_data TEXT, -- For text-based diagnostics
    image_url VARCHAR(500), -- For image-based diagnostics
    ai_result JSON NOT NULL, -- AI diagnosis result
    confidence_score DECIMAL(3,2), -- AI confidence (0.00 to 1.00)
    token_cost INT NOT NULL, -- 100 for image, 50 for text
    processing_time_ms INT, -- Time taken for AI processing
    status ENUM('processing', 'completed', 'failed') DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

-- =====================================================
-- 8. FEEDBACK TABLE
-- =====================================================
CREATE TABLE feedback (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    diagnostic_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    feedback_type ENUM('accuracy', 'speed', 'usability', 'general') DEFAULT 'general',
    is_helpful BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (diagnostic_id) REFERENCES diagnostics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 9. ADMIN USERS TABLE
-- =====================================================
CREATE TABLE admin_users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'support') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 10. SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE system_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    tb.balance as token_balance,
    COUNT(d.id) as total_diagnostics,
    COUNT(f.id) as total_feedback,
    MAX(d.created_at) as last_diagnostic_date
FROM users u
LEFT JOIN token_balances tb ON u.id = tb.user_id
LEFT JOIN diagnostics d ON u.id = d.user_id
LEFT JOIN feedback f ON u.id = f.user_id
GROUP BY u.id, u.email, u.first_name, u.last_name, u.is_active, tb.balance;

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
DELIMITER //
CREATE PROCEDURE process_diagnostic(
    IN p_user_id CHAR(36),
    IN p_device_id CHAR(36),
    IN p_diagnostic_type VARCHAR(10),
    IN p_token_cost INT,
    IN p_input_data TEXT,
    IN p_image_url TEXT,
    OUT p_diagnostic_id CHAR(36)
)
BEGIN
    DECLARE v_current_balance INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Check if user has sufficient tokens
    SELECT balance INTO v_current_balance 
    FROM token_balances 
    WHERE user_id = p_user_id;
    
    IF v_current_balance < p_token_cost THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = CONCAT('Insufficient token balance. Required: ', p_token_cost, ', Available: ', v_current_balance);
    END IF;
    
    -- Create diagnostic record
    INSERT INTO diagnostics (user_id, device_id, diagnostic_type, input_data, image_url, token_cost, ai_result, status)
    VALUES (p_user_id, p_device_id, p_diagnostic_type, p_input_data, p_image_url, p_token_cost, '{}', 'processing');
    
    SET p_diagnostic_id = LAST_INSERT_ID();
    
    -- Deduct tokens
    UPDATE token_balances 
    SET balance = balance - p_token_cost,
        total_spent = total_spent + p_token_cost,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
    
    -- Record transaction
    INSERT INTO token_transactions (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description)
    VALUES (p_user_id, 'diagnostic_charge', -p_token_cost, v_current_balance, v_current_balance - p_token_cost, p_diagnostic_id, 'Diagnostic charge');
    
    COMMIT;
END //
DELIMITER ;

-- Procedure to complete diagnostic with AI result
DELIMITER //
CREATE PROCEDURE complete_diagnostic(
    IN p_diagnostic_id CHAR(36),
    IN p_ai_result JSON,
    IN p_confidence_score DECIMAL(3,2),
    IN p_processing_time_ms INT
)
BEGIN
    UPDATE diagnostics 
    SET ai_result = p_ai_result,
        confidence_score = p_confidence_score,
        processing_time_ms = p_processing_time_ms,
        status = 'completed',
        completed_at = CURRENT_TIMESTAMP
    WHERE id = p_diagnostic_id;
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS FOR DEVICE MANAGEMENT
-- =====================================================

-- Trigger to ensure only one active device per user
DELIMITER //
CREATE TRIGGER before_device_insert
BEFORE INSERT ON devices
FOR EACH ROW
BEGIN
    IF NEW.is_active = true THEN
        UPDATE devices 
        SET is_active = false, 
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = NEW.user_id AND is_active = true;
    END IF;
END //
DELIMITER ;

-- Trigger to ensure only one active device per user on update
DELIMITER //
CREATE TRIGGER before_device_update
BEFORE UPDATE ON devices
FOR EACH ROW
BEGIN
    IF NEW.is_active = true AND OLD.is_active = false THEN
        UPDATE devices 
        SET is_active = false, 
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = NEW.user_id AND is_active = true AND id != NEW.id;
    END IF;
END //
DELIMITER ;

-- =====================================================
-- COMMENTS
-- =====================================================

-- Table comments (MySQL doesn't support COMMENT ON TABLE, but we can document here)
/*
users - Main user accounts for the mobile app
devices - User device management - one active device per user
device_activation_requests - Device switching requests requiring admin approval
token_balances - Current token balance for each user
token_transactions - Audit trail of all token transactions
payments - Paystack payment records for token purchases
diagnostics - Plant diagnosis records (image or text-based)
feedback - User feedback on diagnostic results
admin_users - Admin users who can manage device activations
system_settings - Configurable system settings
*/

COMMENT ON COLUMN diagnostics.ai_result IS 'JSON object containing AI diagnosis results';
COMMENT ON COLUMN diagnostics.confidence_score IS 'AI confidence score (0.00 to 1.00)';
COMMENT ON COLUMN device_activation_requests.new_device_info IS 'JSON object with new device details';
COMMENT ON COLUMN token_transactions.metadata IS 'Additional transaction details in JSON format';
COMMENT ON COLUMN payments.metadata IS 'Paystack response data in JSON format';
