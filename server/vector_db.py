import chromadb
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.PersistentClient(path="./farming_db")
collection = chroma_client.get_or_create_collection(name="farming_kb")

def add_to_db(docs, ids, metadatas):
    embeddings = embedding_model.encode(docs).tolist()
    collection.add(
        documents=docs,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas
    )

def query_db(query, location=None, n_results=1):
    if location:
        full_query = f"{query} (Location: {location})"
    else:
        full_query = query
    query_embedding = embedding_model.encode(full_query).tolist()
    results = collection.query(query_embeddings=[query_embedding], n_results=n_results)
    return results["documents"][0], results["metadatas"][0]
