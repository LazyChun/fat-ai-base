from __future__ import annotations

import base64
from typing import Any, Dict, Literal, Optional


def get_version() -> str:
    try:
        from importlib.metadata import version as pkg_version
    except Exception:
        from importlib_metadata import version as pkg_version  # type: ignore

    try:
        return pkg_version("opencv-python")
    except Exception:
        import cv2

        return cv2.__version__


def image_info_base64(image_base64: str) -> Dict[str, Any]:
    import cv2
    import numpy as np

    raw = base64.b64decode(image_base64)
    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError("Failed to decode image")

    h, w = img.shape[:2]
    channels = 1 if img.ndim == 2 else int(img.shape[2])
    return {"width": int(w), "height": int(h), "channels": channels}


def resize_base64(
    image_base64: str,
    width: int,
    height: int,
    interpolation: Literal["nearest", "linear", "area", "cubic", "lanczos"] = "linear",
    output_format: Literal["png", "jpg"] = "png",
    jpeg_quality: Optional[int] = None,
) -> Dict[str, Any]:
    import cv2
    import numpy as np

    interp_map = {
        "nearest": cv2.INTER_NEAREST,
        "linear": cv2.INTER_LINEAR,
        "area": cv2.INTER_AREA,
        "cubic": cv2.INTER_CUBIC,
        "lanczos": cv2.INTER_LANCZOS4,
    }

    raw = base64.b64decode(image_base64)
    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError("Failed to decode image")

    resized = cv2.resize(img, (int(width), int(height)), interpolation=interp_map[interpolation])

    ext = ".png" if output_format == "png" else ".jpg"
    encode_params = []
    if output_format == "jpg":
        q = 90 if jpeg_quality is None else int(jpeg_quality)
        encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), q]

    ok, buf = cv2.imencode(ext, resized, encode_params)
    if not ok:
        raise ValueError("Failed to encode image")

    out_b64 = base64.b64encode(buf.tobytes()).decode("ascii")
    return {"image_base64": out_b64, "format": output_format}
