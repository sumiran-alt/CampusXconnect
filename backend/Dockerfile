FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies
RUN npm install --production

# Copy application files
COPY . .

# Create uploads directory for file uploads
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw newBuilding...
Installing Node dependencies...
npm ci --only=production
✅ Build completed
Starting service...
Server running on port 5000 Error(r.statusCode)})" || exit 1

# Start the application
CMD ["node", "server.js"]
