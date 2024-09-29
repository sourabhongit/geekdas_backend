const users = [
   { username: 'admin', password: 'abc2@bcr' },
];

exports.findUser = (username) => {
   return users.find(user => user.username === username);
};