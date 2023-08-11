const Database = require("better-sqlite3");
const color = require("colors");

async function loadDatabase(client) {
  client.logger("├─ Loaded SQL Database.", "success");
  client.database = Database;

  //Cooldowns DB
  const cooldownDB = new client.database("./Database/cooldowns.db");
  cooldownDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS cooldowns(command TEXT, user TEXT, timestamp INTEGER, PRIMARY KEY(command, user));"
    )
    .run();
  client.cooldown = cooldownDB.prepare(
    "SELECT timestamp FROM cooldowns WHERE command = ? AND user = ?"
  );
  client.setcooldown = cooldownDB.prepare(
    "INSERT OR REPLACE INTO cooldowns(command, user, timestamp) VALUES(?, ?, ?)"
  );

  // Panel DB
  const panelDB = new client.database("./Database/panel.db");
  panelDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS panel(guild TEXT PRIMARY KEY, channel TEXT, action TEXT, speaker TEXT)"
    )
    .run();
  client.getpanel = panelDB.prepare("SELECT * FROM panel WHERE guild = ?");
  client.setpanel = panelDB.prepare(
    "INSERT OR REPLACE INTO panel(guild, channel, action, speaker) VALUES(?,?,?,?)"
  );
  client.resetpanel = panelDB.prepare("DELETE FROM panel WHERE guild = ?");

  // Language DB
  const customLang = new client.database("./Database/lang.db");
  customLang
    .prepare(
      "CREATE TABLE IF NOT EXISTS lang(guild TEXT PRIMARY KEY, lang TEXT)"
    )
    .run();
  client.getlang = customLang.prepare("SELECT * FROM lang WHERE guild = ?");
  client.setlang = customLang.prepare(
    "INSERT OR REPLACE INTO lang(guild, lang) VALUES(?,?)"
  );

  // Orator VC DB
  const oratorvcdb = new client.database("./Database/oratorvc.db");
  oratorvcdb
    .prepare(
      "CREATE TABLE IF NOT EXISTS oratorvc(guild TEXT PRIMARY KEY, channel TEXT)"
    )
    .run();
  client.setoratorvc = oratorvcdb.prepare(
    "INSERT OR REPLACE INTO oratorvc(guild, channel) VALUES(?,?)"
  );
  client.getoratorvc = oratorvcdb.prepare(
    "SELECT * FROM oratorvc WHERE guild = ?"
  );
  client.resetoratorvc = oratorvcdb.prepare(
    "DELETE FROM oratorvc WHERE guild = ?"
  );

  // Prefix DB
  const prefixdb = new client.database("./Database/prefix.db");
  prefixdb
    .prepare(
      "CREATE TABLE IF NOT EXISTS prefix(guild TEXT PRIMARY KEY, prefix TEXT)"
    )
    .run();
  client.prefix = prefixdb.prepare("SELECT * FROM prefix WHERE guild = ?");
  client.setprefix = prefixdb.prepare(
    "INSERT OR REPLACE INTO prefix(guild, prefix) VALUES(?,?)"
  );
  client.resetprefix = prefixdb.prepare("DELETE FROM prefix WHERE guild = ?");

  // Custom Language DB
  const customVoice = new client.database("./Database/customLang.db");
  customVoice
    .prepare(
      "CREATE TABLE IF NOT EXISTS customLang(guild TEXT, user TEXT, sound TEXT)"
    )
    .run();
  client.customlang = customVoice.prepare(
    "SELECT * FROM customLang WHERE guild = ? AND user = ?"
  );
  client.setcustomlang = customVoice.prepare(
    "INSERT OR REPLACE INTO customLang(guild, user, sound) VALUES(?, ?, ?)"
  );

  // Logs DB
  const logsdb = new client.database("./Database/logs.db");
  logsdb
    .prepare(
      "CREATE TABLE IF NOT EXISTS logsdb(guild INTEGER PRIMARY KEY, channel TEXT)"
    )
    .run();
  client.setlogs = logsdb.prepare(
    "INSERT OR REPLACE INTO logsdb(guild, channel) VALUES(?,?);"
  );
  client.ttslogs = logsdb.prepare("SELECT * FROM logsdb WHERE guild = ?;");
  client.resetlogs = logsdb.prepare("DELETE FROM logsdb WHERE guild = ?;");

  // Join To Create Database
  const jtcdatabase = new client.database("./Database/jointocreate.db");
  jtcdatabase
    .prepare(
      "CREATE TABLE IF NOT EXISTS jointocreate(guild TEXT PRIMARY KEY, channel TEXT)"
    )
    .run();
  client.jtc = jtcdatabase.prepare(
    "SELECT * FROM jointocreate WHERE guild = ?"
  );
  client.setjtc = jtcdatabase.prepare(
    "INSERT OR REPLACE INTO jointocreate(guild, channel) VALUES(?,?)"
  );

  // Blacklist Word
  const blacklistwordDB = new client.database("./Database/blacklistword.db");
  blacklistwordDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS blacklistword(guild_id TEXT, word TEXT, PRIMARY KEY(guild_id, word))"
    )
    .run();
  client.setblacklistword = blacklistwordDB.prepare(
    "INSERT OR IGNORE INTO blacklistword(guild_id, word) VALUES(?,?)"
  );
  client.getblacklistword = blacklistwordDB.prepare(
    "SELECT word FROM blacklistword WHERE guild_id = ?"
  );
  client.resetblacklistword = blacklistwordDB.prepare(
    "DELETE FROM blacklistword WHERE guild_id = ? AND word = ?"
  );

  // Blacklist User
  const blacklistuserDB = new client.database("./Database/blacklistuser.db");
  blacklistuserDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS blacklistuser(guild_id TEXT, user_id TEXT, PRIMARY KEY(guild_id, user_id))"
    )
    .run();
  client.setblacklistuser = blacklistuserDB.prepare(
    "INSERT OR IGNORE INTO blacklistuser(guild_id, user_id) VALUES(?,?)"
  );
  client.getblacklistuser = blacklistuserDB.prepare(
    "SELECT * FROM blacklistuser WHERE guild_id = ? AND user_id = ?"
  );
  client.resetblacklistuser = blacklistuserDB.prepare(
    "DELETE FROM blacklistuser WHERE guild_id = ? AND user_id = ?"
  );

  // Blacklist Role
  const blacklistroleDB = new client.database("./Database/blacklistrole.db");
  blacklistroleDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS blacklistrole(guild_id TEXT, role_id TEXT, PRIMARY KEY(guild_id, role_id))"
    )
    .run();
  client.setblacklistrole = blacklistroleDB.prepare(
    "INSERT OR IGNORE INTO blacklistrole(guild_id, role_id) VALUES(?,?)"
  );
  client.getblacklistrole = blacklistroleDB.prepare(
    "SELECT * FROM blacklistrole WHERE guild_id = ?"
  );
  client.resetblacklistrole = blacklistroleDB.prepare(
    "DELETE FROM blacklistrole WHERE guild_id = ? AND role_id = ?"
  );

  //Subscription DB
  const subscriptiondb = new client.database("./Database/premium.db");
  subscriptiondb
    .prepare(
      "CREATE TABLE IF NOT EXISTS subscriptions (guild_id TEXT PRIMARY KEY, user_id TEXT, expires INTEGER)"
    )
    .run();
  client.premiumdb = subscriptiondb;

  //Webhook Channel
  const webhookDB = new client.database("./Database/webhookpanel.db");
  webhookDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS webhookchannel(guild_id TEXT PRIMARY KEY, channel TEXT)"
    )
    .run();
  client.webhookdb = webhookDB;

  //Webhook VC
  webhookDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS webhookvc(guild_id TEXT PRIMARY KEY, channel TEXT)"
    )
    .run();

  //Beta Program DB
  const betaDB = new client.database("./Database/beta.db");
  client.betadb = betaDB;
  betaDB
    .prepare("CREATE TABLE IF NOT EXISTS beta(guild_id TEXT PRIMARY KEY)")
    .run();

  // Changelogs DB
  const updatesDB = new client.database("./Database/changelogs.db");
  updatesDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS updates(id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, message TEXT)"
    )
    .run();
  client.updatesdb = updatesDB;

  // Mail DB
  const mailsDB = new client.database("./Database/mail.db");
  mailsDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS mail(id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, date TEXT, message TEXT)"
    )
    .run();
  client.maildb = mailsDB;

  // AllowRole DB
  const allowRoleDB = new client.database("./Database/allowrole.db");
  allowRoleDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS allowrole (id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,roles TEXT NOT NULL)"
    )
    .run();
  client.allowroledb = allowRoleDB;

  //Hooks Config
  const hooksConfDB = new client.database("./Database/hooksconfig.db");
  hooksConfDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS hooksconfig(guild TEXT PRIMARY KEY, autoleave TEXT)"
    )
    .run();
  client.hooksconfdb = hooksConfDB;

  // Ban User
  const banDB = new client.database("./Database/bans.db");
  banDB.prepare("CREATE TABLE IF NOT EXISTS bans(user_id TEXT)").run();
  client.banuser = banDB.prepare(
    "INSERT OR REPLACE INTO bans(user_id) VALUES(?)"
  );
  client.getbanneduser = banDB.prepare("SELECT * FROM bans WHERE user_id = ?");
  client.unbanuser = banDB.prepare("DELETE FROM bans WHERE user_id = ?");

  // Bot Statistics
  const statisticsDB = new client.database("./Database/stats0.db");
  statisticsDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS statsdb(command TEXT PRIMARY KEY, usage INTEGER DEFAULT 0)"
    )
    .run();
  client.statsdb = statisticsDB;

  // Panel API Config
  const panelAPIDB = new client.database("./Database/panelapi.db");
  panelAPIDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS panelapi(guild TEXT PRIMARY KEY, api TEXT)"
    )
    .run();
  client.panelapi = panelAPIDB;

  // Male API
  const maleAPI = new client.database("./Database/maleapi.db");
  maleAPI
    .prepare(
      "CREATE TABLE IF NOT EXISTS maleapi(guild TEXT PRIMARY KEY, voice TEXT)"
    )
    .run();
  client.maleapi = maleAPI;

  // Voice Role
  const voiceRoleDB = new client.database("./Database/voicerole.db");
  voiceRoleDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS voicerole(guild TEXT PRIMARY KEY, role TEXT)"
    )
    .run();
  client.voicerole = voiceRoleDB;

  // Gift Inventory
  const giftDB = new client.database("./Database/giftinv.db");
  giftDB
    .prepare(
      "CREATE TABLE IF NOT EXISTS giftDB(user TEXT PRIMARY KEY, giftGuild TEXT, time INTEGER)"
    )
    .run();
  client.giftDB = giftDB;
}

module.exports = { loadDatabase };
