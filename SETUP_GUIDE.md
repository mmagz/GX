# GetXoned Project Setup Guide

## 🚀 Project Overview
GetXoned is a comprehensive e-commerce platform with three main components:
- **Backend**: Node.js/Express API server
- **Frontend**: React/Vite customer-facing e-commerce site
- **Admin**: React/Vite admin dashboard

## ✅ Setup Complete
All dependencies have been installed successfully for all three components.

## 🔧 Environment Configuration

### Backend Environment (.env in backend folder)
You need to configure the following variables in `backend/.env`:

```env
NODE_ENV=development
PORT=10000
MONGODB_URI=mongodb://localhost:27017/xoned
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret_key_here
CLERK_SECRET_KEY=your_clerk_secret_key
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Frontend Environment (.env in frontend folder)
```env
VITE_API_URL=http://localhost:10000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Admin Environment (.env in admin folder)
```env
VITE_API_URL=http://localhost:10000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 🏃‍♂️ Running the Project

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:10000

### 2. Start the Frontend (Customer Site)
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173

### 3. Start the Admin Dashboard
```bash
cd admin
npm run dev
```
The admin panel will run on http://localhost:5174

## 🔑 Required Services

Before running the project, you'll need to set up:

1. **MongoDB Database**
   - Local: Install MongoDB locally
   - Cloud: Use MongoDB Atlas (recommended)

2. **Cloudinary Account**
   - Sign up at cloudinary.com
   - Get your cloud name, API key, and API secret

3. **Clerk Authentication**
   - Sign up at clerk.com
   - Create a new application
   - Get your publishable key and secret key

## 📁 Project Structure
```
GetXoned/
├── backend/          # Node.js API server
├── frontend/         # Customer e-commerce site
├── admin/           # Admin dashboard
├── env.example      # Environment variables template
└── render.yaml      # Deployment configuration
```

## 🚀 Next Steps

1. **Configure Environment Variables**: Update the .env files with your actual service credentials
2. **Set up MongoDB**: Either install locally or use MongoDB Atlas
3. **Set up Cloudinary**: Create account and get credentials
4. **Set up Clerk**: Create authentication application
5. **Start Development**: Run all three components as described above

## 🛠️ Available Scripts

### Backend Scripts
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run upload:images` - Upload images to Cloudinary

### Frontend/Admin Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔍 Troubleshooting

- Make sure all environment variables are properly configured
- Ensure MongoDB is running (if using local instance)
- Check that all ports (10000, 5173, 5174) are available
- Verify Clerk and Cloudinary credentials are correct

## 📞 Support

If you encounter any issues, check the individual README files in each component folder for more detailed information.
