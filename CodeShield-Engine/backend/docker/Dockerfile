# =============================================================================
# CodeShield Multilingual Runner Image & Deployment Build
# -----------------------------------------------------------------------------
# A lightweight sandbox image containing the toolchains for every language in
# CodeShield's execution matrix: Python 3, Node.js (JavaScript), GCC/G++ (C/C++),
# a JDK (Java), and Bash.
# =============================================================================

FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install Python 3, Node.js, GCC/G++, a headless JDK, and Bash.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        nodejs \
        gcc \
        g++ \
        default-jdk-headless \
        bash \
        ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# A dedicated, unprivileged user that owns nothing outside /sandbox.
RUN useradd -m -u 10001 -s /bin/bash runner

# /sandbox is the mount point for the per-submission working directory
RUN mkdir -p /sandbox && chown runner:runner /sandbox

USER runner
WORKDIR /sandbox

# =============================================================================
# DEPLOYMENT EXTENSION: Overriding the runner to boot the Express API Server
# =============================================================================

# 1. Switch to root temporarily to move the production application files
USER root

# 2. Copy all your backend directory files into a new application folder
COPY . /app
WORKDIR /app

# 3. Install the Express backend node_modules dependencies
RUN npm install

# 4. Expose the standard Render web service application port
EXPOSE 10000

# 5. Tell the container to boot your actual server.js script and keep it alive
CMD ["node", "server.js"]