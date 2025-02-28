# from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
# import torch
# from huggingface_hub import login
# import os
# import dotenv
#
# # Replace with your Hugging Face access token
# huggingface_token = os.getenv("OPENAI_API_KEY")  # Replace with your actual token
#
# # Log in to Hugging Face
# login(token=huggingface_token)
#
# # Model identifier
# model_name = "meta-llama/Meta-Llama-3-8B"
#
# # # Load the tokenizer and model directly from Hugging Face
# # pipe = pipeline("text-generation", model="meta-llama/Meta-Llama-3-8B")
# try:
#     tokenizer = AutoTokenizer.from_pretrained(model_name)
#     model = AutoModelForCausalLM.from_pretrained(
#         model_name,
#         device_map="auto",
#         torch_dtype=torch.bfloat16,
#     )
# except OSError as e:
#     print(f"Error loading model: {e}")
#     print("Ensure you have logged in, requested access, and have internet connection.")
#     exit()
# except Exception as e:
#     print(f"An unexpected error occurred during model loading: {e}")
#     exit()
#
# # Create the pipeline
# medical_llm = pipeline("text-generation", model=model, tokenizer=tokenizer)
#
# def consult_llm(symptoms):
#     """Send symptoms to LLM for diagnosis"""
#     prompt = f"""
#     The user reports the following symptoms: {symptoms}.
#     Please analyze these symptoms and provide a possible diagnosis, potential causes, and recommended next steps.
#     """
#     response = medical_llm(prompt, max_length=200, do_sample=True)
#     return response[0]["generated_text"]
#
# # Example LLM Diagnosis
# user_symptoms = "fever, body aches, severe headache, vomiting"
# llm_diagnosis = consult_llm(user_symptoms)
#
# print("LLM Diagnosis:", llm_diagnosis)