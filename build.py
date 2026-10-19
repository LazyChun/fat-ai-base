# -*- coding: utf-8 -*-
"""
fat-ai-base 打包脚本 — 生成可安装的 install.zip。

zip 结构（解压到宿主 extensions/bespokePlugins/remote/fat-ai-base/）：
    plugin.json
    dist/remoteEntry.js（Module Federation 前端入口，含其余 js chunk）
    dist/backend/main.py
    dist/backend/plugin_runtime.py
    dist/backend/requirements.txt
    dist/backend/scripts/*.py

用法：
    python build.py            # 输出到 build/install.zip
    python build.py -o out.zip
"""

import argparse
import os
import shutil
import subprocess
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))

# 打包时排除的目录/文件（缓存、venv、已安装依赖）
EXCLUDE_DIRS = {"__pycache__", "vendor", ".venv", "node_modules", ".git", "build", "dist"}
EXCLUDE_FILES = {".deps_installed", ".deps_install_error"}


def _add_backend_files(zf: zipfile.ZipFile) -> int:
    backend_dir = os.path.join(ROOT, "backend")
    if not os.path.isdir(backend_dir):
        raise SystemExit(f"backend directory not found: {backend_dir}")

    count = 0
    for dirpath, dirnames, filenames in os.walk(backend_dir):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for name in sorted(filenames):
            if name in EXCLUDE_FILES or name.endswith(".pyc"):
                continue
            src = os.path.join(dirpath, name)
            rel = os.path.relpath(src, backend_dir)
            arcname = os.path.join("dist", "backend", rel)
            zf.write(src, arcname)
            count += 1
    return count


def _build_frontend() -> None:
    """若存在前端工程且 dist/remoteEntry.js 缺失，先执行 npm run build。"""
    if not os.path.isfile(os.path.join(ROOT, "package.json")):
        return
    entry = os.path.join(ROOT, "dist", "remoteEntry.js")
    if os.path.isfile(entry):
        return
    print("[frontend] dist/remoteEntry.js missing, running npm run build ...")
    # Windows 下 npm 实际是 npm.cmd，需经 shell 解析
    subprocess.run("npm run build", cwd=ROOT, shell=True, check=True)


def _add_frontend_files(zf: zipfile.ZipFile) -> int:
    """把 dist/ 下除 backend/ 子目录外的所有文件加入 zip（跳过 .map）。"""
    dist_dir = os.path.join(ROOT, "dist")
    if not os.path.isdir(dist_dir):
        raise SystemExit(f"dist directory not found: {dist_dir}")

    count = 0
    for dirpath, dirnames, filenames in os.walk(dist_dir):
        if os.path.normpath(dirpath) == os.path.normpath(dist_dir):
            # backend/ 子目录由 _add_backend_files 单独打包
            dirnames[:] = [d for d in dirnames if d != "backend"]
        for name in sorted(filenames):
            if name.endswith(".map"):
                continue
            src = os.path.join(dirpath, name)
            rel = os.path.relpath(src, dist_dir)
            arcname = os.path.join("dist", rel)
            zf.write(src, arcname)
            count += 1
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description="Package fat-ai-base install.zip")
    parser.add_argument("-o", "--output", default=os.path.join(ROOT, "build", "install.zip"))
    args = parser.parse_args()

    manifest_path = os.path.join(ROOT, "plugin.json")
    if not os.path.isfile(manifest_path):
        raise SystemExit(f"plugin.json not found: {manifest_path}")

    out_path = os.path.abspath(args.output)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    if os.path.exists(out_path):
        os.remove(out_path)

    _build_frontend()

    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(manifest_path, "plugin.json")
        n = _add_backend_files(zf)
        m = _add_frontend_files(zf)

    size_kb = os.path.getsize(out_path) / 1024
    print(f"OK: {out_path} ({n} backend files, {m} frontend files, {size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
