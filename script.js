let listings = JSON.parse(localStorage.getItem('listings')) || [];
let editIndex = null;

function previewImage(event){
  const reader = new FileReader();
  reader.onload = function(){
    document.getElementById('imgPreview').src = reader.result;
    document.getElementById('imgPreview').style.display = 'block';
  };
  reader.readAsDataURL(event.target.files[0]);
}

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
          <button class="edit" onclick="editListing(${idx})">Edit</button>
          <button class="delete" onclick="deleteListing(${idx})">Delete</button>
          <button class="favorite-btn" onclick="toggleFavorite(${idx})">${l.favorite ? '★' : '☆'}</button>
        </div>
      </div>`;
  });
}

function addOrUpdateListing(){
  let title = document.getElementById('title').value.trim();
  let city = document.getElementById('city').value.trim();
  let area = Number(document.getElementById('area').value);
  let price = Number(document.getElementById('price').value);
  let owner = document.getElementById('owner').value.trim();
  let contact = document.getElementById('contact').value.trim();
  let desc = document.getElementById('desc').value.trim();
  let image = document.getElementById('imgPreview').src || '';

  if(!title || !city || !area || !price){ 
    alert('Please fill required fields'); 
    return; 
  }

  if(editIndex !== null){
    listings[editIndex] = {title, city, area, price, owner, contact, desc, image, favorite: listings[editIndex].favorite || false};
    editIndex = null;
  } else {
    listings.push({title, city, area, price, owner, contact, desc, image, favorite: false});
  }

  localStorage.setItem('listings', JSON.stringify(listings));
  clearForm();
  renderListings();
}

function editListing(idx){
  let l = listings[idx];
  document.getElementById('title').value = l.title;
  document.getElementById('city').value = l.city;
  document.getElementById('area').value = l.area;
  document.getElementById('price').value = l.price;
  document.getElementById('owner').value = l.owner;
  document.getElementById('contact').value = l.contact;
  document.getElementById('desc').value = l.desc;
  document.getElementById('imgPreview').src = l.image;
  document.getElementById('imgPreview').style.display = l.image ? 'block' : 'none';
  editIndex = idx;
}

function deleteListing(idx){
  if(confirm('Delete this listing?')){
    listings.splice(idx, 1);
    localStorage.setItem('listings', JSON.stringify(listings));
    renderListings();
  }
}

function clearForm(){
  document.getElementById('title').value = '';
  document.getElementById('city').value = '';
  document.getElementById('area').value = '';
  document.getElementById('price').value = '';
  document.getElementById('owner').value = '';
  document.getElementById('contact').value = '';
  document.getElementById('desc').value = '';
  document.getElementById('imgPreview').src = '';
  document.getElementById('imgPreview').style.display = 'none';
  editIndex = null;
}

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

renderListings();
