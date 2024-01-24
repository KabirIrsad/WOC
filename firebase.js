let UserCred = JSON.parse(sessionStorage.getItem("user-cred"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

let signOut = document.getElementById('signOut');
let Message1 = document.getElementById('one');
let Message2 = document.getElementById('two');
let Message3 = document.getElementById('highScore');

let SignOut = () => {
    sessionStorage.removeItem("user-info");
    window.location.href = 'login.html';
}

let CheckCred = () => {
    if (!sessionStorage.getItem("user-info")){
        window.location.href = 'login.html'
    } else {
        Message1.innerText = "Welcome To The Battlefield, " + UserInfo.username;
        Message2.innerText = "Game Over, " + UserInfo.username;
        // Message3.innerText = "Your High Score was " + UserInfo.score;
    }
}

window.addEventListener('load', CheckCred);
signOut.addEventListener('click', SignOut);