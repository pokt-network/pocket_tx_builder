"""
General utility functions for Pocket SDK API backend.
"""

import random
import string


def generate_random_key_name(prefix="user"):
    """Generate a random key name with a given prefix."""
    random_suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"{prefix}_{random_suffix}"
