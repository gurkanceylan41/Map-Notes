import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { detecIcon, detecType, setStorage } from "./helper.js";

//!HTML'den gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//!Olay izleyicileri
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

//!Ortak Kullanın Alanı
var map;
var layerGroup = [];
var coords = [];
var notes = JSON.parse(localStorage.getItem("notes")) || [];

/* Kullanıcının konumunu ogrenmek icin getCurrentPosition methodunu kullandık ve bizden iki parametre istedi
1. Kullanıcı konum izni verdiginde calişicak fonksiyondur.
2. kullanıcı konum izni vermediginde calisicak fonksiyondur */

navigator.geolocation.getCurrentPosition(loadMap, erorFunction);

function erorFunction() {
  console.log("hata");
}

//Haritaya tıklayınca form bileşeninin display özelligini flex yaptık.
function onMapClick(e) {
  form.style.display = "flex";
  coords = [e.latlng.lat, e.latlng.lng];
}

//Kullanıcının Konumuna Göre Haritayi ekrana aktarır
function loadMap(e) {
  // 1. Haritanın kurulumu.
  map = L.map("map").setView([e.coords.latitude, e.coords.longitude], 13);
  /* L.control;     */
  // 2. Haritanın nasıl gözüküceğini belirler.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //harita da ekrana basılacak imlecleri tutucagımız katman
  layerGroup = L.layerGroup().addTo(map);

  //lokalden gelen notlari listeleme
  renderNoteList(notes);

  // 3. haritada bir tıklanma oldugunda calisacak fonksiyon
  map.on("click", onMapClick);
}

function renderMarker(item) {
  L.marker(item.coords, { icon: detecIcon(item.status) })
    .addTo(layerGroup) //imleclerin oldugu katmana ekler
    .bindPopup(`${item.desc}`); //uzerine tikaninca acilicak popup
}

function handleSubmit(e) {
  e.preventDefault(); // Sayfanın yenilenmesini engeller
  const desc = e.target[0].value; // Formun içerisindeki text inputunun degerini alma
  const date = e.target[1].value; // Formun içerisindeki date inputunun degerini alma
  const status = e.target[2].value; // Formun içerisindeki status inputunun degerini alma

  notes.push({
    id: uuidv4(),
    desc,
    date,
    status,
    coords,
  });

  //Local storage güncelleme
  setStorage(notes);

  //renderNoteList'e parametre olarak notes dizisini gonderdik
  renderNoteList(notes);

  //Form gonderildiginde kapat
  form.style.display = "none";
}

function renderNoteList(item) {
  list.innerHTML = ""; //notlar(list) kısmını içini boşa çeker sıfırlar.

  //Markerları temizler
  layerGroup.clearLayers();

  item.forEach((item) => {
    const listElement = document.createElement("li"); //li etiketi oluşturur.
    listElement.dataset.id = item.id; //li etiketine data id ekleme özelliği.
    listElement.innerHTML = `
    <div>
              <p>${item.desc}</p>
              <p><span>Tarih: </span>${item.date}</p>
              <p><span>Durum: </span>${detecType(item.status)}</p>
            </div>
            <i class="bi bi-x" id="delete"></i>
            <i class="bi bi-airplane-fill" id="fly"></i>
    `;
    list.insertAdjacentElement("afterbegin", listElement);
    renderMarker(item);
  });
}

//Notes alanında tıklanma olayını izler
function handleClick(e) {
  //Guncellenecek elemenın id'sini ögrenmek icin parentelement yöntemini kullandık
  const id = e.target.parentElement.dataset.id;
  if (e.target.id === "delete") {
    notes = notes.filter((note) => note.id != id);
    console.log(notes);
    setStorage(notes); //localStorage güncelledi
    renderNoteList(notes); //Ekrani güncelledi
  }
  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id); // Tıkladıgımız elemanın idsi ile dizi icerisindeki elemanlardan herhangi birinin idsi eşleşirse bul.
    map.flyTo(note.coords); //Haritayı buldugumuz elemana yonlendirmesi icin flyTo methodunu kullandık
  }
}
