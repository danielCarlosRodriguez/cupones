//Consigo datos del parámetro texto
const url = top.location.href;
var searchParams = new URLSearchParams(url);
const texto = Array.from(searchParams.values());
console.log(texto[0]);

if (texto[0] !== "") {
  //modifico el contenido del div terminos-cupones
  let terminos = texto[0].replace(/\n/gi, "<p></p>");  
  document.getElementById("terminos-cupones").innerHTML = terminos;
}



