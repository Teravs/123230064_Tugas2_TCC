const API_URL = "https://notes-backend-123230064-498485862524.asia-southeast2.run.app";
let deleteId = null;

// FORMAT
function formatTanggal(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// FETCH
async function fetchNotes() {
  const res = await fetch(`${API_URL}/notes`);
  const data = await res.json();

  const container = document.getElementById("notesList");
  container.innerHTML = "";

  data.forEach(note => {
    const created = formatTanggal(note.tanggal_dibuat);
    const updated = note.tanggal_update 
      ? formatTanggal(note.tanggal_update) 
      : null;

      container.innerHTML += `
      <div class="note">
        ${updated ? `<div class="edited">Edited: ${updated}</div>` : ""}
    
        <h3>${note.judul}</h3>
        <p>${note.isi}</p>
        <small>${created}</small>
    
        <div class="actions">
          <!-- EDIT -->
          <button class="icon-btn" onclick="openModal(${note.id}, \`${note.judul}\`, \`${note.isi}\`)">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18-11.5a1 1 0 0 0 0-1.41l-1.34-1.34a1 1 0 0 0-1.41 0l-1.13 1.13 3.75 3.75L21 5.75z"/>
            </svg>
          </button>
    
          <!-- DELETE -->
          <button class="icon-btn" onclick="openDeleteModal(${note.id})">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M6 7h12v14H6zm3-3h6l1 1h4v2H4V5h4l1-1z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  });
}

// MODAL
function openModal(id = "", judul = "", isi = "") {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("noteId").value = id;
  document.getElementById("judul").value = judul;
  document.getElementById("isi").value = isi;

  document.getElementById("modalTitle").innerText =
    id ? "Edit Catatan" : "Tambah Catatan";
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// SAVE
async function saveNote() {
  const id = document.getElementById("noteId").value;
  const judul = document.getElementById("judul").value;
  const isi = document.getElementById("isi").value;

  if (!judul || !isi) {
    showToast("Isi semua field!");
    return;
  }

  if (id) {
    await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ judul, isi })
    });
    showToast("Note diupdate");
  } else {
    await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ judul, isi })
    });
    showToast("Note ditambahkan");
  }

  closeModal();
  fetchNotes();
}

// DELETE MODAL
function openDeleteModal(id) {
  deleteId = id;
  document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
  document.getElementById("deleteModal").classList.add("hidden");
}

async function confirmDelete() {
  const el = document.querySelector(`[onclick*="${deleteId}"]`).closest(".note");

  el.classList.add("removing");

  setTimeout(async () => {
    await fetch(`${API_URL}/notes/${deleteId}`, {
      method: "DELETE"
    });

    showToast("Note dihapus");
    closeDeleteModal();
    fetchNotes();
  }, 300);
}

// TOAST
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

fetchNotes();