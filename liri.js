require("dotenv").config();

var axios = require("axios");
var command = process.argv[2];
var nodeArgs = process.argv;
var userChoice = "";

for (var i = 3; i < nodeArgs.length; i++){

  if (i > 3 && i < nodeArgs.length){
    userChoice = userChoice + "+" + nodeArgs[i];
  }
  else {
    userChoice += nodeArgs[i];
  }
}

function checkCommand(){

  if (command === "concert-this"){
    getConcertInfo();
  }
  else if (command === "spotify-this-song"){
    getSpotifyInfo();
  }
  else if (command === "movie-this"){
    getMovieInfo();
  }
  else if (command === "do-what-it-says"){
    getTextFile();
  }
  else{
    console.log("Please enter a valid command.")
  }
}

checkCommand();

function getConcertInfo(){

  var moment = require('moment')
  var artist = userChoice;
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

  axios.get(queryURL).then(
    function (response) {
      var data = response.data

      if (data.length === 0){
        console.log("This artist/band does not currently have any tour information in Bands in Town.")
      }
      else{
      for (i = 0; i < 1; i++){
        console.log("Artist: " + data[0].artist.name + "\nVenue: " + data[i].venue.name +
          ", " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country +
          "\nDate of the Event: " + moment(data[i].datetime).format('MM DD YYYY') + "\nTickets: " + data[i].offers[0]);
          console.log("\n---------\n");
      }
    }
    })
    .catch(function (error){

      if (error.response){
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      }
      else if (error.request){   
        console.log(error.request);
      }
      else{        
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};

function getSpotifyInfo(){
  
  var song = userChoice;
  var limit = 1
  var SpotifyWebApi = require('node-spotify-api');
  var keys = require("./keys.js");

  var spotify = new SpotifyWebApi({
    id: keys.spotify.id,
    secret: keys.spotify.secret

  })

  if (song === ""){
    song = "The Sign"
    limit = 1
  }
  spotify.search({type
    : "track", query: song, limit: limit}, function (err, data) {
    
      data = data.tracks
    
    if (err){
      return console.log('Error occurred: ' + err);
    } 

    for (i = 0; i < data.items.length; i++){

    console.log("Song Name: " + data.items[i].name)
    console.log("Preview URL: " + data.items[i].preview_url + "\nAlbum Name: "
    + data.items[i].album.name + "\nOpen in Spotify (Spotify required): " + data.items[i].external_urls.spotify + "\nArtists: ")
    for (j=0; j < data.items[i].artists.length; j++){
    console.log(data.items[i].artists[j].name + ",");
    }
    console.log("\n------------\n");
  }
  });
}

function getMovieInfo() {
  var axios = require("axios");

  var movie = userChoice;

  if(userChoice.length === 0) {
      movie = "Mr. Nobody"
  }

  axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
    function (data) {
      data = data.data;
      console.log("\n-------------\n")
      console.log("Title: " + data.Title + "\nRelease Year: " + data.Year +
        "\nIMDB Rating: " + data.imdbRating)
        var test = data.Ratings.filter(x => x.Source === "Rotten Tomatoes")[0]
           if (test !== undefined)  
            console.log("Rotten Tomatoes Rating: " + test.Value)
     
          else{
              console.log("Rotten Tomatoes: This data is not available");
              }
         console.log("Country: " +
        data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors)

      console.log("\n-------------\n")
    })
    .catch(function (error){

      if (error.response){

        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      }
      else if (error.request){
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      }
      else{
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

function getTextFile(){

  var fs = require("fs");
  fs.readFile("random.txt", "utf8", function (error, data){
    
    if (error){
        return console.log(error);
    }
    
    var random = data.split(", ");

    if (random.length === 2){
      command = random[0];
      userChoice = random[1];
      checkCommand();
    }
    else{
      console.log("Confirm text format in random.txt. Format is: command, search term.")
    }
  })
}