# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Copy just package.json and lock file first, then install
COPY package*.json ./
RUN npm install

# Now copy the rest of the frontend source
COPY . .

# Build the production bundle
RUN npm run build

# ---- Runtime Stage ----
FROM node:18-alpine AS runner

WORKDIR /app

# Copy over the built artifacts from the builder
COPY --from=builder /app/dist ./dist

# Globally install 'serve' for a quick static server
RUN npm install -g serve

# Expose the port on which 'serve' will run
EXPOSE 5173

# The production command to serve the compiled files
CMD ["serve", "-s", "dist", "-l", "5173"]
