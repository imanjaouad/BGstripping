import UserProvider from "./contexts/UserContext";
import EmailProvider from "./contexts/EmailContext";
import Dashboard from "./screens/Dashboard";

export default function App() {
  return (
    <UserProvider>
      <EmailProvider>
        <Dashboard />
      </EmailProvider>
    </UserProvider>
  );
}
