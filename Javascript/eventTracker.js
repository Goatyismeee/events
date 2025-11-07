// const upcomingEvents = [
//   {name:"Bookout #6", start_time:"2025-09-28T00:00:00", end_time:"2025-10-03T18:00:00"},
//   {name:"Bookout #7", start_time:"2025-10-05T00:00:00", end_time:"2025-10-10T18:00:00"},
//   {name:"Bookout #8", start_time:"2025-10-12T00:00:00", end_time:"2025-10-17T18:00:00"},
//   {name:"Bookout #9", start_time:"2025-10-19T00:00:00", end_time:"2025-10-24T18:00:00"},
//   {name:"Bookout #10", start_time:"2025-10-26T00:00:00", end_time:"2025-10-31T18:00:00"},
//   {name:"Bookout #11", start_time:"2025-11-02T00:00:00", end_time:"2025-11-07T18:00:00"},
//   {name:"Bookout #12", start_time:"2025-11-09T00:00:00", end_time:"2025-11-14T18:00:00"},
//   {name:"Bookout #13", start_time:"2025-11-16T00:00:00", end_time:"2025-11-21T18:00:00"},
//   {name:"Bookout #14", start_time:"2025-11-23T00:00:00", end_time:"2025-11-28T18:00:00"},
//   {name:"Bookout #15", start_time:"2025-11-30T00:00:00", end_time:"2025-12-05T18:00:00"},
//   {name:"POP Graduation", start_time:"2025-08-12T08:00:00", end_time:"2025-12-06T00:00:00"},
//   {name:"ORD", start_time:"2025-08-12T08:00:00", end_time:"2027-08-11T18:00:00"},
// ];

let upcomingEvents = [];
let pastEvents = [];
let currentEvent = null;
let currentPage = 0;

// displayUpcomingEvents();
// runClock();
// setInterval("runClock()", 1000);

function getNextEvent() {
  const now = new Date();

  // filter for future events
  const futureEvents = upcomingEvents.filter(e => new Date(e.end_time) > now);

  if (futureEvents.length === 0) {
    return null; // no upcoming events
  }

  // sort by soonest event
  futureEvents.sort((a, b) => new Date(a.end_time) - new Date(b.end_time));
  return futureEvents[0];
}

// Moves expired events into pastEvents array
function updateEvents() {
  const now = new Date();
  
  for (let i = upcomingEvents.length - 1; i >= 0; i--) {
    if (new Date(upcomingEvents[i].end_time) <= now) {
      pastEvents.push(upcomingEvents[i]);
      upcomingEvents.splice(i, 1); // remove from upcoming
    }
  }
  console.log(pastEvents);
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

function displayUpcomingEvents() {
  updateEvents(); //Moves expired events into pastEvents array
  const container = document.getElementById("eventList");
  const pageButton = document.getElementById("next_button");

  
  const eventsPerPage = 5;
  const startIndex = currentPage * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const eventsToShow = upcomingEvents.slice(startIndex, endIndex);
  
  if (upcomingEvents.length > 5) {
    pageButton.style.display = "block";
  }

  // Clear previous content
  container.innerHTML = "UPCOMING EVENTS";

  // Render each event
  eventsToShow.forEach((event, index) => {
    const div = document.createElement("div");
    div.className = "event-item";
    div.textContent = `${index + 1}. ${event.name}`;

    if (currentEvent == event.name) {
      div.style.color = `green`;
    } else {
      div.style.cursor = "pointer"; // optional, show pointer
      div.addEventListener("click", () => {
        // Update countdown/progress bar to this event
        setNextEvent(event);
        displayUpcomingEvents();
      });
    }

    container.appendChild(div);
  });

  // Handle next button visibility
  if (endIndex < upcomingEvents.length) {
    pageButton.style.display = "block";
    pageButton.onclick = () => {
      console.log("ok")
      currentPage++;
      displayUpcomingEvents();
    };
  } else {
    pageButton.style.display = "none"; // hide if no more pages
  }
}

function setNextEvent(event) {
  currentEvent = event;
  runClock();
}

// Function to create and run the countdown clock
function runClock() {
  const currentDay = new Date();
  let nextEvent = currentEvent || getNextEvent();

  if (!nextEvent) {
    document.getElementById("h1").textContent = "No more upcoming events 🎉";
    document.getElementById("completionText").textContent = "";
    document.getElementById("completionBar").style.width = "0%";
    return;
  }

  const eventDate = new Date(nextEvent.end_time);
  const progress = getEventProgress(nextEvent);

  // calculate differences
  const totalSecondsLeft = Math.floor((eventDate - currentDay) / 1000);
  const daysLeft = Math.floor(totalSecondsLeft / (60 * 60 * 24));
  const hrsLeft = Math.floor((totalSecondsLeft % (60 * 60 * 24)) / (60 * 60));
  const minsLeft = Math.floor((totalSecondsLeft % (60 * 60)) / 60);
  const secsLeft = Math.floor(totalSecondsLeft % 60);

  // update DOM
  document.getElementById("text_header").textContent = nextEvent.name;
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

  // show which event we’re counting down to
  // document.getElementById("h1").textContent = "";
  //   "Next Event: " + nextEvent.name + " (" + nextEvent.time + ")";
}

fetch('./events.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load events.json");
    }
    return response.json();
  })
  .then(data => {
    upcomingEvents = data.upcoming || [];
    displayUpcomingEvents();
    runClock();
    setInterval(runClock, 1000);
  })
  .catch(error => console.error("Error loading events:", error));