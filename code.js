// Here is where the data for the gildables go
var item_select_options = [{
    "name": "--Please select an item--",
    "icon":"",
    "link": "#",
    "affinity": [
        
    ],
    "chance_min": "0%",
    "chance_max": "0%",
    "slot": [
    ]
},]

var gilding_select_options = []
var gilding_affinity_filter = []
var gilding_option_list = []

function generate_options_for_item_select(){
    const item_select = document.getElementById("item-select")
    item_select.innerHTML = ""
    //null option
    const option = document.createElement('option')
    option.value = -1
    option.textContent = "--Please select an item--"
    item_select.appendChild(option)
    //real options
    item_select_options.forEach((value,index) =>{
        const option = document.createElement('option')
        option.value = index
        option.textContent = item_select_options[index].name
        item_select.appendChild(option)
    })
}

function filter_equipment_by_slot(selection){
    let options = []
    for (let i = 0; i < equipment.length; i++) {
        const item = equipment[i];
        for (let j = 0; j < item.slot.length; j++) {
            const slot = item.slot[j];
            if(slot.includes(selection)){
                options.push(item)
            }
        }
    }
    return options
}

// SELECTION TRIGGERS
function slot_selected(selection){
    window.localStorage.setItem("selected_slot",selection)
   //  console.log("SELECTED SLOT:",selection)
    const selected_slot = document.getElementById("selected_slot")
    selected_slot.innerHTML = selection

    item_select_options = filter_equipment_by_slot(selection)
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
        slots.innerHTML = item.slot
        //null option
        const option = document.createElement('option')
        option.value = -1
        
        // BONUS
        const bonus = document.getElementById("selected_bonus")
        bonus.innerText = ""
        if(Object.keys(item.bonus).length != 0){
            let keys = Object.keys(item.bonus)
            for (let i = 0; i < keys.length; i++) {
                let el = document.createElement("span")
                el.innerText = "" + keys[i] + " " + item.bonus[keys[i]]
                el.className = "p-2"
                bonus.appendChild(el)
            }
        } else {
            bonus.innerText = "No bonus"
        }
        // ARMOR
        row_armor_0 = document.getElementById("row_armor_0")
        row_armor_1 = document.getElementById("row_armor_1")
        row_armor_2 = document.getElementById("row_armor_2")
        row_armor_3 = document.getElementById("row_armor_3")
        if(Object.keys(item.armor).length != 0){
            row_armor_0.className = ""
            row_armor_1.className = ""
            row_armor_2.className = ""
            row_armor_3.className = ""
            selected_armor_hp = document.getElementById("selected_armor_hp")
            selected_armor_hp.innerText = item.armor.hp
            selected_armor_abs_x = document.getElementById("selected_armor_abs_x")
            selected_armor_abs_x.innerText = item.armor.abs_x
            selected_armor_abs_y = document.getElementById("selected_armor_abs_y")
            selected_armor_abs_y.innerText = item.armor.abs_y
        } else {
            row_armor_0.className = "hidden"
            row_armor_1.className = "hidden"
            row_armor_2.className = "hidden"
            row_armor_3.className = "hidden"
        }
        // GILDING
        const affinity = document.getElementById("selected_affinity")
        const row_chance_min = document.getElementById("base-item-chance_min")
        const row_chance_max = document.getElementById("base-item-chance_max")
        const chance_min = document.getElementById("selected_chance_min")
        const chance_max = document.getElementById("selected_chance_max")
        if(item.affinity != undefined){
            affinity.innerHTML = item.affinity
            chance_min.innerHTML = item.chance_min
            row_chance_min.className = ""
            chance_max.innerHTML = item.chance_max
            row_chance_max.className = ""
        } else {            
            affinity.innerHTML = "Not Gildable"
            row_chance_min.className = "hidden"
            row_chance_max.className = "hidden"
        }
    }
}

function affinity_selected(affinity){
    window.localStorage.setItem("selected_affinity",affinity)
   //  console.log("SELECTED AFFINITY:",affinity)
    gilding_affinity_filter = filter_gildings_by_affinity(affinity)
   //  console.log(gilding_affinity_filter)
   gilding_option_list = gilding_affinity_filter
   generate_gildings_list()
}

function gilding_bonus_filter_selected(bonus){
   window.localStorage.setItem("selected_bonus_filter",bonus)
   // gilding_affinity_filter
   gilding_option_list = filter_gildings_by_bonus(bonus)
   generate_gildings_list()
}
// GILDING FILTERS
function filter_gildings_by_bonus(bonus){
   let options = []
   for (let i = 0; i < gilding_affinity_filter.length; i++) {
      const item = gilding_affinity_filter[i];
      if(item.gild_1.includes(bonus)){
         options.push(item)
      } else if(item.gild_2.includes(bonus)) {
         options.push(item)
      } else if(item.gild_3.includes(bonus)) {
         options.push(item)
      } else if(item.gild_4.includes(bonus)) {
         options.push(item)
      }
      
   }
   options = options.sort((a,b)=>{
      return a.name[0] > b.name[0] ? 1 : -1
   })
   return options
}

function filter_gildings_by_affinity(selection){
   let options = []
   let slot = window.localStorage.getItem("selected_slot")
   let selected_item = window.localStorage.getItem("selected_item")
   let equipment = item_select_options[selected_item]
   if(equipment.affinity == undefined){
      return options
   }
   for (let i = 0; i < gilds.length; i++) {
      const item = gilds[i];
      // Only rings can have gemstones gilded into them
      if(slot == "7L" || slot == "7R"){
         if(!item.isGemstone){
               continue
         }
      } else {
         if(item.isGemstone){
               continue
         }
      }
      // Affinity alignment
      for (let j = 0; j < item.affinity.length; j++) {
         const affinity = item.affinity[j];
         if(affinity.includes(selection)){
                  options.push(item)
         }
      }
   }
   options = options.sort((a,b)=>{
      return a.name[0] > b.name[0] ? 1 : -1
   })
   return options
}

function generate_gildings_list(){
   const gilding_results = document.getElementById("gilding-results")
   gilding_results.innerHTML = ""
   gilding_option_list.forEach((item,index)=>{
      const div = document.createElement('div')
      div.id = index
      const table = document.createElement('table')
      if(index % 2 == 0){
          div.className="bg-slate-200"                  
      } else {
          div.className="bg-slate-300"                     
      }
      table.className = ""
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
var equipment = [
   {
      "link": "https://ringofbrodgar.com/wiki/Adder_Crown",
      "name": "Adder Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Dexterity",
         "Stealth",
         "Will"
      ],
      "icon": "https://ringofbrodgar.com/images/5/56/Adder_Crown.png",
      "chance_min": "25%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Adderfang_Amulet",
      "name": "Adderfang Amulet",
      "slot": [
         "2L"
      ],
      "bonus": {
         "int": "3"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ant_Crown",
      "name": "Ant Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Strength",
         "Will",
         "Carpentry"
      ],
      "icon": "https://ringofbrodgar.com/images/5/56/Ant_Crown.png",
      "chance_min": "50%",
      "chance_max": "75%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ant_Queen%27s_Wings",
      "name": "Ant Queen's Wings",
      "slot": [
         "10L",
         "8R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Unarmed Combat",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/e/e2/Ant_Queen%27s_Wings.png/32px-Ant_Queen%27s_Wings.png",
      "chance_min": "35%",
      "chance_max": "80%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Armored_Striders",
      "name": "Armored Striders",
      "slot": [
         "10R"
      ],
      "bonus": {
         "agi": "1"
      },
      "armor": {
         "hp": "400",
         "abs_x": "5",
         "abs_y": "3"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ashen_Robes",
      "name": "Ashen Robes",
      "slot": [
         "3L",
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Psyche",
         "Stealth"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/6/6f/Ashen_Robes.png/23px-Ashen_Robes.png",
      "chance_min": "10%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Badger_Hide_Vest",
      "name": "Badger Hide Vest",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {
         "hp": "100",
         "abs_x": "2",
         "abs_y": "1"
      },
      "affinity": [
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/7/79/Badger_Hide_Vest.png/23px-Badger_Hide_Vest.png",
      "chance_min": "0%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bagpipe",
      "name": "Bagpipe",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bandit%27s_Mask",
      "name": "Bandit's Mask",
      "slot": [
         "2R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bat_Crown",
      "name": "Bat Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Strength",
         "Charisma",
         "Stealth"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/6/6b/Bat_Crown.png/48px-Bat_Crown.png",
      "chance_min": "50%",
      "chance_max": "85%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bat_Wing",
      "name": "Bat Wing",
      "slot": [
         "10L"
      ],
      "bonus": {},
      "armor": {
         "hp": "138",
         "abs_x": "3",
         "abs_y": "3"
      },
      "affinity": [
         "Stealth"
      ],
      "icon": "https://ringofbrodgar.com/images/3/35/Bat_Wing.png",
      "chance_min": "10%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Battle_Standard",
      "name": "Battle Standard",
      "slot": [
         "5L",
         "5R or 7R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Battleaxe_of_the_Twelfth_Bay",
      "name": "Battleaxe of the Twelfth Bay",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bear_Cape",
      "name": "Bear Cape",
      "slot": [
         "1L and 9L"
      ],
      "bonus": {
         "str": "6"
      },
      "armor": {},
      "affinity": [
         "Strength",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/e/e9/Bear_Cape.png/23px-Bear_Cape.png",
      "chance_min": "10%",
      "chance_max": "32%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bear_Coat",
      "name": "Bear Coat",
      "slot": [
         "8L"
      ],
      "bonus": {
         "str": "3",
         "agi": "2"
      },
      "armor": {},
      "affinity": [
         "Survival",
         "Strength",
         "Melee Combat"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/5/5d/Bear_Coat.png/23px-Bear_Coat.png",
      "chance_min": "30%",
      "chance_max": "50%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bear_Tooth_Talisman",
      "name": "Bear Tooth Talisman",
      "slot": [
         "2L"
      ],
      "bonus": {
         "str": "3",
         "cha": "5"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Beast_Ring",
      "name": "Beast Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "str": "2",
         "agi": "1"
      },
      "armor": {},
      "affinity": [
         "Strength",
         "Agility"
      ],
      "icon": "https://ringofbrodgar.com/images/e/e8/Beast_Ring.png",
      "chance_min": "15%",
      "chance_max": "20%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Beaver_Cap",
      "name": "Beaver Cap",
      "slot": [
         "1L"
      ],
      "bonus": {
         "dex": "1"
      },
      "armor": {},
      "affinity": [
         "Agility",
         "Carpentry",
         "Exploration"
      ],
      "icon": "https://ringofbrodgar.com/images/3/34/Beaver_Cap.png",
      "chance_min": "20%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Beaver_Crown",
      "name": "Beaver Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Strength",
         "Will",
         "Carpentry"
      ],
      "icon": "https://ringofbrodgar.com/images/2/2c/Beaver_Crown.png",
      "chance_min": "50%",
      "chance_max": "75%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Beaver_Wrist_Guards",
      "name": "Beaver Wrist Guards",
      "slot": [
         "4L"
      ],
      "bonus": {
         "agi": "1"
      },
      "armor": {
         "hp": "15",
         "abs_x": "1",
         "abs_y": "2"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bee_Crown",
      "name": "Bee Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Strength",
         "Will",
         "Carpentry"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/4/47/Bee_Crown.png/48px-Bee_Crown.png",
      "chance_min": "50%",
      "chance_max": "75%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bee_Queen%27s_Wings",
      "name": "Bee Queen's Wings",
      "slot": [
         "10L",
         "8R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Unarmed Combat",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/b/bc/Bee_Queen%27s_Wings.png/32px-Bee_Queen%27s_Wings.png",
      "chance_min": "35%",
      "chance_max": "80%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Birchbark_Backpack",
      "name": "Birchbark Backpack",
      "slot": [
         "8R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Boar_Spear",
      "name": "Boar Spear",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Boar_Tusk_Helmet",
      "name": "Boar Tusk Helmet",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {
         "hp": "50",
         "abs_x": "1",
         "abs_y": "7"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bone_Greaves",
      "name": "Bone Greaves",
      "slot": [
         "9R"
      ],
      "bonus": {
         "agi": "-3"
      },
      "armor": {
         "hp": "75",
         "abs_x": "4",
         "abs_y": "5"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bone_Saw",
      "name": "Bone Saw",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Boreworm_Mask",
      "name": "Boreworm Mask",
      "slot": [
         "1R and 2R"
      ],
      "bonus": {
         "str": "2"
      },
      "armor": {
         "hp": "60",
         "abs_x": "2",
         "abs_y": "1"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bouquet_of_Flowers",
      "name": "Bouquet of Flowers",
      "slot": [
         ""
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bronze_Helm",
      "name": "Bronze Helm",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "-2"
      },
      "armor": {
         "hp": "40",
         "abs_x": "8",
         "abs_y": "5"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bronze_Plate",
      "name": "Bronze Plate",
      "slot": [
         "3R"
      ],
      "bonus": {
         "agi": "-7"
      },
      "armor": {
         "hp": "450",
         "abs_x": "20",
         "abs_y": "15"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bronze_Sword",
      "name": "Bronze Sword",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bucket",
      "name": "Bucket",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bull_Pipe",
      "name": "Bull Pipe",
      "slot": [
         "2R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bunny_Slippers",
      "name": "Bunny Slippers",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility"
      ],
      "icon": "https://ringofbrodgar.com/images/1/1c/Bunny_Slippers.png",
      "chance_min": "5%",
      "chance_max": "20%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Bushcraft_Fishingpole",
      "name": "Bushcraft Fishingpole",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Butcher%27s_Cleaver",
      "name": "Butcher's Cleaver",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Cachalot_Charm",
      "name": "Cachalot Charm",
      "slot": [
         "2L"
      ],
      "bonus": {
         "str": "2",
         "agi": "3"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Candle_Crown",
      "name": "Candle Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Cave_Angler_Cape",
      "name": "Cave Angler Cape",
      "slot": [
         "1L and 9L"
      ],
      "bonus": {
         "str": "2",
         "agi": "2",
         "per": "1"
      },
      "armor": {},
      "affinity": [
         "Perception",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/4/4e/Cave_Angler_Cape.png/23px-Cave_Angler_Cape.png",
      "chance_min": "20%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Cave_Coral_Ring",
      "name": "Cave Coral Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "dex": "2"
      },
      "armor": {},
      "affinity": [
         "Dexterity",
         "Masonry",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/2/25/Cave_Coral_Ring.png",
      "chance_min": "20%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ceramic_Knife",
      "name": "Ceramic Knife",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Chainmail_Shirt",
      "name": "Chainmail Shirt",
      "slot": [
         "3R"
      ],
      "bonus": {
         "agi": "-5"
      },
      "armor": {
         "hp": "500",
         "abs_x": "15",
         "abs_y": "15"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Chef%27s_Hat",
      "name": "Chef's Hat",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Cooking"
      ],
      "icon": "https://ringofbrodgar.com/images/e/e4/Chef%27s_Hat.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Chieftain%27s_Hat",
      "name": "Chieftain's Hat",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma"
      ],
      "icon": "https://ringofbrodgar.com/images/e/e9/Chieftain%27s_Hat.png",
      "chance_min": "20%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Chitin_Helmet",
      "name": "Chitin Helmet",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "-1"
      },
      "armor": {
         "hp": "50",
         "abs_x": "0",
         "abs_y": "2"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Cigar",
      "name": "Cigar",
      "slot": [
         "2R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Clay_Pipe",
      "name": "Clay Pipe",
      "slot": [
         "2R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Clogs",
      "name": "Clogs",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Carpentry"
      ],
      "icon": "https://ringofbrodgar.com/images/9/9f/Clogs.png",
      "chance_min": "5%",
      "chance_max": "15%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Clothier%27s_Thimble",
      "name": "Clothier's Thimble",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "dex": "2"
      },
      "armor": {},
      "affinity": [
         "Dexterity",
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/e/e5/Clothier%27s_Thimble.png",
      "chance_min": "20%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Coracle",
      "name": "Coracle",
      "slot": [
         "L9"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Corndolly_Lantern",
      "name": "Corndolly Lantern",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Creel",
      "name": "Creel",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Cutblade",
      "name": "Cutblade",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Cutthroat_Cuirass",
      "name": "Cutthroat Cuirass",
      "slot": [
         "3R"
      ],
      "bonus": {
         "agi": "2"
      },
      "armor": {
         "hp": "400",
         "abs_x": "15",
         "abs_y": "15"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Cutthroat_Knuckles",
      "name": "Cutthroat Knuckles",
      "slot": [
         "4L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Cylinder_Hat",
      "name": "Cylinder Hat",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma"
      ],
      "icon": "https://ringofbrodgar.com/images/8/8d/Cylinder_Hat.png",
      "chance_min": "20%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Darkwood_Ring",
      "name": "Darkwood Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "int": "3",
         "per": "3"
      },
      "armor": {},
      "affinity": [
         "Psyche",
         "Will",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/9/96/Darkwood_Ring.png/48px-Darkwood_Ring.png",
      "chance_min": "25%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Dev_Cape",
      "name": "Dev Cape",
      "slot": [
         "10L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Diver%27s_Weight",
      "name": "Diver's Weight",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Dowsing_Rod",
      "name": "Dowsing Rod",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Dragon_Helm",
      "name": "Dragon Helm",
      "slot": [
         "1L"
      ],
      "bonus": {
         "str": "5",
         "agi": "-1"
      },
      "armor": {
         "hp": "200",
         "abs_x": "9",
         "abs_y": "9"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Druid%27s_Cloak",
      "name": "Druid's Cloak",
      "slot": [
         "8L",
         "1L (optional)"
      ],
      "bonus": {
         "int": "5",
         "psy": "5"
      },
      "armor": {},
      "affinity": [
         "Farming",
         "Psyche"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/9/92/Druid%27s_Cloak.png/23px-Druid%27s_Cloak.png",
      "chance_min": "35%",
      "chance_max": "65%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Druid%27s_Helm",
      "name": "Druid's Helm",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "-1"
      },
      "armor": {
         "hp": "45",
         "abs_x": "8",
         "abs_y": "4"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Druid%27s_Ring",
      "name": "Druid's Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "int": "3",
         "psy": "5"
      },
      "armor": {},
      "affinity": [
         "Psyche",
         "Will",
         "Lore",
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/8/8e/Druid%27s_Ring.png",
      "chance_min": "30%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Drum_%26_Sticks",
      "name": "Drum & Sticks",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Exquisite_Belt",
      "name": "Exquisite Belt",
      "slot": [
         "4R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Family_Heirloom",
      "name": "Family Heirloom",
      "slot": [
         "2L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Feather_Band",
      "name": "Feather Band",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Perception"
      ],
      "icon": "https://ringofbrodgar.com/images/e/ee/Feather_Band.png",
      "chance_min": "15%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Feather_Sunfeather",
      "name": "Feather Sunfeather",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Felt_Hat",
      "name": "Felt Hat",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Charisma",
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/e/ec/Felt_Hat.png",
      "chance_min": "30%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Fiddle_%26_Bow",
      "name": "Fiddle & Bow",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Fisherman%27s_Hat",
      "name": "Fisherman's Hat",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Will",
         "Survival",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/b/b0/Fisherman%27s_Hat.png",
      "chance_min": "15%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Flint_Knife",
      "name": "Flint Knife",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Flute",
      "name": "Flute",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Forge_Ring",
      "name": "Forge Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "str": "5"
      },
      "armor": {},
      "affinity": [
         "Smithing"
      ],
      "icon": "https://ringofbrodgar.com/images/d/d5/Forge_Ring.png",
      "chance_min": "15%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Fox_Hat",
      "name": "Fox Hat",
      "slot": [
         "1L"
      ],
      "bonus": {
         "int": "1"
      },
      "armor": {},
      "affinity": [
         "Agility",
         "Exploration"
      ],
      "icon": "https://ringofbrodgar.com/images/d/da/Fox_Hat.png",
      "chance_min": "10%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Frying_Pan",
      "name": "Frying Pan",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Fur_Boots",
      "name": "Fur Boots",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility"
      ],
      "icon": "https://ringofbrodgar.com/images/6/63/Fur_Boots.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Fur_Cloak",
      "name": "Fur Cloak",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Survival",
         "Exploration"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/3/33/Fur_Cloak.png/23px-Fur_Cloak.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Fyrdsman%27s_Sword",
      "name": "Fyrdsman's Sword",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Gauze",
      "name": "Gauze",
      "slot": [
         "1R and 2R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Glass_Jug",
      "name": "Glass Jug",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Goat_Mask",
      "name": "Goat Mask",
      "slot": [
         "1R and 2R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Grand_Belt",
      "name": "Grand Belt",
      "slot": [
         "4R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Grand_Troll_Helm",
      "name": "Grand Troll Helm",
      "slot": [
         "1L"
      ],
      "bonus": {
         "str": "5",
         "agi": "-1"
      },
      "armor": {
         "hp": "250",
         "abs_x": "6",
         "abs_y": "10"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Grass_Cape",
      "name": "Grass Cape",
      "slot": [
         "10L"
      ],
      "bonus": {
         "agi": "1"
      },
      "armor": {},
      "affinity": [
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/f/fc/Grass_Cape.png/48px-Grass_Cape.png",
      "chance_min": "5%",
      "chance_max": "15%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Grass_Crown",
      "name": "Grass Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Will",
         "Exploration",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/c/cc/Grass_Crown.png/48px-Grass_Crown.png",
      "chance_min": "10%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Grass_Pants",
      "name": "Grass Pants",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/a/a5/Grass_Pants.png/48px-Grass_Pants.png",
      "chance_min": "5%",
      "chance_max": "20%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Grass_Shirt",
      "name": "Grass Shirt",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/1/13/Grass_Shirt.png/48px-Grass_Shirt.png",
      "chance_min": "5%",
      "chance_max": "20%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Grass_Skirt",
      "name": "Grass Skirt",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/a/a4/Grass_Skirt.png/48px-Grass_Skirt.png",
      "chance_min": "3%",
      "chance_max": "10%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Harmonica",
      "name": "Harmonica",
      "slot": [
         ""
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hemp_Pants",
      "name": "Hemp Pants",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/9/95/Hemp_Pants.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hemp_Shirt",
      "name": "Hemp Shirt",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/a/a7/Hemp_Shirt.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Heraldic_Cape",
      "name": "Heraldic Cape",
      "slot": [
         "10L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/9/94/Heraldic_Cape.png",
      "chance_min": "15%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hermine_Cape",
      "name": "Hermine Cape",
      "slot": [
         "10L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Melee Combat"
      ],
      "icon": "https://ringofbrodgar.com/images/e/eb/Hermine_Cape.png",
      "chance_min": "35%",
      "chance_max": "50%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hermine_Cloak",
      "name": "Hermine Cloak",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Psyche",
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/5/5e/Hermine_Cloak.png/48px-Hermine_Cloak.png",
      "chance_min": "45%",
      "chance_max": "65%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hide_Cloak",
      "name": "Hide Cloak",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/2/23/Hide_Cloak.png/23px-Hide_Cloak.png",
      "chance_min": "10%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hirdsman%27s_Cape",
      "name": "Hirdsman's Cape",
      "slot": [
         "10L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Melee Combat"
      ],
      "icon": "https://ringofbrodgar.com/images/4/41/Hirdsman%27s_Cape.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hirdsman%27s_Helmet",
      "name": "Hirdsman's Helmet",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "-2"
      },
      "armor": {
         "hp": "45",
         "abs_x": "6",
         "abs_y": "4"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hirdsman%27s_Sword",
      "name": "Hirdsman's Sword",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Horse_Nomad%27s_Helm",
      "name": "Horse Nomad's Helm",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "5"
      },
      "armor": {
         "hp": "150",
         "abs_x": "4",
         "abs_y": "5"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hunter%27s_Belt",
      "name": "Hunter's Belt",
      "slot": [
         "4R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hunter%27s_Bow",
      "name": "Hunter's Bow",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hunter%27s_Quiver",
      "name": "Hunter's Quiver",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hunter%27s_Shirt",
      "name": "Hunter's Shirt",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing",
         "Survival",
         "Perception"
      ],
      "icon": "https://ringofbrodgar.com/images/f/f0/Hunter%27s_Shirt.png",
      "chance_min": "25%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Hussar%27s_Wings",
      "name": "Hussar's Wings",
      "slot": [
         "10L",
         "8R"
      ],
      "bonus": {
         "agi": "10"
      },
      "armor": {
         "hp": "30",
         "abs_x": "2",
         "abs_y": "3"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Irrlantern",
      "name": "Irrlantern",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Jack-o%27-Mask",
      "name": "Jack-o'-Mask",
      "slot": [
         "1R and 2R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Keyring",
      "name": "Keyring",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Kozhukh",
      "name": "Kozhukh",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Survival",
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/6/60/Kozhukh.png/23px-Kozhukh.png",
      "chance_min": "30%",
      "chance_max": "50%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Laddie%27s_Cap",
      "name": "Laddie's Cap",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/c/ce/Laddie%27s_Cap.png",
      "chance_min": "10%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Lantern",
      "name": "Lantern",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Lawspeaker%27s_Hat",
      "name": "Lawspeaker's Hat",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma"
      ],
      "icon": "https://ringofbrodgar.com/images/d/d7/Lawspeaker%27s_Hat.png",
      "chance_min": "20%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Lawspeaker%27s_Robes",
      "name": "Lawspeaker's Robes",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/6/69/Lawspeaker%27s_Robes.png/23px-Lawspeaker%27s_Robes.png",
      "chance_min": "20%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Lead_Talisman",
      "name": "Lead Talisman",
      "slot": [
         "2L"
      ],
      "bonus": {
         "str": "2",
         "psy": "1"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leather_Armor",
      "name": "Leather Armor",
      "slot": [
         "3R"
      ],
      "bonus": {
         "agi": "-1"
      },
      "armor": {
         "hp": "100",
         "abs_x": "4",
         "abs_y": "5"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leather_Backpack",
      "name": "Leather Backpack",
      "slot": [
         "8R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leather_Boots",
      "name": "Leather Boots",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {
         "hp": "15",
         "abs_x": "1",
         "abs_y": "3"
      },
      "affinity": [
         "Agility"
      ],
      "icon": "https://ringofbrodgar.com/images/f/fd/Leather_Boots.png",
      "chance_min": "20%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leather_Coat",
      "name": "Leather Coat",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/c/cb/Leather_Coat.png/23px-Leather_Coat.png",
      "chance_min": "15%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leather_Merchant%27s_Hat",
      "name": "Leather Merchant's Hat",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma"
      ],
      "icon": "https://ringofbrodgar.com/images/a/a5/Leather_Merchant%27s_Hat.png",
      "chance_min": "10%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leather_Pants",
      "name": "Leather Pants",
      "slot": [
         "9R"
      ],
      "bonus": {
         "agi": "-2"
      },
      "armor": {
         "hp": "75",
         "abs_x": "3",
         "abs_y": "4"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leather_Purse",
      "name": "Leather Purse",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leech",
      "name": "Leech",
      "slot": [
         ""
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Leek",
      "name": "Leek",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Linen_Pants",
      "name": "Linen Pants",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/f/fa/Linen_Pants.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Linen_Shirt",
      "name": "Linen Shirt",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/8/8a/Linen_Shirt.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Lute",
      "name": "Lute",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Lynx_Cape",
      "name": "Lynx Cape",
      "slot": [
         "1L and 9L"
      ],
      "bonus": {
         "agi": "4"
      },
      "armor": {},
      "affinity": [
         "Agility",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/f/ff/Lynx_Cape.png/23px-Lynx_Cape.png",
      "chance_min": "10%",
      "chance_max": "32%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Lynx_Claw_Gloves",
      "name": "Lynx Claw Gloves",
      "slot": [
         "4L"
      ],
      "bonus": {
         "agi": "5"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Mammoth_Guard",
      "name": "Mammoth Guard",
      "slot": [
         "3R"
      ],
      "bonus": {
         "str": "10",
         "agi": "-5",
         "con": "5"
      },
      "armor": {
         "hp": "600",
         "abs_x": "15",
         "abs_y": "20"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Mask_of_the_Green_Man",
      "name": "Mask of the Green Man",
      "slot": [
         "1R and 2R"
      ],
      "bonus": {
         "psy": "10"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Merchant%27s_Pants",
      "name": "Merchant's Pants",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/b/b1/Merchant%27s_Pants.png",
      "chance_min": "35%",
      "chance_max": "65%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Merchant%27s_Ring",
      "name": "Merchant's Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "str": "3",
         "agi": "3",
         "int": "3",
         "con": "3",
         "per": "3",
         "cha": "3",
         "dex": "3",
         "psy": "3"
      },
      "armor": {},
      "affinity": [
         "Charisma",
         "Intelligence"
      ],
      "icon": "https://ringofbrodgar.com/images/5/52/Merchant%27s_Ring.png",
      "chance_min": "15%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Merchant%27s_Robe",
      "name": "Merchant's Robe",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/9/90/Merchant%27s_Robe.png/23px-Merchant%27s_Robe.png",
      "chance_min": "20%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Metal_Axe",
      "name": "Metal Axe",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Metal_Saw",
      "name": "Metal Saw",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Metal_Shovel",
      "name": "Metal Shovel",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Meteoring",
      "name": "Meteoring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "str": "15",
         "agi": "5"
      },
      "armor": {},
      "affinity": [
         "Will",
         "Psyche"
      ],
      "icon": "https://ringofbrodgar.com/images/b/b7/Meteoring.png",
      "chance_min": "35%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Miner%27s_Helm",
      "name": "Miner's Helm",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {
         "hp": "85",
         "abs_x": "2",
         "abs_y": "4"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Mohair_Shirt",
      "name": "Mohair Shirt",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing",
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/4/4e/Mohair_Shirt.png",
      "chance_min": "30%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Molehide_Pants",
      "name": "Molehide Pants",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Strength",
         "Masonry"
      ],
      "icon": "https://ringofbrodgar.com/images/8/8d/Molehide_Pants.png",
      "chance_min": "25%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Monocle",
      "name": "Monocle",
      "slot": [
         "1R"
      ],
      "bonus": {
         "per": "15"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Moose_Hide_Jacket",
      "name": "Moose Hide Jacket",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Survival",
         "Exploration"
      ],
      "icon": "https://ringofbrodgar.com/images/e/e0/Moose_Hide_Jacket.png",
      "chance_min": "20%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Mortar_%26_Pestle",
      "name": "Mortar & Pestle",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Nettle_Pants",
      "name": "Nettle Pants",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {
         "agi": "1"
      },
      "armor": {},
      "affinity": [
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/4/4d/Nettle_Pants.png",
      "chance_min": "5%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Nettle_Shirt",
      "name": "Nettle Shirt",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {
         "agi": "1"
      },
      "armor": {},
      "affinity": [
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/b/bb/Nettle_Shirt.png",
      "chance_min": "5%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Obsidian_Dagger",
      "name": "Obsidian Dagger",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Occult_Ring",
      "name": "Occult Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "int": "7",
         "psy": "7"
      },
      "armor": {},
      "affinity": [
         "Psyche",
         "Dexterity",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/d/df/Occult_Ring.png",
      "chance_min": "25%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Pearl_Necklace",
      "name": "Pearl Necklace",
      "slot": [
         "2L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Pickaxe",
      "name": "Pickaxe",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Plain_Tabard",
      "name": "Plain Tabard",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/1/1c/Plain_Tabard.png/23px-Plain_Tabard.png",
      "chance_min": "15%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Plate_Armor",
      "name": "Plate Armor",
      "slot": [
         "3R"
      ],
      "bonus": {
         "agi": "-10"
      },
      "armor": {
         "hp": "100",
         "abs_x": "25",
         "abs_y": "15"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Plate_Boots",
      "name": "Plate Boots",
      "slot": [
         "10R"
      ],
      "bonus": {
         "agi": "-2"
      },
      "armor": {
         "hp": "450",
         "abs_x": "7",
         "abs_y": "5"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Plate_Gauntlets",
      "name": "Plate Gauntlets",
      "slot": [
         "4L"
      ],
      "bonus": {
         "agi": "-1"
      },
      "armor": {
         "hp": "30",
         "abs_x": "2",
         "abs_y": "4"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Plate_Greaves",
      "name": "Plate Greaves",
      "slot": [
         "9R"
      ],
      "bonus": {
         "agi": "-10"
      },
      "armor": {
         "hp": "100",
         "abs_x": "18",
         "abs_y": "8"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Plate_Helmet",
      "name": "Plate Helmet",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "-2"
      },
      "armor": {
         "hp": "60",
         "abs_x": "9",
         "abs_y": "6"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Pointed_Cap",
      "name": "Pointed Cap",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Sewing",
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/d/d0/Pointed_Cap.png",
      "chance_min": "20%",
      "chance_max": "50%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Poor_Man%27s_Belt",
      "name": "Poor Man's Belt",
      "slot": [
         "4R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Poor_Man%27s_Gloves",
      "name": "Poor Man's Gloves",
      "slot": [
         "4L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Primitive_Casting-Rod",
      "name": "Primitive Casting-Rod",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Rabbit%27s_Foot_Necklace",
      "name": "Rabbit's Foot Necklace",
      "slot": [
         "2L"
      ],
      "bonus": {
         "agi": "3",
         "psy": "2"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Raider%27s_Cap",
      "name": "Raider's Cap",
      "slot": [
         "1L"
      ],
      "bonus": {
         "str": "1"
      },
      "armor": {
         "hp": "70",
         "abs_x": "6",
         "abs_y": "4"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Rainbow_Shell_Amulet",
      "name": "Rainbow Shell Amulet",
      "slot": [
         "2L"
      ],
      "bonus": {
         "int": "2",
         "per": "3"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ranger%27s_Boots",
      "name": "Ranger's Boots",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {
         "hp": "58",
         "abs_x": "3",
         "abs_y": "3"
      },
      "affinity": [
         "Agility",
         "Stealth"
      ],
      "icon": "https://ringofbrodgar.com/images/9/9a/Ranger%27s_Boots.png",
      "chance_min": "20%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ranger%27s_Bow",
      "name": "Ranger's Bow",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ranger%27s_Cape",
      "name": "Ranger's Cape",
      "slot": [
         "1L and 9L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Exploration",
         "Stealth"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/e/e5/Ranger%27s_Cape.png/23px-Ranger%27s_Cape.png",
      "chance_min": "20%",
      "chance_max": "50%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ranger%27s_Pants",
      "name": "Ranger's Pants",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Exploration",
         "Stealth"
      ],
      "icon": "https://ringofbrodgar.com/images/3/3c/Ranger%27s_Pants.png",
      "chance_min": "25%",
      "chance_max": "55%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ranger%27s_Shirt",
      "name": "Ranger's Shirt",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Exploration",
         "Stealth"
      ],
      "icon": "https://ringofbrodgar.com/images/6/6b/Ranger%27s_Shirt.png",
      "chance_min": "25%",
      "chance_max": "55%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Rat_Hat",
      "name": "Rat Hat",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "2"
      },
      "armor": {},
      "affinity": [
         "Agility",
         "Exploration",
         "Stealth"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/2/2e/Rat_Hat.png/48px-Rat_Hat.png",
      "chance_min": "20%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Raven",
      "name": "Raven",
      "slot": [
         "??"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Rectangular_Parchment_Lantern",
      "name": "Rectangular Parchment Lantern",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Reedweave_Belt",
      "name": "Reedweave Belt",
      "slot": [
         "4R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Reindeer_Cape",
      "name": "Reindeer Cape",
      "slot": [
         "1L and 9L"
      ],
      "bonus": {
         "agi": "2"
      },
      "armor": {},
      "affinity": [
         "Agility",
         "Survival",
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/6/64/Reindeer_Cape.png/23px-Reindeer_Cape.png",
      "chance_min": "20%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Reindeer_Parka",
      "name": "Reindeer Parka",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Survival",
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/1/1d/Reindeer_Parka.png",
      "chance_min": "10%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Ring_of_Brodgar_(Jewelry)",
      "name": "Ring of Brodgar (Jewelry)",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "int": "5",
         "psy": "5"
      },
      "armor": {},
      "affinity": [
         "Psyche",
         "Agility"
      ],
      "icon": "https://ringofbrodgar.com/images/6/62/Ring_of_Brodgar_%28Jewelry%29.png",
      "chance_min": "20%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Rope",
      "name": "Rope",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Royal_Crown",
      "name": "Royal Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Psyche",
         "Smithing"
      ],
      "icon": "https://ringofbrodgar.com/images/a/a3/Royal_Crown.png",
      "chance_min": "45%",
      "chance_max": "60%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Rusalka%27s_Water_Moccasins",
      "name": "Rusalka's Water Moccasins",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Psyche",
         "Exploration"
      ],
      "icon": "https://ringofbrodgar.com/images/5/5a/Rusalka%27s_Water_Moccasins.png",
      "chance_min": "50%",
      "chance_max": "85%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Scarlet_Gown",
      "name": "Scarlet Gown",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Melee Combat"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/a/af/Scarlet_Gown.png/23px-Scarlet_Gown.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Scythe",
      "name": "Scythe",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Seal_Hide_Hoses",
      "name": "Seal Hide Hoses",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {
         "agi": "1"
      },
      "armor": {},
      "affinity": [
         "Agility",
         "Survival",
         "Exploration"
      ],
      "icon": "https://ringofbrodgar.com/images/5/52/Seal_Hide_Hoses.png",
      "chance_min": "10%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Seer%27s_Hood",
      "name": "Seer's Hood",
      "slot": [
         "1L and 9L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Seer%27s_Shoes",
      "name": "Seer's Shoes",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Seer%27s_Tunic",
      "name": "Seer's Tunic",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Shears",
      "name": "Shears",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Silk_Gloves",
      "name": "Silk Gloves",
      "slot": [
         "4L"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Silk_Purse",
      "name": "Silk Purse",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Silver_for_the_Ferryman",
      "name": "Silver for the Ferryman",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Intelligence",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/a/ac/Silver_for_the_Ferryman.png",
      "chance_min": "25%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Sledgehammer",
      "name": "Sledgehammer",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Sling",
      "name": "Sling",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Smithy%27s_Hammer",
      "name": "Smithy's Hammer",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Snakeskin_Belt",
      "name": "Snakeskin Belt",
      "slot": [
         "4R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Snakeskin_Boots",
      "name": "Snakeskin Boots",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Stealth",
         "Melee Combat"
      ],
      "icon": "https://ringofbrodgar.com/images/9/92/Snakeskin_Boots.png",
      "chance_min": "15%",
      "chance_max": "50%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Spectacles",
      "name": "Spectacles",
      "slot": [
         "1R"
      ],
      "bonus": {
         "per": "5"
      },
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Splint",
      "name": "Splint",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Sprucecap",
      "name": "Sprucecap",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/4/47/Sprucecap.png",
      "chance_min": "5%",
      "chance_max": "20%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Stone_Axe",
      "name": "Stone Axe",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Straw_Cape",
      "name": "Straw Cape",
      "slot": [
         "10L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/4/42/Straw_Cape.png",
      "chance_min": "10%",
      "chance_max": "20%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Straw_Hat",
      "name": "Straw Hat",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/b/b2/Straw_Hat.png",
      "chance_min": "10%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Swan_Feather_Cape",
      "name": "Swan Feather Cape",
      "slot": [
         "10L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Exploration"
      ],
      "icon": "https://ringofbrodgar.com/images/f/f8/Swan_Feather_Cape.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Thane%27s_Helm",
      "name": "Thane's Helm",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "-1"
      },
      "armor": {
         "hp": "90",
         "abs_x": "8",
         "abs_y": "8"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Thane%27s_Ring",
      "name": "Thane's Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "str": "10",
         "agi": "5",
         "cha": "7"
      },
      "armor": {},
      "affinity": [
         "Charisma",
         "Strength"
      ],
      "icon": "https://ringofbrodgar.com/images/b/bb/Thane%27s_Ring.png",
      "chance_min": "20%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/The_Abominable_Snowman",
      "name": "The Abominable Snowman",
      "slot": [
         "1R and 2R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/The_Perfect_Hole",
      "name": "The Perfect Hole",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Tick",
      "name": "Tick",
      "slot": [
         ""
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Tinker%27s_Shovel",
      "name": "Tinker's Shovel",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Tinker%27s_Throwing_Axe",
      "name": "Tinker's Throwing Axe",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Toga",
      "name": "Toga",
      "slot": [
         "8L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/a/a3/Toga.png/23px-Toga.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Torch",
      "name": "Torch",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Traveller%27s_Sack",
      "name": "Traveller's Sack",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Troll_Belt",
      "name": "Troll Belt",
      "slot": [
         "4R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Turtleshell_Helmet",
      "name": "Turtleshell Helmet",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "-1"
      },
      "armor": {
         "hp": "100",
         "abs_x": "2",
         "abs_y": "3"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Vapntreyiu",
      "name": "Vapntreyiu",
      "slot": [
         "3L",
         "8L"
      ],
      "bonus": {},
      "armor": {
         "hp": "100",
         "abs_x": "3",
         "abs_y": "4"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/V%C3%B6lva%27s_Wand",
      "name": "Völva's Wand",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Walrus_Boots",
      "name": "Walrus Boots",
      "slot": [
         "10R"
      ],
      "bonus": {
         "cha": "2",
         "dex": "1"
      },
      "armor": {},
      "affinity": [
         "Strength",
         "Constitution",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/0/05/Walrus_Boots.png",
      "chance_min": "20%",
      "chance_max": "45%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Walrus_Cape",
      "name": "Walrus Cape",
      "slot": [
         "1L and 9L"
      ],
      "bonus": {
         "str": "1",
         "per": "2"
      },
      "armor": {},
      "affinity": [
         "Will",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/4/44/Walrus_Cape.png/23px-Walrus_Cape.png",
      "chance_min": "15%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wanderer%27s_Bindle",
      "name": "Wanderer's Bindle",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Waterflask",
      "name": "Waterflask",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Waterskin",
      "name": "Waterskin",
      "slot": [
         "6L",
         "6R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Whaler%27s_Jacket",
      "name": "Whaler's Jacket",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {
         "str": "3",
         "agi": "1"
      },
      "armor": {
         "hp": "750",
         "abs_x": "7",
         "abs_y": "5"
      },
      "affinity": [
         "Survival",
         "Charisma",
         "Sewing"
      ],
      "icon": "https://ringofbrodgar.com/images/d/df/Whaler%27s_Jacket.png",
      "chance_min": "0%",
      "chance_max": "50%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Whitemetal_Ring",
      "name": "Whitemetal Ring",
      "slot": [
         "7L",
         "7R"
      ],
      "bonus": {
         "str": "1",
         "int": "2"
      },
      "armor": {},
      "affinity": [
         "Intelligence",
         "Smithing",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/f/f6/Whitemetal_Ring.png/48px-Whitemetal_Ring.png",
      "chance_min": "20%",
      "chance_max": "30%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wicker_Picker",
      "name": "Wicker Picker",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wilderness_Skis",
      "name": "Wilderness Skis",
      "slot": [
         "8R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Winged_Helmet",
      "name": "Winged Helmet",
      "slot": [
         "1L"
      ],
      "bonus": {
         "agi": "1"
      },
      "armor": {
         "hp": "250",
         "abs_x": "10",
         "abs_y": "6"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wolf_Cape",
      "name": "Wolf Cape",
      "slot": [
         "1L and 9L"
      ],
      "bonus": {
         "str": "4",
         "agi": "2"
      },
      "armor": {},
      "affinity": [
         "Agility",
         "Strength",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/2/2f/Wolf_Cape.png/23px-Wolf_Cape.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wolverine_Boots",
      "name": "Wolverine Boots",
      "slot": [
         "10R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Will",
         "Exploration",
         "Lore"
      ],
      "icon": "https://ringofbrodgar.com/images/5/5a/Wolverine_Boots.png",
      "chance_min": "15%",
      "chance_max": "40%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wooden_Roundshield",
      "name": "Wooden Roundshield",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {
         "hp": "75",
         "abs_x": "3",
         "abs_y": "1"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wooden_Shovel",
      "name": "Wooden Shovel",
      "slot": [
         "5L and 5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Woodland_Crown",
      "name": "Woodland Crown",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Charisma",
         "Psyche",
         "Exploration"
      ],
      "icon": "https://ringofbrodgar.com/images/thumb/6/60/Woodland_Crown.png/48px-Woodland_Crown.png",
      "chance_min": "35%",
      "chance_max": "50%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Woodland_Cuirass",
      "name": "Woodland Cuirass",
      "slot": [
         "3R"
      ],
      "bonus": {
         "agi": "-1"
      },
      "armor": {
         "hp": "140",
         "abs_x": "2",
         "abs_y": "3"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Woodland_Greaves",
      "name": "Woodland Greaves",
      "slot": [
         "9R"
      ],
      "bonus": {
         "agi": "-1"
      },
      "armor": {
         "hp": "140",
         "abs_x": "2",
         "abs_y": "2"
      }
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Woodsman%27s_Axe",
      "name": "Woodsman's Axe",
      "slot": [
         "5L",
         "5R"
      ],
      "bonus": {},
      "armor": {}
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Woodsman%27s_Tunic",
      "name": "Woodsman's Tunic",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Strength",
         "Carpentry"
      ],
      "icon": "https://ringofbrodgar.com/images/4/4a/Woodsman%27s_Tunic.png",
      "chance_min": "18%",
      "chance_max": "36%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Woodsman%27s_Ushanka",
      "name": "Woodsman's Ushanka",
      "slot": [
         "1L"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Agility",
         "Exploration",
         "Survival"
      ],
      "icon": "https://ringofbrodgar.com/images/a/a9/Woodsman%27s_Ushanka.png",
      "chance_min": "10%",
      "chance_max": "25%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wool_Pants",
      "name": "Wool Pants",
      "slot": [
         "9L",
         "9R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/c/cd/Wool_Pants.png",
      "chance_min": "15%",
      "chance_max": "35%"
   },
   {
      "link": "https://ringofbrodgar.com/wiki/Wool_Shirt",
      "name": "Wool Shirt",
      "slot": [
         "3L",
         "3R"
      ],
      "bonus": {},
      "armor": {},
      "affinity": [
         "Farming"
      ],
      "icon": "https://ringofbrodgar.com/images/0/0f/Wool_Shirt.png",
      "chance_min": "15%",
      "chance_max": "35%"
   }
]

var gilds = [
   {
      "name": "Adder Brooch",
      "link": "https://ringofbrodgar.com/wiki/Adder_Brooch",
      "icon": "https://ringofbrodgar.com/images/thumb/a/a3/Adder_Brooch.png/32px-Adder_Brooch.png",
      "chance_min": "70%",
      "chance_max": "95%",
      "gild_1": "Will +1",
      "gild_2": "Agility +1",
      "gild_3": "Survival +1",
      "gild_4": "",
      "affinity": [
         "Survival",
         "Will"
      ],
      "isGemstone": false
   },
   {
      "name": "Ancient Tooth",
      "link": "https://ringofbrodgar.com/wiki/Ancient_Tooth",
      "icon": "https://ringofbrodgar.com/images/1/12/Ancient_Tooth.png",
      "chance_min": "30%",
      "chance_max": "65%",
      "gild_1": "Carpentry +15",
      "gild_2": "Cooking +12",
      "gild_3": "Melee Combat +9",
      "gild_4": "Masonry +6",
      "affinity": [
         "Agility"
      ],
      "isGemstone": false
   },
   {
      "name": "Badger's Pouch",
      "link": "https://ringofbrodgar.com/wiki/Badger%27s_Pouch",
      "icon": "https://ringofbrodgar.com/images/thumb/6/64/Badger%27s_Pouch.png/32px-Badger%27s_Pouch.png",
      "chance_min": "50%",
      "chance_max": "90%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Bark Reinforcement",
      "link": "https://ringofbrodgar.com/wiki/Bark_Reinforcement",
      "icon": "https://ringofbrodgar.com/images/a/a5/Bark_Reinforcement.png",
      "chance_min": "50%",
      "chance_max": "90%",
      "gild_1": "Unarmed Combat +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Survival",
         "Unarmed Combat"
      ],
      "isGemstone": false
   },
   {
      "name": "Bear Fur Trimmings",
      "link": "https://ringofbrodgar.com/wiki/Bear_Fur_Trimmings",
      "icon": "https://ringofbrodgar.com/images/f/f8/Bear_Fur_Trimmings.png",
      "chance_min": "20%",
      "chance_max": "85%",
      "gild_1": "Strength +1",
      "gild_2": "Melee Combat +1",
      "gild_3": "Unarmed Combat +1",
      "gild_4": "",
      "affinity": [
         "Melee Combat",
         "Sewing",
         "Strength",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Bear Tooth",
      "link": "https://ringofbrodgar.com/wiki/Bear_Tooth",
      "icon": "https://ringofbrodgar.com/images/2/25/Bear_Tooth.png",
      "chance_min": "20%",
      "chance_max": "60%",
      "gild_1": "Strength +2",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Strength"
      ],
      "isGemstone": false
   },
   {
      "name": "Blacksmith's Bauble",
      "link": "https://ringofbrodgar.com/wiki/Blacksmith%27s_Bauble",
      "icon": "https://ringofbrodgar.com/images/1/1f/Blacksmith%27s_Bauble.png",
      "chance_min": "20%",
      "chance_max": "80%",
      "gild_1": "Strength +1",
      "gild_2": "Melee Combat +2",
      "gild_3": "Smithing +3",
      "gild_4": "",
      "affinity": [
         "Smithing",
         "Strength"
      ],
      "isGemstone": false
   },
   {
      "name": "Boarhide Lining",
      "link": "https://ringofbrodgar.com/wiki/Boarhide_Lining",
      "icon": "https://ringofbrodgar.com/images/8/83/Boarhide_Lining.png",
      "chance_min": "35%",
      "chance_max": "75%",
      "gild_1": "Constitution +1",
      "gild_2": "Unarmed Combat  +4",
      "gild_3": "Cooking +2",
      "gild_4": "",
      "affinity": [
         "Strength",
         "Survival",
         "Unarmed Combat"
      ],
      "isGemstone": false
   },
   {
      "name": "Bone Pins",
      "link": "https://ringofbrodgar.com/wiki/Bone_Pins",
      "icon": "https://ringofbrodgar.com/images/d/d5/Bone_Pins.png",
      "chance_min": "35%",
      "chance_max": "100%",
      "gild_1": "Stealth +5",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Stealth"
      ],
      "isGemstone": false
   },
   {
      "name": "Bushcraft Pocket",
      "link": "https://ringofbrodgar.com/wiki/Bushcraft_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/8/8d/Bushcraft_Pocket.png/32px-Bushcraft_Pocket.png",
      "chance_min": "35%",
      "chance_max": "90%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Chef's Pin",
      "link": "https://ringofbrodgar.com/wiki/Chef%27s_Pin",
      "icon": "https://ringofbrodgar.com/images/8/83/Chef%27s_Pin.png",
      "chance_min": "40%",
      "chance_max": "100%",
      "gild_1": "Cooking +5",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Cooking"
      ],
      "isGemstone": false
   },
   {
      "name": "Chitin Sequins",
      "link": "https://ringofbrodgar.com/wiki/Chitin_Sequins",
      "icon": "https://ringofbrodgar.com/images/c/ce/Chitin_Sequins.png",
      "chance_min": "60%",
      "chance_max": "95%",
      "gild_1": "Cooking +3",
      "gild_2": "Carpentry +2",
      "gild_3": "Stealth +1",
      "gild_4": "",
      "affinity": [
         "Agility",
         "Survival",
         "Will"
      ],
      "isGemstone": false
   },
   {
      "name": "Cloth Pocket",
      "link": "https://ringofbrodgar.com/wiki/Cloth_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/9/97/Cloth_Pocket.png/32px-Cloth_Pocket.png",
      "chance_min": "50%",
      "chance_max": "93%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Copper Scales",
      "link": "https://ringofbrodgar.com/wiki/Copper_Scales",
      "icon": "https://ringofbrodgar.com/images/c/c2/Copper_Scales.png",
      "chance_min": "45%",
      "chance_max": "100%",
      "gild_1": "Strength +2",
      "gild_2": "Smithing +3",
      "gild_3": "Lore +6",
      "gild_4": "",
      "affinity": [
         "Smithing",
         "Strength"
      ],
      "isGemstone": false
   },
   {
      "name": "Cornbraid",
      "link": "https://ringofbrodgar.com/wiki/Cornbraid",
      "icon": "https://ringofbrodgar.com/images/8/89/Cornbraid.png",
      "chance_min": "50%",
      "chance_max": "95%",
      "gild_1": "Perception +1",
      "gild_2": "Cooking +2",
      "gild_3": "Farming +3",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Farming"
      ],
      "isGemstone": false
   },
   {
      "name": "Ermine Trimming",
      "link": "https://ringofbrodgar.com/wiki/Ermine_Trimming",
      "icon": "https://ringofbrodgar.com/images/1/19/Ermine_Trimming.png",
      "chance_min": "45%",
      "chance_max": "85%",
      "gild_1": "Strength +3",
      "gild_2": "Charisma +3",
      "gild_3": "Melee Combat +3",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Extra Stitches",
      "link": "https://ringofbrodgar.com/wiki/Extra_Stitches",
      "icon": "https://ringofbrodgar.com/images/a/a8/Extra_Stitches.png",
      "chance_min": "40%",
      "chance_max": "100%",
      "gild_1": "Cooking +2",
      "gild_2": "Survival +2",
      "gild_3": "Unarmed +2",
      "gild_4": "",
      "affinity": [
         "Agility",
         "Charisma",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Fancy Buckle",
      "link": "https://ringofbrodgar.com/wiki/Fancy_Buckle",
      "icon": "https://ringofbrodgar.com/images/0/07/Fancy_Buckle.png",
      "chance_min": "35%",
      "chance_max": "90%",
      "gild_1": "Agility +2",
      "gild_2": "Melee Combat +4",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Melee Combat"
      ],
      "isGemstone": false
   },
   {
      "name": "Feather Stuffing",
      "link": "https://ringofbrodgar.com/wiki/Feather_Stuffing",
      "icon": "https://ringofbrodgar.com/images/2/2a/Feather_Stuffing.png",
      "chance_min": "30%",
      "chance_max": "90%",
      "gild_1": "Agility +1",
      "gild_2": "Exploration +2",
      "gild_3": "Stealth +3",
      "gild_4": "",
      "affinity": [
         "Exploration",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Feather Trinket",
      "link": "https://ringofbrodgar.com/wiki/Feather_Trinket",
      "icon": "https://ringofbrodgar.com/images/4/4e/Feather_Trinket.png",
      "chance_min": "50%",
      "chance_max": "100%",
      "gild_1": "Dexterity +1",
      "gild_2": "Farming +3",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Farming"
      ],
      "isGemstone": false
   },
   {
      "name": "Felt Inlay",
      "link": "https://ringofbrodgar.com/wiki/Felt_Inlay",
      "icon": "https://ringofbrodgar.com/images/0/04/Felt_Inlay.png",
      "chance_min": "45%",
      "chance_max": "85%",
      "gild_1": "Sewing +1",
      "gild_2": "Stealth +2",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Fine Feather Brooch",
      "link": "https://ringofbrodgar.com/wiki/Fine_Feather_Brooch",
      "icon": "https://ringofbrodgar.com/images/c/cf/Fine_Feather_Brooch.png",
      "chance_min": "60%",
      "chance_max": "90%",
      "gild_1": "Lore +3",
      "gild_2": "Masonry +2",
      "gild_3": "Unarmed Combat +2",
      "gild_4": "Will + 1",
      "affinity": [
         "Charisma",
         "Lore",
         "Sewing",
         "Will"
      ],
      "isGemstone": false
   },
   {
      "name": "Finebone Trinkets",
      "link": "https://ringofbrodgar.com/wiki/Finebone_Trinkets",
      "icon": "https://ringofbrodgar.com/images/2/27/Finebone_Trinkets.png",
      "chance_min": "40%",
      "chance_max": "90%",
      "gild_1": "Melee Combat +2",
      "gild_2": "Stealth +1",
      "gild_3": "Will +1",
      "gild_4": "",
      "affinity": [
         "Agility",
         "Sewing",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Forager's Brooch",
      "link": "https://ringofbrodgar.com/wiki/Forager%27s_Brooch",
      "icon": "https://ringofbrodgar.com/images/f/f1/Forager%27s_Brooch.png",
      "chance_min": "40%",
      "chance_max": "100%",
      "gild_1": "Perception +1",
      "gild_2": "Exploration +2",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Exploration"
      ],
      "isGemstone": false
   },
   {
      "name": "Fossil Lapel Pin",
      "link": "https://ringofbrodgar.com/wiki/Fossil_Lapel_Pin",
      "icon": "https://ringofbrodgar.com/images/thumb/f/f3/Fossil_Lapel_Pin.png/32px-Fossil_Lapel_Pin.png",
      "chance_min": "65%",
      "chance_max": "90%",
      "gild_1": "Masonry +1",
      "gild_2": "Smithing +1",
      "gild_3": "Exploration +1",
      "gild_4": "",
      "affinity": [
         "Exploration",
         "Masonry",
         "Strength"
      ],
      "isGemstone": false
   },
   {
      "name": "Foul Smoke",
      "link": "https://ringofbrodgar.com/wiki/Foul_Smoke",
      "icon": "https://ringofbrodgar.com/images/0/05/Foul_Smoke.png",
      "chance_min": "20%",
      "chance_max": "80%",
      "gild_1": "Intelligence +5",
      "gild_2": "Psyche +2",
      "gild_3": "Stealth +3",
      "gild_4": "",
      "affinity": [
         "Psyche",
         "Stealth"
      ],
      "isGemstone": false
   },
   {
      "name": "Glass Beads",
      "link": "https://ringofbrodgar.com/wiki/Glass_Beads",
      "icon": "https://ringofbrodgar.com/images/2/26/Glass_Beads.png",
      "chance_min": "40%",
      "chance_max": "90%",
      "gild_1": "Perception +5",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Exploration"
      ],
      "isGemstone": false
   },
   {
      "name": "Gold Cloth Pocket",
      "link": "https://ringofbrodgar.com/wiki/Gold_Cloth_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/2/22/Gold_Cloth_Pocket.png/32px-Gold_Cloth_Pocket.png",
      "chance_min": "70%",
      "chance_max": "95%",
      "gild_1": "Inventory +2",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Lore",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Greased Joints",
      "link": "https://ringofbrodgar.com/wiki/Greased_Joints",
      "icon": "https://ringofbrodgar.com/images/a/ab/Greased_Joints.png",
      "chance_min": "50%",
      "chance_max": "95%",
      "gild_1": "Agility +1",
      "gild_2": "Dexterity +2",
      "gild_3": "Marksmanship +3",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Hard Metal Rivets",
      "link": "https://ringofbrodgar.com/wiki/Hard_Metal_Rivets",
      "icon": "https://ringofbrodgar.com/images/8/82/Hard_Metal_Rivets.png",
      "chance_min": "25%",
      "chance_max": "85%",
      "gild_1": "Melee Combat +3",
      "gild_2": "Carpentry +3",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Charisma"
      ],
      "isGemstone": false
   },
   {
      "name": "Hardened Leather Pocket",
      "link": "https://ringofbrodgar.com/wiki/Hardened_Leather_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/3/3b/Hardened_Leather_Pocket.png/32px-Hardened_Leather_Pocket.png",
      "chance_min": "50%",
      "chance_max": "93%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Heartwood Leaves",
      "link": "https://ringofbrodgar.com/wiki/Heartwood_Leaves",
      "icon": "https://ringofbrodgar.com/images/0/0e/Heartwood_Leaves.png",
      "chance_min": "30%",
      "chance_max": "90%",
      "gild_1": "Perception +5",
      "gild_2": "Farming +5",
      "gild_3": "Cooking +5",
      "gild_4": "",
      "affinity": [
         "Farming",
         "Psyche"
      ],
      "isGemstone": false
   },
   {
      "name": "Hemp Fibre Finery",
      "link": "https://ringofbrodgar.com/wiki/Hemp_Fibre_Finery",
      "icon": "https://ringofbrodgar.com/images/d/db/Hemp_Fibre_Finery.png",
      "chance_min": "40%",
      "chance_max": "90%",
      "gild_1": "Strength +1",
      "gild_2": "Agility +1",
      "gild_3": "Farming +3",
      "gild_4": "",
      "affinity": [
         "Agility",
         "Charisma",
         "Farming"
      ],
      "isGemstone": false
   },
   {
      "name": "Hide Layer",
      "link": "https://ringofbrodgar.com/wiki/Hide_Layer",
      "icon": "https://ringofbrodgar.com/images/a/a1/Hide_Layer.png",
      "chance_min": "45%",
      "chance_max": "85%",
      "gild_1": "Unarmed Combat +2",
      "gild_2": "Melee Combat +2",
      "gild_3": "Survival +2",
      "gild_4": "",
      "affinity": [
         "Exploration",
         "Sewing",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Leather Patch",
      "link": "https://ringofbrodgar.com/wiki/Leather_Patch",
      "icon": "https://ringofbrodgar.com/images/b/b5/Leather_Patch.png",
      "chance_min": "40%",
      "chance_max": "100%",
      "gild_1": "Exploration +3",
      "gild_2": "Survival +3",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Leather Pocket",
      "link": "https://ringofbrodgar.com/wiki/Leather_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/c/cc/Leather_Pocket.png/32px-Leather_Pocket.png",
      "chance_min": "40%",
      "chance_max": "90%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Lynx Claws",
      "link": "https://ringofbrodgar.com/wiki/Lynx_Claws",
      "icon": "https://ringofbrodgar.com/images/c/cf/Lynx_Claws.png",
      "chance_min": "30%",
      "chance_max": "65%",
      "gild_1": "Agility +2",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Agility"
      ],
      "isGemstone": false
   },
   {
      "name": "Magpie's Thieving Claw",
      "link": "https://ringofbrodgar.com/wiki/Magpie%27s_Thieving_Claw",
      "icon": "https://ringofbrodgar.com/images/e/e2/Magpie%27s_Thieving_Claw.png",
      "chance_min": "20%",
      "chance_max": "50%",
      "gild_1": "Stealth +3",
      "gild_2": "Intelligence +2",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Stealth"
      ],
      "isGemstone": false
   },
   {
      "name": "Metal Buttons",
      "link": "https://ringofbrodgar.com/wiki/Metal_Buttons",
      "icon": "https://ringofbrodgar.com/images/0/04/Metal_Buttons.png",
      "chance_min": "40%",
      "chance_max": "90%",
      "gild_1": "Unarmed Combat +3",
      "gild_2": "Smithing +1",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Meteoric Studs",
      "link": "https://ringofbrodgar.com/wiki/Meteoric_Studs",
      "icon": "https://ringofbrodgar.com/images/c/c2/Meteoric_Studs.png",
      "chance_min": "65%",
      "chance_max": "100%",
      "gild_1": "Agility +3",
      "gild_2": "Intelligence +3",
      "gild_3": "Charisma +4",
      "gild_4": "Unarmed Combat +5",
      "affinity": [
         "Agility",
         "Lore",
         "Smithing",
         "Strength"
      ],
      "isGemstone": false
   },
   {
      "name": "Mohair Monogram",
      "link": "https://ringofbrodgar.com/wiki/Mohair_Monogram",
      "icon": "https://ringofbrodgar.com/images/1/15/Mohair_Monogram.png",
      "chance_min": "35%",
      "chance_max": "90%",
      "gild_1": "Sewing +6",
      "gild_2": "Melee Combat +4",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Sewing",
         "Strength"
      ],
      "isGemstone": false
   },
   {
      "name": "Mole's Pawbone",
      "link": "https://ringofbrodgar.com/wiki/Mole%27s_Pawbone",
      "icon": "https://ringofbrodgar.com/images/3/38/Mole%27s_Pawbone.png",
      "chance_min": "45%",
      "chance_max": "80%",
      "gild_1": "Masonry +3",
      "gild_2": "Exploration +2",
      "gild_3": "Perception +1",
      "gild_4": "",
      "affinity": [
         "Agility",
         "Masonry",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Moose Antler Buttons",
      "link": "https://ringofbrodgar.com/wiki/Moose_Antler_Buttons",
      "icon": "https://ringofbrodgar.com/images/d/dd/Moose_Antler_Buttons.png",
      "chance_min": "30%",
      "chance_max": "95%",
      "gild_1": "Unarmed Combat +4",
      "gild_2": "Will +2",
      "gild_3": "Agility +1",
      "gild_4": "",
      "affinity": [
         "Sewing",
         "Strength",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Patterned Embroidery",
      "link": "https://ringofbrodgar.com/wiki/Patterned_Embroidery",
      "icon": "https://ringofbrodgar.com/images/e/e5/Patterned_Embroidery.png",
      "chance_min": "30%",
      "chance_max": "90%",
      "gild_1": "Sewing +5",
      "gild_2": "Unarmed Combat +3",
      "gild_3": "Strength +1",
      "gild_4": "",
      "affinity": [
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Petraglyph",
      "link": "https://ringofbrodgar.com/wiki/Petraglyph",
      "icon": "https://ringofbrodgar.com/images/b/ba/Petraglyph.png",
      "chance_min": "50%",
      "chance_max": "95%",
      "gild_1": "Intelligence +1",
      "gild_2": "Masonry +2",
      "gild_3": "Lore +3",
      "gild_4": "",
      "affinity": [
         "Lore",
         "Masonry"
      ],
      "isGemstone": false
   },
   {
      "name": "Plumb-Bob",
      "link": "https://ringofbrodgar.com/wiki/Plumb-Bob",
      "icon": "https://ringofbrodgar.com/images/9/99/Plumb-Bob.png",
      "chance_min": "45%",
      "chance_max": "95%",
      "gild_1": "Intelligence +1",
      "gild_2": "Masonry +4",
      "gild_3": "Smithing +2",
      "gild_4": "",
      "affinity": [
         "Exploration",
         "Intelligence",
         "Masonry"
      ],
      "isGemstone": false
   },
   {
      "name": "Polished Porphyry Beads",
      "link": "https://ringofbrodgar.com/wiki/Polished_Porphyry_Beads",
      "icon": "https://ringofbrodgar.com/images/3/30/Polished_Porphyry_Beads.png",
      "chance_min": "40%",
      "chance_max": "90%",
      "gild_1": "Strength +1",
      "gild_2": "Masonry +2",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Masonry"
      ],
      "isGemstone": false
   },
   {
      "name": "Precious Details",
      "link": "https://ringofbrodgar.com/wiki/Precious_Details",
      "icon": "https://ringofbrodgar.com/images/c/c2/Precious_Details.png",
      "chance_min": "10%",
      "chance_max": "80%",
      "gild_1": "Intelligence +3",
      "gild_2": "Charisma +5",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Agility"
      ],
      "isGemstone": false
   },
   {
      "name": "Quilted Wadding",
      "link": "https://ringofbrodgar.com/wiki/Quilted_Wadding",
      "icon": "https://ringofbrodgar.com/images/thumb/2/2d/Quilted_Wadding.png/32px-Quilted_Wadding.png",
      "chance_min": "20%",
      "chance_max": "100%",
      "gild_1": "Dexterity +3",
      "gild_2": "Sewing +5",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Reed Brooch",
      "link": "https://ringofbrodgar.com/wiki/Reed_Brooch",
      "icon": "https://ringofbrodgar.com/images/thumb/9/9d/Reed_Brooch.png/32px-Reed_Brooch.png",
      "chance_min": "45%",
      "chance_max": "95%",
      "gild_1": "Agility +1",
      "gild_2": "Exploration +1",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Reinforced Hem",
      "link": "https://ringofbrodgar.com/wiki/Reinforced_Hem",
      "icon": "https://ringofbrodgar.com/images/thumb/7/70/Reinforced_Hem.png/31px-Reinforced_Hem.png",
      "chance_min": "25%",
      "chance_max": "100%",
      "gild_1": "Constitution +2",
      "gild_2": "Unarmed Combat +3",
      "gild_3": "Marksmanship +4",
      "gild_4": "",
      "affinity": [
         "Strength",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Rock Crystal",
      "link": "https://ringofbrodgar.com/wiki/Rock_Crystal",
      "icon": "https://ringofbrodgar.com/images/7/71/Rock_Crystal.png",
      "chance_min": "0%",
      "chance_max": "75%",
      "gild_1": "Strength +2",
      "gild_2": "Melee Combat +6",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Melee Combat",
         "Psyche"
      ],
      "isGemstone": false
   },
   {
      "name": "Root Woven Brooch",
      "link": "https://ringofbrodgar.com/wiki/Root_Woven_Brooch",
      "icon": "https://ringofbrodgar.com/images/thumb/6/64/Root_Woven_Brooch.png/32px-Root_Woven_Brooch.png",
      "chance_min": "50%",
      "chance_max": "95%",
      "gild_1": "Exploration +3",
      "gild_2": "Lore +1",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Exploration"
      ],
      "isGemstone": false
   },
   {
      "name": "Rose Gold Clasps",
      "link": "https://ringofbrodgar.com/wiki/Rose_Gold_Clasps",
      "icon": "https://ringofbrodgar.com/images/d/de/Rose_Gold_Clasps.png",
      "chance_min": "50%",
      "chance_max": "90%",
      "gild_1": "Agility +8",
      "gild_2": "Charisma +5",
      "gild_3": "Marksmanship +10",
      "gild_4": "",
      "affinity": [
         "Dexterity"
      ],
      "isGemstone": false
   },
   {
      "name": "Rough Guard Patch",
      "link": "https://ringofbrodgar.com/wiki/Rough_Guard_Patch",
      "icon": "https://ringofbrodgar.com/images/9/95/Rough_Guard_Patch.png",
      "chance_min": "40%",
      "chance_max": "100%",
      "gild_1": "Perception +1",
      "gild_2": "Survival +2",
      "gild_3": "Marksmanship +3",
      "gild_4": "",
      "affinity": [
         "Agility",
         "Sewing",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Shipwreck Buttons",
      "link": "https://ringofbrodgar.com/wiki/Shipwreck_Buttons",
      "icon": "https://ringofbrodgar.com/images/6/62/Shipwreck_Buttons.png",
      "chance_min": "60%",
      "chance_max": "95%",
      "gild_1": "Intelligence +2",
      "gild_2": "Psyche +2",
      "gild_3": "Lore +4",
      "gild_4": "",
      "affinity": [
         "Psyche",
         "Sewing",
         "Stealth"
      ],
      "isGemstone": false
   },
   {
      "name": "Silk Pocket",
      "link": "https://ringofbrodgar.com/wiki/Silk_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/d/dd/Silk_Pocket.png/32px-Silk_Pocket.png",
      "chance_min": "60%",
      "chance_max": "95%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Lore",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Silken Ribbon",
      "link": "https://ringofbrodgar.com/wiki/Silken_Ribbon",
      "icon": "https://ringofbrodgar.com/images/b/b7/Silken_Ribbon.png",
      "chance_min": "30%",
      "chance_max": "90%",
      "gild_1": "Intelligence +2",
      "gild_2": "Charisma +5",
      "gild_3": "Sewing +5",
      "gild_4": "",
      "affinity": [
         "Agility"
      ],
      "isGemstone": false
   },
   {
      "name": "Silkspun Seam",
      "link": "https://ringofbrodgar.com/wiki/Silkspun_Seam",
      "icon": "https://ringofbrodgar.com/images/thumb/7/7e/Silkspun_Seam.png/32px-Silkspun_Seam.png",
      "chance_min": "50%",
      "chance_max": "100%",
      "gild_1": "Agility +3",
      "gild_2": "Psyche +2",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Charisma"
      ],
      "isGemstone": false
   },
   {
      "name": "Snakeskin Stripes",
      "link": "https://ringofbrodgar.com/wiki/Snakeskin_Stripes",
      "icon": "https://ringofbrodgar.com/images/e/e8/Snakeskin_Stripes.png",
      "chance_min": "50%",
      "chance_max": "95%",
      "gild_1": "Intelligence +1",
      "gild_2": "Will +2",
      "gild_3": "Stealth +3",
      "gild_4": "",
      "affinity": [
         "Lore",
         "Stealth",
         "Will"
      ],
      "isGemstone": false
   },
   {
      "name": "Spun Gluethread",
      "link": "https://ringofbrodgar.com/wiki/Spun_Gluethread",
      "icon": "https://ringofbrodgar.com/images/1/14/Spun_Gluethread.png",
      "chance_min": "10%",
      "chance_max": "80%",
      "gild_1": "Agility +3",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Agility"
      ],
      "isGemstone": false
   },
   {
      "name": "Squirrel's Pouch",
      "link": "https://ringofbrodgar.com/wiki/Squirrel%27s_Pouch",
      "icon": "https://ringofbrodgar.com/images/thumb/4/41/Squirrel%27s_Pouch.png/32px-Squirrel%27s_Pouch.png",
      "chance_min": "35%",
      "chance_max": "90%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Taproot Lacing",
      "link": "https://ringofbrodgar.com/wiki/Taproot_Lacing",
      "icon": "https://ringofbrodgar.com/images/7/73/Taproot_Lacing.png",
      "chance_min": "45%",
      "chance_max": "95%",
      "gild_1": "Survival +2",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Troll Hide Ruffle",
      "link": "https://ringofbrodgar.com/wiki/Troll_Hide_Ruffle",
      "icon": "https://ringofbrodgar.com/images/4/45/Troll_Hide_Ruffle.png",
      "chance_min": "30%",
      "chance_max": "90%",
      "gild_1": "Unarmed Combat +8",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Sewing",
         "Strength",
         "Will"
      ],
      "isGemstone": false
   },
   {
      "name": "Troll Pocket",
      "link": "https://ringofbrodgar.com/wiki/Troll_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/d/d9/Troll_Pocket.png/32px-Troll_Pocket.png",
      "chance_min": "70%",
      "chance_max": "95%",
      "gild_1": "Inventory +2",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Turtle Shell Buttons",
      "link": "https://ringofbrodgar.com/wiki/Turtle_Shell_Buttons",
      "icon": "https://ringofbrodgar.com/images/thumb/6/6c/Turtle_Shell_Buttons.png/32px-Turtle_Shell_Buttons.png",
      "chance_min": "50%",
      "chance_max": "85%",
      "gild_1": "Strength +1",
      "gild_2": "Survival +2",
      "gild_3": "Lore +2",
      "gild_4": "",
      "affinity": [
         "Intelligence",
         "Lore",
         "Sewing",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Twig of Spruce",
      "link": "https://ringofbrodgar.com/wiki/Twig_of_Spruce",
      "icon": "https://ringofbrodgar.com/images/b/bc/Twig_of_Spruce.png",
      "chance_min": "60%",
      "chance_max": "90%",
      "gild_1": "Survival +1",
      "gild_2": "Lore +1",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Exploration",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Wax-Impregnated Lining",
      "link": "https://ringofbrodgar.com/wiki/Wax-Impregnated_Lining",
      "icon": "https://ringofbrodgar.com/images/5/5c/Wax-Impregnated_Lining.png",
      "chance_min": "50%",
      "chance_max": "100%",
      "gild_1": "Exploration +5",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Exploration"
      ],
      "isGemstone": false
   },
   {
      "name": "Whalebone Clasps",
      "link": "https://ringofbrodgar.com/wiki/Whalebone_Clasps",
      "icon": "https://ringofbrodgar.com/images/5/57/Whalebone_Clasps.png",
      "chance_min": "50%",
      "chance_max": "95%",
      "gild_1": "Melee Combat +3",
      "gild_2": "Unarmed Combat +3",
      "gild_3": "Agility +4",
      "gild_4": "",
      "affinity": [
         "Agility",
         "Sewing",
         "Stealth",
         "Strength"
      ],
      "isGemstone": false
   },
   {
      "name": "Wolf's Claw",
      "link": "https://ringofbrodgar.com/wiki/Wolf%27s_Claw",
      "icon": "https://ringofbrodgar.com/images/9/9e/Wolf%27s_Claw.png",
      "chance_min": "25%",
      "chance_max": "65%",
      "gild_1": "Strength +1",
      "gild_2": "Agility +1",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Strength"
      ],
      "isGemstone": false
   },
   {
      "name": "Woodsman's Token",
      "link": "https://ringofbrodgar.com/wiki/Woodsman%27s_Token",
      "icon": "https://ringofbrodgar.com/images/thumb/3/31/Woodsman%27s_Token.png/32px-Woodsman%27s_Token.png",
      "chance_min": "50%",
      "chance_max": "95%",
      "gild_1": "Carpentry +3",
      "gild_2": "Lore +2",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Carpentry",
         "Charisma",
         "Exploration",
         "Lore"
      ],
      "isGemstone": false
   },
   {
      "name": "Wool Cloth Collar",
      "link": "https://ringofbrodgar.com/wiki/Wool_Cloth_Collar",
      "icon": "https://ringofbrodgar.com/images/1/19/Wool_Cloth_Collar.png",
      "chance_min": "45%",
      "chance_max": "95%",
      "gild_1": "Charisma +3",
      "gild_2": "Constitution +3",
      "gild_3": "Sewing +3",
      "gild_4": "",
      "affinity": [
         "Charisma",
         "Dexterity",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Wool Stuffing",
      "link": "https://ringofbrodgar.com/wiki/Wool_Stuffing",
      "icon": "https://ringofbrodgar.com/images/a/ac/Wool_Stuffing.png",
      "chance_min": "40%",
      "chance_max": "100%",
      "gild_1": "Constitution +1",
      "gild_2": "Marksmanship +5",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Agility",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Badger's Pouch",
      "link": "https://ringofbrodgar.com/wiki/Badger%27s_Pouch",
      "icon": "https://ringofbrodgar.com/images/thumb/6/64/Badger%27s_Pouch.png/32px-Badger%27s_Pouch.png",
      "chance_min": "50%",
      "chance_max": "90%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Bushcraft Pocket",
      "link": "https://ringofbrodgar.com/wiki/Bushcraft_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/8/8d/Bushcraft_Pocket.png/32px-Bushcraft_Pocket.png",
      "chance_min": "35%",
      "chance_max": "90%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Cloth Pocket",
      "link": "https://ringofbrodgar.com/wiki/Cloth_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/9/97/Cloth_Pocket.png/32px-Cloth_Pocket.png",
      "chance_min": "50%",
      "chance_max": "93%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Gold Cloth Pocket",
      "link": "https://ringofbrodgar.com/wiki/Gold_Cloth_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/2/22/Gold_Cloth_Pocket.png/32px-Gold_Cloth_Pocket.png",
      "chance_min": "70%",
      "chance_max": "95%",
      "gild_1": "Inventory +2",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing",
         "Lore"
      ],
      "isGemstone": false
   },
   {
      "name": "Hardened Leather Pocket",
      "link": "https://ringofbrodgar.com/wiki/Hardened_Leather_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/3/3b/Hardened_Leather_Pocket.png/32px-Hardened_Leather_Pocket.png",
      "chance_min": "50%",
      "chance_max": "93%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Leather Pocket",
      "link": "https://ringofbrodgar.com/wiki/Leather_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/c/cc/Leather_Pocket.png/32px-Leather_Pocket.png",
      "chance_min": "40%",
      "chance_max": "90%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Silk Pocket",
      "link": "https://ringofbrodgar.com/wiki/Silk_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/d/dd/Silk_Pocket.png/32px-Silk_Pocket.png",
      "chance_min": "60%",
      "chance_max": "95%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing",
         "Lore"
      ],
      "isGemstone": false
   },
   {
      "name": "Squirrel's Pouch",
      "link": "https://ringofbrodgar.com/wiki/Squirrel%27s_Pouch",
      "icon": "https://ringofbrodgar.com/images/thumb/4/41/Squirrel%27s_Pouch.png/32px-Squirrel%27s_Pouch.png",
      "chance_min": "35%",
      "chance_max": "90%",
      "gild_1": "Inventory +1",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Survival"
      ],
      "isGemstone": false
   },
   {
      "name": "Troll Pocket",
      "link": "https://ringofbrodgar.com/wiki/Troll_Pocket",
      "icon": "https://ringofbrodgar.com/images/thumb/d/d9/Troll_Pocket.png/32px-Troll_Pocket.png",
      "chance_min": "70%",
      "chance_max": "95%",
      "gild_1": "Inventory +2",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Dexterity",
         "Sewing"
      ],
      "isGemstone": false
   },
   {
      "name": "Amber",
      "link": "https://ringofbrodgar.com/wiki/Amber",
      "icon": "https://ringofbrodgar.com/images/7/7c/Gem-Jotun_Brilliant_Amber.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Constitution",
      "gild_2": "Agility",
      "gild_3": "Carpentry",
      "gild_4": "Survival",
      "affinity": [
         "Intelligence",
         "Unarmed Combat"
      ],
      "isGemstone": true
   },
   {
      "name": "Amethyst",
      "link": "https://ringofbrodgar.com/wiki/Amethyst",
      "icon": "https://ringofbrodgar.com/images/3/31/Gem-Jotun_Brilliant_Amethyst.png",
      "chance_min": "50%",
      "chance_max": "80%",
      "gild_1": "Constitution",
      "gild_2": "Charisma",
      "gild_3": "Sewing",
      "gild_4": "Melee Combat",
      "affinity": [
         "Exploration"
      ],
      "isGemstone": true
   },
   {
      "name": "Diamond",
      "link": "https://ringofbrodgar.com/wiki/Diamond",
      "icon": "https://ringofbrodgar.com/images/b/b6/Gem-Jotun_Brilliant_Diamond.png",
      "chance_min": "60%",
      "chance_max": "95%",
      "gild_1": "Strength",
      "gild_2": "Agility",
      "gild_3": "Marksmanship",
      "gild_4": "Melee Combat",
      "affinity": [
         "Intelligence",
         "Charisma",
         "Sewing"
      ],
      "isGemstone": true
   },
   {
      "name": "Dust Jewel",
      "link": "https://ringofbrodgar.com/wiki/Dust_Jewel",
      "icon": "https://ringofbrodgar.com/images/e/e4/Gem-Jotun_Brilliant_Dust_Jewel.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Perception",
      "gild_2": "Survival",
      "gild_3": "Exploration",
      "gild_4": "Masonry",
      "affinity": [
         "Exploration"
      ],
      "isGemstone": true
   },
   {
      "name": "Emerald",
      "link": "https://ringofbrodgar.com/wiki/Emerald",
      "icon": "https://ringofbrodgar.com/images/9/94/Gem-Jotun_Brilliant_Emerald.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Charisma",
      "gild_2": "Strength",
      "gild_3": "Farming",
      "gild_4": "Lore",
      "affinity": [
         "Charisma",
         "Farming"
      ],
      "isGemstone": true
   },
   {
      "name": "Jade",
      "link": "https://ringofbrodgar.com/wiki/Jade",
      "icon": "https://ringofbrodgar.com/images/1/12/Gem-Jotun_Brilliant_Jade.png",
      "chance_min": "70%",
      "chance_max": "90%",
      "gild_1": "Psyche",
      "gild_2": "Will",
      "gild_3": "Lore",
      "gild_4": "",
      "affinity": [
         "Psyche",
         "Masonry",
         "Sewing"
      ],
      "isGemstone": true
   },
   {
      "name": "Moonstone",
      "link": "https://ringofbrodgar.com/wiki/Moonstone",
      "icon": "https://ringofbrodgar.com/images/d/d5/Gem-Jotun_Brilliant_Moonstone.png",
      "chance_min": "50%",
      "chance_max": "90%",
      "gild_1": "Psyche",
      "gild_2": "Constitution",
      "gild_3": "Marksmanship",
      "gild_4": "Smithing",
      "affinity": [
         "Lore"
      ],
      "isGemstone": true
   },
   {
      "name": "Onyx",
      "link": "https://ringofbrodgar.com/wiki/Onyx",
      "icon": "https://ringofbrodgar.com/images/7/77/Gem-Jotun_Brilliant_Onyx.png",
      "chance_min": "60%",
      "chance_max": "80%",
      "gild_1": "Will",
      "gild_2": "Intelligence",
      "gild_3": "Stealth",
      "gild_4": "Carpentry",
      "affinity": [
         "Stealth"
      ],
      "isGemstone": true
   },
   {
      "name": "Opal",
      "link": "https://ringofbrodgar.com/wiki/Opal",
      "icon": "https://ringofbrodgar.com/images/9/94/Gem-Jotun_Brilliant_Opal.png",
      "chance_min": "60%",
      "chance_max": "80%",
      "gild_1": "Dexterity",
      "gild_2": "Smithing",
      "gild_3": "Survival",
      "gild_4": "Masonry",
      "affinity": [
         "Smithing",
         "Charisma"
      ],
      "isGemstone": true
   },
   {
      "name": "Oyster Pearl",
      "link": "https://ringofbrodgar.com/wiki/Oyster_Pearl",
      "icon": "https://ringofbrodgar.com/images/6/63/Oyster_Pearl.png",
      "chance_min": "20%",
      "chance_max": "60%",
      "gild_1": "Learning Ability +10",
      "gild_2": "Melee Combat +5",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Strength"
      ],
      "isGemstone": true
   },
   {
      "name": "Red Coral",
      "link": "https://ringofbrodgar.com/wiki/Red_Coral",
      "icon": "https://ringofbrodgar.com/images/7/74/Gem-Jotun_Rough_Red_Coral.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Dexterity",
      "gild_2": "Charisma",
      "gild_3": "Stealth",
      "gild_4": "Lore",
      "affinity": [
         "Dexterity"
      ],
      "isGemstone": true
   },
   {
      "name": "River Pearl",
      "link": "https://ringofbrodgar.com/wiki/River_Pearl",
      "icon": "https://ringofbrodgar.com/images/c/c7/River_Pearl.png",
      "chance_min": "20%",
      "chance_max": "60%",
      "gild_1": "Learning Ability +10",
      "gild_2": "Unarmed Combat +5",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         "Strength"
      ],
      "isGemstone": true
   },
   {
      "name": "Ruby",
      "link": "https://ringofbrodgar.com/wiki/Ruby",
      "icon": "https://ringofbrodgar.com/images/5/54/Gem-Jotun_Brilliant_Ruby.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Strength",
      "gild_2": "Dexterity",
      "gild_3": "Survival",
      "gild_4": "Charisma",
      "affinity": [
         "Strength",
         "Survival"
      ],
      "isGemstone": true
   },
   {
      "name": "Sapphire",
      "link": "https://ringofbrodgar.com/wiki/Sapphire",
      "icon": "https://ringofbrodgar.com/images/b/bd/Gem-Jotun_Brilliant_Sapphire.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Agility",
      "gild_2": "Psyche",
      "gild_3": "Exploration",
      "gild_4": "Cooking",
      "affinity": [
         "Agility",
         "Unarmed Combat"
      ],
      "isGemstone": true
   },
   {
      "name": "Star Shard",
      "link": "https://ringofbrodgar.com/wiki/Star_Shard",
      "icon": "https://ringofbrodgar.com/images/7/77/Gem-Jotun_Brilliant_Onyx.png",
      "chance_min": "",
      "gild_1": "",
      "gild_2": "",
      "gild_3": "",
      "gild_4": "",
      "affinity": [
         ""
      ],
      "isGemstone": true
   },
   {
      "name": "Sugar Diamond",
      "link": "https://ringofbrodgar.com/wiki/Sugar_Diamond",
      "icon": "https://ringofbrodgar.com/images/b/b6/Gem-Jotun_Brilliant_Diamond.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Charisma",
      "gild_2": "Agility",
      "gild_3": "Masonry",
      "gild_4": "Lore",
      "affinity": [
         "Intelligence",
         "Unarmed Combat"
      ],
      "isGemstone": true
   },
   {
      "name": "Topaz",
      "link": "https://ringofbrodgar.com/wiki/Topaz",
      "icon": "https://ringofbrodgar.com/images/5/51/Gem-Jotun_Brilliant_Topaz.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Perception",
      "gild_2": "Carpentry",
      "gild_3": "Charisma",
      "gild_4": "Farming",
      "affinity": [
         "Perception",
         "Cooking"
      ],
      "isGemstone": true
   },
   {
      "name": "Turquoise",
      "link": "https://ringofbrodgar.com/wiki/Turquoise",
      "icon": "https://ringofbrodgar.com/images/c/cc/Gem-Jotun_Brilliant_Turquoise.png",
      "chance_min": "60%",
      "chance_max": "85%",
      "gild_1": "Intelligence",
      "gild_2": "Agility",
      "gild_3": "Exploration",
      "gild_4": "Charisma",
      "affinity": [
         "Intelligence",
         "Unarmed Combat"
      ],
      "isGemstone": true
   }
]