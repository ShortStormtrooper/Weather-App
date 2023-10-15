let cityName = document.getElementById("cityName");
let lowTemp = document.getElementById("lowTemp");
let currentTemp = document.getElementById("currentTemp");
let highTemp = document.getElementById("highTemp");
let feelsLikeTemp = document.getElementById("feelsLikeTemp");
let weatherType = document.getElementById("weatherType");
let mainTempImg = document.getElementById("mainTempImg");
let updateInfo = document.getElementById("updateInfo");
let windSpeedNumber = document.getElementById("windSpeedNumber");
let windGustsNumber = document.getElementById("windGustsNumber");
let windDirectionPointer = document.getElementById("windDirectionPointer");
let infoCloudsNumber = document.getElementById("infoCloudsNumber");
let infoCloudsState = document.getElementById("infoCloudsState");
let infoVisibilityNumber = document.getElementById("infoVisibilityNumber");
let infoVisibilityState = document.getElementById("infoVisibilityState");
let infoUVIndexNumber = document.getElementById("infoUVIndexNumber");
let infoUVIndexState = document.getElementById("infoUVIndexState");
let infoHumidityNumber = document.getElementById("infoHumidityNumber");
let infoHumidityState = document.getElementById("infoHumidityState");
let infoPressureNumber = document.getElementById("infoPressureNumber");
let infoPressureState = document.getElementById("infoPressureState");
let weatherForecast = document.getElementById("weatherForecast");
let highlightsColumns = document.getElementById("highlightsColumns");
let dayForecastContainer = document.getElementById("dayForecastContainer");
let mainInfoHr = document.getElementById("mainInfoHr");
let feelsLikeText = document.getElementById("feelsLikeText");
let todayForecastText = document.getElementById("todayForecastText");
let todayHighlightsText = document.getElementById("todayHighlightsText");
let windMeasurement = document.getElementById("windMeasurement");
let gustMeasurement = document.getElementById("gustMeasurement");
let measurementSymbol = document.getElementById("measurementSymbol");
let fiveDayForecastText = document.getElementById("fiveDayForecastText");
let cardLowTemp = document.getElementById("cardLowTemp");
let searchBtnImg = document.getElementById("searchBtnImg");
let windIcon = document.getElementById("windIcon");
let cloudsIcon = document.getElementById("cloudsIcon");
let pressureIcon = document.getElementById("pressureIcon");
let uvIcon = document.getElementById("uvIcon");
let humidityIcon = document.getElementById("humidityIcon");
let visibilityIcon = document.getElementById("visibilityIcon");
let additionalInfoImg = document.getElementsByClassName("additionalInfoBoxImg");
let additionalMeasurementSymbol = document.getElementsByClassName("additionalMeasurementSymbol");

let APIKey = "bd5e378503939ddaee76f12ad7a97608";

let searchText = document.getElementById("searchText");
searchText.addEventListener("keypress", (e) => {
    if(e.code == "Enter"){
        searchCityByName(searchText.value);
    }
});

let searchBtn = document.getElementById("searchBtn").addEventListener("click", function(){searchCityByName(searchText.value) });

let mainDiv = document.getElementById("mainDiv");
let welcomeDiv = document.getElementById("welcomeDiv");

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const latitude = Math.round((position.coords.latitude + Number.EPSILON) * 100) / 100;
          const longitude = Math.round((position.coords.longitude + Number.EPSILON) * 100) / 100;
          searchCity(latitude, longitude);
          welcomeDiv.style.animation = "fadeOut 800ms forwards";
          setTimeout(() => mainDiv.style.display = "flex", 1000);
          mainDiv.classList.add("fadeElement");
          setTimeout(() => mainDiv.classList.remove("fadeElement"), 1500);
        });
    }
};

let i = 0;
const childList = document.getElementById("dayForecastContainer").children;

while(i < 5){
    childList[i].addEventListener("click", function(){
        
        var content = this.children[1];
        if (content.style.display == "none" || content.style.display == "") {
            this.style.height = "50dvh";
            content.style.display = "flex";
        } else {
            this.style.height = "14dvh";
            content.style.display = "none";
        }
    });
    i++;
}

function getCurrentWeather(name, currentData){
    
    cityName.innerHTML = name;
    currentTemp.innerHTML = Math.round(currentData.temp) + "°C";
    feelsLikeTemp.children[1].innerHTML = Math.round(currentData.feels_like) + "°C";
    weatherType.innerHTML = currentData.weather[0].main;

    let i = 0;
    let j = 0;

    getColorTheme((currentData.weather[0].icon)[2], currentData.weather[0].id);

    console.log(currentData);

    mainTempImg.src = getWeatherType((currentData.weather[0].icon)[2], currentData.weather[0].id);

    windSpeedNumber.innerHTML = Math.round(currentData.wind_speed);
    if(currentData.wind_gust == undefined){
        windGustsNumber.innerHTML = "Ø";
    }else{
        windGustsNumber.innerHTML = Math.round(currentData.wind_gust);
    }
    windDirectionPointer.style.transform = "rotate(" + currentData.wind_deg + "deg)";

    infoCloudsNumber.innerHTML = Math.round(currentData.clouds);
    if(currentData.clouds >= 0 && currentData.clouds < 10){
        infoCloudsState.children[0].innerHTML = "Clear";
    }
    else if(currentData.clouds >= 10 && currentData.clouds < 30){
        infoCloudsState.children[0].innerHTML = "Mostly Clear";
    }
    else if(currentData.clouds >= 30 && currentData.clouds < 60){
        infoCloudsState.children[0].innerHTML = "Partly Cloudy";
    }
    else if(currentData.clouds >= 60 && currentData.clouds < 80){
        infoCloudsState.children[0].innerHTML = "Mostly cloudy";
    }
    else {
        infoCloudsState.children[0].innerHTML = "Cloudy";
    }
    
    let visibilityNum = Math.round(currentData.visibility) / 1000;
    infoVisibilityNumber.innerHTML = visibilityNum;
    if(visibilityNum >= 0 && visibilityNum < 1){
        infoVisibilityState.children[0].innerHTML = "Fog";
    }
    else if(visibilityNum >= 1 && visibilityNum < 2){
        infoVisibilityState.children[0].innerHTML = "Mist";
    }
    else if(visibilityNum >= 2 && visibilityNum < 5){
        infoVisibilityState.children[0].innerHTML = "Haze";
    }
    else if(visibilityNum >= 5 && visibilityNum < 7){
        infoVisibilityState.children[0].innerHTML = "Mostly visible";
    }
    else {
        infoVisibilityState.children[0].innerHTML = "Clear";
    }

    infoUVIndexNumber.innerHTML = currentData.uvi;
    if(currentData.uvi >= 0 && currentData.uvi < 3){
        infoUVIndexState.children[0].innerHTML = "Low";
    }
    else if(currentData.uvi >= 3 && currentData.uvi < 6){
        infoUVIndexState.children[0].innerHTML = "Moderate";
    }
    else if(currentData.uvi >= 6 && currentData.uvi < 8){
        infoUVIndexState.children[0].innerHTML = "High";
    }
    else if(currentData.uvi >= 8 && currentData.uvi < 11){
        infoUVIndexState.children[0].innerHTML = "Very High";
    }
    else {
        infoUVIndexState.children[0].innerHTML = "Extreme";
    }

    infoHumidityNumber.innerHTML = Math.round(currentData.humidity);
    if(currentData.humidity >= 0 && currentData.humidity < 25){
        infoHumidityState.children[0].innerHTML = "Dry";
    }
    else if(currentData.humidity >= 25 && currentData.humidity < 60){
        infoHumidityState.children[0].innerHTML = "Comfortable";
    }
    else {
        infoHumidityState.children[0].innerHTML = "Humid";
    }

    infoPressureNumber.innerHTML = Math.round(currentData.pressure);
    if(currentData.pressure >= 1040){
        infoPressureState.children[0].innerHTML = "high";
    }
    else if(currentData.pressure >= 1020 && currentData.pressure < 1030){
        infoPressureState.children[0].innerHTML = "Typical High";
    }
    else if(currentData.pressure >= 1000 && currentData.pressure < 1020){
        infoPressureState.children[0].innerHTML = "Shallow Low";
    }
    else if(currentData.pressure >= 980 && currentData.pressure < 1000){
        infoPressureState.children[0].innerHTML = "Moderate Low";
    }
    else if(currentData.pressure >= 25 && currentData.pressure < 60){
        infoPressureState.children[0].innerHTML = "Comfortable";
    }
    else {
        infoPressureState.children[0].innerHTML = "Deep Low";
    }

    let newTime = currentData.dt;
    updateInfo.innerHTML = "Updated on: " + getTime(newTime);

    cityName.classList.add("fadeElement");
    setTimeout(() => cityName.classList.remove("fadeElement"), 2000);
    currentTemp.classList.add("fadeElement");
    setTimeout(() => currentTemp.classList.remove("fadeElement"), 2000);
    feelsLikeTemp.classList.add("fadeElement");
    setTimeout(() => feelsLikeTemp.classList.remove("fadeElement"), 2000);
    weatherType.classList.add("fadeElement");
    setTimeout(() => weatherType.classList.remove("fadeElement"), 2000);
    mainTempImg.classList.add("fadeElement");
    setTimeout(() => mainTempImg.classList.remove("fadeElement"), 2000);
    windSpeedNumber.classList.add("fadeElement");
    setTimeout(() => windSpeedNumber.classList.remove("fadeElement"), 2000);
    windGustsNumber.classList.add("fadeElement");
    setTimeout(() => windGustsNumber.classList.remove("fadeElement"), 2000);
    infoCloudsNumber.classList.add("fadeElement");
    setTimeout(() => infoCloudsNumber.classList.remove("fadeElement"), 2000);
    infoVisibilityNumber.classList.add("fadeElement");
    setTimeout(() => infoVisibilityNumber.classList.remove("fadeElement"), 2000);
    infoHumidityNumber.classList.add("fadeElement");
    setTimeout(() => infoHumidityNumber.classList.remove("fadeElement"), 2000);
    infoPressureNumber.classList.add("fadeElement");
    setTimeout(() => infoPressureNumber.classList.remove("fadeElement"), 2000);
}

function getHourlyWeather(hourlyData, timezoneOffset){
    const childList = document.getElementById("weatherForecast").children;
    let i = 0;

    while(i < childList.length){
        childList[i].children[0].innerHTML = getChildTime(hourlyData[i+1].dt, timezoneOffset);
        childList[i].children[1].src = getWeatherType((hourlyData[i+1].weather[0].icon)[2], hourlyData[i+1].weather[0].id);
        childList[i].children[2].innerHTML = Math.round(hourlyData[i+1].temp) + "°C";
        i++
    }

}

function getDailyWeather(dailyData, timezoneOffset){
    const childList = document.getElementById("dayForecastContainer").children;
    let i = 0;

    while(i < 5){
        childList[i].children[0].children[0].children[0].children[0].innerHTML = getDailyTime(dailyData[i].dt, timezoneOffset);
        childList[i].children[0].children[0].children[1].children[0].innerHTML = Math.round(dailyData[i].temp.min);
        childList[i].children[0].children[0].children[1].children[1].innerHTML = Math.round(dailyData[i].temp.max);
        childList[i].children[0].children[1].innerHTML = dailyData[i].weather[0].main;
        childList[i].children[0].children[2].src = getWeatherType((dailyData[i].weather[0].icon)[2], dailyData[i].weather[0].id);

        childList[i].children[1].children[0].children[1].innerHTML = Math.round(dailyData[i].wind_speed);

        childList[i].children[1].children[1].children[1].innerHTML = Math.round(dailyData[i].uvi);

        if(dailyData[i].uvi >= 0 && dailyData[i].uvi < 3){
            childList[i].children[1].children[1].children[2].innerHTML = "Low";
        }
        else if(dailyData[i].uvi >= 3 && dailyData[i].uvi < 6){
            childList[i].children[1].children[1].children[2].innerHTML = "Moderate";
        }
        else if(dailyData[i].uvi >= 6 && dailyData[i].uvi < 8){
            childList[i].children[1].children[1].children[2].innerHTML = "High";
        }
        else if(dailyData[i].uvi >= 8 && dailyData[i].uvi < 11){
            childList[i].children[1].children[1].children[2].innerHTML = "Very High";
        }
        else {
            childList[i].children[1].children[1].children[2].innerHTML = "Extreme";
        }

        childList[i].children[1].children[2].children[1].innerHTML = Math.round(dailyData[i].humidity);
        
        childList[i].children[1].children[3].children[1].innerHTML = Math.round(dailyData[i].clouds);
        i++
    }
}

function getTemp(minTemp, curTemp, maxTemp){
    return Math.round((minTemp + curTemp + maxTemp) / 3);
}

function getColorTheme(dayNight, weatherID){
    let i = 0;
    let j = 0;

    if(weatherID > 199 && weatherID < 300){
        document.body.style.background = "linear-gradient(145deg, rgba(0,4,32,1) 0%, rgba(1,23,82,1) 100%)";
        document.body.style.color = "white";
        mainInfoHr.style.border = "1px solid white";
        feelsLikeText.style.color = "rgba(250, 198, 0,1)";
        todayForecastText.style.color = "rgba(250, 198, 0,1)";
        todayHighlightsText.style.color = "rgba(250, 198, 0,1)";
        windMeasurement.style.color = "rgba(250, 198, 0,1)";
        gustMeasurement.style.color = "rgba(250, 198, 0,1)";
        fiveDayForecastText.style.color = "rgba(250, 198, 0,1)";
        
        windIcon.src = "./icons/wind-icon-yellow.png";
        cloudsIcon.src = "./icons/clouds-icon-yellow.png";
        pressureIcon.src = "./icons/pressure-icon-yellow.png";
        uvIcon.src = "./icons/uv-icon-yellow.png";
        humidityIcon.src = "./icons/humidity-icon-yellow.png";
        visibilityIcon.src = "./icons/visibility-icon-yellow.png";
        windDirectionPointer.src = "./icons/arrow-icon-yellow.png";

        let i = 0;

        while(i < additionalMeasurementSymbol.length){
            additionalMeasurementSymbol[i].style.color = "rgba(250, 198, 0,1)";
            i++;
        }

        i = 0;

        while(i < additionalInfoImg.length){
            additionalInfoImg[i].src = "./icons/wind-icon-yellow.png";
            additionalInfoImg[i+1].src = "./icons/uv-icon-yellow.png";
            additionalInfoImg[i+2].src = "./icons/humidity-icon-yellow.png";
            additionalInfoImg[i+3].src = "./icons/clouds-icon-yellow.png";
            i+=4;
        }

        i=0;

        while(i < highlightsColumns.children.length){
            
            while(j < highlightsColumns.children[i].children.length){
                highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(1,23,82,1)";
                j++;
            }
            
            j = 0;

            if(i == 0){

            }
            else{
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(250, 198, 0,1)";
                    j++;
                }
            }

            j = 0;

            i++;
        }

        i = 0;
        j = 0;

        while(i < weatherForecast.children.length){
            weatherForecast.children[i].style.backgroundColor = "rgba(1,23,82,1)";
            dayForecastContainer.children[i].style.backgroundColor = "rgba(1,23,82,1)";
            i++;
        }

        i = 0;

        while(i < weatherForecast.children.length){
            dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(250, 198, 0,1)";
            i++;
        }

    }
    else if(weatherID > 299 && weatherID < 600){
        if(dayNight== "d"){
            document.body.style.background = "linear-gradient(145deg, rgba(60,83,105,1) 0%, rgba(78,104,129,1) 100%)";
            document.body.style.color = "white";
            mainInfoHr.style.border = "1px solid white";
            feelsLikeText.style.color = "rgba(179, 218, 254,1)";
            todayForecastText.style.color = "rgba(179, 218, 254,1)";
            todayHighlightsText.style.color = "rgba(179, 218, 254,1)";
            windMeasurement.style.color = "rgba(179, 218, 254,1)";
            gustMeasurement.style.color = "rgba(179, 218, 254,1)";
            fiveDayForecastText.style.color = "rgba(179, 218, 254,1)";

            windIcon.src = "./icons/wind-icon-blue.png";
            cloudsIcon.src = "./icons/clouds-icon-blue.png";
            pressureIcon.src = "./icons/pressure-icon-blue.png";
            uvIcon.src = "./icons/uv-icon-blue.png";
            humidityIcon.src = "./icons/humidity-icon-blue.png";
            visibilityIcon.src = "./icons/visibility-icon-blue.png";
            windDirectionPointer.src = "./icons/arrow-icon-blue.png";

            let i = 0;

            while(i < additionalMeasurementSymbol.length){
                additionalMeasurementSymbol[i].style.color = "rgba(179, 218, 254,1)";
                i++;
            }
    
            i = 0;
            
            while(i < additionalInfoImg.length){
                additionalInfoImg[i].src = "./icons/wind-icon-blue.png";
                additionalInfoImg[i+1].src = "./icons/uv-icon-blue.png";
                additionalInfoImg[i+2].src = "./icons/humidity-icon-blue.png";
                additionalInfoImg[i+3].src = "./icons/clouds-icon-blue.png";
                i+=4;
            }

            i=0;

            while(i < highlightsColumns.children.length){
                
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(108,128,148,1)";
                    j++;
                }
                
                j = 0;

                if(i == 0){

                }
                else{
                    while(j < highlightsColumns.children[i].children.length){
                        highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(179, 218, 254,1)";
                        j++;
                    }
                }

                j = 0;

                i++;
            }

            i = 0;
            j = 0;

            while(i < weatherForecast.children.length){
                weatherForecast.children[i].style.backgroundColor = "rgba(108,128,148,1)";
                dayForecastContainer.children[i].style.backgroundColor = "rgba(108,128,148,1)";
                i++;
            }

            i = 0;

            while(i < weatherForecast.children.length){
                dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(179, 218, 254,1)";
                i++;
            }
        }
        else{
            document.body.style.background = "linear-gradient(145deg, rgba(33,38,43,1) 0%, rgba(54,66,81,1) 100%)";
            document.body.style.color = "white";
            mainInfoHr.style.border = "1px solid white";
            feelsLikeText.style.color = "rgba(179, 218, 254,1)";
            todayForecastText.style.color = "rgba(179, 218, 254,1)";
            todayHighlightsText.style.color = "rgba(179, 218, 254,1)";
            windMeasurement.style.color = "rgba(179, 218, 254,1)";
            gustMeasurement.style.color = "rgba(179, 218, 254,1)";
            fiveDayForecastText.style.color = "rgba(179, 218, 254,1)";
            
            windIcon.src = "./icons/wind-icon-blue.png";
            cloudsIcon.src = "./icons/clouds-icon-blue.png";
            pressureIcon.src = "./icons/pressure-icon-blue.png";
            uvIcon.src = "./icons/uv-icon-blue.png";
            humidityIcon.src = "./icons/humidity-icon-blue.png";
            visibilityIcon.src = "./icons/visibility-icon-blue.png";
            windDirectionPointer.src = "./icons/arrow-icon-blue.png";

            let i = 0;

            while(i < additionalMeasurementSymbol.length){
                additionalMeasurementSymbol[i].style.color = "rgba(179, 218, 254,1)";
                i++;
            }
    
            i = 0;
            
            while(i < additionalInfoImg.length){
                additionalInfoImg[i].src = "./icons/wind-icon-blue.png";
                additionalInfoImg[i+1].src = "./icons/uv-icon-blue.png";
                additionalInfoImg[i+2].src = "./icons/humidity-icon-blue.png";
                additionalInfoImg[i+3].src = "./icons/clouds-icon-blue.png";
                i+=4;
            }

            i=0;

            while(i < highlightsColumns.children.length){
                
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(58, 64, 69,1)";
                    j++;
                }
                
                j = 0;

                if(i == 0){

                }
                else{
                    while(j < highlightsColumns.children[i].children.length){
                        highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(179, 218, 254,1)";
                        j++;
                    }
                }

                j = 0;

                i++;
            }

            i = 0;
            j = 0;

            while(i < weatherForecast.children.length){
                weatherForecast.children[i].style.backgroundColor = "rgba(58, 64, 69,1)";
                dayForecastContainer.children[i].style.backgroundColor = "rgba(58, 64, 69,1)";
                i++;
            }

            i = 0;

            while(i < weatherForecast.children.length){
                dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(179, 218, 254,1)";
                i++;
            }
        }

    }
    else if(weatherID > 599 && weatherID < 700){
        if(dayNight== "d"){
            document.body.style.background = "linear-gradient(145deg, rgba(57,107,137,1) 0%, rgba(221,231,238,1) 100%)";
            document.body.style.color = "black";
            mainInfoHr.style.border = "1px solid black";
            feelsLikeText.style.color = "rgba(179, 218, 254,1)";
            todayForecastText.style.color = "rgba(179, 218, 254,1)";
            todayHighlightsText.style.color = "rgba(179, 218, 254,1)";
            windMeasurement.style.color = "rgba(179, 218, 254,1)";
            gustMeasurement.style.color = "rgba(179, 218, 254,1)";
            fiveDayForecastText.style.color = "rgba(179, 218, 254,1)";
            
            windIcon.src = "./icons/wind-icon-blue.png";
            cloudsIcon.src = "./icons/clouds-icon-blue.png";
            pressureIcon.src = "./icons/pressure-icon-blue.png";
            uvIcon.src = "./icons/uv-icon-blue.png";
            humidityIcon.src = "./icons/humidity-icon-blue.png";
            visibilityIcon.src = "./icons/visibility-icon-blue.png";
            windDirectionPointer.src = "./icons/arrow-icon-blue.png";

            let i = 0;

            while(i < additionalMeasurementSymbol.length){
                additionalMeasurementSymbol[i].style.color = "rgba(179, 218, 254,1)";
                i++;
            }
    
            i = 0;
            
            while(i < additionalInfoImg.length){
                additionalInfoImg[i].src = "./icons/wind-icon-blue.png";
                additionalInfoImg[i+1].src = "./icons/uv-icon-blue.png";
                additionalInfoImg[i+2].src = "./icons/humidity-icon-blue.png";
                additionalInfoImg[i+3].src = "./icons/clouds-icon-blue.png";
                i+=4;
            }

            i=0;

            while(i < highlightsColumns.children.length){
                
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(129,165,186,1)";
                    j++;
                }
                
                j = 0;

                if(i == 0){

                }
                else{
                    while(j < highlightsColumns.children[i].children.length){
                        highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(179, 218, 254,1)";
                        j++;
                    }
                }

                j = 0;

                i++;
            }

            i = 0;
            j = 0;

            while(i < weatherForecast.children.length){
                weatherForecast.children[i].style.backgroundColor = "rgba(129,165,186,1)";
                dayForecastContainer.children[i].style.backgroundColor = "rgba(129,165,186,1)";
                i++;
            }

            i = 0;

            while(i < weatherForecast.children.length){
                dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(179, 218, 254,1)";
                i++;
            }
        }
        else{
            document.body.style.background = "linear-gradient(145deg, rgba(11, 28, 35,1) 0%, rgba(34, 53, 81,1) 100%)";
            document.body.style.color = "white";
            mainInfoHr.style.border = "1px solid white";
            feelsLikeText.style.color = "rgba(179, 218, 254,1)";
            todayForecastText.style.color = "rgba(179, 218, 254,1)";
            todayHighlightsText.style.color = "rgba(179, 218, 254,1)";
            windMeasurement.style.color = "rgba(179, 218, 254,1)";
            gustMeasurement.style.color = "rgba(179, 218, 254,1)";
            fiveDayForecastText.style.color = "rgba(179, 218, 254,1)";
            
            windIcon.src = "./icons/wind-icon-blue.png";
            cloudsIcon.src = "./icons/clouds-icon-blue.png";
            pressureIcon.src = "./icons/pressure-icon-blue.png";
            uvIcon.src = "./icons/uv-icon-blue.png";
            humidityIcon.src = "./icons/humidity-icon-blue.png";
            visibilityIcon.src = "./icons/visibility-icon-blue.png";
            windDirectionPointer.src = "./icons/arrow-icon-blue.png";

            let i = 0;

            while(i < additionalMeasurementSymbol.length){
                additionalMeasurementSymbol[i].style.color = "rgba(179, 218, 254,1)";
                i++;
            }
    
            i = 0;
            
            while(i < additionalInfoImg.length){
                additionalInfoImg[i].src = "./icons/wind-icon-blue.png";
                additionalInfoImg[i+1].src = "./icons/uv-icon-blue.png";
                additionalInfoImg[i+2].src = "./icons/humidity-icon-blue.png";
                additionalInfoImg[i+3].src = "./icons/clouds-icon-blue.png";
                i+=4;
            }

            i=0;

            while(i < highlightsColumns.children.length){
                
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(22, 57, 71,1)";
                    j++;
                }
                
                j = 0;

                if(i == 0){

                }
                else{
                    while(j < highlightsColumns.children[i].children.length){
                        highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(179, 218, 254,1)";
                        j++;
                    }
                }

                j = 0;

                i++;
            }

            i = 0;
            j = 0;

            while(i < weatherForecast.children.length){
                weatherForecast.children[i].style.backgroundColor = "rgba(22, 57, 71,1)";
                dayForecastContainer.children[i].style.backgroundColor = "rgba(22, 57, 71,1)";
                i++;
            }

            i = 0;

            while(i < weatherForecast.children.length){
                dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(179, 218, 254,1)";
                i++;
            }
        }
        
    }
    else if(weatherID > 700 && weatherID < 800){
        document.body.style.background = "linear-gradient(145deg, rgba(51,76,81,1) 0%, rgba(122,156,186,1) 100%)";
        document.body.style.color = "black";
        mainInfoHr.style.border = "1px solid black";
        feelsLikeText.style.color = "rgba(179, 218, 254,1)";
        todayForecastText.style.color = "rgba(179, 218, 254,1)";
        todayHighlightsText.style.color = "rgba(179, 218, 254,1)";
        windMeasurement.style.color = "rgba(179, 218, 254,1)";
        gustMeasurement.style.color = "rgba(179, 218, 254,1)";
        fiveDayForecastText.style.color = "rgba(179, 218, 254,1)";

        windIcon.src = "./icons/wind-icon-blue.png";
        cloudsIcon.src = "./icons/clouds-icon-blue.png";
        pressureIcon.src = "./icons/pressure-icon-blue.png";
        uvIcon.src = "./icons/uv-icon-blue.png";
        humidityIcon.src = "./icons/humidity-icon-blue.png";
        visibilityIcon.src = "./icons/visibility-icon-blue.png";
        windDirectionPointer.src = "./icons/arrow-icon-blue.png";

        let i = 0;

        while(i < additionalMeasurementSymbol.length){
            additionalMeasurementSymbol[i].style.color = "rgba(179, 218, 254,1)";
            i++;
        }
    
        i = 0;
            
        while(i < additionalInfoImg.length){
            additionalInfoImg[i].src = "./icons/wind-icon-blue.png";
            additionalInfoImg[i+1].src = "./icons/uv-icon-blue.png";
            additionalInfoImg[i+2].src = "./icons/humidity-icon-blue.png";
            additionalInfoImg[i+3].src = "./icons/clouds-icon-blue.png";
            i+=4;
        }

        i=0;

        while(i < highlightsColumns.children.length){
                
            while(j < highlightsColumns.children[i].children.length){
                highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(84,115,126,1)";
                j++;
            }
                
            j = 0;

            if(i == 0){

            }
            else{
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(179, 218, 254,1)";
                    j++;
                }
            }

            j = 0;

            i++;

        }

        i = 0;
        j = 0;

        while(i < weatherForecast.children.length){
            weatherForecast.children[i].style.backgroundColor = "rgba(84,115,126,1)";
            dayForecastContainer.children[i].style.backgroundColor = "rgba(84,115,126,1)";
            i++;
        }

        i = 0;

        while(i < weatherForecast.children.length){
            dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(179, 218, 254,1)";
            i++;
        }
    }
    else if(weatherID == 800){
        if(dayNight== "d"){
            document.body.style.background = "linear-gradient(145deg, rgba(4, 99, 202,1) 0%, rgba(155,232,255,1) 100%)";
            document.body.style.color = "black";
            mainInfoHr.style.border = "1px solid black";
            feelsLikeText.style.color = "rgba(250, 198, 0,1)";
            todayForecastText.style.color = "rgba(250, 198, 0,1)";
            todayHighlightsText.style.color = "rgba(250, 198, 0,1)";
            windMeasurement.style.color = "rgba(250, 198, 0,1)";
            gustMeasurement.style.color = "rgba(250, 198, 0,1)";
            fiveDayForecastText.style.color = "rgba(250, 198, 0,1)";

            windIcon.src = "./icons/wind-icon-yellow.png";
            cloudsIcon.src = "./icons/clouds-icon-yellow.png";
            pressureIcon.src = "./icons/pressure-icon-yellow.png";
            uvIcon.src = "./icons/uv-icon-yellow.png";
            humidityIcon.src = "./icons/humidity-icon-yellow.png";
            visibilityIcon.src = "./icons/visibility-icon-yellow.png";
            windDirectionPointer.src = "./icons/arrow-icon-yellow.png";

            let i = 0;

            while(i < additionalMeasurementSymbol.length){
                additionalMeasurementSymbol[i].style.color = "rgba(250, 198, 0,1)";
                i++;
            }
    
            i = 0;
            
            while(i < additionalInfoImg.length){
                additionalInfoImg[i].src = "./icons/wind-icon-yellow.png";
                additionalInfoImg[i+1].src = "./icons/uv-icon-yellow.png";
                additionalInfoImg[i+2].src = "./icons/humidity-icon-yellow.png";
                additionalInfoImg[i+3].src = "./icons/clouds-icon-yellow.png";
                i+=4;
            }

            i=0;

            while(i < highlightsColumns.children.length){
                
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(0,184,255,1)";
                    j++;
                }
                
                j = 0;

                if(i == 0){

                }
                else{
                    while(j < highlightsColumns.children[i].children.length){
                        highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(250, 198, 0,1)";
                        j++;
                    }
                }

                j = 0;

                i++;

            }

            i = 0;
            j = 0;

            while(i < weatherForecast.children.length){
                weatherForecast.children[i].style.backgroundColor = "rgba(0,184,255,1)";
                dayForecastContainer.children[i].style.backgroundColor = "rgba(0,184,255,1)";
                i++;
            }

            i = 0;

            while(i < weatherForecast.children.length){
                dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(250, 198, 0,1)";
                i++;
            }
        }
        else{
            document.body.style.background = "linear-gradient(145deg, rgba(7,11,52,1) 0%, rgba(43,47,119,1) 100%)";
            document.body.style.color = "white";
            mainInfoHr.style.border = "1px solid white";
            feelsLikeText.style.color = "rgba(250, 198, 0,1)";
            todayForecastText.style.color = "rgba(250, 198, 0,1)";
            todayHighlightsText.style.color = "rgba(250, 198, 0,1)";
            windMeasurement.style.color = "rgba(250, 198, 0,1)";
            gustMeasurement.style.color = "rgba(250, 198, 0,1)";
            fiveDayForecastText.style.color = "rgba(250, 198, 0,1)";
            
            windIcon.src = "./icons/wind-icon-yellow.png";
            cloudsIcon.src = "./icons/clouds-icon-yellow.png";
            pressureIcon.src = "./icons/pressure-icon-yellow.png";
            uvIcon.src = "./icons/uv-icon-yellow.png";
            humidityIcon.src = "./icons/humidity-icon-yellow.png";
            visibilityIcon.src = "./icons/visibility-icon-yellow.png";
            windDirectionPointer.src = "./icons/arrow-icon-yellow.png";

            let i = 0;

            while(i < additionalMeasurementSymbol.length){
                additionalMeasurementSymbol[i].style.color = "rgba(250, 198, 0,1)";
                i++;
            }
    
            i = 0;
            
            while(i < additionalInfoImg.length){
                additionalInfoImg[i].src = "./icons/wind-icon-yellow.png";
                additionalInfoImg[i+1].src = "./icons/uv-icon-yellow.png";
                additionalInfoImg[i+2].src = "./icons/humidity-icon-yellow.png";
                additionalInfoImg[i+3].src = "./icons/clouds-icon-yellow.png";
                i+=4;
            }

            i=0;

            while(i < highlightsColumns.children.length){
                
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(72,52,117,1)";
                    j++;
                }
                
                j = 0;

                if(i == 0){

                }
                else{
                    while(j < highlightsColumns.children[i].children.length){
                        highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(250, 198, 0,1)";
                        j++;
                    }
                }

                j = 0;

                i++;
            }

            i = 0;
            j = 0;

            while(i < weatherForecast.children.length){
                weatherForecast.children[i].style.backgroundColor = "rgba(72,52,117,1)";
                dayForecastContainer.children[i].style.backgroundColor = "rgba(72,52,117,1)";
                i++;
            }

            i = 0;

            while(i < weatherForecast.children.length){
                dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(250, 198, 0,1)";
                i++;
            }
        }
    }
    else if(weatherID > 800 && weatherID < 803){
        if(dayNight== "d"){
            document.body.style.background = "linear-gradient(145deg, rgba(102,142,171,1) 0%, rgba(177,196,216,1) 100%)";
            document.body.style.color = "black";
            mainInfoHr.style.border = "1px solid black";
            feelsLikeText.style.color = "rgba(250, 198, 0,1)";
            todayForecastText.style.color = "rgba(250, 198, 0,1)";
            todayHighlightsText.style.color = "rgba(250, 198, 0,1)";
            windMeasurement.style.color = "rgba(250, 198, 0,1)";
            gustMeasurement.style.color = "rgba(250, 198, 0,1)";
            fiveDayForecastText.style.color = "rgba(250, 198, 0,1)";
            
            windIcon.src = "./icons/wind-icon-yellow.png";
            cloudsIcon.src = "./icons/clouds-icon-yellow.png";
            pressureIcon.src = "./icons/pressure-icon-yellow.png";
            uvIcon.src = "./icons/uv-icon-yellow.png";
            humidityIcon.src = "./icons/humidity-icon-yellow.png";
            visibilityIcon.src = "./icons/visibility-icon-yellow.png";
            windDirectionPointer.src = "./icons/arrow-icon-yellow.png";

            let i = 0;

            while(i < additionalMeasurementSymbol.length){
                additionalMeasurementSymbol[i].style.color = "rgba(250, 198, 0,1)";
                i++;
            }
    
            i = 0;
            
            while(i < additionalInfoImg.length){
                additionalInfoImg[i].src = "./icons/wind-icon-yellow.png";
                additionalInfoImg[i+1].src = "./icons/uv-icon-yellow.png";
                additionalInfoImg[i+2].src = "./icons/humidity-icon-yellow.png";
                additionalInfoImg[i+3].src = "./icons/clouds-icon-yellow.png";
                i+=4;
            }

            i=0;

            while(i < highlightsColumns.children.length){
                    
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(102,142,171,1)";
                    j++;
                }
                
                j = 0;

                if(i == 0){

                }
                else{
                    while(j < highlightsColumns.children[i].children.length){
                        highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(250, 198, 0,1)";
                        j++;
                    }
                }

                j = 0;

                i++;
            }

            i = 0;
            j = 0;

            while(i < weatherForecast.children.length){
                weatherForecast.children[i].style.backgroundColor = "rgba(102,142,171,1)";
                dayForecastContainer.children[i].style.backgroundColor = "rgba(102,142,171,1)";
                i++;
            }

            i = 0;

            while(i < weatherForecast.children.length){
                dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(250, 198, 0, 1)";
                i++;
            }
        }
        else{
            document.body.style.background = "linear-gradient(145deg, rgba(50,52,86,1) 0%, rgba(57,107,137,1) 100%)";
            document.body.style.color = "white";
            mainInfoHr.style.border = "1px solid white";
            feelsLikeText.style.color = "rgba(250, 198, 0,1)";
            todayForecastText.style.color = "rgba(250, 198, 0,1)";
            todayHighlightsText.style.color = "rgba(250, 198, 0,1)";
            windMeasurement.style.color = "rgba(250, 198, 0,1)";
            gustMeasurement.style.color = "rgba(250, 198, 0,1)";
            fiveDayForecastText.style.color = "rgba(250, 198, 0,1)";
            
            windIcon.src = "./icons/wind-icon-yellow.png";
            cloudsIcon.src = "./icons/clouds-icon-yellow.png";
            pressureIcon.src = "./icons/pressure-icon-yellow.png";
            uvIcon.src = "./icons/uv-icon-yellow.png";
            humidityIcon.src = "./icons/humidity-icon-yellow.png";
            visibilityIcon.src = "./icons/visibility-icon-yellow.png";
            windDirectionPointer.src = "./icons/arrow-icon-yellow.png";

            let i = 0;

            while(i < additionalMeasurementSymbol.length){
                additionalMeasurementSymbol[i].style.color = "rgba(250, 198, 0,1)";
                i++;
            }
    
            i = 0;
            
            while(i < additionalInfoImg.length){
                additionalInfoImg[i].src = "./icons/wind-icon-yellow.png";
                additionalInfoImg[i+1].src = "./icons/uv-icon-yellow.png";
                additionalInfoImg[i+2].src = "./icons/humidity-icon-yellow.png";
                additionalInfoImg[i+3].src = "./icons/clouds-icon-yellow.png";
                i+=4;
            }

            i=0;

            while(i < highlightsColumns.children.length){
                    
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(32, 70, 92,1)";
                    j++;
                }
                
                j = 0;

                if(i == 0){

                }
                else{
                    while(j < highlightsColumns.children[i].children.length){
                        highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(250, 198, 0,1)";
                        j++;
                    }
                }

                j = 0;

                i++;
            }

            i = 0;
            j = 0;

            while(i < weatherForecast.children.length){
                weatherForecast.children[i].style.backgroundColor = "rgba(32, 70, 92,1)";
                dayForecastContainer.children[i].style.backgroundColor = "rgba(32, 70, 92,1)";
                i++;
            }

            i = 0;

            while(i < weatherForecast.children.length){
                dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(250, 198, 0, 1)";
                i++;
            }
        }
        
    }
    else if(weatherID > 802 && weatherID < 805){
        document.body.style.background = "linear-gradient(145deg, rgba(43, 59, 71,1) 0%, rgba(82, 90, 99,1) 100%)";
        document.body.style.color = "white";
        mainInfoHr.style.border = "1px solid white";
        feelsLikeText.style.color = "rgba(179, 218, 254,1)";
        todayForecastText.style.color = "rgba(179, 218, 254,1)";
        todayHighlightsText.style.color = "rgba(179, 218, 254,1)";
        windMeasurement.style.color = "rgba(179, 218, 254,1)";
        gustMeasurement.style.color = "rgba(179, 218, 254,1)";
        fiveDayForecastText.style.color = "rgba(179, 218, 254,1)";

        windIcon.src = "./icons/wind-icon-blue.png";
        cloudsIcon.src = "./icons/clouds-icon-blue.png";
        pressureIcon.src = "./icons/pressure-icon-blue.png";
        uvIcon.src = "./icons/uv-icon-blue.png";
        humidityIcon.src = "./icons/humidity-icon-blue.png";
        visibilityIcon.src = "./icons/visibility-icon-blue.png";
        windDirectionPointer.src = "./icons/arrow-icon-blue.png";

        let i = 0;

        while(i < additionalMeasurementSymbol.length){
            additionalMeasurementSymbol[i].style.color = "rgba(179, 218, 254,1)";
            i++;
        }

        i = 0;
        
        while(i < additionalInfoImg.length){
            additionalInfoImg[i].src = "./icons/wind-icon-blue.png";
            additionalInfoImg[i+1].src = "./icons/uv-icon-blue.png";
            additionalInfoImg[i+2].src = "./icons/humidity-icon-blue.png";
            additionalInfoImg[i+3].src = "./icons/clouds-icon-blue.png";
            i+=4;
        }

        i=0;

        while(i < highlightsColumns.children.length){
                    
            while(j < highlightsColumns.children[i].children.length){
                highlightsColumns.children[i].children[j].style.backgroundColor = "rgba(57, 78, 94,1)";
                j++;
            }
            
            j = 0;

            if(i == 0){

            }
            else{
                while(j < highlightsColumns.children[i].children.length){
                    highlightsColumns.children[i].children[j].children[1].children[0].children[0].children[1].style.color = "rgba(179, 218, 254,1)";
                    j++;
                }
            }

            j = 0;

            i++;
        }

        i = 0;
        j = 0;

        while(i < weatherForecast.children.length){
            weatherForecast.children[i].style.backgroundColor = "rgba(57, 78, 94,1)";
            dayForecastContainer.children[i].style.backgroundColor = "rgba(57, 78, 94,1)";
            i++;
        }

        i = 0;

        while(i < weatherForecast.children.length){
            dayForecastContainer.children[i].children[0].children[0].children[1].children[0].style.color = "rgba(179, 218, 254, 1)";
            i++;
        }
    }
}

function getWeatherType(dayNight, weatherID){

    if(weatherID > 199 && weatherID < 300){
        return "./img/Thunderstorm.png";
    }
    else if(weatherID > 299 && weatherID < 600){
        return "./img/Rain.png";
    }
    else if(weatherID > 599 && weatherID < 700){
        return "./img/Snow.png";
    }
    else if(weatherID > 700 && weatherID < 800){
        return "./img/Fog.png";
    }
    else if(weatherID == 800){
        if(dayNight== "d"){
            return "./img/Clear.png";
        }
        else{
            return "./img/ClearNight.png";
        }
    }
    else if(weatherID > 800 && weatherID < 803){
        if(dayNight== "d"){
            return "./img/Clouds1.png";
        }
        else{
            return "./img/Clouds1Night.png";
        }
    }
    else if(weatherID > 802 && weatherID < 805){
        return "./img/Clouds2.png";
    }
};

function getTime(unixTime){
    let updateDate = new Date(unixTime*1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let year = updateDate.getFullYear();
    let month = months[updateDate.getMonth()];
    let date = updateDate.getDate();
    let day = days[updateDate.getDay()];
    let hour = updateDate.getHours();
    let min = updateDate.getMinutes();
    if(hour < 10){
        hour = "0" + hour;
    }
    if(min < 10){
        min = "0" + min;
    }

    return (day + " " + date + "-" + month + "-" + year + " " + hour + ":" + min);

}

function getChildTime(unixTime, timezoneNumber){
    let updateDate = new Date(unixTime*1000);
    let dt = new Date();
    let diffTZ = dt.getTimezoneOffset() / 60;
    updateDate.setHours(updateDate.getHours() + diffTZ + timezoneNumber/3600);
    let hour = updateDate.getHours();
    let min = updateDate.getMinutes();
    if(hour < 10){
        hour = "0" + hour;
    }
    if(min < 10){
        min = "0" + min;
    }

    return (hour + ":" + min);

}

function getDailyTime(unixTime, timezoneNumber){
    let updateDate = new Date(unixTime*1000);
    let dt = new Date();
    let diffTZ = dt.getTimezoneOffset() / 60;
    updateDate.setHours(updateDate.getHours() + diffTZ + timezoneNumber/3600);
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let day = days[updateDate.getDay()];

    return day;
}

async function searchCity(lat, lon) {
    const responseCity = await fetch("https://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon=" + lon + "&limit=5&appid=" + APIKey);
    let searchData = await responseCity.json();
    const response = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,alerts&units=metric&appid=" + APIKey);
    let data = await response.json();
    getCurrentWeather(searchData[0].name, data.current);
    getHourlyWeather(data.hourly, data.timezone_offset);
    getDailyWeather(data.daily, data.timezone_offset);
    searchText.value = "";
    searchText.blur();
}
async function searchCityByName(searchContext) {
    const responseCity = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + searchContext + "&limit=5&appid=" + APIKey);
    let searchContextData = await responseCity.json();
    searchCity(searchContextData[0].lat, searchContextData[0].lon);
}
