# AI Content Strategist - Setup Guide

## Quick Start

### 1. PostgreSQL Database Setup

First, create the database:
```bash
# Using createdb command
createdb ai_content_strategist

# Or using psql
psql -U postgres
CREATE DATABASE ai_content_strategist;
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment configuration
cp environment.txt .env

# Edit .env file with your settings:
# - Update DATABASE_URL with your PostgreSQL credentials
# - Add your Claude API key from Anthropic
# - Change SECRET_KEY to a secure random string

# Run the backend server
python run.py
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Copy environment configuration
cp environment.txt .env

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

## Environment Configuration

### Backend (.env)

Update the `backend/.env` file with your settings:

```
DATABASE_URL=postgresql://username:password@localhost:5432/ai_content_strategist
CLAUDE_API_KEY=your_actual_claude_api_key_from_anthropic
SECRET_KEY=your-secure-secret-key-here
FLASK_ENV=development
FLASK_DEBUG=True
```

### Frontend (.env)

Update the `frontend/.env` file:

```
REACT_APP_API_URL=http://localhost:5000
```

## Getting Your Claude API Key

1. Visit [Anthropic's website](https://www.anthropic.com)
2. Sign up for an account
3. Navigate to your API dashboard
4. Create a new API key
5. Copy the key and paste it in your backend `.env` file

## Testing the Setup

1. **Backend Test**: Visit `http://localhost:5000/api/dashboard/summary` - you should see a JSON response
2. **Frontend Test**: Visit `http://localhost:3000` - you should see the dashboard
3. **Database Test**: Check that you can create a platform or update your profile

## Features Available

✅ **Dashboard**: Overview with stats and AI strategy generation
✅ **Profile**: Complete profile management 
✅ **Platforms**: Social media platform tracking with follower goals
✅ **Navigation**: Full navigation between all sections
✅ **API Integration**: Complete REST API for all features
✅ **Claude AI**: AI-powered content strategy recommendations

🚧 **Coming Soon**: Content Pillars, Content Ideas, Content Manager, Tasks, Analytics (full implementations)

## Project Structure

```
AI_Content_Strategist/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   ├── claude_service.py   # Claude AI integration
│   ├── run.py              # Application runner
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind CSS config
└── README.md               # Project documentation
```

## Next Steps

1. **Set up your profile** with your mission, goals, and target audience
2. **Add your social media platforms** with current and goal followers
3. **Generate your first AI strategy** using the dashboard button
4. **Explore the different sections** to understand the full functionality

## Troubleshooting

### Common Issues

1. **Database Connection Error**: 
   - Make sure PostgreSQL is running
   - Check your DATABASE_URL in .env
   - Verify database exists: `psql -l`

2. **Claude API Error**:
   - Verify your CLAUDE_API_KEY is correct
   - Check your Anthropic account has credits
   - Ensure you're using the correct API key format

3. **Frontend Can't Connect to Backend**:
   - Make sure backend is running on port 5000
   - Check REACT_APP_API_URL in frontend .env
   - Verify CORS is enabled (already configured)

4. **Package Installation Issues**:
   - Make sure you're in the correct virtual environment
   - Try upgrading pip: `pip install --upgrade pip`
   - On macOS, you might need: `pip install psycopg2-binary`

### Getting Help

If you encounter issues:
1. Check the console logs in both terminal windows
2. Verify all environment variables are set correctly
3. Make sure PostgreSQL is running and accessible
4. Check that all dependencies are installed

## Development Notes

- The backend runs on port 5000
- The frontend runs on port 3000
- Hot reloading is enabled for both
- Database tables are created automatically on first run
- All API endpoints are CORS-enabled for development

Enjoy building your AI-powered content strategy! 🚀 