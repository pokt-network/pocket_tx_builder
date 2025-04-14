FROM python:3.11-slim

WORKDIR /app

# Install required packages and dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    tar \
    && rm -rf /var/lib/apt/lists/*

# Download and install the correct pocketd binary for the container's OS and architecture
RUN ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "amd64" ]; then \
        DOWNLOAD_ARCH="amd64"; \
    elif [ "$ARCH" = "arm64" ]; then \
        DOWNLOAD_ARCH="arm64"; \
    else \
        echo "Unsupported architecture: $ARCH"; \
        exit 1; \
    fi && \
    echo "Downloading pocketd for linux_${DOWNLOAD_ARCH}" && \
    curl -L "https://github.com/pokt-network/poktroll/releases/download/v0.1.1/pocket_linux_${DOWNLOAD_ARCH}.tar.gz" -o pocket.tar.gz && \
    mkdir -p /usr/local/bin && \
    tar -zxf pocket.tar.gz -C /usr/local/bin && \
    chmod +x /usr/local/bin/pocketd && \
    ln -sf /usr/local/bin/pocketd /app/pocketd && \
    rm pocket.tar.gz

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Verify the binary works
RUN /app/pocketd version || echo "Binary verification will be done at runtime"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
