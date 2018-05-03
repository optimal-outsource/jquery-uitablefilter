/*
 * Copyright (c) 2008 Greg Weber greg at gregweber.info
 * Dual licensed under the MIT and GPLv2 licenses just as jQuery is:
 * http://jquery.org/license
 *
 * Multi-columns fork by natinusala 
 *
 * NPM support fork by RobCannon
 *
 * getText callback fork by optimal-outsource
 *
 * documentation at http://gregweber.info/projects/uitablefilter
 *                  https://github.com/natinusala/jquery-uitablefilter
 *                  https://github.com/RobCannon/jquery-uitablefilter
 *                  https://github.com/optimal-outsource/jquery-uitablefilter
 *
 * allows table rows to be filtered (made invisible)
 * <code>
 * t = $('table')
 * $.uiTableFilter( t, phrase )
 * </code>
 * arguments:
 *   jQuery object containing table rows
 *   phrase to search for
 *   optional arguments:
 *      opts - dictionary of optional arguments:
 *          column          - array of columns to limit search too (the column title in the table header)
 *          getTextCallback - function to retrieve text from element
 *          ifHidden        - callback to execute if one or more elements was hidden
 */
(function($) {
    var options = {
        column: [],
        getTextCallback: null,
        ifHidden: null
    };

    function _uiTableFilter(jq, phrase, opts) {
        var $this = this;

        $this.options = $.extend({}, options, opts || {});

        $this.new_hidden = false;

        // If using our own filter function and the phrase didn't change, just return since nothing's changed
        if( $this.last_phrase === phrase && !("filterFunction" in $this.options) ) return false;

        // these function pointers may change
        var matches = function(elem) { elem.show() };
        var noMatch = function(elem) { elem.hide(); $this.new_hidden = true };
        var getText = ($this.options["getTextCallback"]) ? function(elem) { return $this.options["getTextCallback"](elem) }
                                                         : function(elem) { return elem.text() };

        if( $this.options["column"].length )
        {
            if (!$.isArray($this.options["column"]))
            {
                $this.options["column"] = new Array($this.options["column"]);
            }

            var index = [];

            jq.find("thead > tr:last > th").each(function(i)
            {
                for (var j = 0; j < $this.options["column"].length; j++)
                {
                    if ($.trim($(this).text()) === $this.options["column"][j])
                    {
                        index[j] = i;
                        break;
                    }
                }

            });

            getText = function(elem) {
                var selector = "";
                for (var i = 0; i < index.length; i++)
                {
                    if (i !== 0) {selector += ",";}
                    selector += "td:eq(" + index[i] + ")";
                }

                if ($this.options["getTextCallback"] === null)
                {
                    return $(elem.find((selector))).text();
                }
                else
                {
                    return $this.options["getTextCallback"]($(elem.find((selector))));
                }
            }
        }

        if ("filterFunction" in $this.options) {
            var args = ("filterFunctionArgs" in $this.options) ? $this.options["filterFunctionArgs"] : null;

            jq.find("tbody:first > tr").each(function () {
                var elem = $(this);
                $this.options["filterFunction"](getText(elem).trim(), phrase, args) ? matches(elem) : noMatch(elem);
            });
        } else {
            var phrase_length = phrase.length;
            var words = phrase.toLowerCase().split(" ");

            // if added one letter to last time,
            // just check newest word and only need to hide
            if ((words.length > 1) && (phrase.substr(0, phrase_length - 1) === $this.last_phrase)) {
                if (phrase[phrase_length - 1] === " ") {
                    $this.last_phrase = phrase;
                    return false;
                }

                words = words[words.length - 1]; // just search for the newest word

                // only hide visible rows
                matches = function (elem) {
                };
                var elems = jq.find("tbody:first > tr:visible");
            }
            else {
                $this.new_hidden = true;
                elems = jq.find("tbody:first > tr");
            }

            elems.each(function () {
                var elem = $(this);
                $this.has_words(getText(elem), words, false) ? matches(elem) : noMatch(elem);
            });
        }

        $this.last_phrase = phrase;
        if( $this.options["ifHidden"] && $this.new_hidden ) $this.options["ifHidden"]();

        return this;
    }

    // caching for speedup
    _uiTableFilter.prototype.last_phrase = "";

    // not jQuery dependent
    // "" [""] -> Boolean
    // "" [""] Boolean -> Boolean
    _uiTableFilter.prototype.has_words = function( str, words, caseSensitive )
    {
        var text = caseSensitive ? str : str.toLowerCase();
        for (var i=0; i < words.length; i++) {
            if (text.indexOf(words[i]) === -1) return false;
        }
        return true;
    };

    if (typeof $.uiTableFilter !== "function") {
        $.fn.uiTableFilter = function(phrase, opts) {
            this.each(function() {
                new _uiTableFilter($(this), phrase, opts);
            });
            return this;
        }
    } else {
        return this;
    }
}) (jQuery);
