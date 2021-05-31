const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const asistente = 'OFELIA';

/**
 *  Respuestas preprogramadas
 */
const noEntiendo = 'Lo siento, no te he entendido';
const greetings = [
  'Estoy muy bien, gracias por preguntar', 
  'No en mi mejor momento, pero vamos tirando', 
  '¡Muy bien! ¿Y tú cómo estás?'
];
const tiempo = [
  'El tiempo está bien.',
  'Necesitas un bronceado.'
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


/**
 *  Responder a los comandos de voz del usuario
 */
function readOutLoud(msg) {
  const speech = new SpeechSynthesisUtterance();
  let answer = '';

  if(msg.toUpperCase().includes(asistente)){
    answer = evaluateRequest(msg);
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
function evaluateRequest(msg) {
  let answer = '';
  const msgCase = msg.toUpperCase();
  // Saludos
  if(msgCase.includes('CÓMO ESTÁS') ||
     msgCase.includes('QUÉ TAL')) {
    answer = greetings[Math.floor(Math.random()*greetings.length)];
  }
  // Tiempo
  if(msgCase.includes('TIEMPO')){
    answer = tiempo[Math.floor(Math.random()*tiempo.length)];
  }
  // Hora
  if(msgCase.includes('HORA')){
    const fechaActual = new Date();
    answer = fechaToSpeech(fechaActual);
  }
  // Facha
  if(msgCase.includes('LA SEXTA') || msgCase.includes('LASEXTA')){
    answer = facha;  
    himno = new Audio('himno_esp.mp3');
    himno.volume = 0.5;
    setTimeout(()=>{ himno.play(); }, 13000);
  }  
  return answer;
}

/**
 *  Recita una fecha dada en lenguaje natural
 */
function fechaToSpeech(date){
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













