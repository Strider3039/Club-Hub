import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./ClubSearch.css";
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";


function ClubSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleRegister = (e) => {
    navigate("/clubRegister");
  }

  return (
    <div className="clubs-page">
      <NavBar page="ClubSearch" />
      <div className="clubs-container">
        {/* Sidebar for filtering */}
        <div className="sidebar">
          <h3>Filter by Genre</h3>
          <select onChange={handleGenreChange} value={selectedGenre}>
            <option value="">All Genres</option>
            <option value="sports">Sports</option>
            <option value="music">Music</option>
            <option value="tech">Tech</option>
            <option value="arts">Arts</option>
          </select>
        </div>
        {/*________*/}
        {/*|       |*/}
        {/*|       |*/}
        {/*|_______|*/}

        {/* Main content area */}
        <div className="clubs-content">
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="clubs-list">
            {/* ClubSearch list will be dynamically rendered here */}
            <p>Showing results for "{searchTerm}" in "{selectedGenre || 'All'}" category</p>
          </div>
        </div>
      </div>
      <Button
          className={""}
          onClick={(e) => handleRegister()}
      >
        Create Club
      </Button>
    </div>
  );
}

export default ClubSearch;
