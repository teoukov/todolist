//variables
var i, j;
var actCount;

var movingPos;
var restingPos;

var todoItems = [];

//classes_______________________
class TODOView {

    // model
	static render() {
		var li;
		var t;
		
		document.getElementById("myUL").remove();
		
		var ul = document.createElement("ul");
		ul.setAttribute("id", "myUL");
		document.body.appendChild(ul);
		
		for(i=0; i < todoItems.length; i++){
			li = document.createElement("li");

			for(j=0; j < todoItems.length; j++){
				if(todoItems[j].position === i){
					t = document.createTextNode(todoItems[j].cont);
					li.appendChild(t);
					li.className = todoItems[j].className;
				}
			}
			li.appendChild(addButton(li));
			
			document.getElementById("myUL").appendChild(li);
		}

		actCount = todoItems.length;
		
		setLiEvents();
	}
}
//END_________CLASSES_________________________________

function getData(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/todoItems", true);
	
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			var status = xhr.status;
			
			if((status >= 200 && status< 300) || (status === 304)){
				todoItems = [];
				todoItems = JSON.parse(xhr.responseText);
				
				if(!todoItems){
					actCount = 0;
					todoItems = [];
				}else{
					TODOView.render();
				}
			}
		}
	}
	
	xhr.send(null);
}

function sendData() {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/', true);
	  
	xhr.onreadystatechange = function(){
	  if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
		document.writeln("DONE!");
	  }

	}
	
	var whole = "";
	whole = JSON.stringify(todoItems);
	xhr.send(whole);
}

function addButton(lii){
	var btn = document.createElement("BUTTON");
	btn.className = "close";
	btn.addEventListener("click", function(){

		for(i=0; i < todoItems.length; i++){
			if(todoItems[i].cont === lii.textContent){
				todoItems.splice(i, 1);
				setPositions();
				actCount--;
			}
		}
		
		this.parentNode.parentNode.removeChild(lii);
		sendData();
	});
	return btn;
}

function addTask(){
	
	var li = document.createElement("li");
	var inputVal = document.getElementById("myInput").value;
	var t = document.createTextNode(inputVal);
	li.appendChild(t);
	
	var liData = {
		cont : li.textContent,
		className : li.className,
		position : actCount++
	}
	
	if(inputVal === ''){
		alert("You have to enter soemthing !");
	}else if(actCount > 15){
		alert("There are a lot of tasks there! You will be hyper exhausted");
	}else if(checkExistence(inputVal) === true){
		alert("There is a task with the same name !");
	}else{
		document.getElementById("myUL").appendChild(li);
		
		var btn = addButton(li);
		li.appendChild(btn);
	
		todoItems.push(liData);
		
		setLiEvents();
	}
	document.getElementById("myInput").value = "";
	
	sendData();
}

//Basic____functions____________________
function makeSpeakFunc(txt) {
	return function() {
		document.getElementById("aiText").innerHTML = txt;
	}
}
function makeSpeak(txt) {
	document.getElementById("aiText").innerHTML = txt;
}
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
function checkExistence(text){
	
	for(i=0; i<todoItems.length; i++){
		if(text === todoItems[i].cont){
			return true;
		}
	}
	return false;
}
function setPositions(){
	for(i=0; i<todoItems.length; i++){
		todoItems[i].position = i;
	}
}

//____EVENT______FUNCTIONS_________________________________
function dragstart(e){
	
	for(i=0; i < todoItems.length; i++){
		if(event.target.textContent === todoItems[i].cont){
			movingPos = todoItems[i].position;
		}
	}
}
function dragover() {
	event.preventDefault();
	
	for(i=0; i < todoItems.length; i++){
		if(event.target.textContent === todoItems[i].cont){
			restingPos = todoItems[i].position;
		}
	}
	
}
function onDrop() {
	event.preventDefault();
	
	var tempObj = todoItems[restingPos];
	
	todoItems[restingPos] = todoItems[movingPos];
	todoItems[movingPos] = tempObj;
	
	setPositions();
	
	sendData();
	getData();
}

function setLiEvents(){
	var lis = document.getElementById("myUL").getElementsByTagName("li");
	for(i=0; i < todoItems.length; i++){
	  lis[i].setAttribute("draggable", "true");
	  lis[i].addEventListener("dragstart", dragstart);
	  lis[i].addEventListener("dragover", dragover);
	  lis[i].addEventListener("drop", onDrop);
	  lis[i].addEventListener("click", function(ev){
		ev.target.classList.toggle('checked');
		for(i = 0; i < todoItems.length; i++){
				if(ev.target.textContent === todoItems[i].cont){
					if(todoItems[i].className === ""){
						todoItems[i].className = "checked";
					}else{
						todoItems[i].className = "";
					}
				}
		}
		sendData();
	  });
	}
}

//actions
window.addEventListener("load", function(){
	getData();
	document.getElementById("myInput").addEventListener("mouseover", makeSpeakFunc("What are you willing to do?.."));
	document.getElementById("myInput").addEventListener("mouseout", makeSpeakFunc(""));
	document.getElementById("myInput").addEventListener("keyup", function(event){
		event.preventDefault();
		if(event.keyCode === 13){addTask();}
	});
	
});
//________end___actions______
//exports