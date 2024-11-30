let tables = document.getElementsByTagName("tbody")
let equip_table = tables[tables.length -1].children
// loop through equip table
let items = []
for (let i = 0; i < equip_table.length; i++) {
    let el = equip_table[i]    
    // console.log(el)
    
    let item = {}
    
    item.link = el.childNodes[0].childNodes[0].href
    item.name = el.childNodes[0].childNodes[0].title
    
    item.slot = el.childNodes[1].innerText
    
    item.bonus = {}
    if(el.childNodes[2].innerText != ""){
        item.bonus.str = el.childNodes[2].innerText
    }
    if(el.childNodes[3].innerText != ""){
        item.bonus.agi = el.childNodes[3].innerText
    }
    if(el.childNodes[4].innerText != ""){
        item.bonus.int = el.childNodes[4].innerText
    }
    if(el.childNodes[5].innerText != ""){
        item.bonus.con = el.childNodes[5].innerText
    }
    if(el.childNodes[6].innerText != ""){
        item.bonus.per = el.childNodes[6].innerText
    }
    if(el.childNodes[7].innerText != ""){
        item.bonus.cha = el.childNodes[7].innerText
    }
    if(el.childNodes[8].innerText != ""){
        item.bonus.dex = el.childNodes[8].innerText
    }
    if(el.childNodes[9].innerText != ""){
        item.bonus.psy = el.childNodes[9].innerText
    }
    
    item.armor = {}
    if(el.childNodes[10].innerText != ""){
        item.armor.hp = el.childNodes[10].innerText
    }
    if(el.childNodes[11].innerText != ""){
        item.armor.abs_x = el.childNodes[11].innerText
    }
    if(el.childNodes[12].innerText != ""){
        item.armor.abs_y = el.childNodes[12].innerText
    }
    items.push(item)
}
console.log(items)