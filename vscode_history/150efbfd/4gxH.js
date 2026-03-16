
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Header() {
  const { user } = useContext(UserContext);

  return (
    <header style={{ padding: 15, background: "#222", color: "white" }}>
      <h1>Bienvenue {user.name}</h1>
    </header>
  );
}
