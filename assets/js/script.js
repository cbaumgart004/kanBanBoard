// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"))||[];
let nextId = JSON.parse(localStorage.getItem("nextId"));

const modal = document.getElementById("myModal");
const btn = document.getElementById("openModal");
const span = document.getElementsByClassName("close")[0];

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

    
$(document).ready(function() {
    $("#openCalendar").click(function() {
      $("#calendarModal").show();
    });

    $(".close").click(function() {
      $("#calendarModal").hide();
    });

    $("#datepicker").datepicker();
  });

// TODO: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //loop through the task list and create a task card for each task
    const $toDoList = $('#todo-cards');
    $toDoList.empty(); // Clear existing tasks before rendering

    taskList.forEach(task => {
        const taskElement = $(`<div class="task" id="task-${task.id}">
                                <p>Id: ${task.id}</p>
                                <h3>${task.name}</h3>
                                <p>${task.description}</p>
                                
                            </div>`);
        $toDoList.append(taskElement);
    });
    
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    // Prevent form submission
    event.preventDefault();
    // Get the input values
    const input1Value = $("#input1").val();
    const input2Value = $("#input2").val();
    const datepickerValue = $("#datepicker").datepicker("getDate");
    // Create a new task object
    const newTask = {
        id: generateTaskId(),
        name: input1Value,
        state: "toDo",
        description: input2Value,
        dueDate: datepickerValue
    };
    // Add the task to the task list
    taskList.push(newTask);
    // Save the updated task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    // Clear the input fields
    $("#input1").val("");
    $("#input2").val("");
    // Render the updated task list
    renderTaskList();
    // Hide the modals
    $('#addTaskModal').modal('hide');
    console.log(newTask);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    //call the functions to render the task list, add event listeners, make lanes droppable,
    renderTaskList();
    $(".task-lane").droppable({
        drop: handleDrop
    });
});

//Create a modal when the "Add Task" button is clicked
  
    // When the form is submitted, call the handleAddTask function
$('#submitBtn').click(handleAddTask);

