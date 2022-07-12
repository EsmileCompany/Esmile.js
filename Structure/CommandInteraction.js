"use strict";

const DataManager = require("./DataManager");
const GuildMember = require("./GuildMember");
const Message = require("./Message");
const User = require("./User");
const Requester = require("../Util/Requester");

class CommandInteraction extends DataManager {
  constructor(client, data) {
    super(client);

    this.parseData(data);
  }

  async reply(data) {
    if (!this.replied)
      throw new Error("El comando no fue respondido o aplazado.");
    if (typeof data === "string") {
      const message = await Requester.create(
        this.client,
        `/interactions/${this.id}/${this.token}/callback`,
        "POST",
        true,
        {
          type: 4,
          data: {
            content: data,
            embeds: [],
            tts: false,
            sticker_ids: [],
            components: [],
            allowed_mentions: this.client.options.allowedMentions,
          },
        }
      );
      return new Message(this.client, message);
    }
    const message = await Requester.create(
      this.client,
      `/interactions/${this.id}/${this.token}/callback`,
      "POST",
      true,
      {
        type: 4,
        data,
      }
    );
    return new Message(this.client, message);
  }

  async editReply(data) {
    if (typeof data === "string") {
      const message = await Requester.create(
        this.client,
        `/webhooks/${this.client.user.id}/${this.token}/messages/@original`,
        "PATCH",
        true,
        {
          content: data,
          embeds: [],
          tts: false,
          sticker_ids: [],
          components: [],
          allowed_mentions: this.client.options.allowedMentions,
        }
      );
      return new Message(this.client, message);
    }

    const message = await Requester.create(
      this.client,
      `/webhooks/${this.client.user.id}/${this.token}/messages/@original`,
      "PATCH",
      true,
      {
        ...data,
      }
    );
    return new Message(this.client, message);
  }

  async deferReply(ephemeral = false) {
    if (this.deferred || this.replied)
      throw new Error("El comando ya ha sido respondido o aplazado.");
    await Requester.create(
      this.client,
      `/interactions/${this.id}/${this.token}/callback`,
      "POST",
      true,
      {
        ephemeral: ephemeral ? 1 << 6 : undefined,
        type: 5,
      }
    );
    this.deferred = true;
    this.replied = true;
    return null;
  }

  deleteReply() {
    if (!this.replied)
      throw new Error("El comando no fue respondido o aplazado.");
    return Requester.create(
      this.client,
      `/webhooks/${this.client.user.id}/${this.token}/messages/@original`,
      "DELETE",
      true
    );
  }

  get guild() {
    return this.guildId ? this.client.guilds.cache.get(this.guildId) : null;
  }

  get channel() {
    return this.channelId
      ? this.client.channels.cache.get(this.channelId)
      : null;
  }

  parseData(data) {
    if (!data) return;

    this.name = data.name;
    this.description = data.description;

    this.id = data.id;
    this.token = data.token;

    this.deferred = false;
    this.replied = false;
    this.guildId = data.guild_id ?? null;
    this.channelId = data.channel_id ?? null;

    this.member =
      this.guild?.members.cache.get(data.member.user.id) ??
      new GuildMember(this.client, data.member, data.member.user, this.guild);
    this.user =
      this.client.users.cache.get(data.member.user.id) ??
      new User(this.client, data.member.user);
  }
}

module.exports = CommandInteraction;
