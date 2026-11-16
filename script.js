/* QUARK INVITATIONS · Funciones · Versión 03 */

/* 1. DATOS EDITABLES */
const CONFIG = {
  eventDate: "2026-12-19T22:30:00-03:00",
  giftAlias: "LA.CUARENTONA.NX",
  whatsappNumber: "5493821496060", // 549 + código de área + número
  mapUrl: "https://maps.app.goo.gl/Nughtwa6YXoMcUbQ7", // enlace de Google Maps
  musicUrl: "musica/cancion.mp3",
  playlistUrl: "https://www.youtube.com/playlist?list=PLG8l7ZL6bw_o", // pegar acá el enlace de la playlist colaborativa de YouTube
  celebrant: "Gianni"
};

const $ = (id) => document.getElementById(id);

/* 2. CUENTA REGRESIVA */
function updateCountdown() {
  const diff = new Date(CONFIG.eventDate).getTime() - Date.now();
  const t = diff > 0 ? diff : 0;
  const v = {
    days: Math.floor(t / 86400000),
    hours: Math.floor(t / 3600000) % 24,
    minutes: Math.floor(t / 60000) % 60,
    seconds: Math.floor(t / 1000) % 60
  };
  for (const k in v) $(k).textContent = String(v[k]).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* 3. COPIAR ALIAS */

$("gift-alias").textContent = CONFIG.giftAlias;

$("copy-alias").addEventListener("click", async () => {
  const btn = $("copy-alias");

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(CONFIG.giftAlias);
    } else {
      const temp = document.createElement("textarea");
      temp.value = CONFIG.giftAlias;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();

      const copied = document.execCommand("copy");
      temp.remove();

      if (!copied) throw new Error("No se pudo copiar");
    }

    btn.textContent = "¡Alias copiado!";
    setTimeout(() => {
      btn.textContent = "Copiar alias";
    }, 2000);

  } catch (e) {
    alert("No se pudo copiar automáticamente. Mantené presionado el alias para copiarlo.");
  }
});

/* 4. MÚSICA */
const music = $("background-music");
const musicButton = $("music-toggle");
if (CONFIG.musicUrl) music.src = CONFIG.musicUrl;

musicButton.addEventListener("click", async () => {
  if (!CONFIG.musicUrl) {
    alert("Todavía no se configuró la música de esta invitación.");
    return;
  }
  if (music.paused) {
    try {
      await music.play();
      musicButton.textContent = "Ⅱ Pausar música";
    } catch (e) {
      alert("No se pudo reproducir la música. Intentá nuevamente.");
    }
  } else {
    music.pause();
    musicButton.textContent = "♫ Activar música";
  }
});

/* 5. UBICACIÓN */
if (CONFIG.mapUrl) {
  $("map-link").href = CONFIG.mapUrl;
} else {
  $("map-link").addEventListener("click", (e) => {
    e.preventDefault();
    alert("La ubicación todavía no está configurada.");
  });
}

/* 6. WHATSAPP Y PLAYLIST */
const wa = (text) =>
  "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text);
$("whatsapp-link").href = wa("¡Hola! Quiero confirmar mi asistencia a tus 40 años. 🖤");
$("song-link").href = wa("¡Hola! Te quiero recomendar una canción para la fiesta. 🎶");

/* Si hay playlist colaborativa, se muestra "Sumar mi canción";
   si no, queda la sugerencia por WhatsApp. */
if (CONFIG.playlistUrl) {
  $("playlist-link").href = CONFIG.playlistUrl;
  $("playlist-link").hidden = false;
  $("song-link").hidden = true;
}

/* 7. APERTURA DEL SOBRE
   Tiempos sincronizados con style.css:
   solapa 0.25s → papel 0.9s → pantalla se desvanece 1.7s–2.3s.
   Se oculta del todo a los 2400 ms. */
const screen = $("envelope-screen");
document.body.classList.add("locked");

function confetti() {
  const colors = ["#111111", "#FFFFFF", "#C0C0C0", "#E5E5E5"];
  for (let i = 0; i < 46; i++) {
    const c = document.createElement("i");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.border = "1px solid #111";
    c.style.animationDelay = Math.random() * 0.8 + "s";
    c.style.animationDuration = 2.2 + Math.random() * 1.6 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4800);
  }
}

$("open-invitation").addEventListener("click", () => {
  window.scrollTo(0, 0);

  screen.classList.add("is-opening");
  confetti();

  setTimeout(() => {
    screen.style.display = "none";
    document.body.classList.remove("locked");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, 2400);
});

/* 8. APARICIÓN DE SECCIONES AL DESLIZAR */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".section").forEach((s) => {
    s.classList.add("rv");
    io.observe(s);
  });
}

/* 9. ÁLBUM SCRAPBOOK INTERACTIVO */

const albumPhotos = [
  "album/foto-1.jpg",
  "album/foto-2.jpg",
  "album/foto-3.jpg",
  "album/foto-4.jpg",
  "album/foto-5.jpg",
  "album/foto-6.jpg",
  "album/foto-7.jpg",
  "album/foto-8.jpg"
];

const albumCaptions = [
  "Mis primeras versiones.",
  "Desde chiquita, con actitud.",
  "Esta también soy yo.",
  "Un poquito de glamour.",
  "Porque sí, me gustó esta foto.",
  "Actitud nunca faltó.",
  "Otra versión de mí.",
  "Y esta tenía que estar."
];

const albumCover = $("album-cover");
const albumViewer = $("album-viewer");
const albumPage = $("album-page");
const albumNumber = $("album-page-number");
const albumPrev = $("album-prev");
const albumNext = $("album-next");
const photoModal = $("photo-modal");
const expandedPhoto = $("expanded-photo");

let currentAlbumPage = 0;

function renderAlbumPage() {
  const firstPhoto = currentAlbumPage * 2;

  albumPage.innerHTML = "";

  for (let i = firstPhoto; i < firstPhoto + 2; i++) {
    if (i >= albumPhotos.length) continue;

    const polaroid = document.createElement("button");
    polaroid.className = "polaroid";
    polaroid.dataset.photo = i;
    polaroid.setAttribute("aria-label", "Ampliar fotografía " + (i + 1));

    const img = document.createElement("img");
    img.src = albumPhotos[i];
    img.alt = "Recuerdo de Gianni " + (i + 1);
    img.loading = "lazy";

    const caption = document.createElement("span");
    caption.textContent = albumCaptions[i];

    polaroid.append(img, caption);
    albumPage.appendChild(polaroid);
  }

  albumNumber.textContent =
    String(currentAlbumPage + 1).padStart(2, "0") + " / 04";

  albumPrev.disabled = currentAlbumPage === 0;
  albumNext.disabled = currentAlbumPage === 3;
}

$("open-album").addEventListener("click", () => {
  albumCover.hidden = true;
  albumViewer.hidden = false;
  currentAlbumPage = 0;
  renderAlbumPage();
});

$("close-album").addEventListener("click", () => {
  albumViewer.hidden = true;
  albumCover.hidden = false;
});

albumPrev.addEventListener("click", () => {
  if (currentAlbumPage > 0) {
    currentAlbumPage--;
    renderAlbumPage();
  }
});

albumNext.addEventListener("click", () => {
  if (currentAlbumPage < 3) {
    currentAlbumPage++;
    renderAlbumPage();
  }
});

/* Ampliar fotografías */
albumPage.addEventListener("click", (e) => {
  const polaroid = e.target.closest(".polaroid");
  if (!polaroid) return;

  const photoIndex = Number(polaroid.dataset.photo);

  expandedPhoto.src = albumPhotos[photoIndex];
  expandedPhoto.alt = "Recuerdo de Gianni " + (photoIndex + 1);
  photoModal.hidden = false;
});

function closePhotoModal() {
  photoModal.hidden = true;
  expandedPhoto.src = "";
}

$("close-photo").addEventListener("click", closePhotoModal);

photoModal.addEventListener("click", (e) => {
  if (e.target === photoModal) closePhotoModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !photoModal.hidden) {
    closePhotoModal();
  }
});

/* 10. GLITTER PLATEADO POR LOS COSTADOS */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const box = document.createElement("div");
  box.className = "glitter";
  document.body.appendChild(box);

  setInterval(() => {
    if (document.hidden || box.children.length > 26) return;

    const p = document.createElement("i");
    const size = 5 + Math.random() * 7;
    const left = Math.random() < 0.5 ? Math.random() * 11 : 89 + Math.random() * 11;

    p.style.cssText =
      "left:" + left + "vw;width:" + size + "px;height:" + size + "px;" +
      "--sway:" + (Math.random() * 40 - 20) + "px;" +
      "animation-duration:" + (7 + Math.random() * 6) + "s";

    box.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }, 450);
})();