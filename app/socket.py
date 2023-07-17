from flask_socketio import join_room, emit
from app import socketio


rooms = {}

@socketio.on("join")
def join_room(data):
    username = data['username']
    room = data['room']
    join_room(room)
    rooms[room] = {'users': {username}}
    print(rooms)
    emit('message', {data: username + 'has joined the lobby!'}, to=room)

@socketio.on("check_room")
def check_room(lobbyId):
    print('checking room')
    print(rooms)
    if not rooms[lobbyId]:
        emit("room_not_found")