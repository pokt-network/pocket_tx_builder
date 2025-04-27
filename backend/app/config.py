"""
Configuration and environment variable loading for Pocket SDK API.
"""

import os

from dotenv import load_dotenv


# Load environment variables
def load_env():
    load_dotenv()


# Pocket network secrets
NETWORK_SECRETS = {
    "alpha": os.getenv("ALPHA_SECRET", "alpha_default_secret"),
    "beta": os.getenv("BETA_SECRET", "beta_default_secret"),
    "mainnet": os.getenv("MAINNET_SECRET", "mainnet_default_secret"),
}

# Pocket configuration
POCKET_HOME = os.getenv("POCKET_HOME", ".pocket")
POCKET_CHAIN = {
    "alpha": os.getenv("POCKET_CHAIN_ALPHA", "pocket-alpha"),
    "beta": os.getenv("POCKET_CHAIN_BETA", "pocket-beta"),
    "mainnet": os.getenv("POCKET_CHAIN_MAINNET", "pocket"),
}
POCKET_NODE_URL = {
    "alpha": os.getenv(
        "POCKET_ALPHA_NODE_URL", "https://shannon-testnet-grove-rpc.alpha.poktroll.com"
    ),
    "beta": os.getenv(
        "POCKET_BETA_NODE_URL", "https://shannon-testnet-grove-rpc.beta.poktroll.com"
    ),
    "mainnet": os.getenv(
        "POCKET_MAINNET_NODE_URL", "https://shannon-grove-rpc.mainnet.poktroll.com"
    ),
}
POCKET_KEYRING_BACKEND = os.getenv("POCKET_TEST_KEYRING_BACKEND", "test")
POCKET_BIN_PATH = "/usr/local/bin/pocketd"

# Supabase public key for JWT verification
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

# Default funding amount
DEFAULT_FUNDING_AMOUNT = "1000000upokt"  # 1 POKT

# Faucet keys
POCKET_ALPHA_FAUCET = os.getenv("POCKET_ALPHA_FAUCET")
POCKET_BETA_FAUCET = os.getenv("POCKET_BETA_FAUCET")
POCKET_MAIN_FAUCET = os.getenv("POCKET_MAIN_FAUCET")
