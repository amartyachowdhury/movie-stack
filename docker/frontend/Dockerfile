# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
# Install dependencies
RUN npm install --prefer-offline --no-audit --progress=false --legacy-peer-deps

# Copy source code
COPY frontend/ .

# Build the app
ARG REACT_APP_API_BASE="/api"
ENV REACT_APP_API_BASE=${REACT_APP_API_BASE}
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy placeholder images manually
COPY frontend/public/placeholder-movie.svg /usr/share/nginx/html/
COPY frontend/public/placeholder-movie.jpg /usr/share/nginx/html/

# Copy nginx configuration
COPY docker/nginx/nginx-frontend.conf /etc/nginx/conf.d/default.conf

# Add cache-busting timestamp to index.html
RUN TIMESTAMP=$(date +%s) && \
    sed -i "1i<!-- Cache-busting timestamp: $TIMESTAMP -->" /usr/share/nginx/html/index.html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
