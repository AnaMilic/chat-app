import React, { forwardRef } from "react";
import SearchUsers from "./SearchUsers";

const SearchModal = (
  { setSearchModalVisible, value, search, onChange, users },
  ref
) => {
  console.log(users);

  function createNewChat(user) {}
  return (
    <div className="searchModal" ref={ref}>
      <span
        className="closeSearchModal"
        onClick={() => {
          setSearchModalVisible(false);
        }}
      >
        X
      </span>
      <SearchUsers
        value={value}
        search={search}
        onChange={onChange}
      ></SearchUsers>
      {users.map((u) => {
        return (
          <div
            className="searchedUserField"
            key={u._id}
            onClick={() => {
              createNewChat(u);
            }}
          >
            name: {u.username}
          </div>
        );
      })}
    </div>
  );
};

export default forwardRef(SearchModal);
