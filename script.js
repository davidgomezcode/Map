"use strict";
//Selectors:
const menuBurgerIMG = document.querySelector(".menuBurgerIMG");
const menuBurgerSpace = document.querySelector("#menuBurgerSpace");
const sendButton = document.querySelector(".sendButton");
const menuBurgerSpaceDivActivities = document.querySelector(
  ".menuBurgerSpaceDivActivities"
);

const buttonUp = document.querySelector(".buttonUp");
const buttonDown = document.querySelector(".buttonDown");

// Global variables
let coords;
let mapEvent;
//Type of maps tiles (styles):
let mapDrawn = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

let mapReal = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

// Change of icon - it´s not working properly, the icon moves improperly in the map as you change the zoom:
// let whereAmIIcon = L.icon({
//   iconUrl: "./Imgs/blueDot.png",
//   iconSize: [18, 18],
//   iconAnchor: [22, 94],
//   popupAnchor: [-3, -76],
//   shadowUrl: "my-icon-shadow.png",
//   shadowSize: [68, 95],
//   shadowAnchor: [22, 94],
// });

//Functions
//Function - insertion of new activity:
// variable that contains the structure of the new activity - ON CONSTRUCTION.

const createActivity = function () {
  let lastActivityNumber =
    menuBurgerSpaceDivActivities.lastElementChild.dataset.number;

  const html = `<article data-number="${
    Number(lastActivityNumber) + 1
  }" class="activity">
    <div class="inputParent">
      <input class="input activityInput" placeholder="Activity" />
    </div>
    <div class="inputParent">
      <input class="input timeInput" placeholder="Time" />
    </div>

    <div class="inputParent">
      <textarea
        name=""
        id=""
        class="input observationsInput"
        placeholder="Observations"
        rows="3"
      >
      </textarea>
    </div>
  </article>`;
  menuBurgerSpaceDivActivities.lastElementChild.insertAdjacentHTML(
    "afterend",
    html
  );
};

const openBurgerMenu = function () {
  menuBurgerSpace.classList.toggle("hidden");
  buttonUp.classList.toggle("hidden");
  buttonDown.classList.toggle("hidden");
  sendButton.classList.toggle("hidden");
};

//Function of map and geolocation of user:
navigator.geolocation.getCurrentPosition(function (position) {
  //Functions:
  //Function where am I:
  const whereAmI = function () {
    L.marker(coords)
      .addTo(map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeOnClick: false,
          className: "currentUserPosition",
        })
      )
      .setPopupContent("You are here")
      .openPopup();
  };

  //The coords variable is the current location of the user:
  let { latitude, longitude } = position.coords;
  coords = [latitude, longitude];
  //Map variable following instructions of Leaflet:
  let map = L.map("map").setView(coords, 16);

  //Choosing the style of the map tile (two options, real, or drawn):
  //   mapReal.addTo(map);
  mapDrawn.addTo(map);

  //Always there is a click, the mapEvent is created (is used later avoiding the creation of the marker over the whereAmIButtonIMG):
  map.on("click", function (mapE) {
    mapEvent = mapE;
  });

  //Event listener to difFerentiate between the clicks over tu whereAmIButtonIMG and over the rest of the map:
  document.addEventListener("click", function (e) {
    // console.log(e.target);
    // console.log(!menuBurgerSpace.classList.contains("hidden"));
    if (e.target.classList.contains("whereAmIButtonIMG")) {
      // if the user clicks the where am i button, then we create a marker with the user coords and locate the viewport on that mark:
      L.marker(coords).addTo(map);
      map.locate({ setView: true });
    } else if (e.target.classList.contains("sendButton")) {
      // if the user clicks the sendbutton we crate a new activity -THIS SHOULD BE REPLACED WITH SAVING THE INFO OF ALL THE ACTIVITIES.
    } else if (
      //if the click is not on the following elements:
      // the where am I button
      !e.target.classList.contains("whereAmIButtonIMG") && //the burger menu
      !e.target.classList.contains("menuBurgerIMG") && //the input of activities
      !e.target.classList.contains("activityInput") && // the input
      !e.target.classList.contains("input") && // tHE BUTTONS SEND AND UP AND DOWN:
      !e.target.classList.contains("sendButton") &&
      !e.target.classList.contains("buttonUp") &&
      !e.target.classList.contains("buttonDown") && // the activity
      !e.target.classList.contains("activity") && //the burger menu space
      !e.target.classList.contains("menuBurgerSpaceDiv") &&
      !e.target.classList.contains("menuBurgerSpaceDivActivities") && // It is not the send p¿button
      e.target.id !== "menuBurgerSpace"
    ) {
      //tHEN IT
      if (!menuBurgerSpace.classList.contains("hidden")) {
        openBurgerMenu();
      } else if (menuBurgerSpace.classList.contains("hidden")) {
        // Then, create a marker where the user clicked.
        let { lat, lng } = mapEvent.latlng;
        L.marker([lat, lng]).addTo(map);
        createActivity();
        openBurgerMenu();
      }
    }
  });

  menuBurgerIMG.addEventListener("click", function () {
    openBurgerMenu();
  });

  // menuBurgerIMG.addEventListener("mouseenter", function () {
  //   console.log("the mouse entered the burger image");
  // });
  buttonUp.addEventListener("click", function () {
    menuBurgerSpace.scrollBy({
      top: -100, // Negative value to scroll up
      behavior: "smooth", // Optional: smooth scrolling
    });
  });
  buttonDown.addEventListener("click", function () {
    menuBurgerSpace.scrollBy({
      top: 100, // Positive value to scroll down
      behavior: "smooth", // Optional: smooth scrolling
    });
  });
});
