import "./style.css";

const eventContainer = document.querySelector("#events-container");

function generateColor() {
  const colors = ["blue", "amber", "rose", "indigo", "slate", "pink", "orange"];
  return colors[Math.floor(Math.random() * (colors.length - 1))];
}

function formatDate(date: Date) {
  const calendarDate = date.toLocaleDateString("en-US", {
    month: "short",
    weekday: "long",
    day: "numeric",
  });

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const month = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const day = date.toLocaleDateString("en-US", {
    day: "numeric",
  });

  const calendarTime = date.toLocaleTimeString("en-US", {
    hourCycle: "h12",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    date: calendarDate,
    time: calendarTime,
    weekday,
    month,
    day,
  };
}

function deriveEvent(event: any) {
  let startDate = event.start.dateTime
    ? formatDate(new Date(event.start.dateTime))
    : formatDate(new Date(`${event.start.date}T00:00:00`));

  let endDate = event.end.dateTime
    ? formatDate(new Date(event.end.dateTime))
    : formatDate(new Date(`${event.end.date}T00:00:00`));

  return {
    name: event.summary,
    description: event.description,
    location: event.location,
    start: startDate,
    end: endDate,
    // dateRange,
    link: event.htmlLink,
  };
}

async function loadEvents(maxEvents: number = 8) {
  try {
    const endpoint = await fetch(
      `./.netlify/functions/calendarFetcher?maxResults=${maxEvents}`
    );
    const data = await endpoint.json();
    const processedEvent = data.map((e: any) => deriveEvent(e));

    if (eventContainer) {
      eventContainer.innerHTML = processedEvent
        .map((event: any, i: any) => createEvent(event, i))
        .join("");
    } else {
      console.error("I cannot find my DOM!");
    }
  } catch (error) {
    if (eventContainer) {
      eventContainer.innerHTML = `<p class="text-center text-3xl">🙀 Something went wrong</p>`;
    }
    console.log(error);
  }
}

function createEvent(event: any, idx: number) {
  return `
    <article
      class="bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-slate-800 rounded-lg"
    >
      <div
        class="p-3 shadow bg-${generateColor()}-500 text-indigo-50 uppercase grid place-items-center rounded-t-lg"
      >
        <p class="text-sm">${event.start.month}</p>
        <p class="text-3xl font-bold">${event.start.day}</p>
      </div>
      <div class="p-4 md:p-6 lg:p-8 grid gap-4 md:gap-6">
        <div class="grid gap-1">
          <p class="text-slate-400 text-sm">Feb 13-Feb 16</p>
          <h2 class="font-bold text-2xl">
            <a href="${event.link}">${event.name}</a>
            <p class="text-slate-400 text-sm">${
              event.location ? event.location : "N/A"
            }</p>
          </h2>
          <div class="grid gap-1">
            <button
              aria-expanded="false"
              aria-controls="details-${idx}"
              id="btn-${idx}"
              class="text-slate-400 flex gap-1 items-center cursor-pointer"
            >
              <p class="pointer-events-none">See Details</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-4 w-4 pointer-events-none transition-transform"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <div class="grid gap-1 hidden" aria-labelledby="btn-${idx}" id="details-${idx}">
              <p class="text-slate-400">
                ${event.description ?? "No notes..."}
              </p>
            </div>
          </div>
        </div>
        <a
          target="_blank"
          href="${event.link}"
          class="bg-indigo-500 rounded-md px-4 py-2 text-indigo-50 shadow-2xl shadow-indigo-200 dark:shadow-none text-center font-bold hover:shadow-none ring ring-offset-0 ring-indigo-500 focus:outline-none focus:ring-offset-2 transition-all"
          >View Event</a
        >
      </div>
    </article>
  `;
}

loadEvents();

// @ts-ignore
eventContainer.addEventListener("click", (e: any) => {
  if (!e.target) {
    return null;
  }

  if (e.target.hasAttribute("aria-expanded")) {
    e.target.setAttribute(
      "aria-expanded",
      e.target.getAttribute("aria-expanded") === "false" ? "true" : "false"
    );
    e.target.querySelector("svg").classList.toggle("rotate-180");
    e.target.nextElementSibling.classList.toggle("hidden");
  }
});
