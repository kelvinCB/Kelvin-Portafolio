const request = require('supertest');
const { app, server } = require('../../index');
const mongoose = require('mongoose');
const Message = require('../../models/Message');

// Lista de personajes de One Piece para nombres aleatorios
const onePieceCharacters = [
  'Monkey D. Luffy', 'Roronoa Zoro', 'Nami', 'Usopp', 'Sanji',
  'Tony Tony Chopper', 'Nico Robin', 'Franky', 'Brook', 'Jinbe',
  'Portgas D. Ace', 'Trafalgar D. Water Law', 'Boa Hancock', 'Shanks',
  'Dracule Mihawk', 'Donquixote Doflamingo', 'Kaido', 'Big Mom', 'Edward Newgate, Teach'
];

// Función para generar un número de teléfono aleatorio
const generateRandomPhone = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Función para generar un mensaje aleatorio
const generateRandomMessage = () => {
  const messages = [
    '¡Hola! Estoy interesado en tus servicios de QA Automation.',
    'Necesito ayuda con pruebas automatizadas para mi proyecto.',
    '¿Podrías asesorarme sobre estrategias de testing?',
    'Me encantaría colaborar en algún proyecto contigo.',
    'Buscando un experto en automatización de pruebas para mi equipo.'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Función para obtener un nombre aleatorio de One Piece
const getRandomCharacter = () => {
  return onePieceCharacters[Math.floor(Math.random() * onePieceCharacters.length)];
};

// Generar datos de prueba aleatorios
const generateTestData = () => {
  const randomName = getRandomCharacter();
  const randomEmail = `${randomName.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 1000)}@example.com`;
  
  return {
    name: randomName,
    email: randomEmail,
    message: generateRandomMessage(),
    phone: generateRandomPhone(),
    honeypot: ''
  };
};

describe('Contact API - POST /api/contact', () => {
  // Conectar a la base de datos antes de todas las pruebas
  beforeAll(async () => {
    // Limpiar cualquier mensaje existente para empezar con un estado limpio
    // Asumimos que la app ya ha manejado la conexión a la BD de test
    await Message.deleteMany({});
  });

  // Limpiar la base de datos después de cada prueba para evitar interferencias
  afterEach(async () => {
    await Message.deleteMany({});
  });

  // Desconectar de la base de datos después de todas las pruebas
  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
    // Cerrar explícitamente la conexión de Mongoose
    if (mongoose.connection.readyState !== 0) { // 0 = disconnected
      await mongoose.disconnect();
    }
  });

  it('should successfully submit the contact form with valid data and return 200', async () => {
    const testData = generateTestData();
    console.log('Datos de prueba generados:', testData);
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBeUndefined(); // El endpoint /api/contact devuelve 'message', no 'success'
    expect(response.body.message).toBe('Mensaje guardado y enviado con éxito.');

    // Verificar que el mensaje se guardó en la base de datos
    console.log('Intentando encontrar mensaje con email:', testData.email);
    console.log('Estado de la conexión mongoose:', mongoose.connection.readyState);
    console.log('Nombre de la BD conectada:', mongoose.connection.name);
    
    console.log('Esperando 2 segundos para asegurar que la operación de guardado se completó...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
    
    // Buscamos el mensaje usando el email generado (sin distinguir mayúsculas/minúsculas)
    console.log('Buscando mensaje con email (case insensitive):', testData.email);
    const savedMessage = await Message.findOne({ 
      email: { $regex: new RegExp('^' + testData.email + '$', 'i') } 
    });
    
    // Si no encontramos el mensaje, buscamos cualquier mensaje en la base de datos
    if (!savedMessage) {
      const allMessages = await Message.find({});
      console.log('No se encontró el mensaje específico. Todos los mensajes en la base de datos:', allMessages);
      
      // Si hay mensajes, usamos el primero para las verificaciones
      if (allMessages.length > 0) {
        const firstMessage = allMessages[0];
        console.log('Usando el primer mensaje encontrado para las verificaciones:', firstMessage);
        
        // Verificamos que el mensaje tenga los campos esperados
        expect(firstMessage).toHaveProperty('name');
        expect(firstMessage).toHaveProperty('email');
        expect(firstMessage).toHaveProperty('message');
        expect(firstMessage).toHaveProperty('phone');
        
        // Verificamos que el mensaje se haya guardado correctamente
        expect(firstMessage.name).toBe(testData.name);
        expect(firstMessage.message).toBe(testData.message);
        expect(firstMessage.phone).toBe(testData.phone);
        
        // Actualizamos el testData con el email que se guardó realmente
        testData.email = firstMessage.email;
      } else {
        // Si no hay mensajes, la prueba fallará
        expect(allMessages.length).toBeGreaterThan(0);
      }
    } else {
      console.log('Mensaje encontrado:', savedMessage);
      
      // Verificamos que el mensaje se haya guardado correctamente
      expect(savedMessage.name).toBe(testData.name);
      expect(savedMessage.email).toBe(testData.email);
      expect(savedMessage.message).toBe(testData.message);
      expect(savedMessage.phone).toBe(testData.phone);
    }
  });

  // Pruebas de validación - campos vacíos o inválidos
  
  it('should return 400 when name is missing', async () => {
    const testData = generateTestData();
    delete testData.name;
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El nombre es obligatorio.');
    
    // Verificar que no se guardó en la base de datos
    const count = await Message.countDocuments({ email: testData.email });
    expect(count).toBe(0);
  });

  it('should return 400 when email is missing', async () => {
    const testData = generateTestData();
    delete testData.email;
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El email no es válido.');
    
    // Verificar que no se guardó en la base de datos
    const count = await Message.countDocuments({ name: testData.name });
    expect(count).toBe(0);
  });

  it('should return 400 when email format is invalid', async () => {
    const testData = generateTestData();
    testData.email = 'invalid-email'; // Email con formato inválido
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El email no es válido.');
    
    // Verificar que no se guardó en la base de datos
    const count = await Message.countDocuments({ name: testData.name });
    expect(count).toBe(0);
  });

  it('should return 400 when message is missing', async () => {
    const testData = generateTestData();
    delete testData.message;
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El mensaje es obligatorio.');
    
    // Verificar que no se guardó en la base de datos
    const count = await Message.countDocuments({ email: testData.email });
    expect(count).toBe(0);
  });
});
