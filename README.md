# Haven Planner

This is going to be a simple planner for looking up what gildings you could use based on the item you're trying to gild


> [!WARNING]
> By the nature of how I made this tool to be as simple as possible it is bound to become outdated and have old information, I'll happily update the data if it is brought to my attention, if you find any data that doesn't match the wiki contact me and I'll update it as soon as possible

By the nature of me wanting to do this

## Features

- Looking up gear per slot
- Looking up possible gildings that align with the selected base item affinity
- All gear shows the bonus it gives to stats 
- All gear that have armor will show it's HP, ABS X and ABS Y

## Planed features

- Creating, saving, importing and exporting item and gilding presets
- Showing the gilding minimum and maximum percentage for a second slot calculation for the base item and gild selected
- Adding data samples for quality of the items and what you should expect by making the item at a certain quality
- Adding icons to replace the text for all of the attributes and abilities to make it easier to read

## How I got the data and set it up

I made this by web scraping extracting the data from the from the wiki using Chrome's console  and JavaScript to script the data extraction 

The application has two datasets hardcoded into it, as such changes to the game will require a rerun of the scraping scripts and replacements of the data inside of the [code.js](/code.js) file.

### How to update the data

#### Requirements

Download and install Node V20.12.1 on your machine

#### Requirements

```
Step 1: Clone this repository
- git clone https://github.com/joaoschoen/Haven-Planer.git

Step 2: Install dependencies:
- npm install

Step 3: run the scraping algorithm
- npm run scraping

Step 4: commit the changes to your branch
- git add --all 
```

The scraping algorithm will then read all the data from the wiki and update the arrays in the [code.js](./code.js) file, 