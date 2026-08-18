// ============================================================
// Kirim Kunci — Verifikasi Akhir
// DevXperience Codelines 2026
//
// Verifikasi dilakukan dengan membandingkan hash SHA-256 dari
// input peserta terhadap hash kunci asli. Ini SENGAJA di-hash,
// bukan disimpan polos, supaya halaman submit ini sendiri tidak
// jadi jalan pintas buat lihat flag lewat View Source.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  initFormKirimKunci();
});

var HASH_KUNCI_ASLI =
  "d825c9c285008ceae29cba9392df84b8022ad32c224225a3aa405e72820323f8";
var POLA_FORMAT = /^DEVX26\{.+\}$/;

// ---------- Pesan kalau formatnya aja udah ngaco ----------
var PESAN_FORMAT_SALAH = [
  "Cie salah ah, Formatnya.",
  "Sistem bingung baca ini.",
  "Hmm, ini kayaknya bukan kunci.",
  "Format ditolak duluan sebelum sempat dicek isinya. Coba samain sama contoh formatnya dulu.",
  "Serius ini yang mau disubmit?."
];

// ---------- Pesan kalau formatnya benar tapi isinya salah ----------
var PESAN_SALAH = [
  "DITOLAK. salah kunci, coba lagi yaa",
  "Meleset. Coba scroll lagi semangat",
  "Bukan ini. wluwlwuwluwlu",
  "Nope. Sistem cuma bisa bilang: sabar itu kunci, literally kamu lagi nyari kunci.",
  "Salah, tapi semangatnya lumayan. Coba curigai comment yang keliatan 'biasa aja', bukan cuma yang ditulis gede-gede.",
  "Gagal verifikasi. Jangan menyerah",
  "Access denied. eaaa",
];

// ---------- Pesan pembuka kalau berhasil ----------
var PESAN_BENAR = [
  "SELAMAT! Kamu berhasil nemuin kunci asli. Sekarang bikin write-up-nya yaa.",
  "CONFIRMED! Di suatu tempat, panitia baru aja nangis bahagia. Sekarang bikin write-up-nya yaa.",
  "VALID! kunci asli berhasil diverifikasi. Sekarang bikin write-up-nya yaa.",
];

function acakDariArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hashSHA256(teks) {
  var enkoder = new TextEncoder();
  var data = enkoder.encode(teks);
  return window.crypto.subtle.digest("SHA-256", data).then(function (buffer) {
    var byteArray = Array.from(new Uint8Array(buffer));
    return byteArray
      .map(function (b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  });
}

function escapeHTML(teks) {
  var div = document.createElement("div");
  div.textContent = teks;
  return div.innerHTML;
}

function tampilkanFormatSalah(elemen, pesan) {
  elemen.className = "hasil-verifikasi hasil-salah";
  elemen.innerHTML = "<p>" + pesan + "</p>";
}

function tampilkanSalah(elemen, pesan) {
  elemen.className = "hasil-verifikasi hasil-salah";
  elemen.innerHTML = "<p>" + pesan + "</p>";
}

function tampilkanBenar(elemen, nilai) {
  var pembuka = acakDariArray(PESAN_BENAR);
  elemen.className = "hasil-verifikasi hasil-benar";
  elemen.innerHTML =
    "<p class=\"pesan-eksentrik\">" + pembuka + "</p>" +
    "<p><strong>Kunci terverifikasi:</strong> <code>" + escapeHTML(nilai) + "</code></p>" +
    "<div class=\"langkah-writeup\">" +
      "<h3>📝 Langkah Selanjutnya: Bikin Write-up</h3>" +
      "<ol>" +
        "<li><strong>Sebut tools-nya.</strong> Browser apa dan fitur DevTools mana aja yang kamu pakai (Elements, Console, Styles, dll).</li>" +
        "<li><strong>Ceritain alurnya secara runtut.</strong> Mulai dari halaman pertama yang dibuka sampai akhirnya nemu comment berisi kunci asli &mdash; termasuk jebakan-jebakan yang sempat bikin muter-muter.</li>" +
        "<li><strong>Kasih bukti visual.</strong> Screenshot bagian DOM/comment yang nunjukkin lokasi kunci, bukan cuma nulis &ldquo;ketemu di sini&rdquo; tanpa gambar.</li>" +
        "<li><strong>Refleksi singkat.</strong> Kenapa decoy-decoy tadi bisa ngecoh, dan pelajaran apa yang kamu bawa pulang buat challenge web berikutnya.</li>" +
        "<li><strong>Kumpulkan sesuai format panitia</strong> (markdown atau PDF, sertakan kunci akses di dalamnya) sebelum batas waktu yang ditentukan.</li>" +
      "</ol>" +
    "</div>";
}

function initFormKirimKunci() {
  var form = document.getElementById("formKirimKunci");
  var input = document.getElementById("inputKunci");
  var hasil = document.getElementById("hasilVerifikasi");
  var tombol = document.getElementById("tombolVerifikasi");
  if (!form || !input || !hasil) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nilai = input.value.trim();
    if (nilai === "") return;

    if (!POLA_FORMAT.test(nilai)) {
      tampilkanFormatSalah(hasil, acakDariArray(PESAN_FORMAT_SALAH));
      return;
    }

    if (tombol) {
      tombol.disabled = true;
      tombol.textContent = "Memverifikasi...";
    }

    hashSHA256(nilai).then(function (hashInput) {
      if (tombol) {
        tombol.disabled = false;
        tombol.textContent = "Verifikasi Kunci";
      }
      if (hashInput === HASH_KUNCI_ASLI) {
        tampilkanBenar(hasil, nilai);
      } else {
        tampilkanSalah(hasil, acakDariArray(PESAN_SALAH));
      }
    }).catch(function () {
      if (tombol) {
        tombol.disabled = false;
        tombol.textContent = "Verifikasi Kunci";
      }
      tampilkanSalah(hasil, "Verifikasi gagal dijalankan di browser ini. Coba akses lewat HTTPS atau browser lain.");
    });
  });
}
