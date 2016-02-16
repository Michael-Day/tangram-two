/*
    "Screen Time"
    16th February 2016
    ------------------
    Michael Day
    @mday
    ------------------
    Attribution:
    Tangram from https://mapzen.com/
    OSM contributors
*/

var symptom; // div for the texts
var fadeOut; // var for the fadeout function if text is unclicked
var locsIndex = 0; // counts up through the locs array
var textIndex = 0; // counts up through textArray

// var object containing the lat and long for the locations to zoom from
var locs =
[
    //[22.54531, 114.08034],    // huawei head office, shenzen
    [51.52569, -0.08736],       // oldst
    [37.332342, -122.030797],   // apple
    //[22.54222, 113.9482],     // tcl, guanddong
    //[37.513144, 127.059809],  // vivo?
    [22.287844, 114.212298],    // lenovo reg hq
    //[37.496609, 127.026902],  // samsung
    [37.422230, -122.084047],   // googleplex
    [37.484914, -122.148393],   // facebook
    [37.777045, -122.416448]    // twitter
]
shuffleIt(textArray);   // shuffle the texts first time
shuffleIt(locs);        // shuffle the locs

function setup() {
    var canvass = createCanvas(1,1);    // canvas, for no reason

    symptom = createSpan();         // span for the texts
    symptom.id("text");             // give it an id, defined in the HTML file
    symptom.addClass("visible");    // give it a class, visible for the fades etc

    symptom.html(randomText());     // generate text content for the div
    windowResized();                // flow for smaller screens

    symptom.touchEnded(makeInvisible);      // set up listeners for the clicks and taps
    symptom.mouseReleased(makeInvisible);   // set up listeners for the clicks and taps
}


// This is all mapzen & leaflet business //
var mapp = L.map('map', {
    zoomControl: false,        // gets rid of +/- thing
    attributionControl: false, // gets rid of attribution thing
});
var layer = Tangram.leafletLayer({
    scene: 'scene.yaml',
});
layer.addTo(mapp);


mapp.setView(locs[locsIndex], 19); // This sets up the map position, to old st

setInterval(refreshLocation, 180000);

// function to do the zooming out
zoomMe = function(){
    mapp.zoomOut(0.001);
}

setInterval(zoomMe, 100);

function windowResized() {
    // sets the type box size depending on the window size
    if(symptom){
        if(windowWidth > 1800){
            symptom.style("font-size","3.5em");
            symptom.style("width", "40%");
        } else if (windowWidth > 1000) {
            symptom.style("font-size","2.8em");
            symptom.style("width", "45%");
        } else if (windowWidth > 800) {
            symptom.style("font-size","2.2em");
            symptom.style("width", "50%");
        } else if (windowWidth > 500) {
            symptom.style("font-size","2.0em");
            symptom.style("width", "60%");
        } else if (windowWidth < 499) {
            symptom.style("font-size","1.3em");
            symptom.style("width", "80%");
        }
    }
}


function randomText() {
    s = textArray[textIndex];
    symptom.html(s);
    textIndex++;

    // set the visibility of the text to visible
    var thing =  document.getElementById("text"); // get the element
    thing.className = "visible";                 // change the class of it

    // start counter for text fadeout if unclicked
    fadeOut = setInterval(makeInvisible, 10400);

    // shuffles the text array when it reaches the end
    if(textIndex == textArray.length){
        shuffleIt(textArray);
        textIndex = 0;
    }
}

setInterval(randomText, 12000); // refresh interval for texts


function makeInvisible() {
    // fades out texts on click
    clearTimeout(fadeOut);      // clear the timer for UNclicked fadeout
    var thing =  document.getElementById("text"); // get the element
    thing.className = "hidden";         // change the class of it
}

function refreshLocation() {
    // work up through the list of locations
    if (locsIndex < locs.length-1){
        locsIndex++;
    } else {
        locsIndex = 0;
    }
    mapp.setView(locs[locsIndex], 19); // This sets up the map position, to old st
}

function shuffleIt(array) {
    // --------------------
    // Fisher-Yates shuffle
    // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // --------------------
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
