  function handleError(err) {
	//const userEl = document.querySelector(".user");
	console.log("OH NO!");
	console.log(err);
	//userEl.texContent = 'Something went wrong: ${err}';
}


async function displayUser(username) {
	const baseEndpoint = "https://api.github.com";
	const usersEndpoint = `${baseEndpoint}/users`;
	const userEl = document.querySelector(".user");
	
    userEl.textContent = "loading...";
    
    const response = await fetch(`${usersEndpoint}/${username}`).catch(handleError);
    //const response = await fetch('https://api.github.com/users/wesbos');
    const data = await response.json();
    
    console.log(data);
    console.log(data.blog);
    console.log(data.name);
    console.log(data.location);
    userEl.textContent = `${data.name} - ${data.blog}`;
  }
  
