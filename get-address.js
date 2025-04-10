const Arweave = require("arweave");
const wallet = require("./src/arweave-keyfile.json");

const arweave = Arweave.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
});

async function getAddress() {
  const address = await arweave.wallets.jwkToAddress(wallet);
  console.log("Your wallet address:", address);
}

getAddress();