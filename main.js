const TODOS = "todos";
const dataTodos = JSON.parse(localStorage.getItem(TODOS)) ?? [];
const $ = document.querySelector.bind(document);
const formPrimaryEl = $("#form");
const inputPrimaryEl = $("#input");
const warningPrimaryEl = formPrimaryEl.querySelector(".form-warning");
const todoList = $(".todo-list");
const overlay = $(".overlay");
const modal = $(".modal");

const todoApp = {
  //Escape html
  escapeHTML(value) {
    const div = document.createElement("div");
    const text = document.createTextNode(value);
    div.appendChild(text);
    return div.innerHTML;
  },

  //Set data
  setData(dataTodos) {
    localStorage.setItem(TODOS, JSON.stringify(dataTodos));
  },

  //Get form
  getForm(value, status) {
    return `
      <p class="todo-content break-words pr-4 max-w-[300px] ${
        status === "disabled" ? "disabled" : null
      }">${this.escapeHTML(value)}</p>
      <div class="flex gap-3">
        <svg class="w-5 aspect-square edit" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen-to-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="currentColor" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
        </svg>
        <svg class="w-5 aspect-square delete" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
        </svg>
      </div>
    `;
  },

  //Show warning
  showWarning(element, warningText) {
    element.classList.add("text-red-400");
    element.innerText = warningText;
    element.classList.remove("hidden");
  },

  //Check input
  checkInput(inputValue, dataTodos) {
    const checkInputObj = {};
    let hasTodo = dataTodos.some(
      (todo) => todo.value.toLowerCase() === inputValue.toLowerCase()
    );
    if (!inputValue) {
      checkInputObj.isValid = false;
      checkInputObj.warningText = "Todo cannot be left blank";
    } else if (hasTodo) {
      checkInputObj.isValid = false;
      checkInputObj.warningText = "The todo already exists";
    } else {
      checkInputObj.isValid = true;
    }
    return checkInputObj;
  },

  //State transition for todo
  stateTransitionTodo(e) {
    const currentTodo = e.target.closest(".todo");
    let todoIndex = currentTodo.dataset.id;
    if (dataTodos[todoIndex].status === "active") {
      e.target.classList.add("disabled");
      dataTodos[todoIndex].status = "disabled";
    } else {
      e.target.classList.remove("disabled");
      dataTodos[todoIndex].status = "active";
    }
    this.setData(dataTodos);
  },

  //Add todo
  addTodo(e) {
    let inputPrimaryValue = inputPrimaryEl.value.trim();
    let checkInputObj = this.checkInput(inputPrimaryValue, dataTodos);
    if (checkInputObj.isValid) {
      const liEl = document.createElement("li");
      liEl.classList.add("todo");
      liEl.dataset.id = dataTodos.length;
      liEl.innerHTML = `
      <p class="todo-content break-words pr-4 max-w-[300px]">${this.escapeHTML(
        inputPrimaryValue
      )}</p>
      <div class="flex gap-3">
        <svg class="w-5 aspect-square edit" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen-to-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="currentColor" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
        </svg>
        <svg class="w-5 aspect-square delete" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
        </svg>
      </div>
    `;
      todoList.appendChild(liEl);
      dataTodos.push({
        value: inputPrimaryValue,
        status: "active",
      });
      this.setData(dataTodos);
      warningPrimaryEl.classList.add("hidden");
    } else {
      this.showWarning(warningPrimaryEl, checkInputObj.warningText);
    }
    inputPrimaryEl.value = "";
    inputPrimaryEl.focus();
  },

  //Delete todo
  deleteTodo(e) {
    let indexTodo = e.target.closest(".todo").dataset.id;
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    modal.querySelector(
      ".notify"
    ).innerText = `Are you sure you want to delete this todo? This action cannot be undone.`;
    modal.querySelector(".confirm-delete").onclick = () => {
      e.target.closest(".todo").remove();
      modal.classList.add("hidden");
      overlay.classList.add("hidden");
      dataTodos.splice(indexTodo, 1);
      todoList.querySelectorAll(".todo").forEach((todo, index) => {
        todo.dataset.id = index;
      });
      this.setData(dataTodos);
    };
    modal.querySelector(".confirm-cancel").onclick = () => {
      modal.classList.add("hidden");
      overlay.classList.add("hidden");
    };
  },

  //Edit todo
  editTodo(e) {
    const currentTodo = e.target.closest(".todo");
    let indexTodo = currentTodo.dataset.id;
    currentTodo.classList.remove("todo");
    let todoContent = currentTodo.querySelector(".todo-content").innerText;
    currentTodo.innerHTML = `
      <form class="form">
        <div class="flex w-full">
          <input class="input" type="text" placeholder="Update task">
          <button class="btn">Update Task</button>
        </div>
        <span class="form-warning hidden"></span>
      </form>
    `;
    currentTodo.querySelector(".input").value = todoContent;
    currentTodo.querySelector(".input").focus();

    currentTodo.querySelector(".form").onsubmit = (e) => {
      e.preventDefault();
      let inputEditvalue = currentTodo.querySelector(".input").value.trim();
      const dataTodosClone = dataTodos.slice();
      dataTodosClone.splice(indexTodo, 1);
      const checkInputObj = this.checkInput(inputEditvalue, dataTodosClone);

      if (checkInputObj.isValid) {
        currentTodo.classList.add("todo");
        let status = dataTodos[indexTodo].status;
        currentTodo.innerHTML = this.getForm(inputEditvalue, status);
        dataTodos[indexTodo].value = inputEditvalue; 
        this.setData(dataTodos);
      } else {
        this.showWarning(
          currentTodo.querySelector(".form-warning"),
          checkInputObj.warningText
        );
      }
    };
  },

  //Handle todo
  handleTodo(e) {
    if (e.target.matches(".delete path")) {
      this.deleteTodo(e);
    } else if (e.target.matches(".edit path")) {
      this.editTodo(e);
    } else if (e.target.matches(".todo-content")) {
      this.stateTransitionTodo(e);
    }
    warningPrimaryEl.classList.add("hidden");
  },

  init(dataTodos) {
    let dataTodoStr = dataTodos
      .map(({ value, status }, index) => `
        <li class="todo" data-id="${index}">
          ${this.getForm(value, status)}
        </li>
      `).join("");
    todoList.innerHTML = dataTodoStr;
  },
};

formPrimaryEl.addEventListener("submit", (e) => {
  e.preventDefault();
  todoApp.addTodo(e);
});

todoList.addEventListener("click", (e) => {
  todoApp.handleTodo(e);
});

todoApp.init(dataTodos);
