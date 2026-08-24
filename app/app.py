

from app import create_app
from app.websocket_server import start_websocket_server
from flask import jsonify


app = create_app()


@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    # start_websocket_server()  # Start the WebSocket server in a separate thread
    app.run(host='0.0.0.0', port=5000, debug=True)

