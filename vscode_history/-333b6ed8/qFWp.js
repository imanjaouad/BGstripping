import React from "react";
import "./ProfileCard.css";

function ProfileCard({ name, username, email, street, gender, id }) {
  // Génère un avatar unique selon l'ID et le genre
  const avatarId = gender === "female" ? id + 50 : id; // IDs pour femmes +50 pour varier
  const avatarUrl = `https://i.pravatar.cc/150?img=${avatarId}`;

  return (
    <div className="profile-card">
      <img src={avatarUrl} alt={name} className="profile-image" />
      <h3>{name}</h3>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
      <p><strong>Street:</strong> {street}</p>
    </div>
  );
}

export default ProfileCard;
