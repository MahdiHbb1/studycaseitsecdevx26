// ============================================================
// Portal Verifikasi Peserta — DevXperience Codelines 2026
// Semua interaksi di file ini murni kecoh/hiasan, tidak ada
// validasi flag di sisi client. Flag asli hanya ada di source
// HTML (lihat panduan panitia).
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  initTombolJebakan();
  initTombolKabur();
  initDevtoolsToast();
  initCaptchaPalsu();
  initHitungMundur();
});

// ---------- Modal "klaim flag" palsu ----------
function initTombolJebakan() {
  var tombol = document.getElementById("tombolJebakan");
  var overlay = document.getElementById("overlayModal");
  var tutup = document.getElementById("tutupModal");
  if (!tombol || !overlay) return;

  var pesanPalsu = [
    "DEVX26{k4mu_kur4ng_t3liti}",
    "DEVX26{ini_cuma_jebakan_woy}",
    "DEVX26{coba_lagi_ya_dek}",
    "DEVX26{jangan_menyerah_dong}"
  ];

  tombol.addEventListener("click", function () {
    var flagPalsu = pesanPalsu[Math.floor(Math.random() * pesanPalsu.length)];
    var kode = document.getElementById("kodePalsu");
    if (kode) kode.textContent = flagPalsu;
    overlay.classList.add("tampil");
  });

  if (tutup) {
    tutup.addEventListener("click", function () {
      overlay.classList.remove("tampil");
    });
  }
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) overlay.classList.remove("tampil");
  });
}

// ---------- Tombol yang kabur dari kursor ----------
function initTombolKabur() {
  var tombol = document.getElementById("tombolKabur");
  var arena = document.getElementById("arenaKabur");
  if (!tombol || !arena) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return; // hormati preferensi aksesibilitas, tombol diam saja

  function kabur() {
    var batas = arena.getBoundingClientRect();
    var lebar = tombol.offsetWidth;
    var tinggi = tombol.offsetHeight;
    var maxX = Math.max(batas.width - lebar, 0);
    var maxY = Math.max(batas.height - tinggi, 0);
    var x = Math.random() * maxX;
    var y = Math.random() * maxY;
    tombol.style.position = "absolute";
    tombol.style.left = x + "px";
    tombol.style.top = y + "px";
  }

  tombol.addEventListener("mouseenter", kabur);
  tombol.addEventListener("touchstart", function (e) {
    e.preventDefault();
    kabur();
  });
}

// ---------- Toast "devtools terdeteksi" (murni becandaan) ----------
function initDevtoolsToast() {
  var toast = document.getElementById("toastDevtools");
  if (!toast) return;
  var sudahMuncul = false;
  var ambang = 160;

  function cek() {
    if (sudahMuncul) return;
    var lebarBeda = window.outerWidth - window.innerWidth > ambang;
    var tinggiBeda = window.outerHeight - window.innerHeight > ambang;
    if (lebarBeda || tinggiBeda) {
      sudahMuncul = true;
      toast.classList.add("tampil");
      setTimeout(function () {
        toast.classList.remove("tampil");
      }, 4500);
    }
  }
  setInterval(cek, 800);
}

// ---------- CAPTCHA palsu (tidak pernah lolos) ----------
function initCaptchaPalsu() {
  var kotak = document.getElementById("captchaPalsu");
  var status = document.getElementById("statusCaptcha");
  if (!kotak || !status) return;

  kotak.addEventListener("change", function () {
    kotak.checked = false;
    status.textContent = "Verifikasi gagal. Sistem sedang sibuk, coba lagi beberapa saat lagi.";
  });
}

// ---------- Hitung mundur palsu yang looping ----------
function initHitungMundur() {
  var elemen = document.getElementById("hitungMundur");
  if (!elemen) return;
  var total = 5 * 60; // 5 menit, murni dekorasi, tidak menutup apa pun

  function render() {
    var menit = Math.floor(total / 60);
    var detik = total % 60;
    elemen.textContent =
      String(menit).padStart(2, "0") + ":" + String(detik).padStart(2, "0");
    total -= 1;
    if (total < 0) total = 5 * 60; // reset, form "tidak pernah" benar-benar ditutup
  }
  render();
  setInterval(render, 1000);
}

// ---------- Form kontak (non-fungsional, hanya toast) ----------
function initFormKontak() {
  var form = document.getElementById("formKontak");
  var toast = document.getElementById("toastKirim");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (toast) {
      toast.classList.add("tampil");
      setTimeout(function () { toast.classList.remove("tampil"); }, 4000);
    }
  });
}
document.addEventListener("DOMContentLoaded", initFormKontak);
