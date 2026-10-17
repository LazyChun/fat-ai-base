from __future__ import annotations

from typing import Any, Dict, List, Optional


def get_version() -> str:
    try:
        from importlib.metadata import version as pkg_version
    except Exception:
        from importlib_metadata import version as pkg_version  # type: ignore

    return pkg_version("chromadb")


def create_collection(
    name: str = "default",
    persist_directory: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    import chromadb

    if persist_directory:
        client = chromadb.PersistentClient(path=persist_directory)
    else:
        client = chromadb.Client()

    collection = client.get_or_create_collection(name=name, metadata=metadata)
    return {"name": collection.name}


def add_documents(
    collection_name: str,
    documents: List[str],
    ids: Optional[List[str]] = None,
    metadatas: Optional[List[Dict[str, Any]]] = None,
    persist_directory: Optional[str] = None,
) -> Dict[str, Any]:
    import chromadb

    if persist_directory:
        client = chromadb.PersistentClient(path=persist_directory)
    else:
        client = chromadb.Client()

    collection = client.get_or_create_collection(name=collection_name)
    collection.add(documents=documents, ids=ids, metadatas=metadatas)
    return {"count": collection.count()}


def query(
    collection_name: str,
    query_texts: List[str],
    n_results: int = 5,
    where: Optional[Dict[str, Any]] = None,
    where_document: Optional[Dict[str, Any]] = None,
    include: Optional[List[str]] = None,
    persist_directory: Optional[str] = None,
) -> Dict[str, Any]:
    import chromadb

    if persist_directory:
        client = chromadb.PersistentClient(path=persist_directory)
    else:
        client = chromadb.Client()

    collection = client.get_or_create_collection(name=collection_name)
    res = collection.query(
        query_texts=query_texts,
        n_results=n_results,
        where=where,
        where_document=where_document,
        include=include,
    )
    return res


def get_or_create_collection(
    collection_name: str,
    persist_directory: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    import chromadb

    if persist_directory:
        client = chromadb.PersistentClient(path=persist_directory)
    else:
        client = chromadb.Client()

    collection = client.get_or_create_collection(name=collection_name, metadata=metadata)
    return {"name": collection.name}


def delete(
    collection_name: str,
    persist_directory: Optional[str] = None,
    where: Optional[Dict[str, Any]] = None,
    ids: Optional[List[str]] = None,
) -> Dict[str, Any]:
    import chromadb

    if persist_directory:
        client = chromadb.PersistentClient(path=persist_directory)
    else:
        client = chromadb.Client()

    collection = client.get_or_create_collection(name=collection_name)
    collection.delete(where=where, ids=ids)
    return {"ok": True}


def add(
    collection_name: str,
    ids: List[str],
    documents: List[str],
    embeddings: Optional[List[List[float]]] = None,
    metadatas: Optional[List[Dict[str, Any]]] = None,
    persist_directory: Optional[str] = None,
) -> Dict[str, Any]:
    import chromadb

    if persist_directory:
        client = chromadb.PersistentClient(path=persist_directory)
    else:
        client = chromadb.Client()

    collection = client.get_or_create_collection(name=collection_name)
    collection.add(ids=ids, documents=documents, embeddings=embeddings, metadatas=metadatas)
    return {"count": collection.count()}


def query_embeddings(
    collection_name: str,
    query_embeddings: List[List[float]],
    n_results: int = 5,
    where: Optional[Dict[str, Any]] = None,
    where_document: Optional[Dict[str, Any]] = None,
    include: Optional[List[str]] = None,
    persist_directory: Optional[str] = None,
) -> Dict[str, Any]:
    import chromadb

    if persist_directory:
        client = chromadb.PersistentClient(path=persist_directory)
    else:
        client = chromadb.Client()

    collection = client.get_or_create_collection(name=collection_name)
    res = collection.query(
        query_embeddings=query_embeddings,
        n_results=n_results,
        where=where,
        where_document=where_document,
        include=include,
    )
    return res
