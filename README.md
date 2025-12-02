# GetXoned - E-commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, and MongoDB. Features a drop/capsule system for limited edition releases with a sleek, minimalist design.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Clean, minimalist design with smooth animations
- **Drop System**: Capsule-based product releases with limited quantities
- **Product Catalog**: Dynamic grid layout with masonry-style product cards
- **Shopping Cart**: Full cart functionality with persistent state
- **User Authentication**: Integrated with Clerk for secure user management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Professional loading spinners and skeleton screens
- **Image Optimization**: Cloudinary integration for fast image delivery

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for all entities
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with Clerk integration
- **File Upload**: Cloudinary integration for image management
- **Drop Management**: System for managing product drops/capsules
- **Order Processing**: Complete order lifecycle management
- **Admin Routes**: Protected admin endpoints for content management

### Admin Panel (React)
- **Product Management**: Add, edit, and manage products
- **Drop Management**: Create and manage product drops
- **Order Management**: View and process customer orders
- **Analytics Dashboard**: Sales and performance metrics
- **Image Upload**: Direct Cloudinary integration

## 🏗️ Architecture

```
GetXoned Platform/
├── frontend/          # React frontend application
├── backend/           # Node.js API server
├── admin/             # React admin panel
└── images/            # Static image assets
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Clerk** for authentication
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Cloudinary** for image storage
- **JWT** for authentication
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Database Models
- **Products**: Product information, variants, stock
- **Drops**: Drop/capsule management with metadata
- **Users**: User profiles and authentication
- **Orders**: Order processing and fulfillment

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sreevenkat0910/GetXoned.git
   cd GetXoned
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   
   # Admin
   cd ../admin
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in each directory:
   
   **backend/.env**
   ```env
   PORT=4000
   CORS_ORIGINS=http://localhost:5173,http://localhost:5174
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ALLOW_DEV_SEED=true
   ```
   
   **frontend/.env**
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BRAND_BANNER_URL=your_brand_banner_url
   ```
   
   **admin/.env**
   ```env
   VITE_API_URL=http://localhost:4000
   ```

4. **Start the applications**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   
   # Terminal 3 - Admin
   cd admin
   npm run dev
   ```

5. **Access the applications**
   - Frontend: http://localhost:5173
   - Admin Panel: http://localhost:5174
   - Backend API: http://localhost:4000

## 📱 Key Features

### Drop System
- **Capsule Releases**: Limited edition product drops
- **Dynamic Content**: Drop-specific banners, titles, and descriptions
- **Stock Management**: Real-time inventory tracking
- **Archive System**: Move sold-out drops to vault

### Product Management
- **Variants**: Multiple colors, sizes, and options
- **Image Gallery**: Multiple product images with fallbacks
- **Stock Tracking**: Low stock alerts and sold-out states
- **Categories**: Organized product categorization

### User Experience
- **Fast Loading**: Optimized images and lazy loading
- **Smooth Animations**: CSS transitions and micro-interactions
- **Mobile Responsive**: Touch-friendly interface
- **Accessibility**: WCAG compliant components

## 🔧 API Endpoints

### Products
- `GET /api/product/list` - Get all products
- `GET /api/product/current-drop` - Get current drop products
- `GET /api/product/drop/:dropCode` - Get products by drop
- `POST /api/product/add` - Add new product (admin)
- `DELETE /api/product/:id` - Delete product (admin)

### Drops
- `GET /api/drop/current` - Get current active drop
- `GET /api/drop/archived` - Get archived drops
- `POST /api/drop/create` - Create new drop (admin)
- `PATCH /api/drop/archive/:dropCode` - Archive drop (admin)

### Orders
- `GET /api/order/list` - Get user orders
- `POST /api/order/create` - Create new order
- `PATCH /api/order/:id/status` - Update order status (admin)

## 🎨 Design System

### Colors
- **Primary**: #D04007 (Orange)
- **Secondary**: #000000 (Black)
- **Background**: #FFFFFF (White)
- **Text**: #333333 (Dark Gray)

### Typography
- **Headings**: Uppercase, letter-spaced
- **Body**: Clean, readable fonts
- **Sizes**: Responsive scaling with clamp()

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Minimal design with hover states
- **Forms**: Clean inputs with validation
- **Navigation**: Sticky headers with smooth scrolling

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create a cluster
2. Set up connection string
3. Configure IP whitelist

## 📝 Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server
- `node scripts/seedDropData.js` - Seed initial drop data
- `node scripts/updateProductsWithDropCode.js` - Update products with drop codes

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Clerk** for authentication
- **Cloudinary** for image management
- **Tailwind CSS** for styling
- **Lucide** for icons
- **MongoDB** for database

## 📞 Support

For support, email support@getxoned.com or create an issue in the repository.

---

**GetXoned** - Where tradition meets contemporary streetwear.
