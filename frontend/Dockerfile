# Step 1: Use the official Node.js image
FROM node:18-slim as build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package.json package-lock.json /app/

# Step 4: Install dependencies
RUN npm install
RUN npm install bootstrap react-bootstrap
RUN npm install react-calendar
# Step 5: Copy the rest of the frontend code
COPY . /app/

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Production setup (serve using Nginx)
FROM nginx:alpine as production

# Copy build output to Nginx's public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for production
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]

# Step 8: Development setup (use Node.js for serving the app in dev mode)
FROM node:18-slim as development

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy source code for development
COPY . /app/

# Expose port 3000 for development
EXPOSE 3000

# Command to run React development server
CMD ["npm", "start"]
