const FakeYou = require("fakeyou.js");
async function FakeYouClient(client) {
  const fy = new FakeYou.Client({
    usernameOrEmail: "oratorbot@gmail.com",
    password: "2374adn",
  });
  await fy.start();
  client.fy = fy;
}
module.exports = { FakeYouClient };
