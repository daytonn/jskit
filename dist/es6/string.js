/* jshint esnext: true */
import _ from "lodash";

export default {
  camelize: function(string="") {
    return _(string.split(/_|-|\s/g)).map(function(part, i) {
      return (i > 0) ? part.charAt(0).toUpperCase() + part.slice(1) : part.toLowerCase();
    }).join("");
  },

  capitalize: function(string="") {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  chunk: function(string, chunkSize) {
    string = string || "";
    chunkSize = chunkSize ? chunkSize : string.length;
    return string.match(new RegExp(".{1," + chunkSize + "}", "g"));
  },

  compact: function(string="") {
    return string.replace(/\s/g, "");
  },

  constantize: function(string="") {
    if (string.match(/_|-|\s/)) {
      var s = _(string.split(/_|-|\s/g)).map(function(part, i) {
        return (i > 0) ? part.charAt(0).toUpperCase() + part.slice(1) : part.toLowerCase();
      }).join("");
      string = s;
    } else {
      string = string.toString();
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  dasherize: function(string="") {
    return string.replace(/_/g, "-").toLowerCase();
  },

  humanize: function(string="") {
    var s = string.replace(/_/g, " ").replace(/^\s?/, "").toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  },

  hyphenate: function(string="") {
    return string.replace(/([A-Z])/g, " $1").toLowerCase().replace(/\s|_/g, "-").toLowerCase();
  },

  isBlank: function(string="") {
    return (/^(\s?)+$/).test(this);
  },

  isEmpty: function(string="") {
    return string.length === 0;
  },

  isNotEmpty: function(string="") {
    return string.length > 0;
  },

  isPresent: function(string="") {
    return !(/^(\s?)+$/).test(this);
  },

  lstrip: function(string="") {
    return string.replace(/^\s+/, "");
  },

  ltrim: function(string="") {
    return string.replace(/^\s+/, "");
  },

  stripTags: function(string="") {
    return string.replace(/<\w+(\s+("[^"]*"|"[^"]*"|[^>])+)?>|<\/\w+>/gi, "");
  },

  strip: function(string="") {
    return string.replace(/^\s+(.+)\s+$/, "$1");
  },

  swapCase: function(string="") {
    return string.replace(/[A-Za-z]/g, function(s) {
      return (/[A-Z]/).test(s) ? s.toLowerCase() : s.toUpperCase();
    });
  },

  titleCase: function(string="") {
    return _(string.replace(/([A-Z])/g, " $1").replace(/-|_/g, " ").split(/\s/)).map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }).join(" ");
  },

  titleize: function(string="") {
    return _(string.replace(/([A-Z])/g, " $1").replace(/-|_/g, " ").split(/\s/)).map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }).join(" ");
  },

  toBoolean: function(string="") {
    var truthyStrings = ["true", "yes", "on", "y"];
    var falseyStrings = ["false", "no", "off", "n"];
    if (_(truthyStrings).contains(string.toLowerCase())) {
      return true;
    } else if (_(falseyStrings).contains(string.toLowerCase())) {
      return false;
    } else {
      return string.length > 0 ? true : false;
    }
  },

  toNumber: function(string="") {
    return this * 1 || 0;
  },

  trim: function(string="") {
    return string.replace(/^\s+(.+)\s+$/, "$1");
  },

  truncate: function(string, length) {
    string = string || "";
    return (string.length > length) ? string.substring(0, length) + "..." : this;
  },

  underscore: function(string="") {
    return string.replace(/([A-Z])/g, " $1").replace(/^\s?/, "").replace(/-|\s/g, "_").toLowerCase();
  },

  unescape: function(string="") {
    return _.unescape.apply(this, [this].concat(_.toArray(arguments)));
  },

  unwrap: function(string, wrapper) {
    string = string || "";
    return string.replace(new RegExp("^" + wrapper + "(.+)" + wrapper + "$"), "$1");
  },

  wordCount: function(string, word) {
    string = string || "";
    var matches;
    string = string.stripTags();
    matches = (word) ? string.match(new RegExp(word, "g")) : string.match(/\b[A-Za-z_]+\b/g);
    return matches ? matches.length : 0;
  },

  wrap: function(string, wrapper) {
    string = string || "";
    return wrapper.concat(this, wrapper);
  }
};
