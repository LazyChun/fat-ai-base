from __future__ import annotations

import base64
from typing import Any, Dict, List, Optional, Tuple

_ocr_instances: Dict[Tuple[str, bool, bool], Any] = {}


def get_version() -> str:
    try:
        from importlib.metadata import version as pkg_version
    except Exception:
        from importlib_metadata import version as pkg_version  # type: ignore

    return pkg_version("paddleocr")


def _get_ocr(
    lang: str = "ch",
    use_angle_cls: bool = True,
    use_gpu: bool = False,
):
    key = (lang, bool(use_angle_cls), bool(use_gpu))
    inst = _ocr_instances.get(key)
    if inst is not None:
        return inst

    from paddleocr import PaddleOCR

    ocr = PaddleOCR(lang=lang, use_angle_cls=bool(use_angle_cls), use_gpu=bool(use_gpu))
    _ocr_instances[key] = ocr
    return ocr


def warmup(
    lang: str = "ch",
    use_angle_cls: bool = True,
    use_gpu: bool = False,
) -> Dict[str, Any]:
    _get_ocr(lang=lang, use_angle_cls=bool(use_angle_cls), use_gpu=bool(use_gpu))
    return {"ok": True}


def ocr_image_base64(
    image_base64: str,
    lang: str = "ch",
    use_angle_cls: bool = True,
    use_gpu: bool = False,
    det: bool = True,
    rec: bool = True,
    cls: bool = True,
) -> Dict[str, Any]:
    import cv2
    import numpy as np

    raw = base64.b64decode(image_base64)
    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Failed to decode image")

    ocr = _get_ocr(lang=lang, use_angle_cls=use_angle_cls, use_gpu=use_gpu)
    res = ocr.ocr(img, det=bool(det), rec=bool(rec), cls=bool(cls))

    lines: List[Dict[str, Any]] = []
    if res:
        for item in res:
            if not item or len(item) < 2:
                continue
            box, info = item[0], item[1]
            text = info[0] if info and len(info) >= 1 else ""
            score = float(info[1]) if info and len(info) >= 2 and info[1] is not None else None
            lines.append({"text": text, "score": score, "box": box})

    return {"lines": lines}
