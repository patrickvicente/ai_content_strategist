#!/usr/bin/env python3
"""
AI Content Strategist Backend
Run script for the Flask application
"""

import os
from app import create_app
from models import db

# Create the Flask app
app = create_app()

if __name__ == '__main__':
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=True
    ) 