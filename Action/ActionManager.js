"use strict";

const { readdirSync } = require("node:fs");

class ActionManager {
  constructor(client) {
    this.loaded = {};
    const actions = readdirSync(__dirname);

    for (let action of actions) {
      action = action.replace(".js", "");
      if (action === "ActionManager") continue;
      if (client.options.disabledEvents.includes(action)) continue;
      this.loaded[action] = require(`./${action}`);
    }
  }
}

module.exports = ActionManager;
