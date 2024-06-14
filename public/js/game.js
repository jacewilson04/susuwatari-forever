// The reference for the code I used for the susu rendering
// https://www.youtube.com/watch?v=flQgnCUxHlw

const SIMULATON_SPEED = 16;

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt((this.x ** 2) + (this.y ** 2) )
    }

    multiply(num) {
        this.x = this.x*num;
        this.y = this.y*num;
    }

    add(vector) {
        this.x = this.x+vector.x
        this.y = this.y+vector.y
    }

    distance(vector) {
        return Math.sqrt( ((vector.x-this.x) ** 2) + ((vector.y-this.y)**2) )
    }
}

// Minium distance between samples
let r = 135;
// Limit of samples to choose before rejection
let k = 30;
// Every single position layed out in an array format
let grid = [];
// Cell size
let w = r / Math.sqrt(2);
// Currently used points
let active = []
//number of all the susus
let susu_count = 0

let collums, rows;

let available_posts = [];

let modal = document.getElementById("modal");
let title = document.getElementById("modal_title");
let content = document.getElementById("modal_text");
let author = document.getElementById("modal_author");
let date_label = document.getElementById('modal_date');
let count = document.getElementById('count')

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const finish_render = async () => {
    const response = await fetch(`/api/post/get-amount/${susu_count}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    available_posts = await response.json()
}

const create_susu = (position) => {
    susu_count++;
    let canvas = document.getElementById("main_canvas");
    const susu = document.createElement("img");

    susu.setAttribute('class', 'susu');
    susu.src = "/assets/sprites/susu.png";
    susu.style.left = position.x  + 'px';
    susu.style.top = position.y + 'px';

    canvas.appendChild(susu);

    susu.addEventListener("click", async () => {
        //When we are out of soots then refresh the page
        if (available_posts.length <= 0) {
            alert("No more posts sorry!")
            document.location.replace('/');
            return;
        }

        let audio = new Audio('/assets/audio/squish.mp3');
        audio.volume = 0.3;
        audio.play();
        susu.remove();

        let post_id = available_posts[0].id;

        available_posts.shift();
        
        const response = await fetch(`/api/post/${post_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        // Falsely incremeant the number on the client and assume that it also went up on the server
        if (count) {
            count.textContent = Number(count.textContent) + 1
        }

        let post = await response.json();

        modal.style.display = "block";
        title.textContent = post.title;
        content.textContent = post.content;
        author.textContent = post.author.username;

        let date = new Date(post.date).toLocaleString()
        date_label.textContent = date;
    });
};

// DEBUG CODE!! easier to view while testing
const create_point = (position) => {
    let canvas = document.getElementById("main_canvas");
    const point = document.createElement("span");

    point.setAttribute('class', 'point');
    point.style.left = position.x + 'px';
    point.style.top = position.y + 'px';

    canvas.appendChild(point);

    return point;
}

const random_with_min = (min, max) => { // min and max included 
    return Math.random() * (max - min + 1) + min;
}

const render = () => {
    // delete everything from the previous frame
    let canvas = document.getElementById("main_canvas");
    canvas.replaceChildren();

    let finished = false;
    
    while (active.length > 0) {
        // random index of active
        let random_index = Math.floor(Math.random()*active.length)
        let pos = active[random_index];

        let found = false;
        // Do loop up to K times
        for (var n = 0; n < k; n++) {
            // Generates a random unit vector
            let sample = new Vector((Math.random()*2)-1, (Math.random()*2)-1);
            let magnitude = random_with_min(r, 2*r);
            sample.multiply(magnitude);
            sample.add(pos);

            let col = Math.floor(sample.x / w);
            let row = Math.floor(sample.y / w);
            
            // Checks if new point is off screen if it is do nothing
            if (!(col > -1 && row > -1 && col < collums && row < rows && !grid[col + row * collums])) {
                continue;
            };

            let ok = true;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let neighbor_index = (col+i) + (row+j) * collums;
                    let neighbor = grid[neighbor_index];

                    // Only do this if there is actually a point here
                    if (!neighbor) { continue }

                    let distance = sample.distance(neighbor);

                    // Points are too close together try again
                    if (distance < r) {
                        ok = false;
                    };
                }
            }

            if (ok) {
                found = true;
                grid[col + row * collums] = sample;
                active.push(sample);
                // For visual clarity remove break for performance
                // break;
            }
        }

        // There are no nearby available points take me out
        if (!found) {
            active.splice(random_index, 1)
        }

        // Now we have a way to end the program yipee
        if (!found && active.length == 0) {
            finished = true;
        }
    }

    for (var i = 0; i < grid.length; i++) {
        if (!grid[i]) { continue };

        let position = new Vector(grid[i].x, grid[i].y)
        create_susu(position) 
    }

    for (var i = 0; i < active.length; i++) {
        let position = new Vector(active[i].x, active[i].y)
        let point = create_point(position)
        point.style.backgroundColor = "purple"
    }

    if (finished) {
        finish_render();
        return;
    };

    setTimeout(render, SIMULATON_SPEED);
}

const init = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;


    collums = Math.floor(width / w)
    rows = Math.floor(height / w)

    // Initialize grid with default values of undefined
    for (let i = 0; i < collums*rows; i++) {
        grid[i] = undefined
    }

    let x = Math.random() * width;
    let y = Math.random() * height;

    // Get position in array
    let i = Math.floor(x / w);
    let j = Math.floor(y / w);

    // random starting point
    let random_pos = new Vector(x, y);

    grid[i + j * collums] = random_pos;
    active.push(random_pos)

    render();
}

document.addEventListener('DOMContentLoaded', init);