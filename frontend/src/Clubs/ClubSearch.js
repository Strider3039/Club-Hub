import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./ClubSearch.css";

function ClubSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

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
    </div>
  );
}

export default ClubSearch;
