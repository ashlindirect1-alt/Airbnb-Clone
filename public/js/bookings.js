const bookingsList = document.getElementById("bookingsList");

async function loadBookings() {
    try {
        const response = await fetch("/api/bookings");
        const bookings = await response.json();
        const propertyNames = {
         apartment: "Beautiful Apartment",
         villa: "Luxury Villa",
         house: "Modern House"
        };

        if (bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="no-bookings">
                    <h2>No bookings found</h2>
                    <p>There are currently no bookings.</p>
                </div>
            `;
            return;
        }

        bookingsList.innerHTML = bookings.map(booking => {

            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);

            const nights = Math.ceil(
                (checkOutDate - checkInDate) /
                (1000 * 60 * 60 * 24)
            );

            return `
                <div class="booking-card">

                    <h2>Booking #${booking.id}</h2>

                    <p>
                        <strong>Name:</strong>
                        ${booking.name}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${booking.email}
                    </p>

                    <p>
                        <strong>Check-in:</strong>
                        ${booking.checkIn}
                    </p>

                    <p>
                        <strong>Check-out:</strong>
                        ${booking.checkOut}
                    </p>

                    <p>
                        <strong>Property:</strong>
                        ${propertyNames[booking.property] || "Not available"}
                    </p>

                    <p>
                        <strong>Total Price:</strong>
                        $${booking.totalPrice || 0}
                    </p>
                    
                    <p>
                      <strong>Status:</strong>
                      ${booking.status || "Confirmed"}
                    </p>
 
                    <p>
                        <strong>Nights:</strong>
                        ${nights}
                    </p>

                    <button
                        class="delete-btn"
                        onclick="deleteBooking(${booking.id})"
                    >
                        Delete Booking
                    </button>

                </div>
            `;

        }).join("");

    } catch (error) {
        console.error(error);

        bookingsList.innerHTML =
            "<p>Unable to load bookings.</p>";
    }
}


async function deleteBooking(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `/api/bookings/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.ok) {
            loadBookings();
        } else {
            alert(data.message);
        }

    } catch (error) {

        console.error(error);

        alert("Unable to delete booking.");
    }
}


loadBookings();