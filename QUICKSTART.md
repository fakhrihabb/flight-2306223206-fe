# Flight Booking Frontend - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd "c:\Classes\Sem5\APAP\ti1\flight-2306223206-fe"
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:5175

### 3. Build for Production
```bash
npm run build
```

Output in `dist/` folder

---

## 📁 Project Structure

```
flight-2306223206-fe/
├── src/
│   ├── assets/         # Styles
│   ├── components/     # Reusable components
│   ├── config/         # Configuration files
│   ├── router/         # Vue Router
│   ├── services/       # API services
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript types
│   └── views/          # Page components
├── .env.development    # Dev environment
├── .env.production     # Prod environment
└── vercel.json         # Deployment config
```

---

## 🔑 Key Files

### Authentication
- `src/config/auth.ts` - Auth configuration
- `src/stores/auth.ts` - Auth state management
- `src/services/api.ts` - API client with JWT

### Flight Features
- `src/types/flight.ts` - Type definitions
- `src/services/flightApi.ts` - API calls
- `src/stores/flightStore.ts` - Flight state

### Pages
- `src/views/HomeView.vue` - Flight list
- `src/views/MyBookingsView.vue` - User bookings
- `src/views/CreateFlightView.vue` - Create flight

### Components
- `src/components/Navbar.vue` - Navigation
- `src/components/FlightCard.vue` - Flight display
- `src/components/BookingModal.vue` - Booking UI
- `src/components/EditFlightModal.vue` - Edit UI

---

## 🌐 API Integration

**Backend:** http://2306223206-be.hafizmuh.site/api/flight

**Endpoints:**
- `GET /list` - Get all flights
- `GET /my-bookings` - Get user bookings
- `POST /create` - Create flight (FLIGHT_AIRLINE)
- `POST /{id}/book` - Book flight (CUSTOMER)
- `PUT /{id}` - Update flight (FLIGHT_AIRLINE)
- `DELETE /{id}` - Delete flight (SUPERADMIN)

---

## 🔐 Authentication Flow

1. User visits app
2. No token → Redirect to https://accommodation.fakhrihabb.dev/login
3. User logs in
4. Redirect back with token
5. Token stored (cookie in prod, localStorage in dev)
6. All API calls include JWT automatically

---

## 👥 User Roles

### CUSTOMER
- ✅ View flights
- ✅ Book flights
- ✅ View bookings

### FLIGHT_AIRLINE
- ✅ View flights
- ✅ Create flights
- ✅ Edit own flights
- ✅ View bookings

### SUPERADMIN
- ✅ View flights
- ✅ Delete flights
- ✅ View all data

---

## 🎨 Theme

**Dark Gold Design**
- Primary: #d4a574 (Gold)
- Background: #0f0f0f (Dark)
- Cards: #1e1e1e
- Text: #e0e0e0

---

## 🚢 Deploy to Vercel

### Quick Deploy

1. **Push to GitHub:**
   ```bash
   git remote add origin <your-repo>
   git push -u origin master
   ```

2. **Import to Vercel:**
   - Go to vercel.com
   - Import repository
   - Framework: **Vite**
   - Deploy!

3. **Set Environment Variables:**
   ```
   VITE_USE_COOKIE_AUTH=true
   VITE_COOKIE_DOMAIN=.fakhrihabb.dev
   VITE_AUTH_DOMAIN=https://accommodation.fakhrihabb.dev
   VITE_API_URL=http://2306223206-be.hafizmuh.site
   ```

See `DEPLOYMENT.md` for detailed instructions.

---

## 📋 Testing Checklist

- [ ] Install: `npm install`
- [ ] Dev server: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Login flow works
- [ ] View flights
- [ ] Book a flight (as CUSTOMER)
- [ ] Create flight (as FLIGHT_AIRLINE)
- [ ] Edit flight (as FLIGHT_AIRLINE)
- [ ] Delete flight (as SUPERADMIN)
- [ ] View bookings
- [ ] Logout works

---

## 🐛 Troubleshooting

**Build fails?**
```bash
npm install
npm run build
```

**Auth not working?**
- Check environment variables
- Verify cookie domain
- Check browser console

**API errors?**
- Check backend is running
- Verify API URL
- Check network tab

**Need help?**
- See `DEPLOYMENT.md` for detailed guide
- See `PROJECT_SUMMARY.md` for full documentation

---

## 📚 Documentation

- **QUICKSTART.md** (this file) - Get started fast
- **DEPLOYMENT.md** - Full deployment guide
- **PROJECT_SUMMARY.md** - Complete documentation
- **README.md** - Project overview

---

## ✅ Done!

Your flight booking frontend is ready to use!

**Local:** http://localhost:5175
**Deploy:** Push to GitHub → Import to Vercel → Done!

---

**Questions?** Check the full documentation in `PROJECT_SUMMARY.md`
