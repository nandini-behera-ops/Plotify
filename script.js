

let listings = JSON.parse(localStorage.getItem('listings')) || [];
let editIndex = null;
let uploadedImages = []; // uploaded images store karenge

// --- Preview before adding ---
function previewImages(event){
  let files = event.target.files;
  let previewContainer = document.getElementById('imgPreviewContainer');
  previewContainer.innerHTML = '';
  uploadedImages = []; // reset

  [...files].forEach(file=>{
    let reader = new FileReader();
    reader.onload = e=>{
      uploadedImages.push(e.target.result); // base64 push
      let img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '60px';
      img.style.height = '60px';
      img.style.borderRadius = '6px';
      img.style.objectFit = 'cover';
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// --- Render Listings ---
function renderListings(data = listings){
  const container = document.getElementById('listings');
  container.innerHTML = '';
  if(!data.length){
    container.innerHTML = '<p class="muted">No plots found</p>';
    return;
  }

  data.forEach((l, idx)=>{
    container.innerHTML += `
      <div class="listing ${l.favorite ? 'favorite' : ''}">
        <img class="thumb" src="${l.image || 'https://via.placeholder.com/150x100?text=Plotify'}" alt="${l.title}">
        <div class="info">
          <div class="title">${l.title}</div>
          <div class="meta">${l.city} • ${l.area || '-'} sqft</div>
          <div class="price">₹ ${Number(l.price).toLocaleString()}</div>
          <div class="muted">${l.desc || ''}</div>
          <div class="muted"><strong>Owner:</strong> ${l.owner} • ${l.contact}</div>
        </div>
        <div class="land-actions">
          ${l.ownerId === loggedInUser.email ? `
            <button class="edit" onclick="editListing(${idx})">Edit</button>
            <button class="delete" onclick="deleteListing(${idx})">Delete</button>
          ` : ``}
          <button class="favorite-btn" onclick="toggleFavorite(${idx})">${l.favorite ? '★' : '☆'}</button>
        </div>
      </div>`;
  });
}

// --- Add / Update ---
function addOrUpdateListing(){
  let title = document.getElementById('title').value.trim();
  let city = document.getElementById('city').value.trim();
  let area = Number(document.getElementById('area').value);
  let price = Number(document.getElementById('price').value);
  let owner = document.getElementById('owner').value.trim();
  let contact = document.getElementById('contact').value.trim();
  let desc = document.getElementById('desc').value.trim();

  if(!title || !city || !area || !price){ 
    alert('Please fill required fields'); 
    return; 
  }

  let image = uploadedImages.length ? uploadedImages[0] : '';

  if(editIndex !== null){
    listings[editIndex] = {
      ...listings[editIndex],
      title, city, area, price, owner, contact, desc,
      image,
      ownerId: loggedInUser.email
    };
    editIndex = null;
  } else {
    listings.push({
      title, city, area, price, owner, contact, desc,
      image,
      ownerId: loggedInUser.email,
      favorite: false
    });
  }

  localStorage.setItem('listings', JSON.stringify(listings));
  clearForm();
  renderListings();
  uploadedImages = [];
}

// --- Edit Listing ---
function editListing(idx){
  let l = listings[idx];
  if(l.ownerId !== loggedInUser.email){
    alert("You cannot edit this listing!");
    return;
  }

  document.getElementById('title').value = l.title;
  document.getElementById('city').value = l.city;
  document.getElementById('area').value = l.area;
  document.getElementById('price').value = l.price;
  document.getElementById('owner').value = l.owner;
  document.getElementById('contact').value = l.contact;
  document.getElementById('desc').value = l.desc;
  editIndex = idx;
}

// --- Delete Listing ---
function deleteListing(idx){
  let l = listings[idx];
  if(l.ownerId !== loggedInUser.email){
    alert("You cannot delete this listing!");
    return;
  }

  if(confirm('Delete this listing?')){
    listings.splice(idx, 1);
    localStorage.setItem('listings', JSON.stringify(listings));
    renderListings();
  }
}

// --- Clear Form ---
function clearForm(){
  document.getElementById('title').value = '';
  document.getElementById('city').value = '';
  document.getElementById('area').value = '';
  document.getElementById('price').value = '';
  document.getElementById('owner').value = '';
  document.getElementById('contact').value = '';
  document.getElementById('desc').value = '';
  document.getElementById('images').value = '';
  document.getElementById('imgPreviewContainer').innerHTML = '';
  editIndex = null;
}

// --- Filters ---
function filterListings(){
  let loc = document.getElementById('searchCity').value.toLowerCase().trim();
  let minP = Number(document.getElementById('minPrice').value) || 0;
  let maxP = Number(document.getElementById('maxPrice').value) || Infinity;
  renderListings(listings.filter(l => l.city.toLowerCase().includes(loc) && l.price >= minP && l.price <= maxP));
}

function resetFilters(){
  document.getElementById('searchCity').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  renderListings();
}

// --- Favorites ---
function toggleFavorite(idx){
  listings[idx].favorite = !listings[idx].favorite;
  localStorage.setItem('listings', JSON.stringify(listings));
  renderListings();
}

function showFavorites(){ 
  renderListings(listings.filter(l => l.favorite)); 
}

function clearAll(){
  if(confirm("Delete all listings?")){
    listings = [];
    localStorage.setItem('listings', JSON.stringify([]));
    renderListings();
  }
}

// --- Login/Logout Check ---
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "login.html";
} else {
  document.getElementById("welcomeUser").textContent = "Hello, " + loggedInUser.fullname;
  document.getElementById("logoutBtn").style.display = "inline-block";
  document.getElementById("loginBtn").style.display = "none";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// --- Init ---
renderListings();
