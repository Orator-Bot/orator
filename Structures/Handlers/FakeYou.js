const FakeYou = require("fakeyou.js");
async function FakeYouClient(client) {
  const fy = new FakeYou.Client({
    usernameOrEmail: "rishikubba13@gmail.com",
    password: "rishigola",
  });
  await fy.start();
  client.fy = fy;
}
module.exports = { FakeYouClient };
