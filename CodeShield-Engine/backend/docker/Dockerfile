# =============================================================================
# CodeShield Multilingual Runner Image & Deployment Build
# =============================================================================

FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# 1. Install system utilities, Python, GCC, Java, and curl
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        python3 \
        gcc \
        g++ \
        default-jdk-headless \
        bash \
        ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 2. Safely inject NodeSource production repository for Node.js v20 (LTS) & NPM
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# A dedicated, unprivileged user that owns nothing outside /sandbox
RUN useradd -m -u 10001 -s /bin/bash runner

# /sandbox is the mount point for the per-submission working directory
RUN mkdir -p /sandbox && chown runner:runner /sandbox

USER runner
WORKDIR /sandbox

# =============================================================================
# DEPLOYMENT EXTENSION: Overriding the runner to boot the Express API Server
# =============================================================================

USER root

# Copy all your backend directory files into a new application folder
COPY . /app
WORKDIR /app

# Install the Express backend node_modules dependencies
RUN npm install

# Expose the standard Render web service application port
EXPOSE 10000

# Tell the container to boot your actual server.js script and keep it alive
CMD ["node", "server.js"]