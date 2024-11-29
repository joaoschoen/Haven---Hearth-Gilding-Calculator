// visit and run the script https://ringofbrodgar.com/wiki/Gilding
let tables = document.getElementsByTagName("tbody")
let items = []
for (let i = 1; i < tables.length; i++) {
    let tbody = tables[i].children
    for (let j = 0; j < tbody.length; j++) {
        let el = tbody[j].children
        let item = {}
        item.name = el[0].childNodes[0].innerHTML
        item.link = el[0].childNodes[0].href
    
        item.icon = el[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].src
    
        item.chance_min = (el[2].innerHTML).split("-")[0]
        item.chance_max = (el[2].innerHTML).split("-")[1]
    
        item.gild_1 = el[3].innerHTML
        item.gild_2 = el[4].innerHTML
        item.gild_3 = el[5].innerHTML
        item.gild_4 = el[6].innerHTML
    
        item.affinity = (el[7].innerHTML).split("<br>")

        // the last table is the gemstones table, so we're using the i index variable to set the flag
        item.isGemstone = (i == tables.length -1)
        items.push(item)
    }    
}
console.log(items)