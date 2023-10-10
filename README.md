# Restaurant Reservations Application
## Summary

The Restaurant Reservations Application is a comprehensive management system that helps to handle and streamline reservations and seating at a restaurant. It allows users to make reservations, which are then managed and fulfilled by restaurant staff. This includes assigning reservations to specific tables, ensuring efficient utilization of the restaurant's seating capacity. The goal is to optimize the reservation and seating process, improving customer experience and restaurant operations.

Technologies used: React, Node, and Express

## Table of Contents
- [Live Deploy on Render](#live-deploy)
- [Setup](#setup)
- [API Documentation](#api-documentation)

## Live Deploy
- View Front-end here:
  - [https://reservations-frontend.onrender.com](https://reservations-frontend.onrender.com)
- View Back-end here:
  - [https://reservations-backend.onrender.com](https://reservations-backend.onrender.com)

## Setup
### Prerequisites
This project is setup as a monorepo.
<br/> The frontend source is in `/front-end`. The backend source is in `/back-end`.
<br/> Be sure that all relative paths start with the corresponding root.
<br/> The project requires the following:
- Node v16.X LTS (Recommended v16 LTS, some packages may break past v16)

### Front End: Static Site
1. To get started, set your API address in your `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:5001
```
2. Install
```console
npm i -y
```
3. For local development, just run:
```console
npm run start
```
Alternatively, for production:
```console
npm run build
```
Built static site will be in `/build`

### Back End: API
1. To get started, set your raw PostgresQL server url `postgres://` in your `.env` file:
```env
DATABASE_URL=enter-your-production-database-url-here
DATABASE_URL_DEVELOPMENT=enter-your-development-database-url-here
DATABASE_URL_TEST=enter-your-test-database-url-here
DATABASE_URL_PREVIEW=enter-your-preview-database-url-here
LOG_LEVEL=info
```
2. Install
```console
npm i -y
```
3. For local development, just run:
```console
npm run start:dev
```
Alternatively, for production:
```console
NODE_ENV=production node src/server.js
```

## API Documentation
### Overview
Welcome to the Restaurant Reservations API! This API is designed to help restaurants integrate reservation management functionality into their applications

### Sections:
- [Reservation Object](#reservation--object)
- [Table Object](#table--object)
- [API Endpoints](#api-endpoints)
- [Response Codes](#response-codes)

### Fundamental Entities
#### Reservation : Object
- Represents a reservation
  
| Property   | Type   | Example   | Description                        |
|------------|--------|--------|------------------------------------|
| reservation_id | number | 420 | The unique ID of the reservation.  |
| first_name | string | John | The first name of the person reserving.  |
| last_name | string | Smith | The last name of the person reserving.   |
| mobile_number | string | 123-456-7890 | The mobile number of the person reserving. Format: ###-###-####       |
| reservation_time  | string | 20:00:00 | The time of the reservation. Format: HH:MM:SS       |
| reservation_date  | string | 2025-01-30 | The date of the reservation. Format: YYYY-MM-DD |
| people | number | 77 | The number of people in the group of the reservation. |
| status | string | booked | The status of the reservation. Options are: "booked", "seated", "finished", "cancelled" |
| created_at  | string | 2035-01-12 23:00:00.000 -0600 | Auto-generated create date of the reservation. Format: PostgresQL Datetime |
| updated_at  | string | 2035-01-12 23:00:00.000 -0600 | Auto-generated update date of the reservation. Format: PostgresQL Datetime |

#### Table : Object
- Represents a table
  
| Property   | Type   | Example   | Description                        |
|------------|--------|--------|------------------------------------|
| table_id | number | 420 | The unique ID of the table.  |
| table_name | string | Bar #1 | The name of the table  |
| capacity | number | 77 | The maximum capacity of the table. |
| reservation_id | number : null | 12 | The reservation_id for which the table is reserved |
| created_at  | string | 2035-01-12 23:00:00.000 -0600 | Auto-generated create date of the table. Format: PostgresQL Datetime |
| updated_at  | string | 2035-01-12 23:00:00.000 -0600 | Auto-generated update date of the table. Format: PostgresQL Datetime |

### API Endpoints

| Endpoint | HTTP Method | Query Parameters | Data Parameters | Description | Example Request | Example Response |
|--------------|-----------------|----------------|-----------------|---------------------|------------------|------------------|
| /reservations | GET | mobile_number <br /> ex: 123-456 | None | Retrieves a list of reservations by complete or partial mobile_number match | GET /reservations?mobile_number=4445551234 | {"data": Array\<[Reservation](#reservation--object)\>} |
| /reservations | GET | date <br /> ex: 2045-01-31 | None | Retrieves a list of reservations by complete date match where sattus is not "cancelled" or "finished" ordered by reservation_time. | GET /reservations?date=2035-12-31 | {"data": Array\<[Reservation](#reservation--object)\>}
| /reservations | POST | None | [Reservation](#reservation--object) Entity without created_at, updated_at | Creates a new reservation | POST /reservations <br /> body: {"data": [Reservation](#reservation--object)} | {"data": [Reservation](#reservation--object)} |
| /reservations/:reservation_id | GET | None | None | Retrieves a reservation by complete reservation_id match | GET /reservations/99 | {"data":[Reservation](#reservation--object)} |
| /reservations/:reservation_id | PUT | None | [Reservation](#reservation--object) Entity without created_at, updated_at | Overwrites a reservation entry with a new reservation by complete reservation_id match | PUT /reservations/42 <br /> body: {"data": [Reservation](#reservation--object)} | {"data": [Reservation](#reservation--object)} |
| /reservations/:reservation_id/status | PUT | None | [Reservation](#reservation--object).status | Updates the status of a reservation entry | PUT /reservations/44 <br/> body: {"data": {"status": "cancelled"}} | {"data": {"status": "finished"}} |
| /tables | GET | None | None | Retrieves a list of all tables | GET /tables | {"data": Array\<[Table](#table--object)\>|
| /tables | POST | None | [Table](#table--object) Entity without created_at, updated_at | Creates a new table | POST /tables <br /> body: {"data": [Table](#table--object)} | {"data": [Table](#table--object)} |
| /tables/:table_id | GET | None | None | Retrieves a table by complete table_id match | GET /tables/42 | {"data": [Table](#table--object)}
| /tables/:table_id/seat | PUT | None | [Table](#table--object) Entity without created_at, updated_at | Links a table to a reservation | PUT /tables/42/seat <br /> body: {"data": {"reservation_id": 22}} | {"data": [Table](#table--object)} |
| /tables/:table_id/seat | DELETE | None | None | Deletes the reservation_id for a table by complete table_id match | DELETE /tables/42/seat | None |

### Response Codes
| Code | Description |
| ---------- | --------------- |
| 200 | Request executed. |
| 201 | Request executed. |
| 400 | Validation error. Check response.error object. |
| 404 | Invalid URL parameter. Make sure URL parameters follow suggested format. |
