//imagine that this is a list of users in the room
const users = [];

//join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

//get the current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//removes user from users array on them leaving
function userLeave(id) {
  //console.log(id);
  //console.log(`these are the users: ${JSON.stringify(users)}`);
  const index = users.indexOf(id);
  // if (index !== -1) {
  //   users.find((user) => {
  //     return user.splice(index, 1);
  //   });
  if (index) {
    users.find((user) => {
      return users.splice(index, 1);
    });
  }
  //console.log(`users after splice users ${JSON.stringify(users)}`);
}
// }

//get all users found in the specific room
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
