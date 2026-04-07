FROM nginx:1.27-alpine

# Copy static website files
COPY . /usr/share/nginx/html

# Optional: custom nginx config for SPA/static tuning
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
