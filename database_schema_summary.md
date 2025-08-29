# Mobile App Database Schema Summary

## 🎯 **System Overview**
This database schema supports a plant diagnosis mobile app with token-based payments, device management, and AI-powered diagnostics.

## 📊 **Core Tables & Relationships**

### **1. User Management**
- **`users`** - Main user accounts
- **`devices`** - Device management (one active device per user)
- **`device_activation_requests`** - Device switching workflow
- **`admin_users`** - Admin panel users

### **2. Token & Payment System**
- **`token_balances`** - Current token balance per user
- **`token_transactions`** - Complete audit trail of all token movements
- **`payments`** - Paystack payment records
- **`system_settings`** - Configurable pricing and settings

### **3. Diagnostics & Feedback**
- **`diagnostics`** - Plant diagnosis records (image/text)
- **`feedback`** - User feedback on diagnostic results

## 🔐 **Key Features Implemented**

### **✅ Device Management**
- **One device per user** - Enforced by unique constraint
- **Device switching workflow**:
  1. User requests new device activation
  2. Admin reviews and approves/rejects
  3. Activation token sent to user
  4. New device activated, old device deactivated

### **✅ Token System**
- **Pricing**: 100 tokens for image diagnosis, 50 for text
- **1:1 Exchange Rate**: ₦100 = 100 tokens
- **Automatic deduction** when diagnostics are processed
- **Complete audit trail** of all transactions
- **Paystack integration** for token purchases

### **✅ Diagnostics**
- **Dual input types**: Image and text-based diagnostics
- **AI result storage** in JSONB format
- **Confidence scoring** (0.00 to 1.00)
- **Processing time tracking**
- **Status tracking** (processing, completed, failed)

### **✅ Feedback System**
- **Rating system** (1-5 stars)
- **Feedback categories** (accuracy, speed, usability, general)
- **Helpful/not helpful** tracking
- **Linked to specific diagnostics**

## 🔗 **Key Relationships**

```
users (1) ←→ (1) token_balances
users (1) ←→ (many) devices
users (1) ←→ (many) diagnostics
users (1) ←→ (many) payments
users (1) ←→ (many) token_transactions

diagnostics (1) ←→ (many) feedback
devices (1) ←→ (many) device_activation_requests
```

## 🚀 **Performance Optimizations**

### **Indexes Created**
- User lookups (email, phone, active status)
- Device management (user_id, device_token, active status)
- Token transactions (user_id, type, date)
- Diagnostics (user_id, device_id, type, status, date)
- Payments (user_id, reference, status)

### **Views for Common Queries**
- **`user_summary`** - User overview with stats
- **`diagnostic_summary`** - Diagnostic overview with feedback

### **Stored Procedures**
- **`process_diagnostic()`** - Handles diagnostic creation and token deduction
- **`complete_diagnostic()`** - Updates diagnostic with AI results

## 💰 **Token Flow**

### **Purchase Flow**
1. User initiates payment via Paystack
2. Payment recorded in `payments` table
3. Tokens added to `token_balances`
4. Transaction recorded in `token_transactions`

### **Usage Flow**
1. User submits diagnostic request
2. `process_diagnostic()` procedure called
3. Tokens deducted from balance
4. Diagnostic record created
5. Transaction recorded

## 🔧 **System Settings**

### **Configurable Parameters**
- `image_diagnostic_cost` - Token cost for image diagnosis
- `text_diagnostic_cost` - Token cost for text diagnosis
- `token_exchange_rate` - Naira to token ratio
- `max_devices_per_user` - Device limit per user
- `activation_token_expiry_hours` - Token expiry time

## 📱 **Mobile App Integration Points**

### **Authentication**
- User login/logout
- Device registration
- Device switching requests

### **Diagnostics**
- Submit image/text for diagnosis
- Retrieve AI results
- Submit feedback

### **Payments**
- Initiate Paystack payment
- Verify payment status
- Update token balance

### **User Management**
- View token balance
- View diagnostic history
- View transaction history

## 🛡️ **Security Features**

### **Data Integrity**
- Foreign key constraints
- Check constraints (positive balance, valid ratings)
- Unique constraints (one active device per user)

### **Audit Trail**
- Complete transaction history
- Timestamp tracking on all records
- User action logging

### **Admin Controls**
- Device activation approval workflow
- System settings management
- User management capabilities

## 📈 **Analytics Capabilities**

### **User Analytics**
- Token usage patterns
- Diagnostic frequency
- Payment history
- Device usage

### **System Analytics**
- Popular diagnostic types
- AI confidence scores
- User feedback trends
- Revenue tracking

## 🔄 **Workflow Examples**

### **New User Registration**
1. Create user record
2. Initialize token balance (0 tokens)
3. Register device
4. Set device as primary

### **Device Switching**
1. User requests new device
2. Admin reviews request
3. Admin approves and generates activation token
4. User activates new device with token
5. Old device deactivated

### **Diagnostic Process**
1. User submits image/text
2. System checks token balance
3. Tokens deducted
4. Diagnostic record created
5. AI processes request
6. Results stored
7. User can submit feedback

This schema provides a robust foundation for your mobile app with all the required features for device management, token-based payments, diagnostics, and feedback systems.
