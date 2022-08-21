
const baseUrl = "https://api.github.com/users";

const request = async(url) => {
    const response = await fetch(url);
    const result = await response.json();
    return result;
};

const getUser = async(user) => {
    const url = `${baseUrl}/${user}`;
    return request(url);
};

const getRepos = async(user, pages, reposNumber) => {
    const url = `${baseUrl}/${user}/repos?page=${pages}&per_page=${reposNumber}`;
    return request(url);
};

const imprimirTabla = document.querySelector("#resultados");


const llamadoDeRepos = (event) => {
    const usuario = document.querySelector("#nombre").value;
    const paginas = document.querySelector("#pagina").value;
    const repositorios = document.querySelector("#repoPagina").value;
    event.preventDefault();
    Promise.all([getUser(usuario), getRepos(usuario, paginas, repositorios)])
        .then((resp) => {
            const datosUsuario = resp[0];
            if (datosUsuario.message === "Not Found") {
                throw "El usuario no existe";
            }
            const nombreUsuario = usuario;
            const nombreLogin = datosUsuario.login;
            const nRepos = datosUsuario.public_repos;
            const localidad = datosUsuario.location;
            const tipoUsuario = datosUsuario.type;
            const datosRepos = resp[1];
            let crearTabla = `
            <div class="row"><div class="col text-left"">
                <h3>Datos del Usuario</h3>
                <img src="./assets/img/corchetes.png" alt="Imagen de unos {}" class="img-fluid">
                <ul>
                    <li class="mb-3">
                        Nombre de Usuario: ${nombreUsuario}
                    </li>
                    <li class="mb-3">
                        Nombre de Login: ${nombreLogin}
                    </li>
                    <li class="mb-3">
                        Cantidad de Repositorios: ${nRepos}
                    </li>
                    <li class="mb-3">
                        Localidad: ${localidad}
                    </li>
                    <li class="mb-3">
                        Tipo de Usuario: ${tipoUsuario}
                    </li>
                </ul>
            </div>
            <div class="col text-right">
                <h3>Nombres de Repositorios</h3>
                <ul>
            `;
            datosRepos.forEach((element) => {
                crearTabla =
                    crearTabla +
                    `<li class="mb-3"><a href="${element.html_url}">${element.full_name}</a></li>`;
            });
            crearTabla = crearTabla + `</ul></div></div>`;
            imprimirTabla.innerHTML = crearTabla;
        })
        .catch((err) => {
            alert(err);
            imprimirTabla.innerHTML = "";
        });
};

const formulario = document.querySelector("#formulario");
formulario.addEventListener("submit", llamadoDeRepos);