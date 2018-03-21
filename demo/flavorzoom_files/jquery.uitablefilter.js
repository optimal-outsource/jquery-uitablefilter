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

    $.uiTableFilter = function(jq, phrase, opts) {
        options = $.extend(options, opts || {});

        var new_hidden = false;
        if( this.last_phrase === phrase ) return false;

        var phrase_length = phrase.length;
        var words = phrase.toLowerCase().split(" ");

        // these function pointers may change
        var matches = function(elem) { elem.show() };
        var noMatch = function(elem) { elem.hide(); new_hidden = true };
        var getText = (options["getTextCallback"]) ? function(elem) { return options["getTextCallback"](elem) }
                                                   : function(elem) { return elem.text() };

        if( options["column"].length )
        {
            if (!$.isArray(options["column"]))
            {
                options["column"] = new Array(options["column"]);
            }

            var index = [];

            jq.find("thead > tr:last > th").each(function(i)
            {
                for (var j = 0; j < options["column"].length; j++)
                {
                    if ($.trim($(this).text()) === options["column"][j])
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

                if (options["getTextCallback"] === null)
                {
                    return $(elem.find((selector))).text();
                }
                else
                {
                    return options["getTextCallback"]($(elem.find((selector))));
                }
            }
        }

        // if added one letter to last time,
        // just check newest word and only need to hide
        if( (words.length > 1) && (phrase.substr(0, phrase_length - 1) === this.last_phrase) ) {
            if( phrase[phrase_length - 1] === " " )
            { this.last_phrase = phrase; return false; }

            words = words[words.length - 1]; // just search for the newest word

            // only hide visible rows
            matches = function(elem) {};
            var elems = jq.find("tbody:first > tr:visible");
        }
        else {
            new_hidden = true;
            elems = jq.find("tbody:first > tr");
        }

        elems.each(function(){
            var elem = $(this);
            $.uiTableFilter.has_words( getText(elem), words, false ) ?
                matches(elem) : noMatch(elem);
        });

        this.last_phrase = phrase;
        if( options["ifHidden"] && new_hidden ) options["ifHidden"]();
        return jq;
    };

    // caching for speedup
    $.uiTableFilter.last_phrase = "";

    // not jQuery dependent
    // "" [""] -> Boolean
    // "" [""] Boolean -> Boolean
    $.uiTableFilter.has_words = function( str, words, caseSensitive )
    {
        var text = caseSensitive ? str : str.toLowerCase();
        for (var i=0; i < words.length; i++) {
            if (text.indexOf(words[i]) === -1) return false;
        }
        return true;
    }
}) (jQuery);
