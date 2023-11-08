
async function displayPingHeatMap() {
    const url = "http://localhost:8098/plainjsonpingheatmap";
    const userElm = document.querySelector(".user"); // Waarom is dit ".user" en niet "user"?
    userElm.textContent = "Loading ...";
    var headers = {}
    
    fetch(url, {
        method : "GET",
        mode: 'no-cors',
        headers: headers
    })
    .then((response) => {
        if (!response.ok) {
			console.log("ERROR code in RESPONSE!!! \n" + response.error);
	        throw new Error(response.error);
        }
        return response.json();
    })
    .then(data => {
		const obj = JSON.parse(data);
        obj.forEach(element => console.log(element));
    })
    .catch(function(error) {
        userElm.innerHTML = "An error occurred (Exception): " + error;
        console.log(error);
    });
}