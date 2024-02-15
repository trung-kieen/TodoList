import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';

ReactDOM.render(
  <Router>

    <NextUIProvider>
      <App />
    </NextUIProvider>
  </Router>,
  document.getElementById('root')
);

registerServiceWorker();
