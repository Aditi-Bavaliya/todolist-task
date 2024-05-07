
import { BrowserRouter } from 'react-router-dom';
import './App.css';

import React from 'react';
import Routers from './components/auth/route';
import { FirebaseProvider } from './components/auth/firebase';

function App() {
  return (
    <div className="App">
      <FirebaseProvider>
        <BrowserRouter>
          <Routers></Routers>
        </BrowserRouter>
      </FirebaseProvider>

    </div>
  );
}

export default App;
