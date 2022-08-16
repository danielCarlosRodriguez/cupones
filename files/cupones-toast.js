//Recibo cédula y la envío a validar--------------------------
function numeroCedula() {
  const cedula = $("#cedula").val();

  //Validando número de Cédula parte 1 ---
  if (cedula.length <= 6) {
    //console.log("es menor a 5 dígitos");
    claseIsInvalid();
  } else {
    if (validate_ci(cedula)) {
      claseIsValid();
      //console.log("número de cédula " + cedula);

      //Si todo está bien Oculto input de Cédula
      $(".elementoIngresarCedula").hide();

      mostrarCupones(cedula);
    } else {
      claseIsValid();
      //console.log("NO ES LA CEDULA " + cedula);
    }
  }
}

//Validando número de Cédula parte 2 ---
function validation_digit(ci) {
  let a = 0;
  let i = 0;
  if (ci.length <= 6) {
    for (i = ci.length; i < 7; i++) {
      ci = "0" + ci;
    }
  }
  for (i = 0; i < 7; i++) {
    a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
  }
  if (a % 10 === 0) {
    return 0;
  } else {
    return 10 - (a % 10);
  }
}

function validate_ci(ci) {
  ci = clean_ci(ci);
  let dig = ci[ci.length - 1];
  ci = ci.replace(/[0-9]$/, "");
  return dig == validation_digit(ci);
}

function random_ci() {
  let ci = Math.floor(Math.random() * 10000000).toString();
  ci = ci.substring(0, 7) + validation_digit(ci);
  return ci;
}

function clean_ci(ci) {
  return ci.replace(/\D/g, "");
}

//Respuestas de valido y no valido para el input de la cédula
const claseIsInvalid = () => {
  const element = document.getElementById("cedula");
  element.classList.add("is-invalid");
  element.classList.remove("is-valid");
  $("#alertaCedula").show();
};

const claseIsValid = () => {
  const element = document.getElementById("cedula");
  element.classList.add("is-valid");
  element.classList.remove("is-invalid");
  $("#alertaCedula").attr("style", "margin:auto; display: none !important");
};
//FIN de Recibo cédula y la envío a validar--------------------------

//Variable para los Tag de Categorías
let filtrosDeCategorías = true;

//oculto tarjetas y spinener
$(".target").hide();

function mostrarCupones(nDeCedula) {
  $("#spinner").show();

  $.ajax({
    type: "GET",
    url:
      "https://gdu-front-api.herokuapp.com/getCuponesCliente/" +
      nDeCedula +
      "/geant",

    success: function (data) {
      //Recibo todos los datos -----------------------------------------

      datos = data;

      //Creo Tags y Categorías -----------------------------------------------------
      const arrayCategoria = [];

      data.forEach((element, i) => {
        arrayCategoria.push(data[i].tags.join(""));
        const dataArr = new Set(arrayCategoria);
        let result = [...dataArr];
        categoria = result;
      });

      cantidad = arrayCategoria.length;

      //Número de cantidd de cupones por categorías----------------------
      let contarCategorias = {};

      arrayCategoria.forEach(function (numero) {
        contarCategorias[numero] = (contarCategorias[numero] || 0) + 1;
      });

      contarCategorias1 = contarCategorias;

      // Tags o botón Mostrar Todo ---------------------------------------
      function mostraTodos() {
        const arrayTodasCategorias = [];

        let ocultar = [];

        data.forEach((element, i) => {
          ocultar = data[i].tags;

          if (arrayTodasCategorias) {
            arrayTodasCategorias.push(data);
            //console.log(arrayTodasCategorias);

            $("." + ocultar).css("display", "block");
          } else {
            $("." + ocultar).css("display", "none");
          }
        });

        filtrosDeCategorías = false;
      }

      // Función al hacer click en un Tag o Botón de Categoría ---------------------------------------
      function filtroPorCategoria(men) {
        const arrayCategorias = [];

        let ocultar = [];

        data.forEach((element, i) => {
          ocultar = data[i].tags;

          if (data[i].tags == men) {
            arrayCategorias.push(data);
            //console.log(arrayCategorias);

            $("." + ocultar).css("display", "block");
          } else {
            $("." + ocultar).css("display", "none");
          }
        });

        filtrosDeCategorías = false;
      }

      // Oculto spinner y muestro categorías y cupones---------------------
      $("#spinner").hide();
      $("#displaycard").show();
      $(".displayCategorias").show();

      //Mi vue.js --------------------------------------------------------
      var datosDeCupon = new Vue({
        el: "#contenedorDeDatos",
        datos: "",
        categoria: "",
        contarCategorias1: "",
        cantidad: "",

        methods: {
          //recibo click de categorías
          say: function (message) {
            //console.log(message);
            const men = message;
            filtroPorCategoria(men);


          },

          //recibo el click del botón todos
          sayTodos: function () {
            //console.log("TOQUÉ SAY1");
            mostraTodos();
          },

          //al apregar Botón Activar o Desactivar busco el valor
          sayActivar: function (name) {
            //Toast
           
              
           


            
            let codigoCupon = datos.filter(
              (valor) => valor.codigoOferta == name
              );

            //Toast
            let textoDescripcion = codigoCupon[0].texto[1].texto;
            let estado = codigoCupon[0].habilitado;
            console.log("🚀 ~ estado", estado)

            if (estado) {
               
             document.getElementById(textoDescripcion).classList.remove("color-boton");
             document.getElementById(textoDescripcion).classList.add("bg-primary");
             new bootstrap.Toast(document.getElementById(textoDescripcion)).show();

            } else {
              document.getElementById(textoDescripcion).classList.remove("bg-primary");
              document.getElementById(textoDescripcion).classList.add("color-boton");
              new bootstrap.Toast(document.getElementById(textoDescripcion)).show();
            }
            

           
            

            
            let envioCodigoCupon = codigoCupon[0].codigoCupon;
            let habilitado = codigoCupon[0].habilitado;
            let miCdigoCupon = codigoCupon[0].codigoCupon;
            //console.log("🚀 ~ miCdigoCupon", miCdigoCupon);
            //console.log( "🚀 ~ envioCodigoCupon", envioCodigoCupon, "envioCodigoOferta", name, "habilitado", habilitado);

            //spinner dentro del botón
            $(`#${name}`).html(
              "<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'v-bind:id='misdatos.codigoOferta'></span>"
            );

            //envíos datos para url y cambio botón Activar y Desactivar
            if (habilitado) {
              desactivarCupones(envioCodigoCupon);

              codigoCupon[0].habilitado = false;
            } else {
              activarCupones(envioCodigoCupon, name);
            }

            // Activar Cupones --------------------------------------------------
            function activarCupones(codigoCupon, codigoOferta) {
              let armoUrl =
                "https://gdu-front-api.herokuapp.com/habilitarCupon/" +
                codigoCupon +
                "/" +
                codigoOferta +
                "/" +
                nDeCedula +
                "/geant";

              //console.log("URL enviada", armoUrl);

              $.ajax({
                type: "GET",
                url: armoUrl,

                success: function (mensaje) {
                  //console.log(mensaje);

                  let codigoCupon = datos.filter(
                    (valor) => valor.codigoOferta == name
                  );
                  codigoCupon[0].codigoCupon = mensaje.codigoCupon;

                  //console.log("nameeeeeee", mensaje.codigoCupon);

                  const element = document.getElementById(name);
                  element.textContent = "DESACTIVAR";
                  element.classList.remove("color-boton", "text-white");
                  element.classList.add("btn-outline-contorno", "texto-base");
                  codigoCupon[0].habilitado = true;

                  

                },

                error: function (e) {
                  console.log(e);
                },
              });
            }

            // Desactivar Cupones --------------------------------------------------
            function desactivarCupones(codigoCupon, codigoOferta) {

             

              
              
              
              let armoUrl =
                "https://gdu-front-api.herokuapp.com/deshabilitarcupon/" +
                codigoCupon +
                "/geant";

              //console.log("URL enviada para Deshabilitar", armoUrl);

              $.ajax({
                type: "GET",
                url: armoUrl,

                success: function (datos) {
                 // console.log(">>>>", datos);

                  const element = document.getElementById(name);
                  element.textContent = "ACTIVAR";
                  element.classList.remove(
                    "btn-outline-contorno",
                    "texto-base"
                  );
                  element.classList.add("color-boton", "text-white");

    
                

                 
                },

                error: function (e) {
                  console.log(e);
                },
              });
            }
          },
        },
      });
    },
  });
}

