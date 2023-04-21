const Bitfield = require("./Bitfield");

/**
 * A bitfield that represents the system channel flags.
 * @extends {Bitfield}
 */
class SystemChannelFlags extends Bitfield {
  /**
   * @param {...number} bit - Bit(s) to set initially.
   */
  constructor(...bit) {
    super(bit);
  }
}

/**
 * The default bitfield of a system channel.
 * @type {bigint}
 */
SystemChannelFlags.Default = 0n;

/**
 * Available flags for a system channel.
 * @type {Object<string, bigint>}
 * @readonly
 * @enum {bigint}
 */
SystemChannelFlags.Flags = {
  Suppress_Join_Notifications: 1n << 0n,
  Suppress_Premium_Subscriptions: 1n << 1n,
  Suppress_Guild_Reminder_Notifications: 1n << 2n,
  Suppress_Join_Notification_Replies: 1n << 3n,
  Suppress_Role_Subscription_Purchase_Notifications: 1n << 4n,
  Suppress_Role_Subscription_Purchase_Notification_Replies: 1n << 5n,
};

/**
 * All available flags for a system channel.
 * @type {bigint}
 */
SystemChannelFlags.All = Object.values(SystemChannelFlags.Flags).reduce((a, b) => a | b, SystemChannelFlags.Default);

module.exports = SystemChannelFlags;
