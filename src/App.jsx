import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Loader from "./components/Loader";
import RoutesList from "./routes/routes";
import { SocketProvider } from "./context/SocketContext"; // 🔌 Import Socket Provider
import "./App.css";

// Error Boundary to catch unexpected errors
const ErrorBoundary = ({ children }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SocketProvider> {/* 🔌 Wrap App with Socket Provider */}
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Router>
              <Routes>
                {RoutesList.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </Router>
          </Suspense>
        </ErrorBoundary>
      </SocketProvider>
    </Provider>
  );
};

export default App;
