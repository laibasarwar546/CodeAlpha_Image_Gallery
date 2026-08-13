# CodeAlpha Image Gallery

A responsive and interactive image gallery developed as part of the **CodeAlpha Frontend Development Internship**.

The project uses **HTML, CSS, JavaScript, and the Unsplash API** to dynamically fetch and display images based on categories and user searches.

## 🚀 Live Demo

[View Live Demo](https://pixora-view.vercel.app/)

## 📂 GitHub Repository

[View Source Code](https://github.com/laibasarwar546/CodeAlpha_Image_Gallery)

## ✨ Features

* 🔍 Search images by keyword
* 🖼️ Dynamic image gallery
* 📱 Fully responsive design
* 🎨 Category-based image filtering
* 💡 Interactive image lightbox
* ⬅️ Previous and next image navigation
* ⌨️ Keyboard navigation using Arrow Left, Arrow Right, and Escape
* ⚡ Image preloading for faster navigation
* 💀 Skeleton loading animation
* ❌ API error handling
* 🔐 Secure server-side Unsplash API integration
* 📸 Displays up to 50 images
* 🖥️ Works on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* Unsplash API
* Vercel
* GitHub

## 🔌 API

This project uses the **Unsplash API** to fetch images dynamically.

The API key is handled through a server-side API endpoint and environment variable rather than being exposed directly in the frontend JavaScript.

## 📁 Project Structure

```text
CodeAlpha_Image_Gallery/
│
├── api/
│   └── search.js
│
├── index.html
├── script.js
├── style.css
└── README.md
```

## ⚙️ How It Works

1. The user opens the image gallery.
2. JavaScript requests images through the project's API endpoint.
3. The server-side endpoint communicates with the Unsplash API.
4. Images are returned to the frontend.
5. JavaScript dynamically creates the gallery cards.
6. Users can search for images or select different categories.
7. Clicking an image opens it in a lightbox.
8. Users can navigate between images using the Previous and Next buttons.

## 🔐 Environment Variable

The Unsplash Access Key is stored as an environment variable:

```text
UNSPLASH_ACCESS_KEY
```

For local development, configure the variable in your environment.

For Vercel deployment, add it under:

**Project → Settings → Environment Variables**

> Do not commit the actual API key to GitHub.

## 💻 Run Locally

Clone the repository:

```bash
git clone https://github.com/laibasarwar546/CodeAlpha_Image_Gallery.git
```

Open the project folder:

```bash
cd CodeAlpha_Image_Gallery
```

Then run the project using a local development server such as **VS Code Live Server**.

Make sure the required `UNSPLASH_ACCESS_KEY` environment variable is configured for the API endpoint.

## 🎯 Internship Task

This project was created as part of the **CodeAlpha Frontend Development Internship** to demonstrate practical skills in:

* Frontend development
* Responsive web design
* JavaScript DOM manipulation
* API integration
* Asynchronous JavaScript
* Error handling
* Git and GitHub
* Deployment using Vercel

## 👩‍💻 Author

**Laiba Sarwar**

Frontend Developer | BSCS Student

[GitHub Profile](https://github.com/laibasarwar546)

---

⭐ If you found this project useful, consider giving the repository a star.
