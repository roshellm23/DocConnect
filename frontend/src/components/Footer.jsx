import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div style={{ maxWidth: '340px' }}>
            <div className="brand-logo" style={{ marginBottom: '0.75rem' }}>
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="#0284C7"/>
                <path d="M24 14V34M14 24H34" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: '1.15rem' }}>DocConnect</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
              A robust, modern healthcare appointment management platform built with React, Express, and PostgreSQL.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-400)', marginBottom: '0.75rem' }}>
              DevOps Architecture Pipeline
            </h4>
            <div className="pipeline-pills">
              <span className="pipeline-pill active">Person 1: App + Git</span>
              <span>→</span>
              <span className="pipeline-pill">Person 2: Docker + Jenkins</span>
              <span>→</span>
              <span className="pipeline-pill">Person 3: AWS + Terraform</span>
              <span>→</span>
              <span className="pipeline-pill">Person 4: K8s + Scaling</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DocConnect Healthcare System. Designed for DevOps Capstone Project.</p>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--slate-400)' }}>
            <span>PostgreSQL 17</span>
            <span>•</span>
            <span>Express REST API</span>
            <span>•</span>
            <span>React 19 + Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
