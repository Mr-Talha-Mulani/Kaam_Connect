const AuthService = require('./src/services/authService');
const pool = require('./src/config/db');

async function seed() {
  try {
    const seeker = await AuthService.registerUser({
      name: 'John Seeker',
      email: 'employee@example.com',
      password: 'password123',
      role: 'job_seeker',
      location: 'New York',
      phone: '1234567890'
    });
    console.log('Seeded job seeker:', seeker.user.email);
  } catch (err) {
    console.log('Job seeker seed error (might exist):', err.message);
  }

  try {
    const employer = await AuthService.registerUser({
      name: 'Acme Corp',
      email: 'employer@example.com',
      password: 'password123',
      role: 'employer',
      location: 'San Francisco',
      phone: '0987654321'
    });
    console.log('Seeded employer:', employer.user.email);
  } catch (err) {
    console.log('Employer seed error (might exist):', err.message);
  }

  process.exit();
}

seed();
