// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks')) || []
let nextId = JSON.parse(localStorage.getItem('nextId')) || 0

const modal = document.getElementById('addTaskModal')
const btn = document.getElementById('openModal')
const span = document.getElementsByClassName('close')[0]
let taskId = ''

// TODO: create a function to generate a unique task id
function generateTaskId() {
  return nextId++
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Loop through the task list and create a task card for each task
  const $toDoList = $('#todo-cards')
  const $inProgressList = $('#in-progress-cards')
  const $doneList = $('#done-cards')
  $toDoList.empty() // Clear all swim lanes
  $inProgressList.empty()
  $doneList.empty()

  taskList.forEach((task) => {
    const taskElement = $(
      `<div class="taskCard" id="task-${task.id}" draggable="true">
                                <p>Id: ${task.id}</p>
                                <h3>${task.name}</h3>
                                <p>${task.description}</p>
                                <select id="state${
                                  task.id
                                }" class="stateDropdown">
                                    <option value="toDo" ${
                                      task.state === 'toDo' ? 'selected' : ''
                                    }>To Do</option>
                                    <option value="inProgress" ${
                                      task.state === 'inProgress'
                                        ? 'selected'
                                        : ''
                                    }>In Progress</option>
                                    <option value="done" ${
                                      task.state === 'done' ? 'selected' : ''
                                    }>Done</option>
                                </select>
                                <p>Due Date: ${dayjs(task.dueDate).format(
                                  'MM/DD/YY'
                                )}</p>
                                <button class="btn editButton">Edit</button>
                                <button class="btn deleteButton">Delete</button>
                            </div>`
    )
    // Add color classes:
    // Overdue tasks: red, Due Today: Yellow, Done Tasks: green
    const taskDueDate = dayjs(task.dueDate)
    const today = dayjs()
    if (taskDueDate.isBefore(today, 'day')) {
      taskElement.addClass('overdue')
    } else if (taskDueDate.isSame(today, 'day')) {
      taskElement.addClass('dueToday')
    }
    if (task.state === 'toDo') {
      $toDoList.append(taskElement)
    } else if (task.state === 'inProgress') {
      $inProgressList.append(taskElement)
    } else if (task.state === 'done') {
      $doneList.append(taskElement)
      taskElement.addClass('done')
      // Remove any other classes
      taskElement.removeClass('overdue')
      taskElement.removeClass('dueToday')
      // Add a smiley. Hooray!
      taskElement.append('<span>&#128512;</span>')
    }

    // Make the task card draggable
    taskElement.draggable({
      revert: 'invalid', // If not dropped in a droppable, revert to original position
      start: function (event, ui) {
        $(this).addClass('dragging')
      },
      stop: function (event, ui) {
        $(this).removeClass('dragging')
      },
    })
  })
}

// Check if all fields are filled out before submitting the form
function formValidation(event) {
  if (!$('#input1').val()) {
    $('#input1Error').text('Please fill out task title')
  } else {
    $('#input1Error').text('')
  }

  if (!$('#input2').val()) {
    $('#input2Error').text('Please fill out task description')
  } else {
    $('#input2Error').text('')
  }

  if (!$('#datepicker').val()) {
    $('#datepickerError').text('Please select a date')
  } else {
    $('#datepickerError').text('')
  }

  if ($('#input1').val() && $('#input2').val() && $('#datepicker').val()) {
    console.log('Form submitted')
    // If the form is complete, call the addTask function
    $('#addTaskModal').hide()
    handleAddTask(event)
  }
}

// Create a function to handle adding a new task
function handleAddTask(event) {
  // Prevent form submission
  event.preventDefault()
  // Get the input values
  const input1Value = $('#input1').val()
  const input2Value = $('#input2').val()
  const datepickerValue = $('#datepicker').datepicker('getDate')
  // Create a new task object
  const newTask = {
    id: generateTaskId(),
    name: input1Value,
    // By default, tasks are in the "toDo" status
    state: 'toDo',
    description: input2Value,
    dueDate: datepickerValue,
  }
  // Add the task to the task list
  taskList.push(newTask)
  // Save the updated task list to localStorage
  localStorage.setItem('tasks', JSON.stringify(taskList))
  localStorage.setItem('nextId', nextId)
  // Clear the input fields
  $('#input1').val('')
  $('#input2').val('')
  $('#datepicker').val('')
  // Render the updated task list
  renderTaskList()
  // Hide the modals
  console.log(newTask)
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const cardId = $(ui.draggable).attr('id').split('-')[1]
  const newStatus = $(event.target).attr('id').split('-')[0]
  console.log('Dropped card', cardId, 'into', newStatus)
  // Update the task's state in the taskList array
  taskList.forEach((task) => {
    if (task.id === parseInt(cardId)) {
      task.state = newStatus
    }
  })

  // Save the updated task list to localStorage
  localStorage.setItem('tasks', JSON.stringify(taskList))

  // Re-render the task list
  renderTaskList()
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Call the functions to render the task list, add event listeners, make lanes droppable,
  renderTaskList()

  $('.lane').droppable({
    accept: '.taskCard',
    drop: handleDrop,
    hoverClass: 'hovered',
  })
})

// Create a modal when the "Add Task" button is clicked
// Event Listeners:
// Add Task and Datepicker:
$('#openModal').click(function () {
  $('#addTaskModal').show()
})

span.onclick = function () {
  $('#addTaskModal').hide()
}

window.onclick = function (event) {
  if (event.target === modal) {
    $('#addTaskModal').hide()
  }
}

$(document).ready(function () {
  $('#datepicker').click(function () {
    $('#calendarModal').show()
  })
  $('#editDatepicker').click(function () {
    $('#calendarModal').show()
  })
  $('.close').click(function () {
    $('#calendarModal').hide()
    console.log('Modal Closed')
  })

  $('#datepicker').datepicker()
})

// When the form is submitted, call the form validation function
$('#submitBtn').click(formValidation)

// Clear Storage when the "Clear Storage" button is clicked
$('#clearLocalStorage').click(function () {
  localStorage.clear()
  nextId = 0
  taskList = []
  renderTaskList()
})

// Log all tasks when the "Log Tasks" button is clicked
$('#logTasks').click(function () {
  console.log('clicked Log Tasks')
  console.log(taskList)
})
$('#recoverStates').click(function () {
  console.log('clicked Recover States')
  //set all states to 'toDo'
  taskList.forEach((task) => {
    task.state = 'toDo'
  })
  localStorage.setItem('tasks', JSON.stringify(taskList))
  renderTaskList()
})
// Event listener to change the task status when a dropdown is selected
$(document).on('change', '.stateDropdown', function () {
  console.log($(this).val())
  // Find the task id associated with the dropdown and update the task status in the taskList array
  taskId = $(this).closest('.taskCard').attr('id').split('-')[1]
  const selectedState = $(this).val()
  taskList.forEach((task) => {
    if (task.id === parseInt(taskId)) {
      task.state = selectedState
    }
  })
  localStorage.setItem('tasks', JSON.stringify(taskList))
  renderTaskList()
})

// Event Listener to edit a task when an edit button is clicked
$(document).on('click', '.editButton', function () {
  taskId = $(this).closest('.taskCard').attr('id').split('-')[1]
  console.log(taskId)
  // Initialize the date picker with the current task due date
  $('#editDatepicker').datepicker()
  $('#editModal').show()
  handleEditTask(taskId)
})

// Event listener to delete a task when a delete button is clicked
$(document).on('click', '.deleteButton', function () {
  taskId = $(this).closest('.taskCard').attr('id').split('-')[1]
  $('#deleteModal').show()
})

$('#confirmDelete').click(function () {
  $('#deleteModal').hide()
  handleDeleteTask(taskId)
})

$('#cancelDelete').click(function () {
  $('#deleteModal').hide()
})

// Submit the edited task when the "Save Changes" button is clicked
$('#editSubmitBtn').click(function () {
  $('#editModal').hide()

  // Retrieve the updated input values
  const editInput1Value = $('#editInput1').val()
  const editInput2Value = $('#editInput2').val()
  const editDatepickerValue = $('#editDatepicker').datepicker('getDate')

  // Update the task details in the taskList array
  taskList.forEach((task) => {
    if (task.id === parseInt(taskId)) {
      task.name = editInput1Value
      task.description = editInput2Value
      task.dueDate = editDatepickerValue
    }
  })

  // Save the updated task list to localStorage
  localStorage.setItem('tasks', JSON.stringify(taskList))

  // Re-render the task list
  renderTaskList()
})
