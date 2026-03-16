window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on("shopify:section:load", this._onSectionLoad.bind(this))
    .on("shopify:section:unload", this._onSectionUnload.bind(this))
    .on("shopify:section:select", this._onSelect.bind(this))
    .on("shopify:section:deselect", this._onDeselect.bind(this))
    .on("shopify:block:select", this._onBlockSelect.bind(this))
    .on("shopify:block:deselect", this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function (container, constructor) {
    var $container = $(container);
    var id = $container.attr("data-section-id");
    var type = $container.attr("data-section-type");

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container,
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function (evt) {
    var container = $("[data-section-id]", evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function (evt) {
    this.instances = _.filter(this.instances, function (instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function (type, constructor) {
    this.constructors[type] = constructor;

    $("[data-section-type=" + type + "]").each(
      function (index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  },
});

window.slate = window.slate || {};

/**
 * Slate utilities
 * -----------------------------------------------------------------------------
 * A collection of useful utilities to help build your theme
 *
 *
 * @namespace utils
 */

slate.utils = {
  /**
   * Get the query params in a Url
   * Ex
   * https://mysite.com/search?q=noodles&b
   * getParameterByName('q') = "noodles"
   * getParameterByName('b') = "" (empty value)
   * getParameterByName('test') = null (absent)
   */
  getParameterByName: function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },

  keyboardKeys: {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    LEFTARROW: 37,
    RIGHTARROW: 39,
  },
};

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function (options) {
    options.$tables.wrap(
      '<div class="' + options.tableWrapperClass + '"></div>'
    );
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function (options) {
    options.$iframes.each(function () {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  },
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function ($element) {
    var focusClass = "js-focus-hidden";

    $element
      .first()
      .attr("tabIndex", "-1")
      .focus()
      .addClass(focusClass)
      .one("blur", callback);

    function callback() {
      $element.first().removeClass(focusClass).removeAttr("tabindex");
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function () {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function () {
    $("a[href*=#]").on(
      "click",
      function (evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this)
    );
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function (options) {
    var eventsName = {
      focusin: options.namespace ? "focusin." + options.namespace : "focusin",
      focusout: options.namespace
        ? "focusout." + options.namespace
        : "focusout",
      keydown: options.namespace
        ? "keydown." + options.namespace
        : "keydown.handleFocus",
    };

    /**
     * Get every possible visible focusable element
     */
    var $focusableElements = options.$container.find(
      $(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      ).filter(":visible")
    );
    var firstFocusable = $focusableElements[0];
    var lastFocusable = $focusableElements[$focusableElements.length - 1];

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    function _manageFocus(evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

      /**
       * On the last focusable element and tab forward,
       * focus the first element.
       */
      if (evt.target === lastFocusable && !evt.shiftKey) {
        evt.preventDefault();
        firstFocusable.focus();
      }
      /**
       * On the first focusable element and tab backward,
       * focus the last element.
       */
      if (evt.target === firstFocusable && evt.shiftKey) {
        evt.preventDefault();
        lastFocusable.focus();
      }
    }

    options.$container.attr("tabindex", "-1");
    options.$elementToFocus.focus();

    $(document).off("focusin");

    $(document).on(eventsName.focusout, function () {
      $(document).off(eventsName.keydown);
    });

    $(document).on(eventsName.focusin, function (evt) {
      if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

      $(document).on(eventsName.keydown, function (evt) {
        _manageFocus(evt);
      });
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function (options) {
    var eventName = options.namespace
      ? "focusin." + options.namespace
      : "focusin";

    if (options.$container && options.$container.length) {
      options.$container.removeAttr("tabindex");
    }

    $(document).off(eventName);
  },

  /**
   * Add aria-describedby attribute to external and new window links
   *
   * @param {object} options - Options to be used
   * @param {object} options.messages - Custom messages to be used
   * @param {jQuery} options.$links - Specific links to be targeted
   */
  accessibleLinks: function (options) {
    var body = document.querySelector("body");

    var idSelectors = {
      newWindow: "a11y-new-window-message",
      external: "a11y-external-message",
      newWindowExternal: "a11y-new-window-external-message",
    };

    if (options.$links === undefined || !options.$links.jquery) {
      options.$links = $("a[href]:not([aria-describedby])");
    }

    function generateHTML(customMessages) {
      if (typeof customMessages !== "object") {
        customMessages = {};
      }

      var messages = $.extend(
        {
          newWindow: "Opens in a new window.",
          external: "Opens external website.",
          newWindowExternal: "Opens external website in a new window.",
        },
        customMessages
      );

      var container = document.createElement("ul");
      var htmlMessages = "";

      for (var message in messages) {
        htmlMessages +=
          "<li id=" + idSelectors[message] + ">" + messages[message] + "</li>";
      }

      container.setAttribute("hidden", true);
      container.innerHTML = htmlMessages;

      body.appendChild(container);
    }

    function _externalSite($link) {
      var hostname = window.location.hostname;

      return $link[0].hostname !== hostname;
    }

    $.each(options.$links, function () {
      var $link = $(this);
      var target = $link.attr("target");
      var rel = $link.attr("rel");
      var isExternal = _externalSite($link);
      var isTargetBlank = target === "_blank";

      if (isExternal) {
        $link.attr("aria-describedby", idSelectors.external);
      }
      if (isTargetBlank) {
        if (rel === undefined || rel.indexOf("noopener") === -1) {
          $link.attr("rel", function (i, val) {
            var relValue = val === undefined ? "" : val + " ";
            return relValue + "noopener";
          });
        }
        $link.attr("aria-describedby", idSelectors.newWindow);
      }
      if (isExternal && isTargetBlank) {
        $link.attr("aria-describedby", idSelectors.newWindowExternal);
      }
    });

    generateHTML(options.messages);
  },
};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function () {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === "string") {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
    );

    if (match !== null) {
      if (match[2] !== undefined) {
        return match[1] + match[2];
      } else {
        return match[1];
      }
    } else {
      return null;
    }
  }

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === "master") {
      return this.removeProtocol(src);
    }

    var match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + "_" + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, "");
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol,
  };
})();

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function () {
  var moneyFormat = theme.moneyFormat; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === "string") {
      cents = cents.replace(".", "");
    }
    var value = "";
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ",";
      decimal = decimal || ".";

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split(".");
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        "$1" + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : "";

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case "amount":
        value = formatWithDelimiters(cents, 2);
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(cents, 0);
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(cents, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(cents, 0, ".", ",");
        break;
      case "amount_no_decimals_with_space_separator":
        value = formatWithDelimiters(cents, 0, " ");
        break;
      case "amount_with_apostrophe_separator":
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney,
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function () {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.productCardOptionSelector = options.productCardOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();
    this._firstupdateVariant(this.currentVariant);

    $(this.singleOptionSelector, this.$container).on(
      "change",
      this._onSelectChange.bind(this)
    );

    this.productCard_atc = $(this.productCardOptionSelector).find("a");
    $(this.productCard_atc, this.product).on(
      "click",
      this._onSelectChange2.bind(this)
    );
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function () {
      var currentOptions = _.map(
        $(this.singleOptionSelector, this.$container),
        function (element) {
          var $element = $(element);
          var type = $element.attr("type");
          var currentOption = {};

          if (type === "radio" || type === "checkbox") {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data("index");

              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data("index");

            return currentOption;
          }
        }
      );

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = _.compact(currentOptions);

      return currentOptions;
    },

    _getCurrentOptions2: function () {
      var currentOptions = $(this.productCardOptionSelector)
        .find(".active")
        .data("title");
      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function () {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var selectedOption1;
      var selectedOption2;
      var selectedOption3;
      var check_swatch_option = false;

      if ($(".selector-wrapper-1", this.$container).hasClass("swatch")) {
        check_swatch_option = true;
      }

      var found = _.find(variants, function (variant) {
        return selectedValues.every(function (values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      if (found == undefined || found.available == false) {
        if (check_swatch_option == true) {
          selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("input:checked")
            .val();
          selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("input:checked")
            .val();
          selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("input:checked")
            .val();

          $(".selector-wrapper-3 .swatch-element", this.$container).each(
            function () {
              var swatchVal = $(this).data("value");
              var optionSoldout = variants.find(function (variant) {
                return (
                  variant.option1 == selectedOption1 &&
                  variant.option2 == selectedOption2 &&
                  variant.option3 == swatchVal &&
                  variant.available
                );
              });

              if (optionSoldout == undefined) {
                $(this).addClass("soldout");
                $(this).find(":radio").prop("disabled", true);
              } else {
                $(this).removeClass("soldout");
                $(this).find(":radio").prop("disabled", false);
                $(this).find(":radio").prop("checked", true);
                $(".label-value-3", this.$container).html(
                  optionSoldout.option3
                );
              }
            }
          );

          selectedValues = this._getCurrentOptions();
          found = _.find(variants, function (variant) {
            return selectedValues.every(function (values) {
              return _.isEqual(variant[values.index], values.value);
            });
          });

          if (found == undefined || found.available == false) {
            $(".selector-wrapper-3 .swatch-element", this.$container).each(
              function () {
                var swatchVal = $(this).data("value");
                var optionSoldout = variants.find(function (variant) {
                  return (
                    variant.option1 == selectedOption1 &&
                    variant.option3 == swatchVal &&
                    variant.available
                  );
                });

                if (optionSoldout == undefined) {
                  $(this).addClass("soldout");
                  $(this).find(":radio").prop("disabled", true);
                } else {
                  $(this).removeClass("soldout");
                  $(this).find(":radio").prop("disabled", false);
                  $(this).find(":radio").prop("checked", true);
                  $(".label-value-3", this.$container).html(
                    optionSoldout.option3
                  );
                }
              }
            );

            selectedOption3 = $(".selector-wrapper-3", this.$container)
              .find("input:checked")
              .val();

            $(".selector-wrapper-2 .swatch-element", this.$container).each(
              function () {
                var swatchVal = $(this).data("value");
                var optionSoldout = variants.find(function (variant) {
                  return (
                    variant.option1 == selectedOption1 &&
                    variant.option3 == selectedOption3 &&
                    variant.option2 == swatchVal &&
                    variant.available
                  );
                });

                if (optionSoldout == undefined) {
                  $(this).addClass("soldout");
                  $(this).find(":radio").prop("disabled", true);
                } else {
                  $(this).removeClass("soldout");
                  $(this).find(":radio").prop("disabled", false);
                  $(this).find(":radio").prop("checked", true);
                  $(".label-value-2", this.$container).html(
                    optionSoldout.option2
                  );
                }
              }
            );

            selectedValues = this._getCurrentOptions();
            found = _.find(variants, function (variant) {
              return selectedValues.every(function (values) {
                return _.isEqual(variant[values.index], values.value);
              });
            });
          }
        } else {
          selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("option:selected")
            .val();
          selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("option:selected")
            .val();
          selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("option:selected")
            .val();

          $(
            ".selector-wrapper-3 .single-option-selector option",
            this.$container
          ).each(function () {
            var swatchVal = $(this).val();
            var optionSoldout = variants.find(function (variant) {
              return (
                variant.option1 == selectedOption1 &&
                variant.option2 == selectedOption2 &&
                variant.option3 == swatchVal &&
                variant.available
              );
            });

            if (optionSoldout == undefined) {
              $(this)
                .attr("disabled", "disabled")
                .removeAttr("selected", "selected")
                .prop("selected", false);
            } else {
              $(this)
                .removeAttr("disabled", "disabled")
                .attr("selected", "selected")
                .prop("selected", true);
              $(".label-value-3", this.$container).html(optionSoldout.option3);
            }
          });

          selectedValues = this._getCurrentOptions();
          found = _.find(variants, function (variant) {
            return selectedValues.every(function (values) {
              return _.isEqual(variant[values.index], values.value);
            });
          });

          if (found == undefined || found.available == false) {
            $(
              ".selector-wrapper-3 .single-option-selector option",
              this.$container
            ).each(function () {
              var swatchVal = $(this).val();
              var optionSoldout = variants.find(function (variant) {
                return (
                  variant.option1 == selectedOption1 &&
                  variant.option3 == swatchVal &&
                  variant.available
                );
              });

              if (optionSoldout == undefined) {
                $(this)
                  .attr("disabled", "disabled")
                  .removeAttr("selected", "selected")
                  .prop("selected", false);
              } else {
                $(this)
                  .removeAttr("disabled", "disabled")
                  .attr("selected", "selected")
                  .prop("selected", true);
                $(".label-value-3", this.$container).html(
                  optionSoldout.option3
                );
              }
            });

            selectedOption3 = $(".selector-wrapper-3", this.$container)
              .find("option:selected")
              .val();

            $(
              ".selector-wrapper-2 .single-option-selector option",
              this.$container
            ).each(function () {
              var swatchVal = $(this).val();
              var optionSoldout = variants.find(function (variant) {
                return (
                  variant.option1 == selectedOption1 &&
                  variant.option3 == selectedOption3 &&
                  variant.option2 == swatchVal &&
                  variant.available
                );
              });

              if (optionSoldout == undefined) {
                $(this)
                  .attr("disabled", "disabled")
                  .removeAttr("selected", "selected")
                  .prop("selected", false);
              } else {
                $(this)
                  .removeAttr("disabled", "disabled")
                  .attr("selected", "selected")
                  .prop("selected", true);
                $(".label-value-2", this.$container).html(
                  optionSoldout.option2
                );
              }
            });

            selectedValues = this._getCurrentOptions();
            found = _.find(variants, function (variant) {
              return selectedValues.every(function (values) {
                return _.isEqual(variant[values.index], values.value);
              });
            });
          }
        }
      }

      return found;
    },

    _getVariantFromOptions2: function () {
      var selectedValues = this._getCurrentOptions2();
      var variants = this.product.variants;

      var found = _.find(variants, function (variant) {
        return _.isEqual(variant.title, selectedValues);
      });

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function () {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: "variantChange",
        variant: variant,
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this._updateVariant(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    _onSelectChange2: function (e) {
      var variant = this._getVariantFromOptions2();

      this.$container.trigger({
        type: "variantChange",
        variant: variant,
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function (variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (
        !variant.featured_image ||
        variantImage.src === currentVariantImage.src
      ) {
        return;
      }

      this.$container.trigger({
        type: "variantImageChange",
        variant: variant,
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function (variant) {
      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price
      ) {
        return;
      }

      this.$container.trigger({
        type: "variantPriceChange",
        variant: variant,
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function (variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: "variantSKUChange",
        variant: variant,
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function (variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?variant=" +
        variant.id;
      window.history.replaceState({ path: newurl }, "", newurl);
    },

    _firstupdateVariant: function (_variant) {
      var self = this;
      var check_swatch_option = false;

      if ($(".selector-wrapper-1", this.$container).hasClass("swatch")) {
        check_swatch_option = true;
      }

      if (_variant) {
        if (check_swatch_option == true) {
          var variants = this.product.variants;
          var options = $(".selector-wrapper", this.$container);
          var selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("input:checked")
            .val();
          var selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("input:checked")
            .val();
          var selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("input:checked")
            .val();

          options.each(function () {
            var optionIndex = $(this).data("option-index");
            var swatch = $(this).find(".swatch-element");
            switch (optionIndex) {
              case 1:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return variant.option1 == swatchVal && variant.available;
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
              case 2:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == swatchVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
              case 3:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == swatchVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
            }
          });
        } else {
          var variants = this.product.variants;
          var options = $(".selector-wrapper", this.$container);
          var selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("option:selected")
            .val();
          var selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("option:selected")
            .val();
          var selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("option:selected")
            .val();

          options.each(function () {
            var optionIndex = $(this).data("option-index");
            var option = $(this).find("option");
            switch (optionIndex) {
              case 1:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return variant.option1 == optionVal && variant.available;
                  });
                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
              case 2:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == optionVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
              case 3:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == optionVal &&
                      variant.available
                    );
                  });

                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
            }
          });
        }
      }
    },

    _updateVariant: function (_variant) {
      var self = this;
      var check_swatch_option = false;

      if ($(".selector-wrapper-1", this.$container).hasClass("swatch")) {
        check_swatch_option = true;
      }

      if (_variant) {
        var option1 = _variant.option1;
        var option2 = _variant.option2;
        var option3 = _variant.option3;
        var option_change = "";
        var option_value = "";

        if (this.currentVariant.option1 != option1) {
          option_value = option1;
          option_change = "option1";
          $(".label-value-1", this.$container).html(option_value);
        } else if (this.currentVariant.option2 != option2) {
          option_value = option2;
          option_change = "option2";
          $(".label-value-2", this.$container).html(option_value);
        } else if (this.currentVariant.option3 != option3) {
          option_value = option3;
          option_change = "option3";
          $(".label-value-3", this.$container).html(option_value);
        }

        if (check_swatch_option == true) {
          var variants = this.product.variants;
          var options = $(".selector-wrapper", this.$container);
          var selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("input:checked")
            .val();
          var selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("input:checked")
            .val();
          var selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("input:checked")
            .val();

          options.each(function () {
            var optionIndex = $(this).data("option-index");
            var swatch = $(this).find(".swatch-element");
            switch (optionIndex) {
              case 1:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return variant.option1 == swatchVal && variant.available;
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
              case 2:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == swatchVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
              case 3:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == swatchVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
            }
          });
        } else {
          var variants = this.product.variants;
          var options = $(".selector-wrapper", this.$container);
          var selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("option:selected")
            .val();
          var selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("option:selected")
            .val();
          var selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("option:selected")
            .val();

          options.each(function () {
            var optionIndex = $(this).data("option-index");
            var option = $(this).find("option");
            switch (optionIndex) {
              case 1:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return variant.option1 == optionVal && variant.available;
                  });
                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
              case 2:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == optionVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
              case 3:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == optionVal &&
                      variant.available
                    );
                  });

                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
            }
          });
        }
      }
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function (variant) {
      $(this.originalSelectorId, this.$container).val(variant.id);
    },
  });

  return Variants;
})();

slate.Variants2 = (function () {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants2(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();
    this._firstupdateVariant(this.currentVariant);

    $(this.singleOptionSelector, this.$container).on(
      "change",
      this._onSelectChange.bind(this)
    );
  }

  Variants2.prototype = _.assignIn({}, Variants2.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function () {
      var currentOptions = _.map(
        $(this.singleOptionSelector, this.$container),
        function (element) {
          var $element = $(element);
          var type = $element.attr("type");
          var currentOption = {};

          if (type === "radio" || type === "checkbox") {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data("index");

              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data("index");

            return currentOption;
          }
        }
      );

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = _.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function () {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var selectedOption1;
      var selectedOption2;
      var selectedOption3;
      var check_swatch_option = false;

      if ($(".selector-wrapper-1", this.$container).hasClass("swatch")) {
        check_swatch_option = true;
      }

      var found = _.find(variants, function (variant) {
        return selectedValues.every(function (values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      if (found == undefined || found.available == false) {
        if (check_swatch_option == true) {
          selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("input:checked")
            .val();
          selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("input:checked")
            .val();
          selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("input:checked")
            .val();

          $(".selector-wrapper-3 .swatch-element", this.$container).each(
            function () {
              var swatchVal = $(this).data("value");
              var optionSoldout = variants.find(function (variant) {
                return (
                  variant.option1 == selectedOption1 &&
                  variant.option2 == selectedOption2 &&
                  variant.option3 == swatchVal &&
                  variant.available
                );
              });

              if (optionSoldout == undefined) {
                $(this).addClass("soldout");
                $(this).find(":radio").prop("disabled", true);
              } else {
                $(this).removeClass("soldout");
                $(this).find(":radio").prop("disabled", false);
                $(this).find(":radio").prop("checked", true);
                $(".label-value-3", this.$container).html(
                  optionSoldout.option3
                );
              }
            }
          );

          selectedValues = this._getCurrentOptions();
          found = _.find(variants, function (variant) {
            return selectedValues.every(function (values) {
              return _.isEqual(variant[values.index], values.value);
            });
          });

          if (found == undefined || found.available == false) {
            $(".selector-wrapper-3 .swatch-element", this.$container).each(
              function () {
                var swatchVal = $(this).data("value");
                var optionSoldout = variants.find(function (variant) {
                  return (
                    variant.option1 == selectedOption1 &&
                    variant.option3 == swatchVal &&
                    variant.available
                  );
                });

                if (optionSoldout == undefined) {
                  $(this).addClass("soldout");
                  $(this).find(":radio").prop("disabled", true);
                } else {
                  $(this).removeClass("soldout");
                  $(this).find(":radio").prop("disabled", false);
                  $(this).find(":radio").prop("checked", true);
                  $(".label-value-3", this.$container).html(
                    optionSoldout.option3
                  );
                }
              }
            );

            selectedOption3 = $(".selector-wrapper-3", this.$container)
              .find("input:checked")
              .val();

            $(".selector-wrapper-2 .swatch-element", this.$container).each(
              function () {
                var swatchVal = $(this).data("value");
                var optionSoldout = variants.find(function (variant) {
                  return (
                    variant.option1 == selectedOption1 &&
                    variant.option3 == selectedOption3 &&
                    variant.option2 == swatchVal &&
                    variant.available
                  );
                });

                if (optionSoldout == undefined) {
                  $(this).addClass("soldout");
                  $(this).find(":radio").prop("disabled", true);
                } else {
                  $(this).removeClass("soldout");
                  $(this).find(":radio").prop("disabled", false);
                  $(this).find(":radio").prop("checked", true);
                  $(".label-value-2", this.$container).html(
                    optionSoldout.option2
                  );
                }
              }
            );

            selectedValues = this._getCurrentOptions();
            found = _.find(variants, function (variant) {
              return selectedValues.every(function (values) {
                return _.isEqual(variant[values.index], values.value);
              });
            });
          }
        } else {
          selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("option:selected")
            .val();
          selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("option:selected")
            .val();
          selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("option:selected")
            .val();

          $(
            ".selector-wrapper-3 .single-option-selector option",
            this.$container
          ).each(function () {
            var swatchVal = $(this).val();
            var optionSoldout = variants.find(function (variant) {
              return (
                variant.option1 == selectedOption1 &&
                variant.option2 == selectedOption2 &&
                variant.option3 == swatchVal &&
                variant.available
              );
            });

            if (optionSoldout == undefined) {
              $(this)
                .attr("disabled", "disabled")
                .removeAttr("selected", "selected")
                .prop("selected", false);
            } else {
              $(this)
                .removeAttr("disabled", "disabled")
                .attr("selected", "selected")
                .prop("selected", true);
              $(".label-value-3", this.$container).html(optionSoldout.option3);
            }
          });

          selectedValues = this._getCurrentOptions();
          found = _.find(variants, function (variant) {
            return selectedValues.every(function (values) {
              return _.isEqual(variant[values.index], values.value);
            });
          });

          if (found == undefined || found.available == false) {
            $(
              ".selector-wrapper-3 .single-option-selector option",
              this.$container
            ).each(function () {
              var swatchVal = $(this).val();
              var optionSoldout = variants.find(function (variant) {
                return (
                  variant.option1 == selectedOption1 &&
                  variant.option3 == swatchVal &&
                  variant.available
                );
              });

              if (optionSoldout == undefined) {
                $(this)
                  .attr("disabled", "disabled")
                  .removeAttr("selected", "selected")
                  .prop("selected", false);
              } else {
                $(this)
                  .removeAttr("disabled", "disabled")
                  .attr("selected", "selected")
                  .prop("selected", true);
                $(".label-value-3", this.$container).html(
                  optionSoldout.option3
                );
              }
            });

            selectedOption3 = $(".selector-wrapper-3", this.$container)
              .find("option:selected")
              .val();

            $(
              ".selector-wrapper-2 .single-option-selector option",
              this.$container
            ).each(function () {
              var swatchVal = $(this).val();
              var optionSoldout = variants.find(function (variant) {
                return (
                  variant.option1 == selectedOption1 &&
                  variant.option3 == selectedOption3 &&
                  variant.option2 == swatchVal &&
                  variant.available
                );
              });

              if (optionSoldout == undefined) {
                $(this)
                  .attr("disabled", "disabled")
                  .removeAttr("selected", "selected")
                  .prop("selected", false);
              } else {
                $(this)
                  .removeAttr("disabled", "disabled")
                  .attr("selected", "selected")
                  .prop("selected", true);
                $(".label-value-2", this.$container).html(
                  optionSoldout.option2
                );
              }
            });

            selectedValues = this._getCurrentOptions();
            found = _.find(variants, function (variant) {
              return selectedValues.every(function (values) {
                return _.isEqual(variant[values.index], values.value);
              });
            });
          }
        }
      }

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function () {
      var variant = this._getVariantFromOptions();
      this.$container.trigger({
        type: "variantChange",
        variant: variant,
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this._updateVariant(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function (variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (
        !variant.featured_image ||
        variantImage.src === currentVariantImage.src
      ) {
        return;
      }

      this.$container.trigger({
        type: "variantImageChange",
        variant: variant,
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function (variant) {
      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price
      ) {
        return;
      }

      this.$container.trigger({
        type: "variantPriceChange",
        variant: variant,
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function (variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: "variantSKUChange",
        variant: variant,
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function (variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({ path: newurl }, "", newurl);
    },

    _firstupdateVariant: function (_variant) {
      var self = this;
      var check_swatch_option = false;

      if ($(".selector-wrapper-1", this.$container).hasClass("swatch")) {
        check_swatch_option = true;
      }

      if (_variant) {
        if (check_swatch_option == true) {
          var variants = this.product.variants;
          var options = $(".selector-wrapper", this.$container);
          var selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("input:checked")
            .val();
          var selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("input:checked")
            .val();
          var selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("input:checked")
            .val();

          options.each(function () {
            var optionIndex = $(this).data("option-index");
            var swatch = $(this).find(".swatch-element");
            switch (optionIndex) {
              case 1:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return variant.option1 == swatchVal && variant.available;
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
              case 2:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == swatchVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
              case 3:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == swatchVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
            }
          });
        } else {
          var variants = this.product.variants;
          var options = $(".selector-wrapper", this.$container);
          var selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("option:selected")
            .val();
          var selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("option:selected")
            .val();
          var selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("option:selected")
            .val();

          options.each(function () {
            var optionIndex = $(this).data("option-index");
            var option = $(this).find("option");
            switch (optionIndex) {
              case 1:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return variant.option1 == optionVal && variant.available;
                  });
                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
              case 2:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == optionVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
              case 3:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == optionVal &&
                      variant.available
                    );
                  });

                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
            }
          });
        }
      }
    },

    _updateVariant: function (_variant) {
      var self = this;
      var check_swatch_option = false;

      if ($(".selector-wrapper-1", this.$container).hasClass("swatch")) {
        check_swatch_option = true;
      }

      if (_variant) {
        var option1 = _variant.option1;
        var option2 = _variant.option2;
        var option3 = _variant.option3;
        var option_change = "";
        var option_value = "";

        if (this.currentVariant.option1 != option1) {
          option_value = option1;
          option_change = "option1";
          $(".label-value-1", this.$container).html(option_value);
        } else if (this.currentVariant.option2 != option2) {
          option_value = option2;
          option_change = "option2";
          $(".label-value-2", this.$container).html(option_value);
        } else if (this.currentVariant.option3 != option3) {
          option_value = option3;
          option_change = "option3";
          $(".label-value-3", this.$container).html(option_value);
        }

        if (check_swatch_option == true) {
          var variants = this.product.variants;
          var options = $(".selector-wrapper", this.$container);
          var selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("input:checked")
            .val();
          var selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("input:checked")
            .val();
          var selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("input:checked")
            .val();

          options.each(function () {
            var optionIndex = $(this).data("option-index");
            var swatch = $(this).find(".swatch-element");
            switch (optionIndex) {
              case 1:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return variant.option1 == swatchVal && variant.available;
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
              case 2:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == swatchVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
              case 3:
                swatch.each(function () {
                  var swatchVal = $(this).data("value");
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == swatchVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).addClass("soldout");
                    $(this).find(":radio").prop("disabled", true);
                  } else {
                    $(this).removeClass("soldout");
                    $(this).find(":radio").prop("disabled", false);
                  }
                });
                break;
            }
          });
        } else {
          var variants = this.product.variants;
          var options = $(".selector-wrapper", this.$container);
          var selectedOption1 = $(".selector-wrapper-1", this.$container)
            .find("option:selected")
            .val();
          var selectedOption2 = $(".selector-wrapper-2", this.$container)
            .find("option:selected")
            .val();
          var selectedOption3 = $(".selector-wrapper-3", this.$container)
            .find("option:selected")
            .val();

          options.each(function () {
            var optionIndex = $(this).data("option-index");
            var option = $(this).find("option");
            switch (optionIndex) {
              case 1:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return variant.option1 == optionVal && variant.available;
                  });
                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
              case 2:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == optionVal &&
                      variant.available
                    );
                  });
                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
              case 3:
                option.each(function () {
                  var optionVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == optionVal &&
                      variant.available
                    );
                  });

                  if (optionSoldout == undefined) {
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).removeAttr("disabled", "disabled");
                  }
                });
                break;
            }
          });
        }
      }
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function (variant) {
      $(this.originalSelectorId, this.$container).val(variant.id);
    },
  });

  return Variants2;
})();

/* ================ GLOBAL ================ */

/*============================================================================
    Drawer modules
==============================================================================*/
theme.Drawers = (function () {
  function Drawer(id, position, options) {
    var defaults = {
      close: ".js-drawer-close",
      open: ".js-drawer-open-" + position,
      openClass: "js-drawer-open",
      dirOpenClass: "js-drawer-open-" + position,
    };

    this.nodes = {
      $parent: $("html").add("body"),
      $page: $("#PageContainer"),
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $("#" + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function () {
    $(this.config.open).on("click", $.proxy(this.open, this));
    this.$drawer.on("click", this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();

    this.nodes.$parent.addClass(
      this.config.openClass + " " + this.config.dirOpenClass
    );
    this.drawerIsOpen = true;

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: "drawer_focus",
    });

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === "function"
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr("aria-expanded")) {
      this.$activeSource.attr("aria-expanded", "true");
    }

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function () {
    if (!this.drawerIsOpen) {
      // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger("blur");

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();

    this.nodes.$parent.removeClass(
      this.config.dirOpenClass + " " + this.config.openClass
    );

    if (this.$activeSource && this.$activeSource.attr("aria-expanded")) {
      this.$activeSource.attr("aria-expanded", "false");
    }

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: "drawer_focus",
    });

    this.unbindEvents();

    // Run function when draw closes if set
    if (
      this.config.onDrawerClose &&
      typeof this.config.onDrawerClose === "function"
    ) {
      this.config.onDrawerClose();
    }
  };

  Drawer.prototype.bindEvents = function () {
    this.nodes.$parent.on(
      "keyup.drawer",
      $.proxy(function (evt) {
        // close on 'esc' keypress
        if (evt.keyCode === 27) {
          this.close();
          return false;
        } else {
          return true;
        }
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on("touchmove.drawer", function () {
      return false;
    });

    this.nodes.$page.on(
      "click.drawer",
      $.proxy(function () {
        this.close();
        return false;
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function () {
    this.nodes.$page.off(".drawer");
    this.nodes.$parent.off(".drawer");
  };

  return Drawer;
})();

/* ================ MODULES ================ */

window.theme = window.theme || {};

theme.Header = (function () {
  function init() {
    header_menu();
    header_cart();
    header_search();
    header_account();
    header_sticky();
    header_hover();
  }

  // function header_scroll(header_position, header_height) {
  //   $(window).on("scroll load", function (event) {
  //     var scroll = $(window).scrollTop();
  //     console.log({ scroll, header_position, header_height})
  //     if (scroll > header_height) {
  //       $(".header-sticky").addClass("is-sticky");
  //       $("body").css("padding-top", header_height);
  //       $(".search-form-wrapper").addClass("custom");
  //     } else {
  //       $(".header-sticky").removeClass("is-sticky");
  //       $("body").css("padding-top", 0);
  //       $(".search-form-wrapper").removeClass("custom");
  //     }
  //   });

  //   window.onload = function () {
  //     if ($(window).scrollTop() > header_position) {
  //       $(".header-sticky").addClass("is-sticky");
  //       $(".search-form-wrapper").addClass("custom");
  //     }
  //   };
  // }

  // function header_sticky() {
  //   if ($(".header-sticky").length) {
  //     var header_position, header_height;
  //     if ($(window).width() > 1024) {
  //       header_height = $(".header-sticky .header-PC").height();
  //       header_position = $(".page-container").offset();
  //       header_scroll(header_position.top, header_height);
  //     } else {
  //       header_height = $(".header-sticky .header-mobile").height();
  //       header_position = $(".page-container").offset();
  //       header_scroll(header_position.top, header_height);
  //     }
  //   }
  // }

  function header_scroll(header_position, header_height) {
    let lastScrollTop = 0;

    $(window).on("scroll load", function () {
      const scroll = $(window).scrollTop();
      const isDown = scroll > lastScrollTop;

      // Solo activar la lógica cuando ya pasó la posición inicial
      if (scroll > header_position) {

        if (isDown) {
          // Scroll hacia abajo → mostrar
          $(".header-sticky").addClass("is-sticky");
          $("body").css("padding-top", header_height);
          $(".search-form-wrapper").addClass("custom");
        } else {
          // Scroll hacia arriba → esconder
          $(".header-sticky").removeClass("is-sticky");
          $("body").css("padding-top", 0);
          $(".search-form-wrapper").removeClass("custom");
        }

      } else {
        // Antes de llegar a la posición inicial
        $(".header-sticky").removeClass("is-sticky");
        $("body").css("padding-top", 0);
        $(".search-form-wrapper").removeClass("custom");
      }

      lastScrollTop = scroll <= 0 ? 0 : scroll;
    });
  }


  function header_sticky() {
    if (!$(".header-sticky").length) return;

    let header_height;
    let header_position = $(".page-container").offset().top;

    if ($(window).width() > 1024) {
      header_height = $(".header-sticky .header-PC").outerHeight();
    } else {
      header_height = $(".header-sticky .header-mobile").outerHeight();
    }

    header_scroll(header_position, header_height);
  }

  function header_menu() {
    if (!$("#site-nav").length) return;

    var $siteNav = $("#site-nav");
    ($count = 0),
      ($navigationItem = $siteNav.find(".menu-lv-1")),
      ($navigationItemLenght = $navigationItem.length - 1),
      ($navigationItemLast = $siteNav.find(".menu-lv-1--last")),
      ($navigationDropdown = $siteNav.find("#site-nav-dropdown--last"));

    if ($(window).width() > 1024 && $(window).width() < 1600) {
      $count = 4;
    } else if ($(window).width() >= 1600) {
      $count = parseInt($siteNav.data("item-count"));
    }

    if ($count != 0) {
      if ($navigationItemLenght > $count) {
        $navigationItem.each(function (index) {
          if (index >= $count && index < $navigationItemLenght) {
            $(this)
              .find(".menu-lv-2")
              .addClass("menu-lv-3")
              .removeClass("menu-lv-2");
            $(this).addClass("no-mega-menu").removeClass("mega-menu");
            $(this).addClass("menu-lv-2").removeClass("menu-lv-1");
            $(this).appendTo($navigationDropdown);
            $navigationItemLast.removeClass("hide");
          }
        });
      }
    }

    $("[data-mobile-menu]").on("click", function (event) {
      event.preventDefault();
      const $target = $(event.currentTarget);
      if ($target.hasClass("is-open")) {
        $target.removeClass("is-open");
        $("body").removeClass("open_menu");
        reset_menu();
      } else {
        $target.addClass("is-open");
        $("body").addClass("open_menu");
      }
    });

    $(
      "#navigation-mobile .close_menu"
    ).on("click", function (event) {
      console.log('entro')
      event.preventDefault();
      $("body").removeClass("open_menu");
      $("[data-mobile-menu]").removeClass("is-open");
      reset_menu();
    });

    $(document).on("click", function (event) {
      if (
        $("body").hasClass("open_menu") &&
        $(event.target).closest("#navigation-mobile").length === 0 &&
        $(event.target).closest("[data-mobile-menu]").length === 0
      ) {
        $("body").removeClass("open_menu");
        $("[data-mobile-menu]").removeClass("is-open");
        reset_menu();
      }
    });
  }

  function reset_menu() {
    $(".site-nav-mobile").find(".is-open").removeClass("is-open");
    $(".site-nav-mobile").find(".is-hidden").removeClass("is-hidden");
  }

  function header_cart() {
    $("[data-close-cart]").on("click", function (event) {
      $("body").removeClass("open_cart");
    });

    $(document).on("click", function (event) {
      if (
        $("body").hasClass("open_cart") &&
        $(event.target).closest("[data-cart-pc]").length === 0 &&
        $(event.target).closest("[data-mobile-cart]").length === 0 &&
        $(event.target).closest("#cart-mobile").length === 0 &&
        $(event.target).closest(".cart-edit-modal").length === 0 &&
        $(event.target).closest("[data-cart-popup-close]").length === 0 &&
        $(event.target).closest("[data-cart-popup-dismiss]").length === 0
      ) {
        $("body").removeClass("open_cart");
      }
    });
  }

  function header_account() {
    $("[data-login-form-pc]").on("click", function (event) {
      event.preventDefault();
      const $target = $(event.currentTarget);
      if ($target.hasClass("is-open")) {
        $target.removeClass("is-open");
        $(".login-form").slideUp();
      } else {
        $target.addClass("is-open");
        $(".login-form").slideDown();
      }
    });

    $("[data-close-login-form-pc]").on("click", function (event) {
      event.preventDefault();
      $("[data-login-form-pc]").removeClass("is-open");
      $(".login-form").slideUp();
    });

    $("[data-mobile-login]").on("click", function (event) {
      event.preventDefault();
      $("body").addClass("open_account");
    });

    $("[data-close-login-form]").on("click", function (event) {
      event.preventDefault();
      $("body").removeClass("open_account");
    });

    $(document).on("click", function (event) {
      if (
        $("[data-login-form-pc]").hasClass("is-open") &&
        $(event.target).closest("[data-login-form-pc]").length === 0 &&
        $(event.target).closest(".login-form").length === 0
      ) {
        $("[data-login-form-pc]").removeClass("is-open");
        $(".login-form").slideUp();
      }

      if (
        $("body").hasClass("open_account") &&
        $(event.target).closest("#login-form-mobile").length === 0 &&
        $(event.target).closest("[data-mobile-login]").length === 0
      ) {
        $("body").removeClass("open_account");
      }
    });
  }

  function header_search() {
    $("[data-search-popup]").on("click", function (event) {
      event.preventDefault();
      const $target = $(event.currentTarget);
      if ($target.hasClass("is-open")) {
        $("[data-search-popup]").removeClass("is-open");
        $("body").removeClass("open_search");
        $(".search-form-wrapper").hide();
      } else {
        $("[data-search-popup]").addClass("is-open");
        $("body").addClass("open_search");
        $(".search-form-wrapper").show();
      }
    });

    $("[data-search-close-popup]").on("click", function (event) {
      event.preventDefault();
      $("[data-search-popup]").removeClass("is-open");
      $("body").removeClass("open_search");
      $(".search-form-wrapper").hide();
    });
  }

  function header_hover() {
    if ($(window).width() > 1024) {
      $(".header-PC .site-nav .menu-lv-1.dropdown")
        .mouseenter(function () {
          $("body").addClass("open_menu_pc");
        })
        .mouseleave(function () {
          $("body").removeClass("open_menu_pc");
        });
    }
  }

  return {
    init: init,
  };
})();

window.theme = window.theme || {};

theme.HeaderSection = (function () {
  function Header() {
    theme.Header.init();
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function () {
      theme.Header.unload();
    },
  });

  return Header;
})();

window.theme = window.theme || {};

theme.Footer = (function () {
  function init() {
    footer_sticky();
    footer_openItem();
  }

  function footer_sticky() {
    if ($(".footer-sticky").length) {
      var footer_position, footer_height;
      if ($(window).width() > 1024) {
        footer_height = $(".footer-sticky").outerHeight();
        $(".page-container").css("margin-bottom", footer_height + 9);
        $(".page-container").addClass("page-container--sticky");
      } else {
        footer_height = 0;
        $(".page-container").css("margin-bottom", footer_height);
        $(".page-container").removeClass("page-container--sticky");
      }
    }
  }

  function footer_openItem() {
    if ($(window).width() < 768) {
      $(".footer-row__item--mobile .footer-heading").on("click", function () {
        $(this).parent().toggleClass("open-dropdown");
        $(this).parent().find(".footer-list").slideToggle();
      });
    }
  }

  return {
    init: init,
  };
})();

window.theme = window.theme || {};

theme.FooterSection = (function () {
  function Footer() {
    theme.Footer.init();
  }

  Footer.prototype = _.assignIn({}, Footer.prototype, {
    onUnload: function () {
      theme.Footer.unload();
    },
  });

  return Footer;
})();

theme.HeaderFooter_mobile = (function () {
  function header_logo() {
    if ($(".logo-wrapper").length) {
      if ($(window).width() > 1024) {
        if ($(".header-mobile .logo-wrapper").length) {
          $(".header-mobile .logo-wrapper").appendTo(
            ".header-PC .header-middle__center"
          );
        }
      } else {
        if ($(".header-PC .logo-wrapper").length) {
          $(".header-PC .logo-wrapper").appendTo(
            ".header-mobile .item__mobile--logo"
          );
        }
      }
    }
  }

  function header_account() {
    if ($(".login-form").length) {
      if ($(window).width() > 1024) {
        if ($("#login-form-mobile .login-form").length) {
          $("#login-form-mobile .login-form").appendTo(
            ".header-middle__item--account"
          );
        }
      } else {
        if ($(".header-middle__item--account .login-form").length) {
          $(".header-middle__item--account .login-form").appendTo(
            "#login-form-mobile .popup-sidebar__wrapper"
          );
        }
      }
    }
  }

  function header_navigation() {
    if ($("#site-nav").length) {
      if ($(window).width() > 1024) {
        $("body").removeClass("open_menu");
        if ($("#navigation-mobile #site-nav").length) {
          $("#navigation-mobile #site-nav").prependTo(
            ".header-PC .header-middle__navigation"
          );
          document.getElementById("site-nav").className = "site-nav";
        }
      } else {
        if (!$("#navigation-mobile #site-nav").length) {
          $(".header-PC #site-nav").prependTo(
            "#navigation-mobile .popup-sidebar__wrapper"
          );
          document.getElementById("site-nav").className = "site-nav-mobile";
        }
      }
    }
  }

  function header_navigation_toggle() {
    $(document).on("click", ".site-nav-mobile .nav-action", function (event) {
      const $openAction = $(event.target).parent();
      const $parentSiblings = $openAction.siblings();
      const $checkTitle = $openAction.closest(".site-nav-dropdown");
      const $closestTitle = $checkTitle.siblings();
      if (!$(event.target).hasClass("nav-action--end")) {
        if (!$(event.target).hasClass("link")) {
          $openAction.addClass("is-open");
          if ($openAction.hasClass("is-open")) {
            $parentSiblings.addClass("is-hidden");
          }
          if ($checkTitle.length) {
            $closestTitle.addClass("is-hidden");
          }
        }
      }
    });

    $(document).on(
      "click",
      ".site-nav-mobile .nav-title-mobile",
      function (event) {
        const $closestAction = $(event.target).closest(".dropdown");
        const $parentSiblings2 = $closestAction.siblings();
        const $openTitle = $(event.target)
          .closest(".site-nav-dropdown")
          .siblings();

        $closestAction.removeClass("is-open");
        $parentSiblings2.removeClass("is-hidden");
        $openTitle.removeClass("is-hidden");
      }
    );
  }

  function header_carousel() {
    if (!$(".dropdown-megamenu--carousel").length) {
      return;
    }

    $(".dropdown-megamenu--carousel").each(function () {
      if (!$(this).hasClass("slick-slider")) {
        $(this).slick({
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          autoplay: false,
          arrows: true,
          prevArrow:
            "<div class='slick-prev slick-arrow'><svg class='icon'><use xlink:href='#icon-arrow-left' /></svg></div>",
          nextArrow:
            "<div class='slick-next slick-arrow'><svg class='icon'><use xlink:href='#icon-arrow-right' /></svg></div>",
          responsive: [
            {
              breakpoint: 1500,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        });
      } else {
        $(this).slick("slickGoTo", 0);
      }
    });

    $(".site-nav > li").mouseover(function () {
      var self = $(this);
      if (self.find(".dropdown-megamenu--carousel").length) {
        self.find(".dropdown-megamenu--carousel").get(0).slick.setPosition();
      }
    });

    $(document).on("click", ".site-nav-mobile > li > .nav-action", function () {
      $(this)
        .parent()
        .find(".dropdown-megamenu--carousel")
        .slick("slickGoTo", 0);
    });
  }

  function footer_mobile() {
    if ($(window).width() <= 767) {
      if (!$(".footer-row").hasClass("footerMobile")) {
        $(".footer-row").addClass("footerMobile");
        $(".footer-row__item--mobile .footer-list").css("display", "none");
      }
    } else {
      $(".footer-row").removeClass("footerMobile");
      $(".footer-row__item--mobile").removeClass("open-dropdown");
      $(".footer-row__item--mobile .footer-list").css("display", "block");
    }
  }

  function footer_language_curency() {
    if ($(".site-footer").length) {
      if ($(window).width() > 1024) {
        if ($("#navigation-mobile #currencies").length) {
          $("#navigation-mobile #currencies").appendTo(
            ".site-footer [data-currency-switcher]"
          );
        }

        if ($("#navigation-mobile #lang-switcher").length) {
          $("#navigation-mobile #lang-switcher").prependTo(
            ".site-footer [data-language-switcher]"
          );
        }
      } else {
        if (!$("#navigation-mobile #currencies").length) {
          $(".site-footer #currencies").appendTo(
            "#navigation-mobile .site-nav-mobile.three"
          );
        }

        if (!$("#navigation-mobile #lang-switcher").length) {
          $(".site-footer #lang-switcher").appendTo(
            "#navigation-mobile .site-nav-mobile.three"
          );
        }
      }
    }

    if ($(".footer--language--currency--custom").length) {
      $(document).on(
        "click",
        ".footer--language--currency--custom .dropdown-toggle",
        function (e) {
          $(".footer--language--currency--custom").toggleClass("show");
        }
      );

      $(document).on(
        "click",
        ".footer--language--currency--custom .dropdown-menu .dropdown-item",
        function (e) {
          $(".footer--language--currency--custom").removeClass("show");
        }
      );

      $(document).on("click", function (event) {
        if (
          $(".footer--language--currency--custom").hasClass("show") &&
          $(event.target).closest(".footer--language--currency--custom")
            .length === 0
        ) {
          $(".footer--language--currency--custom").removeClass("show");
        }
      });
    }
  }

  function init() {
    header_logo();
    header_account();
    header_carousel();
    header_navigation();
    header_navigation_toggle();
    footer_mobile();
    footer_language_curency();
  }

  return {
    init: init,
  };
})();

(function () {
  var selectors = {
    backButton: ".return-link",
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one("click", function (evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement("a");
    anchor.ref = url;

    return anchor.hostname;
  }
})();

theme.Slideshow = (function () {
  class YoutubeSlick {
    constructor(slick) {
      this.$slick = $(slick);
      this.$videos = this.$slick.find("[data-youtube]");
      this.onSlickInit = this.onSlickInit.bind(this);
      this.onSlickBeforeChange = this.onSlickBeforeChange.bind(this);
      this.onSlickAfterChange = this.onSlickAfterChange.bind(this);
      this.onPlayerReady = this.onPlayerReady.bind(this);
      this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
      this.bindEvents();
    }

    bindEvents() {
      if (this.$slick.hasClass("slick-initialized")) {
        this.onSlickInit();
      }

      this.$slick.on("init", this.onSlickInit);
      this.$slick.on("beforeChange", this.onSlickBeforeChange);
      this.$slick.on("afterChange", this.onSlickAfterChange);
    }

    onPlayerReady(event) {
      // store player object for use later
      $(event.target.getIframe())
        .closest(".slick-slide")
        .data("youtube-player", event.target);

      // On desktop: Play video if first slide is video
      if ($(window).width() > 767) {
        setTimeout(() => {
          if (
            $(event.target.getIframe())
              .closest(".slick-slide")
              .hasClass("slick-active")
          ) {
            this.$slick.slick("slickPause");
            event.target.playVideo();
          }
        }, 300);
      }
    }

    onPlayerStateChange(event) {
      // Stop slick autoplay when video start playing

      if (event.data === YT.PlayerState.PLAYING) {
        this.$slick.addClass("slick-video-playing");
        this.$slick.slick("slickPause");
      }

      if (event.data === YT.PlayerState.PAUSED) {
        this.$slick.removeClass("slick-video-playing");
      }

      // go to next slide and enable autoplay back when video ended
      if (event.data === YT.PlayerState.ENDED) {
        this.$slick.removeClass("slick-video-playing");
        this.$slick.slick("slickPlay");
        this.$slick.slick("slickNext");
      }
    }

    onSlickInit() {
      this.$videos.each((j, vid) => {
        const $vid = $(vid);
        const id = "youtube_player_" + _.uniqueId();

        $vid.attr("id", id);

        // init player
        const player = new YT.Player(id, {
          // eslint-disable-line
          // host: 'http://www.youtube.com',
          videoId: $vid.data("youtube"),
          wmode: "transparent",
          height: "100%",
          width: "100%",
          playerVars: {
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            autohide: 1,
            wmode: "transparent",
          },
          events: {
            onReady: this.onPlayerReady,
            onStateChange: this.onPlayerStateChange,
          },
        });
      });
    }

    onSlickBeforeChange() {
      const player = this.$slick
        .find(".slick-slide.slick-active")
        .data("youtube-player");
      if (player) {
        player.stopVideo();
      }
    }

    onSlickAfterChange() {
      // Enable auto slide
      this.$slick.slick("slickPlay");

      // On desktop:
      // - Auto play video when open next slide
      // - Stop auto slide
      if ($(window).width() > 767) {
        const player = this.$slick
          .find(".slick-slide.slick-active")
          .data("youtube-player");
        if (player) {
          this.$slick.slick("slickPause");
          player.playVideo();
        }
      }
    }
  }

  function initCarousel($carousel) {
    $carousel.each((i, slick) => {
      const $slick = $(slick);
      if ($slick.find("[data-youtube]").length > 0) {
        $slick.addClass("slick-slider--video");
        new YoutubeSlick(slick);
      }
    });
  }

  function youtubeCarouselFactory($carousel) {
    if ($carousel.find(".youtube").length > 0) {
      if (typeof YT == "undefined" || typeof YT.Player == "undefined") {
        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = initCarousel.bind(window, $carousel);
      } else {
        initCarousel($carousel);
      }
    }
  }

  function mp4CarouselFactory($carousel) {
    if ($carousel.find(".mp4").length > 0) {
      var currentSlide = $carousel.find(".slick-current");
      var video = currentSlide.find("video").get(0);

      if (video != null) {
        video.play();
      }

      $carousel.on("afterChange", function (event, slick, currentSlide) {
        var currentSlide = $carousel.find(".slick-current");
        var video = currentSlide.find("video").get(0);
        if (video != null) {
          video.play();
        }
      });
    }
  }

  function initCountdown($carousel) {
    if ($carousel.find("[data-countdown]").length > 0) {
      var selectors = {
        slideshowCountDown: ".slideshow__countdown",
        slideshowCountDownWrapper: ".slideshow__countdownWrapper",
      };
      var $slickItem = $carousel.find(".slideshow__item");
      $slickItem.each(function () {
        var $slideshowCountDown = $(this).find(selectors.slideshowCountDown);
        var $slideshowCountDownWrapper = $(this).find(
          selectors.slideshowCountDownWrapper
        );

        var $countDownDate = new Date(
          $slideshowCountDown.attr("data-countdown")
        ).getTime();
        var $countdownfunction = setInterval(function () {
          // Get todays date and time
          var now = new Date().getTime();

          // Find the distance between now an the count down date
          var distance = $countDownDate - now;

          // If the count down is over, write some text
          if (distance < 0) {
            clearInterval($countdownfunction);
            $slideshowCountDownWrapper.remove();
          } else {
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            var minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            var strCountDown =
              "<span>End in: </span>" +
              showTime(days) +
              "D : " +
              showTime(hours) +
              "H : " +
              showTime(minutes) +
              "M : " +
              showTime(seconds) +
              "S";
            $slideshowCountDown.html(strCountDown);
          }
        }, 500);
      });
    }
  }

  function showTime(time) {
    if (time < 10) {
      return "<span class='num'>0" + time + "</span>";
    }
    return "<span class='num'>" + time + "</span>";
  }

  function Slideshow() {
    var $carousel = $(".slideshow[data-slick]");
    initCountdown($carousel);
    youtubeCarouselFactory($carousel);
    mp4CarouselFactory($carousel);
  }

  return Slideshow;
})();

window.theme = window.theme || {};

theme.FormStatus = (function () {
  var selectors = {
    statusMessage: "[data-form-status]",
  };

  function init() {
    this.$statusMessage = $(selectors.statusMessage);

    if (!this.$statusMessage) return;

    this.$statusMessage.attr("tabindex", -1).focus();

    this.$statusMessage.on("blur", handleBlur.bind(this));
  }

  function handleBlur() {
    this.$statusMessage.removeAttr("tabindex");
  }

  return {
    init: init,
  };
})();

/* ================ TEMPLATES ================ */

(function () {
  var $filterBy = $("#BlogTagFilter");

  if (!$filterBy.length) {
    return;
  }

  $filterBy.on("change", function () {
    location.href = $(this).val();
  });
})();

window.theme = theme || {};

theme.customerTemplates = (function () {
  var selectors = {
    RecoverHeading: "#RecoverHeading",
    RecoverEmail: "#RecoverEmail",
    LoginHeading: "#LoginHeading",
  };

  function initEventListeners() {
    this.$RecoverHeading = $(selectors.RecoverHeading);
    this.$RecoverEmail = $(selectors.RecoverEmail);
    this.$LoginHeading = $(selectors.LoginHeading);

    // Show reset password form
    $("#RecoverPassword").on(
      "click",
      function (evt) {
        evt.preventDefault();
        showRecoverPasswordForm();
        this.$RecoverHeading.attr("tabindex", "-1").focus();
      }.bind(this)
    );

    // Hide reset password form
    $("#HideRecoverPasswordLink").on(
      "click",
      function (evt) {
        evt.preventDefault();
        hideRecoverPasswordForm();
        this.$LoginHeading.attr("tabindex", "-1").focus();
      }.bind(this)
    );

    this.$RecoverHeading.on("blur", function () {
      $(this).removeAttr("tabindex");
    });

    this.$LoginHeading.on("blur", function () {
      $(this).removeAttr("tabindex");
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */

  function showRecoverPasswordForm() {
    $("#RecoverPasswordForm").removeClass("hide");
    $("#CustomerLoginForm").addClass("hide");

    if (this.$RecoverEmail.attr("aria-invalid") === "true") {
      this.$RecoverEmail.focus();
    }
  }

  function hideRecoverPasswordForm() {
    $("#RecoverPasswordForm").addClass("hide");
    $("#CustomerLoginForm").removeClass("hide");
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var $formState = $(".reset-password-success");

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $("#ResetSuccess").removeClass("hide").focus();
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $("#AddressNewForm");
    var $newAddressFormButton = $("#AddressNewButton");

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        "AddressCountryNew",
        "AddressProvinceNew",
        {
          hideElement: "AddressProvinceContainerNew",
        }
      );
    }

    // Initialize each edit form's country/province selector
    $(".address-country-option").each(function () {
      var formId = $(this).data("form-id");
      var countrySelector = "AddressCountry_" + formId;
      var provinceSelector = "AddressProvince_" + formId;
      var containerSelector = "AddressProvinceContainer_" + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector,
      });
    });

    // Toggle new/edit address forms
    $(".address-new-toggle").on("click", function () {
      var isExpanded = $newAddressFormButton.attr("aria-expanded") === "true";

      $newAddressForm.toggleClass("hide");
      $newAddressFormButton.attr("aria-expanded", !isExpanded).focus();
    });

    $(".address-edit-toggle").on("click", function () {
      var formId = $(this).data("form-id");
      var $editButton = $("#EditFormButton_" + formId);
      var $editAddress = $("#EditAddress_" + formId);
      var isExpanded = $editButton.attr("aria-expanded") === "true";

      $editAddress.toggleClass("hide");
      $editButton.attr("aria-expanded", !isExpanded).focus();
    });

    $(".address-delete").on("click", function () {
      var $el = $(this);
      var target = $el.data("target");
      var confirmMessage = $el.data("confirm-message");

      // eslint-disable-next-line no-alert
      if (
        confirm(
          confirmMessage || "Are you sure you wish to delete this address?"
        )
      ) {
        Shopify.postLink(target, {
          parameters: { _method: "delete" },
        });
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === "#recover") {
      showRecoverPasswordForm.bind(this)();
    }
  }

  return {
    init: function () {
      initEventListeners();
      checkUrlHash();
      resetPasswordSuccess();
      customerAddressForm();
    },
  };
})();

/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.Cart = (function () {
  var selectors = {
    cartCount: "[data-cart-count]",
    cartCountBubble: "[data-cart-count-bubble]",
    cartDiscount: "[data-cart-discount]",
    cartDiscountTitle: "[data-cart-discount-title]",
    cartDiscountAmount: "[data-cart-discount-amount]",
    cartDiscountWrapper: "[data-cart-discount-wrapper]",
    cartErrorMessage: "[data-cart-error-message]",
    cartErrorMessageWrapper: "[data-cart-error-message-wrapper]",
    cartItem: "[data-cart-item]",
    cartItemDetails: "[data-cart-item-details]",
    cartItemDiscount: "[data-cart-item-discount]",
    cartItemDiscountedPriceGroup: "[data-cart-item-discounted-price-group]",
    cartItemDiscountTitle: "[data-cart-item-discount-title]",
    cartItemDiscountAmount: "[data-cart-item-discount-amount]",
    cartItemDiscountList: "[data-cart-item-discount-list]",
    cartItemFinalPrice: "[data-cart-item-final-price]",
    cartItemImage: "[data-cart-item-image]",
    cartItemLinePrice: "[data-cart-item-line-price]",
    cartItemOriginalPrice: "[data-cart-item-original-price]",
    cartItemPrice: "[data-cart-item-price]",
    cartItemPriceList: "[data-cart-item-price-list]",
    cartItemProperty: "[data-cart-item-property]",
    cartItemPropertyName: "[data-cart-item-property-name]",
    cartItemPropertyValue: "[data-cart-item-property-value]",
    cartItemRegularPriceGroup: "[data-cart-item-regular-price-group]",
    cartItemRegularPrice: "[data-cart-item-regular-price]",
    cartItemTitle: "[data-cart-item-title]",
    cartItemOption: "[data-cart-item-option]",
    cartLineItems: "[data-cart-line-items]",
    cartNote: "[data-cart-notes]",
    cartQuantityErrorMessage: "[data-cart-quantity-error-message]",
    cartQuantityErrorMessageWrapper:
      "[data-cart-quantity-error-message-wrapper]",
    cartRemove: "[data-cart-remove]",
    cartupdate: "[data-qtt]",
    cartStatus: "[data-cart-status]",
    cartSubtotal: "[data-cart-subtotal]",
    cartTableCell: "[data-cart-table-cell]",
    cartWrapper: "[data-cart-wrapper]",
    emptyPageContent: "[data-empty-page-content]",
    quantityInput: "[data-quantity-input]",
    quantityInputMobile: "[data-quantity-input-mobile]",
    quantityInputDesktop: "[data-quantity-input-desktop]",
    quantityLabelMobile: "[data-quantity-label-mobile]",
    quantityLabelDesktop: "[data-quantity-label-desktop]",
    inputQty: "[data-quantity-input]",
    thumbnails: ".cart__image",
    unitPrice: "[data-unit-price]",
    unitPriceBaseUnit: "[data-unit-price-base-unit]",
    unitPriceGroup: "[data-unit-price-group]",
    editCart: "[data-cart-edit]",
    termsConditions: "[data-terms-conditions]",
    updateCartPC: "[data-cart-pc]",
    updateCartMB: "[data-mobile-cart]",
  };

  var classes = {
    cartNoCookies: "cart--no-cookies",
    cartRemovedProduct: "cart__removed-product",
    hide: "hide",
    inputError: "input--error",
  };

  var attributes = {
    cartItemIndex: "data-cart-item-index",
    cartItemKey: "data-cart-item-key",
    cartItemQuantity: "data-cart-item-quantity",
    cartItemTitle: "data-cart-item-title",
    cartItemUrl: "data-cart-item-url",
    quantityItem: "data-quantity-item",
  };

  theme.breakpoints = theme.breakpoints || {};

  if (
    isNaN(theme.breakpoints.medium) ||
    theme.breakpoints.medium === undefined
  ) {
    theme.breakpoints.medium = 768;
  }

  var mediumUpQuery = "(min-width: " + theme.breakpoints.medium + "px)";

  function Cart(container) {
    this.$container = $(container);
    this.$thumbnails = $(selectors.thumbnails, this.$container);
    this.ajaxEnabled = this.$container.data("ajax-enabled");

    if (!this.cookiesEnabled()) {
      this.$container.addClass(classes.cartNoCookies);
    }

    this.$thumbnails.css("cursor", "pointer");

    this.$container.on(
      "click",
      selectors.thumbnails,
      this._handleThumbnailClick
    );

    this.$container.on(
      "change",
      selectors.inputQty,
      $.debounce(500, this._handleInputQty.bind(this))
    );

    this.mql = window.matchMedia(mediumUpQuery);

    this.mql.addListener(this.setQuantityFormControllers.bind(this));
    this.setQuantityFormControllers();

    if (this.ajaxEnabled) {
      /**
       * Because the entire cart is recreated when a cart item is updated,
       * we cannot cache the elements in the cart. Instead, we add the event
       * listeners on the cart's container to allow us to retain the event
       * listeners after rebuilding the cart when an item is updated.
       */

      this.$container.on(
        "change",
        selectors.cartNote,
        this._onNoteChange.bind(this)
      );

      this.$container.on(
        "click",
        selectors.cartRemove,
        this._onRemoveItem.bind(this)
      );

      this._setupCartTemplates();
    }

    this.$container.on("click", selectors.editCart, this._editCart.bind(this));

    this._cartTermsConditions();

    this._cartCountDown();

    var _ = this;

    $(document).on("click", selectors.updateCartPC, function (event) {
      theme.HaloAddOn.loadingPopup();
      $.getJSON(window.router + "/cart.js").then(
        function (cart) {
          if (cart.item_count === 0) {
            _._emptyCart();
            theme.HaloAddOn.removeLoadingPopup();
            $("body").addClass("open_cart");
          } else {
            _._createCart(cart);
            theme.HaloAddOn.progressBarShipping();
            theme.HaloAddOn.removeLoadingPopup();
            $("body").addClass("open_cart");
          }
        }.bind(this)
      );
    });

    $(document).on("click", selectors.updateCartMB, function (event) {
      theme.HaloAddOn.loadingPopup();
      $.getJSON(window.router + "/cart.js").then(
        function (cart) {
          if (cart.item_count === 0) {
            _._emptyCart();
            theme.HaloAddOn.removeLoadingPopup();
            $("body").addClass("open_cart");
          } else {
            _._createCart(cart);
            theme.HaloAddOn.progressBarShipping();
            theme.HaloAddOn.removeLoadingPopup();
            $("body").addClass("open_cart");
          }
        }.bind(this)
      );
    });
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    _showErrorMessage: function (errorMessage, $container) {
      $("[data-error-message]", $container).html(errorMessage);

      $("[data-error-message-wrapper]", $container)
        .removeClass("product-form__error-message-wrapper--hidden")
        .attr("aria-hidden", true)
        .removeAttr("aria-hidden");
    },

    _hideErrorMessage: function ($container) {
      $("[data-error-message-wrapper]", $container).addClass(
        "product-form__error-message-wrapper--hidden"
      );
    },

    _editCart: function (e) {
      var $cart_item = $(e.currentTarget).parents("[data-cart-item]"),
        item_url = $cart_item.data("cart-item-url"),
        item_qty = $cart_item.data("cart-item-quantity"),
        $themeCart = this;

      var _changeVariantQtt = function ($editCart) {
        $("form[data-edit-cart-form] [data-qtt-editcart]", $editCart)
          .off("click")
          .on("click", function (e) {
            var self = $(this);
            var $target = $(this).siblings("input");
            var currentVal = parseInt($target.val());
            if (self.hasClass("minus")) {
              if (currentVal >= 1) $target.val(currentVal - 1);
            } else {
              $target.val(currentVal + 1);
            }
          });
      };

      $.urlParam = function (name) {
        var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(item_url);
        return results[1] || 0;
      };

      theme.HaloAddOn.loadingPopup();

      setTimeout(function () {
        theme.HaloAddOn.removeLoadingPopup();
        theme.HaloAddOn.editCartPopup();
      }, 500);

      var $editCart = "#cart-edit-modal",
        $Close = $($editCart).find(".close"),
        $editCartContent = $($editCart).find(".cart-edit-modal"),
        current_variant = $.urlParam("variant"),
        new_variant = current_variant;

      $("[data-cart-edit-item-quantity] input", $editCart).val(item_qty);

      var xhr = $.ajax({
        type: "GET",
        url: item_url,
        data: {
          view: "get_json",
        },
        cache: false,
        dataType: "html",
        success: function (data) {
          window._json = JSON.parse(data);

          $("[data-product-vendor-edit]", $editCartContent).text(
            window._json.vendor
          );
          $("[data-product-title-edit]", $editCartContent).text(
            window._json.title
          );
          var index = 0,
            imageSrc = window._json.featured_image,
            selected = "";
          $("[data-cart-edit-item-template] option", $editCart).remove();
          $.each(window._json.variants, function (i, e) {
            selected = "";
            if (current_variant == e.id) {
              index = i;
              selected = 'selected="selected"';
              if (e.featured_image) {
                imageSrc = e.featured_image.src;
              }
            }
            $("[data-cart-edit-item-template]", $editCart).append(
              "<option " +
                (e.available
                  ? 'value="' + e.id + '" '
                  : 'disabled="disabled" ') +
                selected +
                ">" +
                e.title +
                (e.available ? "" : " - Sold out") +
                "</option>"
            );
          });

          $("[data-product-image-edit] img", $editCart).attr("src", imageSrc);
          var currentVariant = window._json.variants[index],
            _options = "",
            _option1 = [],
            _option2 = [],
            _option3 = [];

          $.each(window._json.options, function (i, e) {
            _options +=
              '<th class="text-center" scope="col" data-option> ' +
              e +
              " </th>";
            $.each(window._json.variants, function (j, el) {
              if (i == 0) {
                if ($.inArray(el.options[i], _option1) === -1)
                  _option1.push(el.options[i]);
              } else if (i == 1) {
                if ($.inArray(el.options[i], _option2) === -1)
                  _option2.push(el.options[i]);
              } else {
                if ($.inArray(el.options[i], _option3) === -1)
                  _option3.push(el.options[i]);
              }
            });
          });

          $("[data-cart-edit-head] tr", $editCart)
            .find("[data-option]")
            .remove();
          $("[data-cart-edit-head] tr", $editCart).prepend(_options);

          var _opt = "";
          if (_option1.length) {
            _opt +=
              '<td class="cart-edit__option text-center" data-cart-edit-item-option><select class="cart-edit-option-selector product-form__input form-control" id="CartEditOptionSelector-1" data-index="option1" data-option-index="1">';
            $.each(_option1, function (i, e) {
              selected = "";
              if (currentVariant.option1 == e) {
                selected = 'selected="selected"';
              }
              _opt +=
                '<option value="' + e + '" ' + selected + ">" + e + "</option>";
            });
            _opt += "</select></td>";
          }
          if (_option2.length) {
            _opt +=
              '<td class="cart-edit__option text-center" data-cart-edit-item-option><select class="cart-edit-option-selector product-form__input form-control" id="CartEditOptionSelector-2" data-index="option2" data-option-index="2">';
            $.each(_option2, function (i, e) {
              selected = "";
              if (currentVariant.option2 == e) {
                selected = 'selected="selected"';
              }
              _opt +=
                '<option value="' + e + '" ' + selected + ">" + e + "</option>";
            });
            _opt += "</select></td>";
          }
          if (_option3.length) {
            _opt +=
              '<td class="cart-edit__option text-center" data-cart-edit-item-option><select class="cart-edit-option-selector product-form__input form-control" id="CartEditOptionSelector-3" data-index="option3" data-option-index="3">';
            $.each(_option3, function (i, e) {
              selected = "";
              if (currentVariant.option3 == e) {
                selected = 'selected="selected"';
              }
              _opt +=
                '<option value="' + e + '" ' + selected + ">" + e + "</option>";
            });
            _opt += "</select></td>";
          }
          var $tr = $("[data-cart-edit-body] tr:eq(0)", $editCart).clone();
          $("[data-cart-edit-body] tr", $editCart).remove();
          $("[data-cart-edit-body]", $editCart).append($tr);
          $("[data-cart-edit-body] tr", $editCart)
            .find("[data-cart-edit-item-option]")
            .remove();
          $("[data-cart-edit-body] tr", $editCart).prepend(_opt);
          $("[data-cart-edit-body] tr", $editCart)
            .find("[data-cart-edit-remove]")
            .hide();

          //----------------------

          if (_option1.length) {
            $themeCart._updateVariant(
              window._json,
              $editCart,
              currentVariant,
              currentVariant.option1,
              "option1"
            );
          }

          $themeCart._updatePrice(currentVariant, $editCart);

          var $product_clone = $(
            "[data-cart-edit-item]:last-child",
            $editCart
          ).clone();

          $(document)
            .off("change", ".cart-edit-option-selector")
            .on("change", ".cart-edit-option-selector", function (e) {
              var $row = $(e.currentTarget).parents("[data-cart-edit-item]");
              var currentOptions = _.map(
                $(".cart-edit-option-selector", $row),
                function (element) {
                  var $element = $(element);
                  var currentOption = {};

                  currentOption.value = $element.val();
                  currentOption.index = $element.data("index");

                  return currentOption;
                }
              );

              currentOptions = _.compact(currentOptions);

              var variants = window._json.variants;

              var found = _.find(variants, function (variant) {
                return currentOptions.every(function (values) {
                  return _.isEqual(variant[values.index], values.value);
                });
              });

              if (found) {
                $("[data-cart-edit-item-template]", $row).val(found.id);
                $themeCart._updatePrice(found, $row);
              }

              var selectedOption1;
              var selectedOption2;
              var selectedOption3;

              if (found == undefined || found.available == false) {
                selectedOption1 = $("#CartEditOptionSelector-1", $row)
                  .find("option:selected")
                  .val();
                selectedOption2 = $("#CartEditOptionSelector-2", $row)
                  .find("option:selected")
                  .val();
                selectedOption3 = $("#CartEditOptionSelector-3", $row)
                  .find("option:selected")
                  .val();

                $("#CartEditOptionSelector-3 option", $row).each(function () {
                  var swatchVal = $(this).val();
                  var optionSoldout = variants.find(function (variant) {
                    return (
                      variant.option1 == selectedOption1 &&
                      variant.option2 == selectedOption2 &&
                      variant.option3 == swatchVal &&
                      variant.available
                    );
                  });

                  if (optionSoldout == undefined) {
                    $(this)
                      .attr("disabled", "disabled")
                      .prop("selected", false);
                  } else {
                    $(this)
                      .removeAttr("disabled", "disabled")
                      .prop("selected", true);
                  }
                });

                currentOptions = _.map(
                  $(".cart-edit-option-selector", $row),
                  function (element) {
                    var $element = $(element);
                    var currentOption = {};

                    currentOption.value = $element.val();
                    currentOption.index = $element.data("index");

                    return currentOption;
                  }
                );

                currentOptions = _.compact(currentOptions);

                found = _.find(variants, function (variant) {
                  return currentOptions.every(function (values) {
                    return _.isEqual(variant[values.index], values.value);
                  });
                });

                if (found) {
                  $("[data-cart-edit-item-template]", $row).val(found.id);
                  $themeCart._updatePrice(found, $row);
                }

                if (found == undefined || found.available == false) {
                  $("#CartEditOptionSelector-3 option", $row).each(function () {
                    var swatchVal = $(this).val();
                    var optionSoldout = variants.find(function (variant) {
                      return (
                        variant.option1 == selectedOption1 &&
                        variant.option3 == swatchVal &&
                        variant.available
                      );
                    });

                    if (optionSoldout == undefined) {
                      $(this)
                        .attr("disabled", "disabled")
                        .prop("selected", false);
                    } else {
                      $(this)
                        .removeAttr("disabled", "disabled")
                        .prop("selected", true);
                    }
                  });

                  selectedOption3 = $("#CartEditOptionSelector-3", $row)
                    .find("option:selected")
                    .val();

                  $("#CartEditOptionSelector-2 option", $row).each(function () {
                    var swatchVal = $(this).val();
                    var optionSoldout = variants.find(function (variant) {
                      return (
                        variant.option1 == selectedOption1 &&
                        variant.option3 == selectedOption3 &&
                        variant.option2 == swatchVal &&
                        variant.available
                      );
                    });

                    if (optionSoldout == undefined) {
                      $(this)
                        .attr("disabled", "disabled")
                        .prop("selected", false);
                    } else {
                      $(this)
                        .removeAttr("disabled", "disabled")
                        .prop("selected", true);
                    }
                  });

                  currentOptions = _.map(
                    $(".cart-edit-option-selector", $row),
                    function (element) {
                      var $element = $(element);
                      var currentOption = {};

                      currentOption.value = $element.val();
                      currentOption.index = $element.data("index");

                      return currentOption;
                    }
                  );

                  currentOptions = _.compact(currentOptions);

                  found = _.find(variants, function (variant) {
                    return currentOptions.every(function (values) {
                      return _.isEqual(variant[values.index], values.value);
                    });
                  });

                  if (found) {
                    $("[data-cart-edit-item-template]", $row).val(found.id);
                    $themeCart._updatePrice(found, $row);
                  }
                }
              }

              $themeCart._updateVariant(
                window._json,
                $row,
                found,
                $(e.currentTarget).val(),
                $(e.currentTarget).data("index")
              );
            });

          _changeVariantQtt($editCart);

          $("form[data-edit-cart-form]", $editCart)
            .off("submit")
            .on("submit", function (e) {
              e.preventDefault();
              var arrVariant = [];
              $("[data-cart-edit-item]", $editCart).each(function (i, el) {
                var variant = $("[data-cart-edit-item-template]", $(el)).val();
                var qty = parseInt(
                  $("[data-cart-edit-item-quantity] input", $(el)).val()
                );
                var currentOption = {};
                currentOption.value = variant;
                currentOption.qty = qty;
                var k = 0;
                $.each(arrVariant, function (j, v) {
                  if (variant == v.value) {
                    k = 1;
                    if (qty > v.qty) {
                      v.qty = qty;
                    }
                  }
                });
                if (k == 0) arrVariant.push(currentOption);
              });

              var k = 0;
              $.each(arrVariant, function (j, v) {
                if (current_variant == v.value) {
                  k = 1;
                }
              });

              if (k == 0) {
                //remove
                var key = $cart_item.attr(attributes.cartItemKey);
                var index = parseInt($cart_item.attr(attributes.cartItemIndex));

                var params = {
                  url: "/cart/change.js",
                  data: { quantity: 0, line: index },
                  dataType: "json",
                  async: false,
                };

                $.post(params).done(function (cart) {}.bind(this));
              }

              k = 0;
              $.each(arrVariant, function (j, v) {
                if (current_variant == v.value) {
                  if (item_qty != v.qty) {
                    if (v.qty >= 0) {
                      $themeCart._updateItemQuantity(
                        $cart_item
                          .find("[data-quantity-input]")
                          .data("quantity-item"),
                        $cart_item,
                        $(
                          "[data-cart-edit-item-quantity] input",
                          $("[data-cart-edit-body] tr:eq(0)", $editCart)
                        ),
                        v.qty
                      );
                      k++;

                      if (k == arrVariant.length) {
                        //get new cart
                        $.getJSON(window.router + "/cart.js").then(function (
                          cart
                        ) {
                          $themeCart._setCartCountBubble(cart.item_count);
                          $themeCart._createCart(cart);
                          theme.HaloAddOn.progressBarShipping();
                          theme.HaloAddOn.removeLoadingPopup();
                          $("a.close", $editCart).trigger("click");
                        });
                      }
                    }
                  } else {
                    k++;
                    if (k == arrVariant.length) {
                      //get new cart
                      $.getJSON(window.router + "/cart.js").then(function (
                        cart
                      ) {
                        $themeCart._setCartCountBubble(cart.item_count);
                        $themeCart._createCart(cart);
                        theme.HaloAddOn.progressBarShipping();
                        theme.HaloAddOn.removeLoadingPopup();
                        $("a.close", $editCart).trigger("click");
                      });
                    }
                  }
                } else {
                  if (v.qty > 0) {
                    var params = {
                      url: "/cart/add.js",
                      data:
                        "form_type=product&quantity=" +
                        v.qty +
                        "&utf8=✓&id=" +
                        v.value,
                      dataType: "json",
                      async: false,
                    };

                    $.post(params)
                      .done(
                        function (item) {
                          $themeCart._hideErrorMessage($editCart);
                          theme.HaloAddOn.loadingPopup();
                          k++;
                          if (k == arrVariant.length) {
                            //get new cart
                            $.getJSON(window.router + "/cart.js").then(
                              function (cart) {
                                $themeCart._setCartCountBubble(cart.item_count);
                                $themeCart._createCart(cart);
                                theme.HaloAddOn.progressBarShipping();
                                theme.HaloAddOn.removeLoadingPopup();
                                $("a.close", $editCart).trigger("click");
                              }
                            );
                          }
                        }.bind(this)
                      )
                      .fail(
                        function (response) {
                          var errorMessage = response.responseJSON
                            ? response.responseJSON.description
                            : theme.strings.cartError;
                          theme.HaloAddOn.removeLoadingPopup();
                          $themeCart._showErrorMessage(errorMessage, $editCart);
                        }.bind(this)
                      );
                  }
                }
              });
              return false;
            });

          $(document)
            .off("click", "[data-cart-edit-remove]")
            .on("click", "[data-cart-edit-remove]", function (e) {
              e.preventDefault();
              var $row = $(e.currentTarget).parents("[data-cart-edit-item]");

              $row.remove();
              return false;
            });

          $(".product-addmore-button", $editCart)
            .off("click")
            .on("click", function (e) {
              var $tr = $product_clone.clone();
              $tr.find("[data-cart-edit-remove]").show();
              $("[data-cart-edit-body]", $editCart).append($tr);
            });

          if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
            Currency.convertAll(
              window.shop_currency,
              $("#currencies .active").attr("data-currency"),
              "span.money",
              "money_format"
            );
          }
        },
        complete: function () {},
      });
    },

    _updateVariant: function (
      json,
      $editCart,
      currentOption,
      option_value,
      option_change
    ) {
      var variants = json.variants;
      var options = $(".cart-edit-option-selector", $editCart);
      var selectedOption1 = $("#CartEditOptionSelector-1", $editCart)
        .find("option:selected")
        .val();
      var selectedOption2 = $("#CartEditOptionSelector-2", $editCart)
        .find("option:selected")
        .val();
      var selectedOption3 = $("#CartEditOptionSelector-3", $editCart)
        .find("option:selected")
        .val();

      options.each(function () {
        var optionIndex = $(this).data("option-index");
        var option = $(this).find("option");
        switch (optionIndex) {
          case 1:
            option.each(function () {
              var optionVal = $(this).val();
              var optionSoldout = variants.find(function (variant) {
                return variant.option1 == optionVal && variant.available;
              });
              if (optionSoldout == undefined) {
                $(this).attr("disabled", "disabled");
              } else {
                $(this).removeAttr("disabled", "disabled");
              }
            });
            break;
          case 2:
            option.each(function () {
              var optionVal = $(this).val();
              var optionSoldout = variants.find(function (variant) {
                return (
                  variant.option1 == selectedOption1 &&
                  variant.option2 == optionVal &&
                  variant.available
                );
              });
              if (optionSoldout == undefined) {
                $(this).attr("disabled", "disabled");
              } else {
                $(this).removeAttr("disabled", "disabled");
              }
            });
            break;
          case 3:
            option.each(function () {
              var optionVal = $(this).val();
              var optionSoldout = variants.find(function (variant) {
                return (
                  variant.option1 == selectedOption1 &&
                  variant.option2 == selectedOption2 &&
                  variant.option3 == optionVal &&
                  variant.available
                );
              });

              if (optionSoldout == undefined) {
                $(this).attr("disabled", "disabled");
              } else {
                $(this).removeAttr("disabled", "disabled");
              }
            });
            break;
        }
      });
    },

    _updatePrice: function (variant, $container) {
      var $priceContainer = $("[data-price]", $container);
      var $regularPrice = $("[data-regular-price]", $priceContainer);
      var $salePrice = $("[data-sale-price]", $priceContainer);
      var $unitPrice = $("[data-unit-price]", $priceContainer);
      var $unitPriceBaseUnit = $(
        "[data-unit-price-base-unit]",
        $priceContainer
      );

      // Reset product price state
      $priceContainer
        .removeClass("price--unavailable")
        .removeClass("price--on-sale")
        .removeClass("price--unit-available")
        .removeAttr("aria-hidden");

      // Unavailable
      if (!variant) {
        $priceContainer
          .addClass("price--unavailable")
          .attr("aria-hidden", true);

        return;
      }

      // On sale
      var quantity = $(
        "[data-cart-edit-item-quantity] input",
        $container
      ).val();
      if (variant.compare_at_price > variant.price) {
        // Regular price
        $regularPrice.html(
          theme.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          )
        );
        // Sale price
        $salePrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
        $priceContainer.addClass("price--on-sale");
      } else {
        // Regular price
        $regularPrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
        // Sale price
        $salePrice.html("");
      }

      // Unit price
      if (variant.unit_price) {
        $unitPrice.html(
          theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
        );
        $unitPriceBaseUnit.html(
          variant.unit_price_measurement.reference_value === 1
            ? variant.unit_price_measurement.reference_unit
            : variant.unit_price_measurement.reference_value +
                variant.unit_price_measurement.reference_unit
        );
        $priceContainer.addClass("price--unit-available");
      }

      if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
        Currency.convertAll(
          window.shop_currency,
          $("#currencies .active").attr("data-currency"),
          "span.money",
          "money_format"
        );
      }
    },

    _setupCartTemplates: function () {
      this.$itemTemplate = $(selectors.cartItem, this.$container)
        .first()
        .clone();
      this.$itemDiscountTemplate = $(
        selectors.cartItemDiscount,
        this.$itemTemplate
      ).clone();
      this.$itemOptionTemplate = $(
        selectors.cartItemOption,
        this.$itemTemplate
      ).clone();
      this.$itemPropertyTemplate = $(
        selectors.cartItemProperty,
        this.$itemTemplate
      ).clone();
      this.$itemPriceListTemplate = $(
        selectors.cartItemPriceList,
        this.$itemTemplate
      ).clone();
      this.$itemLinePriceTemplate = $(
        selectors.cartItemLinePrice,
        this.$itemTemplate
      ).clone();
      this.$cartDiscountTemplate = $(
        selectors.cartDiscount,
        this.$container
      ).clone();

      if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
        Currency.convertAll(
          window.shop_currency,
          $("#currencies .active").attr("data-currency"),
          "span.money",
          "money_format"
        );
      }
    },

    _handleInputQty: function (evt) {
      var $input = $(evt.target);
      var itemIndex = $input.data("quantity-item");
      var $itemElement = $input.closest(selectors.cartItem);
      var $itemQtyInputs = $("[data-quantity-item=" + itemIndex + "]");
      var value = parseInt($input.val());
      var isValidValue = !(value < 0 || isNaN(value));
      $itemQtyInputs.val(value);

      this._hideCartError();
      this._hideQuantityErrorMessage();

      if (!isValidValue) {
        this._showQuantityErrorMessages($itemElement);
        return;
      }

      if (isValidValue && this.ajaxEnabled) {
        this._updateItemQuantity(
          itemIndex,
          $itemElement,
          $itemQtyInputs,
          value
        );
      }
    },

    _updateItemQuantity: function (
      itemIndex,
      $itemElement,
      $itemQtyInputs,
      value
    ) {
      var key = $itemElement.attr(attributes.cartItemKey);
      var index = $itemElement.attr(attributes.cartItemIndex);

      var params = {
        url: "/cart/change.js",
        data: { quantity: value, line: index },
        dataType: "json",
        async: false,
      };

      $.post(params)
        .done(
          function (state) {
            if (state.item_count === 0) {
              this._emptyCart();
            } else {
              this._createCart(state);
              $(".cart__table .cart__row[data-cart-item]").each(function () {
                $('<tr class="cart__row spacer"></tr>').insertBefore($(this));
              });
              if (value === 0) {
                this._showRemoveMessage($itemElement.clone());
              } else {
                var $lineItem = $('[data-cart-item-key="' + key + '"]');
                var item = this.getItem(key, state);

                if (value != item.quantity) {
                  this._showQuantityErrorMessages2(item.quantity, $lineItem);
                }

                $(selectors.quantityInput, $lineItem).focus();
                this._updateLiveRegion(item);
                theme.HaloAddOn.progressBarShipping();
              }
            }
            this._setCartCountBubble(state.item_count);
          }.bind(this)
        )
        .fail(
          function () {
            this._showCartError($itemQtyInputs);
          }.bind(this)
        );
    },

    getItem: function (key, state) {
      return state.items.find(function (item) {
        return item.key === key;
      });
    },

    _liveRegionText: function (item) {
      // Dummy content for live region
      var liveRegionText =
        theme.strings.update +
        ": [QuantityLabel]: [Quantity], [Regular] [$$] [DiscountedPrice] [$]. [PriceInformation]";

      // Update Quantity
      liveRegionText = liveRegionText
        .replace("[QuantityLabel]", theme.strings.quantity)
        .replace("[Quantity]", item.quantity);

      // Update pricing information
      var regularLabel = "";
      var regularPrice = theme.Currency.formatMoney(
        item.original_line_price,
        theme.moneyFormat
      );
      var discountLabel = "";
      var discountPrice = "";
      var discountInformation = "";

      if (item.original_line_price > item.final_line_price) {
        regularLabel = theme.strings.regularTotal;

        discountLabel = theme.strings.discountedTotal;
        discountPrice = theme.Currency.formatMoney(
          item.final_line_price,
          theme.moneyFormat
        );

        discountInformation = theme.strings.priceColumn;
      }

      liveRegionText = liveRegionText
        .replace("[Regular]", regularLabel)
        .replace("[$$]", regularPrice)
        .replace("[DiscountedPrice]", discountLabel)
        .replace("[$]", discountPrice)
        .replace("[PriceInformation]", discountInformation)
        .trim();

      return liveRegionText;
    },

    _updateLiveRegion: function (item) {
      var $liveRegion = $(selectors.cartStatus);
      $liveRegion.html(this._liveRegionText(item)).attr("aria-hidden", false);

      // hide content from accessibility tree after announcement
      setTimeout(function () {
        $liveRegion.attr("aria-hidden", true);
      }, 1000);
    },

    _createCart: function (state) {
      var cartDiscountList = this._createCartDiscountList(state);

      $(selectors.emptyPageContent).addClass(classes.hide);
      $(selectors.cartWrapper).removeClass(classes.hide);
      $(selectors.cartLineItems, this.$container).html(
        this._createLineItemList(state)
      );

      this.setQuantityFormControllers();

      $(selectors.cartNote, this.$container).val(state.note);

      if (cartDiscountList.length === 0) {
        $(selectors.cartDiscountWrapper, this.$container)
          .html("")
          .addClass(classes.hide);
      } else {
        $(selectors.cartDiscountWrapper, this.$container)
          .html(cartDiscountList)
          .removeClass(classes.hide);
      }

      $(selectors.cartSubtotal, this.$container).html(
        theme.Currency.formatMoney(
          state.total_price,
          theme.moneyFormatWithCurrency
        )
      );

      if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
        Currency.convertAll(
          window.shop_currency,
          $("#currencies .active").attr("data-currency"),
          "span.money",
          "money_format"
        );
      }
    },

    _createCartDiscountList: function (cart) {
      return $.map(
        cart.cart_level_discount_applications,
        function (discount) {
          var $discount = this.$cartDiscountTemplate.clone();
          $discount.find(selectors.cartDiscountTitle).text(discount.title);
          $discount
            .find(selectors.cartDiscountAmount)
            .html(
              theme.Currency.formatMoney(
                discount.total_allocated_amount,
                theme.moneyFormat
              )
            );
          return $discount[0];
        }.bind(this)
      );
    },

    _createLineItemList: function (state) {
      return $.map(
        state.items,
        function (item, index) {
          var $item = this.$itemTemplate.clone();
          var $itemPriceList = this.$itemPriceListTemplate.clone();
          this._setLineItemAttributes($item, item, index);
          this._setLineItemImage($item, item.featured_image);

          $(selectors.cartItemTitle, $item)
            .text(item.product_title)
            .attr("href", item.url);

          var productDetailsList = this._createProductDetailsList(
            item.product_has_only_default_variant,
            item.options_with_values,
            item.properties
          );
          this._setProductDetailsList($item, productDetailsList);

          this._setItemRemove($item, item.title);

          $itemPriceList.html(
            this._createItemPrice(
              item.original_price,
              item.final_price,
              this.$itemPriceListTemplate
            )
          );

          if (item.unit_price_measurement) {
            $itemPriceList.append(
              this._createUnitPrice(
                item.unit_price,
                item.unit_price_measurement,
                this.$itemPriceListTemplate
              )
            );
          }

          this._setItemPrice($item, $itemPriceList);

          var itemDiscountList = this._createItemDiscountList(item);
          this._setItemDiscountList($item, itemDiscountList);

          this._setQuantityInputs($item, item, index);

          var itemLinePrice = this._createItemPrice(
            item.original_line_price,
            item.final_line_price,
            this.$itemLinePriceTemplate
          );
          this._setItemLinePrice($item, itemLinePrice);

          return $item[0];
        }.bind(this)
      );
    },

    _setLineItemAttributes: function ($item, item, index) {
      $item
        .attr(attributes.cartItemKey, item.key)
        .attr(attributes.cartItemUrl, item.url)
        .attr(attributes.cartItemTitle, item.title)
        .attr(attributes.cartItemIndex, index + 1)
        .attr(attributes.cartItemQuantity, item.quantity);
    },

    _setLineItemImage: function ($item, featuredImage) {
      var $image = $(selectors.cartItemImage, $item);

      var sizedImageUrl =
        featuredImage.url !== null
          ? theme.Images.getSizedImageUrl(featuredImage.url, "x190")
          : null;

      if (sizedImageUrl) {
        $image
          .attr("alt", featuredImage.alt)
          .attr("src", sizedImageUrl)
          .removeClass(classes.hide);
      } else {
        $image.remove();
      }
    },

    _setProductDetailsList: function ($item, productDetailsList) {
      var $itemDetails = $(selectors.cartItemDetails, $item);

      if (productDetailsList.length === 0) {
        $itemDetails.addClass(classes.hide).text("");
      } else {
        $itemDetails.removeClass(classes.hide).html(productDetailsList);
      }
    },

    _setItemPrice: function ($item, price) {
      $(selectors.cartItemPrice, $item).html(price);
    },

    _setItemDiscountList: function ($item, discountList) {
      var $itemDiscountList = $(selectors.cartItemDiscountList, $item);

      if (discountList.length === 0) {
        $itemDiscountList.html("").addClass(classes.hide);
      } else {
        $itemDiscountList.html(discountList).removeClass(classes.hide);
      }
    },

    _setItemRemove: function ($item, title) {
      $(selectors.cartRemove, $item).attr(
        "aria-label",
        theme.strings.removeLabel.replace("[product]", title)
      );
    },

    _setQuantityInputs: function ($item, item, index) {
      $(selectors.quantityInputMobile, $item)
        .attr("id", "updates_" + item.key)
        .attr(attributes.quantityItem, index + 1)
        .val(item.quantity);

      $(selectors.quantityInputDesktop, $item)
        .attr("id", "updates_large_" + item.key)
        .attr(attributes.quantityItem, index + 1)
        .val(item.quantity);

      $(selectors.quantityLabelMobile, $item).attr(
        "for",
        "updates_" + item.key
      );

      $(selectors.quantityLabelDesktop, $item).attr(
        "for",
        "updates_large_" + item.key
      );
    },

    setQuantityFormControllers: function () {
      if (this.mql.matches) {
        $(selectors.quantityInputDesktop).attr("name", "updates[]");
        $(selectors.quantityInputMobile).removeAttr("name");
      } else {
        $(selectors.quantityInputMobile).attr("name", "updates[]");
        $(selectors.quantityInputDesktop).removeAttr("name");
      }
    },

    _setItemLinePrice: function ($item, price) {
      $(selectors.cartItemLinePrice, $item).html(price);
    },

    _createProductDetailsList: function (
      product_has_only_default_variant,
      options,
      properties
    ) {
      var optionsPropertiesHTML = [];

      if (!product_has_only_default_variant) {
        optionsPropertiesHTML = optionsPropertiesHTML.concat(
          this._getOptionList(options)
        );
      }

      if (properties !== null && Object.keys(properties).length !== 0) {
        optionsPropertiesHTML = optionsPropertiesHTML.concat(
          this._getPropertyList(properties)
        );
      }

      return optionsPropertiesHTML;
    },

    _getOptionList: function (options) {
      return $.map(
        options,
        function (option) {
          var $optionElement = this.$itemOptionTemplate.clone();

          $optionElement.text(option.value).removeClass(classes.hide);

          return $optionElement[0];
        }.bind(this)
      );
    },

    _getPropertyList: function (properties) {
      var propertiesArray =
        properties !== null ? Object.entries(properties) : [];

      return $.map(
        propertiesArray,
        function (property) {
          var $propertyElement = this.$itemPropertyTemplate.clone();

          // Line item properties prefixed with an underscore are not to be displayed
          if (property[0].charAt(0) === "_") return;

          // if the property value has a length of 0 (empty), don't display it
          if (property[1].length === 0) return;

          $propertyElement
            .find(selectors.cartItemPropertyName)
            .text(property[0]);

          if (property[0].indexOf("/uploads/") === -1) {
            $propertyElement
              .find(selectors.cartItemPropertyValue)
              .text(": " + property[1]);
          } else {
            $propertyElement
              .find(selectors.cartItemPropertyValue)
              .html(
                ': <a href="' +
                  property[1] +
                  '"> ' +
                  property[1].split("/").pop() +
                  "</a>"
              );
          }

          $propertyElement.removeClass(classes.hide);

          return $propertyElement[0];
        }.bind(this)
      );
    },

    _createItemPrice: function (original_price, final_price, $priceTemplate) {
      if (original_price !== final_price) {
        var $discountedPrice = $(
          selectors.cartItemDiscountedPriceGroup,
          $priceTemplate
        ).clone();

        $(selectors.cartItemOriginalPrice, $discountedPrice).html(
          theme.Currency.formatMoney(original_price, theme.moneyFormat)
        );
        $(selectors.cartItemFinalPrice, $discountedPrice).html(
          theme.Currency.formatMoney(final_price, theme.moneyFormat)
        );
        $discountedPrice.removeClass(classes.hide);

        return $discountedPrice[0];
      } else {
        var $regularPrice = $(
          selectors.cartItemRegularPriceGroup,
          $priceTemplate
        ).clone();

        $(selectors.cartItemRegularPrice, $regularPrice).html(
          theme.Currency.formatMoney(original_price, theme.moneyFormat)
        );

        $regularPrice.removeClass(classes.hide);

        return $regularPrice[0];
      }
    },

    _createUnitPrice: function (
      unitPrice,
      unitPriceMeasurement,
      $itemPriceGroup
    ) {
      var $unitPriceGroup = $(
        selectors.unitPriceGroup,
        $itemPriceGroup
      ).clone();

      var unitPriceBaseUnit =
        (unitPriceMeasurement.reference_value !== 1
          ? unitPriceMeasurement.reference_value
          : "") + unitPriceMeasurement.reference_unit;

      $(selectors.unitPriceBaseUnit, $unitPriceGroup).text(unitPriceBaseUnit);
      $(selectors.unitPrice, $unitPriceGroup).html(
        theme.Currency.formatMoney(unitPrice, theme.moneyFormat)
      );

      $unitPriceGroup.removeClass(classes.hide);

      return $unitPriceGroup[0];
    },

    _createItemDiscountList: function (item) {
      return $.map(
        item.line_level_discount_allocations,
        function (discount) {
          var $discount = this.$itemDiscountTemplate.clone();
          $discount
            .find(selectors.cartItemDiscountTitle)
            .text(discount.discount_application.title);
          $discount
            .find(selectors.cartItemDiscountAmount)
            .html(
              theme.Currency.formatMoney(discount.amount, theme.moneyFormat)
            );
          return $discount[0];
        }.bind(this)
      );
    },

    _showQuantityErrorMessages: function (itemElement) {
      $(selectors.cartQuantityErrorMessage, itemElement).text(
        theme.strings.quantityMinimumMessage
      );

      $(selectors.cartQuantityErrorMessageWrapper, itemElement).removeClass(
        classes.hide
      );

      $(selectors.inputQty, itemElement).addClass(classes.inputError).focus();
    },

    _showQuantityErrorMessages2: function (quantity, itemElement) {
      $(selectors.cartQuantityErrorMessage, itemElement).text(
        theme.strings.cartErrorMaximum.replace("[quantity]", quantity)
      );

      $(selectors.cartQuantityErrorMessageWrapper, itemElement).removeClass(
        classes.hide
      );

      $(selectors.inputQty, itemElement).addClass(classes.inputError).focus();
    },

    _hideQuantityErrorMessage: function () {
      var $errorMessages = $(
        selectors.cartQuantityErrorMessageWrapper
      ).addClass(classes.hide);

      $(selectors.cartQuantityErrorMessage, $errorMessages).text("");

      $(selectors.inputQty, this.$container).removeClass(classes.inputError);
    },

    _handleThumbnailClick: function (evt) {
      var url = $(evt.target).closest(selectors.cartItem).data("cart-item-url");

      window.location.href = url;
    },

    _onNoteChange: function (evt) {
      var note = evt.currentTarget.value;
      this._hideCartError();
      this._hideQuantityErrorMessage();

      var params = {
        url: "/cart/update.js",
        data: { note: note },
        dataType: "json",
      };

      $.post(params).fail(
        function () {
          this._showCartError(evt.currentTarget);
        }.bind(this)
      );
    },

    _showCartError: function (elementToFocus) {
      $(selectors.cartErrorMessage).text(theme.strings.cartError);

      $(selectors.cartErrorMessageWrapper).removeClass(classes.hide);

      elementToFocus.focus();
    },

    _hideCartError: function () {
      $(selectors.cartErrorMessageWrapper).addClass(classes.hide);
      $(selectors.cartErrorMessage).text("");
    },

    _onRemoveItem: function (evt) {
      evt.preventDefault();
      var $remove = $(evt.target);
      var $lineItem = $remove.closest(selectors.cartItem);
      var index = $lineItem.attr(attributes.cartItemIndex);
      this._hideCartError();

      var params = {
        url: "/cart/change.js",
        data: { quantity: 0, line: index },
        dataType: "json",
      };

      $.post(params)
        .done(
          function (state) {
            if (state.item_count === 0) {
              this._emptyCart();
            } else {
              this._createCart(state);
              this._showRemoveMessage($lineItem.clone());
              theme.HaloAddOn.progressBarShipping();
            }

            this._setCartCountBubble(state.item_count);
          }.bind(this)
        )
        .fail(
          function () {
            this._showCartError(null);
          }.bind(this)
        );
    },

    _showRemoveMessage: function (lineItem) {
      var index = lineItem.data("cart-item-index");
      var removeMessage = this._getRemoveMessage(lineItem);
      var $lineItemAtIndex;

      if (index - 1 === 0) {
        $lineItemAtIndex = $('[data-cart-item-index="1"]', this.$container);
        $(removeMessage).insertBefore($lineItemAtIndex);
      } else {
        $lineItemAtIndex = $(
          '[data-cart-item-index="' + (index - 1) + '"]',
          this.$container
        );
        removeMessage.insertAfter($lineItemAtIndex);
      }
      removeMessage.focus();
    },

    _getRemoveMessage: function (lineItem) {
      var formattedMessage = this._formatRemoveMessage(lineItem);

      var $tableCell = $(selectors.cartTableCell, lineItem).clone();
      $tableCell
        .removeClass()
        .addClass(classes.cartRemovedProduct)
        .attr("colspan", "4")
        .html(formattedMessage);

      lineItem.attr("role", "alert").html($tableCell).attr("tabindex", "-1");

      return lineItem;
    },

    _formatRemoveMessage: function (lineItem) {
      var quantity = lineItem.data("cart-item-quantity");
      var url = lineItem.attr(attributes.cartItemUrl);
      var title = lineItem.attr(attributes.cartItemTitle);

      return theme.strings.removedItemMessage
        .replace("[quantity]", quantity)
        .replace(
          "[link]",
          "<a " +
            'href="' +
            url +
            '" class="text-link text-link--accent">' +
            title +
            "</a>"
        );
    },

    _setCartCountBubble: function (quantity) {
      this.$cartCountBubble =
        this.$cartCountBubble || $(selectors.cartCountBubble);
      this.$cartCount = this.$cartCount || $(selectors.cartCount);
      if (quantity > 0) {
        this.$cartCountBubble.removeClass(classes.hide);
        this.$cartCount.html(quantity);
      } else {
        this.$cartCountBubble.addClass(classes.hide);
        this.$cartCount.html("0");
      }
    },

    _emptyCart: function () {
      this.$emptyPageContent =
        this.$emptyPageContent ||
        $(selectors.emptyPageContent, this.$container);
      this.$cartWrapper =
        this.$cartWrapper || $(selectors.cartWrapper, this.$container);

      $(selectors.emptyPageContent).removeClass(classes.hide);
      $(selectors.cartWrapper).addClass(classes.hide);
    },

    _cartTermsConditions: function () {
      if ($(".cart__submit-controls .product__terms-conditions").length) {
        var checkBox = $(
          '.cart__submit-controls .product__terms-conditions input[type="checkbox"]'
        );

        checkBox.each(function () {
          if ($(this).prop("checked")) {
            $(this)
              .parents(".cart__submit-controls")
              .find(".btn--checkout")
              .removeClass("disabled");
          } else {
            $(this)
              .parents(".cart__submit-controls")
              .find(".btn--checkout")
              .addClass("disabled");
          }
        });

        $(document).on(
          "click",
          ".cart__submit-controls .product__terms-conditions .title",
          function (event) {
            event.preventDefault();
            var self = $(this),
              ipt = self.prev();

            if (!ipt.prop("checked")) {
              ipt.prop("checked", true);
              self
                .parents(".cart__submit-controls")
                .find(".btn--checkout")
                .removeClass("disabled");
            } else {
              ipt.prop("checked", false);
              self
                .parents(".cart__submit-controls")
                .find(".btn--checkout")
                .addClass("disabled");
            }
          }
        );
      }
    },

    cookiesEnabled: function () {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
      }
      return cookieEnabled;
    },

    _cartCountDown: function () {
      if (!$(".cart__count_down").length) return;

      var timer,
        elCountDown = $(".cart__count_down .count_down"),
        minute = elCountDown.data("time");

      function startTimer(duration, display) {
        timer = duration;
        var minutes, seconds;
        setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (--timer < 0) {
            timer = duration;
          }
        }, 1000);
      }

      function resetTimer() {
        timer = 60 * minute;
      }

      $(document).ready(function () {
        (fiveMinutes = 60 * minute),
          (display = document.querySelector("#time"));
        startTimer(fiveMinutes, display);
      });
    },
  });

  return Cart;
})();

window.theme = window.theme || {};

theme.Filters = (function () {
  function openDropdown() {
    $(document).on("click", ".filters-toolbar__label", function () {
      if (
        $(this)
          .next()
          .find(".filters-toolbar__input-content")
          .hasClass("is-open")
      ) {
        $(".filters-toolbar__input-content").removeClass("is-open");
      } else {
        $(".filters-toolbar__input-content").removeClass("is-open");
        $(this)
          .next()
          .find(".filters-toolbar__input-content")
          .addClass("is-open");
      }
    });

    $(document).on("click", ".filters-toolbar__input-title", function () {
      if ($(this).next().hasClass("is-open")) {
        $(".filters-toolbar__input-content").removeClass("is-open");
      } else {
        $(".filters-toolbar__input-content").removeClass("is-open");
        $(this).next().addClass("is-open");
      }
    });

    $(document).on("click", "body", function () {
      if (
        $(".filters-toolbar__input-content").hasClass("is-open") &&
        $(event.target).closest(".filters-toolbar__input-title").length === 0 &&
        $(event.target).closest(".filters-toolbar__label").length === 0
      ) {
        $(".filters-toolbar__input-content").removeClass("is-open");
      }
    });
  }

  function queryParams() {
    Shopify.queryParams = {};

    if (location.search.length) {
      for (
        var aKeyValue, i = 0, aCouples = location.search.substr(1).split("&");
        i < aCouples.length;
        i++
      ) {
        aKeyValue = aCouples[i].split("=");

        if (aKeyValue.length > 1) {
          Shopify.queryParams[decodeURIComponent(aKeyValue[0])] =
            decodeURIComponent(aKeyValue[1]);
        }
      }
    }
  }

  function ajaxCreateUrl(baseLink) {
    var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, "+");

    if (baseLink) {
      if (newQuery != "") return baseLink + "?" + newQuery;
      else return baseLink;
    }
    return location.pathname + "?" + newQuery;
  }

  function filterAjaxClick(baseLink) {
    delete Shopify.queryParams.page;

    var newurl = ajaxCreateUrl(baseLink);

    History.pushState(
      {
        param: Shopify.queryParams,
      },
      newurl,
      newurl
    );
  }

  function ajaxSortBy() {
    var $sortby = $('.filters-toolbar__input-wrapper[data-select="SortBy"]'),
      $sortbyName = $sortby.find(".filters-toolbar__input-title .title"),
      $sortbyActive = $sortby
        .find(".filters-toolbar__input-content .active")
        .text();

    $sortbyName.text($sortbyActive);

    $(document).on(
      "click",
      ".filters-toolbar__input-list > div[data-sortby]",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        var self = $(this);

        if (!self.hasClass("active")) {
          Shopify.queryParams.sort_by = self.data("value");
          $sortby
            .find(".filters-toolbar__input-content div[data-sortby]")
            .removeClass("active");
          self.addClass("active");
          $sortbyName.text(self.text());

          filterAjaxClick();
        }
      }
    );
  }

  function ajaxFilterTags() {
    $(document).on(
      "click",
      ".list-tags a, .list-tags label, .refined .selected-tag",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        var self = $(this);
        var newTags = [];

        if (Shopify.queryParams.constraint) {
          newTags = Shopify.queryParams.constraint.split("+");
        }

        var tagName = self.prev().val();

        if (tagName) {
          var tagPos = newTags.indexOf(tagName);

          if (tagPos >= 0) {
            newTags.splice(tagPos, 1);
            self.prev().prop("checked", false);
          } else {
            newTags.push(tagName);
            self.prev().prop("checked", true);
          }
        }

        if (newTags.length) {
          Shopify.queryParams.constraint = newTags.join("+");
        } else {
          delete Shopify.queryParams.constraint;
        }

        filterAjaxClick();
      }
    );
  }

  function doAjaxSidebarGetContent(newurl) {
    $.ajax({
      type: "get",
      url: newurl,

      beforeSend: function () {
        theme.HaloAddOn.loadingPopup();
      },

      success: function (data) {
        ajaxMapData(data);
        hide_infinite_scrolling();
        ajaxFilterClearTags();
      },

      error: function (xhr, text) {
        alert($.parseJSON(xhr.responseText).description);
      },

      complete: function () {
        theme.HaloAddOn.removeLoadingPopup();
      },
    });
  }

  function ajaxMapData(data) {
    var curCollTemplate = $(".template-collection .page-collection"),
      curtoolbar = curCollTemplate.find(".collection-toolbar"),
      curtoolbar2 = curCollTemplate.find(".collection-sortBy"),
      curSidebar = curCollTemplate.find(".page-sidebar__content"),
      curProColl = curCollTemplate.find("#page-collection"),
      newCollTemplate = $(data).find(".page-collection"),
      newtoolbar = newCollTemplate.find(".collection-toolbar"),
      newtoolbar2 = newCollTemplate.find(".collection-sortBy"),
      newSidebar = newCollTemplate.find(".page-sidebar__content"),
      newProColl = newCollTemplate.find("#page-collection");

    if ($(window).width() > 1024) {
      curtoolbar.replaceWith(newtoolbar);
    }
    curProColl.replaceWith(newProColl);
    curSidebar.replaceWith(newSidebar);

    view_product();
    ajaxSortBy();

    if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
      Currency.convertAll(
        window.shop_currency,
        $("#currencies .active").attr("data-currency"),
        "span.money",
        "money_format"
      );
    }

    if ($(".shopify-product-reviews-badge").length && $(".spr-badge").length) {
      return (
        window.SPR.registerCallbacks(),
        window.SPR.initRatingHandler(),
        window.SPR.initDomEls(),
        window.SPR.loadProducts(),
        window.SPR.loadBadges()
      );
    }
  }

  function ajaxFilterClearTags() {
    var sidebarTag = $(".sidebarBlock");

    $(".sidebarBlock").each(function () {
      var sidebarTagchild = $(this);

      if (sidebarTagchild.find("input:checked").length) {
        //has active tag
        sidebarTagchild.addClass("show_clear");
      }
    });

    $(document).on("click", ".sidebarBlock.show_clear .clear", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var currentTags = [];
      var currentBlock = $(this).parents(".sidebarBlock");
      if (Shopify.queryParams.constraint) {
        currentTags = Shopify.queryParams.constraint.split("+");
      }

      currentBlock.find("input:checked").each(function () {
        var selectedTag = $(this);
        var tagName = selectedTag.val();

        if (tagName) {
          var tagPos = currentTags.indexOf(tagName);
          if (tagPos >= 0) {
            //remove tag
            currentTags.splice(tagPos, 1);
          }
        }
      });

      if (currentTags.length) {
        Shopify.queryParams.constraint = currentTags.join("+");
      } else {
        delete Shopify.queryParams.constraint;
      }

      filterAjaxClick();
    });
  }

  function ajaxFilterClearAll() {
    var clearAllSlt = ".refined-widgets .clear-all";
    var clearAllElm = $(clearAllSlt);

    $(document).on("click", clearAllSlt, function (e) {
      e.preventDefault();
      e.stopPropagation();

      delete Shopify.queryParams.constraint;

      filterAjaxClick();
      var newurl = ajaxCreateUrl();
      doAjaxSidebarGetContent(newurl);
    });
  }

  function historyAdapter() {
    var collTpl = $(".template-collection");

    if (collTpl.length) {
      History.Adapter.bind(window, "statechange", function () {
        var State = History.getState();

        queryParams();
        var newurl = ajaxCreateUrl();
        doAjaxSidebarGetContent(newurl);
      });
    }
  }

  function hide_infinite_scrolling() {
    // $('.infinite-scrolling').hide();
  }

  function hide_filters() {
    $(".filters-toolbar__input-wrapper").each(function () {
      if (
        $(this).find(".filters-toolbar__input-list").children("div").length > 0
      ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  function view_product() {
    var $viewproduct = $(
        '.filters-toolbar__input-wrapper[data-select="ViewProduct"]'
      ),
      $viewproductName = $viewproduct.find(
        ".filters-toolbar__input-title .title"
      ),
      $viewproductActive = $viewproduct
        .find(".filters-toolbar__input-content .active")
        .text();
    $viewproductActive2 = $viewproduct
      .find(".filters-toolbar__input-content .active")
      .attr("data-value");

    $viewproductName.text($viewproductActive);
    $("#collection").addClass($viewproductActive2);

    $(document)
      .off("click", ".filters-toolbar__input-list > div[data-viewproduct]")
      .on(
        "click",
        ".filters-toolbar__input-list > div[data-viewproduct]",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          $viewproductActive = $viewproduct
            .find(".filters-toolbar__input-content .active")
            .text();
          $viewproductActive2 = $viewproduct
            .find(".filters-toolbar__input-content .active")
            .attr("data-value");

          var self = $(this);

          if (!self.hasClass("active")) {
            $viewproduct
              .find(".filters-toolbar__input-content div[data-viewproduct]")
              .removeClass("active");
            self.addClass("active");
            $viewproductName.text(self.text());
            $("#collection")
              .removeClass($viewproductActive2)
              .addClass(self.attr("data-value"));
          }
        }
      );
  }

  function ajaxPagination() {
    if (!$(".template-collection").length) return;

    var paginationSlt = ".pagination .pagination__item a";

    $(document)
      .off("click", paginationSlt)
      .on("click", paginationSlt, function (e) {
        e.preventDefault();

        var page = $(this)
          .attr("href")
          .match(/page=\d+/g);

        if (page) {
          Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));
          if (Shopify.queryParams.page) {
            var newurl = ajaxCreateUrl();

            History.pushState(
              {
                param: Shopify.queryParams,
              },
              newurl,
              newurl
            );

            doAjaxSidebarGetContent(newurl);

            var elm = $(".template-collection .page-collection");

            if (!elm.length) {
              elm = $(".page-container");
            }

            var top = elm.offset().top;

            $("body,html").animate(
              {
                scrollTop: top,
              },
              800
            );
          }
        }
      });
  }

  return {
    init: function () {
      openDropdown();
      queryParams();
      hide_filters();
      ajaxSortBy();
      ajaxFilterTags();
      ajaxFilterClearTags();
      ajaxFilterClearAll();
      historyAdapter();
      view_product();
      ajaxPagination();
    },
  };
})();

theme.Maps = (function () {
  var config = {
    zoom: 14,
  };
  var apiStatus = null;
  var mapsToLoad = [];

  var errors = {
    addressNoResults: theme.strings.addressNoResults,
    addressQueryLimit: theme.strings.addressQueryLimit,
    addressError: theme.strings.addressError,
    authError: theme.strings.authError,
  };

  var selectors = {
    section: '[data-section-type="map"]',
    map: "[data-map]",
    mapOverlay: "[data-map-overlay]",
  };

  var classes = {
    mapError: "map-section--load-error",
    errorMsg: "map-section__error errors text-center",
  };

  // Global function called by Google on auth errors.
  // Show an auto error message on all map instances.
  // eslint-disable-next-line camelcase, no-unused-vars
  window.gm_authFailure = function () {
    if (!Shopify.designMode) {
      return;
    }

    $(selectors.section).addClass(classes.mapError);
    $(selectors.map).remove();
    $(selectors.mapOverlay).after(
      '<div class="' +
        classes.errorMsg +
        '">' +
        theme.strings.authError +
        "</div>"
    );
  };

  function Map(container) {
    this.$container = $(container);
    this.$map = this.$container.find(selectors.map);
    this.key = this.$map.data("api-key");

    if (typeof this.key === "undefined") {
      return;
    }

    if (apiStatus === "loaded") {
      this.createMap();
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== "loading") {
        apiStatus = "loading";
        if (typeof window.google === "undefined") {
          $.getScript(
            "https://maps.googleapis.com/maps/api/js?key=" + this.key
          ).then(function () {
            apiStatus = "loaded";
            initAllMaps();
          });
        }
      }
    }
  }

  function initAllMaps() {
    // API has loaded, load all Map instances in queue
    $.each(mapsToLoad, function (index, instance) {
      instance.createMap();
    });
  }

  function geolocate($map) {
    var deferred = $.Deferred();
    var geocoder = new google.maps.Geocoder();
    var address = $map.data("address-setting");

    geocoder.geocode({ address: address }, function (results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        deferred.reject(status);
      }

      deferred.resolve(results);
    });

    return deferred;
  }

  Map.prototype = _.assignIn({}, Map.prototype, {
    createMap: function () {
      var $map = this.$map;

      return geolocate($map)
        .then(
          function (results) {
            var mapOptions = {
              zoom: config.zoom,
              center: results[0].geometry.location,
              draggable: false,
              clickableIcons: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
              disableDefaultUI: true,
            };

            var map = (this.map = new google.maps.Map($map[0], mapOptions));
            var center = (this.center = map.getCenter());

            //eslint-disable-next-line no-unused-vars
            var marker = new google.maps.Marker({
              map: map,
              position: map.getCenter(),
            });

            google.maps.event.addDomListener(
              window,
              "resize",
              $.debounce(250, function () {
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
                $map.removeAttr("style");
              })
            );
          }.bind(this)
        )
        .fail(function () {
          var errorMessage;

          switch (status) {
            case "ZERO_RESULTS":
              errorMessage = errors.addressNoResults;
              break;
            case "OVER_QUERY_LIMIT":
              errorMessage = errors.addressQueryLimit;
              break;
            case "REQUEST_DENIED":
              errorMessage = errors.authError;
              break;
            default:
              errorMessage = errors.addressError;
              break;
          }

          // Show errors only to merchant in the editor.
          if (Shopify.designMode) {
            $map
              .parent()
              .addClass(classes.mapError)
              .html(
                '<div class="' +
                  classes.errorMsg +
                  '">' +
                  errorMessage +
                  "</div>"
              );
          }
        });
    },

    onUnload: function () {
      if (this.$map.length === 0) {
        return;
      }
      google.maps.event.clearListeners(this.map, "resize");
    },
  });

  return Map;
})();

theme.Product = (function () {
  function Product(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr("data-section-id");
    this.ajaxEnabled = $container.data("ajax-enabled");

    this.settings = {
      mediaQueryMediumUp: "screen and (min-width: 1025px)",
      mediaQuerySmall: "screen and (max-width: 1024px)",
      bpSmall: false,
      enableHistoryState: $container.data("enable-history-state") || false,
      namespace: ".slideshow-" + sectionId,
      sectionId: sectionId,
      sliderActive: false,
      zoomEnabled: false,
    };

    this.selectors = {
      addToCart: "[data-add-to-cart]",
      addToCartText: "[data-add-to-cart-text]",
      cartCount: "[data-cart-count]",
      cartCountBubble: "[data-cart-count-bubble]",
      cartPopup: "[data-cart-popup]",
      cartPopupCartQuantity: "[data-cart-popup-cart-quantity]",
      cartPopupClose: "[data-cart-popup-close]",
      cartPopupDismiss: "[data-cart-popup-dismiss]",
      cartPopupImage: "[data-cart-popup-image]",
      cartPopupImageWrapper: "[data-cart-popup-image-wrapper]",
      cartPopupImagePlaceholder: "[data-cart-popup-image-placeholder]",
      cartPopupPlaceholderSize: "[data-placeholder-size]",
      cartPopupProductDetails: "[data-cart-popup-product-details]",
      cartPopupQuantity: "[data-cart-popup-quantity]",
      cartPopupQuantityLabel: "[data-cart-popup-quantity-label]",
      cartPopupTitle: "[data-cart-popup-title]",
      cartPopupWrapper: "[data-cart-popup-wrapper]",
      labelSale: "[data-label-sale]",
      loader: "[data-loader]",
      loaderStatus: "[data-loader-status]",
      quantity: "[data-quantity-input]",
      SKU: ".variant-sku",
      inventory: ".variant-inventory",
      productStatus: "[data-product-status]",
      originalSelectorId: "#ProductSelect-" + sectionId,
      productForm: "[data-product-form]",
      errorMessage: "[data-error-message]",
      errorMessageWrapper: "[data-error-message-wrapper]",
      productImageWraps: ".product-single__photo",
      productThumbImages: ".product-single__thumbnail--" + sectionId,
      productThumbs: ".product-single__thumbnails-" + sectionId,
      productThumbListItem: ".product-single__thumbnails-item",
      productFeaturedImage: ".product-featured-img",
      productThumbsWrapper: ".thumbnails-wrapper",
      saleLabel: ".product-price__sale-label-" + sectionId,
      singleOptionSelector: ".single-option-selector-" + sectionId,
      shopifyPaymentButton: ".shopify-payment-button",
      priceContainer: "[data-price]",
      regularPrice: "[data-regular-price]",
      salePrice: "[data-sale-price]",
      unitPrice: "[data-unit-price]",
      totalPrice: "[data-total-price]",
      unitPriceBaseUnit: "[data-unit-price-base-unit]",
      productPolicies: "[data-product-policies]",
      productWrapper: ".product-single__photos-wrapper-" + sectionId,
      productChangeGroupImage: "[data-change-group-image]",
      productSwatch: "[data-filter]",
    };

    this.classes = {
      cartPopupWrapperHidden: "cart-popup-wrapper--hidden",
      hidden: "hide",
      visibilityHidden: "visibility-hidden",
      inputError: "input--error",
      productOnSale: "price--on-sale",
      productUnitAvailable: "price--unit-available",
      productUnavailable: "price--unavailable",
      productSoldOut: "price--sold-out",
      cartImage: "cart-popup-item__image",
      productFormErrorMessageWrapperHidden:
        "product-form__error-message-wrapper--hidden",
      activeClass: "active-thumb",
      variantSoldOut: "product-form--variant-sold-out",
      slider: "slider",
    };

    this.$quantityInput = $(this.selectors.quantity, $container);
    this.$errorMessageWrapper = $(
      this.selectors.errorMessageWrapper,
      $container
    );
    this.$addToCart = $(this.selectors.addToCart, $container);
    this.$addToCartText = $(this.selectors.addToCartText, this.$addToCart);
    this.$shopifyPaymentButton = $(
      this.selectors.shopifyPaymentButton,
      $container
    );
    this.$productPolicies = $(this.selectors.productPolicies, $container);

    this.$loader = $(this.selectors.loader, this.$addToCart);
    this.$loaderStatus = $(this.selectors.loaderStatus, $container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$("#ProductJson-" + sectionId).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      document.getElementById("ProductJson-" + sectionId).innerHTML
    );

    this.settings.zoomEnabled = $(this.selectors.productImageWraps).hasClass(
      "js-zoom-enabled"
    );

    this._initBreakpoints();
    this._stringOverrides();
    this._initImageSwitch();
    this._initImageCarousel();
    this._initVariants();
    this._initAddToCart();
    this._scrollToReview();
    this._addonSoldOutProduct();
    this._addonCountdown();
    this._addonTermsConditions();
    this._addonCustomerView();
    this._addonChangeImageGroup();
    this._addonVideoPopup();
    this._addonSizeChartPopup();
    this._addonCompareColorPopup();
    this._addonFancybox();
    this._addonShowmoreDescription();
  }

  Product.prototype = _.assignIn({}, Product.prototype, {
    _stringOverrides: function () {
      theme.productStrings = theme.productStrings || {};
      $.extend(theme.strings, theme.productStrings);
    },

    _initBreakpoints: function () {
      var self = this;

      enquire.register(this.settings.mediaQuerySmall, {
        match: function () {
          // destroy image zooming if enabled
          if (self.settings.zoomEnabled) {
            $(self.selectors.productImageWraps).each(function () {
              _destroyZoom(this);
            });
          }

          self.settings.bpSmall = true;
        },
        unmatch: function () {
          self.settings.bpSmall = false;
        },
      });

      enquire.register(this.settings.mediaQueryMediumUp, {
        match: function () {
          if (self.settings.zoomEnabled) {
            $(self.selectors.productImageWraps).each(function () {
              _enableZoom(this);
            });
          }
        },
      });
    },

    _initVariants: function () {
      var options = {
        $container: this.$container,
        enableHistoryState:
          this.$container.data("enable-history-state") || false,
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId,
        product: this.productSingleObject,
      };

      this.variants = new slate.Variants(options);

      var variant = this.variants._getVariantFromOptions();

      if (variant != null && variant.featured_media != null) {
        var imageId = variant.featured_media.id;

        this._switchImage(imageId);
        this._setActiveThumbnail(imageId);
      }

      this.$container.on(
        "variantChange" + this.settings.namespace,
        this._updateAvailability.bind(this)
      );
      this.$container.on(
        "variantImageChange" + this.settings.namespace,
        this._updateImages.bind(this)
      );
      this.$container.on(
        "variantPriceChange" + this.settings.namespace,
        this._updatePrice.bind(this)
      );
      this.$container.on(
        "variantSKUChange" + this.settings.namespace,
        this._updateSKU.bind(this)
      );

      setTimeout(function () {
        $(".product-single__photos").removeClass(
          "product-single__photos--hide"
        );
      }, 500);
    },

    _initImageSwitch: function () {
      if (!$(this.selectors.productThumbImages).length) {
        return;
      }

      var self = this;

      $(this.selectors.productThumbImages)
        .on("click", function (evt) {
          evt.preventDefault();
          var $el = $(this);

          var imageId = $el.data("thumbnail-id");

          self._switchImage(imageId);
          self._setActiveThumbnail(imageId);
        })
        .on("keyup", self._handleImageFocus.bind(self));
    },

    _initImageCarousel: function () {
      var $carousel_for = $(this.selectors.productWrapper),
        $carousel_nav = $(this.selectors.productThumbs);

      if (!$carousel_for.hasClass(this.classes.slider)) {
        return;
      }

      $carousel_for.slick({
        rows: 0,
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: $carousel_nav,
        prevArrow:
          '<div class="slick-prev slick-arrow slick-arrow--large"><svg class="icon"><use xlink:href="#icon-chevron-up"></svg></div>',
        nextArrow:
          '<div class="slick-next slick-arrow slick-arrow--large"><svg class="icon"><use xlink:href="#icon-chevron-down"></svg></div>',
        responsive: [
          {
            breakpoint: 1399,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 990,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
            },
          },
          {
            breakpoint: 450,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
            },
          },
        ],
      });

      $carousel_nav.slick({
        rows: 0,
        dots: false,
        arrows: true,
        infinite: true,
        vertical: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        focusOnSelect: true,
        asNavFor: $carousel_for,
        prevArrow:
          '<div class="slick-prev slick-arrow slick-arrow--large"><svg class="icon"><use xlink:href="#icon-chevron-up"></svg></div>',
        nextArrow:
          '<div class="slick-next slick-arrow slick-arrow--large"><svg class="icon"><use xlink:href="#icon-chevron-down"></svg></div>',
        responsive: [
          {
            breakpoint: 1690,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1399,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 990,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 360,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
        ],
      });

      if ($(window).width() > 991) {
        if ($carousel_nav.find(".slick-arrow").length) {
          var $height_for = $carousel_for.outerHeight(),
            $height_nav = $carousel_nav.outerHeight();
          var $position = ($height_for - $height_nav) / 2;
          $carousel_nav.css("top", $position);
        } else {
          $carousel_nav.addClass("arrows-disable");
        }
      }
    },

    _initAddToCart: function () {
      $(this.selectors.productForm, this.$container).on(
        "submit",
        function (evt) {
          if (this.$addToCart.is("[aria-disabled]")) {
            evt.preventDefault();
            return;
          }

          if (!this.ajaxEnabled) return;

          evt.preventDefault();

          this.$previouslyFocusedElement = $(":focus");

          var isInvalidQuantity = this.$quantityInput.val() <= 0;

          if (isInvalidQuantity) {
            this._showErrorMessage(theme.strings.quantityMinimumMessage);
            return;
          }

          if (!isInvalidQuantity && this.ajaxEnabled) {
            // disable the addToCart and dynamic checkout button while
            // request/cart popup is loading and handle loading state
            this._handleButtonLoadingState(true);
            var $data = $(this.selectors.productForm, this.$container);
            this._addItemToCart($data);
            return;
          }
        }.bind(this)
      );
    },

    _addItemToCart: function (data) {
      var params = {
        url: window.router + "/cart/add.js",
        data: $(data).serialize(),
        dataType: "json",
      };

      $.post(params)
        .done(
          function (item) {
            this._hideErrorMessage();
            this._setupCartPopup(item);
            this._setupSideCart();
          }.bind(this)
        )
        .fail(
          function (response) {
            this.$previouslyFocusedElement.focus();
            var errorMessage = response.responseJSON
              ? response.responseJSON.description
              : theme.strings.cartError;
            this._showErrorMessage(errorMessage);
            this._handleButtonLoadingState(false);
          }.bind(this)
        );
    },

    _handleButtonLoadingState: function (isLoading) {
      if (isLoading) {
        this.$addToCart.attr("aria-disabled", true);
        this.$addToCartText.addClass(this.classes.hidden);
        this.$loader.removeClass(this.classes.hidden);
        this.$shopifyPaymentButton.attr("disabled", true);
        this.$loaderStatus.attr("aria-hidden", false);
      } else {
        this.$addToCart.removeAttr("aria-disabled");
        this.$addToCartText.removeClass(this.classes.hidden);
        this.$loader.addClass(this.classes.hidden);
        this.$shopifyPaymentButton.removeAttr("disabled");
        this.$loaderStatus.attr("aria-hidden", true);
      }
    },

    _showErrorMessage: function (errorMessage) {
      $(this.selectors.errorMessage, this.$container).html(errorMessage);

      if (this.$quantityInput.length !== 0) {
        this.$quantityInput.addClass(this.classes.inputError);
      }

      this.$errorMessageWrapper
        .removeClass(this.classes.productFormErrorMessageWrapperHidden)
        .attr("aria-hidden", true)
        .removeAttr("aria-hidden");
    },

    _hideErrorMessage: function () {
      this.$errorMessageWrapper.addClass(
        this.classes.productFormErrorMessageWrapperHidden
      );

      if (this.$quantityInput.length !== 0) {
        this.$quantityInput.removeClass(this.classes.inputError);
      }
    },

    _setupSideCart: function () {
      if ($(window).width() > 1024) {
        $("[data-cart-pc]").trigger("click");
      } else {
        $("[data-mobile-cart]").trigger("click");
      }
    },

    _setupCartPopup: function (item) {
      this.$cartPopup = this.$cartPopup || $(this.selectors.cartPopup);
      this.$cartPopupWrapper =
        this.$cartPopupWrapper || $(this.selectors.cartPopupWrapper);
      this.$cartPopupTitle =
        this.$cartPopupTitle || $(this.selectors.cartPopupTitle);
      this.$cartPopupQuantity =
        this.$cartPopupQuantity || $(this.selectors.cartPopupQuantity);
      this.$cartPopupQuantityLabel =
        this.$cartPopupQuantityLabel ||
        $(this.selectors.cartPopupQuantityLabel);
      this.$cartPopupClose =
        this.$cartPopupClose || $(this.selectors.cartPopupClose);
      this.$cartPopupDismiss =
        this.$cartPopupDismiss || $(this.selectors.cartPopupDismiss);
      this.$cartPopupImagePlaceholder =
        this.$cartPopupImagePlaceholder ||
        $(this.selectors.cartPopupImagePlaceholder);

      this._setupCartPopupEventListeners();

      this._updateCartPopupContent(item);
    },

    _updateCartPopupContent: function (item) {
      var quantity = this.$quantityInput.length ? this.$quantityInput.val() : 1;

      this.$cartPopupTitle.text(item.product_title);
      this.$cartPopupQuantity.text(quantity);
      this.$cartPopupQuantityLabel.text(
        theme.strings.quantityLabel.replace("[count]", quantity)
      );

      this._setCartPopupPlaceholder(
        item.featured_image.url,
        item.featured_image.aspect_ratio
      );
      this._setCartPopupImage(item.featured_image.url, item.featured_image.alt);
      this._setCartPopupProductDetails(
        item.product_has_only_default_variant,
        item.options_with_values,
        item.properties
      );

      $.getJSON(window.router + "/cart.js").then(
        function (cart) {
          this._setCartQuantity(cart.item_count);
          this._setCartCountBubble(cart.item_count);
          this._showCartPopup();
        }.bind(this)
      );
      setTimeout(function () {
        if (!$(this.$cartPopupWrapper).hasClass("cart-popup-wrapper--hidden")) {
          $("[data-cart-popup-close]").trigger("click");
        }
      }, 3000);
    },

    _setupCartPopupEventListeners: function () {
      this.$cartPopupWrapper.on(
        "keyup",
        function (event) {
          if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
            this._hideCartPopup(event);
          }
        }.bind(this)
      );

      this.$cartPopupClose.on("click", this._hideCartPopup.bind(this));
      this.$cartPopupDismiss.on("click", this._hideCartPopup.bind(this));
    },

    _setCartPopupPlaceholder: function (imageUrl, imageAspectRatio) {
      this.$cartPopupImageWrapper =
        this.$cartPopupImageWrapper || $(this.selectors.cartPopupImageWrapper);

      if (imageUrl === null) {
        this.$cartPopupImageWrapper.addClass(this.classes.hidden);
        return;
      }

      var $placeholder = $(this.selectors.cartPopupPlaceholderSize);
      var maxWidth = 95 * imageAspectRatio;
      var heightRatio = 100 / imageAspectRatio;

      this.$cartPopupImagePlaceholder.css("max-width", maxWidth);

      $placeholder.css("padding-top", heightRatio + "%");
    },

    _setCartPopupImage: function (imageUrl, imageAlt) {
      if (imageUrl === null) return;

      this.$cartPopupImageWrapper.removeClass(this.classes.hidden);
      var sizedImageUrl = theme.Images.getSizedImageUrl(imageUrl, "200x");
      var image = document.createElement("img");
      image.src = sizedImageUrl;
      image.alt = imageAlt;
      image.classList.add(this.classes.cartImage);
      image.dataset.cartPopupImage = "";

      image.onload = function () {
        this.$cartPopupImagePlaceholder.addClass(this.classes.hidden);
        this.$cartPopupImageWrapper.append(image);
      }.bind(this);
    },

    _setCartPopupProductDetails: function (
      product_has_only_default_variant,
      options,
      properties
    ) {
      this.$cartPopupProductDetails =
        this.$cartPopupProductDetails ||
        $(this.selectors.cartPopupProductDetails);
      var variantPropertiesHTML = "";

      if (!product_has_only_default_variant) {
        variantPropertiesHTML =
          variantPropertiesHTML + this._getVariantOptionList(options);
      }

      if (properties !== null && Object.keys(properties).length !== 0) {
        variantPropertiesHTML =
          variantPropertiesHTML + this._getPropertyList(properties);
      }

      if (variantPropertiesHTML.length === 0) {
        this.$cartPopupProductDetails.html("");
        this.$cartPopupProductDetails.attr("hidden", "");
      } else {
        this.$cartPopupProductDetails.html(variantPropertiesHTML);
        this.$cartPopupProductDetails.removeAttr("hidden");
      }
    },

    _getVariantOptionList: function (variantOptions) {
      var variantOptionListHTML = "";

      variantOptions.forEach(function (variantOption) {
        variantOptionListHTML =
          variantOptionListHTML +
          '<li class="product-details__item product-details__item--variant-option">' +
          variantOption.value +
          "</li>";
      });

      return variantOptionListHTML;
    },

    _getPropertyList: function (properties) {
      var propertyListHTML = "";
      var propertiesArray = Object.entries(properties);

      propertiesArray.forEach(function (property) {
        // Line item properties prefixed with an underscore are not to be displayed
        if (property[0].charAt(0) === "_") return;

        // if the property value has a length of 0 (empty), don't display it
        if (property[1].length === 0) return;

        propertyListHTML =
          propertyListHTML +
          '<li class="product-details__item product-details__item--property">' +
          '<span class="product-details__property-label">' +
          property[0] +
          ": </span>" +
          property[1];
        ": " + "</li>";
      });

      return propertyListHTML;
    },

    _setCartQuantity: function (quantity) {
      this.$cartPopupCartQuantity =
        this.$cartPopupCartQuantity || $(this.selectors.cartPopupCartQuantity);
      var ariaLabel;

      if (quantity === 1) {
        ariaLabel = theme.strings.oneCartCount;
      } else if (quantity > 1) {
        ariaLabel = theme.strings.otherCartCount.replace("[count]", quantity);
      }

      this.$cartPopupCartQuantity.text(quantity).attr("aria-label", ariaLabel);
    },

    _setCartCountBubble: function (quantity) {
      this.$cartCountBubble =
        this.$cartCountBubble || $(this.selectors.cartCountBubble);
      this.$cartCount = this.$cartCount || $(this.selectors.cartCount);

      this.$cartCountBubble.removeClass(this.classes.hidden);
      this.$cartCount.text(quantity);
    },

    _showCartPopup: function () {
      this.$cartPopupWrapper
        .prepareTransition()
        .removeClass(this.classes.cartPopupWrapperHidden);
      this._handleButtonLoadingState(false);

      slate.a11y.trapFocus({
        $container: this.$cartPopupWrapper,
        $elementToFocus: this.$cartPopup,
        namespace: "cartPopupFocus",
      });
    },

    _hideCartPopup: function (event) {
      var setFocus = event.detail === 0 ? true : false;
      this.$cartPopupWrapper
        .prepareTransition()
        .addClass(this.classes.cartPopupWrapperHidden);

      $(this.selectors.cartPopupImage).remove();
      this.$cartPopupImagePlaceholder.removeClass(this.classes.hidden);

      slate.a11y.removeTrapFocus({
        $container: this.$cartPopupWrapper,
        namespace: "cartPopupFocus",
      });

      if (setFocus) this.$previouslyFocusedElement[0].focus();

      this.$cartPopupWrapper.off("keyup");
      this.$cartPopupClose.off("click");
      this.$cartPopupDismiss.off("click");
      $("body").off("click");
    },

    _onBodyClick: function (event) {
      var $target = $(event.target);
      if (
        $target[0] !== this.$cartPopupWrapper[0] &&
        !$target.parents(this.selectors.cartPopup).length
      ) {
        this._hideCartPopup(event);
      }
    },

    _setActiveThumbnail: function (imageId) {
      // If there is no element passed, find it by the current product image
      if (typeof imageId === "undefined") {
        imageId = $(
          this.selectors.productImageWraps + ":not(.hide)",
          this.$container
        ).data("image-id");
      }

      var $thumbnailWrappers = $(
        this.selectors.productThumbListItem + ":not(.slick-cloned)",
        this.$container
      );

      var $activeThumbnail = $thumbnailWrappers.find(
        this.selectors.productThumbImages +
          "[data-thumbnail-id='" +
          imageId +
          "']"
      );

      $(this.selectors.productThumbImages)
        .removeClass(this.classes.activeClass)
        .removeAttr("aria-current");

      $activeThumbnail.addClass(this.classes.activeClass);
      $activeThumbnail.attr("aria-current", true);

      if (!$thumbnailWrappers.hasClass("slick-slide")) {
        return;
      }
      var slideIndex = $activeThumbnail.parent().data("slick-index");
      $(this.selectors.productThumbs).slick("slickGoTo", slideIndex);
    },

    _switchImage: function (imageId) {
      var $newImage = $(
        this.selectors.productImageWraps + "[data-image-id='" + imageId + "']",
        this.$container
      );
      var $otherImages = $(
        this.selectors.productImageWraps +
          ":not([data-image-id='" +
          imageId +
          "'])",
        this.$container
      );

      // $newImage.removeClass(this.classes.hidden);
      // $otherImages.addClass(this.classes.hidden);
    },

    _handleImageFocus: function (evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.ENTER) return;

      $(this.selectors.productFeaturedImage + ":visible").focus();
    },

    _liveRegionText: function (variant) {
      // Dummy content for live region
      var liveRegionText =
        "[Availability] [Regular] [$$] [Sale] [$]. [UnitPrice] [$$$]";

      if (!variant) {
        liveRegionText = theme.strings.unavailable;
        return liveRegionText;
      }

      // Update availability
      var availability = variant.available ? "" : theme.strings.soldOut + ",";
      liveRegionText = liveRegionText.replace("[Availability]", availability);

      // Update pricing information
      var regularLabel = "";
      var regularPrice = theme.Currency.formatMoney(
        variant.price,
        theme.moneyFormat
      );
      var saleLabel = "";
      var salePrice = "";
      var unitLabel = "";
      var unitPrice = "";

      if (variant.compare_at_price > variant.price) {
        regularLabel = theme.strings.regularPrice;
        regularPrice =
          theme.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          ) + ",";
        saleLabel = theme.strings.sale;
        salePrice = theme.Currency.formatMoney(
          variant.price,
          theme.moneyFormat
        );
      }

      if (variant.unit_price) {
        unitLabel = theme.strings.unitPrice;
        unitPrice =
          theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat) +
          " " +
          theme.strings.unitPriceSeparator +
          " " +
          this._getBaseUnit(variant);
      }

      liveRegionText = liveRegionText
        .replace("[Regular]", regularLabel)
        .replace("[$$]", regularPrice)
        .replace("[Sale]", saleLabel)
        .replace("[$]", salePrice)
        .replace("[UnitPrice]", unitLabel)
        .replace("[$$$]", unitPrice)
        .trim();

      return liveRegionText;
    },

    _updateLiveRegion: function (evt) {
      var variant = evt.variant;
      var liveRegion = this.container.querySelector(
        this.selectors.productStatus
      );
      liveRegion.innerHTML = this._liveRegionText(variant);
      liveRegion.setAttribute("aria-hidden", false);

      // hide content from accessibility tree after announcement
      setTimeout(function () {
        liveRegion.setAttribute("aria-hidden", true);
      }, 1000);
    },

    _updateAddToCart: function (evt) {
      var variant = evt.variant;

      if (variant) {
        if (variant.available) {
          this.$addToCart
            .removeAttr("aria-disabled")
            .attr("aria-label", theme.strings.addToCart);
          $(this.selectors.addToCartText, this.$container).text(
            theme.strings.addToCart
          );
          $(this.selectors.productForm, this.container).removeClass(
            this.classes.variantSoldOut
          );
        } else {
          // The variant doesn't exist, disable submit button and change the text.
          // This may be an error or notice that a specific variant is not available.
          this.$addToCart
            .attr("aria-disabled", true)
            .attr("aria-label", theme.strings.soldOut);
          $(this.selectors.addToCartText, this.$container).text(
            theme.strings.soldOut
          );
          $(this.selectors.productForm, this.container).addClass(
            this.classes.variantSoldOut
          );
        }
      } else {
        this.$addToCart
          .attr("aria-disabled", true)
          .attr("aria-label", theme.strings.unavailable);
        $(this.selectors.addToCartText, this.$container).text(
          theme.strings.unavailable
        );
        $(this.selectors.productForm, this.container).addClass(
          this.classes.variantSoldOut
        );
      }
    },

    _updateAvailability: function (evt) {
      // remove error message if one is showing
      this._hideErrorMessage();

      // update form submit
      this._updateAddToCart(evt);

      // update live region
      this._updateLiveRegion(evt);

      this._updatePrice(evt);
    },

    _updateImages: function (evt) {
      var variant = evt.variant;
      var imageId = variant.featured_media.id;

      this._switchImage(imageId);
      this._setActiveThumbnail(imageId);
    },

    _updatePrice: function (evt) {
      var variant = evt.variant;

      var $priceContainer = $(this.selectors.priceContainer, this.$container);
      var $regularPrice = $(this.selectors.regularPrice, $priceContainer);
      var $salePrice = $(this.selectors.salePrice, $priceContainer);
      var $unitPrice = $(this.selectors.unitPrice, $priceContainer);
      var $totalPrice = $(this.selectors.totalPrice, this.$container);
      var $labelSale = $(this.selectors.labelSale, this.$container);
      var $unitPriceBaseUnit = $(
        this.selectors.unitPriceBaseUnit,
        $priceContainer
      );

      // Reset product price state
      $priceContainer
        .removeClass(this.classes.productUnavailable)
        .removeClass(this.classes.productOnSale)
        .removeClass(this.classes.productUnitAvailable)
        .removeAttr("aria-hidden");

      this.$productPolicies.removeClass(this.classes.visibilityHidden);

      // Unavailable
      if (!variant) {
        $priceContainer
          .addClass(this.classes.productUnavailable)
          .attr("aria-hidden", true);

        this.$productPolicies.addClass(this.classes.visibilityHidden);
        return;
      }

      // Sold out
      // if (!variant.available) {
      //     $priceContainer.addClass(this.classes.productSoldOut);
      //     return;
      // }

      // On sale
      var quantity = this.$quantityInput.val();
      if (variant.compare_at_price > variant.price) {
        // Regular price
        $regularPrice.html(
          theme.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          )
        );

        // Sale price
        $salePrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
        // Total price
        $totalPrice.attr("data-price-value", variant.price);
        $totalPrice.html(
          theme.Currency.formatMoney(
            variant.price * quantity,
            theme.moneyFormat
          )
        );
        $priceContainer.addClass(this.classes.productOnSale);

        // label Sale
        $labelSale.show();
        $labelSale.html(
          "-" +
            Math.floor(
              ((variant.compare_at_price - variant.price) /
                variant.compare_at_price) *
                100
            ) +
            "% " +
            theme.strings.off
        );
      } else {
        // Regular price
        $regularPrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
        // Sale price
        $salePrice.html("");
        // Total price
        $totalPrice.attr("data-price-value", variant.price);
        $totalPrice.html(
          theme.Currency.formatMoney(
            variant.price * quantity,
            theme.moneyFormat
          )
        );
        $labelSale.hide();
      }

      // Unit price
      if (variant.unit_price) {
        $unitPrice.html(
          theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
        );
        $unitPriceBaseUnit.html(this._getBaseUnit(variant));
        $priceContainer.addClass(this.classes.productUnitAvailable);
      }

      if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
        Currency.convertAll(
          window.shop_currency,
          $("#currencies .active").attr("data-currency"),
          "span.money",
          "money_format"
        );
      }
    },

    _getBaseUnit: function (variant) {
      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value +
            variant.unit_price_measurement.reference_unit;
    },

    _updateSKU: function (evt) {
      var variant = evt.variant;

      // Update the sku
      $(this.selectors.SKU).html(variant.sku);

      // Update the inventory

      if (variant.available === true) {
        $(this.selectors.inventory).addClass("variant-inventory--true");
      } else {
        $(this.selectors.inventory).removeClass("variant-inventory--true");
      }
    },

    _scrollToReview: function () {
      $(document).on(
        "click",
        ".product-single__details .spr-badge",
        function (event) {
          event.preventDefault();
          if ($(".tab-horizontal").length) {
            var offset = $(".productView-description").offset();
            if ($(window).width() > 767) {
              $(".tab_review .tab-title").trigger("click");
              offset.top = offset.top - 70;
            } else {
              $(".tab-content .toggle-content.show")
                .prev()
                .find(".toggleLink")
                .trigger("click");
              $(".tab-pane-review .toggleLink").trigger("click");
            }
          }

          $("body,html").animate(
            {
              scrollTop: offset.top - 70,
            },
            1000
          );
        }
      );
    },

    _addonSoldOutProduct: function () {
      if (!$("[data-soldOut-product]").length) {
        return;
      }

      $("[data-soldOut-product]").each(function () {
        var self = $(this);

        var items = self.data("items").toString().split(","),
          hours = self.data("hours").toString().split(","),
          i = Math.floor(Math.random() * items.length),
          j = Math.floor(Math.random() * hours.length);

        self.find(".items-count").text(items[i]);
        self.find(".hours-num").text(hours[j]);
      });
    },

    _addonCountdown: function () {
      if (!$("[data-countdown]").length) {
        return;
      }

      $("[data-countdown]").each(function () {
        // Set the date we're counting down to
        if ($(this).hasClass("has-value")) {
          return;
        }

        var self = $(this),
          countDownDate = new Date(self.attr("data-countdown-value")).getTime();
        // Update the count down every 1 second
        var countdownfunction = setInterval(function () {
          // Get todays date and time
          var now = new Date().getTime();

          // Find the distance between now an the count down date
          var distance = countDownDate - now;

          // If the count down is over, write some text
          if (distance < 0) {
            clearInterval(countdownfunction);
            self.parent().remove();
          } else {
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            var minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            var strCountDown =
              "<span class='countdown--item'>" +
              showTime(days) +
              "D</span> : <span class='countdown--item'>" +
              showTime(hours) +
              "H</span> : <span class='countdown--item'>" +
              showTime(minutes) +
              "M</span> : <span class='countdown--item'>" +
              showTime(seconds) +
              "S</span>";
            self.html(strCountDown);
            self.addClass("has-value");
          }
        }, 500);
      });
    },

    _addonTermsConditions: function () {
      if (
        !$(".product-form__item--payment-button .product__terms-conditions")
          .length
      ) {
        return;
      }

      var checkBox = $(
        '.product-form__item--payment-button .product__terms-conditions input[type="checkbox"]'
      );

      checkBox.each(function () {
        if ($(this).prop("checked")) {
          $(this)
            .parents(".product-form__item--payment-button")
            .find(".shopify-payment-button")
            .removeClass("disabled");
        } else {
          $(this)
            .parents(".product-form__item--payment-button")
            .find(".shopify-payment-button")
            .addClass("disabled");
        }
      });

      $(document).on(
        "click",
        ".product-form__item--payment-button .product__terms-conditions .title",
        function (e) {
          e.preventDefault();
          var self = $(this),
            ipt = self.prev();

          if (!ipt.prop("checked")) {
            ipt.prop("checked", true);
            self
              .parents(".product-form__item--payment-button")
              .find(".shopify-payment-button")
              .removeClass("disabled");
          } else {
            ipt.prop("checked", false);
            self
              .parents(".product-form__item--payment-button")
              .find(".shopify-payment-button")
              .addClass("disabled");
          }
        }
      );
    },

    _addonCustomerView: function () {
      if (!$(".product__customers-view").length) {
        return;
      }

      var customerView = $("[data-customer-view]");

      customerView.each(function () {
        var self = $(this);

        setInterval(function () {
          var views = self.data("customer-view").split(","),
            i = Math.floor(Math.random() * views.length);

          self.find("label").text(views[i]);
        }, 5000);
      });
    },

    _addonVideoPopup: function () {
      if (!$(".product-single__videos").length) {
        return;
      }

      $(".video-link").on("click", function (event) {
        event.preventDefault();

        var $src = $(this).data("popup-video"),
          $popup = $("#video-modal");

        $popup.find(".modal-body").html();

        const $content =
          '<div class="popup-video">\
                            <div class="popup-video-main">\
                                <iframe\
                                    id="player"\
                                    type="text/html"\
                                    width="100%"\
                                    frameborder="0"\
                                    webkitAllowFullScreen\
                                    mozallowfullscreen\
                                    allowFullScreen\
                                    src="' +
          $src +
          '"\
                                    data-video-player>\
                                </iframe>\
                            </div>\
                        </div>';

        $popup.find(".modal-body").html($content);

        theme.HaloAddOn.videoPopup();
      });
    },

    _addonSizeChartPopup: function () {
      if (!$(".size-chart-link").length) {
        return;
      }

      $(".size-chart-link").on("click", function (event) {
        event.preventDefault();

        theme.HaloAddOn.sizeChartPopup();
      });
    },

    _addonCompareColorPopup: function () {
      if (!$(".compareColor-link").length) {
        return;
      }

      $(document).on("click", ".compareColor-link", function (event) {
        event.preventDefault();
        theme.HaloAddOn.compareColorPopup();
      });

      $(document).on("click", ".compareColor-swatch label", function (event) {
        event.preventDefault();

        $(".compareColor-swatch label").removeClass("disabled2");

        var self = $(this),
          $ipt = self.prev(),
          $image = self.data("image");
        $value = self.data("value");
        $value2 = self.html();
        $limit = 0;

        if (!$ipt.prop("checked")) {
          $ipt.prop("checked", true);
          self
            .parents("#compareColor-modal")
            .find(".show-img")
            .append(
              '<div class="item text-center ' +
                $value +
                '"><img srcset="' +
                $image +
                '" alt="" /><p>' +
                $value2 +
                "</p></div>"
            );
          $limit = $("#compareColor-modal .show-img .item").length;
        } else {
          $ipt.prop("checked", false);
          self
            .parents("#compareColor-modal")
            .find(".show-img " + "." + $value)
            .remove();
          $limit = $("#compareColor-modal .show-img .item").length;
        }

        if ($limit < 5) {
          $(".compareColor-swatch label").removeClass("disabled2");
        } else {
          $(".compareColor-swatch label").addClass("disabled2");
        }
      });
    },

    _addonChangeImageGroup: function () {
      if (!$(this.selectors.productChangeGroupImage, this.$container).length) {
        return;
      }

      var $carousel_for = $(this.selectors.productWrapper),
        $carousel_nav = $(this.selectors.productThumbs);

      var $inputChecked;

      if (
        $(this.selectors.productChangeGroupImage, this.$container).find(
          ".swatch-element.color"
        ).length
      ) {
        $inputChecked = $(
          this.selectors.productChangeGroupImage,
          this.$container
        ).find(".swatch-element.color :radio:checked");

        if ($inputChecked.length) {
          var $colorName = $inputChecked.data("filter");

          if ($colorName != undefined) {
            $carousel_for.slick("slickUnfilter");
            $carousel_nav.slick("slickUnfilter");
            if (
              $carousel_nav.find($colorName).length &&
              $carousel_for.find($colorName).length
            ) {
              $carousel_for.slick("slickFilter", $colorName).slick("refresh");
              $carousel_nav.slick("slickFilter", $colorName).slick("refresh");
            }
          }
        }

        $(this.selectors.productSwatch, this.$container).on(
          "click",
          function () {
            var self = $(this);
            var $colorName = self.data("filter");

            $carousel_for.slick("slickUnfilter");
            $carousel_nav.slick("slickUnfilter");
            if (
              $carousel_nav.find($colorName).length &&
              $carousel_for.find($colorName).length
            ) {
              $carousel_for.slick("slickFilter", $colorName).slick("refresh");
              $carousel_nav.slick("slickFilter", $colorName).slick("refresh");
            } else {
              var $currentVariant = self.next().data("image");
              console.log($currentVariant);
              $carousel_nav
                .find(".product-single__thumbnails-item")
                .each(function () {
                  if ($currentVariant == $(this).find("img").attr("srcset")) {
                    $(this).trigger("click");
                  }
                });
            }
          }
        );
      } else {
        $inputChecked = $(
          this.selectors.productChangeGroupImage,
          this.$container
        ).find(".selector-wrapper.color .form-label span");
        if ($inputChecked.length) {
          var $colorName = $inputChecked.data("filter");

          if ($colorName != undefined) {
            $carousel_for.slick("slickUnfilter");
            $carousel_nav.slick("slickUnfilter");
            if (
              $carousel_nav.find($colorName).length &&
              $carousel_for.find($colorName).length
            ) {
              $carousel_for.slick("slickFilter", $colorName).slick("refresh");
              $carousel_nav.slick("slickFilter", $colorName).slick("refresh");
            }
          }
        }

        $(this.selectors.productChangeGroupImage, this.$container)
          .find(".selector-wrapper.color .single-option-selector")
          .on("change", function () {
            var $str_filter = ".filter-";
            var $colorName = $(this).val().replace(/\s/g, "-").toLowerCase();
            $colorName = $str_filter.concat($colorName);
            $carousel_for.slick("slickUnfilter");
            $carousel_nav.slick("slickUnfilter");
            if (
              $carousel_nav.find($colorName).length &&
              $carousel_for.find($colorName).length
            ) {
              $carousel_for.slick("slickFilter", $colorName).slick("refresh");
              $carousel_nav.slick("slickFilter", $colorName).slick("refresh");
            } else {
              var $currentVariant = self.val(),
                $currentVariant2;
              self.children().each(function () {
                if ($currentVariant == $(this).val()) {
                  $currentVariant2 = $(this).data("image");
                }
              });
              $carousel_nav
                .find(".product-single__thumbnails-item")
                .each(function () {
                  if ($currentVariant2 == $(this).find("img").attr("srcset")) {
                    $(this).trigger("click");
                  }
                });
            }
          });
      }
    },

    _addonFancybox: function () {
      $("[data-fancybox]").fancybox({
        mobile: {
          clickContent: "close",
          clickSlide: "close",
        },
        buttons: [
          "zoom",
          //"share",
          "slideShow",
          //"fullScreen",
          //"download",
          // "thumbs",
          "close",
        ],
        animationEffect: "zoom-in-out",
        transitionEffect: "zoom-in-out",
        transitionDuration: 800,
      });
    },

    _addonShowmoreDescription: function () {
      if (!$(".description_showmore").length) {
        return;
      }

      if ($(window).width() <= 767) {
        var $showmore = $(".showmore"),
          $showless = $(".showless"),
          $showmore_wrapper = $(".description_showmore").parent();

        $showmore_wrapper.css("max-height", 300);

        $showmore.on("click", function () {
          $showmore_wrapper.css("max-height", "none");
          $showmore.removeClass("show").addClass("hide");
          $showless.removeClass("hide").addClass("show");
        });

        $showless.on("click", function () {
          $showmore_wrapper.css("max-height", 300);
          $showless.removeClass("show").addClass("hide");
          $showmore.removeClass("hide").addClass("show");
        });
      }
    },

    onUnload: function () {
      this.$container.off(this.settings.namespace);
    },
  });

  function _enableZoom(el) {
    var zoomUrl = $(el).data("zoom");
    $(el).zoom({
      url: zoomUrl,
      magnify: 1.5,
    });
  }

  function _destroyZoom(el) {
    $(el).trigger("zoom.destroy");
  }

  function showTime(time) {
    if (time < 10) {
      return "<span class='num'>0" + time + "</span>";
    }
    return "<span class='num'>" + time + "</span>";
  }

  return Product;
})();

theme.ProductRecommendations = (function () {
  function ProductRecommendations(container) {
    this.$container = $(container);

    var baseUrl = this.$container.data("baseUrl");
    var productId = this.$container.data("productId");
    var productLimit = this.$container.data("limit");
    var recommendationsSectionUrl =
      baseUrl +
      "?section_id=product-recommendations&product_id=" +
      productId +
      "&limit=" +
      productLimit;

    $.get(recommendationsSectionUrl).then(
      function (section) {
        var recommendationsMarkup = $(section).html();
        if (recommendationsMarkup.trim() !== "") {
          this.$container.html(recommendationsMarkup);
        }
        theme.Slick.init();
        theme.ProductWishlist.init();
        if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
          Currency.convertAll(
            window.shop_currency,
            $("#currencies .active").attr("data-currency"),
            "span.money",
            "money_format"
          );
        }
      }.bind(this)
    );
  }

  return ProductRecommendations;
})();

theme.Hero = (function () {
  var selectors = {
    popup: ".hero__popup",
    points: ".hero__points-popup .point",
    pointsWrapper: ".hero__points-popup",
    heroCountDown: ".hero__countdown",
    heroCountDownWrapper: ".hero__countdownWrapper",
  };

  function hero(el, sectionId) {
    this.$hero = $(el);
    var $parentSection = $("#shopify-section-" + sectionId);
    var $heroCountDown = $parentSection.find(selectors.heroCountDown);
    var $heroCountDownWrapper = $parentSection.find(
      selectors.heroCountDownWrapper
    );
    var $heroProduct = $parentSection.find(selectors.points);
    var $heroProductWrapper = $parentSection.find(selectors.pointsWrapper);
    var $heroProductPopup = $parentSection.find(selectors.popup);

    if ($heroCountDown.length) {
      var $countDownDate = new Date(
        $heroCountDown.attr("data-countdown")
      ).getTime();
      var $countdownfunction = setInterval(function () {
        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = $countDownDate - now;

        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval($countdownfunction);
          $heroCountDownWrapper.remove();
        } else {
          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          var strCountDown =
            "<span>End in: </span>" +
            showTime(days) +
            "D : " +
            showTime(hours) +
            "H : " +
            showTime(minutes) +
            "M : " +
            showTime(seconds) +
            "S";
          $heroCountDown.html(strCountDown);
        }
      }, 500);
    }

    if ($heroProduct.length) {
      $heroProduct.on("click", function () {
        var self = $(this);

        if (self.parent().hasClass("check_append")) {
          var $heroProductWrapperChecked = self.parent();
          $heroProductPopup.removeClass("is-open");
          $heroProductPopup
            .find(".custom-product-card")
            .appendTo($heroProductWrapperChecked);
          $heroProductWrapperChecked.removeClass("check_append");
        } else {
          if ($heroProductPopup.hasClass("is-open")) {
            var $heroProductWrapperChecked = $parentSection.find(
              ".hero__points-popup.check_append"
            );
            $heroProductPopup.removeClass("is-open");
            $heroProductPopup
              .find(".custom-product-card")
              .appendTo($heroProductWrapperChecked);
            $heroProductWrapperChecked.removeClass("check_append");
            $heroProductPopup.find(".custom-product-card").remove();
          } else {
            var $productWrapper = $(this).parent(),
              $position = $productWrapper.offset(),
              $product = $(this).siblings(),
              $position_content = $parentSection.offset();

            if ($(window).width() < 1024) {
              $heroProductPopup.css({ top: 30, left: 20 });
            } else {
              $heroProductPopup.css({
                top: $position.top - $position_content.top - 100,
                left: $position.left - $position_content.left + 40,
              });
            }

            $heroProductPopup.addClass("is-open");
            $productWrapper.addClass("check_append");
            $product.appendTo($heroProductPopup);
            return;
          }
        }
      });

      $(document).on("click", ".hero__popup .close", function (event) {
        var $heroProductWrapperChecked = $parentSection.find(
          ".hero__points-popup.check_append"
        );
        $heroProductPopup.removeClass("is-open");
        $heroProductPopup
          .find(".custom-product-card")
          .appendTo($heroProductWrapperChecked);
        $heroProductWrapperChecked.removeClass("check_append");
      });

      $(document).on("click", function (event) {
        if (
          $(event.target).closest(".hero__popup").length === 0 &&
          $(event.target).closest(".hero__points-popup").length === 0
        ) {
          if ($heroProductPopup.hasClass("is-open")) {
            var $heroProductWrapperChecked = $parentSection.find(
              ".hero__points-popup.check_append"
            );
            $heroProductPopup.removeClass("is-open");
            $heroProductPopup
              .find(".custom-product-card")
              .appendTo($heroProductWrapperChecked);
            $heroProductWrapperChecked.removeClass("check_append");
          }
        }
      });
    }
  }

  function showTime(time) {
    if (time < 10) {
      return "<span class='num'>0" + time + "</span>";
    }
    return "<span class='num'>" + time + "</span>";
  }

  return hero;
})();

theme.Heros = {};

theme.HeroSection = (function () {
  function HeroSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr("data-section-id");
    var hero = "#Hero-" + sectionId;
    theme.Heros[hero] = new theme.Hero(hero, sectionId);
  }

  return HeroSection;
})();

theme.ProductList = (function () {
  var selectors = {
    productCountDown: ".title__countdown",
    productCountDownWrapper: ".title__countdownWrapper",
  };

  function ProductList(el, sectionId) {
    this.$product = $(el);
    var $parentSection = $("#shopify-section-" + sectionId);
    var $productCountDown = $parentSection.find(selectors.productCountDown);
    var $productCountDownWrapper = $parentSection.find(
      selectors.productCountDownWrapper
    );

    if (!$productCountDown.length) {
      return;
    }

    var $countDownDate = new Date(
      $productCountDown.attr("data-countdown")
    ).getTime();
    var $countdownfunction = setInterval(function () {
      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down date
      var distance = $countDownDate - now;

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval($countdownfunction);
        $productCountDownWrapper.remove();
      } else {
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var strCountDown =
          "<span class='title__countdown--item'>" +
          showTime(days) +
          "<span class='label'>days</span></span><span class='title__countdown--item'>" +
          showTime(hours) +
          "<span class='label'>hours</span></span><span class='title__countdown--item'>" +
          showTime(minutes) +
          "<span class='label'>mins</span></span><span class='title__countdown--item'>" +
          showTime(seconds) +
          "<span class='label'>secs</span></span>";
        $productCountDown.html(strCountDown);
      }
    }, 500);

    function showTime(time) {
      if (time < 10) {
        return "<span class='num'>0" + time + "</span>";
      }
      return "<span class='num'>" + time + "</span>";
    }
  }

  return ProductList;
})();

theme.ProductLists = {};

theme.ProductListSection = (function () {
  function ProductListSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr("data-section-id");
    var ProductList = "#ProductList-" + sectionId;
    theme.ProductLists[ProductList] = new theme.ProductList(
      ProductList,
      sectionId
    );
  }

  return ProductListSection;
})();

theme.Slick = (function () {
  function slick() {
    $("[data-slick]").each(function (index) {
      var $carousel = $(this);
      if (!$carousel.hasClass("slick-slider")) {
        $carousel.slick();
      }
    });

    $("[data-slick-pc]").each(function (index) {
      var $carousel = $(this);
      if ($(window).width() < 1025) {
        if ($carousel.length) {
          if ($carousel.hasClass("slick-slider")) {
            $carousel.slick("unslick");
          }
        }
      }
    });

    if ($(window).width() > 1024) {
      $('[data-section-type="product-list"]').each(function (index) {
        var $arrow = $(this).find(".slick-arrow");
        var $height = $(this).find(".product-card__image").height() / 2 - 15;
        if ($arrow.length) {
          $arrow.css("top", $height);
        }
      });
      $('[data-section-type="product-recommendations"]').each(function (index) {
        var $arrow = $(this).find(".slick-arrow");
        var $height = $(this).find(".product-card__image").height() / 2 - 15;
        if ($arrow.length) {
          $arrow.css("top", $height);
        }
      });
      $('[data-section-type="lookbook-product"]').each(function (index) {
        var $arrow = $(this).find(".slick-arrow");
        var $height = $(this).find(".product-card__image").height() / 2 - 15;
        if ($arrow.length) {
          $arrow.css("top", $height);
        }
      });
      $('[data-section-type="lookbook-template"]').each(function (index) {
        var $arrow = $(this).find(".slick-arrow");
        var $height = $(this).find(".lookbook__image").height() / 2 - 15;
        if ($arrow.length) {
          $arrow.css("top", $height);
        }
      });
    }
  }

  return {
    init: function () {
      slick();
    },
  };
})();

theme.Sidebar = (function () {
  function toggle_sidebar_mobile() {
    $(document).on("click", ".sidebar_mobile", function (event) {
      event.preventDefault();
      const $target = $(event.target);
      if ($target.hasClass("is-open")) {
        $target.removeClass("is-open");
        $(".page-sidebar").removeClass("is-open");
        $("body").removeClass("open_sidebar");
      } else {
        $target.addClass("is-open");
        $(".page-sidebar").addClass("is-open");
        $("body").addClass("open_sidebar");
      }
    });

    $(document).on("click", ".page-sidebar__close .close", function (event) {
      event.preventDefault();
      $("body").removeClass("open_sidebar");
      $(".page-sidebar").removeClass("is-open");
      $(".sidebar_mobile").removeClass("is-open");
    });

    $(document).on("click", function (event) {
      if (
        $("body").hasClass("open_sidebar") &&
        $(event.target).closest(".page-sidebar").length === 0 &&
        $(event.target).closest(".sidebar_mobile").length === 0
      ) {
        $("body").removeClass("open_sidebar");
        $(".page-sidebar").removeClass("is-open");
        $(".sidebar_mobile").removeClass("is-open");
      }
    });
  }

  function dropdown_collectionChild() {
    if ($(".collection-list").length) {
      $(document).on(
        "click",
        ".collection-list .collection-list__action--wrapper",
        function (event) {
          const $target = $(event.target).parent();
          $target.siblings().removeClass("is-clicked");
          $target.toggleClass("is-clicked");
          $target.siblings().find("> .collection-list").slideUp("fast");
          $target.find("> .collection-list").slideToggle("fast");
        }
      );
    }
  }

  function product_carousel() {
    if (!$("[data-product-carousel-sidebar]").length) {
      return;
    }

    $("[data-product-carousel-sidebar]").each(function (index) {
      var $carousel = $(this).find("[data-slick]");
      if ($carousel.length) {
        if (!$carousel.hasClass("slick-slider")) {
          $carousel.slick();
        }
      }
    });
  }

  function collection_sidebar() {
    var $collection_sidebar = $("#page-collection__sidebar"),
      $collection_filter = $("#collection-filter");

    if ($(window).width() > 1024) {
      if ($collection_sidebar.find("#filters-toolbar").length) {
        $collection_sidebar
          .find("#filters-toolbar")
          .appendTo($collection_filter);
      }
    } else {
      if (!$collection_sidebar.find("#filters-toolbar").length) {
        $collection_filter
          .find("#filters-toolbar")
          .appendTo($collection_sidebar.find(".page-sidebar__content"));
      }
    }
  }

  return {
    init: function () {
      product_carousel();
      collection_sidebar();
      toggle_sidebar_mobile();
      dropdown_collectionChild();
    },
  };
})();

theme.Collection = (function () {
  function initInfiniteScrolling() {
    if ($(".collection-toolbar").length) {
      if ($(window).width() > 1024) {
        if ($("#page-collection .collection-toolbar").length) {
          $(".page.page-collection > .collection-toolbar").remove();
          $(".collection-toolbar").prependTo(".page.page-collection");
        }
      } else {
        if (!$("#page-collection .collection-toolbar").length) {
          $("#page-collection .collection-toolbar").remove();
          $(".collection-toolbar").prependTo("#page-collection");
        }
      }
    }

    if ($('[data-collection="infiniteScroll"]').length) {
      var $infiniteScroll = $(".infinite-scrolling a");

      $infiniteScroll.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!$infiniteScroll.hasClass("disabled")) {
          var url = $(this).attr("href");
          doAjaxInfiniteScrollingGetContent(url);
        }
      });
    }

    // $(window).scroll(function () {
    //     var collectionTplElm = $('[data-collection="infiniteScroll"]'),

    //     var collectionTop = collectionTplElm.offset().top;
    //     var collectionHeight = collectionTplElm.outerHeight();
    //     var posTop = collectionTop + collectionHeight - $(window).height();

    //     if ($(this).scrollTop() > collectionTop) {
    //         if ((($(this).scrollTop() - collectionTop) > (collectionHeight - 200)) && ($(this).scrollTop() < collectionTplElm.offset().top + collectionTplElm.outerHeight()) ) {
    //             if ($infiniteScroll.length && !$infiniteScroll.hasClass('disabled')) {
    //                 var url = $infiniteScroll.attr('href');
    //                 doAjaxInfiniteScrollingGetContent(url);
    //             };
    //         }
    //     };
    // });
  }

  function doAjaxInfiniteScrollingGetContent(url) {
    $.ajax({
      type: "get",
      url: url,
      beforeSend: function () {
        theme.HaloAddOn.loadingPopup();
      },
      success: function (data) {
        ajaxInfiniteScrollingMapData(data);
        if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
          Currency.convertAll(
            window.shop_currency,
            $("#currencies .active").attr("data-currency"),
            "span.money",
            "money_format"
          );
        }
      },
      complete: function () {
        theme.HaloAddOn.removeLoadingPopup();
      },
    });
  }

  function ajaxInfiniteScrollingMapData(data) {
    var collectionTemplate = $(".page-collection"),
      currentProductColl = collectionTemplate.find(".halo-column"),
      newCollectionTemplate = $(data).find(".page-collection"),
      newProductColl = newCollectionTemplate.find(".halo-column"),
      newProductItem = newProductColl.children(".halo-column__item");

    var showMoreButton = $(".infinite-scrolling a");

    if (newProductColl.length) {
      currentProductColl.append(newProductItem);
      theme.ProductWishlist.init();

      if ($(".infinite-scrolling").length) {
        var $progressbar_pagination =
          (parseInt(currentProductColl.children(".halo-column__item").length) *
            100) /
          parseInt($(".pagination_progress_bar").attr("data-pageSize"));
        $(".infinite-scrolling .page-total .pageSize").html(
          currentProductColl.children(".halo-column__item").length
        );
        $(".infinite-scrolling .progress_bar").css(
          "width",
          $progressbar_pagination + "%"
        );
      }

      if ($(data).find(".infinite-scrolling").length > 0) {
        showMoreButton.attr(
          "href",
          newCollectionTemplate.find(".infinite-scrolling a").attr("href")
        );
        showMoreButton.text(theme.strings.showMore);
      } else {
        showMoreButton.addClass("disabled");
        showMoreButton.text(theme.strings.noMore);
      }

      if (
        $(".shopify-product-reviews-badge").length &&
        $(".spr-badge").length
      ) {
        return (
          window.SPR.registerCallbacks(),
          window.SPR.initRatingHandler(),
          window.SPR.initDomEls(),
          window.SPR.loadProducts(),
          window.SPR.loadBadges()
        );
      }
    }
  }

  return initInfiniteScrolling;
})();

theme.Instagram = (function () {
  function instagram() {
    if (!$(".instagram-load-more").length) return;

    var i, y;

    if ($(window).width() > 1024) {
      for (i = 1; i <= 7; i++) {
        $(".instagram__item:nth-child(" + i + ")").removeClass("hide");
      }
    } else if ($(window).width() > 767) {
      for (i = 1; i <= 3; i++) {
        $(".instagram__item:nth-child(" + i + ")").removeClass("hide");
      }
    } else {
      for (i = 1; i <= 4; i++) {
        $(".instagram__item:nth-child(" + i + ")").removeClass("hide");
      }
    }

    $(document).on("click", ".instagram-load-more", function () {
      y = i;
      if ($(window).width() > 1024) i = i + 4;
      else i = i + 3;
      for (y; y <= i; y++) {
        $(".instagram__item:nth-child(" + y + ")").removeClass("hide");
      }

      if (!$(".instagram__item.hide").length)
        $(".instagram-load-more").remove();
    });

    $('[data-fancybox="images-instagram"]').fancybox({
      mobile: {
        clickContent: "close",
        clickSlide: "close",
      },
      buttons: [
        "zoom",
        //"share",
        "slideShow",
        //"fullScreen",
        //"download",
        // "thumbs",
        "close",
      ],
      animationEffect: "zoom-in-out",
      transitionEffect: "zoom-in-out",
      transitionDuration: 800,
    });
  }

  return instagram;
})();

theme.Lookbook = (function () {
  function Lookbook() {
    $(".lookbook__points-popup .point").on("click", function () {
      if ($(".lookbook__points-popup").hasClass("check_append")) {
        $(".lookbook__popup").removeClass("is-open");
        $(".lookbook__popup .custom-product-card").appendTo(
          ".lookbook__points-popup.check_append"
        );
        $(".lookbook__points-popup.check_append").removeClass("check_append");
      } else {
        if ($(this).parent().hasClass("check_append")) {
          $(".lookbook__popup").removeClass("is-open");
          $(".lookbook__popup .custom-product-card").appendTo(
            ".lookbook__points-popup.check_append"
          );
          $(".lookbook__points-popup.check_append").removeClass("check_append");
        } else {
          $(".lookbook__popup .custom-product-card").remove();

          var $productWrapper = $(this).parent(),
            $position = $productWrapper.offset(),
            $product = $(this).siblings(),
            $position_content = $(".lookbook").offset();

          if ($(window).width() < 1024) {
            $(".lookbook__popup").css({ top: 30, left: 20 });
          } else {
            $(".lookbook__popup").css({
              top: $position.top - $position_content.top - 100,
              left: $position.left - $position_content.left + 40,
            });
          }

          $(".lookbook__popup").addClass("is-open");
          $productWrapper.addClass("check_append");
          $product.appendTo(".lookbook__popup");
        }
      }
    });

    $(".lookbook__popup .close").on("click", function () {
      $(".lookbook__popup").removeClass("is-open");
      $(".lookbook__popup .custom-product-card").appendTo(
        ".lookbook__points-popup.check_append"
      );
      $(".lookbook__points-popup.check_append").removeClass("check_append");
    });

    $(document).on("click", function (event) {
      if (
        $(event.target).closest(".lookbook__popup").length === 0 &&
        $(event.target).closest(".lookbook__points-popup .point").length === 0
      ) {
        $(".lookbook__popup").removeClass("is-open");
        $(".lookbook__popup .custom-product-card").appendTo(
          ".lookbook__points-popup.check_append"
        );
        $(".lookbook__points-popup.check_append").removeClass("check_append");
      }
    });
  }

  return Lookbook;
})();

/*================ Product QuickView ===========*/

theme.ProductQuickView = (function () {
  function initQuickView() {
    var $quickview = "[data-quickview]";
    $(document).on("click", $quickview, function (evt) {
      evt.preventDefault();
      evt.stopPropagation();

      var href = $(this).data("link");
      _doAjaxShowQuickView(href);
    });
  }

  function _doAjaxShowQuickView(href) {
    $.ajax({
      type: "get",
      url: window.router + "/products/" + href + "?view=quickview",

      beforeSend: function () {
        theme.HaloAddOn.loadingPopup();
      },

      success: function (data) {
        var $productQuickviewPopup = "#product-quickview",
          $productQuickviewPopupContent = $($productQuickviewPopup).find(
            ".modal-body"
          );

        $productQuickviewPopupContent.html(data);

        setTimeout(function () {
          _productQuickview();
        }, 1000);

        theme.HaloAddOn.removeLoadingPopup();

        theme.ProductWishlist.init();

        if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
          Currency.convertAll(
            window.shop_currency,
            $("#currencies .active").attr("data-currency"),
            "span.money",
            "money_format"
          );
        }
        theme.HaloAddOn.productQuickviewPopup();
      },
    });
  }

  function _productQuickview() {
    var $container = $(".product-quickview-template__container");
    var sectionId = $container.attr("data-section-id");
    this.ajaxEnabled = $container.data("ajax-enabled");

    this.settings = {
      mediaQueryMediumUp: "screen and (min-width: 1025px)",
      mediaQuerySmall: "screen and (max-width: 1024px)",
      bpSmall: false,
      enableHistoryState: $container.data("enable-history-state") || false,
      namespace: ".slideshow-" + sectionId,
      sectionId: sectionId,
      sliderActive: false,
      zoomEnabled: false,
    };

    this.selectors = {
      addToCart: "[data-add-to-cart]",
      addToCartText: "[data-add-to-cart-text]",
      cartCount: "[data-cart-count]",
      cartCountBubble: "[data-cart-count-bubble]",
      cartPopup: "[data-cart-popup]",
      cartPopupCartQuantity: "[data-cart-popup-cart-quantity]",
      cartPopupClose: "[data-cart-popup-close]",
      cartPopupDismiss: "[data-cart-popup-dismiss]",
      cartPopupImage: "[data-cart-popup-image]",
      cartPopupImageWrapper: "[data-cart-popup-image-wrapper]",
      cartPopupImagePlaceholder: "[data-cart-popup-image-placeholder]",
      cartPopupPlaceholderSize: "[data-placeholder-size]",
      cartPopupProductDetails: "[data-cart-popup-product-details]",
      cartPopupQuantity: "[data-cart-popup-quantity]",
      cartPopupQuantityLabel: "[data-cart-popup-quantity-label]",
      cartPopupTitle: "[data-cart-popup-title]",
      cartPopupWrapper: "[data-cart-popup-wrapper]",
      labelSale: "[data-label-sale]",
      loader: "[data-loader]",
      loaderStatus: "[data-loader-status]",
      quantity: "[data-quantity-input-qv]",
      SKU: ".variant-sku",
      inventory: ".variant-inventory",
      productStatus: "[data-product-status]",
      originalSelectorId: "#ProductSelect-" + sectionId,
      productForm: "[data-product-form]",
      errorMessage: "[data-error-message]",
      errorMessageWrapper: "[data-error-message-wrapper]",
      productImageWraps: ".product-single__photo--" + sectionId,
      productThumbImages: ".product-single__thumbnail--" + sectionId,
      productThumbs: ".product-single__thumbnails-" + sectionId,
      productThumbListItem: ".product-single__thumbnails-item",
      productFeaturedImage: ".product-featured-img",
      productThumbsWrapper: ".thumbnails-wrapper",
      saleLabel: ".product-price__sale-label-" + sectionId,
      singleOptionSelector: ".single-option-selector-" + sectionId,
      shopifyPaymentButton: ".shopify-payment-button",
      priceContainer: "[data-price-qv]",
      regularPrice: "[data-regular-price-qv]",
      salePrice: "[data-sale-price-qv]",
      unitPrice: "[data-unit-price-qv]",
      unitPriceBaseUnit: "[data-unit-price-base-unit]",
      productPolicies: "[data-product-policies]",
      productWrapper: ".product-single__photos-wrapper-" + sectionId,
      productChangeGroupImage: "[data-change-group-image]",
      productSwatch: "[data-filter]",
    };

    this.classes = {
      cartPopupWrapperHidden: "cart-popup-wrapper--hidden",
      hidden: "hide",
      visibilityHidden: "visibility-hidden",
      inputError: "input--error",
      productOnSale: "price--on-sale",
      productUnitAvailable: "price--unit-available",
      productUnavailable: "price--unavailable",
      productSoldOut: "price--sold-out",
      cartImage: "cart-popup-item__image",
      productFormErrorMessageWrapperHidden:
        "product-form__error-message-wrapper--hidden",
      activeClass: "active-thumb",
      variantSoldOut: "product-form--variant-sold-out",
      slider: "slider",
    };

    this.$quantityInput = $(this.selectors.quantity, $container);
    this.$errorMessageWrapper = $(
      this.selectors.errorMessageWrapper,
      $container
    );
    this.$addToCart = $(this.selectors.addToCart, $container);
    this.$addToCartText = $(this.selectors.addToCartText, this.$addToCart);
    this.$shopifyPaymentButton = $(
      this.selectors.shopifyPaymentButton,
      $container
    );
    this.$productPolicies = $(this.selectors.productPolicies, $container);

    this.$loader = $(this.selectors.loader, this.$addToCart);
    this.$loaderStatus = $(this.selectors.loaderStatus, $container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$("#ProductJson-" + sectionId).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      document.getElementById("ProductJson-" + sectionId).innerHTML
    );

    this.settings.zoomEnabled = $(this.selectors.productImageWraps).hasClass(
      "js-zoom-enabled"
    );

    _initBreakpoints();
    _stringOverrides();
    _initVariants($container);
    _initImageSwitch();
    _initImageCarousel();
    _initAddToCart();
    _setActiveThumbnail();
    _addonCountdown();
    _addonSocial();
    _addonReview();
    _addonCustomerView();
    _addonSoldOutProduct();
  }

  function _initBreakpoints() {
    var self = this;

    enquire.register(this.settings.mediaQuerySmall, {
      match: function () {
        // destroy image zooming if enabled
        if (self.settings.zoomEnabled) {
          $(self.selectors.productImageWraps).each(function () {
            _destroyZoom(this);
          });
        }

        self.settings.bpSmall = true;
      },
      unmatch: function () {
        self.settings.bpSmall = false;
      },
    });

    enquire.register(this.settings.mediaQueryMediumUp, {
      match: function () {
        if (self.settings.zoomEnabled) {
          $(self.selectors.productImageWraps).each(function () {
            _enableZoom(this);
          });
        }
      },
    });
  }

  function _stringOverrides() {
    theme.productStrings = theme.productStrings || {};
    $.extend(theme.strings, theme.productStrings);
  }

  function _initVariants($container) {
    var options = {
      $container: $container,
      enableHistoryState: $container.data("enable-history-state") || false,
      singleOptionSelector: this.selectors.singleOptionSelector,
      originalSelectorId: this.selectors.originalSelectorId,
      product: this.productSingleObject,
    };

    this.variants = new slate.Variants2(options);

    $container.on(
      "variantChange" + this.settings.namespace,
      _updateAvailability.bind(this)
    );
    $container.on(
      "variantImageChange" + this.settings.namespace,
      _updateImages.bind(this)
    );
    $container.on(
      "variantPriceChange" + this.settings.namespace,
      _updatePrice.bind(this)
    );
    $container.on(
      "variantSKUChange" + this.settings.namespace,
      _updateSKU.bind(this)
    );
  }

  function _initImageSwitch() {
    if (!$(this.selectors.productThumbImages).length) {
      return;
    }

    var self = this;

    $(this.selectors.productThumbImages)
      .on("click", function (evt) {
        evt.preventDefault();
        var $el = $(this);
        var imageId = $el.data("thumbnail-id");

        _switchImage(imageId);
        _setActiveThumbnail(imageId);
      })
      .on("keyup", _handleImageFocus.bind(self));
  }

  function _initImageCarousel() {
    var $carousel_for = $(this.selectors.productWrapper),
      $carousel_nav = $(this.selectors.productThumbs);

    if (!$carousel_for.hasClass(this.classes.slider)) {
      return;
    }

    $carousel_for.slick({
      rows: 0,
      dots: false,
      fade: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      asNavFor: $carousel_nav,
      prevArrow:
        '<div class="slick-prev slick-arrow slick-arrow--large"><svg class="icon"><use xlink:href="#icon-chevron-up"></svg></div>',
      nextArrow:
        '<div class="slick-next slick-arrow slick-arrow--large"><svg class="icon"><use xlink:href="#icon-chevron-down"></svg></div>',
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });

    $carousel_nav.slick({
      rows: 0,
      dots: false,
      arrows: true,
      vertical: true,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      focusOnSelect: true,
      asNavFor: $carousel_for,
      prevArrow:
        '<div class="slick-prev slick-arrow slick-arrow--large"><svg class="icon"><use xlink:href="#icon-chevron-up"></svg></div>',
      nextArrow:
        '<div class="slick-next slick-arrow slick-arrow--large"><svg class="icon"><use xlink:href="#icon-chevron-down"></svg></div>',
      responsive: [
        {
          breakpoint: 1190,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 990,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 550,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    });

    if ($(window).width() > 991) {
      if ($carousel_nav.find(".slick-arrow").length) {
        var $height_for = $carousel_for.outerHeight(),
          $height_nav = $carousel_nav.outerHeight();
        var $position = ($height_for - $height_nav) / 2;
        $carousel_nav.css("top", $position);
      } else {
        $carousel_nav.addClass("arrows-disable");
      }
    }
  }

  function _initAddToCart() {
    $(this.selectors.productForm, this.$container).on(
      "submit",
      function (evt) {
        if (this.$addToCart.is("[aria-disabled]")) {
          evt.preventDefault();
          return;
        }

        if (!this.ajaxEnabled) return;

        evt.preventDefault();

        var self = $(this),
          $product = self.parents(".product-card");

        this.$previouslyFocusedElement = $(":focus");

        var isInvalidQuantity = 0;

        if (!isInvalidQuantity && this.ajaxEnabled) {
          // disable the addToCart and dynamic checkout button while
          // request/cart popup is loading and handle loading state
          _handleButtonLoadingState(true);
          var $data = $(this.selectors.productForm, this.$container);
          _addItemToCart($data);
          return;
        }
      }.bind(this)
    );
  }

  function _addItemToCart(data) {
    var params = {
      url: window.router + "/cart/add.js",
      data: $(data).serialize(),
      dataType: "json",
    };

    $.post(params)
      .done(
        function (item) {
          _hideErrorMessage();
          _setupCartPopup(item);
          _setupSideCart();
        }.bind(this)
      )
      .fail(
        function (response) {
          this.$previouslyFocusedElement.focus();
          var errorMessage = response.responseJSON
            ? response.responseJSON.description
            : theme.strings.cartError;
          _showErrorMessage(errorMessage);
          _handleButtonLoadingState(false);
        }.bind(this)
      );
  }

  function _handleButtonLoadingState(isLoading) {
    if (isLoading) {
      this.$addToCart.attr("aria-disabled", true);
      this.$addToCartText.addClass(this.classes.hidden);
      this.$loader.removeClass(this.classes.hidden);
      this.$shopifyPaymentButton.attr("disabled", true);
      this.$loaderStatus.attr("aria-hidden", false);
    } else {
      this.$addToCart.removeAttr("aria-disabled");
      this.$addToCartText.removeClass(this.classes.hidden);
      this.$loader.addClass(this.classes.hidden);
      this.$shopifyPaymentButton.removeAttr("disabled");
      this.$loaderStatus.attr("aria-hidden", true);
    }
  }

  function _showErrorMessage(errorMessage) {
    $(this.selectors.errorMessage, this.$container).html(errorMessage);

    if (this.$quantityInput.length !== 0) {
      this.$quantityInput.addClass(this.classes.inputError);
    }

    this.$errorMessageWrapper
      .removeClass(this.classes.productFormErrorMessageWrapperHidden)
      .attr("aria-hidden", true)
      .removeAttr("aria-hidden");
  }

  function _hideErrorMessage() {
    this.$errorMessageWrapper.addClass(
      this.classes.productFormErrorMessageWrapperHidden
    );

    if (this.$quantityInput.length !== 0) {
      this.$quantityInput.removeClass(this.classes.inputError);
    }
  }

  function _setupSideCart() {
    theme.HaloAddOn.removeProductQuickviewPopup();
    if ($(window).width() > 1024) {
      $("[data-cart-pc]").trigger("click");
    } else {
      $("[data-mobile-cart]").trigger("click");
    }
  }

  function _setupCartPopup(item) {
    this.$cartPopup = this.$cartPopup || $(this.selectors.cartPopup);
    this.$cartPopupWrapper =
      this.$cartPopupWrapper || $(this.selectors.cartPopupWrapper);
    this.$cartPopupTitle =
      this.$cartPopupTitle || $(this.selectors.cartPopupTitle);
    this.$cartPopupQuantity =
      this.$cartPopupQuantity || $(this.selectors.cartPopupQuantity);
    this.$cartPopupQuantityLabel =
      this.$cartPopupQuantityLabel || $(this.selectors.cartPopupQuantityLabel);
    this.$cartPopupClose =
      this.$cartPopupClose || $(this.selectors.cartPopupClose);
    this.$cartPopupDismiss =
      this.$cartPopupDismiss || $(this.selectors.cartPopupDismiss);
    this.$cartPopupImagePlaceholder =
      this.$cartPopupImagePlaceholder ||
      $(this.selectors.cartPopupImagePlaceholder);

    _setupCartPopupEventListeners();

    _updateCartPopupContent(item);
  }

  function _updateCartPopupContent(item) {
    var quantity = this.$quantityInput.length ? this.$quantityInput.val() : 1;

    this.$cartPopupTitle.text(item.product_title);
    this.$cartPopupQuantity.text(quantity);
    this.$cartPopupQuantityLabel.text(
      theme.strings.quantityLabel.replace("[count]", quantity)
    );

    _setCartPopupPlaceholder(
      item.featured_image.url,
      item.featured_image.aspect_ratio
    );
    _setCartPopupImage(item.featured_image.url, item.featured_image.alt);
    _setCartPopupProductDetails(
      item.product_has_only_default_variant,
      item.options_with_values,
      item.properties
    );

    $.getJSON(window.router + "/cart.js").then(
      function (cart) {
        _setCartQuantity(cart.item_count);
        _setCartCountBubble(cart.item_count);
        _showCartPopup();
      }.bind(this)
    );

    setTimeout(function () {
      if (
        !$(this.$cartPopupWrapper).hasClass(this.classes.cartPopupWrapperHidden)
      ) {
        $(this.$cartPopupClose).trigger("click");
      }
    }, 3000);
  }

  function _setupCartPopupEventListeners() {
    this.$cartPopupWrapper.on(
      "keyup",
      function (event) {
        if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
          _hideCartPopup(event);
        }
      }.bind(this)
    );

    this.$cartPopupClose.on("click", _hideCartPopup.bind(this));
    this.$cartPopupDismiss.on("click", _hideCartPopup.bind(this));
  }

  function _setCartPopupPlaceholder(imageUrl, imageAspectRatio) {
    this.$cartPopupImageWrapper =
      this.$cartPopupImageWrapper || $(this.selectors.cartPopupImageWrapper);

    if (imageUrl === null) {
      this.$cartPopupImageWrapper.addClass(this.classes.hidden);
      return;
    }

    var $placeholder = $(this.selectors.cartPopupPlaceholderSize);
    var maxWidth = 95 * imageAspectRatio;
    var heightRatio = 100 / imageAspectRatio;

    this.$cartPopupImagePlaceholder.css("max-width", maxWidth);

    $placeholder.css("padding-top", heightRatio + "%");
  }

  function _setCartPopupImage(imageUrl, imageAlt) {
    if (imageUrl === null) return;

    this.$cartPopupImageWrapper.removeClass(this.classes.hidden);
    var sizedImageUrl = theme.Images.getSizedImageUrl(imageUrl, "200x");
    var image = document.createElement("img");
    image.src = sizedImageUrl;
    image.alt = imageAlt;
    image.classList.add(this.classes.cartImage);
    image.dataset.cartPopupImage = "";

    image.onload = function () {
      this.$cartPopupImagePlaceholder.addClass(this.classes.hidden);
      this.$cartPopupImageWrapper.append(image);
    }.bind(this);
  }

  function _setCartPopupProductDetails(
    product_has_only_default_variant,
    options,
    properties
  ) {
    this.$cartPopupProductDetails =
      this.$cartPopupProductDetails ||
      $(this.selectors.cartPopupProductDetails);
    var variantPropertiesHTML = "";

    if (!product_has_only_default_variant) {
      variantPropertiesHTML =
        variantPropertiesHTML + _getVariantOptionList(options);
    }

    if (properties !== null && Object.keys(properties).length !== 0) {
      variantPropertiesHTML =
        variantPropertiesHTML + _getPropertyList(properties);
    }

    if (variantPropertiesHTML.length === 0) {
      this.$cartPopupProductDetails.html("");
      this.$cartPopupProductDetails.attr("hidden", "");
    } else {
      this.$cartPopupProductDetails.html(variantPropertiesHTML);
      this.$cartPopupProductDetails.removeAttr("hidden");
    }
  }

  function _getVariantOptionList(variantOptions) {
    var variantOptionListHTML = "";

    variantOptions.forEach(function (variantOption) {
      variantOptionListHTML =
        variantOptionListHTML +
        '<li class="product-details__item product-details__item--variant-option">' +
        variantOption.value +
        "</li>";
    });

    return variantOptionListHTML;
  }

  function _getPropertyList(properties) {
    var propertyListHTML = "";
    var propertiesArray = Object.entries(properties);

    propertiesArray.forEach(function (property) {
      // Line item properties prefixed with an underscore are not to be displayed
      if (property[0].charAt(0) === "_") return;

      // if the property value has a length of 0 (empty), don't display it
      if (property[1].length === 0) return;

      propertyListHTML =
        propertyListHTML +
        '<li class="product-details__item product-details__item--property">' +
        '<span class="product-details__property-label">' +
        property[0] +
        ": </span>" +
        property[1];
      ": " + "</li>";
    });

    return propertyListHTML;
  }

  function _setCartQuantity(quantity) {
    this.$cartPopupCartQuantity =
      this.$cartPopupCartQuantity || $(this.selectors.cartPopupCartQuantity);
    var ariaLabel;

    if (quantity === 1) {
      ariaLabel = theme.strings.oneCartCount;
    } else if (quantity > 1) {
      ariaLabel = theme.strings.otherCartCount.replace("[count]", quantity);
    }

    this.$cartPopupCartQuantity.text(quantity).attr("aria-label", ariaLabel);
  }

  function _setCartCountBubble(quantity) {
    this.$cartCountBubble =
      this.$cartCountBubble || $(this.selectors.cartCountBubble);
    this.$cartCount = this.$cartCount || $(this.selectors.cartCount);

    this.$cartCountBubble.removeClass(this.classes.hidden);
    this.$cartCount.text(quantity);
  }

  function _showCartPopup() {
    this.$cartPopupWrapper
      .prepareTransition()
      .removeClass(this.classes.cartPopupWrapperHidden);

    _handleButtonLoadingState(false);

    slate.a11y.trapFocus({
      $container: this.$cartPopupWrapper,
      $elementToFocus: this.$cartPopup,
      namespace: "cartPopupFocus",
    });
  }

  function _hideCartPopup(event) {
    var setFocus = event.detail === 0 ? true : false;
    this.$cartPopupWrapper
      .prepareTransition()
      .addClass(this.classes.cartPopupWrapperHidden);

    $(this.selectors.cartPopupImage).remove();
    this.$cartPopupImagePlaceholder.removeClass(this.classes.hidden);

    slate.a11y.removeTrapFocus({
      $container: this.$cartPopupWrapper,
      namespace: "cartPopupFocus",
    });

    if (setFocus) this.$previouslyFocusedElement[0].focus();

    this.$cartPopupWrapper.off("keyup");
    this.$cartPopupClose.off("click");
    this.$cartPopupDismiss.off("click");
    $("body").off("click");
  }

  function _onBodyClick(event) {
    var $target = $(event.target);
    if (
      $target[0] !== this.$cartPopupWrapper[0] &&
      !$target.parents(this.selectors.cartPopup).length
    ) {
      _hideCartPopup(event);
    }
  }

  function _setActiveThumbnail(imageId) {
    // If there is no element passed, find it by the current product image
    if (typeof imageId === "undefined") {
      imageId = $(
        this.selectors.productImageWraps + ":not(.hide)",
        this.$container
      ).data("image-id");
    }

    var $thumbnailWrappers = $(
      this.selectors.productThumbListItem + ":not(.slick-cloned)",
      this.$container
    );

    var $activeThumbnail = $thumbnailWrappers.find(
      this.selectors.productThumbImages +
        "[data-thumbnail-id='" +
        imageId +
        "']"
    );

    $(this.selectors.productThumbImages)
      .removeClass(this.classes.activeClass)
      .removeAttr("aria-current");

    $activeThumbnail.addClass(this.classes.activeClass);
    $activeThumbnail.attr("aria-current", true);

    if (!$thumbnailWrappers.hasClass("slick-slide")) {
      return;
    }

    var slideIndex = $activeThumbnail.parent().data("slick-index");

    $(this.selectors.productThumbs).slick("slickGoTo", slideIndex);
  }

  function _switchImage(imageId) {
    var $newImage = $(
      this.selectors.productImageWraps + "[data-image-id='" + imageId + "']",
      this.$container
    );
    var $otherImages = $(
      this.selectors.productImageWraps +
        ":not([data-image-id='" +
        imageId +
        "'])",
      this.$container
    );
  }

  function _handleImageFocus(evt) {
    if (evt.keyCode !== slate.utils.keyboardKeys.ENTER) return;

    $(this.selectors.productFeaturedImage + ":visible").focus();
  }

  function _liveRegionText(variant) {
    // Dummy content for live region
    var liveRegionText =
      "[Availability] [Regular] [$$] [Sale] [$]. [UnitPrice] [$$$]";

    if (!variant) {
      liveRegionText = theme.strings.unavailable;
      return liveRegionText;
    }

    // Update availability
    var availability = variant.available ? "" : theme.strings.soldOut + ",";
    liveRegionText = liveRegionText.replace("[Availability]", availability);

    // Update pricing information
    var regularLabel = "";
    var regularPrice = theme.Currency.formatMoney(
      variant.price,
      theme.moneyFormat
    );
    var saleLabel = "";
    var salePrice = "";
    var unitLabel = "";
    var unitPrice = "";

    if (variant.compare_at_price > variant.price) {
      regularLabel = theme.strings.regularPrice;
      regularPrice =
        theme.Currency.formatMoney(
          variant.compare_at_price,
          theme.moneyFormat
        ) + ",";
      saleLabel = theme.strings.sale;
      salePrice = theme.Currency.formatMoney(variant.price, theme.moneyFormat);
    }

    if (variant.unit_price) {
      unitLabel = theme.strings.unitPrice;
      unitPrice =
        theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat) +
        " " +
        theme.strings.unitPriceSeparator +
        " " +
        _getBaseUnit(variant);
    }

    liveRegionText = liveRegionText
      .replace("[Regular]", regularLabel)
      .replace("[$$]", regularPrice)
      .replace("[Sale]", saleLabel)
      .replace("[$]", salePrice)
      .replace("[UnitPrice]", unitLabel)
      .replace("[$$$]", unitPrice)
      .trim();

    return liveRegionText;
  }

  function _updateLiveRegion(evt) {
    var variant = evt.variant;
    var liveRegion = $(".product-quickview-template__container").querySelector(
      this.selectors.productStatus
    );
    liveRegion.innerHTML = _liveRegionText(variant);
    liveRegion.setAttribute("aria-hidden", false);

    // hide content from accessibility tree after announcement
    setTimeout(function () {
      liveRegion.setAttribute("aria-hidden", true);
    }, 1000);
  }

  function _updateAddToCart(evt) {
    var variant = evt.variant;

    if (variant) {
      if (variant.available) {
        this.$addToCart
          .removeAttr("aria-disabled")
          .attr("aria-label", theme.strings.addToCart);
        $(this.selectors.addToCartText, this.$container).text(
          theme.strings.addToCart
        );
        $(this.selectors.productForm, this.container).removeClass(
          this.classes.variantSoldOut
        );
      } else {
        // The variant doesn't exist, disable submit button and change the text.
        // This may be an error or notice that a specific variant is not available.
        this.$addToCart
          .attr("aria-disabled", true)
          .attr("aria-label", theme.strings.soldOut);
        $(this.selectors.addToCartText, this.$container).text(
          theme.strings.soldOut
        );
        $(this.selectors.productForm, this.container).addClass(
          this.classes.variantSoldOut
        );
      }
    } else {
      this.$addToCart
        .attr("aria-disabled", true)
        .attr("aria-label", theme.strings.unavailable);
      $(this.selectors.addToCartText, this.$container).text(
        theme.strings.unavailable
      );
      $(this.selectors.productForm, this.container).addClass(
        this.classes.variantSoldOut
      );
    }
  }

  function _updateAvailability(evt) {
    // remove error message if one is showing
    _hideErrorMessage();

    // update form submit
    _updateAddToCart(evt);

    // update live region
    // _updateLiveRegion(evt);

    _updatePrice(evt);
  }

  function _updateImages(evt) {
    var variant = evt.variant;
    var imageId = variant.featured_media.id;

    _switchImage(imageId);
    _setActiveThumbnail(imageId);
  }

  function _updatePrice(evt) {
    var variant = evt.variant;

    var $priceContainer = $(this.selectors.priceContainer, this.$container);
    var $regularPrice = $(this.selectors.regularPrice, $priceContainer);
    var $salePrice = $(this.selectors.salePrice, $priceContainer);
    var $unitPrice = $(this.selectors.unitPrice, $priceContainer);
    var $labelSale = $(".product-quickview-template__container").find(
      this.selectors.labelSale
    );
    var $unitPriceBaseUnit = $(
      this.selectors.unitPriceBaseUnit,
      $priceContainer
    );

    // Reset product price state
    $priceContainer
      .removeClass(this.classes.productUnavailable)
      .removeClass(this.classes.productOnSale)
      .removeClass(this.classes.productUnitAvailable)
      .removeAttr("aria-hidden");

    this.$productPolicies.removeClass(this.classes.visibilityHidden);

    // Unavailable
    if (!variant) {
      $priceContainer
        .addClass(this.classes.productUnavailable)
        .attr("aria-hidden", true);

      this.$productPolicies.addClass(this.classes.visibilityHidden);
      return;
    }

    // Sold out
    // if (!variant.available) {
    //     $priceContainer.addClass(this.classes.productSoldOut);
    //     return;
    // }

    // On sale
    var quantity = this.$quantityInput.val();
    if (variant.compare_at_price > variant.price) {
      // Regular price
      $regularPrice.html(
        theme.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat)
      );
      // Sale price
      $salePrice.html(
        theme.Currency.formatMoney(variant.price, theme.moneyFormat)
      );
      $priceContainer.addClass(this.classes.productOnSale);

      $labelSale.show();
      $labelSale.html(
        "-" +
          Math.floor(
            ((variant.compare_at_price - variant.price) /
              variant.compare_at_price) *
              100
          ) +
          "% " +
          theme.strings.off
      );
    } else {
      // Regular price
      $regularPrice.html(
        theme.Currency.formatMoney(variant.price, theme.moneyFormat)
      );
      // Sale price
      $salePrice.html("");
      $labelSale.hide();
    }

    // Unit price
    if (variant.unit_price) {
      $unitPrice.html(
        theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
      );
      $unitPriceBaseUnit.html(_getBaseUnit(variant));
      $priceContainer.addClass(this.classes.productUnitAvailable);
    }

    if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
      Currency.convertAll(
        window.shop_currency,
        $("#currencies .active").attr("data-currency"),
        "span.money",
        "money_format"
      );
    }
  }

  function _getBaseUnit(variant) {
    return variant.unit_price_measurement.reference_value === 1
      ? variant.unit_price_measurement.reference_unit
      : variant.unit_price_measurement.reference_value +
          variant.unit_price_measurement.reference_unit;
  }

  function _updateSKU(evt) {
    var variant = evt.variant;

    // Update the sku
    $(this.selectors.SKU).html(variant.sku);

    // Update the inventory
    if (variant.available === true) {
      $(this.selectors.inventory).addClass("variant-inventory--true");
    } else {
      $(this.selectors.inventory).removeClass("variant-inventory--true");
    }
  }

  function _addonSocial() {
    if (!$(".product__socialshare").length) return;

    $.getScript(
      "https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-595b0ea2fb9c5869"
    ).done(function () {
      if (typeof addthis !== "undefined") {
        addthis.init();
        addthis.layers.refresh();
      }
    });
  }

  function _addonReview() {
    if ($(".shopify-product-reviews-badge").length) {
      return (
        window.SPR.registerCallbacks(),
        window.SPR.initRatingHandler(),
        window.SPR.initDomEls(),
        window.SPR.loadProducts(),
        window.SPR.loadBadges()
      );
    }
  }

  function _addonCountdown() {
    if (!$("[data-countdown-qv]").length) {
      return;
    }

    $("[data-countdown-qv]").each(function () {
      // Set the date we're counting down to
      if ($(this).hasClass("has-value")) {
        return;
      }

      var self = $(this),
        countDownDate = new Date(self.attr("data-countdown-value")).getTime();
      // Update the count down every 1 second
      var countdownfunction = setInterval(function () {
        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(countdownfunction);
          self.parent().remove();
        } else {
          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

          // days = this.$container.on( this._setShowDateFormat(days).bind(this));
          // Output the result in an element with id="countDowntimer"
          var strCountDown =
            "<span class='countdown--item'>" +
            showTime(days) +
            "D</span> : <span class='countdown--item'>" +
            showTime(hours) +
            "H</span> : <span class='countdown--item'>" +
            showTime(minutes) +
            "M</span> : <span class='countdown--item'>" +
            showTime(seconds) +
            "S</span>";
          self.html(strCountDown);
          self.addClass("has-value");
        }
      }, 500);
    });
  }

  function _addonCustomerView() {
    if (!$("#customers-view2").length) {
      return;
    }

    var customerView = $("[data-customer-view2]");

    customerView.each(function () {
      var self = $(this);

      setInterval(function () {
        var views = self.data("customer-view2").split(","),
          i = Math.floor(Math.random() * views.length);

        self.find("label").text(views[i]);
      }, 5000);
    });
  }

  function _addonSoldOutProduct() {
    if (!$("[data-soldOut-product2]").length) {
      return;
    }
    $("[data-soldOut-product2]").each(function () {
      var self = $(this);

      var items = self.data("items2").toString().split(","),
        hours = self.data("hours2").toString().split(","),
        i = Math.floor(Math.random() * items.length),
        j = Math.floor(Math.random() * hours.length);

      self.find(".items-count").text(items[i]);
      self.find(".hours-num").text(hours[j]);
    });
  }

  function _enableZoom(el) {
    var zoomUrl = $(el).data("zoom");
    $(el).zoom({
      url: zoomUrl,
      magnify: 1.5,
    });
  }

  function _destroyZoom(el) {
    $(el).trigger("zoom.destroy");
  }

  function showTime(time) {
    if (time < 10) {
      return "<span class='num'>0" + time + "</span>";
    }
    return "<span class='num'>" + time + "</span>";
  }

  return {
    init: function () {
      initQuickView();
    },
  };
})();

/*================ Product Wishlist ===========*/

theme.ProductWishlist = (function () {
  var wishListsArr = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];

  localStorage.setItem("items", JSON.stringify(wishListsArr));

  if (wishListsArr.length) {
    wishListsArr = JSON.parse(localStorage.getItem("items"));
  }

  function initWishListIcons() {
    var wishListItems = localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items"))
      : [];

    if (!wishListItems.length) {
      return;
    }

    for (var i = 0; i < wishListItems.length; i++) {
      var icon = $('[data-product-handle="' + wishListItems[i] + '"]');
      icon.addClass("wishlist-added");
    }
  }

  function createWishListTplItem(ProductHandle) {
    var wishListCotainer = $("[data-wishlist-container]");

    jQuery.getJSON(
      window.router + "/products/" + ProductHandle + ".js",
      function (product) {
        var productHTML = "",
          price_min = theme.Currency.formatMoney(
            product.price_min,
            theme.moneyFormat
          );

        productHTML +=
          '<tr class="wishlist_row space"></tr><tr class="wishlist_row" data-wishlist-added="wishlist-' +
          product.id +
          '" data-product-id="product-' +
          product.handle +
          '">';
        productHTML += '<td class="wishlist_image text-left">';
        productHTML += '<div class="cart__product-information">';
        productHTML +=
          '<div class="cart__image-wrapper"><a href="' +
          product.url +
          '" class="product-grid-image" data-collections-related="/collections/all?view=related"><img class="cart__image" srcset="' +
          product.featured_image +
          '" alt="' +
          product.featured_image.alt +
          '"></a></div>';
        productHTML += "</div></td>";
        productHTML += '<td class="wishlist_meta text-left">';
        productHTML += '<div class="cart__product-information">';
        productHTML += '<div class="cart__content-wrapper">';
        productHTML +=
          '<a class="cart__product-title" href="' +
          product.url +
          '" title="' +
          product.title +
          '">' +
          product.title +
          "</a>";
        productHTML +=
          '<div class="product-details-wrapper"><a class="cart__product-vendor" href="' +
          window.router +
          "/collections/vendors?q=" +
          product.vendor +
          '" title="' +
          product.vendor +
          '">' +
          product.vendor +
          "</a></div>";
        productHTML += "</div></td>";
        productHTML +=
          '<td class="wishlist_price text-left"><div class="product-price">' +
          price_min +
          "</div></td>";
        productHTML +=
          '<td class="wishlist_remove text-center"><a class="btn btn--secondary btn--wishlist--remove wishlist-added" href="#" data-product-handle="' +
          product.handle +
          '" data-wishlist data-id="' +
          product.id +
          '">' +
          theme.strings.remove +
          "</a></td>";
        productHTML += '<td class="wishlist_add text-center">';
        productHTML +=
          '<form action="/cart/add" method="post" class="variants" id="wishlist-product-form-' +
          product.id +
          '" data-id="product-actions-' +
          product.id +
          '" enctype="multipart/form-data">';

        if (product.available) {
          if (product.variants.length == 1) {
            productHTML +=
              '<a class="btn btn--primary" title="' +
              product.title +
              '" href="' +
              product.url +
              '">' +
              theme.strings.addToCart +
              "</a>";
          }
          if (product.variants.length > 1) {
            productHTML +=
              '<a class="btn btn--primary" title="' +
              product.title +
              '" href="' +
              product.url +
              '">' +
              theme.strings.addToCart +
              "</a>";
          }
        } else {
          productHTML +=
            '<button class="btn btn--primary product-btn-soldOut" type="submit" disabled>' +
            theme.strings.unavailable +
            "</button>";
        }

        productHTML += "</form></td>";
        productHTML += "</tr>";

        wishListCotainer.append(productHTML);

        var regex = /(<([^>]+)>)/gi;
        var href = $(".wishlist-footer a.share").attr("href");
        href += encodeURIComponent(
          product.title +
            "\nPrice: " +
            price_min.replace(regex, "") +
            "\nLink: " +
            window.location.protocol +
            "//" +
            window.location.hostname +
            product.url +
            "\n\n"
        );
        $(".wishlist-footer a.share").attr("href", href);
        if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
          Currency.convertAll(
            window.shop_currency,
            $("#currencies .active").attr("data-currency"),
            "span.money",
            "money_format"
          );
        }
      }
    );
  }

  function initWishListPagging() {
    var data = JSON.parse(localStorage.getItem("items"));

    var wlpaggingContainer = $("#wishlist_pagination");
    var paggingTpl =
      '<li class="pagination__item pagination__item--first"><a href="#" class="btn btn--tertiary btn--prev" aria-label="link"><svg class="icon"><use xlink:href="#icon-chevron-left" /></svg><span class="text">' +
      theme.strings.previous +
      "</span></a></li>";
    var wishListCotainer = $("[data-wishlist-container]");

    wlpaggingContainer.children().remove();
    var totalPages = Math.ceil(data.length / 5);

    if (totalPages <= 1) {
      wishListCotainer.children().show();
      return;
    }

    for (var i = 0; i < totalPages; i++) {
      var pageNum = i + 1;
      if (i === 0)
        paggingTpl +=
          '<li class="pagination__item"><a data-page="' +
          pageNum +
          '" href="' +
          pageNum +
          '" class="pagination__link pagination__link--current">' +
          pageNum +
          "</a></li>";
      else
        paggingTpl +=
          '<li class="pagination__item"><a data-page="' +
          pageNum +
          '" href="' +
          pageNum +
          '" class="pagination__link" aria-label="link">' +
          pageNum +
          "</a></li>";
    }

    paggingTpl +=
      '<li class="pagination__item pagination__item--last"><a href="#" class="btn btn--tertiary btn--next" aria-label="link"><span class="text">' +
      theme.strings.next +
      '</span><svg class="icon"><use xlink:href="#icon-chevron-right" /></svg></a></li>';

    wlpaggingContainer.append(paggingTpl);

    wishListCotainer.children().each(function (idx, elm) {
      if (idx >= 0 && idx < 11) {
        $(elm).show();
      } else {
        $(elm).hide();
      }
    });

    wlpaggingContainer
      .off("click.wl-pagging")
      .on("click.wl-pagging", "li a", function (e) {
        e.preventDefault();

        var isPrev = $(this).hasClass("btn--prev");
        var isNext = $(this).hasClass("btn--next");
        var pageNumber = $(this).data("page");

        if (isPrev) {
          var curPage = parseInt(
            $("#wishlist_pagination")
              .find(".pagination__link--current")
              .data("page")
          );
          pageNumber = curPage - 1;
        }

        if (isNext) {
          var curPage = parseInt(
            $("#wishlist_pagination")
              .find(".pagination__link--current")
              .data("page")
          );
          pageNumber = curPage + 1;
        }

        wishListCotainer.children().each(function (idx, elm) {
          if (idx >= (pageNumber - 1) * 10 && idx < pageNumber * 10) {
            $(elm).show();
          } else {
            $(elm).hide();
          }
        });

        if (pageNumber === 1) {
          wlpaggingContainer.find(".btn--prev").addClass("disabled");
          wlpaggingContainer.find(".btn--next").removeClass("disabled");
        } else if (pageNumber === totalPages) {
          wlpaggingContainer.find(".btn--next").addClass("disabled");
          wlpaggingContainer.find(".btn--prev").removeClass("disabled");
        } else {
          wlpaggingContainer.find(".btn--prev").removeClass("disabled");
          wlpaggingContainer.find(".btn--next").removeClass("disabled");
        }

        $("#wishlist_pagination")
          .find(".pagination__link")
          .removeClass("pagination__link--current");
        $("#wishlist_pagination")
          .find('[data-page="' + pageNumber + '"]')
          .addClass("pagination__link--current");
      });
  }

  function initWishLists() {
    if (
      typeof Storage !== "undefined" &&
      $(".page").hasClass("page-wishlist")
    ) {
      var data = JSON.parse(localStorage.getItem("items"));

      if (data.length <= 0) {
        return;
      }

      data.forEach(function (item) {
        createWishListTplItem(item);
      });
      setTimeout(function () {
        initWishListPagging();
      }, 1000);
    }
  }

  function setAddedForWishlistIcon(ProductHandle) {
    var wishlistElm = $('[data-product-handle="' + ProductHandle + '"]'),
      idxArr = wishListsArr.indexOf(ProductHandle),
      wishListCount = $("[data-wishlist-count]"),
      totals = Math.ceil(wishListsArr.length);

    wishListCount.html("(" + totals + ")");

    if (idxArr >= 0) {
      wishlistElm.addClass("wishlist-added");
    } else {
      wishlistElm.removeClass("wishlist-added");
    }
  }

  function doAddOrRemoveWishlish() {
    var iconWishListsSlt = "[data-wishlist]",
      wishListCount = $("[data-wishlist-count]"),
      totals = Math.ceil(wishListsArr.length);

    wishListCount.html("(" + totals + ")");

    $(document)
      .off("click", iconWishListsSlt)
      .on("click", iconWishListsSlt, function (e) {
        e.preventDefault();

        var self = $(this),
          productId = self.data("id"),
          ProductHandle = self.data("product-handle"),
          idxArr = wishListsArr.indexOf(ProductHandle);

        if (!self.hasClass("wishlist-added")) {
          self.addClass("wishlist-added");

          if ($("[data-wishlist-container]").length) {
            createWishListTplItem(ProductHandle);
          }

          wishListsArr.push(ProductHandle);
          localStorage.setItem("items", JSON.stringify(wishListsArr));
        } else {
          self.removeClass("wishlist-added");

          if ($('[data-wishlist-added="wishlist-' + productId + '"]').length) {
            $('[data-wishlist-added="wishlist-' + productId + '"]').remove();
          }

          wishListsArr.splice(idxArr, 1);
          localStorage.setItem("items", JSON.stringify(wishListsArr));

          if ($("[data-wishlist-container]").length) {
            initWishListPagging();
          }
        }
        setAddedForWishlistIcon(ProductHandle);
      });
  }

  return {
    init: function () {
      initWishListIcons();
      initWishLists();
      doAddOrRemoveWishlish();
    },
  };
})();

/*================ Product Compare ===========*/

theme.ProductCompare = (function () {
  var compareArr = localStorage.getItem("compareArr")
    ? JSON.parse(localStorage.getItem("compareArr"))
    : [];

  localStorage.setItem("compareArr", JSON.stringify(compareArr));

  if (compareArr.length) {
    compareArr = JSON.parse(localStorage.getItem("compareArr"));
  }

  function initCompareIcons() {
    if (!$(".page-collection").length) {
      return;
    }

    var compareCountNum = $("[data-compare-count]");

    totalProduct = Math.ceil(compareArr.length);
    compareCountNum.text(totalProduct);

    if (!compareArr.length) {
      return;
    } else {
      for (var i = 0; i < compareArr.length; i++) {
        var icon = $('[data-compare-product-handle="' + compareArr[i] + '"]');
        icon.addClass("compare-added");
      }

      if (typeof Storage !== "undefined") {
        if (compareArr.length <= 0) {
          return;
        }

        resetCompare();

        setTimeout(function () {
          compareArr.forEach(function (item) {
            createCompareItem(item);
            setAddedForCompareIcon(item);
          });
        }, 700);
      } else {
        alert(theme.strings.addressError);
      }
    }
  }

  function createCompareItem(ProductHandle) {
    var compareProduct = $("[data-compare-modal]").find(".product-grid"),
      compareRating = $("[data-compare-modal]").find(".rating"),
      compareDescription = $("[data-compare-modal]").find(".description"),
      compareCollection = $("[data-compare-modal]").find(".collection"),
      compareAvailability = $("[data-compare-modal]").find(".availability"),
      compareSKU = $("[data-compare-modal]").find(".product-sku"),
      compareOption1 = $("[data-compare-modal]").find(".option1"),
      compareOption2 = $("[data-compare-modal]").find(".option2"),
      compareOption3 = $("[data-compare-modal]").find(".option3");

    jQuery.getJSON(
      window.router + "/products/" + ProductHandle + ".js",
      function (product) {
        var productHTML = "",
          priceHTML = "",
          productLabelHTML = "",
          ratingHTML = "",
          descriptionHTML = "",
          collectionHTML = "",
          availabilityHTML = "",
          skuHTML = "",
          optionValueHTML = "",
          optionValueHTML2 = "",
          price_min = theme.Currency.formatMoney(
            product.price_min,
            theme.moneyFormat
          );

        var productIDCompare = product.id;
        var priceSale = "";

        $(".page-collection .halo-column .halo-column__item").each(function () {
          var productID = $(this).find(".product-card").data("id");

          if (productID == productIDCompare) {
            price = $(this).find(".product-card__price").html();
            productLabel = $(this).find(".product_badges").html();
            rating = $(this).find(".product-card__reviews").html();
            coll = $(this).find(".product-card__collection").html();
            desc = $(this).find(".product-card__description").html();
            sku = $(this).find(".product-card__sku").html();
            if (
              $(this).find(".product-card__price").hasClass("price--on-sale")
            ) {
              priceSale = "price--on-sale";
            }

            priceHTML += price;
            if (productLabel != undefined && productLabel != "") {
              productLabelHTML += productLabel;
            }

            if (rating == "" || rating == undefined) {
              ratingHTML +=
                '<div class="col-xl-4" data-compare-added="compare-' +
                product.id +
                '"></div>';
            } else {
              ratingHTML +=
                '<div class="col-xl-4" data-compare-added="compare-' +
                product.id +
                '">' +
                rating +
                "</div>";
            }
            compareRating.append(ratingHTML);

            if (coll == "" || coll == undefined) {
              collectionHTML +=
                '<div class="col-xl-4" data-compare-added="compare-' +
                product.id +
                '">-</div>';
            } else {
              collectionHTML +=
                '<div class="col-xl-4" data-compare-added="compare-' +
                product.id +
                '">' +
                coll +
                "</div>";
            }
            compareCollection.append(collectionHTML);

            if (desc == "" || desc == undefined) {
              descriptionHTML +=
                '<div class="col-xl-4" data-compare-added="compare-' +
                product.id +
                '">-</div>';
            } else {
              descriptionHTML +=
                '<div class="col-xl-4" data-compare-added="compare-' +
                product.id +
                '">' +
                desc +
                "</div>";
            }
            compareDescription.append(descriptionHTML);

            if (sku == "" || sku == undefined) {
              skuHTML +=
                '<div class="col-xl-4" data-compare-added="compare-' +
                product.id +
                '">-</div>';
            } else {
              skuHTML +=
                '<div class="col-xl-4" data-compare-added="compare-' +
                product.id +
                '">' +
                sku +
                "</div>";
            }
            compareSKU.append(skuHTML);
          }
        });

        productHTML +=
          '<div class="grid-item col-xl-4" data-compare-added="compare-' +
          product.id +
          '">';
        productHTML +=
          '<div class="product-card product-card--compare" data-product-id="product-' +
          product.handle +
          '">';
        productHTML +=
          '<a class="product-card__remove" href="javascript:void(0);" data-icon-compare-remove data-compare-product-handle="' +
          product.handle +
          '" data-id="' +
          product.id +
          '"> &#215; </a>';
        productHTML += '<div class="product-card__image">';
        productHTML +=
          '<a href="' + product.url + '" class="product-card__link">';
        productHTML +=
          '<img class="product-card__img" src="' +
          product.featured_image +
          '" alt="' +
          product.featured_image.alt +
          '">';
        productHTML += "</a>";
        productHTML +=
          '<div class="product_badges">' + productLabelHTML + "</div></div>";
        productHTML += '<div class="product-card__content">';
        productHTML += '<div class="product-card__vendor">';
        productHTML +=
          '<a href="' +
          window.router +
          "/collections/vendors?q=" +
          product.vendor +
          '" title="' +
          product.vendor +
          '">' +
          product.vendor +
          "</a></div>";
        productHTML +=
          '<h4 class="product-card__title"><a href="' +
          product.url +
          '" title="' +
          product.title +
          '">' +
          product.title +
          "</a></h4>";
        productHTML +=
          '<div class="product-card__price ' +
          priceSale +
          '">' +
          priceHTML +
          "</div>";

        productHTML += '<div class="product-card__button">';
        productHTML +=
          '<form action="/cart/add" method="post" class="variants" data-id="product-actions-' +
          product.id +
          '" enctype="multipart/form-data">';

        if (product.available) {
          productHTML +=
            '<a class="product-card__btn" title="' +
            product.title +
            '" href="' +
            product.url +
            '">' +
            theme.strings.goToProduct +
            "</a>";
          availabilityHTML +=
            '<div class="col-xl-4 in-stock" data-compare-added="compare-' +
            product.id +
            '">' +
            theme.strings.in_stock +
            "</div>";
        } else {
          productHTML +=
            '<button class="product-card__btn product-card__btn-soldOut" type="submit" disabled="disabled">' +
            theme.strings.unavailable +
            "</button>";
          availabilityHTML +=
            '<div class="col-xl-4 unavailable" data-compare-added="compare-' +
            product.id +
            '">' +
            theme.strings.out_of_stock +
            "</div>";
        }
        productHTML += "</form>";
        productHTML += "</div></div></div></div>";

        compareProduct.append(productHTML);

        compareAvailability.append(availabilityHTML);

        var productOptions = product.options;

        $.each(productOptions, function (index, opt) {
          var optPosition = opt.position,
            optName = opt.name.toLowerCase(),
            optValue = opt.values,
            optValueText = "";

          optValue.forEach(function (value, index) {
            if (value) {
              if (index > 0) {
                optValueText += ", ";
              }
              optValueText += value;
            }
          });

          optionValueHTML2 +=
            '<div class="col-xl-4" data-compare-added="compare-' +
            product.id +
            '">-</div>';

          if (optValueText == "" || optValueText == "Default Title") {
            optionValueHTML +=
              '<div class="col-xl-4" data-compare-added="compare-' +
              product.id +
              '">-</div>';
          } else {
            optionValueHTML +=
              '<div class="col-xl-4" data-compare-added="compare-' +
              product.id +
              '">' +
              optValueText +
              "</div>";
          }

          var optionOneValue = window.option_ptoduct1,
            optionTwoValue = window.option_ptoduct2;
          optionThreeValue = window.option_ptoduct3;

          if (optPosition == 1) {
            if (optName == optionOneValue) {
              compareOption1.append(optionValueHTML);
              compareOption2.append(optionValueHTML2);
              compareOption3.append(optionValueHTML2);
            } else if (optName == optionTwoValue) {
              compareOption1.append(optionValueHTML2);
              compareOption2.append(optionValueHTML);
              compareOption3.append(optionValueHTML2);
            } else if (optName == "title") {
              compareOption1.append(optionValueHTML2);
              compareOption2.append(optionValueHTML2);
              compareOption3.append(optionValueHTML2);
            } else {
              compareOption1.append(optionValueHTML2);
              compareOption2.append(optionValueHTML2);
              compareOption3.append(optionValueHTML);
            }
          }
          if (optPosition == 2) {
            if (optName == optionOneValue) {
              compareOption1
                .find('[data-compare-added="compare-' + product.id + '"]')
                .html(optValueText);
            } else if (optName == optionTwoValue) {
              compareOption2
                .find('[data-compare-added="compare-' + product.id + '"]')
                .html(optValueText);
            } else {
              compareOption3
                .find('[data-compare-added="compare-' + product.id + '"]')
                .html(optValueText);
            }
          }
          if (optPosition == 3) {
            if (optName == optionOneValue) {
              compareOption1
                .find('[data-compare-added="compare-' + product.id + '"]')
                .html(optValueText);
            } else if (optName == optionTwoValue) {
              compareOption2
                .find('[data-compare-added="compare-' + product.id + '"]')
                .html(optValueText);
            } else {
              compareOption3
                .find('[data-compare-added="compare-' + product.id + '"]')
                .html(optValueText);
            }
          }
        });
      }
    );
  }

  function removeCompareItem(ProductHandle) {
    var iconCompareRemove = "[data-icon-compare-remove]";

    $(document)
      .off("click.removeCompareItem", iconCompareRemove)
      .on("click.removeCompareItem", iconCompareRemove, function (e) {
        e.preventDefault();
        e.stopPropagation();

        var self = $(this),
          productId = self.data("id"),
          ProductHandle = self.data("compare-product-handle"),
          idxArr = compareArr.indexOf(ProductHandle);

        if ($('[data-compare-added="compare-' + productId + '"]').length) {
          $('[data-compare-added="compare-' + productId + '"]').remove();
        }

        compareArr.splice(idxArr, 1);
        localStorage.setItem("compareArr", JSON.stringify(compareArr));

        setAddedForCompareIcon(ProductHandle);
      });
  }

  function removeAllCompareItem(ProductHandle) {
    var compareRemoveAll = "[data-compare-remove-all]";
    compareCountNum = $("[data-compare-count]");
    compareElm = $("[data-icon-compare]");

    $(document)
      .off("click.removeAllCompareItem", compareRemoveAll)
      .on("click.removeAllCompareItem", compareRemoveAll, function (e) {
        e.preventDefault();
        e.stopPropagation();

        $("#product-compare-modal .close").trigger("click");

        setTimeout(function () {
          $("[data-compare-added]").remove();
          compareArr.splice(0, compareArr.length);
          localStorage.setItem("compareArr", JSON.stringify(compareArr));

          if (compareElm.hasClass("compare-added")) {
            compareElm.removeClass("compare-added");
          }

          totalProduct = Math.ceil(compareArr.length);
          compareCountNum.text("0");
          compareCountNum.parent().removeClass("show");
        }, 500);
      });
  }

  function resetCompare() {
    var compareRemoveAll = "[data-compare-remove-all]";
    compareCountNum = $("[data-compare-count]");
    compareElm = $("[data-icon-compare]");

    $("[data-compare-added]").remove();

    compareArr.splice(0, compareArr.length);
    localStorage.setItem("compareArr", JSON.stringify(compareArr));

    if (compareElm.hasClass("compare-added")) {
      compareElm.removeClass("compare-added");
    }

    totalProduct = Math.ceil(compareArr.length);
    compareCountNum.text("0");
    compareCountNum.parent().removeClass("show");
  }

  function setAddedForCompareIcon(ProductHandle) {
    var compareElm = $('[data-compare-product-handle="' + ProductHandle + '"]'),
      idxArr = compareArr.indexOf(ProductHandle),
      compareCountNum = $("[data-compare-count]");

    compareItems = localStorage.getItem("compareArr")
      ? JSON.parse(localStorage.getItem("compareArr"))
      : [];
    totalProduct = Math.ceil(compareItems.length);

    if (idxArr >= 0) {
      compareElm.addClass("compare-added");
    } else {
      compareElm.removeClass("compare-added");
    }

    compareCountNum.text(totalProduct);

    if (totalProduct > 1) {
      compareCountNum.parent().addClass("show");
    } else {
      compareCountNum.parent().removeClass("show");
    }
  }

  function doAddOrRemoveCompare() {
    var iconCompare = "[data-icon-compare]";

    $(document).on("click", iconCompare, function (e) {
      e.preventDefault();

      var self = $(this),
        productId = self.data("id"),
        ProductHandle = self.data("compare-product-handle"),
        idxArr = compareArr.indexOf(ProductHandle);

      if (!self.hasClass("compare-added")) {
        self.addClass("compare-added");

        compareArr.push(ProductHandle);
        localStorage.setItem("compareArr", JSON.stringify(compareArr));

        createCompareItem(ProductHandle);
      } else {
        self.removeClass("compare-added");

        if ($('[data-compare-added="compare-' + productId + '"]').length) {
          $('[data-compare-added="compare-' + productId + '"]').remove();
        }

        compareArr.splice(idxArr, 1);
        localStorage.setItem("compareArr", JSON.stringify(compareArr));
      }

      setAddedForCompareIcon(ProductHandle);
    });
  }

  function initCompareSelected() {
    var iconCompareSelected = "[data-compare-selected]",
      compareModal = $("[data-compare-modal]"),
      compareModalProduct = compareModal.find(".product-grid"),
      compareModalMessage = $("[data-compare-message-modal]");

    $(document).on("click", iconCompareSelected, function (e) {
      e.preventDefault();
      e.stopPropagation();

      theme.HaloAddOn.productComparePopup();

      if (typeof Storage !== "undefined") {
        if (compareArr.length <= 1) {
        } else {
          compareArr.forEach(function (item) {
            removeCompareItem(item);
          });

          removeAllCompareItem();
        }
      } else {
        alert(theme.strings.addressError);
      }
    });
  }

  return {
    init: function () {
      doAddOrRemoveCompare();
      initCompareIcons();
      initCompareSelected();
    },
  };
})();

/*================ Product Card Grid ===========*/

theme.ProductCard = function () {
  function ProductCard() {
    this.init();
  }

  function QuickShop(container) {
    var $product = (theme.ProductCard.$container = container);
    var sectionId = $product
      .parents("[data-section-id]")
      .attr("data-section-id");

    this.productSingleObject = JSON.parse($product.attr("data-json-product"));

    var productId = this.productSingleObject.id;

    theme.ProductCard.selectors = {
      addToCart: "[data-add-to-cart]",
      addToCartText: "[data-add-to-cart-text]",
      cartCount: "[data-cart-count]",
      cartCountBubble: "[data-cart-count-bubble]",
      cartPopup: "[data-cart-popup]",
      cartPopupCartQuantity: "[data-cart-popup-cart-quantity]",
      cartPopupClose: "[data-cart-popup-close]",
      cartPopupDismiss: "[data-cart-popup-dismiss]",
      cartPopupImage: "[data-cart-popup-image]",
      cartPopupImageWrapper: "[data-cart-popup-image-wrapper]",
      cartPopupImagePlaceholder: "[data-cart-popup-image-placeholder]",
      cartPopupPlaceholderSize: "[data-placeholder-size]",
      cartPopupProductDetails: "[data-cart-popup-product-details]",
      cartPopupQuantity: "[data-cart-popup-quantity]",
      cartPopupQuantityLabel: "[data-cart-popup-quantity-label]",
      cartPopupTitle: "[data-cart-popup-title]",
      cartPopupWrapper: "[data-cart-popup-wrapper]",
      labelSale: "[data-label-sale]",
      loader: "[data-loader]",
      loaderStatus: "[data-loader-status]",
      originalSelectorId: "#ProductSelect-" + productId + "-" + sectionId,
      productCardOptionSelector:
        "#productCardSelect-" + productId + "-" + sectionId,
      productForm: "[data-product-form2]",
      errorMessage: "[data-error-message]",
      errorMessageWrapper: "[data-error-message-wrapper]",
      singleOptionSelector: ".single-option-selector-" + sectionId,
      priceContainer: "[data-price]",
      regularPrice: "[data-regular-price]",
      salePrice: "[data-sale-price]",
      unitPrice: "[data-unit-price]",
    };

    theme.ProductCard.classes = {
      cartPopupWrapperHidden: "cart-popup-wrapper--hidden",
      hidden: "hide",
      visibilityHidden: "visibility-hidden",
      cartImage: "cart-popup-item__image",
      productFormErrorMessageWrapperHidden:
        "product-form__error-message-wrapper--hidden",
      activeClass: "active-thumb",
      variantSoldOut: "product-form--variant-sold-out",
      productOnSale: "price--on-sale",
      productUnitAvailable: "price--unit-available",
      productUnavailable: "price--unavailable",
      productSoldOut: "price--sold-out",
    };

    theme.ProductCard.$errorMessageWrapper = $(
      theme.ProductCard.selectors.errorMessageWrapper,
      $product
    );

    theme.ProductCard.$addToCart = $(
      theme.ProductCard.selectors.addToCart,
      $product
    );
    theme.ProductCard.$addToCartText = $(
      theme.ProductCard.selectors.addToCartText,
      theme.ProductCard.$addToCart
    );
    theme.ProductCard.$loader = $(
      theme.ProductCard.selectors.loader,
      theme.ProductCard.$addToCart
    );
    theme.ProductCard.$loaderStatus = $(
      theme.ProductCard.selectors.loaderStatus,
      $product
    );

    var options = {
      $container: $product,
      enableHistoryState: $product.data("enable-history-state") || false,
      singleOptionSelector: theme.ProductCard.selectors.singleOptionSelector,
      originalSelectorId: theme.ProductCard.selectors.originalSelectorId,
      productCardOptionSelector:
        theme.ProductCard.selectors.productCardOptionSelector,
      product: this.productSingleObject,
    };

    $(theme.ProductCard.selectors.productCardOptionSelector)
      .find("a")
      .on("click", function () {
        var self = $(this);
        $(theme.ProductCard.selectors.productCardOptionSelector)
          .find("a")
          .removeClass("active");
        self.addClass("active");
      });

    this.variants = new slate.Variants(options);
    var variant = this.variants._getVariantFromOptions2();

    theme.ProductCard._updateAddToCart({
      type: "variantChange",
      variant: variant,
    });

    $product.on(
      "variantChange",
      theme.ProductCard._updateAvailability.bind(this)
    );

    theme.ProductCard._initAddToCart($product);
  }

  function showTime(time) {
    if (time < 10) {
      return "<span class='num'>0" + time + "</span>";
    }
    return "<span class='num'>" + time + "</span>";
  }

  ProductCard.prototype = $.extend({}, ProductCard.prototype, {
    $addToCart: null,
    $addToCartText: null,
    selectors: {},
    classes: {},
    ajaxEnabled: true,
    $loader: null,
    $loaderStatus: null,
    $errorMessageWrapper: null,
    $container: null,
    init: function () {
      this.showVariantPopup();
    },
    showVariantPopup: function () {
      if ($(window).width() > 1024) {
        $(document)
          .off("mouseover", ".product-card[data-product-card]")
          .on("mouseover", ".product-card[data-product-card]", function (e) {
            e.preventDefault();
            var $product = $(this);

            if (!$product[0].hasAttribute("data-json-product")) {
              if ($product.hasClass("json-loading")) return;
              $product.addClass("json-loading");
              var handle = $product.find(".product-card__link").attr("href");

              var xhr = $.ajax({
                type: "GET",
                url: handle,
                data: {
                  view: "get_json",
                },
                cache: false,
                dataType: "html",
                success: function (data) {
                  var json = JSON.parse(data);
                  $product.attr("data-json-product", JSON.stringify(json));
                },
                complete: function () {
                  $product.removeClass("json-loading");
                },
              });
            }
          });

        $(document).on("click", ".product-card__btn--quick", function () {
          $(".product-card__button--wrapper", $("body")).removeClass("is-open");
          var self = $(this),
            $product = self.parents(".product-card"),
            $height = $product.find(".product-card__content").outerHeight();
          $product.find(".product-card__button--wrapper").addClass("is-open");
          $product.find(".product-card__Select").css("height", $height);
          QuickShop($product);
        });

        $(document).on("click", "[data-btn-addtocart]", function (evt) {
          if (!theme.ProductCard.ajaxEnabled) return;

          evt.preventDefault();
          var self = $(this),
            $product = self.parents(".product-card");

          QuickShop($product);

          theme.ProductCard.$previouslyFocusedElement = $(":focus");

          var isInvalidQuantity = 0;

          if (!isInvalidQuantity && theme.ProductCard.ajaxEnabled) {
            // disable the addToCart and dynamic checkout button while
            // request/cart popup is loading and handle loading state
            theme.ProductCard._handleButtonLoadingState(true);

            var $data = $("[data-product-form2]", $product);
            theme.ProductCard._addItemToCart($data);
            return;
          }
        });
      } else {
        $(document).on("click", ".product-card__btn--quick", function () {
          $(".product-card__button--wrapper", $("body")).removeClass("is-open");
          var self = $(this),
            $product = self.parents(".product-card");

          theme.HaloAddOn.loadingPopup();

          if (!$product[0].hasAttribute("data-json-product")) {
            if ($product.hasClass("json-loading")) return;
            $product.addClass("json-loading");
            var handle = $product.find(".product-card__link").attr("href");

            var xhr = $.ajax({
              type: "GET",
              url: handle,
              data: {
                view: "get_json",
              },
              cache: false,
              dataType: "html",
              success: function (data) {
                var json = JSON.parse(data);
                $product.attr("data-json-product", JSON.stringify(json));
              },
              complete: function () {
                $product.removeClass("json-loading");
              },
            });
          }

          setTimeout(function () {
            theme.HaloAddOn.removeLoadingPopup();
            QuickShop($product);
            var $height =
              $product.find(".product-card__content").outerHeight() + 5;
            $product.find(".product-card__button--wrapper").addClass("is-open");
            $product.find(".product-card__Select").css("height", $height);
          }, 1500);
        });

        $(document).on("click", "[data-btn-addtocart]", function (evt) {
          if (!theme.ProductCard.ajaxEnabled) return;

          evt.preventDefault();

          var self = $(this),
            $product = self.parents(".product-card");

          if (!$product[0].hasAttribute("data-json-product")) {
            if ($product.hasClass("json-loading")) return;
            $product.addClass("json-loading");
            var handle = $product.find(".product-card__link").attr("href");

            var xhr = $.ajax({
              type: "GET",
              url: handle,
              data: {
                view: "get_json",
              },
              cache: false,
              dataType: "html",
              success: function (data) {
                var json = JSON.parse(data);
                $product.attr("data-json-product", JSON.stringify(json));
              },
              complete: function () {
                $product.removeClass("json-loading");
              },
            });
          }

          setTimeout(function () {
            QuickShop($product);

            theme.ProductCard.$previouslyFocusedElement = $(":focus");

            var isInvalidQuantity = 0;

            if (!isInvalidQuantity && theme.ProductCard.ajaxEnabled) {
              // disable the addToCart and dynamic checkout button while
              // request/cart popup is loading and handle loading state

              theme.ProductCard._handleButtonLoadingState(true);

              var $data = $("[data-product-form2]", $product);
              theme.ProductCard._addItemToCart($data);
              return;
            }
          }, 800);
        });
      }

      $(document).on(
        "click",
        ".product-card__variant--popup .close",
        function () {
          $(this)
            .parents(".product-card__button--wrapper")
            .removeClass("is-open");
        }
      );
    },
    _updateAddToCart: function (evt) {
      var variant = evt.variant;
      if (variant) {
        if (variant.available) {
          this.$addToCart
            .removeAttr("aria-disabled")
            .attr("aria-label", theme.strings.select_options);
          if (
            $(this.selectors.addToCartText, this.$container).hasClass(
              "data-pre-order-text"
            )
          ) {
            $(this.selectors.addToCartText, this.$container).text(
              theme.strings.preOrder
            );
          } else {
            $(this.selectors.addToCartText, this.$container).text(
              theme.strings.select_options
            );
          }
          $(this.selectors.productForm, this.container).removeClass(
            this.classes.variantSoldOut
          );
        } else {
          // The variant doesn't exist, disable submit button and change the text.
          // This may be an error or notice that a specific variant is not available.
          this.$addToCart
            .attr("aria-disabled", true)
            .attr("aria-label", theme.strings.soldOut);
          $(this.selectors.addToCartText, this.$container).text(
            theme.strings.soldOut
          );
          $(this.selectors.productForm, this.container).addClass(
            this.classes.variantSoldOut
          );
        }
      }
      // else {
      //     this.$addToCart
      //     .attr('aria-disabled', true)
      //     .attr('aria-label', theme.strings.unavailable);
      //     $(this.selectors.addToCartText, this.$container).text(
      //         theme.strings.unavailable
      //     );
      //     $(this.selectors.productForm, this.container).addClass(
      //         this.classes.variantSoldOut
      //     );
      // }
    },
    _updatevariantPrice(evt) {
      var variant = evt.variant;

      var $priceContainer = $(this.selectors.priceContainer, this.$container);
      var $regularPrice = $(this.selectors.regularPrice, $priceContainer);
      var $salePrice = $(this.selectors.salePrice, $priceContainer);
      var $unitPrice = $(this.selectors.unitPrice, $priceContainer);
      var $labelSale = $(this.selectors.labelSale, this.$container);
      var $unitPriceBaseUnit = $(
        this.selectors.unitPriceBaseUnit,
        $priceContainer
      );

      // Reset product price state
      $priceContainer
        .removeClass(theme.ProductCard.classes.productUnavailable)
        .removeClass(theme.ProductCard.classes.productOnSale)
        .removeClass(theme.ProductCard.classes.productUnitAvailable)
        .removeAttr("aria-hidden");

      // On sale
      if (variant.compare_at_price > variant.price) {
        // Regular price
        $regularPrice.html(
          theme.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          )
        );
        // Sale price
        $salePrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );

        $priceContainer.addClass(theme.ProductCard.classes.productOnSale);

        $labelSale.html(
          "-" +
            Math.floor(
              ((variant.compare_at_price - variant.price) /
                variant.compare_at_price) *
                100
            ) +
            "% " +
            theme.strings.off
        );
      } else {
        // Regular price
        $regularPrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
        // Sale price
        $salePrice.html("");
      }

      // Unit price
      if (variant.unit_price) {
        $unitPrice.html(
          theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
        );
        $unitPriceBaseUnit.html(_getBaseUnit(variant));
        $priceContainer.addClass(
          theme.ProductCard.classes.productUnitAvailable
        );
      }

      if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
        Currency.convertAll(
          window.shop_currency,
          $("#currencies .active").attr("data-currency"),
          "span.money",
          "money_format"
        );
      }
    },
    _updateAvailability: function (evt) {
      // remove error message if one is showing
      theme.ProductCard._hideErrorMessage();

      // update form submit
      theme.ProductCard._updateAddToCart(evt);

      // update form submit
      theme.ProductCard._updatevariantPrice(evt);
    },
    _initAddToCart: function ($container) {
      $(this.selectors.productForm, $container).on(
        "submit",
        function (evt) {
          if (this.$addToCart.is("[aria-disabled]")) {
            evt.preventDefault();
            return;
          }

          if (!this.ajaxEnabled) return;
          evt.preventDefault();
          var self = $(this),
            $product = self.parents(".product-card");

          this.$previouslyFocusedElement = $(":focus");

          var isInvalidQuantity = 0;

          if (!isInvalidQuantity && this.ajaxEnabled) {
            // disable the addToCart and dynamic checkout button while
            // request/cart popup is loading and handle loading state
            this._handleButtonLoadingState(true);
            var $data = $(this.selectors.productForm, $container);
            this._addItemToCart($data);
            return;
          }
        }.bind(this)
      );
    },
    _addItemToCart: function (data) {
      var params = {
        url: window.router + "/cart/add.js",
        data: $(data).serialize(),
        dataType: "json",
      };

      $.post(params)
        .done(
          function (item) {
            this._hideErrorMessage();
            this._setupCartPopup(item);
            this._setupSideCart();
          }.bind(this)
        )
        .fail(
          function (response) {
            this.$previouslyFocusedElement.focus();
            var errorMessage = response.responseJSON
              ? response.responseJSON.description
              : theme.strings.cartError;
            this._showErrorMessage(errorMessage);
            this._handleButtonLoadingState(false);
          }.bind(this)
        );
    },
    _showErrorMessage: function (errorMessage) {
      $(this.selectors.errorMessage, this.$container).html(errorMessage);

      this.$errorMessageWrapper
        .removeClass(this.classes.productFormErrorMessageWrapperHidden)
        .attr("aria-hidden", true)
        .removeAttr("aria-hidden");
    },
    _hideErrorMessage: function () {
      this.$errorMessageWrapper.addClass(
        this.classes.productFormErrorMessageWrapperHidden
      );
    },
    _setupSideCart: function () {
      if ($(window).width() > 1024) {
        $("[data-cart-pc]").trigger("click");
      } else {
        $("[data-mobile-cart]").trigger("click");
      }
    },
    _setupCartPopup: function (item) {
      this.$cartPopup = this.$cartPopup || $(this.selectors.cartPopup);
      this.$cartPopupWrapper =
        this.$cartPopupWrapper || $(this.selectors.cartPopupWrapper);
      this.$cartPopupTitle =
        this.$cartPopupTitle || $(this.selectors.cartPopupTitle);
      this.$cartPopupQuantity =
        this.$cartPopupQuantity || $(this.selectors.cartPopupQuantity);
      this.$cartPopupQuantityLabel =
        this.$cartPopupQuantityLabel ||
        $(this.selectors.cartPopupQuantityLabel);
      this.$cartPopupClose =
        this.$cartPopupClose || $(this.selectors.cartPopupClose);
      this.$cartPopupDismiss =
        this.$cartPopupDismiss || $(this.selectors.cartPopupDismiss);
      this.$cartPopupImagePlaceholder =
        this.$cartPopupImagePlaceholder ||
        $(this.selectors.cartPopupImagePlaceholder);

      this._setupCartPopupEventListeners();

      this._updateCartPopupContent(item);
    },

    _setupCartPopupEventListeners: function () {
      this.$cartPopupWrapper.on(
        "keyup",
        function (event) {
          if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
            this._hideCartPopup(event);
          }
        }.bind(this)
      );

      this.$cartPopupClose.on("click", this._hideCartPopup.bind(this));
      this.$cartPopupDismiss.on("click", this._hideCartPopup.bind(this));
    },
    _setCartPopupPlaceholder: function (imageUrl, imageAspectRatio) {
      this.$cartPopupImageWrapper =
        this.$cartPopupImageWrapper || $(this.selectors.cartPopupImageWrapper);

      if (imageUrl === null) {
        this.$cartPopupImageWrapper.addClass(this.classes.hidden);
        return;
      }

      var $placeholder = $(this.selectors.cartPopupPlaceholderSize);
      var maxWidth = 95 * imageAspectRatio;
      var heightRatio = 100 / imageAspectRatio;

      this.$cartPopupImagePlaceholder.css("max-width", maxWidth);

      $placeholder.css("padding-top", heightRatio + "%");
    },
    _setCartPopupImage: function (imageUrl, imageAlt) {
      if (imageUrl === null) return;

      this.$cartPopupImageWrapper.removeClass(this.classes.hidden);
      var sizedImageUrl = theme.Images.getSizedImageUrl(imageUrl, "200x");
      var image = document.createElement("img");
      image.src = sizedImageUrl;
      image.alt = imageAlt;
      image.classList.add(this.classes.cartImage);
      image.dataset.cartPopupImage = "";

      image.onload = function () {
        this.$cartPopupImagePlaceholder.addClass(this.classes.hidden);
        this.$cartPopupImageWrapper.append(image);
      }.bind(this);
    },
    _updateCartPopupContent: function (item) {
      var quantity = 1;

      this.$cartPopupTitle.text(item.product_title);
      this.$cartPopupQuantity.text(quantity);
      this.$cartPopupQuantityLabel.text(
        theme.strings.quantityLabel.replace("[count]", quantity)
      );

      this._setCartPopupPlaceholder(
        item.featured_image.url,
        item.featured_image.aspect_ratio
      );
      this._setCartPopupImage(item.featured_image.url, item.featured_image.alt);
      this._setCartPopupProductDetails(
        item.product_has_only_default_variant,
        item.options_with_values,
        item.properties
      );

      $.getJSON(window.router + "/cart.js").then(
        function (cart) {
          this._setCartQuantity(cart.item_count);
          this._setCartCountBubble(cart.item_count);
          this._showCartPopup();
        }.bind(this)
      );

      setTimeout(function () {
        if (
          !$(theme.ProductCard.selectors.cartPopupWrapper).hasClass(
            theme.ProductCard.classes.cartPopupWrapperHidden
          )
        ) {
          $(theme.ProductCard.selectors.cartPopupClose).trigger("click");
        }
      }, 3000);
    },
    _setCartPopupProductDetails: function (
      product_has_only_default_variant,
      options,
      properties
    ) {
      this.$cartPopupProductDetails =
        this.$cartPopupProductDetails ||
        $(this.selectors.cartPopupProductDetails);
      var variantPropertiesHTML = "";

      if (!product_has_only_default_variant) {
        variantPropertiesHTML =
          variantPropertiesHTML + this._getVariantOptionList(options);
      }

      if (properties !== null && Object.keys(properties).length !== 0) {
        variantPropertiesHTML =
          variantPropertiesHTML + this._getPropertyList(properties);
      }

      if (variantPropertiesHTML.length === 0) {
        this.$cartPopupProductDetails.html("");
        this.$cartPopupProductDetails.attr("hidden", "");
      } else {
        this.$cartPopupProductDetails.html(variantPropertiesHTML);
        this.$cartPopupProductDetails.removeAttr("hidden");
      }
    },
    _getVariantOptionList: function (variantOptions) {
      var variantOptionListHTML = "";

      variantOptions.forEach(function (variantOption) {
        variantOptionListHTML =
          variantOptionListHTML +
          '<li class="product-details__item product-details__item--variant-option">' +
          variantOption.value +
          "</li>";
      });
      return variantOptionListHTML;
    },
    _getPropertyList: function (properties) {
      var propertyListHTML = "";
      var propertiesArray = Object.entries(properties);

      propertiesArray.forEach(function (property) {
        // Line item properties prefixed with an underscore are not to be displayed
        if (property[0].charAt(0) === "_") return;

        // if the property value has a length of 0 (empty), don't display it
        if (property[1].length === 0) return;

        propertyListHTML =
          propertyListHTML +
          '<li class="product-details__item product-details__item--property">' +
          '<span class="product-details__property-label">' +
          property[0] +
          ": </span>" +
          property[1];
        ": " + "</li>";
      });

      return propertyListHTML;
    },
    _setCartQuantity: function (quantity) {
      this.$cartPopupCartQuantity =
        this.$cartPopupCartQuantity || $(this.selectors.cartPopupCartQuantity);
      var ariaLabel;

      if (quantity === 1) {
        ariaLabel = theme.strings.oneCartCount;
      } else if (quantity > 1) {
        ariaLabel = theme.strings.otherCartCount.replace("[count]", quantity);
      }

      this.$cartPopupCartQuantity.text(quantity).attr("aria-label", ariaLabel);
    },
    _setCartCountBubble: function (quantity) {
      this.$cartCountBubble =
        this.$cartCountBubble || $(this.selectors.cartCountBubble);
      this.$cartCount = this.$cartCount || $(this.selectors.cartCount);

      this.$cartCountBubble.removeClass(this.classes.hidden);
      this.$cartCount.text(quantity);
    },
    _showCartPopup: function () {
      this.$cartPopupWrapper
        .prepareTransition()
        .removeClass(theme.ProductCard.classes.cartPopupWrapperHidden);
      this._handleButtonLoadingState(false);

      slate.a11y.trapFocus({
        $container: this.$cartPopupWrapper,
        $elementToFocus: this.$cartPopup,
        namespace: "cartPopupFocus",
      });
    },
    _hideCartPopup: function (event) {
      var setFocus = event.detail === 0 ? true : false;
      this.$cartPopupWrapper
        .prepareTransition()
        .addClass(this.classes.cartPopupWrapperHidden);

      $(this.selectors.cartPopupImage).remove();
      this.$cartPopupImagePlaceholder.removeClass(this.classes.hidden);

      slate.a11y.removeTrapFocus({
        $container: this.$cartPopupWrapper,
        namespace: "cartPopupFocus",
      });

      if (setFocus) this.$previouslyFocusedElement[0].focus();

      this.$cartPopupWrapper.off("keyup");
      this.$cartPopupClose.off("click");
      this.$cartPopupDismiss.off("click");
      $("body").off("click");
    },
    _onBodyClick: function (event) {
      var $target = $(event.target);

      if (
        $target[0] !== this.$cartPopupWrapper[0] &&
        !$target.parents(this.selectors.cartPopup).length
      ) {
        this._hideCartPopup(event);
      }
    },
    _handleButtonLoadingState: function (isLoading) {
      if (isLoading) {
        this.$addToCart.attr("aria-disabled", true);
        this.$addToCartText.addClass(this.classes.hidden);
        this.$loader.removeClass(this.classes.hidden);

        this.$loaderStatus.attr("aria-hidden", false);
      } else {
        this.$addToCart.removeAttr("aria-disabled");
        this.$addToCartText.removeClass(this.classes.hidden);
        this.$loader.addClass(this.classes.hidden);

        this.$loaderStatus.attr("aria-hidden", true);
      }
    },
  });

  theme.ProductCard = new ProductCard();
};

/*================ HALO ADD ON =================*/

theme.HaloAddOn = (function () {
  function modal_open(modal, name) {
    var classes = {
      open: "open_" + name,
      openClass: "modal--is-active",
    };

    $(modal).fadeIn("fast");
    $(modal).addClass(classes.openClass);
    $("body").addClass(classes.open);
  }

  function modal_close(modal, name) {
    var classes = {
      open: "open_" + name,
      openClass: "modal--is-active",
    };

    $(modal).fadeOut("fast");
    $(modal).removeClass(classes.openClass);
    $("body").removeClass(classes.open);
  }

  return {
    init: function () {
      this.close_cookie_announcement();
      this.gdpr_cookie();
      this.someonePurchased();
      this.newsLetterPopup();
      this.progressBarShipping();
      this.beforeYouLeave();
      this.askAnExpert();
      this.recentlyViewed();
      this.changeImageVariant();
    },

    close_cookie_announcement: function () {
      var $announcement = $(".announcement-bar"),
        $announcement_close = $announcement.find(".close");

      if (!$announcement.length) {
        return;
      }

      if ($.cookie("anMessage") == "closed") {
        $announcement.remove();
      } else {
        $announcement.removeClass("hide");
      }

      $announcement.on("click", function (event) {
        event.preventDefault();
        $announcement.remove();

        $.cookie("anMessage", "closed", { expires: 1, path: "/" });
      });
    },

    gdpr_cookie: function () {
      var $gdpr = $("#gdpr"),
        $gdpr_close = $gdpr.find(".close"),
        $accept = $("[data-accept-cookie]"),
        $noexcept = $("[data-noexcept-cookie]");

      if (!$gdpr.length) {
        return;
      }

      if ($.cookie("gdprMessage") == "closed") {
        $gdpr.remove();
      } else {
        $gdpr.removeClass("hide");
      }

      $accept.on("click", function (event) {
        event.preventDefault();
        modal_close("#gdpr-modal", "gdpr-modal");
        $gdpr.remove();
        $.cookie("gdprMessage", "closed", { expires: 1, path: "/" });
        // if ($('.someone-purchased-modal').length) {
        //     $('.someone-purchased-modal').css('bottom', 0);
        // }
      });
    },

    toggleSomething: function () {
      var timeText = $(".product-notification .time-text span:visible").text();

      if ($(".product-notification").hasClass("active")) {
        $(".product-notification").removeClass("active");
      } else {
        var number = $(".data-product").length,
          i = Math.floor(Math.random() * number),
          images = $(".product-notification .data-product:eq(" + i + ")").data(
            "image"
          ),
          title = $(".product-notification .data-product:eq(" + i + ")").data(
            "title"
          ),
          url = $(".product-notification .data-product:eq(" + i + ")").data(
            "url"
          ),
          local = $(".product-notification .data-product:eq(" + i + ")").data(
            "local"
          );

        $(".product-notification").addClass("active");
        $(".product-notification .product-image")
          .find("img")
          .attr("src", images);
        $(".product-notification .product-name").attr("href", url);
        $(".product-notification .product-name").text(title);
        $(".product-notification .product-image").attr("href", url);
        $(".product-notification .time-text").text(local);
      }
    },

    someonePurchased: function () {
      var $someonePurchased = $("#someone-purchased-modal"),
        $Close = $someonePurchased.find(".close");
      $product = $someonePurchased.find(".product-notification");
      $rotateSpeed = $someonePurchased
        .find(".product-notification")
        .data("time");

      if (!$someonePurchased.length) {
        return;
      }

      if ($.cookie("someonePurchasedMessage") == "closed") {
        $product.remove();
      }

      $Close.on("click", function (event) {
        event.preventDefault();
        $product.remove();
        $.cookie("someonePurchasedMessage", "closed", {
          expires: 1,
          path: "/",
        });
      });

      setTimeout(function () {
        var timer = setInterval(function () {
          theme.HaloAddOn.toggleSomething();
        }, $rotateSpeed);
      }, $rotateSpeed);
    },

    progressBarShipping: function () {
      if ($(".cart__progress_bar.hide").length) {
        $(this).removeClass("hide");
      }
      if ($(".cart__progress_bar").length) {
        var $priceFreeShip = parseInt(theme.strings.priceFreeShipping) * 100;
        $.getJSON(window.router + "/cart.js").then(function (cart) {
          var $cartTotalPrice = cart.total_price,
            $differencePrice = $priceFreeShip - $cartTotalPrice,
            $percent = Math.floor(($cartTotalPrice * 100) / $priceFreeShip);

          if ($percent > 100) $percent = 100;

          if ($percent == 100) {
            var progress =
              '<div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width:' +
              $percent +
              '%" aria-valuenow="' +
              $percent +
              '" aria-valuemin="0" aria-valuemax="100">' +
              $percent +
              '%</div></div><span class="percent">' +
              $percent +
              "%</span>";
            $(".progress_bar_shipping").addClass("success");
            $(".progress_bar_shipping").html(progress);
            $(".progress_bar_shipping_message").html(
              theme.strings.freeShipping
            );
          } else {
            if ($percent < 50) {
              var progress =
                '<div class="progress"><div class="progress-bar progress-bar-striped bg-danger progress-bar-animated" role="progressbar" style="width:' +
                $percent +
                '%" aria-valuenow="' +
                $percent +
                '" aria-valuemin="0" aria-valuemax="100">' +
                $percent +
                '%</div></div><span class="percent">' +
                $percent +
                "%</span>";
            } else {
              var progress =
                '<div class="progress"><div class="progress-bar progress-bar-striped bg-warning progress-bar-animated" role="progressbar" style="width:' +
                $percent +
                '%" aria-valuenow="' +
                $percent +
                '" aria-valuemin="0" aria-valuemax="100">' +
                $percent +
                '%</div></div><span class="percent">' +
                $percent +
                "%</span>";
            }
            var $price = theme.Currency.formatMoney(
              $differencePrice,
              theme.moneyFormat
            );
            $(".progress_bar_shipping").removeClass("success");
            $(".progress_bar_shipping").html(progress);
            $(".progress_bar_shipping_message").html(
              theme.strings.shippingMessage.replace("[price]", $price)
            );
          }

          if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
            Currency.convertAll(
              window.shop_currency,
              $("#currencies .active").attr("data-currency"),
              "span.money",
              "money_format"
            );
          }
        });
      }
    },

    newsLetterPopup: function () {
      var $newsLetter = $("#popup_newsletter"),
        $Close = $newsLetter.find(".close"),
        $newsLetterContent = $newsLetter.find(".modal-newsletter"),
        $delay = parseInt($newsLetterContent.data("delay")),
        $expire = parseInt($newsLetterContent.data("expire"));

      if (!$newsLetter.length) {
        return;
      }

      if ($.cookie("newsLetterPopup") == "closed") {
        // modal_close("#popup_newsletter", 'popup_newsletter');
      } else {
        if (
          window.location.href.indexOf("newsletter&form_type=customer") > -1
        ) {
          $(".newsletter--form .form-message--error").show();
        } else {
          $(".newsletter--form .form-message--error").hide();
        }

        setTimeout(function () {
          modal_open("#popup_newsletter", "popup_newsletter");
        }, $delay);
      }

      $Close.on("click", function (event) {
        event.preventDefault();
        modal_close("#popup_newsletter", "popup_newsletter");
        var $inputChecked = $newsLetter
          .find('input[name="dismiss"]')
          .prop("checked");
        if ($inputChecked || !$newsLetter.find('input[name="dismiss"]').length)
          $.cookie("newsLetterPopup", "closed", {
            expires: $expire,
            path: "/",
          });
      });

      $newsLetter.on("click", function (event) {
        if (
          $newsLetter.hasClass("modal--is-active") &&
          $(event.target).closest($newsLetterContent).length === 0
        ) {
          event.preventDefault();
          modal_close("#popup_newsletter", "popup_newsletter");
        }
      });
    },

    editCartPopup: function () {
      var $editCart = "#cart-edit-modal",
        $Close = $($editCart).find(".close"),
        $editCartContent = $($editCart).find(".cart-edit-modal");

      if (!$($editCart).length) {
        return;
      }

      modal_open($editCart, "popup_editCart");

      $Close.on("click", function (event) {
        event.preventDefault();
        modal_close($editCart, "popup_editCart");
      });

      $($editCart).on("click", function (event) {
        if (
          $($editCart).hasClass("modal--is-active") &&
          $(event.target).closest($editCartContent).length === 0
        ) {
          event.preventDefault();
          modal_close($editCart, "popup_editCart");
        }
      });
    },

    videoPopup: function () {
      var $videoModal = "#video-modal",
        $Close = $($videoModal).find(".close"),
        $videoModalContent = $($videoModal).find(".modal-content");

      if (!$($videoModal).length) {
        return;
      }

      modal_open($videoModal, "popup_video");

      $Close.on("click", function (event) {
        event.preventDefault();
        modal_close($videoModal, "popup_video");
      });

      $($videoModal).on("click", function (event) {
        if (
          $($videoModal).hasClass("modal--is-active") &&
          $(event.target).closest($videoModalContent).length === 0
        ) {
          event.preventDefault();
          modal_close($videoModal, "popup_video");
        }
      });
    },

    sizeChartPopup: function () {
      var $sizeChartModal = "#sizeChart-modal",
        $Close = $($sizeChartModal).find(".close"),
        $sizeChartModalContent = $($sizeChartModal).find(".modal-content");

      if (!$($sizeChartModal).length) {
        return;
      }

      modal_open($sizeChartModal, "popup_sizeChart");

      $Close.on("click", function (event) {
        event.preventDefault();
        modal_close($sizeChartModal, "popup_sizeChart");
      });

      $($sizeChartModal).on("click", function (event) {
        if (
          $($sizeChartModal).hasClass("modal--is-active") &&
          $(event.target).closest($sizeChartModalContent).length === 0
        ) {
          event.preventDefault();
          modal_close($sizeChartModal, "popup_sizeChart");
        }
      });
    },

    compareColorPopup: function () {
      var $compareColorModal = "#compareColor-modal",
        $Close = $($compareColorModal).find(".close"),
        $compareColorModalContent =
          $($compareColorModal).find(".modal-content");

      if (!$($compareColorModal).length) {
        return;
      }

      modal_open($compareColorModal, "popup_compareColor");

      $Close.on("click", function (event) {
        event.preventDefault();
        modal_close($compareColorModal, "popup_compareColor");
      });

      $($compareColorModal).on("click", function (event) {
        if (
          $($compareColorModal).hasClass("modal--is-active") &&
          $(event.target).closest($compareColorModalContent).length === 0
        ) {
          event.preventDefault();
          modal_close($compareColorModal, "popup_compareColor");
        }
      });
    },

    productQuickviewPopup: function () {
      var $productQuickviewPopup = "#product-quickview",
        $Close = $($productQuickviewPopup).find(".close"),
        $productQuickviewPopupContent = $($productQuickviewPopup).find(
          ".modal-content"
        );

      if (!$($productQuickviewPopup).length) {
        return;
      }
      modal_open($productQuickviewPopup, "popup_productQuickview");

      $Close.on("click", function (event) {
        event.preventDefault();
        modal_close($productQuickviewPopup, "popup_productQuickview");
        $productQuickviewPopupContent.find(".modal-body").html("");
      });

      $($productQuickviewPopup).on("click", function (event) {
        if (
          $($productQuickviewPopup).hasClass("modal--is-active") &&
          $(event.target).closest($productQuickviewPopupContent).length === 0
        ) {
          event.preventDefault();
          modal_close($productQuickviewPopup, "popup_productQuickview");
          $productQuickviewPopupContent.find(".modal-body").html("");
        }
      });
    },

    removeProductQuickviewPopup: function () {
      var $productQuickviewPopup = "#product-quickview",
        $productQuickviewPopupContent = $($productQuickviewPopup).find(
          ".modal-content"
        );
      modal_close($productQuickviewPopup, "popup_productQuickview");
      $productQuickviewPopupContent.find(".modal-body").html("");
    },

    productComparePopup: function () {
      var $productCompare = "#product-compare-modal",
        $Close = $($productCompare).find(".close"),
        $productCompareContent = $($productCompare).find(".modal-content");

      if (!$($productCompare).length) {
        return;
      }

      modal_open($productCompare, "popup_productCompare");

      $Close.on("click", function (event) {
        event.preventDefault();
        modal_close($productCompare, "popup_productCompare");
      });

      $($productCompare).on("click", function (event) {
        if (
          $($productCompare).hasClass("modal--is-active") &&
          $(event.target).closest($productCompareContent).length === 0
        ) {
          event.preventDefault();
          modal_close($productCompare, "popup_productCompare");
        }
      });
    },

    loadingPopup: function () {
      var $loading = "#loading-modal";
      modal_open($loading, "popup_loading");
    },

    removeLoadingPopup: function () {
      var $loading = "#loading-modal";
      modal_close($loading, "popup_loading");
    },

    beforeYouLeave: function () {
      var $beforeYouLeave = "#before-you-leave",
        $beforeYouLeave_close = $($beforeYouLeave).find(".close"),
        $beforeYouLeave_close2 = $($beforeYouLeave).find(
          ".before-you-leave__bg .btn"
        ),
        $beforeYouLeave_search = $($beforeYouLeave).find(".search"),
        $beforeYouLeave_time = $($beforeYouLeave)
          .find(".before-you-leave__wrapper")
          .data("time");

      if (!$($beforeYouLeave).length) {
        return;
      }

      var idleTime = 0;

      $(document).ready(function () {
        var idleInterval = setInterval(timerIncrement, $beforeYouLeave_time);
      });

      $(document)
        .on("mousemove", resetTimer)
        .on("keydown", resetTimer)
        .on("scroll", resetTimer);

      function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime >= 1 && !$("body.open_beforeYouLeave").length) {
          $("body").addClass("open_beforeYouLeave");
        }
        $(window).unbind("click");
      }

      function resetTimer() {
        idleTime = 0;
      }

      $beforeYouLeave_close2.on("click", function (event) {
        event.preventDefault();
        $("body").removeClass("open_beforeYouLeave");
      });

      $(document).on("click", function (event) {
        if (
          $("body").hasClass("open_beforeYouLeave") &&
          $(event.target).closest($beforeYouLeave).length === 0 &&
          $(event.target).closest(".search-form-wrapper").length === 0
        ) {
          $("body").removeClass("open_beforeYouLeave");
        }
      });
    },

    askAnExpert: function () {
      var $Open = $(".ask-an-expert__link"),
        $askModal = "#askAnExpert-modal",
        $Close = $($askModal).find(".close"),
        $askModalContent = $($askModal).find(".modal-content");

      if (!$($askModal).length) {
        return;
      }

      $Open.on("click", function (event) {
        event.preventDefault();
        modal_open($askModal, "popup_askModal");
      });

      $Close.on("click", function (event) {
        event.preventDefault();
        modal_close($askModal, "popup_askModal");
      });

      $($askModal).on("click", function (event) {
        if (
          $($askModal).hasClass("modal--is-active") &&
          $(event.target).closest($askModalContent).length === 0
        ) {
          event.preventDefault();
          modal_close($askModal, "popup_askModal");
        }
      });
    },

    backToTop: function () {
      $("body,html").animate(
        {
          scrollTop: 0,
        },
        1500
      );
    },

    recentlyViewed: function () {
      if (!$(".lst-seen-widget").length) return;

      var $lst_seen_widget = $(".lst-seen-widget"),
        $wrap_icons = $(".wrap-icons");

      if ($(window).width() < 768) {
        $lst_seen_widget.removeClass("is-show-widget");
        $wrap_icons.addClass("collapsed");
      } else {
        $lst_seen_widget.addClass("is-show-widget");
        $wrap_icons.removeClass("collapsed");
      }

      $(document).on("click", ".lst-seen-widget .collapse-icon", function () {
        $lst_seen_widget.removeClass("is-show-widget");
        $wrap_icons.addClass("collapsed");
      });

      $(document).on("click", ".wrap-icons .expand", function () {
        $lst_seen_widget.addClass("is-show-widget");
        $wrap_icons.removeClass("collapsed");
      });

      $(document).on("click", ".backtoTop", function () {
        theme.HaloAddOn.backToTop();
      });

      $("#recently-viewed-products-list").on(
        "mouseenter",
        ".slick-slide",
        function (e) {
          e.preventDefault();
          var $currTarget = $(e.currentTarget),
            index = $currTarget.index(
              "#recently-viewed-products-list .slick-active"
            ),
            margin_top =
              index *
              $("#recently-viewed-products-list .product-info").outerHeight();

          $("#recently-viewed-products-list .product-info")
            .html($(this).find(".second-info").html())
            .css("margin-top", margin_top)
            .show();
        }
      );

      $("#recently-viewed-products-list").on(
        "mouseenter",
        ".slick-arrow",
        function (e) {
          $("#recently-viewed-products-list .product-info").hide();
        }
      );
    },

    changeImageVariant: function () {
      if (!$(".product-card__variant").length) {
        return;
      }

      $(document).on(
        "click",
        ".product-card__variant .product-card__variant--item label",
        function () {
          var self = $(this),
            $product = self.parents(".product-card"),
            $variantImage = self.data("image");

          $product
            .find(".product-card__variant--item label")
            .removeClass("active");
          self.addClass("active");

          $product
            .find(".product-card__link")
            .removeClass("product-card__switchImage");
          if ($variantImage != "") {
            $product.find(".product-card__img").attr("srcset", $variantImage);
          }
        }
      );
    },

    checkNeedToConvertCurrency: function () {
      return (
        (window.show_multiple_currencies &&
          Currency.currentCurrency != shopCurrency) ||
        window.show_auto_currency
      );
    },
  };
})();

theme.ChangePositionProductDetail = (function () {
  function changePositiontab() {}

  function changePositionProduct() {}

  return {
    init: function () {
      changePositiontab();
      changePositionProduct();
    },
  };
})();

$(document).ready(function () {
  var sections = new theme.Sections();

  sections.register("cart-template", theme.Cart);
  sections.register("product", theme.Product);
  sections.register("product-template", theme.Product);
  sections.register("header", theme.HeaderSection);
  sections.register("footer", theme.FooterSection);
  sections.register("map", theme.Maps);
  sections.register("hero", theme.HeroSection);
  sections.register("slideshow", theme.Slideshow);
  sections.register("instagram", theme.Instagram);
  sections.register("product-list", theme.ProductListSection);
  sections.register("collection-template", theme.Collection);
  sections.register("lookbook-template", theme.Lookbook);
  sections.register("product-recommendations", theme.ProductRecommendations);

  theme.ProductCard();
  theme.Filters.init();
  theme.ProductWishlist.init();
  theme.ProductQuickView.init();
  theme.ProductCompare.init();
  theme.HaloAddOn.init();
  theme.Slick.init();
  theme.Sidebar.init();
  theme.HeaderFooter_mobile.init();

  $(window).resize(function () {
    theme.Slick.init();
    theme.HeaderFooter_mobile.init();
  });
});

theme.init = function () {
  theme.customerTemplates.init();

  // Theme-specific selectors to make tables scrollable
  var tableSelectors = ".rte table," + ".custom__item-inner--html table";

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: "scrollable-wrapper",
  });

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $(".in-page-link").on("click", function (evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on("click", function (evt) {
    evt.preventDefault();
  });

  slate.a11y.accessibleLinks({
    messages: {
      newWindow: theme.strings.newWindow,
      external: theme.strings.external,
      newWindowExternal: theme.strings.newWindowExternal,
    },
    $links: $("a[href]:not([aria-describedby], .product-single__thumbnail)"),
  });

  theme.FormStatus.init();

  var selectors = {
    image: "[data-image]",
    imagePlaceholder: "[data-image-placeholder]",
    imageWithPlaceholderWrapper: "[data-image-with-placeholder-wrapper]",
    lazyloaded: ".lazyloaded",
  };

  var classes = {
    hidden: "hide",
  };

  $(document).on("lazyloaded", function (e) {
    var $target = $(e.target);

    if ($target.data("bgset")) {
      var $image = $target.find(selectors.lazyloaded);
      if ($image) {
        if ($target.data("bg")) {
          $image.attr("src", $target.data("bg"));
        }
        if ($target.data("alt")) {
          $image.attr("alt", $target.data("alt"));
        }
      }
    }

    if (!$target.is(selectors.image)) {
      return;
    }

    $target
      .closest(selectors.imageWithPlaceholderWrapper)
      .find(selectors.imagePlaceholder)
      .addClass(classes.hidden);
  });

  // When the theme loads, lazysizes might load images before the "lazyloaded"
  // event listener has been attached. When this happens, the following function
  // hides the loading placeholders.
  function onLoadHideLazysizesAnimation() {
    $(selectors.image + ".lazyloaded")
      .closest(selectors.imageWithPlaceholderWrapper)
      .find(selectors.imagePlaceholder)
      .addClass(classes.hidden);
  }

  onLoadHideLazysizesAnimation();

  // Do the injection svg
  var mySVGsToInject = document.querySelectorAll("svg[data-src]");

  SVGInjector(mySVGsToInject);
};

$(theme.init);
