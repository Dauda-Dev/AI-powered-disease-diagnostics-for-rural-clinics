import os
import json
import groq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_huggingface import HuggingFaceEmbeddings
from flask.cli import load_dotenv

load_dotenv()

VECTOR_DB_PATH = "../vector_store"
HISTORY_FILE = "../history_store/message_history.json"
MAX_HISTORY = 5  # Number of user-bot exchanges to keep

# Set your Groq API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Replace with your actual API key

# Initialize Groq client
groq_client = groq.Client(api_key=GROQ_API_KEY)

# Ensure the JSON file exists
if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)  # Create an empty JSON list

# Load existing history from the file
try:
    with open(HISTORY_FILE, "r") as f:
        MESSAGE_HISTORY = json.load(f)
except json.JSONDecodeError:
    MESSAGE_HISTORY = []  # Reset history if JSON is corrupted


def save_history():
    """Saves the message history to a JSON file."""
    with open(HISTORY_FILE, "w") as f:
        json.dump(MESSAGE_HISTORY, f, indent=4)


def create_vector_embeddings():
    """Loads or creates FAISS vector store."""
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    if os.path.exists(VECTOR_DB_PATH):
        vectors = FAISS.load_local(VECTOR_DB_PATH, embedding_model, allow_dangerous_deserialization=True)
    else:
        print("Creating vector store...")
        loader = PyPDFDirectoryLoader("../rag_data")
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        final_documents = text_splitter.split_documents(docs)
        vectors = FAISS.from_documents(final_documents, embedding_model)
        vectors.save_local(VECTOR_DB_PATH)
    return vectors


def consult_rag_llm_groq_with_history(question, model_name="mixtral-8x7b-32768"):
    """Handles user queries using RAG-based retrieval and response generation."""

    # Limit conversation history length
    while len(MESSAGE_HISTORY) > MAX_HISTORY * 2:  # Each exchange has user + AI response
        MESSAGE_HISTORY.pop(0)  # Remove the oldest message

    # Save updated history
    save_history()

    # Format history as context
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in MESSAGE_HISTORY])

    prompt = f"""
    You are an AI-powered medical assistant for a rural clinic.
    Your task is to provide a **brief diagnosis** based on the user's symptoms and suggest **possible treatments** if applicable.
    Keep responses **concise and clear**, avoiding complex medical terms. also refer to the user by name if the name is provided.

    <history>
    {history_text}
    </history>

    **Symptoms Provided:** {question}

    **Diagnosis:** [Provide a brief possible diagnosis]  
    **Possible Treatment:** [List treatment options, if any]  
    **Next Steps:** [If necessary, suggest actions like seeing a doctor or self-care measures]
    """

    vectors = create_vector_embeddings()
    retriever = vectors.as_retriever()
    retrieved_docs = retriever.invoke(question)  # Get relevant documents

    context = "\n".join([doc.page_content for doc in retrieved_docs])  # Extract document content

    # Make request to Groq
    response = groq_client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are an AI medical assistant helping rural patients."},
            {"role": "user", "content": prompt.format(context=context)}
        ],
        temperature=0.5
    )

    answer = response.choices[0].message.content.strip()

    # Store the current question in history
    MESSAGE_HISTORY.append({"role": "user", "content": question})

    # Store AI response in history
    MESSAGE_HISTORY.append({"role": "ai", "content": answer})

    # Save updated history again
    save_history()

    return answer
