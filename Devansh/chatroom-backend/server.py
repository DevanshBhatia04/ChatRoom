import asyncio
import websockets
import os

clients = set()

async def handle_message(websocket, path):
    clients.add(websocket)
    try:
        async for message in websocket:
            for client in clients:
                if client != websocket:
                    await client.send(message)
    finally:
        clients.remove(websocket)

async def main():
    port = int(os.getenv('PORT', 8080))
    # Listen on all available network interfaces
    async with websockets.serve(handle_message, '192.168.70.42', port):
        print(f'Server started. Listening on ws://192.168.1.93:{port}')
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
