# Restaurant Reservations Application
## Summary

The Restaurant Reservations Application is a comprehensive management system that helps to handle and streamline reservations and seating at a restaurant. It allows users to make reservations, which are then managed and fulfilled by restaurant staff. This includes assigning reservations to specific tables, ensuring efficient utilization of the restaurant's seating capacity. The goal is to optimize the reservation and seating process, improving customer experience and restaurant operations.

Technologies used: React, Node, and Express

## Table of Contents
- [Live Deploy on Render](#live-deploy)
- [Setup](#setup)
- [API Documentation](#api-documentation)
- [Walkthrough](#how-to-use)
- [Tests](#tests)

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
Welcome to the Restaurant Reservations API! This API is designed to help restaurants integrate reservation management functionality into their applications.

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

## How to use

### Sections
- [Creating a New Reservation](#new-reservation)
- [Creating a New Table](#new-table)
- [Dashboard Walkthrough](#dashboard)
- [Assigning Tables](#assigning-tables)
- [Editing or Cancelling](#editing-or-cancelling-reservations)
- [Searching for Reservations](#search-for-reservations)

### New Reservation
1. Click "New Reservation"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/5dcd9362-684d-46b3-b4d4-0136cef89e7c)

2. Fill form

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/997e58b5-af6b-4528-9c82-21cbc58b6519)

3. Click "Submit" and you should see your new reservation

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/0df2c4d3-9bcd-463e-b180-3c44b92534eb)


### New Table
1. Click "New Table"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/516232ae-4ee5-405c-9c11-f9bb3fbf1853)

2. Fill form

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/bc1a35fb-99c1-4f69-b4db-60df22b6d590)

3. Click "Submit"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/9cac14af-7c56-49dc-9c34-7d15846f7cba)


### Dashboard
1. Click "Previous", "Today", "Next" to navigate reservations on each day.

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/08eac546-405d-4cc2-a070-bddd7cb01a37)

2. For mobile users: Scroll right to see more details about each reservation

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/302d209d-2aa6-4d35-98bc-d067c5628f0c)

### Assigning Tables
1. Click "Seat"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/daad6a5f-5da4-4eba-9e79-0c5057e77078)

2. Select an available table

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/be5d38a2-ab59-44bd-85bd-1618831dc86f)

3. Click "Submit"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/184b5da6-159c-4060-a98b-3061c9c4b203)

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/5f223775-8d49-4dc9-a565-efa296096606)

### Editing or Cancelling Reservations
1. Click "Edit"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/ad06d6f6-bf6b-483b-9c5f-81b46cb69c43)


2. Correct the reservation

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/36bb6553-6bcc-4d3d-8856-9f8aebb1d178)


3. Click "Submit"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/b5330900-d020-41d8-b97e-4e592102d555)

4. To cancel, click "Cancel"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/bcfeecb7-e9aa-411f-8145-8fbcfda62fff)

5. Click "OK"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/b11c5eef-43e6-4840-949d-e08eaf573f31)

### Search for Reservations
1. Click "Search"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/8e62793a-1a22-4c56-a845-d3eb92a46ec2)

2. Enter partial or complete mobile number

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/33004ea1-e0d2-4edc-bdf7-544df054f9e5)

3. Click "Find"

![image](https://github.com/stable-release/reservations-capstone/assets/126647604/e7642439-505e-4f22-bcd6-d41e767236c5)

## Tests
E2E tests:
```console
npm run test
```
Check `package.json` in `/front-end` and `/back-end` for more test commands.
