var Settings = require('sketch/settings')
var UI = require("sketch/ui");

export const getCurrencies = (context, base, callback) => {
    let url = !base ? "https://api.exchangeratesapi.io/latest" : "https://api.exchangeratesapi.io/latest?base=" + base
    fetch(url)
    .then(function(response) {
        if (!response.ok) {
            return callback(response.statusText, undefined);
        }
        response.json().then((data) => {
          // Add EUR since it is not included as EUR is the base
          if (!base) {
            data.rates.EUR = 1;  
            Settings.setSessionVariable('convRates', Object.keys(data.rates))
          }
          else {
              callback("undefined", data)
          }
        });
    }).catch(function(error) {
        UI.alert("Cannot Fetch Conversion Rates", "Hey there UX Engineer! Looks like there's no network. You'll have to convert all amounts manually, sorry.")
        console.log(error)
    });
}

