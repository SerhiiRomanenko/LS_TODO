const $todoList = document.querySelector(".list");
const $createTask = document.querySelector(".main__input");
const $sort = document.querySelector(".sort");

let todo = JSON.parse(window.localStorage.getItem("todo"));

if (!todo) {
    todo = [];
} else {
    render(todo);
}

//-----------------------------------------------------------------------------------RENDER TASKS---------------------------------------------------------------//
function render(arr) {
    $todoList.innerHTML = '';
    arr.forEach(item => {
        const li = document.createElement("li");
        li.setAttribute("data-id", item.id);
        li.classList.add("list__item");
        if (item.status === "active") {
            li.classList.remove("solved");
            li.classList.add("active")
        } else {
            li.classList.remove("active");
            li.classList.add("solved");
        }
        li.innerHTML = `
            <input class="list__checkbox" type="checkbox" ${item.status === "active" ? "" : "checked"}>
            <p class="list__text" contenteditable="">${item.task}</p>
            <svg class="list__delete" fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
\t width="35px" height="35px" viewBox="0 0 482.428 482.429"
\t xml:space="preserve">
<g>
\t<g>
\t\t<path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
\t\t\tc-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
\t\t\th210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
\t\t\tC436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
\t\t\tC206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
\t\t\tc-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
\t\t\tc-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
\t\t\tV115.744z"/>
\t\t<path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
\t\t\tc-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"/>
\t\t<path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
\t\t\tc-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"/>
\t\t<path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
\t\t\tc-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"/>
\t</g>
</g>
</svg>
        `;
        if (li.classList.contains("solved")) {
            li.querySelector(".list__text").removeAttribute("contenteditable");
        }
        $todoList.append(li);
    })
}

//-----------------------------------------------------------------------------------IS UNIQUE TASK---------------------------------------------------------------//
function isUnique(value) {
    let flag = true;
    todo.forEach(item => {
        if (item.task === value) {
            flag = false;
        }
    })
    return flag;
}

//-----------------------------------------------------------------------------------ADDING TASK---------------------------------------------------------------//
function add(value) {
    const item = {
        id: Math.floor(100000000000 + Math.random() * 900000000000),
        task: value,
        status: "active",
    }
    todo.push(item);
    window.localStorage.setItem("todo", JSON.stringify(todo));
}

//-----------------------------------------------------------------------------------DELETE TASK---------------------------------------------------------------//
function del(id) {
    todo = todo.filter(item => item.id !== +id);
    window.localStorage.setItem("todo", JSON.stringify(todo));
}

//-----------------------------------------------------------------------------------EDIT TASK---------------------------------------------------------------//
function edit(id, newValue) {
    const targetTodo = todo.filter(item => item.id === +id);
    targetTodo[0].task = newValue;
    window.localStorage.setItem("todo", JSON.stringify(todo));
}


//-----------------------------------------------------------------------------------TO SOLVE TASK---------------------------------------------------------------//
function solveTask(id) {
    todo.forEach(item => {
        if (item.id === +id) {
            item.status = "solved";
        }
    })
    window.localStorage.setItem("todo", JSON.stringify(todo));
}

//-----------------------------------------------------------------------------------ACTIONS WITH INPUT---------------------------------------------------------------//
$createTask.addEventListener("keypress", function (event) {
    let addingTask = $createTask.value.trim();

    if ((event.key === "Enter" || event.keyCode === 13) && addingTask !== "") {
        if (isUnique(addingTask)) {
            add(addingTask);
            render(todo);
        } else {
            alert("Дана задача вже існує")
        }
        $createTask.value = '';
    }
})

$todoList.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
        solveTask(event.target.parentNode.getAttribute("data-id"));
        render(todo);
    }
    if (event.target.classList.contains("list__delete")) {
        let delConfirmation = confirm("Ви дійсно хочете видалити задачу?");
        if (delConfirmation) {
            del(event.target.parentNode.getAttribute("data-id"));
            render(todo);
        }
    }
})

//-----------------------------------------------------------------------------------CHANGE_TODO---------------------------------------------------------------//
$todoList.addEventListener("focusout", function (event) {
    if (event.target.tagName === "P" && !event.target.parentNode.classList.contains("solved")) {
        if (isUnique(event.target.textContent)) {
        edit(event.target.parentNode.getAttribute("data-id"), event.target.textContent);
        render(todo)
        } else {
            render(todo);
            alert("Дана задача вже існує");
        }
    }
})

//-----------------------------------------------------------------------------------SORT_TODO---------------------------------------------------------------//
$sort.addEventListener("click", function (event) {
    if (event.target.classList.contains("sort__todo")) {
        const onlyTODO = todo.filter(item => item.status === "active");
        render(onlyTODO);
    }
    else if (event.target.classList.contains("sort__done")) {
        const onlySolved = todo.filter(item => item.status === "solved");
        render(onlySolved);
    } else if (event.target.classList.contains("sort__all")) {
        render(todo);
    }
})