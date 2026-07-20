"""
Lightweight logging setup — no external monitoring service required.
Logs go to stdout, which Render (and most PaaS providers) captures and
displays in their dashboard automatically.
"""
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)

logger = logging.getLogger("faqai")
