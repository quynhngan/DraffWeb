import React from 'react';
import './Footer.scss';
import logo_footer from './assets/logo_footer.png';
function Footer() {
  return (
    <div className="footer-container">
      <img src={logo_footer} className="logo-footer" alt="logo" />
    </div>
  );
}
export default Footer;
