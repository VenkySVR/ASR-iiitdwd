const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const audioPlayer = document.getElementById('player');
const downloadLink = document.getElementById('download');
stopButton.disabled = true;



const speechRecorder = (stream) => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener('dataavailable', (e) => {
        recordedChunks.push(e.data);
        if (mediaRecorder.state == "inactive") {
            let blob = new Blob(recordedChunks,{type: "audio/wav"});
           
            const audioBlob = blob
            const audioUrl = URL.createObjectURL(audioBlob);

            audioPlayer.controls = true;
            audioPlayer.src = audioUrl;
            downloadLink.href = audioUrl;
            let nameoffile = new Date().toISOString() + '.wav'
            downloadLink.download = nameoffile ;

            // blob = blobToFile(blob, nameoffile)
            // console.log(blob)
            sendData(blob,nameoffile);
        }
      });
}

// function blobToFile(theBlob, fileName){       
//     return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type })
// }

// function blobToFile(theBlob, fileName){
//     //A Blob() is almost a File() - it's just missing the two properties below which we will add
//     theBlob.lastModifiedDate = new Date();
//     theBlob.name = fileName;
//     return theBlob;
// }

function sendData(blob,nameoffile) {
    var form = new FormData();
    form.append('file', blob);
    form.append('fname', nameoffile);
    $.ajax({
        type: 'POST',
        url:'/',
        data: form,
        cache: false,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

startButton.addEventListener('click', () => {
    document.getElementById('status').innerHTML = "Recording...";
    startButton.disabled = true;
    stopButton.disabled = false;
    recordedChunks = [];
    mediaRecorder.start();
});

stopButton.addEventListener('click', () => {
    document.getElementById('status').innerHTML = "Click on start to record.";
    stopButton.disabled = true;
    startButton.disabled = false;
    mediaRecorder.stop();
});


navigator.mediaDevices.getUserMedia({
    audio: true, video: false
}).then(speechRecorder).catch((err) => {
    startButton.disabled = false;
    stopButton.disabled = true;
});