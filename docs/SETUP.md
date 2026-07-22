# NexBet Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB
- Google OAuth Credentials
- npm or yarn

## Installation Steps

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/NexBet3/NexBet.git
cd NexBet
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm run install-all
\`\`\`

### 3. Configure Environment Variables

#### Backend (.env)
Copy \`.env.example\` to \`.env\` and fill in:
\`\`\`bash
cp backend/.env.example backend/.env
\`\`\`

Update with your values:
- \`GOOGLE_CLIENT_ID\`: From Google Cloud Console
- \`GOOGLE_CLIENT_SECRET\`: From Google Cloud Console
- \`MONGODB_URI\`: Your MongoDB connection string
- \`SESSION_SECRET\`: Any secure random string
- \`JWT_SECRET\`: Any secure random string

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - \`http://localhost:5000/api/auth/google/callback\` (development)
   - \`https://yourdomain.com/api/auth/google/callback\` (production)
6. Copy Client ID and Client Secret

### 5. Start Development Servers
\`\`\`bash
npm run dev
\`\`\`

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

See \`docs/DEPLOYMENT.md\` for production deployment instructions.
