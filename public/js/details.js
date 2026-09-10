const params = new URLSearchParams(window.location.search);

const property = params.get("property");


// Load Property Details From Database

async function loadPropertyDetails() {

    try {

        const response = await fetch("/api/properties");

        if (!response.ok) {
            throw new Error("Failed to load properties");
        }

        const properties = await response.json();


        // Find selected property

        const selectedProperty = properties.find(
            function (item) {
                return item.type.toLowerCase() ===
                    property.toLowerCase();
            }
        );


        // If property does not exist

        if (!selectedProperty) {

            document.getElementById("propertyName").textContent =
                "Property not found";

            return;
        }


        // Display Property Details

        document.getElementById("propertyName").textContent =
            selectedProperty.name;


        document.getElementById("propertyLocation").textContent =
            `${selectedProperty.location}, Pakistan`;


        document.getElementById("propertyRating").textContent =
            `★ ${selectedProperty.rating}`;


        document.getElementById("propertyPrice").textContent =
            `$${selectedProperty.price} night`;


        document.getElementById("propertyDescription").textContent =
            selectedProperty.description;


        document.getElementById("propertyImage").src =
            selectedProperty.image;


        document.getElementById("propertyImage").alt =
            selectedProperty.name;

    }

    catch (error) {

        console.error(
            "Error loading property details:",
            error
        );

        document.getElementById("propertyName").textContent =
            "Unable to load property details.";

    }

}


// Reserve Property

function reserveProperty() {

    window.location.href =
        `booking.html?property=${encodeURIComponent(property)}`;

}


// Start

loadPropertyDetails();