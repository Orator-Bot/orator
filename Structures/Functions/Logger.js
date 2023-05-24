const colors = require("colors");
const time = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });

function logger(message, level = "info") {
  let color;

  switch (level) {
    case "info":
      color = "brightYellow";
      break;
    case "warn":
      color = "brightRed";
      break;
    case "success":
      color = "brightGreen";
      break;
    default:
      color = "brightWhite";
  }

 console.log(
   colors[color](`[${time}] `) + message
   );
}

module.exports = { logger };
