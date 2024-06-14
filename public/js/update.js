const forum = document.getElementById('update_post_forum');
const title_input = document.getElementById('title');
const content_input = document.getElementById('content');

// Attempts to update a post created by you
forum.addEventListener("submit", async (event) => {
    event.preventDefault();
    let title = title_input.value;
    let content = content_input.value;

    let url = window.location.href

    let split_url = url.split("/")

    let post_id = split_url[split_url.length-1]

    const response = await fetch(`/api/post/${post_id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    }
})