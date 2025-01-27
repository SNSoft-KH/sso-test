import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";


const App = () => {
  return (
    <Router>
      <div>
        <h1>React + NestJS SSO Example</h1>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
