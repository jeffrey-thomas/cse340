'use strict'

let classificationList = document.querySelector("#select-classification")

classificationList.addEventListener("change", function(){
    let classification_id = classificationList.value
    console.log(`classification_id is: ${classification_id}`)
    let classIdURL = `/inv/getInventory/${classification_id}`
    fetch(classIdURL).then(function(response){
        if(response.ok)
            return response.json()

        throw Error("Network response was not OK")
    }).then(function(data){
        console.log(data)
        buildInventoryList(data)
    }).catch(function(error){
        console.log("There was a problem:", error.message)
    })

})

/**
 * Build inventory items into HTML table
 */
function buildInventoryList(data){
    let inventoryDisplay = document.getElementById("inventoryDisplay")

    let dataTable = '<thead>'

    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'

    dataTable += '</thead><tbody>'

    data.forEach(element=>{
        console.log(`${element.inv_id}, ${element.inv_model}`)

        //vehicle make/model
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`

        //modify link
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</td>`
        //Delete Link
        dataTable += `<td><a href='inv/delete/${element.inv_id}' title='Click to delete'>Delete</td></tr>`
    })

    dataTable += '</tbody>'

    inventoryDisplay.innerHTML = dataTable
}