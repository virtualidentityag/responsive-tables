/**
 * @name          responsive tables
 * @version       1.0
 * @lastmodified  2015-11-27
 * @package       html-css-js
 * @subpackage    jQuery plugin
 * @author        JR, VI
 *
 * based on: http://jqueryboilerplate.com/
 */

;(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'responsiveTables',
      defaults = {
        responsiveTableBreakpoint: 1024
      };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this.switched = false;

    this.init();
  }

  // methods
  var methods = {
    init: function () {
      var self = this;

      $(window).load(function() {
        self.updateTables();
      });
      $(window).on("redraw", function () {
        self.switched = false;
        self.updateTables();
      });
      $(window).on("resize", function(){
        self.updateTables()
      });
    },
    updateTables: function () {
      var self = this;

      if ((self.getWindowWidth() < self.options.responsiveTableBreakpoint) && !self.switched) {
        self.switched = true;
        self.splitTable(this.$element);
        return true;
      }
      else if (self.switched && (this.getWindowWidth() > self.options.responsiveTableBreakpoint)) {
        self.switched = false;
        self.unsplitTable(self.$element);
      }
    },
    splitTable: function (original) {
      original.wrap("<div class='table-wrapper' />");

      var copy = original.clone();
      copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
      copy.removeClass("responsive");

      original.closest(".table-wrapper").append(copy);
      copy.wrap("<div class='pinned' />");
      original.wrap("<div class='scrollable' />");

      this.setCellHeights(original, copy);
    },
    unsplitTable: function (original) {
      original.closest(".table-wrapper").find(".pinned").remove();
      original.unwrap();
      original.unwrap();
    },
    setCellHeights: function (original, copy) {
      var tr = original.find('tr'),
          tr_copy = copy.find('tr'),
          heights = [];

      tr.each(function (index) {
        var self = $(this),
            tx = self.find('th, td');

        tx.each(function () {
          var height = $(this).outerHeight(true);
          heights[index] = heights[index] || 0;
          if (height > heights[index]) heights[index] = height;
        });

      });

      tr_copy.each(function (index) {
        $(this).height(heights[index]);
      });
    },
    getWindowWidth: function () {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
  };

  // build
  $.extend(Plugin.prototype, methods);

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });

    return this;
  };

})(jQuery, window, document);
