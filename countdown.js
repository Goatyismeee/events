// Calling the function
runClock ();
setInterval("runClock()", 100);

// Function to create and run the countdown clock
function runClock () {
   const currentDay = new Date();

   // Calculating days
      const newYear = new Date("1 January");
      const nextYear = currentDay.getFullYear() + 1;
      newYear.setFullYear(nextYear);

      const daysLeft = (newYear - currentDay)/(1000*60*60*24);
      const hrsLeft = (daysLeft - Math.floor(daysLeft))*24;
      const minsLeft = (hrsLeft - Math.floor(hrsLeft))*60;
      const secsLeft = (minsLeft - Math.floor(minsLeft))*60;

      const totalTimeLeft_seconds =  ((newYear - currentDay)/1000)
      const timePassed_seconds = (31536000) - (totalTimeLeft_seconds);
      const timePassed_seconds_percent = (timePassed_seconds / (daysLeft*86400)) * 100


   document.getElementById("days").textContent = Math.floor(daysLeft);
   document.getElementById("hours").textContent = Math.floor(hrsLeft);
   document.getElementById("minutes").textContent = Math.floor(minsLeft);
   document.getElementById("seconds").textContent = Math.floor(secsLeft);
   document.getElementById("secondsLeft").textContent = (totalTimeLeft_seconds)
   document.getElementById("completionBar").style.width = timePassed_seconds_percent + "%"
   document.getElementById("completionText").textContent = parseFloat(timePassed_seconds_percent).toFixed(6) + "% (" + Math.floor(timePassed_seconds) + " seconds)" ;

   // Debugging Purpose
   document.getElementById("h1").textContent
}
   



