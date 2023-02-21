const gallery = document.querySelector(".images");

fetch("./img/")
  .then(response => response.text())
  .then(text => {
    const files = text.split("\n");
    const imageFiles = files.filter(file => file.match(/\.(jpeg|jpg|png|gif)$/));
    console.log(imageFiles)
    imageFiles.forEach(imageFile => {
      const img = document.createElement("img");
      img.src = "img/" + imageFile;
      gallery.appendChild(img);
    });
  });


const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
event.preventDefault();
const formData = new FormData(form);
const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
});
const result = await response.json();
console.log(result);
});
