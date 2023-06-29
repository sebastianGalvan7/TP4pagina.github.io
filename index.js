const input_todos = document.getElementById("todos");
const input_hombre = document.getElementById("hombre");
const input_mujer = document.getElementById("mujer");
const inputBusqueda = document.getElementById("textoBusqueda");
const formulario = document.getElementById("formulario");

let filtro = "t";
let TodosPersonas = [];
let PersonasMostrar = [];

const Filtro = (text) => {
  PersonasMostrar = TodosPersonas.filter(
    (n) =>
      (n.name.last.toLowerCase().includes(text.toLowerCase()) ||
        n.name.first.toLowerCase().includes(text.toLowerCase()) ||
        text === "") &&
      (filtro === "t" ||
        (filtro === "m" && n.gender === "female") ||
        (filtro === "h" && n.gender === "male"))
  );
};

const selecionarPersona = (locationStreen) => {
  const user = PersonasMostrar.find(
    (n) => Number(n.location.street.number) === Number(locationStreen)
  );

  console.log(user)

  MostrarPersona(user);
};

const Cargar = async () => {
  const data = await fetch("./personas.json")
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  if (data !== undefined) data.map((n) => TodosPersonas.push(n));
  PersonasMostrar = TodosPersonas;
};

const MostrarPersonas = () => {
  const Galeria = document.getElementById("gallery");
  Galeria.innerHTML = "";

  PersonasMostrar.map((n, i) => {
    Galeria.insertAdjacentHTML(
      "beforeend",
      `
      <span id=${n.location.street.number} class="imagenDePersona" style="max-height:200px; gap: 10px; border:solid 1px black">
            <img
                src=${n.picture.large}
                alt=${n.gender}
            />
            <p style="text-align:center; max-width: 100%;">
                ${n.name.first} ${n.name.last}
            </p>
        </span>
        `
    );
  });

  const imagenes = document.querySelectorAll(".imagenDePersona");
  const baner = document.getElementById("popup");

  imagenes.forEach((n) => {
    n.addEventListener("click", (e) => {
      baner.classList.remove("hidden");
      selecionarPersona(n.id);
    });
  });
};

const MostrarPersona = (PersonaSelect) => {
  if (!PersonaSelect) return;
  const contenedor = document.getElementById("popup");

  contenedor.innerHTML = `
        <div id="popup-content">
            <img src=${PersonaSelect.picture.large} style="width: 150px" alt="">
            <div style="display: flex">
                <p>Nombre completo: </p>
                <p>${PersonaSelect.name.first} ${PersonaSelect.name.last}</p>
            </div>
            <div style="display: flex">
                <p>Ciudad: </p>
                <p>${PersonaSelect.location.city}</p>
            </div>
            <div style="display: flex">
                <p>Pais: </p>
                <p>${PersonaSelect.location.country}</p>
            </div>
            <div style="display: flex">
                <p>Email: </p>
                <p>${PersonaSelect.email}</p>
            </div>
            <div style="display: flex">
                <p>Username: </p>
                <p>${PersonaSelect.login.username}</p>
            </div>
            <div style="display: flex">
                <p>Telefono: </p>
                <p>${PersonaSelect.phone}</p>
            </div>
            <button id="close-btn">Cerrar</button>
        </div>
                `;

  const baner = document.getElementById("popup");
  const btnCerrar = document.getElementById("close-btn");

  btnCerrar.addEventListener("click", (e) => {
    e.preventDefault();
    contenedor.innerHTML = "";
    baner.classList.add("hidden");
  });
};

inputBusqueda.addEventListener("input", (e) => {
  Filtro(e.target.value);
  MostrarPersonas();
});

input_todos.addEventListener("change", (e) => {
  e.preventDefault();
  filtro = "t";
  Filtro("");
  MostrarPersonas();
});

input_hombre.addEventListener("change", (e) => {
  e.preventDefault();
  filtro = "h";
  Filtro("");
  MostrarPersonas();
});

input_mujer.addEventListener("change", (e) => {
  e.preventDefault();
  filtro = "m";
  Filtro("");
  MostrarPersonas();
});

document.addEventListener("DOMContentLoaded", async () => {
  if (TodosPersonas.length === 0) await Cargar();
  MostrarPersonas();
});
