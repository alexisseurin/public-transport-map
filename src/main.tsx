import './newPositionsClient';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import LazyApp from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyApp />
      </Suspense>
    </Router>
  </React.StrictMode>,
);
