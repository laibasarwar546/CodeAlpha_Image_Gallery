// ==========================================
// UNSPLASH API
// ==========================================

const API_KEY =
    "";

const API_URL =
    "https://api.unsplash.com/search/photos";


// ==========================================
// HTML ELEMENTS
// ==========================================

const gallery =
    document.getElementById("gallery");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("error");

const imageCount =
    document.getElementById("imageCount");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const closeBtn =
    document.getElementById("closeBtn");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const photoInfo =
    document.getElementById("photoInfo");


// ==========================================
// SETTINGS
// ==========================================

const TOTAL_IMAGES = 50;

const FIRST_PAGE = 30;

const SECOND_PAGE = 20;


// ==========================================
// VARIABLES
// ==========================================

let photos = [];

let currentIndex = 0;

let currentQuery = "nature";

let isLoading = false;


// ==========================================
// IMAGE CACHE
// ==========================================

const imageCache =
    new Map();


// ==========================================
// GET PHOTOS FROM UNSPLASH
// ==========================================

async function getPhotos(
    query = "nature"
) {

    // Prevent duplicate requests
    if (isLoading) {
        return;
    }


    isLoading = true;


    // Show loading
    loading.style.display = "block";


    // Clear previous error
    errorMessage.textContent = "";


    // Reset gallery
    gallery.innerHTML = "";


    // Reset images
    photos = [];


    // Reset index
    currentIndex = 0;


    // Save current search
    currentQuery = query;


    // Clear old image cache
    imageCache.clear();


    // Reset counter
    if (imageCount) {

        imageCount.textContent =
            "Loading images...";

    }


    try {

        // ======================================
        // FIRST REQUEST — 30 IMAGES
        // ======================================

        const firstResponse =
            await fetch(

                `${API_URL}?query=${encodeURIComponent(
                    query
                )}&page=1&per_page=${FIRST_PAGE}`,

                {
                    headers: {
                        Authorization:
                            `Client-ID ${API_KEY}`
                    }
                }

            );


        // ======================================
        // CHECK FIRST RESPONSE
        // ======================================

        if (!firstResponse.ok) {

            if (
                firstResponse.status === 401
            ) {

                throw new Error(
                    "Invalid Unsplash API key."
                );

            }


            if (
                firstResponse.status === 403
            ) {

                throw new Error(
                    "Unsplash API access was denied or limited."
                );

            }


            if (
                firstResponse.status === 429
            ) {

                throw new Error(
                    "Unsplash API rate limit reached. Please try again later."
                );

            }


            throw new Error(
                `API Error: ${firstResponse.status}`
            );

        }


        const firstData =
            await firstResponse.json();


        // ======================================
        // ADD FIRST 30
        // ======================================

        photos.push(
            ...firstData.results
        );


        // ======================================
        // DISPLAY FIRST 30
        // ======================================

        displayPhotos(
            firstData.results,
            0
        );


        // ======================================
        // SECOND REQUEST — 20 IMAGES
        // ======================================

        if (
            firstData.results.length >=
            FIRST_PAGE
        ) {

            const secondResponse =
                await fetch(

                    `${API_URL}?query=${encodeURIComponent(
                        query
                    )}&page=2&per_page=${SECOND_PAGE}`,

                    {
                        headers: {
                            Authorization:
                                `Client-ID ${API_KEY}`
                        }
                    }

                );


            // ==================================
            // CHECK SECOND RESPONSE
            // ==================================

            if (!secondResponse.ok) {

                if (
                    secondResponse.status === 429
                ) {

                    throw new Error(
                        "Unsplash API rate limit reached."
                    );

                }


                throw new Error(
                    `API Error: ${secondResponse.status}`
                );

            }


            const secondData =
                await secondResponse.json();


            // ==================================
            // ADD NEXT 20
            // ==================================

            photos.push(
                ...secondData.results
            );


            // ==================================
            // DISPLAY NEXT 20
            // ==================================

            displayPhotos(
                secondData.results,
                FIRST_PAGE
            );

        }


        // ======================================
        // LIMIT TO EXACTLY 50
        // ======================================

        photos =
            photos.slice(
                0,
                TOTAL_IMAGES
            );


        // ======================================
        // UPDATE COUNTER
        // ======================================

        updateImageCount();


    } catch (error) {

        console.error(
            "Unsplash Error:",
            error
        );


        errorMessage.textContent =
            error.message ||
            "Unable to load images. Please try again.";


        if (imageCount) {

            imageCount.textContent =
                "0 images";

        }

    } finally {

        isLoading = false;

        loading.style.display = "none";

    }

}

// ==========================================
// SHOW SKELETON LOADING
// ==========================================

function showSkeletons() {

    gallery.innerHTML = "";

    const skeletonCount = 12;

    for (let i = 0; i < skeletonCount; i++) {

        const skeleton =
            document.createElement("div");

        skeleton.classList.add(
            "skeleton-card"
        );

        gallery.appendChild(
            skeleton
        );
    }
}
// ==========================================
// DISPLAY PHOTOS
// ==========================================

function displayPhotos(
    photoList,
    startIndex
) {

    photoList.forEach(
        (photo, index) => {

            // Don't exceed 50
            if (
                startIndex + index >=
                TOTAL_IMAGES
            ) {

                return;

            }


            const realIndex =
                startIndex + index;


            // ==================================
            // CREATE CARD
            // ==================================

            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "gallery-item"
            );


            // ==================================
            // IMAGE NAME
            // ==================================

            const imageName =
                photo.alt_description ||
                photo.description ||
                currentQuery ||
                "Beautiful image";


            // ==================================
            // IMAGE CARD
            // ==================================

            item.innerHTML = `

                <img
                    src="${photo.urls.small}"
                    alt="${escapeHTML(
                        imageName
                    )}"
                    loading="lazy"
                >

                <div class="photo-overlay">

                    <h3>
                        ${escapeHTML(
                            capitalizeText(
                                imageName
                            )
                        )}
                    </h3>

                    <p>
                        Click to view
                    </p>

                </div>

            `;


            // ==================================
            // CLICK CARD
            // ==================================

            item.addEventListener(
                "click",
                () => {

                    currentIndex =
                        realIndex;

                    openLightbox();

                }
            );


            gallery.appendChild(
                item
            );

        }
    );


    // Update counter
    updateImageCount();

}


// ==========================================
// UPDATE IMAGE COUNTER
// ==========================================

function updateImageCount() {

    if (!imageCount) {
        return;
    }


    if (photos.length === 0) {

        imageCount.textContent =
            "0 images";

        return;

    }


    imageCount.textContent =
        `${photos.length} images`;

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


// ==========================================
// CAPITALIZE TEXT
// ==========================================

function capitalizeText(text) {

    if (!text) {

        return "Beautiful image";

    }


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


// ==========================================
// FAST IMAGE URL
// ==========================================

function getFastImageURL(photo) {

    /*
        Unsplash raw image can be very large.

        We request:
        Width = 1400px
        Quality = 85
        Auto format
    */

    return (
        `${photo.urls.raw}` +
        `&w=1400` +
        `&q=85` +
        `&auto=format`
    );

}


// ==========================================
// PRELOAD IMAGE
// ==========================================

function preloadImage(index) {

    if (
        index < 0 ||
        index >= photos.length
    ) {

        return;

    }


    const photo =
        photos[index];


    const imageURL =
        getFastImageURL(photo);


    // Already cached
    if (
        imageCache.has(imageURL)
    ) {

        return;

    }


    const image =
        new Image();


    image.onload = () => {

        imageCache.set(
            imageURL,
            image
        );

    };


    image.onerror = () => {

        imageCache.delete(
            imageURL
        );

    };


    image.src =
        imageURL;

}


// ==========================================
// PRELOAD NEARBY IMAGES
// ==========================================

function preloadNearbyImages() {

    // Next image
    preloadImage(
        currentIndex + 1
    );


    // Previous image
    preloadImage(
        currentIndex - 1
    );


    // Extra next
    preloadImage(
        currentIndex + 2
    );


    // Extra previous
    preloadImage(
        currentIndex - 2
    );

}


// ==========================================
// OPEN LIGHTBOX
// ==========================================

function openLightbox() {

    if (
        photos.length === 0
    ) {

        return;

    }


    const photo =
        photos[currentIndex];


    if (!photo) {

        return;

    }


    // ======================================
    // IMAGE NAME
    // ======================================

    const imageName =
        photo.alt_description ||
        photo.description ||
        currentQuery ||
        "Beautiful image";


    // ======================================
    // IMAGE URL
    // ======================================

    const imageURL =
        getFastImageURL(photo);


    // ======================================
    // SHOW IMAGE
    // ======================================

    lightboxImage.src =
        imageURL;


    lightboxImage.alt =
        imageName;


    // ======================================
    // PHOTO INFORMATION
    // ======================================

    photoInfo.innerHTML = `

        <h3>
            ${escapeHTML(
                capitalizeText(
                    imageName
                )
            )}
        </h3>

        <p>
            Image
            ${currentIndex + 1}
            of
            ${photos.length}
        </p>

    `;


    // ======================================
    // SHOW LIGHTBOX
    // ======================================

    lightbox.classList.add(
        "active"
    );


    // ======================================
    // PRELOAD
    // ======================================

    preloadNearbyImages();

}


// ==========================================
// NEXT IMAGE
// ==========================================

function showNextImage() {

    if (
        photos.length === 0
    ) {

        return;

    }


    currentIndex++;


    // Loop back to first
    if (
        currentIndex >=
        photos.length
    ) {

        currentIndex = 0;

    }


    openLightbox();

}


// ==========================================
// PREVIOUS IMAGE
// ==========================================

function showPreviousImage() {

    if (
        photos.length === 0
    ) {

        return;

    }


    currentIndex--;


    // Loop to last image
    if (
        currentIndex < 0
    ) {

        currentIndex =
            photos.length - 1;

    }


    openLightbox();

}


// ==========================================
// NEXT BUTTON
// ==========================================

nextBtn.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        showNextImage();

    }
);


// ==========================================
// PREVIOUS BUTTON
// ==========================================

prevBtn.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        showPreviousImage();

    }
);


// ==========================================
// CLOSE BUTTON
// ==========================================

closeBtn.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        lightbox.classList.remove(
            "active"
        );

    }
);


// ==========================================
// CLICK OUTSIDE LIGHTBOX
// ==========================================

lightbox.addEventListener(
    "click",
    (event) => {

        if (
            event.target === lightbox
        ) {

            lightbox.classList.remove(
                "active"
            );

        }

    }
);


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        // Only when lightbox is open
        if (
            !lightbox.classList.contains(
                "active"
            )
        ) {

            return;

        }


        // Next
        if (
            event.key === "ArrowRight"
        ) {

            showNextImage();

        }


        // Previous
        if (
            event.key === "ArrowLeft"
        ) {

            showPreviousImage();

        }


        // Close
        if (
            event.key === "Escape"
        ) {

            lightbox.classList.remove(
                "active"
            );

        }

    }
);


// ==========================================
// SEARCH BUTTON
// ==========================================

searchBtn.addEventListener(
    "click",
    () => {

        const query =
            searchInput.value.trim();


        if (
            query === ""
        ) {

            return;

        }


        // Close lightbox
        lightbox.classList.remove(
            "active"
        );


        // Remove active category
        filterButtons.forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


        // Search
        getPhotos(query);

    }
);


// ==========================================
// ENTER TO SEARCH
// ==========================================

searchInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Enter"
        ) {

            return;

        }


        const query =
            searchInput.value.trim();


        if (
            query === ""
        ) {

            return;

        }


        // Close lightbox
        lightbox.classList.remove(
            "active"
        );


        // Remove active category
        filterButtons.forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


        // Search
        getPhotos(query);

    }
);


// ==========================================
// CATEGORY FILTERS
// ==========================================

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                // Remove active
                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                // Add active
                button.classList.add(
                    "active"
                );


                // Clear search
                searchInput.value = "";


                // Close lightbox
                lightbox.classList.remove(
                    "active"
                );


                // Category
                const query =
                    button.dataset.query;


                // Load 50 images
                getPhotos(query);

            }
        );

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

getPhotos("nature");