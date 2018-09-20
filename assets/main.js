// firebase info
var config = {
    apiKey: "AIzaSyDpm9OITGdxjMPX0ra0ZNIrMA4Sl2sLhSg",
    authDomain: "my-project-1535422874483.firebaseapp.com",
    databaseURL: "https://my-project-1535422874483.firebaseio.com",
    projectId: "my-project-1535422874483",
    storageBucket: "my-project-1535422874483.appspot.com",
    messagingSenderId: "765763250817"
};
firebase.initializeApp(config);

database = firebase.database();

//document ready run javaScript
$(document).ready(function () {
    console.log("ready");

    //clock function
    clock();

    //Adding clock to the header
    function clock() {
        setTimeout(clock, 1000);
        $("#currentTime").html(moment().format("LTS"));
    }
    //Taking the information from the form 
    $("button").click(function (event) {
        event.preventDefault();
        var name = $("#trainName")
            .val()
            .trim();
        var destination = $("#destination")
            .val()
            .trim();
        var firstTrainTime = $("#firstTrain")
            .val()
            .trim();
        var frequency = $("#frequency")
            .val()
            .trim();

        //copied and pasted this not 100% how it functions yet...seems to be working though
        firstTrainTime = moment(firstTrainTime, "LTS").format("LTS");
        firstTrainTimeMoment = moment(firstTrainTime, "LTS").subtract(1, "years");
        currentTime = moment();
        diffTime = moment().diff(moment(firstTrainTimeMoment), "minutes");
        timeRemaider = diffTime % frequency;
        minutesToNext = frequency - timeRemaider;
        nextTrain = moment().add(minutesToNext, "minutes");
        nextTrainMoment = moment(nextTrain).format("LTS");
        console.log(nextTrainMoment);

        //Pushing the info from the input fields and sending it to fireBase
        database.ref().push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            nextTrainMoment: nextTrainMoment,
            dateAdded: moment().format("LTS")
        });
        //Setting variables as an empty string
        name = "";
        destination = "";
        firstTrainTime = "";
        frequency = "";
        
        $("#trainName").val(name);
        $("#destination").val(destination);
        $("#firstTrain").val(firstTrainTime);
        $("#frequency").val(frequency);

    });
    //Adding the informtion to firebase as a child.
    database.ref().on("child_added", function (snapshot) {
        trainName = snapshot.val().name;
        trainDest = snapshot.val().destination;
        firstTrain = snapshot.val().firstTrainTime;
        freq = snapshot.val().nextTrainMoment;
        
        //Adding the information to the DOM as a table
        $("#trains").append(
            '<tr><td><i></i></td><td id="name">' +
            trainName +
            '</td><td id="dest">' +
            trainDest +
            '</td><td id="firstTrain">' +
            firstTrain +
            '</td><td id="freq">' +
            freq +
            "</td><tr>"
        );
    });
});