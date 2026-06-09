# Stage 1: Build the Angular app
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . ./
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine AS serve

# COPY YOUR NEW CONFIGURATION FILE HERE:
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled angular static assets
COPY --from=build /app/dist/irctc-ui/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]