// visit the following link and run the script https://ringofbrodgar.com/wiki/Tables/Gildable_Equipment
clear()
let tables = document.getElementsByTagName("tbody")
let items = []
for (let i = 0; i < tables.length; i++) {
    let tbody = tables[i].children
    for (let j = 0; j < tbody.length; j++) {
        let el = tbody[j].children
        let item = {}
    
        item.icon = el[0].childNodes[0].childNodes[0].src

        item.name = el[0].childNodes[2].innerHTML
        item.link = el[0].childNodes[2].href
    
        let affinity = []
        for (let i = 0; i < el[1].childNodes.length; i+=2) {
            affinity.push(el[1].childNodes[i].innerHTML)
        }
        item.affinity = affinity
    
        item.chance_min = (el[2].innerHTML).split("-")[0]
        item.chance_max = (el[2].innerHTML).split("-")[1]

        item.slots = el[3].innerText.split("\n")[0].split(";")
        for (let i = 0; i < item.slots.length; i++) {
            item.slots[i] = item.slots[i].trim()            
        }
        
        items.push(item)
    }    
}
console.log(items)