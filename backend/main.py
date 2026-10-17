"""
fat-ai-base — Backend Entry Point

提供通用 handler "run_script"：按需加载 backend/scripts/ 下的脚本模块并
调用其函数（与原 fat-notes localPyScripts/wrapper.py 协议一致）。

脚本模块缓存于进程内，chromadb 客户端、paddleocr 实例等常驻状态由本
backend 子进程维持（行为与原常驻 wrapper 进程等价）。

宿主侧由 services.pyBackendBridgeService 统一分发：
    chromadb_script.py / paddleocr_script.py / paddlepaddle_script.py /
    opencv_script.py / user_script.py -> 本插件

重依赖（chromadb / paddleocr / paddlepaddle / opencv-python）由宿主在
backend 首次启动时 pip install 到 vendor/（depsStrategy: install）。
"""

import importlib.util
import os
import sys
from typing import Any, Dict, Optional

from plugin_runtime import handler, run

# 脚本模块缓存：{script_path: module}（与原 wrapper.py 一致，进程内常驻）
_module_cache: Dict[str, Any] = {}

_SCRIPTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts")


def _load_module(script_path: str) -> Optional[Any]:
    if script_path in _module_cache:
        return _module_cache[script_path]

    script_name = os.path.basename(script_path)
    module_name = os.path.splitext(script_name)[0]
    try:
        spec = importlib.util.spec_from_file_location(module_name, script_path)
        if spec and spec.loader:
            module = importlib.util.module_from_spec(spec)
            sys.modules[module_name] = module
            spec.loader.exec_module(module)
            _module_cache[script_path] = module
            return module
    except Exception as e:
        print(f"Error loading module {script_name}: {e}", file=sys.stderr)
        raise RuntimeError(f"Failed to load module {script_name}: {e}") from e
    return None


@handler("run_script")
def run_script(params: Dict[str, Any]) -> Any:
    """加载 scripts/ 下脚本并调用函数，返回脚本函数的执行结果。

    params:
        script: 脚本文件名（如 "chromadb_script.py"，须位于 scripts/ 内）
        func:   函数名
        args:   位置参数列表
        kwargs: 关键字参数字典

    脚本加载失败 / 函数不存在 / 函数执行异常时直接抛错
    （经 RPC error 通道回传宿主，由桥接层转为 RuntimeError）。
    """
    script_name = str(params.get("script") or "").strip()
    func_name = str(params.get("func") or "").strip()
    args = params.get("args") or []
    kwargs = params.get("kwargs") or {}

    if not script_name or not func_name:
        raise RuntimeError("run_script requires 'script' and 'func'")

    script_path = os.path.normpath(os.path.join(_SCRIPTS_DIR, script_name))
    # 防目录穿越：解析后必须仍在 scripts/ 目录内
    if not script_path.startswith(_SCRIPTS_DIR + os.sep):
        raise RuntimeError("Access denied: script must be inside the scripts directory")

    if not os.path.isfile(script_path):
        raise RuntimeError(f"Script {script_name} not found")

    module = _load_module(script_path)
    if module is None:
        raise RuntimeError(f"Failed to load module {script_name}")

    if not hasattr(module, func_name):
        raise RuntimeError(f"Function {func_name} not found in {script_name}")

    func = getattr(module, func_name)
    return func(*args, **kwargs)


@handler("list_scripts")
def list_scripts(_params: Dict[str, Any]) -> Dict[str, Any]:
    """列出可用脚本与其函数名（调试用）。"""
    result: Dict[str, Any] = {}
    if os.path.isdir(_SCRIPTS_DIR):
        for name in sorted(os.listdir(_SCRIPTS_DIR)):
            if not name.endswith(".py"):
                continue
            path = os.path.join(_SCRIPTS_DIR, name)
            try:
                module = _load_module(path)
                funcs = [
                    f
                    for f in dir(module)
                    if not f.startswith("_") and callable(getattr(module, f, None))
                ]
                result[name] = funcs
            except Exception as e:
                result[name] = [f"<load error: {e}>"]
    return result


if __name__ == "__main__":
    run()
