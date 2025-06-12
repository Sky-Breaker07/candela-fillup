# FILLUP React Native Project Structure

## Overview
FILLUP is a React Native mobile application for finding and locating fuel stations. The application uses React Navigation for routing, Redux Toolkit for state management, and NativeWind (TailwindCSS) for styling. The app integrates with Firebase for authentication and data storage, and uses Google Maps API for location-based services.

## Project Structure

```
FILLUP/
├── assets/                      # Static assets
│   ├── images/                  # Image assets
│   │   ├── address_amico_1.png
│   │   ├── ellipse_4.png
│   │   ├── no_connection_bro_3.png
│   │   ├── onboarding_one.png
│   │   ├── onboarding_three.png
│   │   └── onboarding_two.png
│   ├── adaptive_icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash_icon.png
│
├── src/                         # Source code
│   ├── components/              # Reusable UI components
│   │   ├── BottomNav/          # Bottom navigation components
│   │   ├── Button/             # Button components
│   │   ├── container/          # Container components
│   │   ├── ErrorBoundary/      # Error handling components
│   │   ├── FuelStation/        # Fuel station related components
│   │   └── OTPInput.tsx        # OTP input component
│   │
│   ├── firebase/               # Firebase configuration and services
│   │   ├── config.ts           # Firebase initialization and configuration
│   │   └── index.ts            # Firebase auth and Firestore services
│   │
│   ├── hooks/                  # Custom React hooks
│   │
│   ├── navigation/             # Navigation configuration
│   │   ├── AuthenticationNavigator.tsx  # Authentication routes
│   │   ├── index.tsx           # Main navigation setup
│   │   ├── OnboardingNavigator.tsx      # Onboarding routes
│   │   ├── PrivateNavigator.tsx         # Private/authenticated routes
│   │   ├── PublicNavigator.tsx          # Public routes
│   │   └── types.ts            # Navigation type definitions
│   │
│   ├── screens/                # Application screens
│   │   ├── Authentication/     # Authentication screens
│   │   ├── Onboarding/         # Onboarding screens
│   │   ├── DashboardScreen.tsx # Main dashboard screen
│   │   └── LoginScreen.tsx     # Login screen
│   │
│   ├── types/                  # TypeScript type definitions
│   │
│   └── utils/                  # Utility functions and helpers
│       ├── authService.ts      # Authentication service functions
│       ├── firebaseErrorHandler.ts # Firebase error handling
│       ├── mapService.ts       # Google Maps API integration
│       └── useMapFuelStations.ts # Custom hook for fuel station data
│
├── store/                      # Redux store configuration
│   ├── slices/                 # Redux slices
│   │   └── authSlice.ts        # Authentication state management
│   └── index.ts                # Store configuration
│
├── App.tsx                     # Main application component
├── app.json                    # Application configuration
├── babel.config.js             # Babel configuration
├── eas.json                    # Expo Application Services configuration
├── global.css                  # Global CSS styles
├── index.ts                    # Application entry point
├── locationList.ts             # List of locations data
├── metro.config.js             # Metro bundler configuration
├── nativewind-env.d.ts         # NativeWind type definitions
├── package.json                # Project dependencies and scripts
├── react-native.config.js      # React Native configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Application Flow and Component Interactions

### Entry Point and Initialization
1. **index.ts** - The entry point that registers the main App component with React Native's AppRegistry.
2. **App.tsx** - The root component that:
   - Sets up the Redux Provider to make the store available throughout the app
   - Configures the NavigationContainer for React Navigation
   - Implements ErrorBoundary for error handling
   - Includes FirebaseAuthStateListener to monitor authentication state

### Authentication Flow
1. **Firebase Integration**:
   - **src/firebase/config.ts** initializes Firebase with the app configuration
   - **src/firebase/index.ts** provides authentication and Firestore services

2. **Authentication Services**:
   - **src/utils/authService.ts** handles user authentication operations (login, register, logout)
   - Interacts with Firebase authentication and stores tokens in AsyncStorage

3. **State Management**:
   - **store/slices/authSlice.ts** manages authentication state using Redux Toolkit
   - Provides actions for login, logout, registration, and checking auth status
   - The auth state determines which navigation stack is displayed

### Navigation Structure
1. **src/navigation/index.tsx** - Root navigator that:
   - Checks authentication and onboarding state from Redux
   - Renders the appropriate navigator based on user state:
     - OnboardingNavigator for new users
     - AuthenticationNavigator for unauthenticated but onboarded users
     - PrivateNavigator for authenticated users

2. **Navigation Stacks**:
   - **OnboardingNavigator.tsx** - Handles first-time user onboarding flow
   - **AuthenticationNavigator.tsx** - Manages login, signup, and password recovery screens
   - **PrivateNavigator.tsx** - Contains authenticated user screens like the Dashboard
   - **PublicNavigator.tsx** - Public screens accessible without authentication

3. **Navigation Types**:
   - **types.ts** - Defines TypeScript types for all navigation parameters

### Main Functionality (Fuel Station Finder)
1. **Dashboard Screen**:
   - **src/screens/DashboardScreen.tsx** is the main screen for authenticated users
   - Displays a map view or list view of nearby fuel stations
   - Includes search, filtering, and sorting functionality

2. **Location and Map Services**:
   - **src/utils/mapService.ts** handles:
     - Location permission requests
     - Getting the user's current location
     - Fetching nearby fuel stations from Google Maps API
     - Distance calculations

3. **Custom Hooks**:
   - **src/utils/useMapFuelStations.ts** provides:
     - State management for fuel stations data
     - Loading and error states
     - Sorting and filtering functions
     - Search functionality

### Component Structure
1. **UI Components**:
   - **src/components/FuelStation/** - Components for displaying fuel station information
   - **src/components/BottomNav/** - Bottom navigation bar components
   - **src/components/Button/** - Reusable button components
   - **src/components/container/** - Layout container components
   - **src/components/ErrorBoundary/** - Error handling components
   - **OTPInput.tsx** - Component for OTP verification during authentication

2. **Styling**:
   - **global.css** - Global styles using NativeWind/TailwindCSS
   - **tailwind.config.js** - TailwindCSS configuration

## Data Flow
1. **Authentication Data Flow**:
   - User credentials → authService.ts → Firebase Auth → Redux Store → Navigation
   - Auth state changes in Firebase trigger updates to the Redux store

2. **Fuel Station Data Flow**:
   - User location → mapService.ts → Google Maps API → useMapFuelStations hook → Dashboard UI
   - Location updates trigger new API requests for nearby stations

## Key Technologies

- **React Native**: Cross-platform mobile framework
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **React Navigation**: Navigation library
- **NativeWind**: TailwindCSS for React Native
- **Firebase**: Authentication and Firestore database
- **Google Maps API**: Location and fuel station data
- **React Hook Form**: Form handling
- **React Native Maps**: Maps integration
- **Axios**: HTTP client
- **AsyncStorage**: Local data persistence

## Scripts

- `npm start`: Start the Metro bundler
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS simulator
- `npm run clean`: Clean the project
- `npm run reset-cache`: Reset Metro bundler cache 