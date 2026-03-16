import React from "react";
import "./ProfileCard.css";

function ProfileCard({ name, username, email, street, id ,phone}) {
  return (
    <div className="profile-card">
      <img
        src={`https://i.pravatar.cc/150?img=${id}`}
        alt={name}
        className="profile-image"
      />
      <h3>{name}</h3>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Street:</strong> {street}</p>
      <p><strong>Phone:</strong> {phone}</p>

    </div>
  );
}

export default ProfileCard;
