"""
Pocket command helpers and utilities.
"""

import json
import logging
import os
import platform
import stat
import subprocess

from .config import (
    NETWORK_SECRETS,
    POCKET_BIN_PATH,
    POCKET_CHAIN,
    POCKET_HOME,
    POCKET_KEYRING_BACKEND,
    POCKET_NODE_URL,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from dataclasses import dataclass

@dataclass
class AccountState:
    account_number: int
    sequence: int

# Internal cache for account_number and sequence
# Maps address (str) -> AccountState
_account_state_cache: dict[str, AccountState] = {}


def get_account_state(address, network="alpha"):
    """
    Get (account_number, sequence) for an address. Uses cache if available, else queries pocketd.
    """
    if address in _account_state_cache:
        state = _account_state_cache[address]
        return state.account_number, state.sequence

    # Query pocketd for account info
    cmd = [
        "query", "auth", "account", address, "-o", "json"
    ]
    result = run_pocket_command(cmd, network)
    if result["exit_code"] != 0:
        logger.error(f"Failed to query account state: {result['stderr']}")
        raise Exception(f"Failed to query account state: {result['stderr']}")
    try:
        data = json.loads(result["stdout"])
        value = data["account"]["value"]
        acc_num = int(value["account_number"])
        seq = int(value["sequence"])
        _account_state_cache[address] = AccountState(account_number=acc_num, sequence=seq)
        return acc_num, seq
    except Exception as e:
        logger.error(f"Error parsing account state: {e}")
        raise

def update_account_sequence(address, increment=1):
    """
    Increment the cached sequence for an address (after sending a tx).
    """
    if address in _account_state_cache:
        _account_state_cache[address].sequence += increment

def clear_account_cache(address=None):
    """
    Clear the cache for a specific address or all addresses.
    """
    if address:
        _account_state_cache.pop(address, None)
    else:
        _account_state_cache.clear()


def run_pocket_command(command, network="alpha", requires_confirmation=False):
    chain_id = POCKET_CHAIN.get(network, POCKET_CHAIN["alpha"])
    node_url = POCKET_NODE_URL.get(network, POCKET_NODE_URL["alpha"])
    network_secret = NETWORK_SECRETS.get(network, NETWORK_SECRETS["alpha"])
    logger.info(f"Using pocketd binary at: {POCKET_BIN_PATH}")
    if not os.path.exists(POCKET_BIN_PATH):
        logger.error(f"pocketd binary not found at {POCKET_BIN_PATH}")
        return {
            "stdout": "",
            "stderr": f"pocketd binary not found at {POCKET_BIN_PATH}",
            "exit_code": 1,
            "txhash": None,
        }
    file_stat = os.stat(POCKET_BIN_PATH)
    is_executable = bool(file_stat.st_mode & stat.S_IXUSR)
    logger.info(
        f"File permissions: {oct(file_stat.st_mode)}, Executable: {is_executable}"
    )
    logger.info(f"System architecture: {platform.machine()}, OS: {platform.system()}")
    cmd = [POCKET_BIN_PATH] + command
    if "--node" not in command and "query" in command:
        cmd.extend(["--node", node_url])
    if "--chain-id" not in command and "tx" in command:
        cmd.extend(["--chain-id", chain_id])
    if "--keyring-backend" not in command and ("keys" in command or "tx" in command):
        cmd.extend(["--keyring-backend", POCKET_KEYRING_BACKEND])
    if "--home" not in command and ("keys" in command or "tx" in command):
        cmd.extend(["--home", POCKET_HOME])
    if "--output" not in command:
        cmd.extend(["--output", "json"])
    try:
        env = os.environ.copy()
        if network_secret:
            env["NETWORK_SECRET"] = network_secret
        logger.info(f"Executing command: {' '.join(cmd)}")
        if requires_confirmation:
            result = subprocess.run(
                cmd, capture_output=True, text=True, env=env, input="yes\n"
            )
        else:
            result = subprocess.run(cmd, capture_output=True, text=True, env=env)
        logger.info(f"Command exit code: {result.returncode}")
        stdout = result.stdout
        txhash = None
        try:
            if stdout and stdout.strip():
                json_data = json.loads(stdout)
                stdout = json.dumps(json_data, indent=2)
                txhash = json_data.get("txhash")
        except json.JSONDecodeError:
            pass
        return {
            "stdout": stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode,
            "txhash": txhash,
        }
    except Exception as e:
        logger.error(f"Error executing command: {str(e)}")
        import traceback

        logger.error(traceback.format_exc())
        return {"stdout": "", "stderr": str(e), "exit_code": 1, "txhash": None}


def key_exists(name: str, network: str = "alpha") -> bool:
    """
    Check if a key exists in the keyring.
    """
    cmd = ["keys", "show", name]
    result = run_pocket_command(cmd, network)
    return result["exit_code"] == 0


def import_hex_key(name: str, hex_key: str, network: str = "alpha") -> bool:
    """
    Import a key from a hex string.
    """
    cmd = [
        "keys",
        "import-hex",
        name,
        hex_key,
        "--key-type",
        "secp256k1",
        "--keyring-backend",
        POCKET_KEYRING_BACKEND,
    ]
    result = run_pocket_command(cmd, network, requires_confirmation=True)
    return result["exit_code"] == 0
