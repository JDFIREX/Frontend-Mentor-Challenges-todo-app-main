window.addEventListener('load',(e) => {
    document.querySelector('.todo').innerHTML = localStorage.getItem('todo');
    itemsLeft()
    setDatasetItem()
})

// dark mode / light mode 

let changeThemeBtn = document.querySelector('.mode');

changeThemeBtn.addEventListener("click",(e) => changeTheme(e));

function changeTheme(e){
    let body = document.querySelector("#body");
    let main = document.querySelector("#main");
    let footer = document.querySelector("#footer")
    e.path[0].dataset.theme == "dark" ? changeToLight(e,body,main,footer) : changeToDark(e,body,main,footer)
}
function changeToLight(e,body,main,footer){
    e.path[0].dataset.theme = "light";
    body.classList.add("white_body")
    main.classList.add("white")
    footer.classList.add("white_footer")
}
function changeToDark(e,body,main,footer){
    e.path[0].dataset.theme = "dark";
    body.classList.remove("white_body")
    main.classList.remove("white")
    footer.classList.remove("white_footer")
}

// add todo


let createTodoInput = document.querySelector(".create_input");
let createTodoBtn = document.querySelector(".btn");
let createCheckbox = document.querySelector('.checkbox');
let todo = document.querySelector('.todo');


let check = false;
let todoItem = 0;

// window load check if todo list length -- 0 ?
window.addEventListener('load',(e) => {
    if(todo.childElementCount == 0) {
        todoNavSet("0",true)
    }else{
        todoNavSet("1",false)
    }
})
// create todo list completed
createCheckbox.addEventListener('click',(e) => {
    if(!check){
        check = true;
        createCheckbox.classList.add("checked")
    }else{
        check = false;
        createCheckbox.classList.remove("checked")
    }
});

// add todo item to todo list
createTodoInput.addEventListener('keydown', (e) => e.key == "Enter" ? todoCreate(e) : null);
createTodoBtn.addEventListener("click",(e) => todoCreate(e));

function todoCreate(e){
    let val = createTodoInput.value;
    check ? createCheckbox.classList.remove("checked") : null;
    createTodoInput.value = "";
    val.length == 0 ? alert("u can not pass a empty todo") : createTodoItem(val);
}

function createTodoItem(val){
    let createItem = new Promise(result => {
        let item = document.createElement('div');
        item.classList.add("todo_item");
        item.dataset.item = todoItem;
        item.dataset.checked = false;
        item.dataset.focus = false;
        item.innerHTML = `
        <div class="bg_checkbox" onclick="clicked(this)">
            <div class="item_checkbox"></div>
        </div>
        <p class="item_p">${val}</p>
        <button class="item_btn"><img class="item_img" src="images/icon-cross.svg" onclick="deleteItem(this)" alt="delete todo item"></button>
        `;
        if(check){
            clicked(item.querySelector(".bg_checkbox"))
            item.dataset.checked = true;
            check = false;
        } 
        result(item)
    })
    createItem.then(resolve => {
        todo.appendChild(resolve);
        todoItem++;

        todo.childElementCount == 1 ? todoNavSet("1",false) : null;
        itemsLeft()
        window.localStorage.setItem("todo",todo.innerHTML)
    })
}

// checked todo item
function clicked(e){
    const parent = e.parentNode;
    const parentChecked = parent.dataset.checked;

    if(parentChecked == "true"){
        parent.dataset.checked = false;
        itemsLeft()
        parent.querySelector(".bg_checkbox").classList.remove("checked");
        parent.querySelector(".item_p").classList.remove("item_p_completed")
    }else{
        parent.dataset.checked = true;
        itemsLeft()
        parent.querySelector(".bg_checkbox").classList.add("checked");
        parent.querySelector(".item_p").classList.add("item_p_completed")
    }
    window.localStorage.setItem("todo",todo.innerHTML)
}


// delete todo item
function deleteItem(e){
    todo.removeChild(e.parentNode.parentNode)
    setDatasetItem()
    todoItem -= 1;

    todo.childElementCount == 0 ? todoNavSet("0",true) : null
    itemsLeft()
    window.localStorage.setItem("todo",todo.innerHTML)
}

// count items 
function itemsLeft(){
    let c = 0;
    for(let i = 0 ; i < todo.childElementCount; i++){
        todo.children[i].dataset.checked == "false" ? c++ : null;
    }
    document.querySelector(".count_p").innerHTML = c == 1 ? `${c} item left` : `${c} items left`
}


// button all
let all = document.querySelector(".all_p");
all.addEventListener('click', (e) => select(all,"xxx"))


// active
let active = document.querySelector(".active_p");
active.addEventListener('click', (e) =>select(active,"true"))


// completed 
let completed = document.querySelector(".completed_p")
completed.addEventListener('click', (e) =>select(completed,"false"))

function select(b,c){
    console.log(b)
    if(c == "xxx"){
        b.addEventListener("click",(e) => {
            for(let i = 0 ; i < todo.childElementCount ; i++){
                todo.children[i].style.display = "flex";
            }
        })
    }else{
        for(let i = 0; i < todo.childElementCount ; i++){
            todo.children[i].dataset.checked == c ? todo.children[i].style.display= "none" : todo.children[i].style.display= "flex";
        }
    }
}

// clear completed 
let clearBtn = document.querySelector(".clear_p");

clearBtn.addEventListener("click",(e) => {

    let findChecked =  new Promise(resolve => {
        let index = []
        for(let i = 0; i < todo.childElementCount; i++){
            todo.children[i].dataset.checked == "true"? index.push(todo.children[i]) : null
        }
        resolve(index)
    })
    findChecked.then(result => {
        result.map(a => {
            todo.removeChild(a);
            todoItem--;
        })
        todo.childElementCount == 0 ? todoNavSet("0",true) : null;
        setDatasetItem()
        window.localStorage.setItem("todo",todo.innerHTML)
    })

})

// todonav set
function todoNavSet(o,b){
    document.querySelector(".todo_nav").style.opacity = o
    todoEmpty = b;
}

// set dataset Item list
function setDatasetItem(){
    for(let i = 0; i < todo.childElementCount; i++){
        todo.children[i].dataset.item = i;
    }
}

// drag and move todo item 
let bg = 0;
new Sortable(todo, {
    animation: 150
});

