const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
];

const user = { id: "", name: "", color: "" };
let websocket;

const createMessageElement = (content, sender, senderColor, isSelf) => {
    const div = document.createElement("div");
    div.classList.add(isSelf ? "message--self" : "message--other");

    if (!isSelf) {
        const span = document.createElement("span");
        span.classList.add("message--sender");
        span.style.color = senderColor;
        span.textContent = sender;
        div.appendChild(span);
    }

    div.innerHTML += content;
    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data);
    const isSelf = userId === user.id;
    const message = createMessageElement(content, userName, userColor, isSelf);
    chatMessages.appendChild(message);
    scrollScreen();
};

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const handleLogin = (event) => {
    event.preventDefault();

    user.id = generateUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    // websocket = new WebSocket("ws://localhost:8080");
    websocket = new WebSocket("ws://192.168.70.42:8080");


    websocket.onmessage = processMessage;
    
    websocket.onerror = (error) => {
        alert("WebSocket Error: ", error);
    };

    websocket.onclose = () => {
        alert("WebSocket closed");
    };
};

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    };

    const messageElement = createMessageElement(message.content, message.userName, message.userColor, true);
    chatMessages.appendChild(messageElement);
    scrollScreen();

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
