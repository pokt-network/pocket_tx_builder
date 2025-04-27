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
