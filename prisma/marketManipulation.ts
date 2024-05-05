import { marketCrash } from "../functions/marketCrash";
import { bullMarket } from "../functions/bullMarket";

const args = process.argv.slice(2);
let influenceType = args[0];

async function main() {
  if (influenceType === "Bear") {
    await marketCrash();
  } else if (influenceType === "Bull") {
    await bullMarket();
  } else {
    console.log(
      "No parameter provided, proceeding to random Market Manipulation"
    );
    const influenceOptions = ["Bear", "Bull"];
    const index = Math.floor(Math.random() * influenceOptions.length);
    let randominfluenceType = influenceOptions[index];
    console.log("Random Market Manipulation: ", randominfluenceType);
    if (randominfluenceType === "Bear") {
      await marketCrash();
    } else if (randominfluenceType === "Bull") {
      await bullMarket();
    }
  }
}

await main().catch(console.error);
