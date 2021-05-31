const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// Answers
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
const facha = 'Esta es una familia decente. Aquí se vota a Vox y se va a misa los domingos. Así que ya te puedes ir yendo a tomar por el culo, rojo. ¡Viva España!'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "es-ES";

recognition.onstart = function(){
  console.log('voice is activated, you can speak to microphoneee');
};

recognition.onresult = function(event){
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;
  content.textContent = transcript;
  readOutLoud(transcript);
};

// add buttonListener
btn.addEventListener('click', ()=>{
  recognition.start();
});


function readOutLoud(msg) {
  const speech = new SpeechSynthesisUtterance();
  let answer = '';

  if(msg.includes('Alexa')){
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
  // Facha
  if(msgCase.includes('LA SEXTA') || msgCase.includes('LASEXTA')){
    answer = facha;  
  }  
  return answer;
}











