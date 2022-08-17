//al aprtar el botón enter
$("body").keydown(function (key) {
  //console.log(key.keyCode);

  if (key.keyCode == 13) {
    //console.log("apreté enter");
    numeroCedula();
  }
});











//--------------------------------------------------------------
//Validacion de los Cédula
//--------------------------------------------------------------
function numeroCedula() {
  const cedula = $("#cedula").val();

  
  //Validando número de Cédula parte 1 ---
  if (cedula.length <= 6 || cedula.length >= 9) {
    $("#cedula").addClass("is-invalid"); //rojo
    $("#cedula").removeClass("is-valid"); // verde
    mostrarCupones(cedula); //función para envíar datos
    
  } else {
    if (validate_ci(cedula)) {
      $("#cedula").addClass("is-valid"); // is-valid = verde
      $("#cedula").removeClass("is-invalid"); //is-invalid rojo
      mostrarCupones(cedula); //función para envíar datos
      $(".elementoIngresarCedula").hide();
  
    } else {
      $("#cedula").addClass("is-invalid"); //rojo
      $("#cedula").removeClass("is-valid"); // verde
      $("#spinner").hide();
      
    }
  }

  if (cedula == "") {
    $("#cedula").removeClass("is-valid is-invalid");
    //console.log("CI - es válido");
  }
}   

    

function validation_digit(ci) {
  var a = 0;
  var i = 0;
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
//FIN Validacion de los Cédula
//--------------------------------------------------------------


























//Variable para los Tag de Categorías
let filtrosDeCategorías = true;

//oculto tarjetas y spinener
$(".target").hide();

function mostrarCupones(nDeCedula) {
  $("#spinner").show();

  $.ajax({
    type: "GET",
    url: "data/datos2.json",
      // "https://gdu-front-api.herokuapp.com/getCuponesCliente/" + nDeCedula +  "/disco",

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
            let codigoCupon = datos.filter(
              (valor) => valor.codigoOferta == name
            );

            //Toast
            let textoDescripcion = codigoCupon[0].texto[1].texto;
            let estado = codigoCupon[0].habilitado;

            if (estado) {
              document
                .getElementById(textoDescripcion)
                .classList.remove("color-boton");
              document
                .getElementById(textoDescripcion)
                .classList.add("bg-secondary");
              new bootstrap.Toast(
                document.getElementById(textoDescripcion)
              ).show();

              //cambio el estado del botónSwitch y sumo variable de botones true
              $("#flexSwitchCheckDefault")
                .prop("checked", false)
                .css({ "pointer-events": "all" });
              botonestrue++;
            } else {
              document
                .getElementById(textoDescripcion)
                .classList.remove("bg-primary");
              document
                .getElementById(textoDescripcion)
                .classList.add("color-boton");
              new bootstrap.Toast(
                document.getElementById(textoDescripcion)
              ).show();

              //cambio el estado del botónSwitch y resto variable de botones true
              botonestrue--;
              //console.log(">>>>>>", botonestrue);
              if (botonestrue === 0) {
                $("#flexSwitchCheckDefault")
                  .prop("checked", true)
                  .css({ "pointer-events": "all" });
              }
            }

            let envioCodigoCupon = codigoCupon[0].codigoCupon;
            let habilitado = codigoCupon[0].habilitado;
            let miCdigoCupon = codigoCupon[0].codigoCupon;

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
                "/disco";

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
                "/disco";

              //console.log("URL enviada para Deshabilitar", armoUrl);

              $.ajax({
                type: "GET",
                url: armoUrl,

                success: function (datos) {
                  //console.log(datos);

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

          // Activar TODOS los Cupones --------------------------------------------------
          sayActivarTodos: function () {
            // console.log("hice click en activartodos");

            //desactivo el corsor del switch
            $("#flexSwitchCheckDefault").css({ "pointer-events": "none" });

            activarCupones();

            //Cambio el botón a DESACTIVAR
            data.forEach((element, i) => {
              let cuponesHabilitados = data[i].codigoOferta;

              let elemento = document.getElementById(cuponesHabilitados);
              elemento.textContent = "DESACTIVAR";
              elemento.classList.remove("color-boton", "text-white");
              elemento.classList.add("btn-outline-contorno", "texto-base");
            });

            //Mando Desactivar Todos
            function activarCupones() {
              let armoUrl =
                "https://gdu-front-api.herokuapp.com/habilitarTodosCupones/" +
                +nDeCedula +
                "/disco";

              //console.log("URL enviada", armoUrl);

              $.ajax({
                type: "GET",
                url: armoUrl,

                success: function (mensaje) {
                  console.log(mensaje);
                },

                error: function (e) {
                  console.log(e);
                },
              });
            }
          },
          //FIN Activar TODOS los Cupones---------------

          //envío datos a términos y condiciones
          terminos: function (message) {
            //console.log(message);
            top.location.href = `https://www.disco.com.uy/terminos-y-condiciones?text=${message}#mi-descuento`;
            //top.location.href = `terminos.html?text=${message}#mi-descuento`;
          },
        },
      });

      // Pregunto si hay cupones habilitados para activar Boton Swhitch ---------------------
      let botonestrue = 0;
      datos.forEach((elemnt, i) => {
        let botonSwitch = datos[i].habilitado;
        //console.log(">>>>>>", botonSwitch);
        if (botonSwitch === false) {
          $("#flexSwitchCheckDefault")
            .prop("checked", false)
            .css({ "pointer-events": "all" });
          botonestrue++;
        }
      });
    },

    error: function (e) {
      console.log(e);
      $("#alertaNoEncontrado").show();
      $("#spinner").hide();
      $(".elementoIngresarCedula").show();
    },

  });
  
}



const ocultoAlerta = () => {
  console.log("hiceeee cliiicc");
   $("#alertaNoEncontrado").hide();
};