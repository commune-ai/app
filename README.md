# ComHub - The Hub for Commune AI Modules

ComHub is a web application that serves as a central hub for managing and discovering Commune AI modules. It provides a user-friendly interface to interact with modules and includes features like module search, creation, and management.

## 🚀 Quick Start

### Prerequisites

- Docker
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/commune-ai/app.git
cd app
```

2. Build the Docker image:
```bash
./run/build.sh # make build
```

3. Start the container:
```bash
./run/start.sh # make start or make up
```

This will:
- Build the Docker image with all required dependencies
- Start the container with the necessary port mappings
- Mount required volumes for persistence

### Development

The application consists of two main parts:

1. Frontend (Next.js app running on port 3000)
2. Backend (FastAPI server running on port 8000)

To run the development environment:

```bash
# Enter the container
./run/enter.sh # make enter

# Start the application
./run/app.sh # make app
```

## 🛠️ Architecture

The application is built with:

- **Frontend**: Next.js, TailwindCSS, TypeScript
- **Backend**: FastAPI, Python
- **Storage**: Local file system for module data
- **Container**: Docker

## 📁 Project Structure

```
.
├── app/                    # Frontend application
│   ├── components/        # React components
│   ├── modules/          # Module-related pages
│   └── wallet/           # Wallet implementation
├── api/                   # Backend API
│   ├── api.py            # Main API implementation
│   └── utils.py          # Utility functions
├── run/                   # Shell scripts for running the application
│   ├── app.sh            # Start the application
│   ├── build.sh          # Build Docker image
│   ├── enter.sh          # Enter container
│   ├── start.sh          # Start container
│   └── stop.sh           # Stop container
└── Dockerfile            # Docker configuration
```

## 🔧 Configuration

The application can be configured through environment variables:

- `API_PORT`: Backend API port (default: 8000)
- `APP_PORT`: Frontend application port (default: 3000)

## 🚀 Features

- Module discovery and search
- Module creation and management
- Wallet integration
- Real-time module status
- Grid and table views for modules

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built on top of Commune AI
- Inspired by the need for a central hub for AI modules

```

This README provides:
1. Clear installation instructions using Docker
2. Project structure overview
3. Configuration options
4. Development setup instructions
5. Feature list
6. Contributing guidelines