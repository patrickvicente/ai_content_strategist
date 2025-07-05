# AI Content Strategist

An AI-powered content strategy platform that helps content creators analyze their performance, generate ideas, and optimize their content strategy using Claude AI.

## Features

- **Dashboard**: Overview of your content performance and strategy
- **Profile Management**: Define your mission, goals, vision, and target audience
- **Platform Tracking**: Monitor follower growth across different social media platforms
- **Content Pillars**: Organize your content themes and topics
- **Content Ideas**: Generate and manage content ideas
- **Content Manager**: Full content lifecycle management with scheduling and analytics
- **Task Management**: Track content creation tasks and deadlines
- **Analytics**: Performance tracking and insights
- **AI Strategy**: Claude-powered content strategy recommendations

## Technology Stack

- **Backend**: Flask, PostgreSQL, SQLAlchemy, Claude AI (Anthropic)
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Claude API key from Anthropic

### Backend Setup

1. **Create and activate virtual environment**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL database**:
   ```bash
   # Create database
   createdb ai_content_strategist
   
   # Or using PostgreSQL command line:
   psql -U postgres
   CREATE DATABASE ai_content_strategist;
   \q
   ```

4. **Configure environment variables**:
   Create a `.env` file in the backend directory:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/ai_content_strategist
   CLAUDE_API_KEY=your_claude_api_key_here
   SECRET_KEY=your-secret-key-here
   FLASK_ENV=development
   ```

5. **Run the backend server**:
   ```bash
   python run.py
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Database Schema

The application uses the following main entities:

- **Platforms**: Social media platforms with follower tracking
- **Profile**: User profile with mission, goals, and target audience
- **Content Pillars**: Content themes and categories
- **Content Ideas**: Individual content ideas linked to pillars
- **Content Manager**: Full content items with scheduling and metrics
- **Tasks**: Content creation and management tasks
- **Analytics**: Performance data and metrics

## API Endpoints

### Core Endpoints

- `GET /api/platforms` - Get all platforms
- `POST /api/platforms` - Create new platform
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/content-pillars` - Get content pillars
- `GET /api/content-ideas` - Get content ideas
- `GET /api/content-manager` - Get content items
- `GET /api/tasks` - Get tasks
- `GET /api/analytics` - Get analytics data

### AI Integration Endpoints

- `POST /api/ai/generate-strategy` - Generate content strategy
- `POST /api/ai/generate-ideas` - Generate content ideas
- `POST /api/ai/optimize-content` - Optimize content for platforms
- `POST /api/ai/analyze-performance` - Analyze performance data
- `POST /api/ai/weekly-plan` - Generate weekly content plan

## Claude AI Integration

The platform integrates with Claude AI to provide:

1. **Content Strategy Generation**: Analyze your profile and performance data to generate strategic recommendations
2. **Content Ideas**: Generate creative content ideas based on your pillars and audience
3. **Content Optimization**: Optimize content for specific platforms
4. **Performance Analysis**: Analyze what's working and provide insights
5. **Weekly Planning**: Generate weekly content plans

## Development

### Running Tests

Backend tests:
```bash
cd backend
python -m pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

### Database Migrations

The application uses SQLAlchemy for database management. Tables are created automatically when you run the application for the first time.

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Usage

1. **Setup Profile**: Start by filling out your profile with your mission, goals, and target audience
2. **Add Platforms**: Add your social media platforms and set follower goals
3. **Create Content Pillars**: Define your content themes
4. **Generate Strategy**: Use the AI strategy generator to get recommendations
5. **Manage Content**: Create and schedule content using the content manager
6. **Track Performance**: Monitor your analytics and adjust strategy

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the GitHub repository or contact the development team. 