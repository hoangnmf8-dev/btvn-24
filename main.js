document.addEventListener("DOMContentLoaded", () => {
  const $ = document.querySelector.bind(document);
  const appEl = document.querySelector("#app");
  const formPrimaryEl = $("#form");
  const inputPrimaryEl = $("#input");
  const btnPrimaryEl = $("#btn");

  //Escape HTML
  const escapeHTML = (inputValue) => {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(inputValue));
    return div.innerHTML;
  };

  //Render Todo
  const renderTodo = (inputValue) => {
    if (inputValue) {
      const divWrap = document.createElement("div");

      const paragraphEl = document.createElement("p");
      paragraphEl.classList.add("todo-content");
      paragraphEl.innerText = escapeHTML(inputValue);

      const divEl = document.createElement("div");
      divEl.classList.add("flex", "gap-3");
      divEl.innerHTML = `
          <svg
            class="w-5 aspect-square edit"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="pen-to-square"
            class="svg-inline--fa fa-pen-to-square"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
            ></path>
          </svg>
          <svg
            class="w-5 aspect-square delete"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="trash"
            class="svg-inline--fa fa-trash"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            ></path>
          </svg>`;

      divWrap.appendChild(paragraphEl);
      divWrap.appendChild(divEl);
      return divWrap.innerHTML;
    } else {
      const divEl = document.createElement("div");

      const inputEl = document.createElement("input");
      inputEl.classList.add("input");
      inputEl.type = "text";
      inputEl.placeholder = "Update task";
      inputEl.autofocus = true;

      const btnEl = document.createElement("button");
      btnEl.classList.add("btn");
      btnEl.innerText = "Add Task";

      divEl.appendChild(inputEl);
      divEl.appendChild(btnEl);
      return divEl.innerHTML;
    }
  };

  //init Todo
  const init = () => {
    let inputValue = inputPrimaryEl.value.trim();
    if (inputValue) {
      const todo = document.createElement("div");
      todo.classList.add("todo");
      todo.innerHTML = renderTodo(inputValue);
      //Delete
      todo.querySelector(".delete").addEventListener("click", (e) => {
        e.stopPropagation();
        e.currentTarget.closest(".todo").remove();
      });
      //Line through
      todo.querySelector(".todo-content").addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("disabled");
      });
      //Add todo
      appEl.appendChild(todo);
      todo.querySelector(".edit").addEventListener("click", (e) => {
        e.stopPropagation();
        editTodo(e);
      });
    }
    inputPrimaryEl.value = "";
    inputPrimaryEl.focus();
  };

  //Edit Todo
  const editTodo = (e) => {
    const todo = e.target.closest(".todo");

    const formEditEl = document.createElement("form");
    formEditEl.classList.add("form");
    console.log(renderTodo());
    formEditEl.innerHTML = renderTodo();

    const inputEdit = formEditEl.querySelector(".input");
    inputEdit.value = todo.querySelector(".todo-content").innerText;

    appEl.replaceChild(formEditEl, todo);
    inputEdit.focus();

    formEditEl.addEventListener("submit", (e) => {
      e.preventDefault();
      if (inputEdit.value.trim()) {
        todo.querySelector(".todo-content").innerText = inputEdit.value;
        appEl.replaceChild(todo, formEditEl);
      }
    });
  };

  formPrimaryEl.addEventListener("submit", (e) => {
    e.preventDefault();
    init();
  });
});
