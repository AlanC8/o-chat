const socket = io();

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  clientsTotal.innerHTML = `<h3 class="clients-total" id="clients-total">Total Clients: ${data}</h3>`;
});

const sendMessage = () => {
  if (messageInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date().toLocaleTimeString(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
};

socket.on("chat-message", (data) => {
  console.log(data);
  addMessageToUI(false, data);
});

let bool = false;
socket.on('connect', () => {
  let status = document.getElementById('user-status');
  status.innerHTML = 'Online';
  bool = true;
});

const addMessageToUI = (isOwnMessage, data) => {
  clearFeedback();
  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
      <p class="message">
        ${data.message}
        <span>${data.name} | ${data.dateTime} | ${bool === true ? 'Online' : 'Offline'}</span>
  
      </p>
    </li>
  `;
  messageContainer.innerHTML += element;
  scrollToBottom();
};

function scrollToBottom() {
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message...`,
  });
});
messageInput.addEventListener("keypress", () => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message...`,
  });
});
messageInput.addEventListener("blur", () => {
  socket.emit("feedback", {
    feedback: ``,
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `<li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>`;

  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
