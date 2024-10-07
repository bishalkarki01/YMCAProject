import React from 'react';
import '../index.css';

const footerData = [
  {
    title: 'Services',
    links: [
      { text: 'Jobs', url: 'https://example.com/1' },
      { text: 'Volunteer', url: 'https://example.com/2' },
      { text: 'Request', url: 'https://example.com/3' },
    ],
  },
  {
    title: 'Feedback',
    links: [
      { text: 'Programs', url: 'https://example.com/4' },
      { text: 'Memberships', url: 'https://example.com/5' },
      { text: 'Events', url: 'https://example.com/6' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { text: 'Facebook', url: 'https://example.com/7' },
      { text: 'Instagram', url: 'https://example.com/8' },
      { text: 'Youtube', url: 'https://example.com/9' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {footerData.map((column, index) => (
          <div key={index} className="footer-column">
            <h3 className="footer-title">{column.title}</h3>
            <ul className="footer-list">
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a href={link.url} className="footer-link" target="_blank" rel="noopener noreferrer">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
};
