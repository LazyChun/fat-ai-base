from __future__ import annotations

from typing import Any, Dict


def get_version() -> str:
    try:
        from importlib.metadata import version as pkg_version
    except Exception:
        from importlib_metadata import version as pkg_version  # type: ignore

    try:
        return pkg_version("paddlepaddle")
    except Exception:
        import paddle

        return paddle.__version__


def device_info() -> Dict[str, Any]:
    import paddle

    compiled_with_cuda = bool(paddle.is_compiled_with_cuda())
    return {
        "version": paddle.__version__,
        "compiled_with_cuda": compiled_with_cuda,
        "device": paddle.get_device(),
    }
