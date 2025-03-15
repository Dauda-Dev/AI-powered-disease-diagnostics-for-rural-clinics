# import os
# import json
# from langchain_ollama import OllamaLLM
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_core.prompts import ChatPromptTemplate
# from langchain.chains import create_retrieval_chain
# from langchain_community.vectorstores import FAISS
# from langchain_community.document_loaders import PyPDFDirectoryLoader
# from langchain_huggingface import HuggingFaceEmbeddings
#
# VECTOR_DB_PATH = "../vector_store"
# HISTORY_FILE = "../history_store/message_history.json"
# MAX_HISTORY = 5  # Number of user-bot exchanges to keep
#
#
# # Ensure the JSON file exists
# if not os.path.exists(HISTORY_FILE):
#     with open(HISTORY_FILE, "w") as f:
#         json.dump([], f)  # Create an empty JSON list
#
# # Load existing history from the file
# try:
#     with open(HISTORY_FILE, "r") as f:
#         MESSAGE_HISTORY = json.load(f)
# except json.JSONDecodeError:
#     MESSAGE_HISTORY = []  # Reset history if JSON is corrupted
#
#
# def save_history():
#     """Saves the message history to a JSON file."""
#     with open(HISTORY_FILE, "w") as f:
#         json.dump(MESSAGE_HISTORY, f, indent=4)
#
#
# def create_vector_embeddings():
#     """Loads or creates FAISS vector store."""
#     embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
#     if os.path.exists(VECTOR_DB_PATH):
#         vectors = FAISS.load_local(VECTOR_DB_PATH, embedding_model, allow_dangerous_deserialization=True)
#     else:
#         print("Creating vector store...")
#         loader = PyPDFDirectoryLoader("../rag_data")
#         docs = loader.load()
#         text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
#         final_documents = text_splitter.split_documents(docs)
#         vectors = FAISS.from_documents(final_documents, embedding_model)
#         vectors.save_local(VECTOR_DB_PATH)
#     return vectors
#
#
# def consult_rag_llm_with_history(question, model_name="medllama2:latest"):
#     """Handles user queries using RAG-based retrieval and response generation."""
#     llm = OllamaLLM(model=model_name)
#
#
#
#     # Limit conversation history length
#     while len(MESSAGE_HISTORY) > MAX_HISTORY * 2:  # Each exchange has user + AI response
#         MESSAGE_HISTORY.pop(0)  # Remove the oldest message
#
#     # Save updated history
#     save_history()
#
#     # Format history as context
#     history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in MESSAGE_HISTORY])
#
#     prompt = ChatPromptTemplate.from_template(
#         f"""
#         You are an AI-powered medical assistant for a rural clinic.
#         Your task is to provide a **brief diagnosis** based on the user's symptoms and suggest **possible treatments** if applicable.
#         Keep responses **concise and clear**, avoiding complex medical terms.
#
#         <history>
#         {history_text}
#         </history>
#
#         <context>
#         {{context}}
#         </context>
#
#         **Symptoms Provided:** {{input}}
#
#         **Diagnosis:** [Provide a brief possible diagnosis]
#         **Possible Treatment:** [List treatment options, if any]
#         **Next Steps:** [If necessary, suggest actions like seeing a doctor or self-care measures]
#         """
#     )
#
#     vectors = create_vector_embeddings()
#     document_chain = create_stuff_documents_chain(llm, prompt)
#     retriever = vectors.as_retriever()
#     retrieval_chain = create_retrieval_chain(retriever, document_chain)
#
#     response = retrieval_chain.invoke({'input': question})
#
#     # Store the current question in history
#     MESSAGE_HISTORY.append({"role": "user", "content": question})
#
#     # Store AI response in history
#     MESSAGE_HISTORY.append({"role": "ai", "content": response['answer']})
#
#     # Save updated history again
#     save_history()
#
#     return response['answer']
#
