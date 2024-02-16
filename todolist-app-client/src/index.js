import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Routes, Router, Route } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';

ReactDOM.render(
  <Router>
    <NextUIProvider>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            // <Route path='/' element={<App />} />
            <App />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </NextUIProvider>
  </Router>,
  document.getElementById('root')
);

registerServiceWorker();
