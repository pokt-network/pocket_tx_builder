#!/bin/bash

# Script to download and install the latest PocketD release
# Usage: bash install-pocketd.sh

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Create bin directory if it doesn't exist
mkdir -p ./bin

# Function to print status messages
print_status() {
    echo -e "${GREEN}[+] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[!] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Detect OS and architecture
print_status "Detecting operating system and architecture..."
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Map architectures to Pocket naming convention
case "$ARCH" in
x86_64)
    ARCH="amd64"
    ;;
arm64 | aarch64)
    ARCH="arm64"
    ;;
*)
    print_error "Unsupported architecture: $ARCH"
    ;;
esac

# Supported OS check
if [[ "$OS" != "linux" && "$OS" != "darwin" ]]; then
    print_error "Unsupported operating system: $OS"
fi

# Set download URL base
DOWNLOAD_BASE="https://github.com/pokt-network/poktroll/releases"

# Get latest release tag
print_status "Getting latest release information..."
LATEST_RELEASE_URL=$(curl -s -L -I -o /dev/null -w '%{url_effective}' "${DOWNLOAD_BASE}/latest")
LATEST_TAG=$(basename "$LATEST_RELEASE_URL")

print_status "Latest release: $LATEST_TAG"

# Construct download URL for detected OS and architecture
DOWNLOAD_URL="${DOWNLOAD_BASE}/download/${LATEST_TAG}/pocket_${OS}_${ARCH}.tar.gz"
TARBALL="pocket_${OS}_${ARCH}.tar.gz"

# Download the tarball
print_status "Downloading PocketD from: $DOWNLOAD_URL"
if command -v curl &>/dev/null; then
    curl -L -o "$TARBALL" "$DOWNLOAD_URL" || print_error "Failed to download PocketD"
elif command -v wget &>/dev/null; then
    wget -O "$TARBALL" "$DOWNLOAD_URL" || print_error "Failed to download PocketD"
else
    print_error "Neither curl nor wget is installed. Please install one of them and try again."
fi

# Extract the tarball
print_status "Extracting PocketD..."
tar -xzf "$TARBALL" || print_error "Failed to extract PocketD"

# Move binary to bin directory
print_status "Installing PocketD to ./bin/pocketd..."
if [ -f "pocketd" ]; then
    mv pocketd ./bin/ || print_error "Failed to move PocketD to bin directory"
else
    # Look for the binary in case it's in a subdirectory
    find . -name "pocketd" -type f -not -path "./bin/*" -exec mv {} ./bin/ \; || print_error "Could not find PocketD binary in extracted files"
fi

# Make binary executable
chmod +x ./bin/pocketd || print_error "Failed to make PocketD executable"

# Clean up
print_status "Cleaning up..."
rm -f "$TARBALL"

# Verify installation
if [ -x "./bin/pocketd" ]; then
    print_status "PocketD installed successfully to ./bin/pocketd"
    print_status "Version information:"
    ./bin/pocketd version
else
    print_error "Installation verification failed"
fi

print_status "Installation complete!"
