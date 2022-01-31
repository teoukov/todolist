let actCount = 0;
let movingI = 0;
let restingI = 0;
let todoItems = [];

class Task {
    constructor(text, className, i, checked) {
        this.text = text
        this.className = className
        this.i = i
    }
}

function setTaskEvents() {
    let lis = document.getElementById("myUL").getElementsByTagName("li");
    for (i = 0; i < todoItems.length; i++) {
        lis[i].setAttribute("draggable", "true");
        lis[i].addEventListener("dragstart", TaskEvents.dragstart);
        lis[i].addEventListener("dragover", TaskEvents.dragover);
        lis[i].addEventListener("drop", TaskEvents.onDrop);
        lis[i].addEventListener("click", TaskEvents.onClick);
    }
}

function update() {
    let ul = document.getElementById("myUL")
    ul.innerHTML = '';

    for (let i = 0; i < todoItems.length; i++) {
        todoItems[i].i = i;
        addLi(todoItems[i].text, todoItems[i].className)
    }

    setTaskEvents();

    // [ToDo] Send todoItems to some kind of database
}

function addCloseButton(li) {
    let btn = document.createElement("BUTTON");
    btn.className = "close";
    btn.addEventListener("click", function () {
        for (i = 0; i < todoItems.length; i++) {
            if (todoItems[i].text === li.textContent) {
                todoItems.splice(i, 1);
                update();
                actCount--;
            }
        }

        this.parentNode.parentNode.removeChild(li);
    });
    return btn;
}

function addLi(text, className="") {
    let li = document.createElement("li");
    let t = document.createTextNode(text);
    li.appendChild(t);
    let btn = addCloseButton(li);
    li.appendChild(btn);
    li.className = className
    document.getElementById("myUL").appendChild(li);
    return li
}

function addTask() {
    let text = document.getElementById("myInput").value;

    if (text === '') {
        alert("You have to enter something !");
    } else if (actCount > 15) {
        alert("There are a lot of tasks there! You will be hyper exhausted");
    } else if (exists(text) === true) {
        alert("There is a task with the same name !");
    } else {
        // Add task
        let task = new Task(text, "", todoItems.length, false)
        todoItems.push(task)
    }
    document.getElementById("myInput").value = "";
    update()
}

//Basic____functions____________________
function makeSpeakFunc(txt) {
    return function () {
        document.getElementById("aiText").innerHTML = txt;
    }
}

function makeSpeak(txt) {
    document.getElementById("aiText").innerHTML = txt;
}

function exists(text) {

    for (i = 0; i < todoItems.length; i++) {
        if (text === todoItems[i].text) {
            return true;
        }
    }
    return false;
}

class TaskEvents {
    static dragstart(e) {
        for (let i = 0; i < todoItems.length; i++) {
            if (e.target.textContent === todoItems[i].text) {
                movingI = i;
            }
        }
    }

    static dragover(e) {
        e.preventDefault();
        for (let i = 0; i < todoItems.length; i++) {
            if (e.target.textContent === todoItems[i].text) {
                restingI = i;
            }
        }
    }

    static onDrop(e) {
        e.preventDefault();

        let tempObj = todoItems[restingI];
        todoItems[restingI] = todoItems[movingI];
        todoItems[movingI] = tempObj;
        update();
    }

    static onClick(e) {
        e.target.classList.toggle('checked');
        for (let i = 0; i < todoItems.length; i++) {
            if (e.target.textContent === todoItems[i].text) {
                if (todoItems[i].className === "") {
                    todoItems[i].className = "checked";
                } else {
                    todoItems[i].className = "";
                }
            }
        }

        update()
    }
}

window.addEventListener("load", function () {
    document.getElementById("myInput").addEventListener("mouseover", makeSpeakFunc("What are you willing to do?.."));
    document.getElementById("myInput").addEventListener("mouseout", makeSpeakFunc(""));
    document.getElementById("myInput").addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.key === 'Enter') {
            addTask();
        }
    });

});
