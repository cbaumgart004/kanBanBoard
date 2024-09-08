// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const modal = document.getElementById("myModal");
const btn = document.getElementById("openModal");
const span = document.getElementsByClassName("close")[0];
const submitBtn = document.getElementById("submitBtn");
btn.onclick = function() {
    modal.style.display = "block";
};

span.onclick = function() {
    modal.style.display = "none";
};

 window.onclick = function(event) {
    if (event.target == modal) {
modal.style.display = "none";
    }
};

    submitBtn.onclick = function() {
    const input1Value = document.getElementById("input1").value;
    const input2Value = document.getElementById("input2").value;
    // Do something with the input values, e.g., send them to a server
    console.log("Input 1:", input1Value);
    console.log("Input 2:", input2Value);
    modal.style.display = "none";
};
// TODO: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    console.log('button clicked');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});

//Create a modal when the "Add Task" button is clicked
    $('#addTaskButton').on('click', function() {
        $('#addTaskModal').modal('show');
    });