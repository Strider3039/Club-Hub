# Step 1: Use the official Node.js image
FROM node:18-slim as build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package.json package-lock.json /app/

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the frontend code
COPY . /app/

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Production setup (serve using Nginx)
FROM nginx:alpine as production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Step 8: Development setup
FROM node:18-slim as development

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json /app/
RUN npm install \
 && npm install react-bootstrap bootstrap react-calendar

# Copy source code for development
COPY . /app/

EXPOSE 3000
CMD ["npm", "start"]
