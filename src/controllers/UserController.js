let users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    const { order } = req.query;
    let parsedUsers = users;

    if (order) {
      parsedUsers = [...users].sort((userA, userB) => {
        if (order === 'desc') {
          return userA.id < userB.id ? 1 : -1;
        }

        return userA.id > userB.id ? 1 : -1;
      });
    }

    return res.send(200, parsedUsers);
  },

  getUserById(req, res) {
    const { id } = req.params;

    const user = users.find((user) => user.id === Number(id));

    if (!user) {
      return res.send(400, { error: 'User not found' });
    }

    return res.send(200, user);
  },

  createUser(req, res) {
    const { name } = req.body;

    const newUser = {
      id: ++users.lastId,
      name,
    };

    users.push(newUser);

    return res.send(201, newUser);
  },

  updateUser(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    const userToUpdate = users.find((user) => user.id === Number(id));

    if (!userToUpdate) {
      return res.send(400, { error: 'User not found' });
    }

    userToUpdate.name = name;

    return res.send(200, userToUpdate);
  },

  deleteUser(req, res) {
    const { id } = req.params;

    const newUsers = users.filter((user) => user.id !== Number(id));
    newUsers.lastId = users.lastId;

    users = newUsers;

    res.send(200);
  },
};
