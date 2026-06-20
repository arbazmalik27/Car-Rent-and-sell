// dataStore.js - Central data management using localStorage

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

// ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
export const getNotifications = () => JSON.parse(localStorage.getItem('notifications') || '[]');
export const addNotification = (notification) => {
  const notifs = getNotifications();
  const newNotif = {
    id: generateId('notif'),
    ...notification,
    time: new Date().toISOString(),
    read: false,
  };
  notifs.unshift(newNotif);
  localStorage.setItem('notifications', JSON.stringify(notifs));
  return newNotif;
};
export const markNotificationRead = (id) => {
  const notifs = getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem('notifications', JSON.stringify(notifs));
};
export const markAllNotificationsRead = () => {
  const notifs = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem('notifications', JSON.stringify(notifs));
};
export const clearNotifications = () => localStorage.setItem('notifications', JSON.stringify([]));

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export const getBookings = () => JSON.parse(localStorage.getItem('bookings') || '[]');
export const addBooking = (booking) => {
  const bookings = getBookings();
  const newBooking = {
    id: generateId('BK'),
    ...booking,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  // Add notification
  addNotification({ type: 'booking', icon: '📅', message: `New booking by ${booking.customerName} for ${booking.carName}`, category: 'Booking' });
  return newBooking;
};
export const updateBookingStatus = (id, status) => {
  const bookings = getBookings().map(b => b.id === id ? { ...b, status } : b);
  localStorage.setItem('bookings', JSON.stringify(bookings));
};
export const deleteBooking = (id) => {
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

// ─── SELL REQUESTS ───────────────────────────────────────────────────────────
export const getSellRequests = () => JSON.parse(localStorage.getItem('sellRequests') || '[]');
export const addSellRequest = (request) => {
  const requests = getSellRequests();
  const newReq = {
    id: generateId('SR'),
    ...request,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  requests.unshift(newReq);
  localStorage.setItem('sellRequests', JSON.stringify(requests));
  addNotification({ type: 'sell', icon: '🚗', message: `New sell request: ${request.year} ${request.brand} ${request.model} by ${request.sellerName}`, category: 'Sell Request' });
  return newReq;
};
export const updateSellRequestStatus = (id, status) => {
  const requests = getSellRequests().map(r => r.id === id ? { ...r, status } : r);
  localStorage.setItem('sellRequests', JSON.stringify(requests));
};

// ─── CONTACT QUERIES ─────────────────────────────────────────────────────────
export const getContactQueries = () => JSON.parse(localStorage.getItem('contactQueries') || '[]');
export const addContactQuery = (query) => {
  const queries = getContactQueries();
  const newQuery = {
    id: generateId('CQ'),
    ...query,
    createdAt: new Date().toISOString(),
    status: 'New',
  };
  queries.unshift(newQuery);
  localStorage.setItem('contactQueries', JSON.stringify(queries));
  addNotification({ type: 'contact', icon: '💬', message: `New contact inquiry from ${query.name}: "${query.subject}"`, category: 'Contact' });
  return newQuery;
};

// ─── USERS ───────────────────────────────────────────────────────────────────
export const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
export const updateUserStatus = (id, status) => {
  const users = getUsers().map(u => u.id === id ? { ...u, status } : u);
  localStorage.setItem('users', JSON.stringify(users));
};
export const deleteUser = (id) => {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem('users', JSON.stringify(users));
};
export const registerUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: generateId('u'),
    ...userData,
    role: 'customer',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  addNotification({ type: 'user', icon: '👤', message: `New user registered: ${userData.name}`, category: 'User' });
  return newUser;
};
export const getUserBookings = (userId) => getBookings().filter(b => b.userId === userId);

// ─── CARS ─────────────────────────────────────────────────────────────────────
export const getCars = () => JSON.parse(localStorage.getItem('adminCars') || 'null');
export const setCars = (cars) => localStorage.setItem('adminCars', JSON.stringify(cars));
export const addCar = (car) => {
  const cars = getCars() || [];
  const newCar = {
    id: generateId('car'),
    ...car,
    status: 'Available',
    featured: false,
    createdAt: new Date().toISOString(),
    rating: 4.5,
    reviewsCount: 0,
  };
  cars.unshift(newCar);
  setCars(cars);
  return newCar;
};
export const updateCar = (id, updates) => {
  const cars = (getCars() || []).map(c => c.id === id ? { ...c, ...updates } : c);
  setCars(cars);
};
export const deleteCar = (id) => {
  const cars = (getCars() || []).filter(c => c.id !== id);
  setCars(cars);
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export const getSettings = () => JSON.parse(localStorage.getItem('siteSettings') || JSON.stringify({
  websiteName: 'Imperial Wheels',
  contactEmail: 'support@imperialwheels.com',
  phone: '+91-75127-16271',
  address: 'Nanda ki chowki, Prem-Nagar, Dehradun, Uttarakhand 248007',
  facebook: '#',
  twitter: '#',
  instagram: '#',
  linkedin: '#',
  tagline: 'Luxury Car Rental & Marketplace',
}));
export const saveSettings = (settings) => localStorage.setItem('siteSettings', JSON.stringify(settings));

// ─── ANALYTICS DATA (mock time-series) ───────────────────────────────────────
export const getAnalyticsData = () => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return {
    revenue: months.map((m, i) => ({ month: m, revenue: Math.floor(Math.random() * 500000 + 200000 + i * 30000) })),
    bookings: months.map((m, i) => ({ month: m, bookings: Math.floor(Math.random() * 50 + 20 + i * 3) })),
    users: months.map((m, i) => ({ month: m, users: Math.floor(Math.random() * 30 + 10 + i * 5) })),
    categories: [
      { name: 'Sports', value: 35 },
      { name: 'SUV', value: 25 },
      { name: 'Electric', value: 20 },
      { name: 'Luxury', value: 15 },
      { name: 'Convertible', value: 5 },
    ],
  };
};

// ─── SEED INITIAL DATA ────────────────────────────────────────────────────────
export const seedInitialData = () => {
  if (!localStorage.getItem('bookingsSeeded')) {
    const sampleBookings = [
      { id: 'BK-001', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', phone: '+91-87654-32109', carName: 'Porsche 911 Carrera S', carId: 'r1', pickupDate: '2026-06-20', returnDate: '2026-06-25', totalPrice: 302500, status: 'Pending', userId: 'u003', pickupLocation: 'Mumbai Airport', createdAt: '2026-06-14T10:00:00Z' },
      { id: 'BK-002', customerName: 'Rahul Verma', customerEmail: 'rahul@example.com', phone: '+91-76543-21098', carName: 'Tesla Model S Plaid', carId: 'r2', pickupDate: '2026-06-18', returnDate: '2026-06-21', totalPrice: 103680, status: 'Approved', userId: 'u004', pickupLocation: 'Delhi Hub', createdAt: '2026-06-13T14:30:00Z' },
      { id: 'BK-003', customerName: 'Anjali Mehta', customerEmail: 'anjali@example.com', phone: '+91-65432-10987', carName: 'BMW M4 Competition', carId: 'r3', pickupDate: '2026-06-15', returnDate: '2026-06-17', totalPrice: 82080, status: 'Active', userId: 'u005', pickupLocation: 'Bangalore City', createdAt: '2026-06-12T09:15:00Z' },
      { id: 'BK-004', customerName: 'Karan Singh', customerEmail: 'karan@example.com', phone: '+91-54321-09876', carName: 'Mercedes-AMG GT Roadster', carId: 'r4', pickupDate: '2026-06-10', returnDate: '2026-06-12', totalPrice: 140400, status: 'Completed', userId: 'u006', pickupLocation: 'Pune Station', createdAt: '2026-06-09T16:45:00Z' },
      { id: 'BK-005', customerName: 'Sneha Patel', customerEmail: 'sneha@example.com', phone: '+91-43210-98765', carName: 'Lamborghini Huracan Evo', carId: 'r5', pickupDate: '2026-06-25', returnDate: '2026-06-28', totalPrice: 291600, status: 'Pending', userId: 'u007', pickupLocation: 'Chennai Airport', createdAt: '2026-06-14T08:30:00Z' },
    ];
    localStorage.setItem('bookings', JSON.stringify(sampleBookings));

    const sampleSellRequests = [
      { id: 'SR-001', sellerName: 'Vikram Nair', sellerEmail: 'vikram@example.com', sellerPhone: '+91-99887-76655', brand: 'BMW', model: '3 Series M Sport', year: '2021', mileage: '24000', price: '4800000', condition: 'Excellent', status: 'Pending', createdAt: '2026-06-13T11:00:00Z' },
      { id: 'SR-002', sellerName: 'Pooja Gupta', sellerEmail: 'pooja@example.com', sellerPhone: '+91-88776-65544', brand: 'Audi', model: 'A5 Sportback', year: '2020', mileage: '38000', price: '4200000', condition: 'Very Good', status: 'Approved', createdAt: '2026-06-10T15:30:00Z' },
    ];
    localStorage.setItem('sellRequests', JSON.stringify(sampleSellRequests));

    const sampleNotifs = [
      { id: 'notif-1', type: 'booking', icon: '📅', message: 'New booking by Priya Sharma for Porsche 911 Carrera S', category: 'Booking', time: '2026-06-14T10:00:00Z', read: false },
      { id: 'notif-2', type: 'sell', icon: '🚗', message: 'New sell request: 2021 BMW 3 Series M Sport by Vikram Nair', category: 'Sell Request', time: '2026-06-13T11:00:00Z', read: false },
      { id: 'notif-3', type: 'contact', icon: '💬', message: 'New contact inquiry from Anjali: "Test Drive Request"', category: 'Contact', time: '2026-06-12T09:15:00Z', read: true },
      { id: 'notif-4', type: 'booking', icon: '📅', message: 'New booking by Sneha Patel for Lamborghini Huracan Evo', category: 'Booking', time: '2026-06-14T08:30:00Z', read: false },
    ];
    localStorage.setItem('notifications', JSON.stringify(sampleNotifs));
    localStorage.setItem('bookingsSeeded', 'true');
  }
};
