// Initialize Firebase
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

$(document).ready(function () {
    console.log("ready");
    clock();

    function clock() {
        setTimeout(clock, 1000);
        $("#currentTime").html(moment().format("LTS"));
    }

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
        firstTrainTime = moment(firstTrainTime, "hh:mm").format("hh:mm");
        firstTrainTimeMoment = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        currentTime = moment();
        diffTime = moment().diff(moment(firstTrainTimeMoment), "minutes");
        timeRemaider = diffTime % frequency;
        minutesToNext = frequency - timeRemaider;
        nextTrain = moment().add(minutesToNext, "minutes");
        nextTrainMoment = moment(nextTrain).format("hh:mm");
        console.log(nextTrainMoment);

        database.ref().push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            nextTrainMoment: nextTrainMoment,
            dateAdded: moment().format("X")
        });

        name = "";
        destination = "";
        firstTrainTime = "";
        frequency = "";

        $("#trainName").val(name);
        $("#destination").val(destination);
        $("#firstTrain").val(firstTrainTime);
        $("#frequency").val(frequency);

    });

    database.ref().on("child_added", function (snapshot) {
        trainName = snapshot.val().name;
        trainDest = snapshot.val().destination;
        firstTrain = snapshot.val().firstTrainTime;
        freq = snapshot.val().nextTrainMoment;

        $("#trains").append(
            '<tr><td><i class="fas fa-subway"></i></td><td id="name">' +
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