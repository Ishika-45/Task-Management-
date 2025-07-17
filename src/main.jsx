import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react'
import { shadesOfPurple } from '@clerk/themes';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const clerkAppearance = {
  baseTheme: shadesOfPurple,
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#1a202c',
    colorInputBackground: '#2D3748',
    colorInputText: '#F3F4F6',
  },
  elements: {
    formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
    card: 'bg-gray-800',
    headerTitle: 'text-blue-400',
    headerSubtitle: 'text-gray-400',
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} routing="path" signInUrl='/sign-in' signUpUrl='/sign-up' afterSignOutUrl='/' appearance={clerkAppearance}>
  <BrowserRouter>
  <App />  
  </BrowserRouter>
  </ClerkProvider>
);
