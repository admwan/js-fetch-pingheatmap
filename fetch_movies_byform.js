

async function displayMovies(inputValue) {
    const url = "http://localhost:8000/FILM.json";
    const userElm = document.querySelector(".user"); // Waarom is dit ".user" en niet "user"?
    userElm.textContent = "Loading ...";
    const dummyNoMovies = inputValue;
    let headers = {}
    
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
         let showNoMovies = dummyNoMovies < data.length ? dummyNoMovies : data.length; 
        userElm.innerHTML = "Showing " + showNoMovies + " movie titles in the file.<br>";
        for(let i = 0; i < showNoMovies; i++) {
			userElm.innerHTML += data[i].Title + "<br>"	
		}
        data.forEach(element => console.log(element.Title));
    })
    .catch(function(error) {
        userElm.innerHTML = "An error occurred (Exception): " + error;
        console.log(error);
    });
}