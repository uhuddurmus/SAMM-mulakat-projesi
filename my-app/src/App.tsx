import React from "react";
import logo from "./siteadi_og.png";
import MyMap from "./MyMap/MyMap";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Map from "./Map/Map";
function Header() {
  return (
    <header className="bg-secondary text-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-2">
            <img
              src={logo}
              alt="Logo"
              className=""
              style={{ maxHeight: "10vh" }}
            />
          </div>
          <div className="col-md-6">
            <h1 className="mb-0 h3">SAMM mülakat projesi</h1>
          </div>
          <div className="col-md-3">
            <nav className="float-end">
              <ul className="list-unstyled d-flex my-auto">
              <li className="me-3">
                  <a
                    href="/Map"
                    className="text-light text-decoration-none"
                  >
                    Map
                  </a>
                </li>
              <li className="me-3">
                  <a
                    href="/MyMap"
                    className="text-light text-decoration-none"
                  >
                    MyMap
                  </a>
                </li>
                <li className="me-3">
                  <a
                    href="https://github.com/uhuddurmus"
                    className="text-light text-decoration-none"
                  >
                    Github
                  </a>
                </li>
                <li className="me-3">
                  <a
                    href="https://www.samm.com/"
                    className="text-light text-decoration-none"
                  >
                    Samm
                  </a>
                </li>
                <li className="me-3">
                  <a
                    href="mailto:uhuddurmus@gmail.com"
                    className="text-light text-decoration-none"
                  >
                    Mail
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="text-secondary py-4">
      <hr />
      <div className="container d-flex ">
        <p className="mb-0 ">Created by Mustafa Uhud Durmuş</p>
      </div>
    </footer>
  );
}
function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1">
        <div className="container">
          <Router>
            <Routes>
              <Route path="/MyMap" element={<MyMap />} />
              <Route path="/Map" element={<Map />} />
              <Route path="*" element={<Navigate to="/Map" />} />
            </Routes>
          </Router>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
