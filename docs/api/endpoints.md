# API Endpoints

This document describes all the REST API endpoints required for the lunch tracking application backend.

## Base URL
```
https://your-project.supabase.co/rest/v1
```

## Authentication
All endpoints require authentication via Supabase Auth. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## People Management

### GET /people
Get all people in the system.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "gender": "male|female", 
    "is_default_payer": "boolean",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

### POST /people
Create a new person.

**Request Body:**
```json
{
  "name": "string",
  "gender": "male|female",
  "is_default_payer": "boolean"
}
```

**Response:** 201 Created with person object

### PATCH /people/:id
Update an existing person.

**Request Body:**
```json
{
  "name": "string (optional)",
  "gender": "male|female (optional)",
  "is_default_payer": "boolean (optional)"
}
```

**Response:** 200 OK with updated person object

### DELETE /people/:id
Delete a person and all associated orders/settlements.

**Response:** 204 No Content

## Order Management

### GET /orders
Get all lunch orders, with optional date filtering.

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD format)
- `person_id` (optional): Filter by person ID

**Response:**
```json
[
  {
    "id": "uuid",
    "person_id": "uuid", 
    "date": "YYYY-MM-DD",
    "price": "number",
    "payer_id": "uuid",
    "note": "string (optional)",
    "is_team_order": "boolean",
    "team_members": ["uuid"] | null,
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

### POST /orders
Create a new lunch order.

**Request Body:**
```json
{
  "person_id": "uuid",
  "date": "YYYY-MM-DD", 
  "price": "number",
  "payer_id": "uuid",
  "note": "string (optional)",
  "is_team_order": "boolean (optional)",
  "team_members": ["uuid"] | null
}
```

**Response:** 201 Created with order object

### DELETE /orders/:id
Delete a lunch order.

**Response:** 204 No Content

## Settlement Management

### GET /settlements
Get all settlements between people.

**Query Parameters:**
- `from_person_id` (optional): Filter by payer
- `to_person_id` (optional): Filter by recipient
- `date` (optional): Filter by date

**Response:**
```json
[
  {
    "id": "uuid",
    "from_person_id": "uuid",
    "to_person_id": "uuid", 
    "amount": "number",
    "date": "YYYY-MM-DD",
    "note": "string (optional)",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

### POST /settlements
Create a new settlement.

**Request Body:**
```json
{
  "from_person_id": "uuid",
  "to_person_id": "uuid",
  "amount": "number", 
  "date": "YYYY-MM-DD",
  "note": "string (optional)"
}
```

**Response:** 201 Created with settlement object

### DELETE /settlements/:id
Delete a settlement.

**Response:** 204 No Content

## Analytics & Reporting

### GET /balances
Calculate current balances for all people.

**Response:**
```json
[
  {
    "person_id": "uuid",
    "amount": "number"
  }
]
```

### GET /orders/stats
Get order statistics.

**Query Parameters:**
- `start_date` (optional): Start date for stats (YYYY-MM-DD)
- `end_date` (optional): End date for stats (YYYY-MM-DD)

**Response:**
```json
{
  "total_orders": "number",
  "total_amount": "number",
  "average_order_value": "number",
  "orders_by_person": [
    {
      "person_id": "uuid",
      "order_count": "number",
      "total_amount": "number"
    }
  ]
}
```

## Data Export/Import

### GET /export
Export all data for backup/migration.

**Response:**
```json
{
  "people": [...],
  "orders": [...], 
  "settlements": [...]
}
```

### POST /import
Import data from backup/migration.

**Request Body:**
```json
{
  "people": [...],
  "orders": [...],
  "settlements": [...],
  "merge": "boolean (optional, default: false)"
}
```

**Response:** 200 OK with import summary

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error description"
}
```