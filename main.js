// VARIABLES

var addBtn = document.querySelector('.btn');
var newNoteWindow = document.querySelector('.new-note-window');
var cancelBtn = document.querySelector('.fa-times');
var appWindow = document.querySelector('.app');
var appHeight = Number(appWindow.outerHeight);
var noButton = document.querySelector('.no-button');
var choiceBox = document.querySelector('.choice-box');
var overlay = document.querySelector('#overlay');
var openBtn = document.querySelector('#openBtn');
var deleteBtn = document.querySelector('#deleteBtn');
var bottomBox = document.querySelector('.bottom-box');
var fillOut = document.querySelector('.fillout');
var openNoteWindow= document.querySelector('.open-note-window');
var noteTextHeading = document.getElementById('note-name');

var notes = [];
var store = 0;
var size;


window.onload = init;
    
function init() {
    
    var acceptButton = document.querySelector('.fa-check');
    acceptButton.onclick = GetNoteData;
    LoadListItems();
    appHeight = Number(appWindow.offsetHeight);
    store = notes.length * 60;
    size = Number(bottomBox.style.top);
}

// OBJECT CONSTRUCTOR FUNCTION

function Note(id, task,description,date){
    this.id = id;
    this.task = task;
    this.description = description;
    this.date = date;
}

//TAKES EXISTING ITEMS FROM LOCALSTORAGE AND PUTS IN ARRAY
 function LoadListItems() {
    

     if(localStorage){
      for(var i = 0; i < localStorage.length;i++){
          var key = localStorage.key(i);
          var item = localStorage.getItem(key); //returns value
          var noteItem = JSON.parse(item);
          notes.push(noteItem);
        
      }
         DisplayNotes();
    }
        
    else{
        alert("Error: There is no localStorage");
    }
}
//DISPLAY NOTES DOM ELEMENTS ON SCREEN
function DisplayNotes(){
    var ul = document.getElementById("notes");
    
    var fragment = document.createDocumentFragment(); 
    for(var i = 0; i < notes.length;i++){
        var noteItem = notes[i];
        var li = CreateListElement(noteItem);
        
        ul.appendChild(li);
        
    }
   
   
}
//GENERATES DATE
function getDate(){

    var MyDate = new Date();
    MyDate.setDate(MyDate.getDate());

    var date = ('0' + MyDate.getDate()).slice(-2) + '/'
                + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
                + MyDate.getFullYear();

    return date;
}

//TAKES DATA FROM INPUT AND ADDS IN NEW OBJECT

function GetNoteData(){
    
    var task = document.querySelector('input[type=text]').value;
    var description = document.querySelector('input[type=textarea]').value;

    var date = getDate();
    var id = new Date().getTime(); //to get the unique id
    var noteItem = new Note(id, task,description, date);

    notes.push(noteItem);
    DisplayNewNote(noteItem);
    SaveNoteToLocalStorage(noteItem);

    newNoteWindow.style.display = "none";
    appHeight = Number(appWindow.offsetHeight);

}

//CREATES SINGLE LIST ELEMENT 
function CreateListElement(noteItem){
    var li = document.createElement("li");

    var mydate = document.createElement("div");
    mydate.innerHTML = noteItem.date;
    mydate.classList.add("mydate");
    
    li.setAttribute("id", noteItem.id)
    li.setAttribute("class", "note-text");
    li.innerHTML = "To " + noteItem.task; 

    li.appendChild(mydate);

    var dots = document.createElement("i");
    dots.setAttribute("class", "delete");
    dots.classList.add('fas');
    dots.classList.add('fa-ellipsis-v');

    var notesDivider = document.createElement("div");
    notesDivider.classList.add('line');
    
    li.appendChild(dots);
    li.appendChild(notesDivider);

    dots.onclick = deleteNote;

    return li;
}

//SHOWS NEW NOTE ON SCREEN
function DisplayNewNote(noteItem){
    var ul = document.getElementById("notes");
    var li = CreateListElement(noteItem);
    ul.appendChild(li);
    document.forms[0].reset();
    store = store + 60;
    
}

//SAVES NEW NOTE OBJECT TO LOCALSTORAGE

function SaveNoteToLocalStorage(noteItem){
    if(localStorage){
        var key = "note" + noteItem.id;
        var item = JSON.stringify(noteItem);
        localStorage.setItem(key,item);
    }
    else{
        alert("Error: There is no localStorage");
    }

}

//DELETES NOTE, OPENS BOTTOM BOX, AND YES/NO CHOICE BOX

function deleteNote(e){
   
    displayBottomBox();

    var deleteBtn = document.querySelector('#deleteBtn');
    
    //ACTIONS AFTER CLICKING OPEN NOTE IN BOTTOM BOX
    openBtn.onclick = function(){
        openNoteWindow.style.height = appHeight+'px';
        id = e.target.parentElement.id;
        openNoteWindow.style.display = "block";
        bottomBox.style.display = "none"; 
       
        for(var i =0; i < notes.length;i++){
            if(notes[i].id == id){
                noteTextHeading.innerHTML = notes[i].task;

                var notesDivider = document.createElement("div");
                notesDivider.classList.add('line');
                noteTextHeading.appendChild(notesDivider);

                
                var descriptionText = document.getElementById("area");
                descriptionText.innerHTML = notes[i].description;
                
                var notesDivider = document.createElement("div");
                notesDivider.classList.add('line');
                descriptionText.appendChild(notesDivider);

                //FUNCTION TO GO BACK AFTER PRESSING ARROW
                var back = document.querySelector(".fa-arrow-left");
                back.onclick = function(){
                    openNoteWindow.style.display = "none";
                }
            }      
        }    
        
    };
         // ACTIONS AFTER PRESSING DELETE BUTTON
    deleteBtn.onclick = function(){
        cancelBtn.style.color = "black";
        bottomBox.style.display = "none";
        
        displayYesorNoWindow()

        overlay.style.height = appHeight+'px';
        overlay.style.display = "block"; 

       //IN THIS PLACE IT DELETES NOTE FROM ARRAY, LOCALSTORAGE, PAGE
        var yesButton = document.querySelector('.yes-button');
        yesButton.onclick = function(){

            
            choiceBox.style.display = "none"; 
            overlay.style.display = "none"; 
            id = e.target.parentElement.id;
            console.log(id);

            //remove from localStorage
            var key = "note" + id;
            localStorage.removeItem(key);

            //remove from notes array
            for(var i =0; i < notes.length;i++){
                if(notes[i].id == id){
                     notes.splice(i,1);
                }      
            }     

            //remove from page
            var li = e.target.parentElement;
            var ul = document.getElementById("notes");
            ul.removeChild(li);
            appHeight = Number(appWindow.offsetHeight);
            store-=60;
        };

    };
    
}

//OPENS CHOICE BOX

function displayYesorNoWindow(){
    choiceBox.style.display = "block"; 
    choiceBox.style.top = "250px";
    if(appHeight > 340){
        var x = 181;
        choiceBox.style.top = appHeight/1.6 + 'px';
   }
}

//OPENS BOTTOM BOX 

function displayBottomBox(){
    
   bottomBox.style.top = "340px";
   if(appHeight > 340){
        var x = 182;
        bottomBox.style.top = x + store + 'px';
   }
    
    if (bottomBox.style.display === "none") {
        bottomBox.style.display = "block";
    } else {
        bottomBox.style.display = "none";
    }
}

//GOES TO ADD NEW NOTE WINDOW

addBtn.addEventListener('click', function(event){
 newNoteWindow.style.height = appHeight+'px';
 bottomBox.style.display = "none";
 cancelBtn.style.color = "black";
       addBtn.style.backgroundColor = "#398EBF";
       setTimeout(() => {
       newNoteWindow.style.display = "block"; 
       }, 300);

   });
  
//GOES BACK TO THE MAIN WINDOW AFTER CANCELLING NEW ITEM ADDITION
cancelBtn.addEventListener('click', function(event){
cancelBtn.style.color = "red";
setTimeout(() => {
    fillOut.style.display = "none";
    newNoteWindow.style.display = "none"; 
    }, 300);
});

// GETS BACK TO THE MAIN WINDOW AFTER PRESSING NO IN CHOICE BOX
noButton.addEventListener('click', function(event){
    choiceBox.style.display = "none"; 
    overlay.style.display = "none"; 
});
   
