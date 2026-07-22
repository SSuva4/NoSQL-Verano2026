const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

/////////////////////////////////////////////////////////////////////////////////

// Ejercicio 1. Número par o impar
app.get('/par/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);

  if (isNaN(numero)) {
    return res.status(400).send('Por favor ingresa un número válido');
  }

  const resultado = numero % 2 === 0 ? 'par' : 'impar';
  res.send(`${numero} es un número ${resultado}`);
});

/////////////////////////////////////////////////////////////////////////////////

// Ejercicio 2. Mayor de edad
app.get('/edad/:edad', (req, res) => {
  const edad = parseInt(req.params.edad);

  if (isNaN(edad) || edad < 0 || edad > 123) {
    return res.status(400).send('Ingresa una edad valida');
  }

  if (edad >= 18) {
    return res.send('Eres mayor de edad');
  }
  res.send('Eres menor de edad');
});

/////////////////////////////////////////////////////////////////////////////////

// Ejercicio 3. Calculadora
app.get('/calculadora/:operacion/:a/:b', (req, res) => {
  const { operacion } = req.params;
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send('Por favor ingresa números válidos');
  }

  let resultado;

  switch (operacion) {
    case 'suma':
      resultado = a + b;
      break;
    case 'resta':
      resultado = a - b;
      break;
    case 'multiplicacion':
      resultado = a * b;
      break;
    case 'division':
      if (b === 0) {
        return res.status(400).send('No se puede dividir entre cero');
      }
      resultado = a / b;
      break;
    default:
      return res.status(400).send('Operación no válida. Usa: suma, resta, multiplicacion o division');
  }

  res.send(`Resultado: ${resultado}`);
});

/////////////////////////////////////////////////////////////////////////////////

// Ejercicio 4. Tabla de multiplicar
app.get('/tabla/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);

  if (isNaN(numero)) {
    return res.status(400).send('Ingresa un número valido');
  }

  let tabla = '';
  for (let i = 1; i <= 10; i++) {
    tabla += '<p>' + `${numero} * ${i} = ${numero * i}` + '</p>';
  }
  res.send(tabla);
});

/////////////////////////////////////////////////////////////////////////////////

// Ejercicio 5. Calificación
app.get('/calificacion/:nota', (req, res) => {
  const nota = parseInt(req.params.nota);

  if (isNaN(nota) || nota < 0 || nota > 100) {
    return res.status(400).send('Ingresa una nota valido');
  }

  let resultado;
  if (nota >= 90) {
    resultado = 'Excelente';
  } else if (nota >= 80) {
    resultado = 'Muy bien';
  } else if (nota >= 70) {
    resultado = 'Aprobado';
  } else {
    resultado = 'Reprobado';
  }

  res.send(`Resultado: ${resultado}`);
});

/////////////////////////////////////////////////////////////////////////////////

app.listen(3000, () => {
  console.log('Servidor ejecutándose en puerto 3000');
});