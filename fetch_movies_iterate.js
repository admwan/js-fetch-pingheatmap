
async function displayMovies() {
    const url = "http://localhost:8000/FILM.json";
    const userElm = document.querySelector(".user"); // Waarom is dit ".user" en niet "user"?
    userElm.textContent = "Loading ...";
    var headers = {}
    
    fetch(url, {
        method : "GET",
        mode: 'cors',
        headers: headers
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
    .then(data => {
        userElm.innerHTML = "Titels van de geslecteerde films: <br>" +
        	data.forEach(element => {
				element.Title + "<br>" +
			});
       console.log(data);
    })
    .catch(function(error) {
        userElm.innerHTML = "An error occurred: " + error;
        console.log(error);
    });
}