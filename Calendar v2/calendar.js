// Create calendar table
for(var j=0;j<5;j++)    {
    var box=document.getElementById("_"+j);
    box.innerHTML+="<td class='week-holder'>Week "+(j+1)+"</div>";
    for(var k=0;k<7;k++)    {
        box.innerHTML+="<td class='dateSpace' id='_"+j+"_"+k+"'></div>";
    }
}

// For responsiveness, remove word "week"
function sizing()    {
    width= window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var weeks=Array.from(document.getElementsByClassName("week-holder"));
    if (width<768)  {
        weeks.forEach(element => {
            element.innerHTML=element.innerHTML[element.innerHTML.length-1];   
        });
    }
    if(width>=768)   {
        weeks.forEach(element => {
            var _text=element.innerHTML;
            if(_text.length<2)   element.innerHTML="Week "+_text;   
        });  
    }
}

document.onload = sizing();
window.onresize = sizing();

// To add event to calendar
function eventAdd() {
    var butt=document.getElementById("event-button").style.display;
    if (butt=="none")   document.getElementById("event-button").style.display="block";
    else    document.getElementById("event-button").style.display="none";
    var disp=document.getElementById("event-adder").style.display;
    if (disp=="none")   document.getElementById("event-adder").style.display="block";
    else    document.getElementById("event-adder").style.display="none";
}

// Some importatnt variables
var month=['January','February','March','April','May','June','July','August','September','October','November','December'];
var day=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var weekCount=0;
var dateSpace=document.getElementsByClassName("dateSpace");
dateSpace = Array.from(dateSpace);
console.log(dateSpace);
var count=0;

// Convert Date object to string
function toString(curDate) {
    var dd = String(curDate.getDate()).padStart(2, '0');
    var mm = String(curDate.getMonth() + 1).padStart(2, '0'); 
    var yyyy = curDate.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}

// Create year options in datalist
for (var year=2020;year<=2080;year++)    {
    var selectYear=document.getElementById("years");
    var newYear=document.createElement("Option");
    newYear.innerHTML=year;
    newYear.value=year;
    newYear.classList.add("item");
    newYear.style.color="black";
    selectYear.appendChild(newYear);
}

// Enter dates into table
function fillBox(curDate) {
    curDay=curDate.getDay();
    // console.log(day[curDay]);
    dateSpace.forEach(_box => {
        var _boxID=_box.id;
        var _week=_boxID[1];
        var _day=_boxID[3];
        if(_week==weekCount && _day==curDay)    {
            _box.innerHTML=curDate.getDate();
        }
    });
    if (curDay==6)  weekCount++;
    if (weekCount==5)    weekCount=0;
}

// Begins calendar generation by retrieving month and year, and calling fillBox function for each date in month
function fillDate()  {
    weekCount=0;
    count=0;
    dateSpace.forEach(_box => {
        _box.innerHTML="";
    });
    mm=document.getElementById("select-month").value;
    yyyy=document.getElementById("select-year").value;

    // if not selected
    if(!mm || !yyyy)    return;
    document.getElementById("current").innerHTML=month[mm-1]+" of "+yyyy;
    document.getElementById("current").classList.remove("blank");
    var d1= new Date(yyyy+'-'+(mm)+'-01');
    // console.log(toString(d1));

    // Loop through all valid dates
    do  {
        fillBox(d1);
        d1.setDate(d1.getDate() + 1);
        var monthCheck = (d1.getMonth() + 1); 
        // console.log(toString(d1));
        count++;
    } while(monthCheck==mm && count<100)
    console.log("Exiting");
}
