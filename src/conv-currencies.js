var sketch = require("sketch/dom");
var UI = require("sketch/ui");

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

export function convertMe() {
  getCurrencyList((error, result) => {
    if (error) {
      return console.log(error);
    }

    selectedCurrencies.forEach((currObj) => {
      if (!inputCancelled) {
        UI.getInputFromUser(
          "Select a " + currObj.type + " currency",
          {
            initialValue: "EUR",
            type: UI.INPUT_TYPE.selection,
            possibleValues: result.sort(),
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

    fetch(
      "https://api.exchangeratesapi.io/latest?base=" +
        selectedCurrencies[0].currency
    ).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          return console.log("error");
        }
        selectedLayers.forEach((layer) => {
          if (!isNaN(layer.text)) {
            const result = convert(layer.text, {
              from: selectedCurrencies[0].currency,
              to: selectedCurrencies[1].currency,
              base: data.base,
              rates: data.rates,
            });
            const formattedResult = new Intl.NumberFormat({
              maximumSignificantDigits: 3,
            }).format(result);
            layer.text = formattedResult.toString();
          }
        });
      });
    });
  });
}

function getCurrencyList(callback) {
  fetch("https://api.exchangeratesapi.io/latest").then((response) => {
    response.json().then((data) => {
      if (data.error) {
        return callback("Could not fetch exchange rates.", undefined);
      }
      // Add EUR since it is not included as EUR is the base
      data.rates.EUR = 1;
      callback(undefined, Object.keys(data.rates));
    });
  });
}
