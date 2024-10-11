// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks')) || []
let nextId = JSON.parse(localStorage.getItem('nextId'))

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
  //loop through the task list and create a task card for each task
  const $toDoList = $('#todo-cards')
  const $inProgressList = $('#in-progress-cards')
  const $doneList = $('#done-cards')
  $toDoList.empty() // Clear all swim lanes
  $inProgressList.empty()
  $doneList.empty()

  taskList.forEach((task) => {
    const taskElement = $(`<div class="taskCard" id="task-${task.id}">
                                <p>Id: ${task.id}</p>
                                <h3>${task.name}</h3>
                                <p>${task.description}</p>
                                <select id = "state${
                                  task.id
                                }"class="stateDropdown">
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
                            </div>`)
    //Add color classes:
    //Overdue tasks: red, Due Today: Yellow, Done Tasks: green
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
      //remove any other classes
      taskElement.removeClass('overdue')
      taskElement.removeClass('dueToday')
      //Add a smiley.  Hooray!
      taskElement.append('<span>&#128512;</span>')
    }
  })
}
//Check if all fields are filled out before submitting the form
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
    //if the form is complete, call the addTask function
    $('#addTaskModal').hide()
    handleAddTask(event)
  }
}
//  create a function to handle adding a new task
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
    //by default, tasks are in the "toDo" status
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
  //modal.style.display = "none";
  console.log(newTask)
}
function handleEditTask(taskId) {
  // Retrieve the task from the task list
  const task = taskList.find((task) => task.id == taskId)

  console.log(task)

  // Populate the edit modal input fields
  $('#editInput1').val(task.name)
  $('#editInput2').val(task.description)

  // Set the date in the datepicker
  $('#editDatepicker').datepicker('setDate', new Date(task.dueDate))
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  taskList.splice(event, 1)
  console.log(event)
  console.log('Task deleted')
  for (let i = 0; i < taskList.length; i++) {
    taskList[i].id = i
  }
  nextId = taskList.length
  localStorage.setItem(nextId, nextId)
  // Save the updated task list to localStorage
  localStorage.setItem('tasks', JSON.stringify(taskList))
  renderTaskList()
}
//create a function to handle changing a task's status
function statusChange(event) {}
// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const cardId = $(event.target).closest('.card').attr('id').split('-')[1]
  const newStatus = $(event.target).val()
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  //call the functions to render the task list, add event listeners, make lanes droppable,
  renderTaskList()
  $('.lane').droppable({
    accept: '.card',
    drop: function (event, ui) {
      const droppedCard = ui.helper.clone()
      $(this).find('.card-body').append(droppedCard)
      ui.helper.remove()
    },
  })
})

//Create a modal when the "Add Task" button is clicked
//Event Listeners:
//Add Task and Datepicker:
$('#openModal').click(function () {
  $('#addTaskModal').show()
})

span.onclick = function () {
  //modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    //modal.style.display = "none";
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
// When the form is submitted, call the for form validation function
$('#submitBtn').click(formValidation)

//Clear Storage when the "Clear Storage" button is clicked
$('#clearLocalStorage').click(function () {
  localStorage.clear()
  nextId = ''
  taskList = []
  renderTaskList()
})

//Event listener to change the task status when a dropdown is selected
$(document).on('change', '.stateDropdown', function () {
  console.log($(this).val())
  //find the task id associated with the dropdown and update the task status in the taskList array
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
//Event Listener to edit a task when an edit button is clicked

$(document).on('click', '.editButton', function () {
  taskId = $(this).closest('.taskCard').attr('id').split('-')[1]
  console.log(taskId)
  //initialize the date picker with the current task due date
  $('#editDatepicker').datepicker()
  $('#editModal').show()
  handleEditTask(taskId)
})
//Event listener to delete a task when a delete button is clicked

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

//Submit the edited task when the "Save Changes" button is clicked

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

card.addEventListener('click', () => {
  alert('Card Clicked!')
})

document.addEventListener('mousemove', (event) => {
  card.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`
})
