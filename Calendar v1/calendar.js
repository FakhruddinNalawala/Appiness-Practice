
// function checkSize()    {
//     console.log("Hello")
//     var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
//     console.log(width);
//     if (width<304) {
//         x=document.getElementById("cal-box");
//         console.log(x)
//         x.classList.add("fluid container");
//         console.log(x);
//     }   else if (width>=304) {
//         x=document.getElementById("cal-box");
//         console.log(x)
//         x.classList.remove("fluid container");
//         console.log(x);
//     }
// }

// window.addEventListener('resize', checkSize());

var month=['January','February','March','April','May','June','July','August','September','October','November','December'];
var day=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var weekCount=0;
var dateSpace=document.getElementsByClassName("dateSpace");
dateSpace = Array.from(dateSpace);
console.log(dateSpace);

function toString(curDate) {
    var dd = String(curDate.getDate()).padStart(2, '0');
    var mm = String(curDate.getMonth() + 1).padStart(2, '0'); 
    var yyyy = curDate.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}

for (var year=2020;year<=2050;year++)    {
    var selectYear=document.getElementById("years");
    var newYear=document.createElement("Option");
    newYear.innerHTML=year;
    newYear.value=year;
    newYear.classList.add("item");
    newYear.style.color="black";
    selectYear.appendChild(newYear);
}

function fillBox(curDate) {
    curDay=curDate.getDay();
    console.log(day[curDay]);
    dateSpace.forEach(_box => {
        if(_box.dataset.row == weekCount && _box.dataset.column == curDay) {
            _box.innerHTML=curDate.getDate();
        }
    });
    if (curDay==6)  weekCount++;
    if (weekCount==5)    weekCount=0;
}

var count=0;

function fillDate()  {
    weekCount=0;
    count=0;
    dateSpace.forEach(_box => {
        _box.innerHTML="";
    });
    mm=document.getElementById("select-month").value;
    yyyy=document.getElementById("select-year").value;
    if(!mm || !yyyy)    return;
    document.getElementById("current").innerHTML=month[mm-1]+" of "+yyyy;
    document.getElementById("current").classList.remove("blank");
    var d1= new Date(yyyy+'-'+(mm)+'-01');
    console.log(toString(d1));
    do  {
        fillBox(d1);
        d1.setDate(d1.getDate() + 1);
        var monthCheck = (d1.getMonth() + 1); 
        console.log(toString(d1));
        count++;
    } while(monthCheck==mm && count<100)
    console.log("Exiting");

}
