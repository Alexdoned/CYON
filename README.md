# CYON Jalingo Diocese Registration System

A modern, responsive web application for managing registrations and payments for the Catholic Youth Organization of Nigeria (CYON) - Jalingo Diocese.

## Features

- 📝 Online registration form with validation
- 💳 Secure payment processing
- 👨‍💼 Admin dashboard for managing registrations
- 📱 Fully responsive design (mobile-friendly)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast performance with Vite

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cyon-jalingo-registration.git
cd cyon-jalingo-registration
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. Start development server
```bash
npm run dev
```

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the configuration

2. **Environment Variables**
   - In Vercel dashboard, add environment variable:
   - `VITE_API_URL`: Your deployed backend API URL

3. **Deploy**
   - Vercel will build and deploy automatically on every push to main branch

### Manual Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── assets/        # Static assets
├── utils/         # Utility functions
└── main.jsx       # App entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the CYON Jalingo Diocese registration system.
