const color = require("colors")
const { inspect } = require("util");
module.exports = (client) => {
  client.on("error",(err) => {
    console.log(color.green("[CLIENT ERROR]"))
    console.log(color.brightMagenta("---------------------"))
    console.log(err);
    console.log(color.brightMagenta("---------------------"))
  });
  process.on("unhandledRejection", async (reason, promise) => {
    client.logger("[UNHANDLED REJECTION]", 'warn')
    client.logger(`[${client.time}] ${reason}`, 'warn')
    console.log(color.brightMagenta("---------------------"))
    console.log(promise)
    console.log(color.brightMagenta("---------------------"))
  })
  process.on("uncaughtException", (err, origin) => {
    console.log(color.green("[UNCAUGHT EXCEPTION]"))
    console.log(color.red(`[${client.time}] ${err}`));
    console.log(color.brightMagenta("---------------------"))
    console.log(origin)
    console.log(color.brightMagenta("---------------------"))
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(color.green("[UNCAUGHT EXCEPTION MONITOR]"))
    console.log(color.red(`[${client.time}] ${err}`));
    console.log(color.brightMagenta("---------------------"))
    console.log(origin)
    console.log(color.brightMagenta("---------------------"))
  });

  process.on("warning", (warn) => {
    client.logger("[WARNING]", 'warn')
    console.log(color.brightMagenta("---------------------"))
    console.log(color.red(`[${client.time}] ${warn}`));
    console.log(color.brightMagenta("---------------------"))
  });
};