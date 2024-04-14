let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      })
      .catch(error => console.error('Error fetching toys:', error));
  }

  function createToyCard(toy) {
    const card = document.createElement('div');
    card.classList.add('card');

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;
    card.appendChild(h2);

    const img = document.createElement('img');
    img.src = toy.image;
    img.classList.add('toy-avatar');
    card.appendChild(img);

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;
    card.appendChild(p);

    const likeBtn = document.createElement('button');
    likeBtn.classList.add('like-btn');
    likeBtn.id = toy.id;
    likeBtn.textContent = 'Like ❤️';
    likeBtn.addEventListener('click', () => increaseLikes(toy));
    card.appendChild(likeBtn);
    return card;
  }

  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(toyForm);
    const name = formData.get('name');
    const image = formData.get('image');

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(data => {
        const card = createToyCard(data);
        toyCollection.appendChild(card);
        toyForm.reset();
      })
      .catch(error => console.error('Error adding new toy:', error));
  });

  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        const card = document.getElementById(updatedToy.id);
        const likeCount = card.querySelector('p');
        likeCount.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error increasing likes:', error));
  }
  fetchToys();
});

