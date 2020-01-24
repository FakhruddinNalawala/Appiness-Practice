
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
var docReference = firestore.collection("Gallery 2 Files");

// Important html elements
var uploadFormBox = document.getElementById('upload-form-box');
var fileUpload = document.getElementById('file-upload');
var image = document.getElementById('output');
var directory1 = document.getElementById('directory-1');
var directory2 = document.getElementById('directory-2');
var directory3 = document.getElementById('directory-3');
var cover = document.getElementById('cover');
var imageViewer = document.getElementById('image-viewer');
var imageBox = document.getElementById('image-box');

// Important variables
var dir1 = 0, dir2 = 0, dir3 = 0;
var nameList = [], linkList = [], nameList2 = [];

// When file is selected
var loadFile = function(event) {
    image.src = URL.createObjectURL(event.target.files[0]);
    e=event;
};

// Open up upload form
function openForm()  {
    fileUpload.value='';
    image.src='';
    uploadFormBox.style.display = 'block';
    cover.style.display = 'initial';
    return;
}

// Remove selected file
function cancelUpload() {
    $("#file-upload").val('');
    uploadFormBox.style.display="none";
    document.body.style.backgroundColor = 'white';
    cover.style.display = 'none';
    image.src='';
    e='';
}

function closeImage()   {
    imageViewer.style.display = 'none';
    imageBox.style.display = 'none';
    imageBox.innerHTML = '';
}

function deleteImage(fileName)  {
    console.log('1');

    // Confirm Deletion
    var deleteItem = confirm("Confirm deletion of image?");
    if(!deleteItem) return;
    console.log('2');

    // Remove nodes from HTML
    var deletables = Array.prototype.slice.call(document.getElementsByClassName(fileName));
    console.log(deletables);
    deletables.forEach(element => {
        element.remove();
    });
    console.log('3');

    // Remove from firestore
    docReference.doc(fileName).delete().then(function() {
        console.log('Deleted Successfully');
        nameList.splice(nameList.indexOf(fileName),1);
    }).catch(function(error)    {
        console.log('Error occured:',error);
    });
    console.log('4');

    // Remove from storage
    firebase.storage().ref().child('/root/gallery2/'+fileName).delete().then(async function()  {
        console.log(fileName, "Removed!");
    }).then(async function()    {
        console.log("Deleted");
    }).catch(function(error)    {
        console.log("Error! Can't Delete!" + error);
    });
    console.log('5');
}

// Load image for download/delete on clicking
function loadImage(fileName, urlLocal)    {
    imageViewer.style.display = 'initial';
    imageBox.style.display = 'initial';
    imageBox.innerHTML = `
        <p>`+fileName+`</p>
        <a href='`+urlLocal+`' onclick='closeImage()' download target="_blank">
            <img src ='`+urlLocal+`' class = 'open-image'>
        </a><br>
        <button onclick='closeImage()' class='ui basic button'>Close</button>
        <button onclick="deleteImage('`+fileName+`')" class='ui basic button'>Delete</button>`;
}


// Upload seleceted file
function upload()   {
    if (!e) {alert('Please select a file!');}
    var file = e.target.files[0];
    e='';
    var urlLocal = URL.createObjectURL(file);
    
    // Adding new image to HTML
    var fileName = file.name.replace(/ /g, '_');
    const galleryImage = `  <div class='`+fileName+` image-holder'>
                                <a onclick="loadImage('`+file.name+`','`+urlLocal+`')">
                                    <img src ='`+urlLocal+`' class = 'image-clickable'>
                                </a>
                            </div>`;
    if(!nameList.includes(fileName))    {
        addNewImage(galleryImage);
        nameList.push(fileName);
    }   else    {
        alert('Image already exists');
        return;
    }

    // Uploading Image
    var fileName=file.name.replace(/ /g, '_');
    var storageRef = firebase.storage().ref('root/gallery2/'+fileName);
    var task = storageRef.put(file);

    // For the above action 'task'
    task.on('state_changed', function progress(snapshot)    {
        // Show upload process to user
        var perc = snapshot.bytesTransferred * 100 / snapshot.totalBytes;
        uploader.value=perc;
        var fileLink = "gs://testing-2-fakhruddin.appspot.com/"+firebase.storage().ref('root/gallery2/'+fileName).fullPath;
        console.log(fileName, fileLink)
        docReference.doc(fileName).set({
            link: fileLink,
            uploadDate: String(new Date()).slice(0,33),
            type: 'image/'+fileName.split('.').pop()
        }).then(function()  {console.log("Successfully added ", fileName, ':', fileLink, " to document");});
    }, function (err)   {// Error handling
        alert("Error occured while uploading: "+err);
    }, async function complete()  {// On completion
        console.log('Added Images')
    });
    file = '';
    cancelUpload();
}

// $(document).ready(function() {
function start()    {
    imageList = [];
    firestore.collection('Gallery 2 Files')
    .get()
    .then(function(querySnapshot) {
        document.getElementById('loads').remove();
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            if (!nameList.includes(doc.id)) {
                // fileList.push(doc.data().link);
                nameList.push(doc.id);
                console.log('getting image from',doc.id);
                firebase.storage().refFromURL(doc.data().link).getDownloadURL().then(function(url) {
                    const galleryImage = `  <div class='`+doc.id+` image-holder'>
                                                <a onclick="loadImage('`+doc.id.replace(/_/g, ' ')+`','`+url+`')">
                                                    <img src ='`+url+`' class = 'image-clickable' alt='./Assets/loading.gif'>
                                                </a>
                                            </div>`;
                    addNewImage(galleryImage);
                });        
            }
        });
    }).then(function()  {
        console.log('done');
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
// })
}

function addNewImage(galleryImage)  {
    console.log(dir1, dir2, dir3);
    if (dir1 <= dir2 && dir1 <= dir3)   {directory1.innerHTML += galleryImage;}
    else if(dir2 <= dir1 && dir2 <= dir3)    {directory2.innerHTML += galleryImage;}
    else    {directory3.innerHTML += galleryImage;}
    uploadFormBox.style.display = 'none';
    cover.style.display = 'none';
    dir1 = 0; dir2 = 0; dir3 = 0;
    var ch1 = Array.prototype.slice.call(directory1.children);
    ch1.forEach(element => {
        dir1 += element.clientHeight;
    });
    var ch2 = Array.prototype.slice.call(directory2.children);
    ch2.forEach(element => {
        dir2 += element.clientHeight;
    });
    var ch3 = Array.prototype.slice.call(directory3.children);
    ch3.forEach(element => {
        dir3 += element.clientHeight;
    });
}

start();