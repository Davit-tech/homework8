const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    query: {
        token: localStorage.getItem('token')
    }
});

const userList = document.getElementById('users');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

let selectedUserId = null;

userList.innerHTML = '';

(async () => {
    const {users} = await fetch('/user/users', {
        method: "GET",
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then(res => res.json()).catch(() => ({users: []}));

    users.forEach((user) => {
        const div = document.createElement('div');
        div.textContent = user.userName;

        div.onclick = async () => {
            selectedUserId = user.id;
            messages.innerHTML = '';
            form.style.display = 'flex';

            document.querySelectorAll('#users div').forEach(el => el.classList.remove('active'));
            div.classList.add('active');

            const {messages: list} = await fetch(
                `/chat/messages?to=${selectedUserId}`,
                {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            ).then(res => res.json()).catch(() => ({messages: []}));

            list.forEach((message) => {
                if (message.from === selectedUserId) {
                    addMessage(`${user.userName} → ${message.message}`, 'other');
                } else {
                    addMessage(` ${message.message}`, 'me');
                }
            });
        };

        userList.appendChild(div);
    });
})();

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input.value || !selectedUserId) return;

    addMessage(`Me → ${selectedUserId}: ${input.value}`, 'me');

    await fetch('/chat/send', {
        method: "POST",
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            to: selectedUserId,
            message: input.value,
        }),
    });

    input.value = '';
});

socket.on('new_message', ({from, message}) => {
    if (from === selectedUserId) {
        addMessage(`${from} → Me: ${message}`, 'other');
    }
});

function addMessage(msg, type = 'other') {
    const li = document.createElement('li');
    li.textContent = msg;
    li.className = type === 'me' ? 'message me' : 'message other';
    messages.appendChild(li);
}
