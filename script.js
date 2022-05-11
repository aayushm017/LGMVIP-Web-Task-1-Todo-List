const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container'); //We are using this and the above 2 items to show and hide the text at the right time..
const addItems = document.querySelectorAll('.add-item');

// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const ideasList = document.getElementById('ideas-list');
const todoList = document.getElementById('todo-list');
const progressList = document.getElementById('progress-list');
const completedList = document.getElementById('completed-list');

// Items
let updatedOnLoad = false; //when we load the page we want to show false that we have have not updated the page from local storage.

// Initialize Arrays 
let ideasListArray = [];
let todoListArray = [];
let progressListArray = [];
let completedListArray = [];
let ListArrays = []; //This ListArray is the array of all of the above arrays.

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('ideasItems')) {
    ideasListArray = JSON.parse(localStorage.ideasItems);
    todoListArray = JSON.parse(localStorage.todoItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completedListArray = JSON.parse(localStorage.completedItems);
  } else {
    ideasListArray = ['Release the course', 'Publish to YouTube'];
    todoListArray = ['Work on projects', 'Listen to music', 'Animate Videos'];
    progressListArray = ['Write Stuff', 'Publish to LinkedIn'];
    completedListArray = ['Getting Stuff Done', 'Animate Title'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  ListArrays = [ideasListArray, todoListArray, progressListArray, completedListArray];
  const arrayNames = ['ideas', 'todo', 'progress', 'completed'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(ListArrays[index]));
  });
}

// Filter Arrays to move empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null); //target each item inside the array and if the item is not equal to null then it passes the check, then it will be added to filtered array constant
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns(); 
  }

  // Ideas Column
  ideasList.textContent = '';  //This ideas or any else task allow us to put the right item into array column
  ideasListArray.forEach((ideasItem, index) => {  
    createItemEl(ideasList, 0, ideasItem, index);
  });
  ideasListArray = filterArray(ideasListArray);

  // Todo Column
  todoList.textContent = '';  
  todoListArray.forEach((todoItem, index) => {
    createItemEl(todoList, 1, todoItem, index);
  });
  todoListArray = filterArray(todoListArray);

  // Progress Column
  progressList.textContent = '';  
  progressListArray.forEach((progressItem, index) => {  
    createItemEl(progressList, 2, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // On Hold Column
  completedList.textContent = '';  
  completedListArray.forEach((completedItem, index) => {  
    createItemEl(completedList, 3, completedItem, index);
  });
  completedListArray = filterArray(completedListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = ListArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];  //to delete the right text
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

//Add to Column List, Reset TextBox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = ListArrays[column]; //choosing array in which we want to add
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM(column);
}

//Show Add item input box
function showInputBox(column) {  //when we click on the add button--
  addBtns[column].style.visibility = 'hidden';  //we wanna hide that button
  saveItemBtns[column].style.display = 'flex';  //then we show our save button
  addItemContainers[column].style.display = 'flex';  //then we show our items container were we will write our texts
}

//Hide item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';  
  saveItemBtns[column].style.display = 'none';  
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

//Allows arrays to reflet drag and drop items
function rebuildArrays() { 
  ideasListArray = Array.from(ideasList.children).map(i => i.textContent);
  // Array.from is used to convert them to an array and then we want to map over it and grab the textContent from each item. We can also replace map to forEach loop.

  todoListArray = Array.from(todoList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completedListArray = Array.from(completedList.children).map(i => i.textContent); 

  updateDOM();
}

//When item starts dragging 
function drag(e) {
  draggedItem = e.target; //that shows us the target of the event that we just triggered
  dragging = true;
}

//Columns allows for Item to drop the element to another element
function allowDrop(e) {
  e.preventDefault();
}

//When the items enters the column Area
function dragEnter(column) {
  listColumns[column].classList.add('over');  //drag the column item and drop into the different column
  currentColumn = column;
}

//Dropping Item in Column
function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  //Remove Background Color/Padding after dragging the items
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });

  //Add Item to Column(which column we wanna drop the item)
  parent.appendChild(draggedItem);
  //Dragging completed
  dragging = false;
  rebuildArrays();
}

//On Load
updateDOM();