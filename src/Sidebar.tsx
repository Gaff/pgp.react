import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';


export function Sidebar() {
    return (    
        <Card className="mb-3">
            <Card.Header as="h5">Help</Card.Header>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
          </ul>
        </Card>
    )
}
