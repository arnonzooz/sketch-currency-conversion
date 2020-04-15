import { getCurrencies } from "./api-currencies";
var sketch = require("sketch/dom");
var UI = require("sketch/ui");
var Settings = require("sketch/settings");
const { convert } = require("cashify");

let document = sketch.Document.getSelectedDocument();
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

  getCurrencies("undefined", selectedCurrencies[0].currency, (error, data) => {
      selectedLayers.forEach((layer) => {
        let result = convert(layer.text, {
          from: selectedCurrencies[0].currency,
          to: selectedCurrencies[1].currency,
          base: data.base,
          rates: data.rates,
        });
        result = result.toFixed(2)
        let formattedResult = result.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        formattedResult = new Intl.NumberFormat({}).format(formattedResult);
        layer.text = formattedResult;
        if (!hasDecimals(layer.text)) {
          layer.text = parseFloat(layer.text).toFixed(2);
        }
      });
    
  });
}

function hasDecimals(n) {
  let numberP = n - Math.floor(n) !== 0;

  if (numberP) return true;
  else return false;
}
