import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./App.css"; // Custom styles
// import './styles.css';

function App() {
  return (
    <Router>
      <div className="App fade-in">
        <nav className="navbar">
          <div className="container-fluid">
          <img src="/images/Logo.png" alt="Logo" className="LogoImg"/>

            {/* Navbar Toggler Checkbox */}
            <input type="checkbox" id="nav-toggle" className="nav-toggle" />

            {/* Toggler Icon */}
            <label htmlFor="nav-toggle" className="nav-toggler">
              <span></span>
              <span></span>
              <span></span>
            </label>

            {/* Navbar Links */}
            <ul className="nav-menu">
              <li className="nav-item button">
                <Link
                  className="nav-link"
                  to="/"
                  onClick={() =>
                    (document.getElementById("nav-toggle").checked = false)
                  }
                >
                  Home
                </Link>
              </li>
              <li className="nav-item button">
                <Link
                  className="nav-link"
                  to="/add"
                  onClick={() =>
                    (document.getElementById("nav-toggle").checked = false)
                  }
                >
                  Add Expense
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<ExpenseList />} />
            <Route path="/add" element={<ExpenseForm />} />
            <Route path="/edit/:id" element={<ExpenseForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
