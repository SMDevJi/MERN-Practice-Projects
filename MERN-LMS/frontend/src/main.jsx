import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from './redux/store.js';
import { Provider } from "react-redux";
import { add } from './redux/userSlice.js';

const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID

const token = localStorage.getItem('authorization');
if (token) {
  //console.log(token)
  store.dispatch(add(token));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
