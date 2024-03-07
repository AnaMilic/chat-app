import React from "react";

const SearchUsers = ({ value, search, onChange }) => {
  return (
    <div className="searchContacts">
      <input
        type="text"
        name="search"
        id="search"
        placeholder="search users"
        value={value}
        onChange={onChange}
      />
      <button className="searchBtn" onClick={search}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
};

export default SearchUsers;
