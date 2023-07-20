from flask_socketio import SocketIO, join_room, emit

socketio = SocketIO(cors_allowed_origins="*", logger=True, engineio_logger=True)

rooms = {}

@socketio.on("join")
def join_room(data):
    username = data['username']
    room = data['room']
    join_room(room)
    if room in rooms:
        rooms[room].users.append(username)
    print(rooms)
    emit('message', {data: username + 'has joined the lobby!'}, to=room)

@socketio.on("check_room")
def check_room(lobbyId):
    print('checking room')
    print(rooms)
    if not lobbyId in rooms:
        emit("room_not_found")
    
@socketio.on("create_room")
def create_room(lobbyId, username):
    rooms[lobbyId] = {'users': []}
    rooms[lobbyId]['users'].append(username)
    print(rooms)