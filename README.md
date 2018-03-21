# Explanation
This is forked from https://github.com/RobCannon/jquery-uitablefilter in order to:

* add ability to specify a callback for getting text from an element (default is to use element.text())
* updated function to be able to pass in an "opts" dictionary instead of each option individually
* fixed bugs (determining if column option was given, using size attribute which doesn't exist, getting last element of array)
* fixed syntax issues (using == instead of ===, missing semicolons, that sort of thing)

# Original script
https://github.com/gregwebs/jquery-uitablefilter

## What's new ?
With this version comes the ability to pass in a function to call to retrieve text from HTML objects in the table. By default, 
the jQuery text() function is used. This callback function can be used to get text from objects that don't support text(). For example,
getting the text of the current selection from a menu (\<select\>) doesn't work with text() (you need to get the text from the selected menu option).

In addition, instead of having to specify each option in the uiTableFilter() function call, an "opts" dictionary is passed in containing
only those options that are set.

## Download
Download the latest version here : https://raw.github.com/optimal-outsource/jquery-uitablefilter/master/jquery.uitablefilter.js

## Example
Here is an example (see the original project README for more information). It will search for the word 'Pepper' in #table in columns 'Price', 'Item' and 'ID'.
```
$.uiTableFilter(
    $("#table"), 
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

$.uiTableFilter(
    $("#table"),
    "Pepper",
    {
        "getTextCallback": myGetText
    }
)
```
