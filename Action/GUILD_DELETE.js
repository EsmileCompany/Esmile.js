"use strict";

const Guild = require("../Structure/Guild");

module.exports.handle = (client, data) => {
  const cachedGuild =
    client.guilds.cache.get(data.id) ?? new Guild(client, data);
  client.guilds.cache.delete(data.id);
  if (cachedGuild) client.emit("ServidorEliminado", cachedGuild);
};
