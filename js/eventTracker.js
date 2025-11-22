const now = new Date();
let currentEvent = null;
let currentPage = 0;

async function main() {
  try {
    const { upcomingEvents, pastEvents } = await loadEvents();
    displayEvents(upcomingEvents, pastEvents);
    runClock();
    setInterval(runClock, 1000);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// FETCHES AND SORTS EVENTS INTO FUTURE AND PAST BASED ON CURRENT DATE TIME
async function loadEvents() {
  var upcomingEvents = [], pastEvents = [];

  try {
    const response = await fetch('./events.json')
    const data = await response.json();

    // sorts events into upcoming and past
    upcomingEvents = data.upcoming;
    for (let i = upcomingEvents.length - 1; i >= 0; i--) {
      if (new Date(upcomingEvents[i].end_time) <= now) {
        pastEvents.push(upcomingEvents[i]);
        upcomingEvents.splice(i, 1); 
      }
    }

    currentEvent = upcomingEvents[0] || null;
    return { upcomingEvents, pastEvents };
  } catch (error) {
    console.error("Error loading events:", error);
  }
}


function displayEvents(upcoming, past) {
  const upcomingListContainer = document.getElementById("upcomingEvents");
  const pastListContainer = document.getElementById("pastEvents");

  // Clears previous content
  upcomingListContainer.innerHTML = "";
  pastListContainer.innerHTML = "";

  // Render upcoming events
  if (upcoming.length != 0) {
    upcoming.forEach((event, index) => {
      const div = document.createElement("div");
      div.className = `event-item`;
      div.textContent = `${index + 1}. ${event.name}`;

      if (currentEvent.name === event.name) {
        div.style.color = `#11FF99`;
      } else {
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
          setSelectedEvent(event);
          displayEvents(upcoming, past);
        });
      }

      upcomingListContainer.appendChild(div);
    });
  }

  // Render past events
  past.forEach((event, index) => {
    const div = document.createElement("div");
    div.className = `event-item`;
    div.textContent = `${index + 1}. ${event.name}`;

    if (currentEvent != null && currentEvent.name === event.name) {
      div.style.color = `#11FF99`;
    } else {
      div.style.cursor = "pointer";
      div.addEventListener("click", () => {
        setSelectedEvent(event);
        displayEvents(upcoming, past);
      });
    }

    pastListContainer.appendChild(div);
  });

  document.querySelectorAll('.eventHeader').forEach(el => {
    el.style.display = 'block';
  });
}

function setSelectedEvent(event) {
  currentEvent = event;
  runClock();
}

// Function to create and run the countdown clock
function runClock() {
  const currentDateTime = new Date();

  if (currentEvent === null) {
    document.getElementById("text_header").textContent = "🎉 No more upcoming events 🎉";
    document.getElementById("completionText").textContent = "";
    document.getElementById("completionBar").style.width = "0%";
    return;
  }

  const eventDate = new Date(currentEvent.end_time);
  const progress = getEventProgress(currentEvent);


  // calculate differences
  const totalSecondsLeft = Math.floor((eventDate - currentDateTime) / 1000);

  // Determines if event has passed
  const eventPassed = totalSecondsLeft <= 0;

  const absSeconds = Math.abs(totalSecondsLeft);
  const daysLeft = Math.floor(absSeconds / (60 * 60 * 24));
  const hrsLeft = Math.floor((absSeconds % (60 * 60 * 24)) / (60 * 60));
  const minsLeft = Math.floor((absSeconds % (60 * 60)) / 60);
  const secsLeft = Math.floor(absSeconds % 60);

  // update DOM
  document.getElementById("text_header").textContent = currentEvent.name;
  document.getElementById("days").textContent = daysLeft;
  document.getElementById("hours").textContent = hrsLeft;
  document.getElementById("minutes").textContent = minsLeft;
  document.getElementById("seconds").textContent = secsLeft;
  document.getElementById("secondsLeft").textContent = totalSecondsLeft;
  document.getElementById("completionText").textContent = "Progress: " + progress.toFixed(3) + "%";

  if (progress >= 100) {
    document.getElementById("completionBar").style.width = "100%";
  } else {
    document.getElementById("completionBar").style.width = progress + "%";
  }
}

function getEventProgress(event) {
  const now = new Date();
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);

  if (now < start) return 0;
  if (now > end) return 100;

  const progress = ((now - start) / (end - start)) * 100;
  return progress;
}

main();
