import React from 'react';
import { Row, Col } from 'antd';
import { footer } from './data';
import { Margin } from '@mui/icons-material';

export default function Footer() {
  return (
    <footer className="footer page-wrapper">
      <div className="footer-wrap page">
        <Row>
          {console.log(footer)}
          {footer.map((foot, index) => (
            <Col key={index.toString()} md={6} xs={24} className="footer-item-col">
              <div className="footer-item">
                <h2 style={{ display: 'flex', alignItems: 'center' }}>
                  {foot.icon && (
                    <img
                      style={{ marginRight: 4, maxWidth: '35px' }}
                      src={foot.icon}
                      alt="img"
                    />
                  )}
                  {foot.title}
                </h2>
                {foot.children.map((child) => (
                  <div key={child.link}>
                    <a rel="noopener noreferrer" href={child.link}>
                      {child.title}
                      {child.desc && (
                        <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                          {' '}
                          - {child.desc}
                        </span>
                      )}
                    </a>
                  </div>
                ))}
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <div className="footer-bottom">
        <div className="page">
          <Row style={{ width: 'fit-content', margin: 'auto' }}>
              <span>
                Copyright &copy; 2025 Detroit. All rights reserved
              </span>
          </Row>
        </div>
      </div>
    </footer>
  );
}
