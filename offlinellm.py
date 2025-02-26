from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

# Initialize the Ollama model
llm = OllamaLLM(model="llama3.2:latest")

# Create a prompt template
template = """
The user reports the following symptoms: {symptoms}.
Please analyze these symptoms and provide a possible diagnosis, potential causes, and recommended next steps.
"""

prompt = PromptTemplate(input_variables=["symptoms"], template=template)

# Corrected LLM Chain (Prompt First, Then LLM)
llm_chain = prompt | llm

def consult_llm(symptoms):
    """Stream response from LangChain Ollama model"""
    response = llm_chain.stream({"symptoms": symptoms})  # Enable streaming
    for chunk in response:
        if hasattr(chunk, "content"):
            yield chunk.content  # Corrected key
        else:
            yield str(chunk)  # Fallback in case structure is unexpected

