import { useState, useEffect } from "react";

export default function UseAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(sessionStorage.getItem("user"));
    setUser(u);
  }, []);

  return {
    user,
    isAdmin: user?.role === "admin",
  };
}