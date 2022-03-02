"use strict";
require("leaflet");
import "./styles/main.scss";

const inputIp = document.getElementById("ipAddress");
const searchButton = document.getElementById("searchContainer");
const ipAddressContainer = document.getElementById("ipContainer");
const locationContainer = document.getElementById("locationContainer");
const timezoneContainer = document.getElementById("timezoneContainer");
const ispContainer = document.getElementById("ispContainer");

const apiKey = "at_QKcZXGcamwITKpsS6OITiM3Wbd81s";
const apiUrl = "https://geo.ipify.org/api/v2/country,city?";
let ipValue;
let ipInfo, locationRegion, locationCountry, timeZone, isp;

inputIp.addEventListener("input", getIp);

function getIp() {
  ipValue = inputIp.value;
}

searchButton.addEventListener("click", getDirection);
function getDirection() {
  var container = L.DomUtil.get("map");
  if (container != null) {
    container._leaflet_id = null;
    getData();
  }
}

const getData = async () => {
  try {
    const response = await fetch(
      `${apiUrl}apiKey=${apiKey}&ipAddress=${ipValue}`
    );
    const data = await response.json();
    console.log(data);

    ipInfo = data.ip;
    locationRegion = data.location.city;
    locationCountry = data.location.country;
    timeZone = data.location.timezone;
    isp = data.isp;
    let lat = data.location.lat;
    let lng = data.location.lng;

    createMap(lat, lng);
    putData();
  } catch (error) {
    console.error(error);
  }
};

const putData = () => {
  ipAddressContainer.innerText = ipInfo;
  locationContainer.innerText = `${locationRegion}, ${locationCountry}`;
  timezoneContainer.innerText = timeZone;
  ispContainer.innerText = isp;
};

function createMap(lat, lng) {
  let map = L.map("map").setView([lat, lng], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiaGVuZGVyc29yIiwiYSI6ImNsMDV0ODZ0cjE2amgza3FpZm55MDFmYnkifQ.HuzZnfKV63lmuIbUn4mIpw",
    }
  ).addTo(map);

  let greenIcon = L.icon({
    iconUrl:
      "https://res.cloudinary.com/dwdz4mn27/image/upload/v1645993313/ip-address-tracker-master/images/icon-location_mfqr7j.svg",

    iconSize: [36, 46], // size of the icon
    iconAnchor: [18, 46], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });
  L.marker([lat, lng], { icon: greenIcon }).addTo(map);
}

getData();
