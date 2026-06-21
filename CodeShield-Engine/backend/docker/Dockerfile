# =============================================================================
# CodeShield Multilingual Runner Image
# -----------------------------------------------------------------------------
# A lightweight sandbox image containing the toolchains for every language in
# CodeShield's execution matrix: Python 3, Node.js (JavaScript), GCC/G++ (C/C++),
# a JDK (Java), and Bash.
#
# This image is intentionally NOT given network access at runtime -- the
# backend always launches it with `--network none`. It is also run with
# `--rm` (ephemeral) and a memory cap (`-m 256m`) so a single submission can
# never persist state or exhaust host memory.
#
# Build:
#   docker build -t codeshield-runner -f docker/Dockerfile .
#
# The backend's executeCode.js shells out to `docker run` using this image
# tag (configurable via the DOCKER_RUNNER_IMAGE env var).
# =============================================================================

FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install Python 3, Node.js, GCC/G++, a headless JDK, and Bash (already present
# in debian, but listed for clarity). default-jdk-headless keeps the image
# lighter than the full default-jdk while still providing javac + java.
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
# (bind-mounted read/write from the host at run time).
RUN mkdir -p /sandbox && chown runner:runner /sandbox

USER runner
WORKDIR /sandbox

# No ENTRYPOINT/CMD -- the backend supplies the full compile/run command at
# `docker run` time, e.g.:
#   docker run --rm -m 256m --network none -v <dir>:/sandbox codeshield-runner \
#     bash -c 'g++ "/sandbox/source.cpp" -o "/sandbox/a.out" -O2 -std=c++17'
