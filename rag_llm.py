import os
from langchain_groq import ChatGroq
from langchain_ollama import OllamaLLM
from langchain_openai import  OpenAIEmbeddings
from langchain_community.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader

VECTOR_DB_PATH="./vector_store"

def create_vector_embeddings():
    embeddings = OllamaEmbeddings(model="llama3.2:latest")
    if os.path.exists(VECTOR_DB_PATH):
        vectors = FAISS.load_local(VECTOR_DB_PATH, embeddings)
    else:
        loader = PyPDFDirectoryLoader("./rag_data")
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        final_documents = text_splitter.split_documents(docs)
        vectors = FAISS.from_documents(final_documents, embeddings)
        vectors.save_local(VECTOR_DB_PATH)
    return vectors

def consult_rag_llm(question, model_name="llama3.2:latest"):
    llm = OllamaLLM(model=model_name)

    prompt = ChatPromptTemplate.from_template(
        """
            You are a helpful AI-powered disease diagnostic system in a rural clinic, please answer the question based on the 
            provided context only. Please provide the most accurate response to the question.
            If you do no not know the answer, please say"I don’t know the answer to that. Please consult your medical professional."
            <context>
            {context}
            <context>
    
            Question: {input}
        """
    )
    vectors = create_vector_embeddings()
    document_chain = create_stuff_documents_chain(llm, prompt)
    retriever = vectors.as_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    response = retrieval_chain.invoke({'input': question})
    return response['answer']


