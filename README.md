# Email Management System

A modern web-based email management system with activate/deactivate functionality and SQLite database storage.

## Features

- ✨ **Modern UI**: Beautiful, responsive interface with gradient backgrounds and smooth animations
- 📧 **Email Management**: Add, activate, deactivate, and delete email addresses
- 📊 **Real-time Stats**: Live statistics showing total, active, and inactive emails
- 🔍 **Filtering**: Filter emails by status (all, active, inactive)
- 💾 **Database Storage**: SQLite database for persistent data storage
- ⚡ **Real-time Updates**: Dynamic updates without page refresh
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts**: Ctrl+Enter to add emails, F5 to refresh

## Technology Stack

- **Backend**: Flask (Python)
- **Database**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Font Awesome icons
- **Architecture**: RESTful API with JSON responses

## Installation

1. Clone or download the project files
2. Create a virtual environment:
   ```bash
   python3 -m venv email_env
   source email_env/bin/activate  # On Windows: email_env\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Activate the virtual environment:
   ```bash
   source email_env/bin/activate  # On Windows: email_env\Scripts\activate
   ```

2. Run the Flask application:
   ```bash
   python app.py
   ```

3. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Adding Emails
1. Enter an email address in the input field
2. Click "Add Email" or press Enter
3. The email will be added with "inactive" status by default

### Managing Emails
- **Activate**: Click the green "Activate" button next to an inactive email
- **Deactivate**: Click the yellow "Deactivate" button next to an active email
- **Delete**: Click the red "Delete" button (requires confirmation)

### Filtering
- Use the dropdown filter to view:
  - All emails
  - Active emails only
  - Inactive emails only

### Statistics
The dashboard shows real-time statistics:
- Total number of emails
- Number of active emails
- Number of inactive emails

## API Endpoints

The application provides a RESTful API:

### GET /api/emails
Get all emails
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "status": "active",
    "created_at": "2024-01-15 10:30:00",
    "updated_at": "2024-01-15 11:00:00"
  }
]
```

### POST /api/emails
Add a new email
```json
{
  "email": "user@example.com"
}
```

### PUT /api/emails/{id}/activate
Activate an email

### PUT /api/emails/{id}/deactivate
Deactivate an email

### DELETE /api/emails/{id}
Delete an email

## Database Schema

The SQLite database contains one table:

```sql
CREATE TABLE emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## File Structure

```
email-management-system/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── emails.db             # SQLite database (created automatically)
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Styling
│   └── js/
│       └── script.js     # JavaScript functionality
└── README.md             # This file
```

## Features in Detail

### Email Validation
- Client-side validation using regex patterns
- Server-side validation with proper error messages
- Duplicate prevention

### User Experience
- Loading states for all buttons
- Success and error message notifications
- Auto-hiding messages
- Smooth animations and transitions
- Responsive design for all screen sizes

### Keyboard Shortcuts
- **Enter**: Add email when input is focused
- **Ctrl+Enter**: Add email from anywhere
- **F5**: Refresh email list

### Error Handling
- Network error handling
- Database error handling
- User-friendly error messages
- Graceful degradation

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Development

To extend or modify the application:

1. **Backend changes**: Modify `app.py`
2. **Frontend changes**: Update files in `templates/` and `static/`
3. **Database changes**: Modify the database schema in the `init_db()` function

## Troubleshooting

**Application won't start:**
- Make sure the virtual environment is activated
- Check that all dependencies are installed
- Verify Python version (3.7+ required)

**Database errors:**
- The SQLite database is created automatically
- Check file permissions in the project directory

**Port already in use:**
- Change the port in `app.py`: `app.run(port=5001)`

## License

This project is open source and available under the MIT License.