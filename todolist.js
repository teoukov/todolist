//variables
var i, j;
var actCount;

var movingTask;
var movingClass;
var restingTxt;

var todoItems;
//____end__variables____

class TODOView {

    // model
	static render() {
		var li;
		var t;
		
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
	}
}
//classes_______________________

function sendData() {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/', true);
	  
	var whole = "";
	whole = JSON.stringify(todoItems);
	  
	xhr.send(whole);
}

function getData(){
	var strArray = [];
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/todoItems", true);
	
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			var status = xhr.status;
			
			if((status >= 200 && status< 300) || (status === 304)){
				todoItems = [];
				todoItems = JSON.parse(xhr.responseText);
				TODOView.render();
			}
		}

	}
	
	xhr.send(null);
}

function addButton(lii){
	var btn = document.createElement("BUTTON");
	btn.className = "close";
	btn.addEventListener("click", function(){
		var temp;
		for(i=0; i < todoItems.length; i++){
			
			if(todoItems[i].cont === lii.textContent){
				temp=i;
				while(i<todoItems.length){
					todoItems[i].position -= 1;
					i++;
				}
				todoItems.splice(temp, 1);
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
	}else if(actCount > 10){
		alert("There are a lot of tasks there! You will be hyper exhausted");
	}else{
		document.getElementById("myUL").appendChild(li);
	}
	document.getElementById("myInput").value = "";
	
	//making close button
	var btn = addButton(li);
	li.appendChild(btn);
	
	todoItems.push(liData);
	
	sendData();
}

function makeSpeakFunc(txt) {
	return function() {
		document.getElementById("aiText").innerHTML = txt;
	}
}
function makeSpeak(txt) {
	document.getElementById("aiText").innerHTML = txt;
}

function dragover(e) {
	e.preventDefault();
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function onDrop() {
	return function(){
		restingTxt = event.target.textContent;
		event.target.textContent = movingTask.textContent;
		movingTask.textContent = restingTxt;
		
		event.target.appendChild(addButton(event.target));
		movingTask.appendChild(addButton(movingTask));
		
		movingClass = event.target.getAttribute("class");
		event.target.setAttribute("class", movingTask.getAttribute("class"));
		movingTask.setAttribute("class", movingClass);
		
		event.preventDefault();
		sendData();
	}	
}

function makeEvents(){
	var lis = document.getElementById("myUL").getElementsByTagName("li");
	for(i=0; i < lis.length; i+=1){
		lis[i].setAttribute("draggable", "true");
		lis[i].addEventListener("dragover", dragover);
		lis[i].addEventListener("drop", onDrop());
	}
}

//actions
window.addEventListener("load", function(){
	getData();
	document.getElementById("addBtn").addEventListener("click", addTask);
	document.getElementById("addBtn").addEventListener("mouseover", makeSpeakFunc("Keep this in mind"));
	document.getElementById("addBtn").addEventListener("mouseout", makeSpeakFunc(""));
	document.getElementById("myInput").addEventListener("mouseover", makeSpeakFunc("What are you willing to do?.."));
	document.getElementById("myInput").addEventListener("mouseout", makeSpeakFunc(""));
	document.getElementById("myInput").addEventListener("keyup", function(event){
		event.preventDefault();
		if(event.keyCode === 13){document.getElementById("addBtn").click();}
		makeEvents();

	});
	
	//checking handler
	var list = document.querySelector('ul');
	list.addEventListener("click", function(ev) {
		if (ev.target.tagName === 'LI') {
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
			sleep(200);
		}
	});
	
});
//________end___actions______
//exports