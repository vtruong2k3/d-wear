

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { configAxios } from './configs/AxiosConfig.tsx'
import 'antd/dist/reset.css';

import { GoogleOAuthProvider } from "@react-oauth/google";
configAxios();
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
