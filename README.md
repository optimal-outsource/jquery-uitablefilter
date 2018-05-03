# Explanation
This is forked from https://github.com/RobCannon/jquery-uitablefilter in order to:

* add ability to specify a callback for getting text from an element (default is to use element.text())
* updated function to be able to pass in an "opts" dictionary instead of each option individually
* fix bugs (determining if column option was given, using size attribute which doesn't exist, getting last element of array)
* fix syntax issues (using == instead of ===, missing semicolons, that sort of thing)
* add ability to specify filter function and arguments
* have more than one instance per page

# Original script
https://github.com/gregwebs/jquery-uitablefilter

## What's new ?
With this version comes the ability to pass in a function to call to retrieve text from HTML objects in the table. By default, 
the jQuery text() function is used. This callback function can be used to get text from objects that don't support text(). For example,
getting the text of the current selection from a menu (\<select\>) doesn't work with text() (you need to get the text from the selected menu option).

In addition, instead of having to specify each option in the uiTableFilter() function call, an "opts" dictionary is passed in containing
only those options that are set.

Also in this version is the ability to specify your own filter function. If not specified, the default
filtering function will be used. If the filter returns _true_, that element is included. If the
filter returns _false_, that element is excluded.

The plugin was refactored so that it is now possible to have more than one instance of this plugin
on an HTML page. As a result, the calling convention has changed from previous versions (see examples
below).

## Download
Download the latest version here : https://raw.github.com/optimal-outsource/jquery-uitablefilter/master/jquery.uitablefilter.js

## Example
Here is an example (see the original project README for more information). It will search for the word 'Pepper' in #table in columns 'Price', 'Item' and 'ID'.
```
$("#table").uiTableFilter(
    "Pepper",
    {
        "column": ["Price", "Item", "ID"]
    }
);
```

Here is another example showing how to retrieve text using your own function.
```
function myGetText(elem) {
    // Return text from a <select> drop down menu
    return elem.find("option:selected").text().trim();
}

$("#table").uiTableFilter(
    "Pepper",
    {
        "getTextCallback": myGetText
    }
)
```

Finally, here is an example to filter table rows based on the price in the 'Amount Due' column. The
filtering is done using min/max values instead of just matching a single value.
```
function amtDueFilter(value, min, max) {
    // Element values come in as $<value>, so remove the dollar sign ($) and convert to floating point
    value = parseFloat(value.substring(1));
    return value >= min && value <= max;
}

$("#table").uiTableFilter(
    minValue,
    {
        "column": ["Amount Due"],
        "filterFunction": amtDueFilter,
        "filterFunctionArgs": maxValue
    }
)
```

