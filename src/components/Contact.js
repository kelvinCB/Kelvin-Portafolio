import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Section = styled.section`
  padding: 3rem 1.5rem;
  background: linear-gradient(135deg, #2e2257 60%, #ffb07c 100%);
  border-radius: 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  color: #fff;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;
const Title = styled.h2`
  color: #ffb07c;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
`;
const TextArea = styled.textarea`
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  min-height: 100px;
`;
const Button = styled.button`
  background: #ffb07c;
  color: #2e2257;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #ff8c42;
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;
const IconText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <Section id="contact">
      <Title>Contact Me</Title>
      <Info>
        <IconText><FaEnvelope /> email@example.com</IconText>
        <IconText><FaPhoneAlt /> +1 234 567 8901</IconText>
      </Info>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextArea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <Button type="submit">Send Message</Button>
      </Form>
      {submitted && <p style={{ color: '#ffb07c', textAlign: 'center', marginTop: '1rem' }}>Thank you for your message!</p>}
    </Section>
  );
};

export default Contact;
