# Pakistan Railways Redesigned - Full Stack Project

## 📁 Project Structure

```
pakistan-railways-redesign/
├── frontend/                      # Frontend Web Application
│   ├── public/
│   │   ├── index.html            # Main HTML file
│   │   ├── style.css             # Global styles
│   │   ├── script.js             # Frontend JavaScript
│   │   └── assets/               # Images, icons, etc.
│   └── src/                       # Source code (future components)
│
├── backend/                       # Node.js + Express Backend
│   ├── src/
│   │   ├── server.js             # Main application file
│   │   ├── config/
│   │   │   └── database.js       # MongoDB connection
│   │   ├── controllers/          # Business logic
│   │   │   ├── authController.js
│   │   │   ├── trainsController.js
│   │   │   ├── bookingsController.js
│   │   │   └── feedbackController.js
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Train.js
│   │   │   ├── Booking.js
│   │   │   └── Feedback.js
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.js
│   │   │   ├── trains.js
│   │   │   ├── bookings.js
│   │   │   └── feedback.js
│   │   ├── middleware/           # Custom middleware
│   │   │   └── auth.js           # JWT authentication
│   │   ├── services/             # Business logic layer (optional)
│   │   └── utils/                # Helper functions
│   │       ├── seedData.js       # Database seeding
│   │       └── errorHandler.js   # Error handling
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   └── README.md                 # Backend documentation
│
├── .gitignore                    # Git ignore file
├── README.md                     # This file
└── package.json                  # Root package.json (optional)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with required variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/pakistan-railways
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Server will run at `http://localhost:3000`

### Frontend Setup

The frontend is served statically by the backend from the `frontend/public` directory. Simply open your browser and navigate to `http://localhost:3000`.

## 📚 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT token)

### Train Routes
- `GET /api/trains` - Get all trains
- `GET /api/trains/:id` - Get train by ID
- `GET /api/trains/search?from=KHI&to=LHE` - Search trains by stations
- `GET /api/trains/status` - Get live train running status

### Booking Routes
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:pnr` - Get booking by PNR number

### Feedback Routes
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (admin)

## 🏗️ Architecture Overview

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS for simplicity
- **Responsive Design** - Works on all devices
- **Accessibility Features** - Font size adjustment, high contrast mode, screen reader support
- **Real-time API Integration** - Communicates with backend REST API

### Backend
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM for data modeling
- **JWT Authentication** - Secure token-based authentication
- **Controllers** - Separation of concerns
- **Middleware** - Authentication and error handling
- **Services** - Business logic layer (extensible)

### Database
- **MongoDB** - NoSQL database
- **Collections**: Users, Trains, Bookings, Feedback
- **Data Validation** - Mongoose schema validation

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling middleware
- ✅ Environment variables for sensitive data

## 🎨 Features

### User Features
- User registration and login
- Train search and booking
- PNR verification
- Feedback submission
- Accessibility options:
  - Font size adjustment
  - High contrast mode
  - Screen reader support
  - Keyboard navigation

### Admin Features
- View all bookings
- View all feedback
- Train management
- User management

## 📦 Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Development
- **nodemon** - Auto-restart server

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/pakistan-railways

# Authentication
JWT_SECRET=your_secret_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### MongoDB Connection

For local MongoDB:
```
MONGO_URI=mongodb://localhost:27017/pakistan-railways
```

For MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pakistan-railways?retryWrites=true&w=majority
```

## 📝 Database Schema

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  cnic: String,
  phone: String,
  createdAt: Date
}
```

### Train
```javascript
{
  trainNumber: String (unique),
  trainName: String,
  fromStation: String,
  toStation: String,
  departureTime: String,
  arrivalTime: String,
  status: String,
  delay: Number,
  classes: [{
    className: String,
    fare: Number,
    availableSeats: Number
  }]
}
```

### Booking
```javascript
{
  passengerName: String,
  passengerCnic: String,
  passengerEmail: String,
  trainId: ObjectId,
  journeyDate: Date,
  selectedClass: String,
  passengers: Number,
  totalFare: Number,
  pnr: String (unique),
  bookingStatus: String,
  bookedAt: Date
}
```

## 🚀 Deployment

### Frontend
The frontend is served as static files from the backend. For production:
1. Build frontend assets (if using build tools)
2. Place in `frontend/public`
3. Backend serves via `express.static()`

### Backend
For production deployment:
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Set MongoDB Atlas URI
4. Configure CORS for production domain
5. Use process manager like PM2
6. Enable HTTPS

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000    # Windows
```

### API Not Responding
- Check backend is running (`npm run dev`)
- Verify API_BASE URL in `script.js`
- Check CORS configuration

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please contact or create an issue in the repository.

---

**Last Updated:** May 2026  
**Version:** 1.0.0
