import React, { useState } from "react";
import User from "./User";

export default function ListUser(props) {
  const [activeId, setActiveId] = useState(1);
  const users = props.utilisateurs;

  function handleChangeActiveId(id) {
    setActiveId(id);
  }

  return (
    <div className="App">
      {users.map((user) => {
        return (
          <User
            key={user.id}
            user={user}
            activeId={activeId}
            handleChangeActiveId={handleChangeActiveId}
          />
        );
      })}
    </div>
  );
}
