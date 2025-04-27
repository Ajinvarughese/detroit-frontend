import React from 'react';
import { Row, Col, Tooltip } from 'antd';
import { header } from './data';

export default function Header(props) {
  const menuChild = header.map((item, i) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    const content = hasChildren
      ? item.children.map((child, ii) => (
          <a href={child.link} key={ii.toString()} className="tip-block">
            <span className="tip-img">
              <img src={child.img} alt="img" />
            </span>
            <div className="tip-content">
              {child.title}
              <div>{child.desc}</div>
            </div>
          </a>
        ))
      : null;

    return (
      <Col key={i.toString()} span={6}>
        {hasChildren ? (
          <Tooltip title={content} placement="bottom" overlayClassName="header-tip-wrap">
            <span className="nav-title">{item.title}</span>
          </Tooltip>
        ) : (
          <a href={item.route}>
            <span className="nav-title">{item.title}</span>
          </a>
        )}
      </Col>
    );
  });

  return (
    <header {...props}>
      <Row className="nav">
        {menuChild}
      </Row>
    </header>
  );
}
