# Worker Meal Order App Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Features](#features)
5. [Components](#components)
6. [Security](#security)
7. [Real-time Updates](#real-time-updates)

## Overview

The Worker Meal Order App is a Progressive Web App (PWA) designed for a 100-person workers camp, enabling efficient meal ordering and management. The system streamlines the meal preparation process by allowing workers to pre-order meals and kitchen staff to manage orders in real-time.

## Architecture

### Technology Stack
- **Frontend**: React.js (PWA)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time Updates**: Supabase Realtime
- **State Management**: React Hooks + Context
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Database Schema

### Tables

#### 1. meals
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `image_url` (text)
- `price` (numeric)
- `available` (boolean)
- `created_at` (timestamptz)

#### 2. orders
- `id` (uuid, primary key)
- `user_name` (text)
- `room_number` (text)
- `pickup_time` (timestamptz)
- `status` (enum: pending, preparing, ready, picked_up)
- `special_instructions` (text, nullable)
- `created_at` (timestamptz)

#### 3. order_items
- `id` (uuid, primary key)
- `order_id` (uuid, foreign key)
- `meal_id` (uuid, foreign key)
- `quantity` (integer)
- `created_at` (timestamptz)

## Features

### 1. User Order Page (/src/pages/UserOrderPage.tsx)

#### Key Features:
- Display available meals
- Real-time menu updates
- Meal filtering and sorting
- Order placement with special instructions
- Mobile-responsive design

#### Implementation Details:
```typescript
// Example of meal fetching
const fetchMeals = async () => {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('available', true);
};
```

### 2. Kitchen Dashboard (/src/pages/KitchenDashboard.tsx)

#### Key Features:
- Real-time order monitoring
- Order status management
- Visual status indicators
- Order details display
- Action buttons for status updates

#### Implementation Details:
```typescript
// Real-time subscription setup
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, 
    () => {
      fetchOrders();
    })
  .subscribe();
```

#### Status Flow:
1. Pending (Yellow) → Initial state
2. Preparing (Blue) → Kitchen processing
3. Ready (Green) → Ready for pickup
4. Picked Up (Gray) → Order completed

### 3. Admin Panel (/src/pages/AdminPanel.tsx)

#### Key Features:
- Menu management
- Order analytics
- User behavior tracking
- System configuration

## Components

### 1. Layout Component
- Consistent header across pages
- Navigation menu
- Responsive design
- Icon integration

### 2. Order Card Component
- Display order details
- Status indicators
- Action buttons
- Special instructions handling

## Security

### Row Level Security (RLS)
- Enabled on all tables
- Public read access for meals
- Authenticated access for orders
- Secure order management

### Data Validation
- Input sanitization
- Type checking with TypeScript
- Error handling with try-catch blocks

## Real-time Updates

### Supabase Realtime
- WebSocket connections for live updates
- Automatic reconnection handling
- Event-based updates
- Optimistic UI updates

### Implementation:
```typescript
// Example of real-time subscription
useEffect(() => {
  const subscription = supabase
    .channel('table_name')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'table_name' }, 
      handleChange
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## Error Handling

### Toast Notifications
- Success messages
- Error alerts
- Loading states
- User feedback

### Implementation:
```typescript
try {
  // Operation
  toast.success('Operation successful');
} catch (error) {
  toast.error('Operation failed');
}
```

## Best Practices

1. **Component Organization**
   - Separate concerns
   - Reusable components
   - Clear naming conventions

2. **State Management**
   - Local state for UI
   - Supabase for data
   - Real-time updates

3. **Performance**
   - Optimized queries
   - Lazy loading
   - Memoization where needed

4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Color contrast
   - Screen reader support