# API Documentation

## Overview
This document provides comprehensive details about the API endpoints available for the HealthCore SmartBridge application. Each section outlines the necessary endpoints for different user roles—admin, doctor, and patient—and includes examples of requests and responses.

## Authentication
All API requests require authentication. You must include a bearer token in the header of each request to access protected resources.

### Example:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Doctor Endpoints

### 1. Get Doctor Information
- **Endpoint:** `/api/doctors/{id}`  
- **Method:** GET  
- **Description:** Fetch the details of a specific doctor.

#### Request:
```
GET /api/doctors/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response:
```json
{
    "id": 1,
    "name": "Dr. John Doe",
    "specialty": "Cardiology",
    "contact": "123-456-7890"
}
```

### 2. Update Doctor Details
- **Endpoint:** `/api/doctors/{id}`  
- **Method:** PUT  
- **Description:** Update the information of a doctor.

#### Request:
```
PUT /api/doctors/1
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
    "name": "Dr. John Smith",
    "specialty": "Pediatrics"
}
```

#### Response:
```json
{
    "message": "Doctor updated successfully."
}
```

## Patient Endpoints

### 1. Get Patient Information
- **Endpoint:** `/api/patients/{id}`  
- **Method:** GET  
- **Description:** Retrieve patient information by ID.

### Example:
```
GET /api/patients/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response:
```json
{
    "id": 1,
    "name": "Jane Doe",
    "dob": "1990-01-01",
    "contact": "987-654-3210"
}
```

## Admin Endpoints

### 1. Create New Doctor
- **Endpoint:** `/api/admin/doctors`  
- **Method:** POST  
- **Description:** Add a new doctor to the system.

#### Request:
```
POST /api/admin/doctors
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
    "name": "Dr. Emily Brown",
    "specialty": "Dermatology",
    "contact": "555-123-4567"
}
```

#### Response:
```json
{
    "message": "Doctor created successfully."
}
```

## Summary
This document provides the necessary details for utilizing the HealthCore SmartBridge API. Ensure you replace placeholder tokens and IDs with actual values for successful requests.