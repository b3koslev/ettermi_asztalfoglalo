let foglalasok = JSON.parse(localStorage.getItem("foglalasok")) || [];

const form = document.getElementById("foglalasForm");
const nevInput = document.getElementById("nev");
const telefonInput = document.getElementById("telefon");
const datumInput = document.getElementById("datum");
const idoInput = document.getElementById("ido");
const letszamInput = document.getElementById("letszam");
const megjegyzesInput = document.getElementById("megjegyzes");
const idInput = document.getElementById("foglalasId");
const lista = document.getElementById("foglalasLista");
const uzenet = document.getElementById("uzenet");
const keresesInput = document.getElementById("kereses");
const mentesGomb = document.getElementById("mentesGomb");
const megseGomb = document.getElementById("megseGomb");

function mentes() {
    localStorage.setItem("foglalasok", JSON.stringify(foglalasok));
}

function listaFrissit() {
    lista.innerHTML = "";

    const kereses = keresesInput.value.toLowerCase();

    const szurtFoglalasok = foglalasok.filter(function(foglalas) {
        return foglalas.nev.toLowerCase().includes(kereses);
    });

    szurtFoglalasok.forEach(function(foglalas) {
        const sor = document.createElement("tr");

        const adatok = [
            foglalas.nev,
            foglalas.telefon,
            foglalas.datum,
            foglalas.ido,
            foglalas.letszam,
            foglalas.megjegyzes || "-"
        ];

        adatok.forEach(function(adat) {
            const cella = document.createElement("td");
            cella.textContent = adat;
            sor.appendChild(cella);
        });

        const muveletCella = document.createElement("td");

        const modositGomb = document.createElement("button");
        modositGomb.textContent = "Módosítás";
        modositGomb.addEventListener("click", function() {
            modosit(foglalas.id);
        });

        const torolGomb = document.createElement("button");
        torolGomb.textContent = "Törlés";
        torolGomb.addEventListener("click", function() {
            torol(foglalas.id);
        });

        muveletCella.appendChild(modositGomb);
        muveletCella.appendChild(torolGomb);
        sor.appendChild(muveletCella);
        lista.appendChild(sor);
    });

    document.getElementById("statisztika").textContent =
        "Összes foglalás: " + foglalasok.length;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const foglalas = {
        id: idInput.value || Date.now().toString(),
        nev: nevInput.value.trim(),
        telefon: telefonInput.value.trim(),
        datum: datumInput.value,
        ido: idoInput.value,
        letszam: Number(letszamInput.value),
        megjegyzes: megjegyzesInput.value.trim()
    };

    if (foglalas.nev === "" || foglalas.telefon === "") {
        uzenet.textContent = "Töltsd ki a kötelező mezőket!";
        return;
    }

    if (idInput.value) {
        const index = foglalasok.findIndex(function(elem) {
            return elem.id === idInput.value;
        });

        if (index !== -1) {
            foglalasok[index] = foglalas;
        }

        uzenet.textContent = "A foglalást módosítottuk.";
    } else {
        foglalasok.push(foglalas);
        uzenet.textContent = "Az új foglalást elmentettük.";
    }

    mentes();
    listaFrissit();
    form.reset();
    idInput.value = "";
    mentesGomb.textContent = "Foglalás mentése";
    megseGomb.hidden = true;
});

function modosit(id) {
    const foglalas = foglalasok.find(function(elem) {
        return elem.id === id;
    });

    if (foglalas) {
        idInput.value = foglalas.id;
        nevInput.value = foglalas.nev;
        telefonInput.value = foglalas.telefon;
        datumInput.value = foglalas.datum;
        idoInput.value = foglalas.ido;
        letszamInput.value = foglalas.letszam;
        megjegyzesInput.value = foglalas.megjegyzes;

        mentesGomb.textContent = "Módosítás mentése";
        megseGomb.hidden = false;
        window.scrollTo(0, 0);
    }
}

function torol(id) {
    const biztos = confirm("Biztosan törlöd ezt a foglalást?");

    if (biztos) {
        foglalasok = foglalasok.filter(function(foglalas) {
            return foglalas.id !== id;
        });

        mentes();
        listaFrissit();
        uzenet.textContent = "A foglalást töröltük.";

        if (idInput.value === id) {
            form.reset();
            idInput.value = "";
            mentesGomb.textContent = "Foglalás mentése";
            megseGomb.hidden = true;
        }
    }
}

keresesInput.addEventListener("input", listaFrissit);

megseGomb.addEventListener("click", function() {
    form.reset();
    idInput.value = "";
    mentesGomb.textContent = "Foglalás mentése";
    megseGomb.hidden = true;
    uzenet.textContent = "";
});

listaFrissit();