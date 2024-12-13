# Stage 1: Build the React application
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy Vite configuration, environment files, and other configuration files
COPY *.config.js ./
COPY index.html ./index.html

# Copy source and public directories
COPY src ./src
COPY public ./public

# Run the build process
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy the build output from Stage 1 to NGINX's static folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose NGINX port
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
