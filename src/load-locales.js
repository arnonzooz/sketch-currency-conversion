var Settings = require("sketch/settings");
var UI = require("sketch/ui");

const locales =  JSON.parse('{"Default (Machine)":"","US English":"en-US","German Germany": "de-DE"}');

export const loadLocales = (context) => {
    Settings.setSessionVariable("localesCurr", locales);
};