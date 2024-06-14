const forum = document.getElementById('login_forum');
const username_input = document.getElementById('username');
const password_input = document.getElementById('password');

// Attempts to log a user into their existing account
forum.addEventListener("submit", async (event) => {
    event.preventDefault();
    let username = username_input.value;
    let password = password_input.value;

    const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/');
    }
})