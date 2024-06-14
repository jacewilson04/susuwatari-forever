const forum = document.getElementById('signup_forum');
const username_input = document.getElementById('username');
const password_input = document.getElementById('password');
const email_input = document.getElementById('email');

forum.addEventListener("submit", async (event) => {
    event.preventDefault();
    let username = username_input.value;
    let password = password_input.value;
    let email = email_input.value;

    // Asks the server to create an account
    const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password, email }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/');
    }
})