const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

const PORT = 3000;


// ========================================
// Create Database
// ========================================

const db = new sqlite3.Database("./airbnb.db", (err) => {

    if (err) {
        console.error("Database error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }

});


// ========================================
// Create Properties Table
// ========================================

db.run(`
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        price REAL NOT NULL,
        type TEXT NOT NULL,
        rating REAL NOT NULL,
        reviews INTEGER NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        amenities TEXT NOT NULL
    )
`, (err) => {

    if (err) {
        console.error("Properties table error:", err.message);
        return;
    }

    console.log("Properties table ready.");


    // ========================================
    // Add Default Properties
    // ========================================

    db.get(
        "SELECT COUNT(*) AS count FROM properties",
        (err, row) => {

            if (err) {
                console.error(
                    "Property check error:",
                    err.message
                );
                return;
            }

            if (row.count === 0) {

                const properties = [

                    [
                        "Beautiful Apartment",
                        "Lahore",
                        80,
                        "Apartment",
                        4.8,
                        120,
                        "A comfortable modern apartment located near the city center.",
                        "images/Property1.jpg",
                        "WiFi,Parking"
                    ],

                    [
                        "Luxury Villa",
                        "Islamabad",
                        120,
                        "Villa",
                        4.9,
                        95,
                        "Enjoy a peaceful stay in this spacious luxury villa.",
                        "images/Property2.jpg",
                        "WiFi,Pool,Parking"
                    ],

                    [
                        "Modern House",
                        "Murree",
                        100,
                        "House",
                        4.7,
                        78,
                        "A beautiful modern house with comfortable rooms and great views.",
                        "images/Property3.jpg",
                        "WiFi,Parking"
                    ]

                ];


                const sql = `
                    INSERT INTO properties
                    (
                        name,
                        location,
                        price,
                        type,
                        rating,
                        reviews,
                        description,
                        image,
                        amenities
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;


                properties.forEach((property) => {

                    db.run(
                        sql,
                        property,
                        (err) => {

                            if (err) {
                                console.error(
                                    "Property insert error:",
                                    err.message
                                );
                            }

                        }
                    );

                });


                console.log("Default properties added.");

            } else {

                console.log("Properties already exist.");

            }

        }
    );

});


// ========================================
// Create Bookings Table
// ========================================

db.run(`
    CREATE TABLE IF NOT EXISTS bookings (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        email TEXT NOT NULL,

        checkIn TEXT NOT NULL,

        checkOut TEXT NOT NULL,

        property TEXT NOT NULL

    )
`, (err) => {

    if (err) {

        console.error(
            "Table error:",
            err.message
        );

    } else {

        console.log(
            "Bookings table ready."
        );

    }

});


// ========================================
// Serve Frontend Files
// ========================================

app.use(express.static("public"));

app.use(express.json());


// ========================================
// Get All Properties
// ========================================

app.get("/api/properties", (req, res) => {

    db.all(
        "SELECT * FROM properties",
        (err, rows) => {

            if (err) {

                console.error(
                    "Properties error:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to load properties."
                });

            }

            res.json(rows);

        }
    );

});


// ========================================
// Save Booking
// ========================================

app.post("/api/bookings", (req, res) => {

    const {
        name,
        email,
        checkIn,
        checkOut,
        property,
        totalPrice
    } = req.body;


    // Check required fields
    if (
        !name ||
        !email ||
        !checkIn ||
        !checkOut ||
        !property
    ) {

        return res.status(400).json({
            message: "All fields are required."
        });

    }


    // Check date order
    if (checkOut <= checkIn) {

        return res.status(400).json({
            message:
                "Check-out date must be after check-in date."
        });

    }


    // Check total price
    if (!totalPrice || totalPrice <= 0) {

        return res.status(400).json({
            message: "Invalid total price."
        });

    }


    const sql = `
        INSERT INTO bookings
        (
            name,
            email,
            checkIn,
            checkOut,
            property,
            totalPrice,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;


    db.run(
        sql,
        [
            name,
            email,
            checkIn,
            checkOut,
            property,
            totalPrice,
            "Confirmed"
        ],
        function (err) {

            if (err) {

                console.error(
                    "Booking error:",
                    err.message
                );

                return res.status(500).json({
                    message:
                        "Failed to save booking."
                });

            }


            res.json({

                message:
                    "Booking saved successfully!",

                bookingId:
                    this.lastID

            });

        }
    );

});


// ========================================
// Get All Bookings
// ========================================

app.get("/api/bookings", (req, res) => {

    db.all(
        "SELECT * FROM bookings ORDER BY id DESC",
        (err, rows) => {

            if (err) {

                console.error(
                    err.message
                );

                return res.status(500).json({

                    message:
                        "Failed to load bookings."

                });

            }


            res.json(rows);

        }
    );

});


// ========================================
// Delete Booking
// ========================================

app.delete("/api/bookings/:id", (req, res) => {

    const id = req.params.id;


    db.run(
        "DELETE FROM bookings WHERE id = ?",
        [id],
        function (err) {

            if (err) {

                console.error(
                    "Delete error:",
                    err.message
                );

                return res.status(500).json({

                    message:
                        "Failed to delete booking."

                });

            }


            if (this.changes === 0) {

                return res.status(404).json({

                    message:
                        "Booking not found."

                });

            }


            res.json({

                message:
                    "Booking deleted successfully."

            });

        }
    );

});


// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});