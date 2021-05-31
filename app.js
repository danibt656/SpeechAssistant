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

  if(msg.includes('Pepa')){
    answer = valuateRequest(msg);
  }else{
    answer = noEntiendo;
  }

  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  speech.text = answer;    // What to say

  window.speechSynthesis.speak(speech);
}

function evaluateRequest(msg) {
  let answer = '';
  if(msg.includes('cómo estás')) {
    answer = greetings[Math.floor(Math.random()*greetings.length)];
  }

  return answer;
}











