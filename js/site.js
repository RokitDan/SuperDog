const events = [
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

//driver function
buildDropDown();

//this function adds the city names to the dropdown menu and always runs as soon as the HTML page loads
function buildDropDown() {
  //get the <ul> menu from within the dropdown <div>
  let eventDropDown = document.getElementById("eventDropDown");
  //clear out any previous <li> before adding a new <li>
  eventDropDown.innerHTML = "";
  //get the <template>
  const dropDownItemTemplate = document.getElementById("cityDD-template");
  //get the <li> from within the <template>
  let dropDownItemNode = document.importNode(
    dropDownItemTemplate.content,
    true
  );
  //get the <a> tag within the <li>
  let dropDownItem = dropDownItemNode.querySelector("a");
  //modify <a> tag
  dropDownItem.textContent = "All";
  dropDownItem.setAttribute("data-string", "All");
  //add dropdown item for "All" to the dropdown menu
  eventDropDown.appendChild(dropDownItemNode);
  //access the events object
  let currentEvents = getEventData();
  //return a list of distinct cities
  let distinctCities = [...new Set(currentEvents.map((event) => event.city))];
  //loop over the list of distinct cities and add each city to the dropdown menu
  for (let index = 0; index < distinctCities.length; index++) {
    let cityName = distinctCities[index];
    dropDownItemNode = document.importNode(dropDownItemTemplate.content, true);
    dropDownItem = dropDownItemNode.querySelector("a");
    dropDownItem.textContent = cityName;
    dropDownItem.setAttribute("data-string", cityName);
    eventDropDown.appendChild(dropDownItemNode);
  }

  displayStats(currentEvents);
  displayData(currentEvents);
}
//displays the stats for the selected city
function displayStats(currentEvents) {
  let total = 0;
  let average = 0;
  let most = 0;
  let least = currentEvents[0].attendance;

  for (let index = 0; index < currentEvents.length; index++) {
    //24000
    let attendance = currentEvents[index].attendance;
    total += attendance;

    //determine the most attended
    if (most < attendance) {
      most = attendance;
    }

    // determine the least attended
    if (least > attendance) {
      least = attendance;
    }
  }

  average = total / currentEvents.length;

  document.getElementById("total").innerHTML = total.toLocaleString();
  document.getElementById("average").innerHTML = average.toLocaleString(
    "en-US",
    { minimumFractionDigits: 0, maximumFractionDigits: 0 }
  );
  document.getElementById("most").innerHTML = most.toLocaleString();
  document.getElementById("least").innerHTML = least.toLocaleString();
}

// remember: "this" is being passed in, which is an <a> tag
function getEvents(element) {
  let city = element.getAttribute("data-string");
  let currentEvents = getEventData();
  //if the city= "All," do not filter
  if (city != "All") {
    currentEvents = currentEvents.filter(function (event) {
      //filter array by city name
      if (event.city == city) {
        return event;
      }
    });
  }

  displayStats(currentEvents);
  displayData(currentEvents);
}

function getEventData() {
  //check local storage
  let currentEvents = JSON.parse(localStorage.getItem("eventData"));
  if (currentEvents == null) {
    currentEvents = events;
    localStorage.setItem("eventData", JSON.stringify(currentEvents));
  }
  return currentEvents;
}

function displayData(currentEvents) {
  let eventTemplate = document.getElementById("eventData-Template");
  let eventTableBody = document.getElementById("eventTableBody");
  eventTableBody.innerHTML = "";

  for (let index = 0; index < currentEvents.length; index++) {
    let eventNode = document.importNode(eventTemplate.content, true);
    let eventTableColumns = eventNode.querySelectorAll("td");
    eventTableColumns[0].textContent = currentEvents[index].event;
    eventTableColumns[1].textContent = currentEvents[index].city;
    eventTableColumns[2].textContent = currentEvents[index].state;
    eventTableColumns[3].textContent =
      currentEvents[index].attendance.toLocaleString();
    eventTableColumns[4].textContent = new Date(
      currentEvents[index].date
    ).toLocaleDateString();
    eventTableBody.appendChild(eventNode);
  }
}

//saves user-entered event data from modal
function saveEventData() {
  let currentEvents = getEventData();
  let eventObject = {
    event: "",
    city: "",
    state: "",
    attendance: 0,
    date: "",
  };
  //event
  eventObject.event = document.getElementById("newEventName").value;
  eventObject.city = document.getElementById("newCityName").value;
  //state
  let selectedState = document.getElementById("newEventState");
  eventObject.state = selectedState.options[selectedState.selectedIndex].text;
  //attendance
  let attendance = document.getElementById("newEventAttendance").value;
  eventObject.attendance = attendance;
  //date
  let eventDate = document.getElementById("newDate").value;
  let formattedEventDate = `${eventDate} 00:00`;
  eventObject.date = new Date(formattedEventDate).toLocaleDateString();
  //add new event object to local storage
  currentEvents.push(eventObject);
  localStorage.setItem("eventData", JSON.stringify(currentEvents));
  //reset dropdown menu, display stats, and display data
  buildDropDown();
}
