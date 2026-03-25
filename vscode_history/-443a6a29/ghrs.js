// src/screens/Dashboard.js
import { useContext } from "react";
import { EmailContext } from "../contexts/EmailContext";
import Header from "../components/Header";
import Card from "../components/Card";
import Footer from "../components/Footer";

export default function Dashboard() {
  const { email } = useContext(EmailContext);

  return (
    <>
      <Header />

      <div style={{ padding: 20 }}>
        <Card title="Informations utilisateur">
          <p>Email : {email}</p>
        </Card>

        <Card title="Statistiques">
          <p> Exemple de contenu…</p>
        </Card>
      </div>

      <Footer />
    </>
  );
}
