import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { Suspense } from "react";
const App = () => {
  return (
    <Router>
      <div>
        <h1>React + NestJS SSO Example</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
