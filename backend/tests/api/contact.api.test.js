const request = require('supertest');

// Mock de bcryptjs
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock de nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'mock-message-id'
    })
  })
}));

// Mock de stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_mock' }),
      list: jest.fn().mockResolvedValue({ data: [] })
    },
    charges: {
      create: jest.fn().mockResolvedValue({ id: 'ch_mock' })
    },
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ id: 'pi_mock', client_secret: 'secret_mock' }),
      update: jest.fn().mockResolvedValue({ id: 'pi_mock', client_secret: 'secret_mock' })
    }
  }));
});

// Mockear mongoose y Message antes de importar la app
jest.mock('mongoose', () => {
  // Mock function para la Schema
  class Schema {
    constructor(definition, options) {
      this.definition = definition;
      this.options = options || {};
      this.statics = {};
      this.methods = {};
    }
    // Métodos comunes de Schema
    static Types = {
      String: String,
      Number: Number,
      Boolean: Boolean,
      ObjectId: String,
      Date: Date
    };
    pre() { return this; }
    post() { return this; }
    virtual() { return { get: () => {}, set: () => {} }; }
    index() { return this; }
  }
  
  // Mock para models
  const models = {};
  
  // Mock para model
  const model = jest.fn().mockImplementation((name, schema) => {
    if (!models[name]) {
      const MockModel = function(data) {
        Object.assign(this, data);
        this._id = this._id || 'mock_' + Math.random().toString(36).substring(7);
        this.save = jest.fn().mockResolvedValue(this);
        this.toObject = jest.fn().mockReturnValue(this);
      };
      
      // Agregar métodos estáticos del schema
      Object.assign(MockModel, schema ? schema.statics : {});
      
      // Métodos estáticos comunes
      MockModel.find = jest.fn().mockResolvedValue([]);
      MockModel.findOne = jest.fn().mockResolvedValue(null);
      MockModel.findById = jest.fn().mockResolvedValue(null);
      MockModel.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
      MockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
      MockModel.countDocuments = jest.fn().mockResolvedValue(0);
      
      models[name] = MockModel;
    }
    
    return models[name];
  });
  
  // El objeto mongoose completo
  const mockMongoose = {
    Schema,
    connect: jest.fn().mockResolvedValue({
      connection: {
        name: 'mock-db-test',
        host: 'localhost'
      }
    }),
    connection: {
      name: 'mock-db-test',
      host: 'localhost',
      readyState: 1,
      db: {
        collection: () => ({
          find: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockReturnThis(),
          deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
          insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockId' }),
          updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
        })
      },
    },
    disconnect: jest.fn().mockResolvedValue(true),
    model,
    models
  };
  
  return mockMongoose;
});

// Mock del modelo Message
jest.mock('../../models/Message', () => {
  // Usar la nueva implementación de mongoose mock
  const mongoose = require('mongoose');
  
  // Crear un mock de modelo de mensaje con todos los métodos necesarios
  const MessageModel = function(data) {
    this._id = data._id || 'mock_' + Math.random().toString(36).substring(7);
    this.name = data.name;
    this.email = data.email;
    this.message = data.message;
    this.phone = data.phone;
    this.createdAt = data.createdAt || new Date();
    this.save = jest.fn().mockResolvedValue(this);
    this.toObject = jest.fn().mockReturnValue(this);
  };
  
  // Métodos estáticos adicionales
  MessageModel.findOne = jest.fn().mockImplementation((query) => {
    // Simular que encontramos el mensaje por email
    if (query && query.email && query.email.$regex) {
      return Promise.resolve({
        _id: 'mock-id',
        name: 'Mock User',
        email: query.email.$regex.source.slice(1, -2),
        message: 'This is a mock message',
        phone: '123-456-7890'
      });
    }
    return Promise.resolve(null);
  });
  
  MessageModel.find = jest.fn().mockResolvedValue([]);
  MessageModel.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
  MessageModel.countDocuments = jest.fn().mockResolvedValue(0);
  
  return MessageModel;
});

// Cargar el modelo Message para usarlo en las pruebas
const Message = require('../../models/Message');

// Importar solo la aplicación sin el servidor
const { app } = require('../../index');

// Generar nombres aleatorios para los tests - usando personajes de One Piece
const onePieceCharacters = [
  'Monkey D. Luffy', 'Roronoa Zoro', 'Nami', 'Usopp', 'Sanji',
  'Tony Tony Chopper', 'Nico Robin', 'Franky', 'Brook', 'Jinbe',
  'Portgas D. Ace', 'Trafalgar D. Water Law', 'Boa Hancock', 'Shanks',
  'Dracule Mihawk', 'Donquixote Doflamingo', 'Kaido', 'Big Mom', 'Edward Newgate, Teach'
];

// Función para generar un número de teléfono aleatorio
const generateRandomPhone = () => {
  return `+${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
};

// Función para generar un mensaje aleatorio
const generateRandomMessage = () => {
  const messages = [
    "Me gustaría saber más sobre sus servicios.",
    "Estoy interesado en sus proyectos anteriores.",
    "¿Podríamos agendar una llamada para discutir una oportunidad de trabajo?",
    "Me impresiona su portafolio y me gustaría colaborar.",
    "Necesito un desarrollador con sus habilidades para un proyecto urgente."
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
  // Reset mocks before all tests
  beforeAll(() => {
    jest.clearAllMocks();
  });

  // Reset mocks after each test to avoid interference
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  // No necesitamos cerrar el servidor porque importamos solo la app, no el server

  it('should successfully submit the contact form with valid data and return 200', async () => {
    const testData = generateTestData();
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBeUndefined(); // El endpoint /api/contact devuelve 'message', no 'success'
    expect(response.body.message).toBe('Mensaje guardado y enviado con éxito.');
    
    // No verificamos llamadas internas específicas ya que pueden cambiar
    // Solamente verificamos que la respuesta API es correcta
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
  });

  it('should return 400 when email is missing', async () => {
    const testData = generateTestData();
    delete testData.email;
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El email no es válido.');
  });

  it('should return 400 when email format is invalid', async () => {
    const testData = generateTestData();
    testData.email = 'invalid-email'; // Email con formato inválido
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El email no es válido.');
  });

  it('should return 400 when message is missing', async () => {
    const testData = generateTestData();
    delete testData.message;
    
    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El mensaje es obligatorio.');
  });
});
