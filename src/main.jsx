import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './slices'
import './i18n'

// Import Velzon Scss
import './assets/scss/themes.scss'
import './index.css'
import App from './App.jsx'

const store = configureStore({ reducer: rootReducer, devTools: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

