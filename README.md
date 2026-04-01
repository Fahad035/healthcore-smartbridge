# API Documentation

## Authentication
To access the API, you must provide a valid API key with each request. The API key should be included in the request headers as follows:
```
Authorization: Bearer YOUR_API_KEY
```

## Doctor Endpoints

### Get All Doctors
- **Endpoint:** `/api/doctors`
- **Method:** GET
- **Request:** No parameters required.
- **Response:** A JSON array of doctor objects.

### Get Doctor By ID
- **Endpoint:** `/api/doctors/{id}`
- **Method:** GET
- **Parameters:**
  - **id** (integer): The ID of the doctor.
- **Response:** A JSON object with the doctor's details.

## Patient Endpoints

### Get All Patients
- **Endpoint:** `/api/patients`
- **Method:** GET
- **Request:** No parameters required.
- **Response:** A JSON array of patient objects.

### Get Patient By ID
- **Endpoint:** `/api/patients/{id}`
- **Method:** GET
- **Parameters:**
  - **id** (integer): The ID of the patient.
- **Response:** A JSON object with the patient's details.

## Admin Endpoints

### Get All Users
- **Endpoint:** `/api/admin/users`
- **Method:** GET
- **Request:** No parameters required.
- **Response:** A JSON array of user objects.

## Error Responses
Common error responses include:
- **400 Bad Request:** The request was invalid. Check the parameters and try again.
- **401 Unauthorized:** Authentication failed. Ensure your API key is correct.
- **404 Not Found:** The requested resource could not be found.
- **500 Internal Server Error:** An error occurred on the server.

## Rate Limiting
The API enforces rate limiting to ensure fair usage. The following limits apply:
- **Requests per minute:** 100
- **Requests per hour:** 1000

## Endpoint Details
Each endpoint can return successful and error responses, as outlined above. Ensure to handle both response types accordingly in your implementation.