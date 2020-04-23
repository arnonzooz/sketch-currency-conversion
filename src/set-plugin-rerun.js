var Settings = require("sketch/settings");

export const setPluginRerunStart = (context) => {
    Settings.setSessionVariable("currConvRerunTrigerred", true);
};

export const setPluginRerunFinish = (context) => {
    Settings.setSessionVariable("currConvRerunTrigerred", false);
};