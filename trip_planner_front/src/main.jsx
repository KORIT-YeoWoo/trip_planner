
import React from 'react'
import ReactDOM from 'react-dom/client'
import MainPage from './pages/MainPage'
import { global } from './styles/global'
import { Global } from '@emotion/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Global styles={global} />
    <MainPage />
  </React.StrictMode>
)