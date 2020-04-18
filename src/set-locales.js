const { UI, Settings } = require("sketch")

export default function setLocales () {
    UI.getInputFromUser(
        "Select a locale",
        {
          description: "The choice of locale affects the symbol that will be used for the thousands separator used in digit grouping. To use a comma, choose US English. To use a point, choose German Germany.",
          initialValue: Settings.sessionVariable("selectedLocaleName") ? Settings.sessionVariable("selectedLocaleName") : "Default (Machine)",
          type: UI.INPUT_TYPE.selection,
          possibleValues: Object.keys(Settings.sessionVariable("localesCurr"))
        },
        (err, value) => {
          if (err) {
            // most likely the user canceled the input
            return
          }
          Settings.setSessionVariable("selectedLocale", Settings.sessionVariable("localesCurr")[value]);
          Settings.setSessionVariable("selectedLocaleName", value);
          UI.alert("Changed Locale", "Set the locale for formatting amounts to " + value + ".")
        }
      );
};