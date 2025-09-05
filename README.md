# 🎬 Movie Stack

A modern, full-stack movie recommendation application built with React, Flask, and industry-standard architecture patterns.

## ✨ Features

- 🎭 **Movie Discovery**: Browse and search through thousands of movies
- ⭐ **Smart Recommendations**: AI-powered personalized movie recommendations
- 📊 **Analytics Dashboard**: Real-time user behavior and performance analytics
- 👤 **User Management**: Secure authentication and user profiles
- 📝 **Watchlist**: Save and manage your favorite movies
- 🎨 **Modern UI**: Beautiful, responsive design with dark/light themes
- 📱 **PWA Support**: Progressive Web App capabilities
- 🔍 **Advanced Search**: Smart search with filters and suggestions
- 📈 **Performance Monitoring**: Real-time application monitoring
- 🛡️ **Security**: JWT authentication with role-based access control

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Feature-based architecture** for better maintainability
- **Shared component library** for consistency
- **Type-safe interfaces** throughout the application
- **Modern React patterns** with hooks and context

### Backend (Flask + Python)
- **Domain-driven design** for clean separation of concerns
- **RESTful API** with comprehensive error handling
- **JWT authentication** with refresh token support
- **Database abstraction** with SQLAlchemy ORM

### Infrastructure
- **Docker containerization** for consistent deployments
- **MySQL** for primary data storage
- **SQLite** for analytics data
- **Nginx** reverse proxy for production

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/movie-stack.git
   cd movie-stack
   ```

2. **Set up environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.dev.yml up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Database: localhost:3306

### Demo Credentials
- **Username**: `demo_user`
- **Password**: `demo_password`

## 📁 Project Structure

```
movie-stack/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── features/        # Feature-based modules
│   │   ├── shared/          # Shared components and utilities
│   │   ├── core/            # Core application logic
│   │   └── assets/          # Static assets
│   └── public/              # Public assets
├── backend/                 # Flask backend application
│   ├── app/
│   │   ├── domains/         # Business domains
│   │   ├── infrastructure/  # Infrastructure layer
│   │   └── middleware/      # Application middleware
│   └── tests/               # Backend tests
├── infrastructure/          # Infrastructure and deployment
│   ├── docker/             # Docker configurations
│   ├── kubernetes/         # Kubernetes manifests
│   └── terraform/          # Infrastructure as code
├── docs/                   # Documentation
└── tests/                  # End-to-end tests
```

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
flask run
```

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
python -m pytest

# E2E tests
npm run test:e2e
```

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5001
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_DEBUG=true
```

#### Backend (.env)
```bash
FLASK_ENV=development
DATABASE_URL=mysql://user:password@localhost/movie_stack
SECRET_KEY=your-secret-key
TMDB_API_KEY=your-tmdb-api-key
```

## 🚀 Deployment

### Docker Deployment
```bash
# Production build
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Development build
docker-compose -f infrastructure/docker/docker-compose.dev.yml up -d
```

### Kubernetes Deployment
```bash
kubectl apply -f infrastructure/kubernetes/
```

## 🧪 Testing

### Test Coverage
- **Frontend**: Unit tests for components and hooks
- **Backend**: Unit and integration tests for APIs
- **E2E**: End-to-end tests for critical user flows

### Running Tests
```bash
# All tests
npm run test:all

# Frontend only
npm run test:frontend

# Backend only
npm run test:backend
```

## 📊 Monitoring

### Analytics
- Real-time user behavior tracking
- Performance metrics monitoring
- Error tracking and reporting
- System health monitoring

### Logging
- Structured logging with correlation IDs
- Centralized log aggregation
- Real-time log monitoring
- Error alerting

## 🔒 Security

### Authentication
- JWT-based authentication
- Refresh token rotation
- Role-based access control
- Session management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [React](https://reactjs.org/) for the frontend framework
- [Flask](https://flask.palletsprojects.com/) for the backend framework
- [Docker](https://www.docker.com/) for containerization

## 📞 Support

- 📧 Email: support@moviestack.com
- 💬 Discord: [Join our community](https://discord.gg/moviestack)
- 📖 Documentation: [docs.moviestack.com](https://docs.moviestack.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/movie-stack/issues)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core movie browsing and search
- ✅ User authentication and profiles
- ✅ Basic recommendations
- ✅ Analytics dashboard

### Phase 2 (Next)
- 🔄 Advanced recommendation algorithms
- 🔄 Social features (reviews, ratings)
- 🔄 Mobile app (React Native)
- 🔄 Real-time notifications

### Phase 3 (Future)
- 📋 AI-powered content curation
- 📋 Multi-language support
- 📋 Advanced analytics and insights
- 📋 Integration with streaming services

---

<div align="center">
  <p>Made with ❤️ by the Movie Stack Team</p>
  <p>
    <a href="https://github.com/your-username/movie-stack">⭐ Star us on GitHub</a>
    •
    <a href="https://twitter.com/moviestack">🐦 Follow us on Twitter</a>
    •
    <a href="https://moviestack.com">🌐 Visit our website</a>
  </p>
</div>