<p align="center"> <img src="Frontend/images/logo.jpg" alt="AutoRent Logo" width="200"> </p><h3 align="center">Premium Car Rental Platform</h3><p align="center"> <strong>Live Website:</strong> <a href="https://autorent-k8dr.onrender.com">https://autorent-k8dr.onrender.com</a> </p><p align="center"> A modern, full-stack car rental management system built with Node.js, Express, MongoDB, and vanilla JavaScript </p>

# AutoRent - Full Stack Car Rental System

Live Website: https://autorent-k8dr.onrender.com

AutoRent a car rental management system built for the
INFR3120 Web & Scripting Programming course. This platform allows users
to browse, add, edit, and manage rental vehicles using a responsive
frontend and a fully integrated Node.js/Express/MongoDB backend deployed
on Render.

------------------------------------------------------------------------

## Features
- Authentication System
- User registration and login
- JWT token-based authentication
- Protected routes for car management
- Session persistence

## Car Management
- Browse Cars: View all available vehicles
- Add New Cars: Secure form with validation
- Edit Existing Cars: Update car details
- Delete Cars: Remove vehicles from inventory
- Real-time Status: Available, Rented, Maintenance status tracking
### User Experience
- Responsive design for all devices
- Modern dark theme UI
- Interactive navigation
- Real-time form validation
- Loading states and error handling


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
INFR3120-Fall25-Project-main/
├── Backend/
│   └── server.js          # Main server file
├── Frontend/
│   ├── index.html               # Homepage
│   ├── cars.html                # Cars management page
│   ├── add-car.html             # Add car form
│   ├── edit-car.html            # Edit car form
│   ├── login.html               # User login
│   ├── register.html            # User registration
│   ├── style.css                # Main stylesheet
│   ├── script.js                # Frontend JavaScript
│   ├── auth.js                  # Authentication logic
│   └── images/
│       └── logo.jpg             # Application logo
├── package.json                 # Project dependencies
└── README.md                    # Project documentation

------------------------------------------------------------------------

## Getting Started (Local Development)

### 1. Clone the repository

``` bash
git clone https://github.com/jaspreet.singh36-ops/INFR3120-Fall25-Project-main.git
cd INFR3120-Fall25-Project-main
```

### 2. Install dependencies

``` bash
cd Backend && 
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
## Current Limitations

-   No authentication
-   No booking system
-   No payment processing
-   No image uploads
-   Single-role system (no admin/user roles)

------------------------------------------------------------------------

##  Future Enhancements
-   User profile management
-  Car image upload functionality
-  Advanced search and filtering
-  Booking reservation system
-  Email notifications
-  Payment integration
-  Mobile application
-  Admin dashboard with analytics

------------------------------------------------------------------------

## Authors

-   Jaspreet Singh\
-   Shivang Amin\
-   Thmisha Rasanathan

------------------------------------------------------------------------

## Acknowledgments

-  INFR3120 Course Materials
- Educational Resources
- Ontario Tech University - Course materials and guidance
- MDN Web Docs - Web development references
- W3Schools - Tutorials and examples
-   ## 📚 References

1. **MongoDB Documentation**
   - MongoDB, Inc. (2024). *MongoDB Node.js Driver Documentation*. 
   - Retrieved from: https://www.mongodb.com/docs/drivers/node/current/
   - *Reference for: MongoDB integration, Mongoose ODM, database operations*

2. **Express.js Framework**
   - Express.js. (2024). *Express.js Official Documentation*.
   - Retrieved from: https://expressjs.com/
   - *Reference for: REST API development, middleware configuration, routing*

3. **MDN Web Docs - Fetch API**
   - Mozilla Developer Network. (2024). *Using the Fetch API*.
   - Retrieved from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   - *Reference for: Frontend-backend communication, HTTP requests, error handling*

4. **JWT Authentication**
   - IETF. (2015). *JSON Web Token (JWT) RFC 7519*.
   - Retrieved from: https://tools.ietf.org/html/rfc7519
   - *Reference for: Authentication system, token-based security, user sessions*

5. **Render Deployment Documentation**
   - Render. (2024). *Web Services Documentation*.
   - Retrieved from: https://render.com/docs/web-services
   - *Reference for: Cloud deployment, environment configuration, production hosting*

6. **OpenAI ChatGPT**
   - OpenAI. (2024). *ChatGPT AI Assistant*.
   - Retrieved from: https://chat.openai.com/
   - *Reference for: Code debugging, development assistance, technical guidance*

7. **Web Development Tutorials**
   - CodeWithHarry. (2023). *MongoDB Connection with Node.js*.
   - Retrieved from: https://www.youtube.com/watch?v=dxLNUXMtVhU
   - *Reference for: Database connectivity, backend setup, API development*

8. **Full Stack Development Guide**
   - Thapa Technical. (2023). *MERN Stack Complete Guide*.
   - Retrieved from: https://www.youtube.com/watch?v=BLl32FvcdVM
   - *Reference for: Full stack architecture, project structure, deployment strategies*

------------------------------------------------------------------------

## License

This project was developed for academic purposes as part of the INFR3120 - Web & Scripting Programming course at Ontario Tech University. 
*INFR3120 - Web & Scripting Programming • Ontario Tech University • Fall 2025*

</div>



