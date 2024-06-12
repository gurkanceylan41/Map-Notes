// Tipi analiz edip fonksiyonun cagirildigi yere gelen aciklamayi gonderir.
export const detecType = (type) => {
  switch (type) {
    case "park":
      return "Park Yeri";
  }
  switch (type) {
    case "home":
      return "Ev";
  }
  switch (type) {
    case "Job":
      return "Is";
  }
  switch (type) {
    case "goto":
      return "Ziyaret";
  }
};

//Localstorage guncellicek fonksiyon
export const setStorage = (data) => {
  //Veriyi göndermek için sitringe cevirme
  const strData = JSON.stringify(data);
  //localStorage veriyi gonderme
  localStorage.setItem("notes", strData);
};

var carIcon = L.icon({
  iconUrl: "car.png",
  iconSize: [50, 60],
});
var homeIcon = L.icon({
  iconUrl: "home-marker.png",
  iconSize: [50, 60],
});
var jobIcon = L.icon({
  iconUrl: "job.png",
  iconSize: [50, 60],
});
var visitIcon = L.icon({
  iconUrl: "visit.pn",
  iconSize: [50, 60],
});

export const detecIcon = (type) => {
  switch (type) {
    case "park":
      return carIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "goto":
      return visitIcon;
  }
};
