const FakeYou = require("fakeyou.js")
async function FakeYouClient(client){
  const fy = new FakeYou.Client({
    usernameOrEmail: client.config.FakeYouEmail,
    password: client.config.FakeYouPassword
  });
  await fy.start();
  client.fy = fy
}
module.exports = { FakeYouClient }