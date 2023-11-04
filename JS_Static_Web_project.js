/**
 * 
 */
function add(a,b) {
	return a+b;
}

function handleError(err) {
  console.log("OH NO!");
  console.log(err);
}

async function displayUser(username) {
	const endpoint = "https://api.github.com/users/wesbos";
    const userEl = document.querySelector(".user");
	userEl.textContent = " Loading ...";
	const wesPromise = fetch(endpoint);

	wesPromise
		.then((response) => {
			
			return response.json();
			} 
		)
		.then((data) => {
			console.log(data);
			console.log(data.blog);
			console.log(data.name);
			console.log(data.location);
			userEl.textContent = `${data.name} - ${data.blog}`;
			}
		)
		.catch(handleError);
	}
