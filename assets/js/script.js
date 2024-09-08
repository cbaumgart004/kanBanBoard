// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"))||[];
let nextId = JSON.parse(localStorage.getItem("nextId"));

const modal = document.getElementById("addTaskModal");
const btn = document.getElementById("openModal");
const span = document.getElementsByClassName("close")[0];



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
    const $inProgressList = $('#in-progress-cards');
    const $doneList = $('#done-cards');
    $toDoList.empty(); // Clear all swim lanes
    $inProgressList.empty();
    $doneList.empty();
    
    taskList.forEach(task => {
        const taskElement = $(`<div class="taskCard" id="task-${task.id}">
                                <p>Id: ${task.id}</p>
                                <h3>${task.name}</h3>
                                <p>${task.description}</p>
                                <select id = "state${task.id}"class="stateDropdown">
                                    <option value="toDo" ${task.state === 'toDo' ? 'selected' : ''}>To Do</option>
                                    <option value="inProgress" ${task.state === 'inProgress' ? 'selected' : ''}>In Progress</option>
                                    <option value="done" ${task.state === 'done' ? 'selected' : ''}>Done</option>
                                </select>
                                <p>Due Date: ${dayjs(task.dueDate).format('MM/DD/YY')}</p>
                            </div>`);
    if (task.state === 'toDo') {
        $toDoList.append(taskElement);
    } else if (task.state === 'inProgress') {
        $inProgressList.append(taskElement);
    } else if (task.state === 'done') {
        $doneList.append(taskElement);
    }
    });
    
}
//Check if all fields are filled out before submitting the form
function formValidation(event) {
    if (!$('#input1').val()) {
        $('#input1Error').text('Please fill out task title');
    } else {
        $('#input1Error').text('');
    }

    if (!$('#input2').val()) {
        $('#input2Error').text('Please fill out task description');
    } else {
        $('#input2Error').text('');
    }

    if (!$('#datepicker').val()) {
        $('#datepickerError').text('Please select a date');
    } else {
        $('#datepickerError').text('');
    }

    if ($('#input1').val() && $('#input2').val() && $('#datepicker').val()) {
        console.log('Form submitted');
        //if the form is complete, call the addTask function
        handleAddTask(event);
    }
};
//  create a function to handle adding a new task
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
        //by default, tasks are in the "toDo" status
        state: "toDo",
        description: input2Value,
        dueDate: datepickerValue
    };
    // Add the task to the task list
    taskList.push(newTask);
    // Save the updated task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
    // Clear the input fields
    $("#input1").val("");
    $("#input2").val("");
    $("#datepicker").val("");
    // Render the updated task list
    renderTaskList();
    // Hide the modals
    modal.style.display = "none";
    console.log(newTask);

};

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
//Event Listeners:
//Add Task and Datepicker:
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
    $("#datepicker").click(function() {
      $("#calendarModal").show();
    });

    $(".close").click(function() {
      $("#calendarModal").hide();
    });

    $("#datepicker").datepicker();
  });
// When the form is submitted, call the for form validation function
    $('#submitBtn').click(formValidation);
        
    
//Clear Storage when the "Clear Storage" button is clicked
$("#clearLocalStorage").click(function() {
    localStorage.clear();
    nextId = "";
    taskList = [];
    renderTaskList();
});

//Event listener to change the task status when a dropdown is selected
$(document).on('change', ".stateDropdown", function() {
    console.log($(this).val());
    const taskId = $(this).closest('.taskCard').attr('id').split('-')[1];
    const selectedState = $(this).val();
    taskList.forEach(task => {
        if (task.id === parseInt(taskId)) {
            task.state = selectedState;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
});