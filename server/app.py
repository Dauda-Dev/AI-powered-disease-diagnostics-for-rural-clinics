from flask import Flask, request, Response, jsonify

from llm.llm_with_history import consult_rag_llm_with_history

app = Flask(__name__)

# @app.route("/diagnose", methods=["POST"])
# def diagnose():
#     """API endpoint for diagnosing symptoms using LLM"""
#     data = request.get_json()
#     symptoms = data.get("symptoms", "")
#
#     if not symptoms:
#         return jsonify({"error": "No symptoms provided"}), 400
#
#     def generate_response():
#         buffer = ""
#         for chunk in consult_llm(symptoms):
#             text = chunk  # Assuming `chunk` is a string
#             buffer += text
#
#             # Stream line-by-line when full stop (.) or space is encountered
#             while "." in buffer or " " in buffer:
#                 if "." in buffer:
#                     split_index = buffer.index(".") + 1
#                 else:
#                     split_index = buffer.index(" ") + 1
#
#                 yield f"data: {buffer[:split_index]}\n\n"
#                 buffer = buffer[split_index:]  # Keep the remaining text in buffer
#
#     return Response(generate_response(), content_type="text/event-stream")


@app.route("/diagnose/rag-llm", methods=["POST"])
def diagnoseRagLlm():
    """API endpoint for diagnosing symptoms using LLM"""
    data = request.get_json()
    symptoms = data.get("symptoms", "")

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    # Get the diagnosis from the RAG-based LLM function
    response_text = consult_rag_llm_with_history(symptoms)

    return jsonify({"diagnosis": response_text})


if __name__ == "__main__":
    app.run(debug=True)
