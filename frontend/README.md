# Pakistan Railways Frontend

## Overview
This is the frontend for the Pakistan Railways redesigned web application. It's a responsive, accessible web application built with vanilla JavaScript and HTML/CSS.

## Features

### Functional Features
- ✅ User Authentication (Registration & Login)
- ✅ Train Search & Booking
- ✅ Live Train Status Display
- ✅ Booking Confirmation with PNR
- ✅ Feedback Submission
- ✅ Train Schedule Information

### Accessibility Features
- ✅ Font Size Adjustment (A+/A-)
- ✅ High Contrast Mode
- ✅ Screen Reader Support
- ✅ Keyboard Navigation
- ✅ ARIA Labels
- ✅ Bilingual Support (English/Urdu)

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Responsive design with CSS Grid & Flexbox
- **Vanilla JavaScript** - No frameworks
- **Font Awesome** - Icons
- **Google Fonts** - Noto Sans Arabic for Urdu support

## Structure

```
frontend/
├── public/
│   ├── index.html       # Main page
│   ├── style.css        # Styles
│   ├── script.js        # JavaScript
│   └── assets/          # Images, icons
└── src/                 # Future: Component directory
```

## File Descriptions

### index.html
- Main entry point
- Three-column layout (Left Sidebar, Content, Right Sidebar)
- Responsive navigation
- All form elements and sections

### style.css
- CSS Variables for theming (Pakistan Railways Green)
- Mobile-first responsive design
- Accessibility-focused styling
- High contrast mode support

### script.js
- API communication (fetch)
- Form handling and validation
- Dynamic UI updates
- Modal dialogs for bookings
- Local storage for authentication tokens
- Real-time validation

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/api`.

### Key Endpoints Used
```javascript
// Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

// Trains
GET    /api/trains
GET    /api/trains/:id
GET    /api/trains/search?from=KHI&to=LHE
GET    /api/trains/status

// Bookings
POST   /api/bookings
GET    /api/bookings/:pnr

// Feedback
POST   /api/feedback
```

## Styling

### Color Scheme
- Primary Green: `#006400`
- Light Green: `#008000`
- Dark Green: `#004d00`
- Yellow Accent: `#FFC107`

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## Usage

### Local Development

1. Start backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Open frontend in browser:
   ```
   http://localhost:3000
   ```

### Features Guide

#### User Registration
1. Click "Register here" link in login form
2. Fill in required fields
3. Submit to create account

#### Train Booking
1. Select From/To stations
2. Choose journey date
3. Click "Find Trains"
4. Select desired class and book
5. Fill passenger details
6. Receive PNR confirmation

#### Feedback
1. Scroll to right sidebar
2. Fill feedback form
3. Rate experience with stars
4. Submit feedback

## Accessibility

### Keyboard Navigation
- Tab: Move between elements
- Enter: Activate buttons
- Escape: Close modals/dialogs

### Screen Reader
- All images have alt text
- Form labels properly associated
- Navigation landmarks defined
- Status messages announced

### Visual Aids
- Font size can be adjusted
- High contrast mode available
- Clear focus indicators
- Sufficient color contrast

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Minimal dependencies (vanilla JS)
- Optimized CSS
- Lazy loading ready
- Fast API responses

## Security

- JWT tokens stored in localStorage
- HTTPS ready
- Input validation on client-side
- CORS configured

## Future Enhancements

- [ ] Component-based architecture
- [ ] Build tool integration (Webpack/Vite)
- [ ] Advanced filtering
- [ ] Payment integration
- [ ] User dashboard
- [ ] Admin panel
- [ ] Real-time notifications
- [ ] Progressive Web App (PWA)

## Troubleshooting

### Can't connect to backend
- Ensure backend is running on port 3000
- Check API_BASE URL in script.js
- Verify CORS headers

### Forms not submitting
- Check browser console for errors
- Verify required fields are filled
- Check network tab in DevTools

### Styling issues
- Clear browser cache
- Check style.css is loaded
- Verify font files are loaded

## Contributing

1. Maintain vanilla JS (no frameworks)
2. Follow accessibility guidelines
3. Test on mobile devices
4. Update documentation

## License

MIT License - See LICENSE file

---

For backend documentation, see [backend/README.md](../backend/README.md)
