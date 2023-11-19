
//! ------------->  HTML VARIABLES

let newTaskBtn = document.getElementById("newTask");
let modal = document.getElementById("modal");
let body = document.body;
let statusInput = document.getElementById("status");
let categoryInput = document.getElementById("category");
let titleInput = document.getElementById("title");
let descriptionInput = document.getElementById("description");
let addTaskBtn = document.getElementById("addBtn");
let tasksContainer = document.querySelectorAll(".tasks")
let nextUp = document.getElementById("nextUp");
let inProgress = document.getElementById("inProgress");
let done = document.getElementById("done");
let nextUpCountElement = document.getElementById("nextUpCount");
let inProgressCountElement = document.getElementById("inProgressCount");
let doneCountElement = document.getElementById("doneCount");
let modeBtn = document.getElementById("mode");
let root = document.querySelector(":root");
let gridBtn = document.getElementById("gridBtn");
let barsBtn = document.getElementById("barsBtn");
let section = document.querySelectorAll("section");
let searchInput = document.getElementById("search")
let remainingCounter = document.getElementById("remainingCounter")


//* ---------------> App Variables
let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [] ;
let taskHtml = "";
let nextUpCount = 0;
let inProgressCount = 0;
let doneCount = 0;
let mainIndex;

let titleRegex = /^\w{3,}(\s\w+)*$/;
let descriptionRegex = /^(?=.{5,100}$)\w{1,}(\s\w*)*$/;

for (let i = 0; i < tasksArr.length; i++){
    displayTasks(i);
}




//? --------------> EVENTS

newTaskBtn.addEventListener("click", showModal);

document.addEventListener("keydown", function (e) {
    if (e.code == "Escape") {
        hideModal();
    }
})

modal.addEventListener("click", function (e) {
    if (e.target.id == "modal") {
        hideModal();
    }
})

addTaskBtn.addEventListener("click", addTask);

modeBtn.addEventListener("click", changeMode);

barsBtn.addEventListener("click", changeToBars);

gridBtn.addEventListener("click", changeTogrid);

searchInput.addEventListener("input", searchTask);


titleInput.addEventListener("input", function () {
    validate(titleRegex, titleInput)
});

descriptionInput.addEventListener("input", function () {
    validate(descriptionRegex, descriptionInput);

    descriptionInput.value.length >= 100 ?
        remainingCounter.parentElement.innerHTML = "your available character finished" :
        remainingCounter.innerHTML = 100 - descriptionInput.value.length;
});




//todo -----------> FUNCTIONS

function showModal() {
    modal.classList.replace("d-none", "d-flex");
    body.style.overflow = "hidden";
    scroll(0, 0);
}

function hideModal() {
    modal.classList.replace("d-flex", "d-none");
    body.style.overflow = "visible";
}

function addTask() {
    if (validate(titleRegex, titleInput) && validate(descriptionRegex, descriptionInput)) {
        if (addTaskBtn.innerHTML.trim() == "Add Task") {
            let task = {
                status: statusInput.value,
                category: categoryInput.value,
                title: titleInput.value,
                desc: descriptionInput.value
            };
        
            tasksArr.push(task);
        
            saveTasksToLocal();
        
            displayTasks(tasksArr.length - 1);
        
            resetInputs();
    
            hideModal();
    
        } else if (addTaskBtn.innerHTML == "Update Task") {
            updateTask(mainIndex);
        }
        }
       
}

function displayTasks(index) {
    taskHtml = `
    <div class="task">
      <h5 class="text-capitalize">${tasksArr[index].title}</h5>
      <p class="description text-capitalize">${tasksArr[index].desc}</p>
      <h6 class="category ${tasksArr[index].category} text-capitalize">${tasksArr[index].category}</h6>
      <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
        <li><i class="bi bi-pencil-square" onclick="fetchData(${index})"></i></li>
        <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
        <li><i class="bi bi-palette-fill" onclick="changeColor(event)"></i></li>
      </ul>
  </div>
  `;
    setHtmlLocation(tasksArr[index].status);
}

function setHtmlLocation(status) {
    switch (status) {
        case "nextUp":
            nextUp.innerHTML += taskHtml;
            nextUpCount++;
            nextUpCountElement.innerHTML = nextUpCount;
            break;
        case "inProgress":
            inProgress.innerHTML += taskHtml;
            inProgressCount++;
            inProgressCountElement.innerHTML = inProgressCount;
            break;
        case "done":
            done.innerHTML += taskHtml;
            doneCount++;
            doneCountElement.innerHTML = doneCount;
            break;
    }
}


function deleteTask(index) {
    tasksArr.splice(index, 1);
    saveTasksToLocal();
    resetTasks();
    resetCount();
    for (let i = 0; i < tasksArr.length; i++){
        displayTasks(i);
    }
}

function updateTask(index) {
    tasksArr[index].status = statusInput.value ;
    tasksArr[index].category = categoryInput.value ;
    tasksArr[index].title = titleInput.value;
    tasksArr[index].desc = descriptionInput.value;
    saveTasksToLocal();
    resetInputs();
    resetTasks();
    resetCount()
    for (let i = 0; i < tasksArr.length; i++){
        displayTasks(i);
    }
    addTaskBtn.innerHTML = "Add Task";
    addTaskBtn.classList.replace("btn-update-task", "btn-new-task");
    hideModal();
}

function searchTask() {
    resetTasks();
    resetCount();
    let searchKey = searchInput.value;
    for (let i = 0; i < tasksArr.length; i++){
        if (tasksArr[i].title.toLowerCase().includes(searchKey.toLowerCase()) ||
            tasksArr[i].category.toLowerCase().includes(searchKey.toLowerCase())) {
            displayTasks(i);
        }
    }
}



function saveTasksToLocal() {
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function resetInputs() {
    statusInput.value = "nextUp";
    categoryInput.value = "education";
    titleInput.value = "";
    descriptionInput.value = "";
}

function resetTasks() {
    nextUp.innerHTML = "";
    inProgress.innerHTML = "";
    done.innerHTML = "";

}
function resetCount() {
    nextUpCount = 0;
    inProgressCount = 0;
    doneCount = 0;
    nextUpCountElement.innerHTML = nextUpCount;
    inProgressCountElement.innerHTML = inProgressCount;
    doneCountElement.innerHTML = doneCount;

}

function fetchData(index) {
    statusInput.value = tasksArr[index].status ;
    categoryInput.value = tasksArr[index].category ;
    titleInput.value = tasksArr[index].title;
    descriptionInput.value = tasksArr[index].desc;
    
    showModal();
    addTaskBtn.innerHTML = "Update Task"
    addTaskBtn.classList.replace("btn-new-task", "btn-update-task");
    mainIndex = index;
}

function generateColor() {
    let chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
    let color = "#";
    for (let i = 0; i <= 5; i++){
        randomNumber = Math.trunc(Math.random() * chars.length);
        color += chars[randomNumber];
    }
    return color + "aa";
}

function changeColor(e) {
    e.target.closest(".task").style.backgroundColor = generateColor();
}

function changeMode() {

    if (modeBtn.dataset.mode == "night") {
        root.style.setProperty("--main-black", "#FEFCF3");
        root.style.setProperty("--sec-black", "#F5EBE0");
        root.style.setProperty("--text-color", "#27374D");
        root.style.setProperty("--mid-gray", "#DBA39A");
        root.style.setProperty("--category-education-color", "#FCAEAE");
        root.style.setProperty("--category-finance-color", "#ECCCB2");
        root.style.setProperty("--category-health-color", "#96C291");
        root.style.setProperty("--category-productivity-color", "#F5C6EC");
        modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
        modeBtn.dataset.mode = "light";
    } else if (modeBtn.dataset.mode == "light") {
        root.style.setProperty("--main-black", "#0d1117");
        root.style.setProperty("--sec-black", "#161b22");
        root.style.setProperty("--text-color", "#D8D9DA");
        root.style.setProperty("--mid-gray", "#474a4e");
        root.style.setProperty("--category-education-color", "#A2678A");
        root.style.setProperty("--category-finance-color", "#8D7B68");
        root.style.setProperty("--category-health-color", "#5C8374");
        root.style.setProperty("--category-productivity-color", "#526D82");
        modeBtn.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
        modeBtn.dataset.mode = "night";
    }
}


function changeToBars() {
    gridBtn.classList.remove("active");
    barsBtn.classList.add("active");

    for (let i = 0; i < section.length; i++ ){
        section[i].classList.remove("col-md-6", "col-lg-4");
    }
    
    for (let j = 0; j < tasksContainer.length; j++){
        tasksContainer[j].classList.add("d-flex" , "gap-3" , "overflow-auto");
        tasksContainer[j].setAttribute("data-view", "bars");
    }
}
function changeTogrid() {
    barsBtn.classList.remove("active");
    gridBtn.classList.add("active");

    for (let i = 0; i < section.length; i++ ){
        section[i].classList.add("col-md-6", "col-lg-4");
    }
    for (let j = 0; j < tasksContainer.length; j++){
        tasksContainer[j].classList.remove("d-flex" , "gap-3" , "overflow-auto");
        tasksContainer[j].removeAttribute("data-view");
    }
}


function validate(regex, element) {
    if (regex.test(element.value)) {
        element.parentElement.nextElementSibling.classList.replace("d-block", "d-none");
    } else {
        element.parentElement.nextElementSibling.classList.replace("d-none", "d-block");
    }
    return (regex.test(element.value));
}

