from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3
import datetime
import os

app = Flask(__name__)

# Database setup
DATABASE = 'emails.db'

def init_db():
    """Initialize the database with emails table"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'inactive',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    """Main page with email interface"""
    return render_template('index.html')

@app.route('/api/emails', methods=['GET'])
def get_emails():
    """Get all emails from database"""
    conn = get_db_connection()
    emails = conn.execute(
        'SELECT * FROM emails ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    
    return jsonify([dict(email) for email in emails])

@app.route('/api/emails', methods=['POST'])
def add_email():
    """Add new email to database"""
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    # Basic email validation
    if '@' not in email or '.' not in email:
        return jsonify({'error': 'Invalid email format'}), 400
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO emails (email, status) VALUES (?, ?)',
            (email.lower().strip(), 'inactive')
        )
        conn.commit()
        email_id = cursor.lastrowid
        
        # Get the created email
        new_email = conn.execute(
            'SELECT * FROM emails WHERE id = ?', (email_id,)
        ).fetchone()
        conn.close()
        
        return jsonify(dict(new_email)), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Email already exists'}), 409

@app.route('/api/emails/<int:email_id>/activate', methods=['PUT'])
def activate_email(email_id):
    """Activate an email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE emails SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ('active', email_id)
    )
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Email not found'}), 404
    
    conn.commit()
    
    # Get updated email
    updated_email = conn.execute(
        'SELECT * FROM emails WHERE id = ?', (email_id,)
    ).fetchone()
    conn.close()
    
    return jsonify(dict(updated_email))

@app.route('/api/emails/<int:email_id>/deactivate', methods=['PUT'])
def deactivate_email(email_id):
    """Deactivate an email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE emails SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ('inactive', email_id)
    )
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Email not found'}), 404
    
    conn.commit()
    
    # Get updated email
    updated_email = conn.execute(
        'SELECT * FROM emails WHERE id = ?', (email_id,)
    ).fetchone()
    conn.close()
    
    return jsonify(dict(updated_email))

@app.route('/api/emails/<int:email_id>', methods=['DELETE'])
def delete_email(email_id):
    """Delete an email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM emails WHERE id = ?', (email_id,))
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Email not found'}), 404
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Email deleted successfully'})

if __name__ == '__main__':
    # Initialize database
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)