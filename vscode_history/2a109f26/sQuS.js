import React from 'react';
import './FooterSection.js'; // Import the CSS file

function FooterSection() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h3>Etudia</h3>
          <p>&copy; {new Date().getFullYear()} Etudia. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <a href="#" className="social-icon">Facebook</a>
          <a href="#" className="social-icon">Twitter</a>
          <a href="#" className="social-icon">LinkedIn</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Made with ❤️ by Your Name</p>
      </div>
    </footer>
  );
}

export default FooterSection;