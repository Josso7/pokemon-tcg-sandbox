from flask_socketio import SocketIO, join_room, emit

socketio = SocketIO(cors_allowed_origins="*", logger=True, engineio_logger=True)

rooms = {}

@socketio.on("join_lobby")
def join_lobby(data):
    # print(type(data))
    # print(f'{data} data')
    username = data['username']
    room = data['room']
    # print(room)
    # print(rooms)
    join_room(room)
    if room in rooms:
        users = rooms[room]['users']
        if username not in users: users.append(username)
        # print(rooms)
        emit('user_connected', {'joined': 'success', 'username': username, 'message': username + ' has joined the lobby!'}, to=room, broadcast=True)

@socketio.on("check_room")
def check_room(lobbyId):
    # print('checking room')
    # print(rooms)
    if lobbyId not in rooms:
        emit("room_not_found")
    if lobbyId in rooms:
        emit("room_found", lobbyId)

@socketio.on("create_room")
def create_room(lobbyId, username):
    rooms[lobbyId] = {'users': []}
    rooms[lobbyId]['users'].append(username)
    join_room(lobbyId)
    # print(rooms)

@socketio.on("get_connected_users")
def get_connected_users(room_id):
    room = rooms[room_id]
    print(room)
    users = room['users']
    connected_users = [user for user in users]
    emit('connected_users', connected_users)
