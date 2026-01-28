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
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/mock' })
      }
    }
  }));
});

// Mock del modelo Message (Refactorizado para PostgreSQL/Knex)
jest.mock('../../models/Message', () => ({
  create: jest.fn().mockImplementation((data) => Promise.resolve({
    id: 1,
    ...data,
    created_at: new Date()
  })),
  find: jest.fn().mockResolvedValue([]),
  count: jest.fn().mockResolvedValue(0)
}));

// Mock de setupAdmin para evitar problemas de base de datos durante los tests
jest.mock('../../utils/setupAdmin', () => jest.fn().mockResolvedValue(true));

// Importar la aplicación
// Nota: Importamos 'app' de index.js
const { app } = require('../../index');

describe('Contact API - POST /api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully submit the contact form with valid data and return 200', async () => {
    const testData = {
      name: 'Monkey D. Luffy',
      email: 'luffy@test.com',
      message: 'I will be the Pirate King!',
      phone: '1234567890',
      honeypot: ''
    };

    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Mensaje enviado con éxito.');
  });

  it('should return 400 when name is missing', async () => {
    const testData = {
      email: 'luffy@test.com',
      message: 'I will be the Pirate King!',
      phone: '1234567890',
      honeypot: ''
    };

    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El nombre es obligatorio.');
  });

  it('should return 400 when email is invalid', async () => {
    const testData = {
      name: 'Monkey D. Luffy',
      email: 'invalid-email',
      message: 'I will be the Pirate King!',
      phone: '1234567890',
      honeypot: ''
    };

    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El email no es válido.');
  });

  it('should return 400 when message is missing', async () => {
    const testData = {
      name: 'Monkey D. Luffy',
      email: 'luffy@test.com',
      phone: '1234567890',
      honeypot: ''
    };

    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El mensaje es obligatorio.');
  });

  it('should return 400 for spam detection (honeypot filled)', async () => {
    const testData = {
      name: 'Bot',
      email: 'bot@test.com',
      message: 'I am a bot',
      honeypot: 'some value'
    };

    const response = await request(app)
      .post('/api/contact')
      .send(testData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Detección de spam.');
  });
});
