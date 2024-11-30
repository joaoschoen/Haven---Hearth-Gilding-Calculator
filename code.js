var {equipment,gilds} = require("./data")

// Here is where the data for the gildables go
var item_select_options = [{
    "name": "--Please select an item--",
    "icon":"",
    "link": "#",
    "affinity": [
        "Survival"
    ],
    "chance_min": "5%",
    "chance_max": "20%",
    "slots": [
        "9L",
        "9R"
    ]
},]

var gilding_select_options = []

function generate_options_for_item_select(){
    const item_select = document.getElementById("item-select")
    item_select.innerHTML = ""
    //null option
    const option = document.createElement('option')
    option.value = -1
    option.textContent = "--Please select an item"
    item_select.appendChild(option)
    //real options
    item_select_options.forEach((value,index) =>{
        const option = document.createElement('option')
        option.value = index
        option.textContent = item_select_options[index].name
        item_select.appendChild(option)
    })
}

function filter_gildables_by_slot(selection){
    let options = []
    for (let i = 0; i < equipment.length; i++) {
        const item = equipment[i];
        for (let j = 0; j < item.slots.length; j++) {
            const slot = item.slots[j];
            if(slot.includes(selection)){
                options.push(item)
            }
        }
    }
    return options
}

function slot_selected(selection){
    window.localStorage.setItem("selected_slot",selection)
    console.log("SELECTED SLOT:",selection)
    const selected_slot = document.getElementById("selected_slot")
    selected_slot.innerHTML = selection

    item_select_options = filter_gildables_by_slot(selection)
    item_select_options = item_select_options.sort((a,b)=>{
        return a.name[0] > b.name[0] ? 1 : -1
    })
    generate_options_for_item_select()
}


function item_selected(index){
    window.localStorage.setItem("selected_item",index)
    //We check for -1 because a null option is always added to the options list
    if(index != -1){
        const item = item_select_options[index]
        const icon = document.getElementById("selected_icon")
        icon.src = item.icon
        const slots = document.getElementById("selected_slots")
        slots.innerHTML = item.slots
        const affinity_selector = document.getElementById("affinity-select")
        affinity_selector.innerHTML = ""
        //null option
        const option = document.createElement('option')
        option.value = -1
        option.textContent = "--Please select an affinity--"
        affinity_selector.appendChild(option)

        item.affinity.forEach((value,index) =>{
            const option = document.createElement('option')
            console.log(value)
            option.value = value
            option.textContent = value
            affinity_selector.appendChild(option)
        })
        for (let i = 0; i < item.affinity.length; i++) {
            const element = item.affinity[i];
            console.log(element)
        }

        const affinity = document.getElementById("selected_affinity")
        affinity.innerHTML = item.affinity
        const chance_min = document.getElementById("selected_chance_min")
        chance_min.innerHTML = item.chance_min
        const chance_max = document.getElementById("selected_chance_max")
        chance_max.innerHTML = item.chance_max
    }
}

function affinity_selected(affinity){
    window.localStorage.setItem("selected_affinity",affinity)
    console.log("SELECTED AFFINITY:",affinity)
    const gilding_results = document.getElementById("gilding-results")
    gilding_results.innerHTML = ""
    gilding_options_list = filter_gildables_by_affinity(affinity)
    console.log(gilding_options_list)
    gilding_options_list = gilding_options_list.sort((a,b)=>{
        return a.name[0] > b.name[0] ? 1 : -1
    })
    gilding_options_list.forEach((item,index)=>{
        const div = document.createElement('div')
        div.id = index
        const table = document.createElement('table')
        const row1 =  document.createElement('tr')
        const name = document.createElement('td')
        const link = document.createElement('a')
        link.href = item.link
        link.className = "cursor-pointer text-blue-700"
        link.innerText = item.name
        name.appendChild(link)
        const icon = document.createElement('td')
        const add_button = document.createElement('button')
        add_button.className = "rounded-full border-black border-2 w-8 h-8"
        add_button.innerText = "+"
        const img = document.createElement("img")
        img.src = item.icon
        icon.appendChild(img)
        row1.appendChild(name)
        row1.appendChild(icon)
        row1.appendChild(add_button)
        table.appendChild(row1)
        div.appendChild(table)
        const row2 = document.createElement("tr")
        const gild_1 = document.createElement("td")
        gild_1.innerText = item.gild_1
        const gild_2 = document.createElement("td")
        gild_2.innerText = item.gild_2
        const gild_3 = document.createElement("td")
        gild_3.innerText = item.gild_3
        const gild_4 = document.createElement("td")
        gild_4.innerText = item.gild_4
        row2.appendChild(gild_1)
        row2.appendChild(gild_2)
        row2.appendChild(gild_3)
        row2.appendChild(gild_4)
        table.appendChild(row2)
        const row3 = document.createElement("tr")
        const min = document.createElement("td")
        min.innerText = "Min"
        const chance_min = document.createElement("td")
        chance_min.innerText = item.chance_min
        const max = document.createElement("td")
        max.innerText = "Max"
        const chance_max = document.createElement("td")
        chance_max.innerText = item.chance_max
        row3.appendChild(min)
        row3.appendChild(chance_min)
        row3.appendChild(max)
        row3.appendChild(chance_max)
        table.appendChild(row3)
        const separator = document.createElement("div")
        separator.className = "border-2 h-1"
        div.appendChild(separator)
        gilding_results.appendChild(div)
    })
}

function filter_gildables_by_affinity(selection){
    let options = []
    for (let i = 0; i < gilds.length; i++) {
        const item = gilds[i];
        for (let j = 0; j < item.affinity.length; j++) {
            const affinity = item.affinity[j];
            // rings can only be gilded by gemstones
            if(affinity.includes(selection)){
                slot = window.localStorage.getItem("selected_slot")
                if(slot.includes("7L") || slot.includes("7R")){
                    if(item.isGemstone){
                        options.push(item)
                    } else {
                        continue
                    }
                } else {
                    options.push(item)
                }
            }
        }
    }
    return options
}

function script_loaded(){    
    const selected_slot = window.localStorage.getItem("selected_slot")
    const selected_item = window.localStorage.getItem("selected_item")
    const selected_affinity = window.localStorage.getItem("selected_affinity")
    console.log("load selected_slot:",selected_slot)
    console.log("load selected_item:",selected_item)
    console.log("load selected_affinity:",selected_affinity)
    if(selected_slot != null){
        slot_selected(selected_slot)
        if(selected_item != null && selected_item != "-1"){
            const item_select = document.getElementById("item-select")
            item_select.value = selected_item
            item_selected(selected_item)
            if(selected_affinity != null){
                const affinity_select = document.getElementById("affinity-select")
                affinity_select.value = selected_affinity
                affinity_selected(selected_affinity)
                
            }
        }
    }
    
}
document.addEventListener("DOMContentLoaded", function() {
    script_loaded()
});
  
// DATA