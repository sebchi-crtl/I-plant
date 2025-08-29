# Supabase Setup Guide for Plant Diagnosis Mobile App

## 🚀 **Quick Start**

### **1. Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### **2. Run the Database Schema**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire `database_schema.sql` file
4. Click **Run** to execute

## 🔧 **Supabase Configuration**

### **Environment Variables**
Add these to your mobile app's environment:

```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Supabase Client Setup (Ionic/Angular)**
```bash
npm install @supabase/supabase-js
```

```typescript
// supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your_project_url'
const supabaseAnonKey = 'your_anon_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🔐 **Authentication Setup**

### **Enable Auth Providers**
In Supabase Dashboard → Authentication → Settings:

1. **Email Auth**: Enable (default)
2. **Phone Auth**: Enable if needed
3. **Social Providers**: Configure as needed

### **Custom Auth Functions**
The schema includes RLS policies that work with Supabase Auth:

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);
```

## 📱 **Mobile App Integration**

### **1. User Registration**
```typescript
async function registerUser(email: string, password: string, userData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  if (data.user) {
    // Create user record and token balance
    await createUserProfile(data.user.id, userData)
  }
}
```

### **2. Device Management**
```typescript
async function registerDevice(deviceInfo: any) {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('devices')
    .insert({
      user_id: user.id,
      device_token: generateDeviceToken(),
      device_name: deviceInfo.name,
      device_model: deviceInfo.model,
      os_version: deviceInfo.osVersion,
      app_version: deviceInfo.appVersion,
      fcm_token: deviceInfo.fcmToken,
      is_active: true,
      is_primary: true
    })
}
```

### **3. Token Management**
```typescript
async function getTokenBalance() {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('token_balances')
    .select('balance, total_earned, total_spent')
    .eq('user_id', user.id)
    .single()
    
  return data
}
```

### **4. Diagnostic Processing**
```typescript
async function processDiagnostic(type: 'image' | 'text', input: any) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get device info
  const { data: device } = await supabase
    .from('devices')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()
  
  // Call the stored procedure
  const { data, error } = await supabase.rpc('process_diagnostic', {
    p_user_id: user.id,
    p_device_id: device.id,
    p_diagnostic_type: type,
    p_token_cost: type === 'image' ? 100 : 50,
    p_input_data: type === 'text' ? input.text : null,
    p_image_url: type === 'image' ? input.imageUrl : null
  })
  
  return data
}
```

### **5. Payment Integration (Paystack)**
```typescript
async function initiatePayment(amount: number) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Create payment record
  const { data: payment } = await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      paystack_reference: generateReference(),
      amount_paid: amount,
      tokens_purchased: amount, // 1:1 ratio
      payment_status: 'pending'
    })
    .select()
    .single()
  
  // Initialize Paystack payment
  const paystackResponse = await initializePaystackPayment({
    amount: amount * 100, // Convert to kobo
    reference: payment.paystack_reference,
    email: user.email
  })
  
  return paystackResponse
}
```

## 🔒 **Security Features**

### **Row Level Security (RLS)**
All tables have RLS enabled with appropriate policies:

- **Users**: Can only access their own data
- **Devices**: Can only manage their own devices
- **Tokens**: Can only view their own balance and transactions
- **Diagnostics**: Can only access their own diagnostics
- **Payments**: Can only view their own payments

### **Admin Access**
Admin users have special privileges:

```sql
CREATE POLICY "Admin users can manage admin_users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()::text 
            AND role IN ('super_admin', 'admin')
        )
    );
```

## 📊 **Real-time Features**

### **Token Balance Updates**
```typescript
// Subscribe to token balance changes
const subscription = supabase
  .channel('token_balance')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'token_balances' },
    (payload) => {
      console.log('Token balance updated:', payload.new)
      updateUI(payload.new)
    }
  )
  .subscribe()
```

### **Diagnostic Status Updates**
```typescript
// Subscribe to diagnostic status changes
const subscription = supabase
  .channel('diagnostics')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'diagnostics' },
    (payload) => {
      if (payload.new.status === 'completed') {
        showDiagnosticResult(payload.new)
      }
    }
  )
  .subscribe()
```

## 🛠 **Admin Dashboard Integration**

### **Device Activation Requests**
```typescript
async function getPendingDeviceRequests() {
  const { data, error } = await supabase
    .from('device_activation_requests')
    .select(`
      *,
      users (first_name, last_name, email),
      devices (device_name, device_model)
    `)
    .eq('status', 'pending')
    
  return data
}
```

### **System Analytics**
```typescript
async function getSystemAnalytics() {
  // Total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
  
  // Total diagnostics
  const { count: totalDiagnostics } = await supabase
    .from('diagnostics')
    .select('*', { count: 'exact', head: true })
  
  // Revenue
  const { data: revenue } = await supabase
    .from('payments')
    .select('amount_paid')
    .eq('payment_status', 'successful')
    
  const totalRevenue = revenue?.reduce((sum, payment) => sum + payment.amount_paid, 0) || 0
  
  return { totalUsers, totalDiagnostics, totalRevenue }
}
```

## 🔄 **Workflow Examples**

### **Complete User Onboarding**
```typescript
async function completeOnboarding(userData: any) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // 1. Update user profile
  await supabase
    .from('users')
    .update(userData)
    .eq('id', user.id)
  
  // 2. Initialize token balance
  await supabase
    .from('token_balances')
    .insert({
      user_id: user.id,
      balance: 0
    })
  
  // 3. Register device
  await registerDevice(userData.deviceInfo)
  
  // 4. Welcome bonus (optional)
  await supabase.rpc('add_tokens', {
    p_user_id: user.id,
    p_amount: 100,
    p_reason: 'Welcome bonus'
  })
}
```

### **Diagnostic Workflow**
```typescript
async function performDiagnostic(type: 'image' | 'text', input: any) {
  try {
    // 1. Process diagnostic and deduct tokens
    const diagnosticId = await processDiagnostic(type, input)
    
    // 2. Send to AI service
    const aiResult = await callAIService(type, input)
    
    // 3. Update diagnostic with results
    await supabase.rpc('complete_diagnostic', {
      p_diagnostic_id: diagnosticId,
      p_ai_result: aiResult,
      p_confidence_score: aiResult.confidence,
      p_processing_time_ms: aiResult.processingTime
    })
    
    return diagnosticId
  } catch (error) {
    console.error('Diagnostic failed:', error)
    throw error
  }
}
```

## 📈 **Monitoring & Analytics**

### **Database Monitoring**
Use Supabase Dashboard to monitor:
- **Database Performance**: Query execution times
- **Storage Usage**: Database size and growth
- **API Usage**: Request counts and errors
- **Auth Activity**: Login attempts and failures

### **Custom Analytics**
```sql
-- Popular diagnostic types
SELECT diagnostic_type, COUNT(*) as count
FROM diagnostics
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY diagnostic_type
ORDER BY count DESC;

-- User engagement
SELECT 
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_diagnostics
FROM diagnostics
WHERE created_at >= NOW() - INTERVAL '7 days';
```

## 🚨 **Error Handling**

### **Common Issues & Solutions**

1. **RLS Policy Violations**
   ```typescript
   // Ensure user is authenticated
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) throw new Error('User not authenticated')
   ```

2. **Token Insufficient Balance**
   ```typescript
   try {
     await processDiagnostic(type, input)
   } catch (error) {
     if (error.message.includes('Insufficient token balance')) {
       showPaymentModal()
     }
   }
   ```

3. **Device Already Active**
   ```typescript
   // The unique constraint will handle this automatically
   // Just handle the error gracefully
   try {
     await registerDevice(deviceInfo)
   } catch (error) {
     if (error.code === '23505') { // Unique violation
       showError('Device already registered')
     }
   }
   ```

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

This setup provides a complete, secure, and scalable foundation for your plant diagnosis mobile app with Supabase!
