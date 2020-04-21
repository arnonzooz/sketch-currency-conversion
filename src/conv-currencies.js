import { getCurrencies } from "./api-currencies";
const { Document, UI, Settings } = require("sketch");
const { convert } = require("cashify");
const validator = require("validator");

let document = Document.getSelectedDocument();
let selectedLayers = document.selectedLayers;
let inputCancelled = false;
let localeSetting = Settings.sessionVariable("selectedLocale")
  ? Settings.sessionVariable("selectedLocale")
  : undefined;
const selectedCurrencies = [{ type: "source" }, { type: "target" }];

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
          description:
            "Locale: " +
            (Settings.sessionVariable("selectedLocaleName")
              ? Settings.sessionVariable("selectedLocaleName")
              : "Default (Machine)"),
          initialValue:
            currObj.type === "source" &&
            Settings.sessionVariable(currObj.type + "Curr")
              ? Settings.sessionVariable(currObj.type + "Curr")
              : currObj.type === "source"
              ? "EUR"
              : currObj.type === "target" &&
                Settings.sessionVariable(currObj.type + "Curr")
              ? Settings.sessionVariable(currObj.type + "Curr")
              : "EUR",
          type: UI.INPUT_TYPE.selection,
          possibleValues: Settings.sessionVariable("convRates").sort(),
        },
        (err, value) => {
          if (err) {
            // most likely the user canceled the input
            return (inputCancelled = true);
          }
          Settings.setSessionVariable(currObj.type + "Curr", value);
        }
      );
    }
  });

  Settings.setSessionVariable("rememberRates", selectedCurrencies);
  getCurrencies(undefined, Settings.sessionVariable("sourceCurr"))
    .then((result) => {
      selectedLayers.forEach((layer) => {
        if (validator.isNumeric(layer.text)) {
          let convResult = convert(layer.text, {
            from: Settings.sessionVariable("sourceCurr"),
            to: Settings.sessionVariable("targetCurr"),
            base: result.base,
            rates: result.rates,
          });
          const formattedResult = convResult.toLocaleString(localeSetting, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });
          layer.text = formattedResult;
          if (!hasDecimals(layer.text)) {
            layer.text = parseFloat(layer.text).toFixed(2);
          }
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
