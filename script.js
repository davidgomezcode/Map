"use strict";
//Variables:
let lastActivityNumber;

//Selectors:
const menuBurgerIMG = document.querySelector(".menuBurgerIMG");
const menuBurgerSpace = document.querySelector("#menuBurgerSpace");
const sendButton = document.querySelector(".sendButton");
const menuBurgerSpaceDivActivities = document.querySelector(
  ".menuBurgerSpaceDivActivities"
);
const changeMapStyleIMG = document.querySelector(".changeMapStyleIMG");

const buttonUp = document.querySelector(".buttonUp");
const buttonDown = document.querySelector(".buttonDown");

// Global variables
let coords;
let mapEvent;

const markersArray = [];

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

//Functions
//Function - insertion of new activity:
const createActivity = function () {
  lastActivityNumber = Number(
    menuBurgerSpaceDivActivities.lastElementChild.dataset.number
  );

  const html = `<article data-number="${
    lastActivityNumber + 1
  }" class="activity">
    <div class="closeDot">.</div>
    <div class="inputParent">
      <select class="input activityInput">
        <option value="" disabled selected>Select Activity</option>
        <option value="Work">Work</option>
        <option value="Study">Study</option>
        <option value="Family">Family</option>
        <option value="Social">Social</option>
        <option value="Couple">Couple</option>
        <option value="Exercise">Exercise</option>
       </select>
    </div>
    <div class="inputParent">
      <input class="input timeInput" 
      type="number" 
      placeholder="Minutes" 
    />
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
const removeMarker = function (markerNumber) {
  markersArray[markerNumber].remove(); //Removes the marker and the pop up from the map
  markersArray.splice(markerNumber, 1); //Removes the marker from the markersArray
};
//Function of map and geolocation of user:
navigator.geolocation.getCurrentPosition(function (position) {
  //Functions:
  const createMarker = function () {
    let { lat, lng } = mapEvent.latlng;
    markersArray.push(
      L.marker([lat, lng], {
        draggable: true,
      })
        .addTo(map)
        .bindPopup(
          L.popup({
            autoClose: false,
            closeOnClick: false,
            // className: "currentUserPosition",
          })
        )
        .setPopupContent(`Activity`)
        .openPopup()
    );
  };
  const addToMap = function (mapType) {
    mapType.addTo(map);
  };
  //The coords variable is the current location of the user:
  let { latitude, longitude } = position.coords;
  coords = [latitude, longitude];
  //Map variable following instructions of Leaflet:
  let map = L.map("map").setView(coords, 16);

  //The first style of the map is drawn:
  addToMap(mapDrawn);

  //Always there is a click, the mapEvent is created (is used later avoiding the creation of the marker over the whereAmIButtonIMG):
  map.on("click", function (mapE) {
    mapEvent = mapE;
  });

  //Event listener to difFerentiate between the clicks over tu whereAmIButtonIMG and over the rest of the map:
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("whereAmIButtonIMG")) {
      // if the user clicks the where am i button: create a marker with the user coords and locate the viewport on that mark:
      L.marker(coords, {
        icon: L.icon({
          iconUrl: "https://i.postimg.cc/0N6HHTMr/blueDot.png",
          className: `currentUserPosition`,
        }),
      })
        .addTo(map)
        .bindPopup()
        .setPopupContent(
          `<strong style="font-size: 1.2rem;">You are here!</strong>`
        )
        .openPopup();

      // map.locate({ setView: true }); // we set the view to the user current position

      map.setView(coords, 16, { animate: true, pan: { duration: 1 } });
      if (!menuBurgerSpace.classList.contains("hidden")) {
        //If the burger menu is open, it closes it:
        openBurgerMenu();
      }
    } else if (
      // the click is on the map and not over any other element:
      e.target.id === "map"
    ) {
      //Then:
      if (!menuBurgerSpace.classList.contains("hidden")) {
        //If the burger menu is open, it closes it:
        openBurgerMenu();
      } else if (menuBurgerSpace.classList.contains("hidden")) {
        //If the burger menu is closed, it creates a marker where the user clicked, creates an activity in the burger menu and opens the burger menu:
        createActivity();
        createMarker();
        openBurgerMenu();
      }
    }
  });

  menuBurgerIMG.addEventListener("click", function () {
    openBurgerMenu();
  });
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
  sendButton.addEventListener("click", function () {
    // while we iterate the menuBurgerSpaceDivActivities, we will iterate the markersArray with the variable i.
    let i = 0;
    menuBurgerSpaceDivActivities
      .querySelectorAll("article")
      .forEach((article) => {
        if (article.querySelector(".activityInput")?.value !== undefined) {
          //We create the variable minutes that reads the numbers the user includes in that input:
          let minutes = article.querySelector(".timeInput")?.value;
          // We take the text of every element in the burger menu and put it in the correspondent marker popup (using the setPopupContent):
          markersArray[i].setPopupContent(
            `<strong style="font-size: 1.2rem;">${
              article.querySelector(".activityInput")?.value
            }</strong><br>${minutes} min`
          );
          console.log(article.querySelector(".activityInput")?.value);

          i = i + 1; //We increase the value of the variable i to iterate the markersArray in parallel to the iteration of the activities.
        }
      });
  });
  //Change map tile:
  changeMapStyleIMG.addEventListener("click", function () {
    if (
      Object.values(map._layers)[0]._url ===
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    ) {
      map.removeLayer(mapDrawn);
      addToMap(mapReal);
    } else {
      map.removeLayer(mapReal);
      addToMap(mapDrawn);
    }
  });
  //Place the view where the marker related to the acctivity is:
  menuBurgerSpaceDivActivities.addEventListener("click", function (e) {
    let { lat, lng } =
      markersArray[e.target.closest("article").dataset.number - 1]._latlng;

    map.setView([lat, lng], 16, { animate: true, pan: { duration: 1 } });
  });
  // Eliminate activities:
  menuBurgerSpaceDivActivities.addEventListener("click", function (e) {
    // console.log(e.target);
    if (!e.target.classList.contains("closeDot")) return;

    removeMarker(e.target.closest("article").dataset.number - 1);

    menuBurgerSpaceDivActivities.querySelectorAll("article")[
      e.target.closest("article").dataset.number
    ].innerHTML = "";

    // console.log(e.target.closest("article").dataset.number);
  });
});
