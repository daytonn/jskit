(function() {
  $(".method.private").addClass("hidden");
  $(".method.inherited").addClass("hidden");
  $(".method.deprecated").addClass("hidden");

  var reduce = _.reduce;
  var optionsForm = $("#options-form");
  var options = reduce(optionsForm.find("label"), function(memo, option) {
    var $option = $(option);
    var text = $option.find(".button-group-item").text().toLowerCase();
    var input = $option.find("input");
    var checked = input.is(":checked");

    memo[text] = { input: input, checked: checked };
    return memo;
  }, {});

  showPrivateMethods();
  showInheritedMethods();
  showDeprecatedMethods();
  showStaticMethods();

  options.private.input.on("change", function() {
    showPrivateMethods();
  });

  options.inherited.input.on("change", function() {
    showInheritedMethods();
  });

  options.deprecated.input.on("change", function() {
    showDeprecatedMethods();
  });

  options.static.input.on("change", function() {
    showStaticMethods();
  });

  function showPrivateMethods() {
    $(".method.private").toggleClass("hidden", !options.private.input.is(":checked"));
  }

  function showInheritedMethods() {
    $(".method.inherited").toggleClass("hidden", !options.inherited.input.is(":checked"));
  }

  function showDeprecatedMethods() {
    $(".method.deprecated").toggleClass("hidden", !options.deprecated.input.is(":checked"));
  }

  function showStaticMethods() {
    $("#static-methods").toggleClass("hidden", !options.static.input.is(":checked"));
  }

  hljs.initHighlightingOnLoad();
})();
