// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyCLwR1-vfE7S_n9y7akufad28LfGot3OoI",
    authDomain: "testing-2-fakhruddin.firebaseapp.com",
    databaseURL: "https://testing-2-fakhruddin.firebaseio.com",
    projectId: "testing-2-fakhruddin",
    storageBucket: "testing-2-fakhruddin.appspot.com",
    messagingSenderId: "195055167273",
    appId: "1:195055167273:web:b4959fe7bcede528a7b938",
    measurementId: "G-XMPBJJ3MD9"
};

// Connect to Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
console.log("Connected to firestore");
var storageRef = firebase.storage().ref();
console.log("Connected to storage");
var docReference = firestore.collection("Gallery Files");

// Important html elements
var adder = document.querySelector("#form-reveal");
var uploadFile = document.querySelector("#file-upload");
var uploadForm = document.querySelector("#upload-form");
var image = document.getElementById('output');

$("#file-upload").val('');
document.querySelector('header').style.marginBottom=document.querySelector('header').offsetHeight;

// Click to see form
function reveal()  {
    uploadForm.style.display="initial";
    adder.style.display="none";
}

// Event variable
var e;
var count=0;
var fileList = new Array;
var nameList = new Array;

// On uploading of file, preview image and update event variable e
var loadFile = function(event) {
    image.src = URL.createObjectURL(event.target.files[0]);
    e=event;
};

// Reset upload if cancelled
function cancelUpload() {
    $("#file-upload").val('');
    uploadForm.style.display="none";
    adder.style.display="initial";
    image.src='';
}

// Upload image, with validation
function upload()   {
    if (!e) {alert('Please select a file!');}
    var file = e.target.files[0];

    // Refer to storage path for image
    var storageRef = firebase.storage().ref('root/images/'+file.name);
    var task = storageRef.put(file);
    var fileName=file.name;
    e = '';
    file = '';

    // For the above action 'task'
    task.on('state_changed', async function progress(snapshot)    {
        // Show upload process to user
        var perc = snapshot.bytesTransferred * 100 / snapshot.totalBytes;
        uploader.value=perc;
        if (!nameList.includes(fileName))   {
            
            // var listRef = storageRef.child(fileName);
            var fileLink = "gs://testing-2-fakhruddin.appspot.com/"+firebase.storage().ref('root/images/'+fileName).fullPath;
            console.log("Adding to firestore: ", fileName, fileLink);
            docReference.doc(fileName).set({
                link: fileLink
            }).then(function()  {
                console.log("Successfully added ", fileName, ':', fileLink, " to document");
            });
        }
        getimages();
        if (uploader.value == 100)  {
            document.getElementById("message-success").innerHTML=fileName + " Uploaded Successfully";
            await waitASec();await waitASec();await waitASec();await waitASec();
            document.getElementById("message-success").innerHTML=''
            uploader.value=0;
        }
    }, function (err)   {

        // Error handling
        alert("Error occured while uploading: "+err);
        uploadForm.style.display="none";
        adder.style.display="initial";
        $("#file-upload").val('');
    }, async function complete()  {

        // Complete upload process
        console.log("Upload Done");
        await waitASec();
        uploadForm.style.display="none";
        adder.style.display="initial";
        $("#file-upload").val('');
        e='';
        setTimeout(function(){
            image.src='';
        }, 5000);
    });
}

// Cause a delay of 1 second
function waitASec() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        },1000);
    });
}

// Needed variables
var finalLinks = new Array;
var _button = new Array;

// Convert ' ' to '_' to allow use of string as id
function idfy(str)   {
    return (str.replace(/ /g, '_'))
}

// Extract image name
function clean(str)  {
    for (var i=str.length-1;i>=0;i--)   {
        if (str[i]=='/')    return str.slice(i+1);
    }
    return str;
}

// Using firebase to get files
function getimages()    {
    firestore.collection('Gallery Files')
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            if (!nameList.includes(doc.id)) {
                fileList.push(doc.data().link);
                nameList.push(doc.id);
            }
        });
    }).then(function()  {
        for(var i=0;i<nameList.length;i++)  {
            if (!finalLinks.includes(nameList[i]))  {
                const buttons = `
                    <div class='four wide center aligned column button-holder' id='`+idfy(fileList[i].slice(38))+`'>
                        <div class='ui segment image-downloader' id='`+idfy(nameList[i])+`' onclick="downloadImage('`+nameList[i]+`')">
                            <i class='close icon' onclick="deleteImage('`+nameList[i]+`')"></i>
                            <br>`+nameList[i]+`<br><br>
                        </div>
                    </div>
                `;
                document.getElementById("directory").innerHTML += buttons;
                finalLinks.push(nameList[i])
            }
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function resetButton()  {
    // Reset all other elements
    var _buttons = document.querySelectorAll(".button-holder");
    $('.inner-image').remove();
    // Resize other buttons to normal
    _buttons.forEach(element => {
        element.classList.remove("four");
        element.classList.remove("thirteen");
        element.classList.remove("wide");
        element.classList.remove("closeable");
        element.classList.add("four");
        element.classList.add("wide");
    });
}

// Generate download link when image loads
function downloadImage(link)   {   
    var existing = document.querySelector('.closeable');
    if(existing != null && existing.id == idfy('root/images/'+link))  {
        resetButton();
        return;
    }
    resetButton(); 
    // Get reference to storage

    const trueLink=fileList[nameList.indexOf(link)];
    var gsRef=firebase.storage().refFromURL(trueLink);
    
    // id of element whose image is downloaded
    var elementID=(idfy(link));
    
    // Resize current button to large
    var element = document.getElementById(elementID);
    element.parentElement.classList.remove("four");
    element.parentElement.classList.remove("wide");
    element.parentElement.classList.add("thirteen");
    element.parentElement.classList.add("wide");
    element.parentElement.classList.add("closeable");
    console.log('Adding Image');
    element.innerHTML += "<img src='Assets/loading.gif' alt='Loading' width='60%' id='active-image' class='inner-image'>"
    
    gsRef.getDownloadURL().then(function(url) {
        document.getElementById('active-image').src = url;
        element.innerHTML += "<br class='inner-image'><br class='inner-image'><div class='inner-image'><a href="+url+" download="+clean(link)+">Download</a></div>";
        console.log("Added Image");

//      Direct download
        // var xhr = new XMLHttpRequest();
        // xhr.responseType = 'blob';
        // xhr.onload = function(event) {
        //     var blob = xhr.response;
        // };
        // xhr.open('GET', url);
        // xhr.send();
    }).catch(function(error) {
        alert("Error occured while downloading: "+error);
    });
}

function deleteImage(link)  {
    var gsRef = firebase.storage().ref();
    var deleteItem = confirm("Confirm deletion of image?");
    if(!deleteItem) return;
    
    var toRemove = nameList.indexOf(link);
    var toRemove2 = finalLinks.indexOf(nameList[toRemove]);
    finalLinks.splice(toRemove2, 1);
    nameList.splice(toRemove,1);
    fileList.splice(toRemove,1);
    
    var delRef = docReference.doc(link);
    delRef.delete().then(function() {
        console.log(link, "successfully deleted");
        count--;
    }).catch(function (error)   {
        console.log('Error: ', error);
    });

    console.log("Removing from storage")
    gsRef.child('/root/images/'+link).delete().then(async function()  {
        var elemID = 'root/images/'+idfy(link);
        var elem = document.getElementById(elemID);
        elem.remove();
        console.log(link, "Removed!");
    }).then(async function()    {
        document.getElementById("message-success").innerHTML=link + " Deleted Successfully";
        await waitASec();await waitASec();await waitASec();await waitASec();await waitASec();
        document.getElementById("message-success").innerHTML=''
        console.log("Deleted");
    }).catch(function(error)    {
        console.log("Error! Can't Delete!" + error);
    });
}

// Retrieve images when document loads
$(document).ready(getimages());

$(".closeable").click(function()    {
    resetButton();
})