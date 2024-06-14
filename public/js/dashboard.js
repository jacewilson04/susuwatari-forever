let logout_button = document.getElementById("logout");

// logout of website (delete???)
logout_button.addEventListener("click", async () => {
    const response = await fetch('/api/users/logout', {
        method: 'DELETE',
    });

    if (response.ok) {
        document.location.replace('/login');
    };
})

const forum = document.getElementById('post_forum');
const title_input = document.getElementById('title');
const content_input = document.getElementById('content');

// submit a new post onto the web
forum.addEventListener("submit", async (event) => {
    event.preventDefault();
    let title = title_input.value;
    let content = content_input.value;

    // Ask server to create a new post
    const response = await fetch('/api/post', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    }
})

// Makes the delete button work
for (let button of [...document.getElementsByClassName("delete")]) {
    button.addEventListener('click', async (event) => {
        let post_id = event.target.parentElement.dataset.id;
        
        const response = await fetch(`/api/post/${post_id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        }
    })
}

// Update button redirects to the update webpage
for (let button of [...document.getElementsByClassName("update")]) {
    button.addEventListener('click', async (event) => {
        let post_id = event.target.parentElement.dataset.id;
        document.location.replace(`/update/${post_id}`)
    })
}