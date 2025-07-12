# MERN Blog Platform

A full-stack blog application built with the **MERN** stack (MongoDB, Express, React, Node.js). This project features user authentication, blog post management, comments system, and a modern responsive UI with dark/light theme support.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Protected routes with AuthGuard
  - Role-based access control (user/admin)

- **Blog Post Management**
  - Create, read, update, and delete blog posts
  - Rich text content with excerpts
  - Post categorization and tagging
  - Featured posts highlighting
  - Search and filter functionality

- **Comments System**
  - Add comments to blog posts
  - Real-time comment updates
  - Comment moderation capabilities

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark/light theme toggle
  - Modern component library (Radix UI)
  - Tailwind CSS for styling
  - Smooth animations and transitions

### Technical Features
- **Frontend**
  - React 19 with modern hooks
  - Vite for fast development
  - React Router for navigation
  - TanStack Query for data fetching
  - Vitest for unit testing
  - Testing Library for component testing

- **Backend**
  - Express.js REST API
  - MongoDB with Mongoose ODM
  - JWT authentication
  - Password hashing with bcryptjs
  - Input validation and error handling
  - Jest for integration testing

## 📁 Project Structure

```
week-6-test-debug-assignment-Jakababa94/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # Radix UI components
│   │   │   ├── AuthGuard.jsx        # Route protection
│   │   │   ├── BlogHeader.jsx       # Navigation header
│   │   │   └── ThemeToggle.jsx      # Theme switcher
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx     # Theme state management
│   │   ├── pages/                   # Main application pages
│   │   │   ├── Index.jsx            # Blog listing page
│   │   │   ├── BlogPost.jsx         # Single post view
│   │   │   ├── Login.jsx            # User login
│   │   │   ├── Register.jsx         # User registration
│   │   │   ├── CreatePost.jsx       # Post creation
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── tests/                   # Frontend tests
│   │   │   ├── setup.js             # Test configuration
│   │   │   ├── BlogPost.test.jsx    # Component tests
│   │   │   └── unit/                # Unit tests
│   │   ├── lib/
│   │   │   └── utils.js             # Utility functions
│   │   ├── assets/                  # Static assets
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # App entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Public assets
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── vitest.config.js             # Vitest configuration
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # Database connection
│   │   ├── controllers/             # Route controllers
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── postControllers.js   # Post management
│   │   │   └── userControllers.js   # User management
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT verification
│   │   ├── models/                  # Mongoose models
│   │   │   ├── User.js              # User schema
│   │   │   └── Post.js              # Post schema
│   │   ├── routes/                  # API routes
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   ├── postRoutes.js        # Post endpoints
│   │   │   └── userRoutes.js        # User endpoints
│   │   └── utils/
│   │       └── auth.js              # Auth utilities
│   ├── tests/                       # Backend tests
│   │   ├── integration/             # API integration tests
│   │   │   ├── auth.test.js         # Auth endpoint tests
│   │   │   └── posts.test.js        # Post endpoint tests
│   │   └── setup.js                 # Test configuration
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   └── package.json                 # Backend dependencies
├── package.json                     # Root dependencies
├── jest.config.js                   # Jest configuration
└── README.md                        # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **pnpm** (recommended) or npm/yarn
- **MongoDB** (local installation or MongoDB Atlas)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd week-6-test-debug-assignment-Jakababa94
```

### Step 2: Install Dependencies

#### Backend Dependencies

```bash
cd server
pnpm install
```

#### Frontend Dependencies

```bash
cd ../client
pnpm install
```

### Step 3: Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/mern-blog
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mern-blog

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend Environment Variables

The frontend uses the default Vite configuration. If you need to customize the API URL, create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Database Setup

#### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Create a database named `mern-blog`

#### MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGO_URI` in your `.env` file

### Step 5: Start the Application

#### Development Mode

**Backend:**
```bash
cd server
pnpm dev
```

**Frontend:**
```bash
cd client
pnpm dev
```

#### Production Mode

**Backend:**
```bash
cd server
pnpm start
```

**Frontend:**
```bash
cd client
pnpm build
pnpm preview
```

## 🌐 Access Points

- **Frontend Application:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/health

## 🧪 Testing

### Backend Testing

Run all backend tests:
```bash
cd server
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run tests with coverage:
```bash
pnpm test:coverage
```

### Frontend Testing

Run all frontend tests:
```bash
cd client
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run tests with UI:
```bash
pnpm test:ui
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Post Endpoints

#### Get All Posts
```http
GET /api/posts
GET /api/posts?page=1&limit=10
GET /api/posts?category=technology
```

#### Get Single Post
```http
GET /api/posts/:id
```

#### Create Post (Protected)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Blog Post",
  "content": "This is the content of my blog post.",
  "category": "technology"
}
```

#### Update Post (Protected)
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Post (Protected)
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

## 🔧 Available Scripts

### Root Directory
```bash
pnpm install          # Install all dependencies
```

### Backend (server/)
```bash
pnpm dev              # Start development server with nodemon
pnpm start            # Start production server
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
```

### Frontend (client/)
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
pnpm lint             # Run ESLint
```

## 🛡️ Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcryptjs for password security
- **Input Validation:** Server-side validation for all inputs
- **CORS Configuration:** Proper cross-origin resource sharing
- **Environment Variables:** Secure configuration management
- **Protected Routes:** Authentication middleware for sensitive endpoints

## 🎨 UI/UX Features

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Dark/Light Theme:** User preference-based theme switching
- **Modern Components:** Built with Radix UI primitives
- **Smooth Animations:** CSS transitions and micro-interactions
- **Accessibility:** ARIA labels and keyboard navigation
- **Loading States:** Proper loading indicators
- **Error Handling:** User-friendly error messages

## 🧪 Testing Strategy

### Backend Testing
- **Integration Tests:** API endpoint testing with Supertest
- **Database Testing:** MongoDB Memory Server for isolated tests
- **Authentication Testing:** JWT token validation tests
- **Error Handling:** Edge case and error scenario testing

### Frontend Testing
- **Component Testing:** React component testing with Testing Library
- **User Interaction:** Click, type, and form submission testing
- **Async Operations:** API call and loading state testing
- **Mocking:** Service layer and external dependency mocking

## 🚀 Deployment

### Backend Deployment

#### Heroku
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy using Git

```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Frontend Deployment

#### Vercel
1. Connect your GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy automatically

#### Netlify
1. Connect your GitHub repository
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jakababa94**
- GitHub: [@Jakababa94](https://github.com/Jakababa94)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer directly

---

