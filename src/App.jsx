import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Loader from './components/Loader';
import RoutesList from './routes/routes';
import './App.css';

// Create the router using imported routes
const App = () => {
  return (
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <Router>
          <Routes>
            {RoutesList.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Router>
      </Suspense>
    </Provider>
  );
};

export default App;
