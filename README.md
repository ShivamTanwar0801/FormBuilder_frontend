# Custom Form Builder \& Preview Application

A React-based dynamic form builder and preview app supporting multiple question types including Categorize, Cloze, and Comprehension. Users can create forms with images, multiple choice, and categorized questions, save them to a backend, and preview/fill submitted forms.

Features

- Create forms with custom title and header image
- Add multiple question types:
    - Categorize (with option images and categories)
    - Cloze (fill-in-the-blank style questions)
    - Comprehension (passages with questions)
- Upload images for questions and options
- Preview forms with validation for complete answers
- Save forms and submit responses via REST API
- Responsive and clean UI with TailwindCSS
- Default placeholders for missing images

Tech Stack

- Frontend: React, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, MongoDB (Mongoose)
- File Upload: Multer + Cloudinary
- Unique IDs: uuid for stable keys in React lists

Setup \& Run

Prerequisites

- Node.js (v16+ recommended)
- MongoDB running locally or remote (MongoDB Atlas is fine)
- Cloudinary account for image uploads (optional if you switch to local storage)

Frontend

1) Clone the repo

- git clone https://github.com/yourusername/custom-form-builder.git
- cd custom-form-builder/client

2) Install dependencies

- npm install

3) Run development server

- npm start

4) Open your browser at http://localhost:3000

Backend
Backend lives in the backend/ directory. It’s an Express + Mongoose API with Multer + Cloudinary for uploads.

Project structure (backend)

- backend/
    - server.js
    - package.json
    - package-lock.json
    - README.md
    - config/
        - db.js
    - routes/
        - forms.js
        - responses.js
        - uploads.js
    - models/
        - Form.js
        - Response.js
    - .env.example

Install \& run

- cd backend
- npm install
- cp .env.example .env
- Fill in .env (see Environment variables below)
- Development: npm run dev
- Production: npm start
- Server runs on PORT (default 5000). Health check: GET /

Environment variables

- PORT=5000
- MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true\&w=majority
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret
- Optional CORS:
    - You can allow all origins via app.use(cors()) as in server.js, or restrict in code.

Backend dependencies (from package.json)

- express, mongoose, cors, dotenv
- multer, multer-storage-cloudinary, cloudinary
- dev: nodemon

API overview
Base URL: http://localhost:5000

- GET /
    - Returns “Form Builder API is running”
- Forms
    - POST /api/forms
        - Create a form
        - Body: Form payload (see sample below)
        - Returns: saved Form
    - GET /api/forms
        - List forms
        - Returns: Form[]
    - GET /api/forms/:id
        - Get a single form
        - Returns: Form
- Responses
    - POST /api/responses
        - Submit responses for a form
        - Body: { formId: string, answers: Record<string, any> }
        - Returns: { ok: true, ... } (and may include score/errors if you implement scoring)
- Uploads
    - POST /api/upload
        - multipart/form-data with field: file
        - Stores file in Cloudinary
        - Returns: { url: string }


Frontend usage

- Go to Builder page to create a new form
- Add questions with images and categories as needed
- Save form using the fixed bottom “Save Form” button
- Go to Forms page to see all saved forms
- Click on any form to preview and fill answers
- Submit the filled form and see validation messages

Validation rules (frontend)

- required questions must be fully answered:
    - categorize: all options assigned to one of the provided categories
    - cloze: all blanks filled (non-empty)
    - comprehension:
        - mcq: one option selected
        - short: non-empty text
- On submit, send minimal answers only (strip images/metadata)

Image upload flow

- ImageUploader sends multipart/form-data (field: file) to POST /api/upload
- Server uploads to Cloudinary and returns a URL
- UI sets the returned url on question.imageUrl or option.imageUrl
- Fallback to a default placeholder if missing or error

Security and notes

- CORS is enabled globally; restrict origins in production
- Validate file types and sizes on upload (Cloudinary and/or Multer limits)
- Sanitize and validate form and response payloads on the server
- Rate-limit /api/upload and /api/responses in production
- Keep CLOUDINARY_* secrets and MONGO_URI in environment, not in source control

Scripts

- Backend:
    - npm run dev — start with nodemon
    - npm start — start server
- Frontend:
    - npm start — React dev server

License
MIT © Your Name


