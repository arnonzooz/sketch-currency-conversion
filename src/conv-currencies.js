import { getCurrencies } from "./api-currencies";
const { Document, UI, Settings } = require("sketch")
const { convert } = require("cashify");

let document = Document.getSelectedDocument();
let selectedLayers = document.selectedLayers;
let inputCancelled = false;

const selectedCurrencies = [
  {
    type: "source",
    currency: null,
  },
  {
    type: "target",
    currency: null,
  },
];

export default function convertMe() {
  if (!Settings.sessionVariable("convRates")) {
    UI.alert(
      "Could Not Fetch Currencies",
      "Hey there UX Engineer! Looks like I could not load the currency list. Try to disable and enable the plugin again."
    );
  }
  selectedCurrencies.forEach((currObj) => {
    if (!inputCancelled) {
      UI.getInputFromUser(
        "Select a " + currObj.type + " currency",
        {
          initialValue: "EUR",
          type: UI.INPUT_TYPE.selection,
          possibleValues: Settings.sessionVariable("convRates").sort(),
        },
        (err, value) => {
          if (err) {
            // most likely the user canceled the input
            return (inputCancelled = true);
          }
          currObj.currency = value;
        }
      );
    }
  });

  getCurrencies(undefined, selectedCurrencies[0].currency)
    .then((result) => {
      selectedLayers.forEach((layer) => {
        let convResult = convert(layer.text, {
          from: selectedCurrencies[0].currency,
          to: selectedCurrencies[1].currency,
          base: result.base,
          rates: result.rates,
        });
        const formattedResult = convResult.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
        layer.text = formattedResult;
        if (!hasDecimals(layer.text)) {
          layer.text = parseFloat(layer.text).toFixed(2);
        }
      });
    })
    .catch((error) => {
      UI.alert("Oops, something went wrong", error);
    });

  function hasDecimals(n) {
    let numberP = n - Math.floor(n) !== 0;

    if (numberP) return true;
    else return false;
  }
}
