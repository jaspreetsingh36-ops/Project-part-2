<p align="center">
  <img src="images/logo.jpg" alt="AutoRent Logo" width="200">
</p>

# AutoRent - Full Stack Car Rental System

Live Website: https://autorent-k8dr.onrender.com

AutoRent a car rental management system built for the
INFR3120 Web & Scripting Programming course. This platform allows users
to browse, add, edit, and manage rental vehicles using a responsive
frontend and a fully integrated Node.js/Express/MongoDB backend deployed
on Render.

------------------------------------------------------------------------

## Features

### Frontend

-   Homepage with featured cars grid
-   Available Cars table with Edit/Delete actions
-   Add Car form with validation
-   Edit Car page using URL parameter (?id=)
-   Fully responsive layout (CSS Grid)
-   Fetch API communication with backend

### Backend

-   Node.js + Express server
-   MongoDB Atlas database with Mongoose models
-   CRUD REST API for cars:
    -   GET /api/cars
    -   GET /api/cars/available
    -   GET /api/cars/:id
    -   POST /api/cars
    -   PUT /api/cars/:id
    -   DELETE /api/cars/:id
-   CORS enabled
-   Deployed on Render Web Service

------------------------------------------------------------------------

## Technologies Used

### Frontend

-   HTML5\
-   CSS3\
-   JavaScript (ES6+)\
-   Fetch API

### Backend

-   Node.js\
-   Express.js\
-   MongoDB Atlas\
-   Mongoose ORM\
-   Render Cloud Deployment

------------------------------------------------------------------------

## Project Structure

    /
    ├── index.html
    ├── cars.html
    ├── add-car.html
    ├── edit-car.html
    ├── script.js
    ├── style.css
    ├── server.js
    ├── package.json
    ├── images/
    └── README.md

------------------------------------------------------------------------

## Getting Started (Local Development)

### 1. Clone the repository

``` bash
git clone https://github.com/<your-username>/<your-repo>.git
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Create a .env file

    MONGODB_URI=your-mongodb-connection-string

### 4. Start the backend server

``` bash
npm start
```

### 5. Open frontend

Visit:

    http://localhost:5000/index.html

------------------------------------------------------------------------

## Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | API status |
| GET | /api/cars | Get all cars |
| GET | /api/cars/available | Get available cars |
| GET | /api/cars/:id | Get car by ID |
| POST | /api/cars | Create a new car |
| PUT | /api/cars/:id | Update car |
| DELETE | /api/cars/:id | Delete car |

------------------------------------------------------------------------

## Usage

### Add a Car

1.  Navigate to **Add Car**
2.  Fill out the form
3.  Submit -> Saves to MongoDB

### Edit a Car

1.  Click **Edit** on any car
2.  Change fields
3.  Submit -> Updates in database

### Delete a Car

1.  Click **Delete**
2.  Confirm
3.  Car is removed from MongoDB

### View Cars

-   Homepage -> only available cars\
-   Cars page -> full inventory

------------------------------------------------------------------------

## Current Limitations

-   No authentication
-   No booking system
-   No payment processing
-   No image uploads
-   Single-role system (no admin/user roles)

------------------------------------------------------------------------

##  Future Enhancements

-   User accounts + authentication
-   Booking & reservation system
-   Price calculator
-   Car image upload feature
-   Search & filter
-   Email notifications
-   Dashboard with analytics

------------------------------------------------------------------------

## Authors

-   Jaspreet Singh
-   Shivang Amin
-   Thmisha Rasanathan

------------------------------------------------------------------------

## Acknowledgments

-   INFR3120 Course Materials\
-   MongoDB Atlas\
-   Render Cloud Hosting\
-   MDN Web Docs\
-   W3Schools
-   https://www.youtube.com/watch?v=vkCgvEVTIgw&t
-   OpenAI.  ChatGPT https://chat.openai.com/

------------------------------------------------------------------------

## License

Created for academic purposes under\
**INFR3120 - Web & Scripting Programming (OntarioTech University)**.

