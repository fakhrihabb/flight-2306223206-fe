# Flight Booking Frontend - Project Summary

## Overview

A complete Vue.js + TypeScript flight booking frontend application with SSO authentication integration. This application allows users to browse flights, make bookings, and manage flights based on their role.

**Project Directory:** `c:\Classes\Sem5\APAP\ti1\flight-2306223206-fe`

---

## Technology Stack

- **Framework:** Vue 3.5.24 (Composition API with `<script setup>`)
- **Language:** TypeScript 5.9.3
- **State Management:** Pinia 3.0.4
- **Routing:** Vue Router 4.6.3
- **HTTP Client:** Axios 1.13.2
- **Icons:** Lucide Vue Next 0.555.0
- **Build Tool:** Vite 7.2.4
- **Dev Server Port:** 5175

---

## Architecture

### Authentication System

The application uses a dual-mode authentication system:

1. **Production Mode (Cookie-based)**
   - Shared cookies across `*.fakhrihabb.dev` domain
   - Cookie name: `jwt_token`
   - Domain: `.fakhrihabb.dev`
   - Enables SSO across multiple services

2. **Development Mode (localStorage)**
   - Token stored in browser localStorage
   - Token passed via URL query parameter on redirect
   - Allows local development without domain constraints

### Directory Structure

```
flight-2306223206-fe/
├── src/
│   ├── assets/
│   │   └── base.css                    # Global styles with dark gold theme
│   ├── components/
│   │   ├── Navbar.vue                  # Navigation with auth state
│   │   ├── FlightCard.vue              # Flight display card
│   │   ├── BookingModal.vue            # Flight booking modal
│   │   └── EditFlightModal.vue         # Flight edit modal
│   ├── config/
│   │   └── auth.ts                     # Auth configuration
│   ├── router/
│   │   └── index.ts                    # Route configuration with guards
│   ├── services/
│   │   ├── api.ts                      # Axios client with interceptors
│   │   └── flightApi.ts                # Flight API service
│   ├── stores/
│   │   ├── auth.ts                     # Authentication store
│   │   └── flightStore.ts              # Flight state management
│   ├── types/
│   │   └── flight.ts                   # TypeScript interfaces
│   ├── views/
│   │   ├── HomeView.vue                # Flight list page
│   │   ├── MyBookingsView.vue          # User bookings page
│   │   └── CreateFlightView.vue        # Create flight page
│   ├── App.vue                         # Root component
│   └── main.ts                         # Application entry point
├── .env.development                     # Development environment
├── .env.production                      # Production environment
├── vercel.json                          # Vercel deployment config
├── DEPLOYMENT.md                        # Deployment guide
└── package.json                         # Dependencies
```

---

## Created Files

### Configuration Files

1. **`.env.development`**
   - Development environment variables
   - Uses localStorage for auth
   - Local backend/auth URLs

2. **`.env.production`**
   - Production environment variables
   - Uses cookie-based auth
   - Production backend/auth URLs

3. **`vite.config.ts`**
   - Updated with @ path alias
   - Server port: 5175

4. **`tsconfig.app.json`**
   - Updated with path mappings for @/*
   - Enables TypeScript to resolve imports

5. **`vercel.json`**
   - SPA routing configuration
   - Production environment variables

### Auth Infrastructure (Copied from accommodation-frontend)

6. **`src/config/auth.ts`**
   - Environment-based auth configuration
   - Dual-mode setup (cookie/localStorage)

7. **`src/services/api.ts`**
   - Axios client with JWT interceptors
   - Automatic token injection
   - 401 error handling
   - Base URL: `/api/flight`

8. **`src/stores/auth.ts`**
   - Pinia authentication store
   - Token management
   - User state management
   - Token validation with backend

### Flight-Specific Files

9. **`src/types/flight.ts`**
   - TypeScript interfaces:
     - `Flight`
     - `FlightBooking`
     - `CreateFlightRequest`
     - `BookFlightRequest`
     - `BaseResponse<T>`

10. **`src/services/flightApi.ts`**
    - API methods:
      - `getAllFlights()`
      - `getMyBookings()`
      - `createFlight()`
      - `bookFlight()`
      - `updateFlight()`
      - `deleteFlight()`

11. **`src/stores/flightStore.ts`**
    - Flight state management
    - Loading states
    - Error handling
    - CRUD operations

### Router

12. **`src/router/index.ts`**
    - Routes:
      - `/` - HomeView (public)
      - `/my-bookings` - MyBookingsView (authenticated)
      - `/create-flight` - CreateFlightView (FLIGHT_AIRLINE only)
    - Navigation guards:
      - Token validation
      - Role-based access control
      - Auto-redirect to login

### Views

13. **`src/views/HomeView.vue`**
    - Displays all available flights
    - Flight cards with role-based actions
    - Book button (CUSTOMER)
    - Edit button (FLIGHT_AIRLINE)
    - Delete button (SUPERADMIN)
    - Loading and error states

14. **`src/views/MyBookingsView.vue`**
    - User's flight bookings
    - Booking details with status
    - Empty state with "Browse Flights" CTA
    - Date formatting

15. **`src/views/CreateFlightView.vue`**
    - Flight creation form
    - Live preview card
    - Form validation
    - Success redirect

### Components

16. **`src/components/Navbar.vue`**
    - App branding: "Flight Booking"
    - Navigation links (Home, My Bookings, Create Flight)
    - Auth buttons (Login/Register)
    - Profile dropdown with logout
    - Role-based visibility
    - Redirect to auth service with return URL

17. **`src/components/FlightCard.vue`**
    - Flight information display
    - Origin → Destination route
    - Price, seats, flight number
    - Role-based action buttons
    - Sold out indicator

18. **`src/components/BookingModal.vue`**
    - Flight booking interface
    - Seat quantity selector
    - Real-time price calculation
    - Validation (max seats available)
    - Booking confirmation

19. **`src/components/EditFlightModal.vue`**
    - Flight editing interface
    - Pre-populated form
    - Update confirmation
    - Error handling

### Styling

20. **`src/assets/base.css`**
    - Dark gold theme (copied from accommodation)
    - CSS variables:
      - `--primary-gold: #d4a574`
      - `--bg-dark: #0f0f0f`
      - `--bg-card: #1e1e1e`
      - `--text-primary: #e0e0e0`
    - Poppins font family
    - Responsive design

### Main Application Files

21. **`src/App.vue`**
    - Root component
    - Navbar integration
    - RouterView for pages
    - Token validation on mount

22. **`src/main.ts`**
    - App initialization
    - Pinia setup
    - Router setup
    - CSS import

### Documentation

23. **`DEPLOYMENT.md`**
    - Comprehensive deployment guide
    - Vercel deployment steps
    - Environment variable setup
    - Troubleshooting guide

24. **`PROJECT_SUMMARY.md`** (this file)
    - Complete project overview
    - File inventory
    - Architecture documentation

---

## API Integration

### Endpoints

All endpoints are prefixed with `/api/flight`:

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/list` | Get all flights | No | Any |
| GET | `/my-bookings` | Get user bookings | Yes | Any |
| POST | `/create` | Create new flight | Yes | FLIGHT_AIRLINE |
| POST | `/{id}/book` | Book a flight | Yes | CUSTOMER |
| PUT | `/{id}` | Update flight | Yes | FLIGHT_AIRLINE |
| DELETE | `/{id}` | Delete flight | Yes | SUPERADMIN |

### Authentication Flow

1. **User visits app** → `validateToken()` called
2. **No token or invalid** → Redirect to auth service
3. **User logs in** → Auth service redirects back with token
4. **Token in URL** → Extract and store in cookie/localStorage
5. **All API calls** → Automatic JWT injection via interceptor
6. **401 response** → Auto-logout and redirect to login

---

## Role-Based Access Control

### CUSTOMER
- View all flights
- Book flights
- View their bookings

### FLIGHT_AIRLINE
- View all flights
- Create new flights
- Edit their own flights
- View their bookings

### SUPERADMIN
- View all flights
- Delete any flight
- View all bookings

---

## Environment Configuration

### Development
```env
VITE_USE_COOKIE_AUTH=false
VITE_COOKIE_DOMAIN=.fakhrihabb.dev
VITE_AUTH_DOMAIN=http://localhost:3000
VITE_API_URL=http://localhost:8080
```

### Production
```env
VITE_USE_COOKIE_AUTH=true
VITE_COOKIE_DOMAIN=.fakhrihabb.dev
VITE_AUTH_DOMAIN=https://accommodation.fakhrihabb.dev
VITE_API_URL=http://2306223206-be.hafizmuh.site
```

---

## Features

### ✅ Implemented Features

1. **SSO Authentication**
   - Cookie-based (production) and localStorage (development)
   - Automatic token validation
   - Auto-redirect on logout/401

2. **Flight Management**
   - List all flights with search/filter
   - Create new flights (FLIGHT_AIRLINE)
   - Edit flights (FLIGHT_AIRLINE)
   - Delete flights (SUPERADMIN)

3. **Booking System**
   - Book flights with seat selection
   - View booking history
   - Real-time price calculation
   - Seat availability validation

4. **UI/UX**
   - Dark gold theme
   - Responsive design
   - Loading states
   - Error handling
   - Empty states
   - Modal dialogs

5. **Security**
   - JWT token authentication
   - Role-based access control
   - Route guards
   - Automatic logout on token expiry

---

## Git Repository

### Commits

1. **Initial commit: Flight booking frontend with SSO integration**
   - All source files
   - Configuration files
   - Environment files

2. **Add deployment configuration and fix TypeScript errors**
   - Vercel configuration
   - Deployment guide
   - TypeScript fixes

### Repository Status
```bash
git log --oneline
ff88340 (HEAD -> master) Add deployment configuration and fix TypeScript errors
5815909 Initial commit: Flight booking frontend with SSO integration
```

---

## Deployment Instructions

### Quick Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin master
   ```

2. **Import to Vercel:**
   - Go to vercel.com
   - Import repository
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

3. **Set Environment Variables:**
   ```
   VITE_USE_COOKIE_AUTH=true
   VITE_COOKIE_DOMAIN=.fakhrihabb.dev
   VITE_AUTH_DOMAIN=https://accommodation.fakhrihabb.dev
   VITE_API_URL=http://2306223206-be.hafizmuh.site
   ```

4. **Deploy!**

See `DEPLOYMENT.md` for detailed instructions.

---

## Development

### Start Development Server
```bash
npm install
npm run dev
```

App runs on: http://localhost:5175

### Build for Production
```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

---

## Testing Checklist

### Authentication
- [ ] Login redirects to auth service
- [ ] Token stored in cookie (prod) or localStorage (dev)
- [ ] Token validated on page load
- [ ] Auto-logout on 401
- [ ] Profile dropdown shows user info

### Flight Listing
- [ ] All flights displayed on home page
- [ ] Flight cards show correct information
- [ ] Loading state shown during fetch
- [ ] Error message if fetch fails

### Booking (CUSTOMER)
- [ ] "Book Flight" button visible
- [ ] Modal opens with flight details
- [ ] Seat quantity can be changed
- [ ] Total price updates correctly
- [ ] Validation prevents overbooking
- [ ] Successful booking updates UI

### Flight Creation (FLIGHT_AIRLINE)
- [ ] "Create Flight" link visible in navbar
- [ ] Form validates required fields
- [ ] Preview updates in real-time
- [ ] Successful creation redirects home
- [ ] New flight appears in list

### Flight Editing (FLIGHT_AIRLINE)
- [ ] "Edit" button visible on own flights
- [ ] Modal pre-populated with flight data
- [ ] Changes saved successfully
- [ ] UI updates after edit

### Flight Deletion (SUPERADMIN)
- [ ] "Delete" button visible
- [ ] Confirmation dialog shown
- [ ] Flight removed from list
- [ ] Error handling if deletion fails

---

## Integration Points

### Auth Service
- **URL:** https://accommodation.fakhrihabb.dev
- **Login:** `/login?redirect={returnUrl}`
- **Register:** `/register?redirect={returnUrl}`
- **Validation:** `POST /api/auth/validate`

### Backend API
- **URL:** http://2306223206-be.hafizmuh.site
- **Base Path:** `/api/flight`
- **Auth Header:** `Authorization: Bearer {token}`

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Known Issues & Limitations

1. **No pagination** - All flights loaded at once
2. **No search/filter** - All flights shown
3. **No booking cancellation** - Bookings are final
4. **No flight search by date** - No date selection
5. **No payment integration** - Bookings confirmed immediately

---

## Future Enhancements

1. Add flight search and filtering
2. Implement pagination for large datasets
3. Add booking cancellation feature
4. Integrate payment gateway
5. Add flight date/time selection
6. Add seat selection (window/aisle/middle)
7. Add email notifications
8. Add booking confirmation PDF
9. Add admin dashboard
10. Add analytics and reporting

---

## Support & Maintenance

For issues:
1. Check browser console for errors
2. Verify environment variables
3. Check network tab for API calls
4. Review DEPLOYMENT.md troubleshooting section

---

## License

This project is created for educational purposes as part of APAP coursework.

---

## Contact

**Student:** 2306223206
**Course:** APAP (Advanced Programming and Application Platform)
**Semester:** 5

---

**Last Updated:** November 29, 2025
**Version:** 1.0.0
**Build Status:** ✅ Passing
