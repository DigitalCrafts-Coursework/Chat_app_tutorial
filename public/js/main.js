const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//1.get username and room values from the url (after typing in "username" and "room" into chat login page)
//qs package("Qs" is the Qs library- interestingly no node package installed?) parses the url(location.search = url)
//ignoreQueryPrefix = true, ignores the "?" at the beginning of url extension
//this is destructuring ({ key1, key2, etc...}), storing multiple values from an object at once
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);
console.log(room);

const socket = io();

//2.join selected room with username entered
socket.emit("joinRoom", { username, room });

//4b.5b.6b.8b.10b.when client receives message it logs it
socket.on("message", (message) => {
  console.log(message);
  //writes messages received from the server in the clients browser
  outputMessage(message);
  //autoscrolls messages down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//outputs texts to the dom (could put in utils folder, should do that)
function outputMessage(message) {
  const div = document.createElement("div");
  if (message.username === username) {
    div.classList.add("own-message");
  } else {
    div.classList.add("other-message");
  }
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//writes room name and users in the sidebar
socket.on("roomUsers", ({ room, users }) => {
  writeRoomNameAndUsers(room, users);
});

function writeRoomNameAndUsers(room, users) {
  console.log(JSON.stringify(users));
  const roomName = document.getElementById("room-name");
  roomName.textContent = room;
  const roomOccupants = document.getElementById("users");
  roomOccupants.innerHTML = ``;
  for (let i = 0; i < users.length; i++) {
    roomOccupants.innerHTML += `<li>${users[i].username}</li>`;
  }
}

//typing animation
// const inputBox = document.getElementById("msg");
// msg.addEventListener("keydown", () => {
//   console.log("button down");
//   socket.emit("typing", "typing...");
// });

//attempt to receive message
// socket.on("image", function (data) {
//   console.log(`here is the ${data}`);
//   // const requestBodyObject = JSON.parse(decodedRequestBodyString.toString(data));

//   console.log(atob(data));
//   // var imgArray = new Uint8Array(data.buffer);
//   const src = `data:image/png;base64, ${data}`;
//   const image = document.querySelector(".bart");
//   image.src = src;
// });

//

// user chat input box, send to the server
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputBox = document.getElementById("msg");
  const msg = inputBox.value;
  console.log(msg);
  //send (emit) message to the server
  socket.emit("chatMessage", msg);
  //clear the chat input box, and focus on the box after button click
  inputBox.value = "";
  inputBox.focus();
});
