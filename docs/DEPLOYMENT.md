# NexBet Deployment Guide

## Production Deployment

### Environment Setup
- Node.js production environment
- MongoDB Atlas (or managed MongoDB)
- SSL/TLS certificates
- Domain name

### Build Frontend
\`\`\`bash
cd frontend
npm run build
\`\`\`

### Deploy to Server

#### Option 1: Using PM2
\`\`\`bash
npm install -g pm2
cd backend
pm2 start server.js --name "nexbet-server"
\`\`\`

#### Option 2: Using Docker
Create \`Dockerfile\` and \`docker-compose.yml\`

### Configuration
- Update \`GOOGLE_CALLBACK_URL\` with production domain
- Set \`NODE_ENV=production\`
- Ensure MongoDB is accessible
- Configure firewall rules

### SSL/TLS
Set up HTTPS with Let's Encrypt or similar service.
