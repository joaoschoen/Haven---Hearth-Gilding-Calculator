# Haven Gild Planner

This is going to be a simple planner for looking up what gildings you could use based on the item you're trying to gild


> [!WARNING]
> By the nature of how I made this tool to be as simple as possible it is bound to become outdated and have old information, I'll happily update the data if it is brought to my attention, if you find any data that doesn't match the wiki contact me and I'll update it as soon as possible

By the nature of me wanting to do this

## Features

- Looking up gear per slot
- Looking up possible gildings that align with the selected base item affinity

## Planed features

- Creating, saving, importing and exporting item and gilding presets
- Showing the gilding minimum and maximum percentage for a second slot calculation for the base item and gild selected
- Showing the inherit bonus that some equipments have like +1 agi for a nettle shirt
- Adding non-gildable items to the planner
- Adding data samples for quality of the items and what you should expect by making the item at a certain quality
- Adding icons to replace the text for all of the attributes and abilities to make it easier to read

## How I got the data and set it up

I made this by web scraping extracting the data from the from the wiki using Chrome's console  and JavaScript to script the data extraction 

The application has two datasets hardcoded into it, as such changes to the game will require a rerun of the scraping scripts and replacements of the data inside of the [code.js](/code.js) file.

### How to update the data

Extracted from the [Gildings](https://ringofbrodgar.com/wiki/Gilding) table using the script inside [gildings.js](/gildings.js)

To update this data:
- On your browser, open up the [Gildings](https://ringofbrodgar.com/wiki/Gilding) website
- Open the developer tools and go to the console
- Paste the whole script inside [gildings.js](/gildings.js) on the console and run it, the script will spew out an array containing all of the data
- Right click the array on the console and press "Copy object"
- On a text editor open the [code.js](/code.js) file
- Replace the value of the var gildings with the object copied

You can do the same process cited above for the [Gildable equipment](https://ringofbrodgar.com/wiki/Tables/Gildable_Equipment) page using the [gildables.js](/gildables.js) script
