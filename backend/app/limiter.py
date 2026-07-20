"""
Shared rate limiter instance. Must be the SAME instance used in main.py
(as app.state.limiter) and in any router that applies the @limiter.limit(...)
decorator — otherwise request counts would be tracked in two separate,
inconsistent in-memory stores.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
