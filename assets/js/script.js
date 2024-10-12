// Utility function to get and set localStorage
function getLocalStorage(key, defaultValue) {
  return JSON.parse(localStorage.getItem(key)) || defaultValue
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Retrieve tasks and nextId from localStorage
let taskList = getLocalStorage('tasks', [])
let nextId = getLocalStorage('nextId', 0)

// Common DOM element selectors
const modal = $('#addTaskModal')
const btn = $('#openModal')
const span = $('.close')[0]
let taskId = ''

// Generate a unique task id
function generateTaskId() {
  return nextId++
}

// Render the task list and make cards draggable
function renderTaskList() {
  const $toDoList = $('#todo-cards')
  const $inProgressList = $('#in-progress-cards')
  const $doneList = $('#done-cards')
  $toDoList.empty()
  $inProgressList.empty()
  $doneList.empty()

  taskList.forEach((task) => {
    const taskElement = createTaskElement(task)
    assignTaskColors(taskElement, task)

    if (task.state === 'toDo') {
      $toDoList.append(taskElement)
    } else if (task.state === 'inProgress') {
      $inProgressList.append(taskElement)
    } else if (task.state === 'done') {
      $doneList.append(taskElement)
      finalizeDoneTask(taskElement)
    }

    makeTaskDraggable(taskElement)
  })
}

// Create a task element
function createTaskElement(task) {
  return $(`
      <div class="taskCard" id="task-${task.id}" draggable="true">
        <h3>${task.name}</h3>
        <p>${task.description}</p>
        <select id="state${task.id}" class="stateDropdown">
          <option value="toDo" ${
            task.state === 'toDo' ? 'selected' : ''
          }>To Do</option>
          <option value="inProgress" ${
            task.state === 'inProgress' ? 'selected' : ''
          }>In Progress</option>
          <option value="done" ${
            task.state === 'done' ? 'selected' : ''
          }>Done</option>
        </select>
        <p>Due Date: ${dayjs(task.dueDate).format('MM/DD/YY')}</p>
        <button class="btn editButton">Edit</button>
        <button class="btn deleteButton">Delete</button>
      </div>
    `)
}

// Assign colors based on task due date
function assignTaskColors(taskElement, task) {
  const taskDueDate = dayjs(task.dueDate)
  const today = dayjs()

  if (taskDueDate.isBefore(today, 'day')) {
    taskElement.addClass('overdue')
  } else if (taskDueDate.isSame(today, 'day')) {
    taskElement.addClass('dueToday')
  }
}

// Finalize task appearance for "Done" tasks
function finalizeDoneTask(taskElement) {
  taskElement.addClass('done').removeClass('overdue dueToday')
  taskElement.append('<span>&#128512;</span>')
}

// Make a task draggable
function makeTaskDraggable(taskElement) {
  taskElement.draggable({
    revert: 'invalid',
    start: function () {
      $(this).addClass('dragging')
    },
    stop: function () {
      $(this).removeClass('dragging')
    },
  })
}

// Validate form fields
function formValidation(event) {
  const fields = [
    {
      id: '#input1',
      errorId: '#input1Error',
      message: 'Please fill out task title',
    },
    {
      id: '#input2',
      errorId: '#input2Error',
      message: 'Please fill out task description',
    },
    {
      id: '#datepicker',
      errorId: '#datepickerError',
      message: 'Please select a date',
    },
  ]

  let isValid = true
  fields.forEach(({ id, errorId, message }) => {
    if (!$(id).val()) {
      $(errorId).text(message)
      isValid = false
    } else {
      $(errorId).text('')
    }
  })

  if (isValid) {
    handleAddTask(event)
    modal.hide()
  }
}

// Handle adding a new task
function handleAddTask(event) {
  event.preventDefault()
  const newTask = {
    id: generateTaskId(),
    name: $('#input1').val(),
    state: 'toDo',
    description: $('#input2').val(),
    dueDate: $('#datepicker').datepicker('getDate'),
  }

  taskList.push(newTask)
  setLocalStorage('tasks', taskList)
  setLocalStorage('nextId', nextId)

  $('#input1, #input2, #datepicker').val('')
  renderTaskList()
}

// Handle task editing
function handleEditTask(taskId) {
  const taskToEdit = taskList.find((task) => task.id === parseInt(taskId))
  if (taskToEdit) {
    $('#editInput1').val(taskToEdit.name)
    $('#editInput2').val(taskToEdit.description)
    $('#editDatepicker').datepicker('setDate', new Date(taskToEdit.dueDate))
  }
}

// Handle task deletion
function handleDeleteTask(taskId) {
  taskList = taskList.filter((task) => task.id !== parseInt(taskId))
  setLocalStorage('tasks', taskList)
  renderTaskList()
}

// Handle task state change on drop
function handleDrop(event, ui) {
  const cardId = $(ui.draggable).attr('id').split('-')[1]
  const newStatus = $(event.target).attr('id').split('-')[0]
  taskList.forEach((task) => {
    if (task.id === parseInt(cardId)) {
      task.state = newStatus
    }
  })

  setLocalStorage('tasks', taskList)
  renderTaskList()
}

// Event listener setup
$(document).ready(function () {
  renderTaskList()

  $('.lane').droppable({
    accept: '.taskCard',
    drop: handleDrop,
    hoverClass: 'hovered',
  })

  $('#openModal').click(() => modal.show())
  span.onclick = () => modal.hide()

  $(window).click(function (event) {
    if ($(event.target).is(modal)) {
      modal.hide()
    }
  })

  $('#submitBtn').click(formValidation)
  //update state dropdown
  $(document).on('change', '.stateDropdown', function () {
    const taskId = $(this).closest('.taskCard').attr('id').split('-')[1]
    const selectedState = $(this).val()
    taskList.forEach((task) => {
      if (task.id === parseInt(taskId)) {
        task.state = selectedState
      }
    })
    setLocalStorage('tasks', taskList)
    renderTaskList()
  })

  $(document).on('click', '.editButton', function () {
    taskId = $(this).closest('.taskCard').attr('id').split('-')[1]
    $('#editDatepicker').datepicker()
    $('#editModal').show()
    handleEditTask(taskId)
  })

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

  $('#editSubmitBtn').click(function () {
    $('#editModal').hide()
    const editTask = {
      name: $('#editInput1').val(),
      description: $('#editInput2').val(),
      dueDate: $('#editDatepicker').datepicker('getDate'),
    }
    taskList.forEach((task) => {
      if (task.id === parseInt(taskId)) {
        Object.assign(task, editTask)
      }
    })
    setLocalStorage('tasks', taskList)
    renderTaskList()
  })

  $('#datepicker').datepicker()
})
