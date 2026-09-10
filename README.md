# Airbnb Clone

A functional Airbnb-style web application developed as a CWI Task 37 project.

## Features

- Homepage with destination search
- Check-in and check-out date selection
- Dynamic property listings from SQLite database
- Dynamic property details
- Price filtering
- Property type filtering
- Amenities filtering
- Sort properties by:
  - Price: Low to High
  - Best Rated
- No-results handling
- Property booking system
- Booking confirmation
- Bookings page
- Delete booking functionality
- SQLite database for properties and bookings
- Responsive design for desktop and mobile devices

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- SQLite

## Project Structure

```text
Airbnb-Clone/
│
├── public/
│   ├── index.html
│   ├── listings.html
│   ├── details.html
│   ├── booking.html
│   ├── bookings.html
│   ├── login.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── listings.css
│   │   ├── booking.css
│   │   ├── bookings.css
│   │   └── login.css
│   │
│   ├── js/
│   │   ├── script.js
│   │   ├── listings.js
│   │   ├── details.js
│   │   ├── booking.js
│   │   ├── bookings.js
│   │   ├── login.js
│   │   └── auth.js
│   │
│   └── images/
│
├── server.js
├── airbnb.db
├── package.json
├── package-lock.json
└── README.md