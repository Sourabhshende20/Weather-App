const cityInput=document.getElementById("city")
const searchBtn=document.getElementById("searchBtn")
const mic=document.getElementById("mic")

async function coords(city){
let r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
let d=await r.json()
return d.results[0]
}

async function weather(lat,lon){
let url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
let r=await fetch(url)
return await r.json()
}

function hr(t){
return new Date(t).getHours()+":00"
}

searchBtn.onclick=loadWeather

async function loadWeather(){
let city=cityInput.value.trim()
if(!city)return
let c=await coords(city)
let w=await weather(c.latitude,c.longitude)

place.textContent=c.name
temp.textContent=w.current.temperature_2m+"°"
desc.textContent="Code "+w.current.weather_code

sunrise.textContent="🌅 "+new Date(w.daily.sunrise[0]).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
sunset.textContent="🌇 "+new Date(w.daily.sunset[0]).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})

hourlyRow.innerHTML=""
w.hourly.time.slice(0,12).forEach((t,i)=>{
let d=document.createElement("div")
d.className="hourlyRowItem"
d.innerHTML=hr(t)+"<br>"+w.hourly.temperature_2m[i]+"°"
hourlyRow.appendChild(d)
})

dayList.innerHTML=""
w.daily.time.slice(0,10).forEach((d,i)=>{
let box=document.createElement("div")
box.className="dayItem"
box.innerHTML=new Date(d).toDateString().slice(0,3)+"<br>"+w.daily.temperature_2m_max[i]+"°/"+w.daily.temperature_2m_min[i]+"°"
dayList.appendChild(box)
})
}

mic.onclick=()=>{
let SR=window.SpeechRecognition||window.webkitSpeechRecognition
if(!SR)return alert("Voice search not supported")
let r=new SR()
r.start()

r.onresult=e=>{
cityInput.value=e.results[0][0].transcript
loadWeather()
}
}
