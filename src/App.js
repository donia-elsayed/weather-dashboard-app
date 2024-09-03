import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import WeatherDashboard from "./components/WeatherDashboard";
import UserProfile from "./components/UserProfile";
import SearchHistory from "./components/SearchHistory";

class App extends React.Component {
  state = {
    recentSearches: [],
  };

  saveRecentSearch = (city) => {
    this.setState((prevState) => {
      const recentSearches = [
        city,
        ...prevState.recentSearches.filter((search) => search !== city),
      ].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
      return { recentSearches };
    });
  };
  render() {
    return (
      <div>
        <nav className="bg-sky-400 text-white p-4">
          <ul className="container flex justify-evenly gap-6">
            <li className="font-semibold">
              <Link to="/">Weather Dashboard</Link>
            </li>
            <li className="font-semibold">
              <Link to="/profile">User Profile</Link>
            </li>
            <li className="font-semibold">
              <Link to="/history">Search History</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <WeatherDashboard saveRecentSearch={this.saveRecentSearch} />
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="/history"
            element={<SearchHistory searches={this.state.recentSearches} />}
          />
        </Routes>
      </div>
    );
  }
}

export default App;
