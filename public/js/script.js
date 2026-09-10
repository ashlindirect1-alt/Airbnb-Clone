const searchForm = document.getElementById("searchForm");

const locationInput = document.getElementById("location");
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");

const searchMessage = document.getElementById("searchMessage");


searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const location = locationInput.value.trim();
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;


    // Check location
    if (location === "") {
        searchMessage.textContent = "Please enter a location.";
        return;
    }


    // Check dates
    if (checkIn === "") {
        searchMessage.textContent = "Please select a check-in date.";
        return;
    }


    if (checkOut === "") {
        searchMessage.textContent = "Please select a check-out date.";
        return;
    }


    // Check date order
    if (checkOut <= checkIn) {
        searchMessage.textContent =
            "Check-out date must be after check-in date.";
        return;
    }


    // Send search information to listing page
    const searchParams = new URLSearchParams({
        location: location,
        checkIn: checkIn,
        checkOut: checkOut
    });

    window.location.href = `listings.html?${searchParams.toString()}`;

});