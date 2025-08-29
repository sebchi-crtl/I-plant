-- =====================================================
-- SAMPLE DATA FOR TESTING
-- Insert this data after running the main database schema
-- =====================================================

-- Insert token balances for the two users
INSERT INTO token_balances (user_id, balance, total_earned, total_spent) VALUES
('c250eba6-058a-4266-b0d0-5de190217f68', 150, 200, 50),  -- gama@hd.com
('2d2d21dc-b2e8-4f2d-b456-5d4446351a0f', 75, 100, 25);   -- Sebbrand766@gmail.com

-- Insert devices for the two users
INSERT INTO devices (user_id, device_token, device_name, device_model, os_version, app_version, fcm_token, is_active, is_primary) VALUES
('c250eba6-058a-4266-b0d0-5de190217f68', 'dev_token_gama_001', 'iPhone 14 Pro', 'iPhone 14 Pro', 'iOS 17.2', '1.0.0', 'fcm_token_gama_001', true, true),
('2d2d21dc-b2e8-4f2d-b456-5d4446351a0f', 'dev_token_sebbrand_001', 'Samsung Galaxy S23', 'SM-S918B', 'Android 14', '1.0.0', 'fcm_token_sebbrand_001', true, true);

-- Insert some sample transactions to show history
INSERT INTO token_transactions (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description) VALUES
-- For gama@hd.com
('c250eba6-058a-4266-b0d0-5de190217f68', 'purchase', 200, 0, 200, 'PSK_001', 'Token purchase via Paystack'),
('c250eba6-058a-4266-b0d0-5de190217f68', 'diagnostic_charge', -50, 200, 150, 'DIAG_001', 'Image diagnostic charge'),

-- For Sebbrand766@gmail.com
('2d2d21dc-b2e8-4f2d-b456-5d4446351a0f', 'purchase', 100, 0, 100, 'PSK_002', 'Token purchase via Paystack'),
('2d2d21dc-b2e8-4f2d-b456-5d4446351a0f', 'diagnostic_charge', -25, 100, 75, 'DIAG_002', 'Text diagnostic charge');

-- Insert sample diagnostics
INSERT INTO diagnostics (user_id, device_id, diagnostic_type, input_data, image_url, ai_result, confidence_score, token_cost, status, completed_at) VALUES
-- For gama@hd.com
('c250eba6-058a-4266-b0d0-5de190217f68', 
 (SELECT id FROM devices WHERE user_id = 'c250eba6-058a-4266-b0d0-5de190217f68' LIMIT 1),
 'image', 
 NULL, 
 'https://example.com/plant_image_1.jpg',
 '{"disease": "Leaf Blight", "confidence": 0.85, "treatment": "Apply fungicide"}',
 0.85,
 100,
 'completed',
 NOW()),

-- For Sebbrand766@gmail.com
('2d2d21dc-b2e8-4f2d-b456-5d4446351a0f',
 (SELECT id FROM devices WHERE user_id = '2d2d21dc-b2e8-4f2d-b456-5d4446351a0f' LIMIT 1),
 'text',
 'My tomato plant has yellow leaves with brown spots',
 NULL,
 '{"disease": "Early Blight", "confidence": 0.78, "treatment": "Remove affected leaves and apply copper fungicide"}',
 0.78,
 50,
 'completed',
 NOW());
