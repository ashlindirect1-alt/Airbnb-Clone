const bookingParams = new URLSearchParams(window.location.search);

const property = bookingParams.get("property");

const propertySummary = document.getElementById("propertySummary");

const properties = {
    apartment: {
        name: "Beautiful Apartment",
        location: "Lahore, Pakistan",
        price: 80
    },

    villa: {
        name: "Luxury Villa",
        location: "Islamabad, Pakistan",
        price: 120
    },

    house: {
        name: "Modern House",
        location: "Murree, Pakistan",
        price: 100
    }
};

if (property && properties[property]) {

    const selectedProperty = properties[property];

    propertySummary.innerHTML = `
        <h2>${selectedProperty.name}</h2>
        <p>${selectedProperty.location}</p>
        <p><strong>$${selectedProperty.price}</strong> night</p>
    `;

}

const bookingForm = document.getElementById("bookingForm");
const bookingConfirmation = document.getElementById("bookingConfirmation");


function calculateBookingTotal() {

    const checkIn = document.getElementById("bookingCheckIn").value;
    const checkOut = document.getElementById("bookingCheckOut").value;

    if (!checkIn || !checkOut) {
    bookingConfirmation.textContent =
        "Please select both dates.";
    return;
}

if (checkOut <= checkIn) {
    bookingConfirmation.textContent =
        "Check-out date must be after check-in date.";
    return;
    }

    if (!checkIn || !checkOut || !property || !properties[property]) {
        return 0;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference = endDate - startDate;

    const nights =
        difference / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
        return 0;
    }

    return nights * properties[property].price;
}


bookingForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const checkIn = document.getElementById("bookingCheckIn").value;
    const checkOut = document.getElementById("bookingCheckOut").value;


    try {

        const response = await fetch("/api/bookings", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                checkIn: checkIn,
                checkOut: checkOut,
                property:property,
                totalPrice: calculateBookingTotal()
            })

        });


        const data = await response.json();


        if (response.ok) {

             const selectedProperty = properties[property];


                const startDate = new Date(checkIn);
                const endDate = new Date(checkOut);

                const nights = Math.ceil(
                (endDate - startDate) / (1000 * 60 * 60 * 24)
                );
            
                const totalPrice = nights * selectedProperty.price;

                bookingConfirmation.innerHTML = `
                       <div class="confirmation-card">

                          <h2>Booking Confirmed 🎉</h2>

                           <p>Your booking has been saved successfully.</p>

                            <p>
                               <strong>Booking ID:</strong>
                               ${data.bookingId}
                            </p>
                            
                            <p>
                               <strong>Property:</strong>
                               ${selectedProperty.name}
                            </p>

                            <p>
                                <strong>Check-in:</strong>
                                ${checkIn}
                            </p>

                            <p>
                               <strong>Check-out:</strong>
                               ${checkOut}
                            </p>

                            <p>
                                <strong>Nights:</strong>
                                ${nights}
                            </p>

                            <p>
                               <strong>Total Price:</strong>
                               $${totalPrice}
                            </p>

                            <a href="index.html">Back to Home</a>

                            <a href="bookings.html">View All Bookings</a>

                         </div>
                     `;
                     
                bookingForm.reset();     
        }

    } catch (error) {

        console.error(error);

       bookingConfirmation.textContent =
           "Unable to connect to the server.";

    }

});

const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const priceSummary = document.getElementById("priceSummary");

function calculateTotal() {

    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;

    if (!checkIn || !checkOut || !property || !properties[property]) {
        priceSummary.textContent = "";
        return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference = endDate - startDate;

    const nights = difference / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
        priceSummary.textContent =
            "Check-out date must be after check-in date.";
        return;
    }

    const pricePerNight = properties[property].price;
    const total = nights * pricePerNight;

    priceSummary.innerHTML = `
        <strong>${nights} nights</strong><br>
        $${pricePerNight} × ${nights} nights =
        <strong>$${total}</strong>
    `;
}

checkInInput.addEventListener("change", calculateTotal);
checkOutInput.addEventListener("change", calculateTotal);