const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const asistente = 'ALEXA';

/**
 *  Respuestas preprogramadas
 */
const noEntiendo = 'Lo siento, no te he entendido';
const holas = [
  '¡Hola!',
  '¡Hola!, ¿qué tal estás?'
]
const greetings = [
  'Estoy muy bien, gracias por preguntar', 
  'Yo estoy bien si tú estás bien',
  '¡Muy bien! ¿Y tú cómo estás?'
];

const facha = 'Esta es una familia decente. Aquí se vota a Vox y se va a misa los domingos, así que ya te puedes ir yendo a tomar por culo, rojo. ¡Viva España!'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "es-ES";   // Idioma Español de España

/**
 *  Ejecutar cuando se empieza a grabar
 */
recognition.onstart = function(){
  console.log('voice is activated, you can speak to microphoneee');
};

/**
 *  Ejecutar cuando se termina de grabar
 */
recognition.onresult = function(event){
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;
  content.textContent = transcript;
  readOutLoud(transcript);
};

/**
 *  Controlador de eventos del boton
 */
btn.addEventListener('click', ()=>{
  recognition.start();
});

// event = keyup or keydown
document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    recognition.start();
  }
})


/**
 *  Responder a los comandos de voz del usuario
 */
async function readOutLoud(msg) {
  const speech = new SpeechSynthesisUtterance();
  let answer = '';

  if(msg.toUpperCase().includes(asistente)){
    answer = await evaluateRequest(msg);
  }else{
    answer = noEntiendo;
  }

  speech.volume = 0.6;
  speech.rate = 1;
  speech.pitch = 1;
  speech.text = answer;    // What to say

  window.speechSynthesis.speak(speech);
}

/**
 *  Evalua la respuesta en funcion del comando de voz del usuario
 */
async function evaluateRequest(msg) {
  let answer = '';
  const msgCase = msg.toUpperCase();
  // Saludos
  if(msgCase.includes('CÓMO ESTÁS') ||
     msgCase.includes('QUÉ TAL')) {
    answer = greetings[Math.floor(Math.random()*greetings.length)];
  }
  if(msgCase.includes('HOLA')) {
    answer = holas[Math.floor(Math.random()*holas.length)];
  }
  // Tiempo
  if(msgCase.includes('TIEMPO EN') || msgCase.includes('TIEMPO HACE EN')
     || msgCase.includes('TEMPERATURA EN') || msgCase.includes('TIEMPO QUE HACE EN')){
    answer = await getCurrentWeather(msgCase);
  }
  // Hora
  if(msgCase.includes('HORA')){
    const fechaActual = new Date();
    answer = horaToSpeech(fechaActual);
  }
  // Fecha
  if(msgCase.includes('FECHA') || msgCase.includes('QUÉ DÍA ES')
     || msgCase.includes('QUÉ DÍA ESTAMOS')){
    if(msgCase.includes('MAÑANA')) {
      const fecha = new Date;
      const manana = new Date(fecha); manana.setDate(manana.getDate()+1);
      answer = fechaToSpeech(manana, 'Mañana');
    }else{
      const fecha = new Date();
      answer = fechaToSpeech(fecha, 'Hoy');
    }
  }

  // Facha
  if(msgCase.includes('LA SEXTA') || msgCase.includes('LASEXTA')){
    answer = facha;  
    himno = new Audio('resources/himno_esp.mp3');
    himno.volume = 0.5;
    setTimeout(()=>{ himno.play(); }, 13000);
  }  
  return answer;
}

/**
 *  Recita una hora dada en lenguaje natural
 */
function horaToSpeech(date){
  let hora = date.getHours();
  let ret='';
  const mins = date.getMinutes();
  const periodos = ['madrugada', 'mañana', 'tarde', 'noche'];

  // Calcular el periodo del dia
  let periodo='';
  if(hora>0 && hora<=5) periodo = periodos[0];
  else if(hora>5 && hora<=12) periodo = periodos[1];
  else if(hora>12 && hora<21) periodo = periodos[2];
  else periodo = periodos[3];
  
  // Calcular la hora en horario natural (de 1 a 7)
  if(hora>12) hora -= 12;
  if(hora===0) hora = 12; // Las 00 son las 12
  // Calcular 'la' o 'las'
  let det='las';
  if(hora===1) det='la';  // 'La 1', no 'Las 1'
  
  ret = 'Son '+det+' '+hora+' y '+mins+' de la '+periodo;
  console.log(ret);
  return ret;
}

/**
 *  Recita una fecha dada en lenguaje natural
 */
function fechaToSpeech(date, time) {
  const meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
  const diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
  const f=date;
  const intros = [time+' es '];
  const intro = intros[Math.floor(Math.random()*intros.length)];
  const ret = intro+diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
  console.log(ret);
  return ret;
}

/**
 * Pide el tiempo a la API de openWeather
 */
async function getCurrentWeather(msgCase) {
  var input = msgCase.slice(msgCase.indexOf('EN') + 'EN'.length)
                     .replace(/[.,\/#!$%\^&\*;:{}?¿¡!=\-_`~()]/g,"");
  const myKey = "d9eabd7a98b614cff8a11b7e4b2ba540";
  console.log(input);
  // Pedir ciudad a API del tiempo
  const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${myKey}`);
  const data = await response.json();
  // Devolver el tiempo como cadena de caracteres
  const temperature=Math.floor(data.main.temp - 273); // Temperatura en Kelvin - 273 (ºC)
  const humidity = data.main.humidity;
  let rt='Hoy la temperatura en '+input+' es de unos '+temperature+' grados, con una humedad del '+
    humidity+' por ciento.';
  return rt;
}














