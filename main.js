const $todoList = document.querySelector(".list");
const $createTask = document.querySelector(".main__input");

let todo = JSON.parse(window.localStorage.getItem("todo"));

if (!todo) {
    todo = [];
} else {
    render();
}

function render() {
    $todoList.innerHTML = '';
    todo.forEach(item => {
        const li = document.createElement("li");
        li.setAttribute("data-id", item.id);
        li.classList.add("list__item");
        item.status === "active" ? li.classList.add("active") : li.classList.add("solved");
        li.innerHTML = `
            <input type="checkbox" ${item.status === "active" ? "" : "checked"}>
            <p class="list__text" contenteditable="">${item.task}</p>
            <button class="list__delete">delete</button>
        `;
        $todoList.append(li);
    })
}

function isUnique(value) {
    todo.forEach(item => {
        if (item.task === value) {
            return false;
        }
    })
    return true;
}

function add(value) {
    const item = {
        id: Math.floor(100000000000 + Math.random() * 900000000000),
        task: value,
        status: "active",
    }
    todo.push(item);
    window.localStorage.setItem("todo", JSON.stringify(todo));
}

$createTask.addEventListener("keypress", function (event) {
    let addingTask = $createTask.value.trim();
    if ((event.key === "Enter" || event.keyCode === 13) && addingTask !== "") {
        console.log(todo)
        if (isUnique(addingTask)) {
            $createTask.value = '';
            add(addingTask);
            render();
        } else {
            alert("Not unique")
        }
    }
})