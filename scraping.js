const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Launching browser...")
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("Navigating to Gildables")
    await page.goto('https://ringofbrodgar.com/wiki/Tables/Gildable_Equipment');
    await page.waitForNetworkIdle()

    console.log("Extracting Gildables Data")
    let gildables = await page.evaluate(() => {
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
        return items
    });

    console.log("Navigating to Equipments")
    await page.goto('https://ringofbrodgar.com/wiki/Tables/Equipment_Table');
    await page.waitForNetworkIdle()

    console.log("Extracting Gildables Data")
    let equipments = await page.evaluate(() => {
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
            
            item.slot = "" + (el.childNodes[1].innerText)
            item.slot = item.slot.replace("or",";")
            item.slot = item.slot.split(";")
            for (let i = 0; i < item.slot.length; i++) {
                item.slot[i] = item.slot[i].trim()
            }

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
        return items
    });

    console.log("Navigating to Gilds")
    await page.goto('https://ringofbrodgar.com/wiki/Gilding');
    await page.waitForNetworkIdle()

    console.log("Extracting Gilds Data")
    let gilds = await page.evaluate(() => {
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
        return items
    });
    
    console.log("Merging equipment and gildables data")
    let merged = []
    //merge gildables and equipment data
    for (let i = 0; i < equipments.length; i++) {
        let equipment = equipments[i];
        for (let j = 0; j < gildables.length; j++) {
            const gildable = gildables[j];
            if(gildable.name == equipment.name){
                equipment.affinity = gildable.affinity
                equipment.icon = gildable.icon
                equipment.chance_min = gildable.chance_min
                equipment.chance_max = gildable.chance_max
                break;
            }
        }
        merged.push(equipment)
    }
    let code = fs.readFileSync("./code.js").toString()
    code = code.split("// DATA")[0]

    let data = "// DATA\nvar equipment = " + JSON.stringify(merged, null, 3) 
    data += "\n\nvar gilds = " + JSON.stringify(gilds, null, 3)

    code += data
    fs.writeFileSync('code.js', code); 
    console.log("Data written to code.js")

    await browser.close();
})();
