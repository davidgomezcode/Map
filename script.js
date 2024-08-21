"use strict";
//Selectors:
const menuBurger = document.querySelector("#menuBurger .hidden");

// Variables
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
//Function where am I:

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

  let { latitude, longitude } = position.coords;
  coords = [latitude, longitude];
  let map = L.map("map").setView(coords, 16);

  //   mapReal.addTo(map);
  mapDrawn.addTo(map);

  //Always there is a click, the mapEvent is created (is used later avoiding the creation of the marker over the whereAmIButtonIMG):
  map.on("click", function (mapE) {
    mapEvent = mapE;
  });

  //Event listener to difFerentiate between the clicks over tu whereAmIButtonIMG and over the rest of the map:
  document.addEventListener("click", function (e) {
    console.log(e.target);

    if (e.target.classList.contains("whereAmIButtonIMG")) {
      L.marker(coords).addTo(map);
      map.locate({ setView: true });
      // map.locate({ setView: true, maxZoom: 30 }); // Max zoom when the view is set to the user location - it´s not working.
      // L.marker(coords, { icon: whereAmIIcon }).addTo(map); //
    } else if (e.target.classList.contains("menuBurgerIMG")) {
      menuBurger.classList.toggle("hidden"); // we toggle the space where the activities are going to be listed
    } else if (
      //if the click is not on
      // the where am I button
      !e.target.classList.contains("whereAmIButtonIMG") && //the burger menu
      !e.target.classList.contains("menuBurgerIMG") && //the input of activities
      !e.target.classList.contains("activityInput") && // the input
      !e.target.classList.contains("input") && // the activity
      !e.target.classList.contains("activity") && //the burger menu space
      e.target.id !== "menuBurgerSpace"
    ) {
      // Then, create a marker where the user clicked.
      let { lat, lng } = mapEvent.latlng;
      L.marker([lat, lng]).addTo(map);
    }
  });
});
