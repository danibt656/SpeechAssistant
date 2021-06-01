class Fetch {
    async getCurrent(input) {
      const myKey = "d9eabd7a98b614cff8a11b7e4b2ba540";
      // Pedir ciudad a API del tiempo
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${myKey}`
      );
      const data = await response.json();
      console.log(data);
      // Devolver el tiempo como cadena de caracteres
      const temperature=Math.floor(data.main.temp - 273); // Temperatura en Kelvin - 273 (ºC)
      const humidity = data.main.humidity;
      let rt='Hoy la temperatura en '+input+' es de unos '+temperature+' grados, con una humedad del '+
        humidity+' por ciento.';
      console.log(rt); 
      return rt;
    }
  }
