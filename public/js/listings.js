const params = new URLSearchParams(window.location.search);

const searchedLocation = params.get("location");
const checkIn = params.get("checkIn");
const checkOut = params.get("checkOut");

const searchDetails = document.getElementById("searchDetails");
const noResults = document.getElementById("noResults");

const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

const typeFilters = document.querySelectorAll(".type-filter");
const amenityFilters = document.querySelectorAll(".amenity-filter");

const applyFiltersButton = document.getElementById("applyFilters");
const clearFiltersButton = document.getElementById("clearFilters");

const sortSelect = document.getElementById("sortSelect");
const propertyGrid = document.getElementById("propertyGrid");


// ========================================
// Show Search Information
// ========================================

if (searchedLocation && checkIn && checkOut) {

    searchDetails.textContent =
        `Properties in ${searchedLocation} | Check-in: ${checkIn} | Check-out: ${checkOut}`;

} else {

    searchDetails.textContent =
        "Showing available properties";

}


// ========================================
// Load Properties From Database
// ========================================

async function loadProperties() {

    try {

        const response = await fetch("/api/properties");

        if (!response.ok) {
            throw new Error("Failed to load properties");
        }

        const properties = await response.json();

        propertyGrid.innerHTML = "";


        properties.forEach(function(property) {

            const card = document.createElement("div");

            card.className = "listing-card";

            card.dataset.location = property.location;
            card.dataset.price = property.price;
            card.dataset.type = property.type;
            card.dataset.rating = property.rating;
            card.dataset.amenities = property.amenities;


            card.innerHTML = `
                <img src="${property.image}" alt="${property.name}">

                <div class="listing-info">

                    <div class="location-rating">

                        <span>
                            ${property.location}, Pakistan
                        </span>

                        <span>
                            ★ ${property.rating}
                        </span>

                    </div>

                    <h2>${property.name}</h2>

                    <p class="description">
                        ${property.description}
                    </p>

                    <p class="reviews">
                        ${property.reviews} reviews
                    </p>

                    <p class="price">
                        <strong>$${property.price}</strong> night
                    </p>

                    <button
                        class="details-btn"
                        onclick="viewDetails('${property.type.toLowerCase()}')"
                    >
                        View Details
                    </button>

                </div>
            `;


            propertyGrid.appendChild(card);

        });


        // Apply filters after loading properties
        applyFilters();

    } catch (error) {

        console.error(
            "Error loading properties:",
            error
        );

        noResults.style.display = "block";

        noResults.textContent =
            "Unable to load properties.";

    }

}


// ========================================
// Filter Properties
// ========================================

function applyFilters() {

    const propertyCards =
        document.querySelectorAll(".listing-card");


    const minPrice =
        Number(minPriceInput.value) || 0;

    const maxPrice =
        Number(maxPriceInput.value) || Infinity;


    const selectedTypes =
        Array.from(typeFilters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);


    const selectedAmenities =
        Array.from(amenityFilters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);


    let visibleCount = 0;


    propertyCards.forEach(function(card) {

        const propertyLocation =
            card.dataset.location;

        const propertyPrice =
            Number(card.dataset.price);

        const propertyType =
            card.dataset.type;

        const propertyAmenities =
            card.dataset.amenities.split(",");


        // Location

        const locationMatch =
            !searchedLocation ||
            propertyLocation.toLowerCase() ===
            searchedLocation.toLowerCase();


        // Price

        const priceMatch =
            propertyPrice >= minPrice &&
            propertyPrice <= maxPrice;


        // Property Type

        const typeMatch =
            selectedTypes.length === 0 ||
            selectedTypes.includes(propertyType);


        // Amenities

        const amenitiesMatch =
            selectedAmenities.length === 0 ||
            selectedAmenities.every(amenity =>
                propertyAmenities.includes(amenity)
            );


        // Final result

        if (
            locationMatch &&
            priceMatch &&
            typeMatch &&
            amenitiesMatch
        ) {

            card.style.display = "block";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    // ========================================
    // No Results
    // ========================================

    if (visibleCount === 0) {

        noResults.style.display = "block";

        noResults.textContent =
            searchedLocation
                ? `No properties found for ${searchedLocation}.`
                : "No properties found.";

    } else {

        noResults.style.display = "none";

    }

}


// ========================================
// Apply Filters Button
// ========================================

applyFiltersButton.addEventListener(
    "click",
    applyFilters
);


// ========================================
// Clear Filters
// ========================================

clearFiltersButton.addEventListener(
    "click",
    function() {

        minPriceInput.value = "";
        maxPriceInput.value = "";

        typeFilters.forEach(function(filter) {
            filter.checked = false;
        });

        amenityFilters.forEach(function(filter) {
            filter.checked = false;
        });

        applyFilters();

    }
);


// ========================================
// Sorting
// ========================================

function sortProperties() {

    const sortValue = sortSelect.value;

    const propertyCards =
        Array.from(
            document.querySelectorAll(".listing-card")
        );


    if (sortValue === "priceLow") {

        propertyCards.sort(function(a, b) {

            return Number(a.dataset.price) -
                   Number(b.dataset.price);

        });

    }


    else if (sortValue === "bestRated") {

        propertyCards.sort(function(a, b) {

            return Number(b.dataset.rating) -
                   Number(a.dataset.rating);

        });

    }


    propertyCards.forEach(function(card) {

        propertyGrid.appendChild(card);

    });

}


sortSelect.addEventListener(
    "change",
    sortProperties
);


// ========================================
// View Property Details
// ========================================

function viewDetails(propertyType) {

    window.location.href =
        `details.html?property=${propertyType}`;

}


// ========================================
// Start
// ========================================

loadProperties();