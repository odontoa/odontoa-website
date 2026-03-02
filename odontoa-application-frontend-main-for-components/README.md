# Odontoa - Dental Practice Management System

A modern, comprehensive dental practice management application built with React, TypeScript, and Vite. This application helps dental professionals manage patients, appointments, treatments, and clinical assessments with an intuitive and professional interface.

## 🦷 Features

### Core Functionality
- **Patient Management**: Complete patient records with dental history and treatment plans
- **Appointment Scheduling**: Interactive calendar with multi-doctor support and real-time updates
- **Clinical Assessments**: Comprehensive orthodontic and dental evaluations with detailed forms
- **Treatment Planning**: Therapy records and treatment history tracking with progress monitoring
- **Staff Management**: Dentist and staff member administration with role-based access

### Clinical Tools
- **Interactive Odontogram**: Visual dental chart for tooth condition mapping with color coding
- **Cephalometric Analysis**: X-ray image analysis and measurements for orthodontic planning
- **Study Model Analysis**: 3D model assessment tools for treatment planning
- **Photo Management**: Clinical photography organization and storage
- **Lundstrom Table**: Orthodontic measurement tracking and analysis
- **Clinical Assessment Forms**: Comprehensive evaluation forms for patient assessment

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.7 + shadcn/ui components
- **State Management**: Zustand + TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM 7.6.0
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React + React Icons
- **Date Handling**: date-fns + date-fns-tz
- **HTTP Client**: Axios
- **Notifications**: Sonner toast notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dental-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=your_api_base_url
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── api/                 # API configuration and axios setup
├── auth/               # Authentication provider and hooks
├── components/         # Reusable UI components
│   ├── appointments/   # Appointment-related components
│   ├── patients/       # Patient management components
│   │   ├── dental/     # Dental-specific components (odontogram)
│   │   └── ortho/      # Orthodontic components
│   ├── staff/          # Staff management components
│   ├── modal/          # Modal components for forms
│   └── ui/             # Base UI components (shadcn/ui)
├── hooks/              # Custom React hooks for data fetching
├── layouts/            # Layout components and route protection
├── lib/                # Utilities, constants, and schemas
├── pages/              # Page components
├── routes/             # Routing configuration
└── types/              # TypeScript type definitions
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production with TypeScript compilation
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally
- `npm run build:css` - Build Tailwind CSS with watch mode

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_base_url
```

### API Configuration
The application uses Axios for API calls. Configure your API endpoints in `src/api/axios.ts`.

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configuration in `tailwind.config.js`.

## 📱 Key Components

### Authentication System
- Protected routes with `AuthProvider`
- Login/logout functionality
- Role-based access control
- Session management

### Patient Management
- Patient registration and profile management
- Dental history tracking with detailed records
- Treatment plan creation and monitoring
- Clinical assessment forms

### Appointment System
- Interactive calendar interface with drag-and-drop
- Multi-doctor scheduling capabilities
- Appointment status tracking (scheduled, confirmed, completed, canceled)
- Real-time updates and notifications

### Clinical Tools
- **Interactive Odontogram**: Click-based tooth mapping with condition tracking
- **Cephalometric Analysis**: X-ray measurements and analysis tools
- **Study Model Assessment**: 3D model evaluation and documentation
- **Clinical Photography**: Photo upload and organization system
- **Treatment History**: Comprehensive treatment timeline

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Interface**: Clean, professional dental practice aesthetic
- **Interactive Elements**: Smooth animations and transitions
- **Toast Notifications**: User-friendly feedback system

## 🔒 Security Features

- Protected routes and authentication middleware
- Form validation with Zod schemas
- Secure API communication with proper headers
- Input sanitization and XSS protection
- Role-based access control

## 🧪 Development

### Code Style & Quality
- ESLint configuration for code quality and consistency
- TypeScript for type safety and better developer experience
- Prettier for code formatting (recommended)
- Component-based architecture with proper separation of concerns

### Testing Recommendations
- Unit testing for components and utilities
- Integration testing for API calls
- End-to-end testing for critical user flows
- User acceptance testing for clinical workflows

## 📚 API Integration

The application integrates with a backend API. Key endpoints include:

- `/patients` - Patient CRUD operations
- `/appointments` - Appointment management
- `/dentists` - Staff management
- `/clinical-assessments` - Clinical data and evaluations
- `/ortho-cards` - Orthodontic treatment records
- `/therapy-records` - Treatment history and plans

## 🚀 Deployment

### Docker Deployment
```bash
# Build the Docker image
docker build -t odontoa-app .

# Run the container
docker run -p 80:80 odontoa-app
```

### Static Hosting
```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting provider
# (Netlify, Vercel, AWS S3, etc.)
```

### Environment Setup for Production
```env
VITE_API_BASE_URL=https://your-production-api.com
```

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Add comprehensive comments for complex logic
- Write meaningful commit messages

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` folder
- Review the user manual for feature-specific help

## 📈 Version History

- **v1.0.0** - Initial release with core patient and appointment management

## 🎯 Roadmap

- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] Multi-location support
- [ ] Advanced billing and insurance integration

## 📖 Documentation

For detailed documentation, see the following files:
- [API Documentation](docs/API.md) - API endpoints and integration
- [Development Guide](docs/DEVELOPMENT.md) - Development setup and guidelines
- [User Manual](docs/USER_MANUAL.md) - End-user documentation
- [Changelog](CHANGELOG.md) - Version history and updates

---

**Built with ❤️ for dental professionals worldwide**

*Empowering dental practices with modern, efficient, and user-friendly management tools.*
