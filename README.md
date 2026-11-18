# Aayera Summit Platform — Animated Translucent Website & MongoDB Admin CMS

A full-stack, modern B2B summit & conference platform inspired by flagship industry events like **Pharma Partnering Summit** and **SDV Summit**, crafted with **animated translucent glassmorphic screens (Dual Dark & Light Glass Themes)**, a **MongoDB (Mongoose) backend**, and a **complete Admin Control Panel**.

## Key Features

### Public Summit Website (`/`)
- **Animated & Translucent Hero Banner Carousel**: Multi-slide auto-playing banners managed live from the Admin Panel, frosted glass hero cards, live event **Countdown Timer**, and custom CTA actions.
- **Dual Translucent Glass Theme**: Instant toggle between **Dark Obsidian Aurora Glass** and **Light Frosted Crystal Glass** (default configurable from Admin Panel).
- **Interactive Summit Sections**:
  - Floating Impact Metrics Bar (Delegates, Speakers, Sponsors, Countries)
  - About & Strategic Value Showcase
  - Conference Themes / Pillars with animated hover cards
  - **Searchable & Filterable Speakers Directory** with **Translucent Speaker Profile Modal Screens**
  - **Interactive Multi-Day Agenda / Schedule** with Day tabs & Track filters
  - **Tiered Sponsors, Partners & Exhibitors Showcase**
  - **Host Venue & Interactive Gallery** with **Translucent Full-Screen Lightbox**
  - Expandable Glass FAQ Accordion
  - **Translucent Registration & Partnership Modal** (`Delegate`, `Sponsor`, `Speaker`, `Exhibitor`, `Media`) saving directly to MongoDB.

### Admin Control Panel (`/admin`)
- **Secure Cookie Auth** (`admin@summit.com` / `Admin@123` by default — configurable via `.env.local`).
- **Hero Banners Manager**: Add, edit, delete, reorder, toggle active/hidden, change overlay styles, and upload banner images.
- **Image Upload & Media Library**: Drag-and-drop multi-image uploader (`/api/upload`) with a reusable Media Library Picker across banners, speakers, sponsors, gallery, logo, and venue.
- **Bulk Data Upload (CSV & JSON)**: Upload `.csv` or `.json` files to batch-import **Speakers**, **Agenda Sessions**, **Sponsors**, or **FAQs** into MongoDB with downloadable templates and a live preview table.
- **Full CRUD Managers**: Speakers, Multi-Day Agenda, Tiered Sponsors/Partners, Themes, Gallery, FAQs, Registrations (with status workflow & CSV export), and Site Branding/Settings.

---

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure MongoDB (`.env.local`)**
   Copy `.env.example` to `.env.local` and set your MongoDB connection string (MongoDB Atlas or Local MongoDB):
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/aayera_summit?retryWrites=true&w=majority
   AUTH_SECRET=change-this-to-a-long-random-secret
   ADMIN_EMAIL=admin@summit.com
   ADMIN_PASSWORD=Admin@123
   ```
   > **Note:** If `MONGODB_URI` is left blank, the app automatically runs in **Local Preview Mode** (`.data/store.json`) so you can explore and test everything immediately. As soon as you add `MONGODB_URI` and restart, Mongoose connects to MongoDB and auto-seeds all collections!

3. **Run the development server**
   ```bash
   npm run dev
   ```
   - Public Website: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`
