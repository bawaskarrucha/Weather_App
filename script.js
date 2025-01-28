"use strict";

const API ="59f5195c2cf5a07afda0b25a1d9c5b19";

const dayEL = document.querySelector(".default_day");
const dateEL = document.querySelector(".default_date");
const btnEL = document.querySelector('.btn_search');
const inputEL = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEL = document.querySelector(".day_info");
const listContentEL= document.querySelector(".list_content ul");

const days =[
    "Sunday",
    "Mondal",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
 
//display the date

const day = new Date();
const dayName=days[day.getDay()];
console.log(dayName);
dayEL.textContent = dayName;

let month = day.toLocaleDateString("default", {month: "long"});
let date = day.getDate();
let year = day.getFullYear();

console.log();
dateEL.textContent = date + " " + month + " " + year;

// add event
btnEL.addEventListener('click',(e) => {
    e.preventDefault();

    //check empty value
     if (inputEL.value !==""){
        const Search = inputEL.value;
        inputEL.value = "";
        findlocation(Search);
     }else{
    
        console.log("Please Enter City or Country Name");
     }
    
});
    
async function findlocation(name){
    iconsContainer.innerHTML = "";
    dayInfoEL.innerHTML = "";
    listContentEL.innerHTML ="";
try{
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
      const data = await fetch(API_URL);
      const result = await data.json();
      console.log(result);

      if(result.cod !=="404"){

        //display image content
        const ImageContent = displayImageContent(result);


        //display right side content
        const rightSide = rightSideContent(result);

      
        //forecast function
        displayForeCast(result.coord.lat, result.coord.lon);


       setTimeout(()=>{
        iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
        iconsContainer.classList.add("fadeIn");
        dayInfoEL.insertAdjacentHTML("afterbegin",  rightSide);
       },1500);

      }else{

      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`
      iconsContainer.insertAdjacentHTML("afterbegin", message);
      }
    } catch(error){}
}
   //display image element and temp
   function displayImageContent(data){
   return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt=""/>
   <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}ºC</h2>
   <h3 class="cloudtext">${data.weather[0].description}</h3>`;
   }
   
   
////display right side content
function rightSideContent(result){
    return `<div class="content">
           <p class="title">NAME</p>
           <span class="value">${result.name}</span> 
            </div>
        
          <div class="content">
              <p class="title">TEMP</p>
              <span class="value">${Math.round(result.main.temp - 275.15)}ºC</span>
          </div>

          <div class="content">
              <p class="title">HUMIDITY</p>
              <span class="value">${result.main.humidity}%</span> 
           </div>

            <div class="content">
              <p class="title">WIND SPEED</p>
              <span class="value">${result.wind.speed}</span> 
           </div>`;
           
}
async function displayForeCast(lat,long){
  const ForeCast_ApI =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  const data =await fetch (ForeCast_ApI);
  const result = await data.json();

  //filter the forecast
  const uniqeForeCastDays =[];
  const daysForecast = result.list.filter((forecast)=>{
    const forecastDate =new Date(forecast.dt_txt).getDate();
    if(!uniqeForeCastDays.includes(forecastDate)){
      return uniqeForeCastDays.push(forecastDate);
    }
  
  });
    console.log (daysForecast);
    
    daysForecast.forEach((content,indx)=>{
      if(indx<=3){

        listContentEL.insertAdjacentHTML("afterbegin",forecast(content))

      }
    })
}


//forecast html element data

function forecast(frContent){

  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay=dayName.split("",3);
  const joinDay = splitDay.join("");

  //console.log(dayName);


  return` <li>
                    <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png"/>
                    <span>${joinDay}</span>
                    <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}ºC</span>
                </li>`;
}

