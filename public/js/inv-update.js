const form = document.querySelector("#edit-vehicle-form")

form.addEventListener("change", function(){
    const updateBtn = document.querySelector("#update-btn")
    updateBtn.removeAttribute("disabled")
})