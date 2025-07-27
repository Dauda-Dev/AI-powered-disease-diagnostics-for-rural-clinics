import asyncio
import websockets
import json

connected_clients = set()

async def handler(websocket, path):
    connected_clients.add(websocket)
    print("Client connected")

    try:
        async for message in websocket:
            print(f"Received from client: {message}")
            await websocket.send(json.dumps({"message": "Echo: " + message}))
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        connected_clients.remove(websocket)

# Shared method to broadcast messages
async def broadcast_recommendation(data):
    message = json.dumps(data)
    for client in connected_clients.copy():
        try:
            await client.send(message)
        except:
            connected_clients.remove(client)

def start_websocket_server():
    import threading
    def run():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        start_server = websockets.serve(handler, "0.0.0.0", 6789)
        loop.run_until_complete(start_server)
        print("WebSocket server started on ws://0.0.0.0:6789")
        loop.run_forever()

    threading.Thread(target=run, daemon=True).start()
