//Consigo datos del parámetro texto
const url = top.location.href;
var searchParams = new URLSearchParams(url);
const texto = Array.from(searchParams.values());
console.log(texto[0]);

if (texto1[0] !== "") {
  //modifico el contenido del div terminos-cupones
  document.getElementById("terminos-cupones").innerHTML = texto[0];
}



