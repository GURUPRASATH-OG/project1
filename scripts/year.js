const cached = JSON.parse(localStorage.getItem("yearData"));
const sysTime = new Date();

if (!cached || sysTime.getTime() > cached.expiry) {
    fetchYear("https://worldtimeapi.org/api/timezone/Asia/Kolkata");
} else {
    document.getElementById("year").textContent = cached.year;
}

//fetch year
async function fetchYear(endpoint) {
    let attempt = 0;
    while (attempt < 200) {
        attempt++;
	try {
	    const controller = new AbortController();
	    const timeout = setTimeout(() => controller.abort(), 2000);

	    const response = await fetch(endpoint, {
                method: "GET",
                signal: controller.signal
	    });
	    clearTimeout(timeout);

	    const data = await response.json();
	    const year = new Date(data.datetime).getFullYear();
	    updateYear(year);
	    return;

        } catch (err) {}
    }
    updateYear(new Date().fullYear());
}

// write year
function updateYear(year) {
    document.getElementById("year").textContent = year;
    const oneDay = 24 * 60 * 60 * 1000; 
    const cacheData = {
        year  : year,
        expiry: sysTime.getTime() + oneDay
    };

    localStorage.setItem("yearData", JSON.stringify(cacheData));
}
