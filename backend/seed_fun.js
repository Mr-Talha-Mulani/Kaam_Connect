const pool = require('./src/config/db');
const { hashPassword } = require('./src/utils/hashing');

const TEAMMATES = [
  { name: 'Tanmay Maniyar', email: 'tanmay.maniyar@kaamconnect.test' },
  { name: 'Siddharth Talreja', email: 'siddharth.talreja@kaamconnect.test' },
  { name: 'Yuvraj Kumbhavdekar', email: 'yuvraj.kumbhavdekar@kaamconnect.test' },
  { name: 'Mohammad Adil Shaikh', email: 'mohammad.adil@kaamconnect.test' },
  { name: 'Apurva Gokhale', email: 'apurva.gokhale@kaamconnect.test' },
  { name: 'Ananya Nair', email: 'ananya.nair@kaamconnect.test' },
  { name: 'Swara Kadam', email: 'swara.kadam@kaamconnect.test' },
  { name: 'Priyal Sawant', email: 'priyal.sawant@kaamconnect.test' },
  { name: 'Vaishali Sahajwani', email: 'vaishali.sahajwani@kaamconnect.test' },
];

const PASSWORD = 'Kaam@12345';

async function upsertUser({ name, email, role, location, phone }, hashedPassword) {
  const query = `
    INSERT INTO users (name, email, password, role, location, phone, is_profile_completed, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
    ON CONFLICT (email)
    DO UPDATE SET
      name = EXCLUDED.name,
      password = EXCLUDED.password,
      role = EXCLUDED.role,
      location = EXCLUDED.location,
      phone = EXCLUDED.phone,
      is_profile_completed = true,
      updated_at = NOW()
    RETURNING id, name, email, role;
  `;
  const result = await pool.query(query, [name, email, hashedPassword, role, location, phone]);
  return result.rows[0];
}

async function upsertEmployerProfile(userId) {
  const query = `
    INSERT INTO employer_profiles (
      user_id, owner_name, owner_phone, owner_email,
      name, business_type, industry, years_in_operation, num_employees,
      business_address, city, pincode, landmark,
      business_phone, business_email, website,
      business_description, location, phone_number,
      payment_method, payment_frequency, consents_to_terms
    ) VALUES (
      $1, 'Talha Mulani', '9999999999', 'talha@dhaba.com',
      'Talha da Dhaba', 'sole_proprietor', 'Food & Hospitality', 3, 24,
      'FC Road, Pune', 'Pune', '411005', 'Opposite College Chowk',
      '9999999999', 'talha@dhaba.com', 'https://talhadadhaba.example',
      'Talha da Dhaba serves legendary chai, kebabs, and midnight parathas for the whole squad.', 'Pune', '9999999999',
      'both', 'weekly', true
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      owner_name = EXCLUDED.owner_name,
      owner_phone = EXCLUDED.owner_phone,
      name = EXCLUDED.name,
      industry = EXCLUDED.industry,
      years_in_operation = EXCLUDED.years_in_operation,
      num_employees = EXCLUDED.num_employees,
      business_address = EXCLUDED.business_address,
      city = EXCLUDED.city,
      pincode = EXCLUDED.pincode,
      business_phone = EXCLUDED.business_phone,
      business_email = EXCLUDED.business_email,
      business_description = EXCLUDED.business_description,
      location = EXCLUDED.location,
      phone_number = EXCLUDED.phone_number,
      updated_at = NOW();
  `;
  await pool.query(query, [userId]);
}

async function upsertJobSeekerProfile(userId, fullName, phone, skill) {
  const query = `
    INSERT INTO job_seeker_profiles (
      user_id, full_name, phone_number, city, pincode, primary_skill,
      primary_skill_level, years_of_experience, secondary_skills,
      work_type_preference, preferred_hours, qualification, location,
      declares_age_18_plus, declares_info_accurate, declares_no_criminal_history, consents_to_terms
    ) VALUES (
      $1, $2, $3, 'Pune', '411001', $4,
      'intermediate', 2, 'Teamwork, Communication',
      'full_time', '9 AM - 6 PM', 'graduate', 'Pune',
      true, true, true, true
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      full_name = EXCLUDED.full_name,
      phone_number = EXCLUDED.phone_number,
      primary_skill = EXCLUDED.primary_skill,
      location = EXCLUDED.location,
      updated_at = NOW();
  `;
  await pool.query(query, [userId, fullName, phone, skill]);
}

async function upsertJobs(employerId) {
  const jobs = [
    ['Head Cook', 'Prepare dhaba specials and coordinate kitchen shifts.', 'Kitchen', 'full_time', 'Pune', '25000 - 32000'],
    ['Tandoor Specialist', 'Handle tandoor items and maintain quality during peak hours.', 'Kitchen', 'full_time', 'Pune', '22000 - 28000'],
    ['Service Captain', 'Lead floor staff and manage customer service quality.', 'Service', 'full_time', 'Pune', '18000 - 24000'],
    ['Cash Counter Executive', 'Billing, POS operations, and closing entries.', 'Operations', 'full_time', 'Pune', '17000 - 22000'],
    ['Night Shift Steward', 'Support late-night orders and table service.', 'Service', 'part_time', 'Pune', '12000 - 16000'],
    ['Delivery Rider', 'Deliver orders in 5 km radius with fast turnaround.', 'Delivery', 'full_time', 'Pune', '15000 - 23000'],
    ['Inventory Assistant', 'Track stock, procure supplies, and maintain records.', 'Operations', 'full_time', 'Pune', '16000 - 21000'],
    ['Dishwash Team Member', 'Maintain utensil hygiene and wash-area discipline.', 'Kitchen', 'full_time', 'Pune', '13000 - 17000'],
    ['Weekend Helper', 'Assist in rush-hour prep and cleanup.', 'Helper', 'temporary', 'Pune', '700 - 900 per day'],
    ['Security Guard', 'Manage entry gate and night safety checks.', 'Security', 'full_time', 'Pune', '15000 - 19000'],
  ];

  const inserted = [];

  for (const [title, description, category, jobType, location, salary] of jobs) {
    const existing = await pool.query('SELECT id FROM jobs WHERE employer_id = $1 AND title = $2 LIMIT 1', [employerId, title]);
    if (existing.rows[0]) {
      inserted.push(existing.rows[0]);
      continue;
    }
    const query = `
      INSERT INTO jobs (
        employer_id, title, description, category, job_type, location,
        salary, skills_required, qualification_required, vacancies, status, is_urgent, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Food handling, discipline', 'any', 3, 'open', false, NOW(), NOW())
      RETURNING id;
    `;
    const result = await pool.query(query, [employerId, title, description, category, jobType, location, salary]);
    inserted.push(result.rows[0]);
  }

  return inserted;
}

async function seedFun() {
  console.log('Seeding KaamConnect easter-egg data...');
  const hashedPassword = await hashPassword(PASSWORD);

  const owner = await upsertUser(
    {
      name: 'Talha Mulani',
      email: 'talha@dhaba.com',
      role: 'employer',
      location: 'Pune',
      phone: '9999999999',
    },
    hashedPassword
  );

  await upsertEmployerProfile(owner.id);
  const jobs = await upsertJobs(owner.id);

  for (let index = 0; index < TEAMMATES.length; index++) {
    const teammate = TEAMMATES[index];
    const phone = `90000000${(index + 10).toString().slice(-2)}`;

    const seeker = await upsertUser(
      {
        name: teammate.name,
        email: teammate.email,
        role: 'job_seeker',
        location: 'Pune',
        phone,
      },
      hashedPassword
    );

    await upsertJobSeekerProfile(seeker.id, teammate.name, phone, index % 2 === 0 ? 'Service' : 'Kitchen');

    // Ensure each teammate applies to at least one job.
    const targetJob = jobs[index % jobs.length];
    await pool.query(
      `
        INSERT INTO job_applications (job_id, job_seeker_id, status, cover_note, applied_at, updated_at)
        VALUES ($1, $2, 'pending', 'Excited to join Talha da Dhaba!', NOW(), NOW())
        ON CONFLICT (job_id, job_seeker_id)
        DO UPDATE SET status = 'pending', updated_at = NOW();
      `,
      [targetJob.id, seeker.id]
    );

    await pool.query(
      `
        INSERT INTO notifications (user_id, title, message, type, related_job_id, is_read, created_at)
        VALUES ($1, 'Application Submitted', 'Your application was sent to Talha da Dhaba.', 'application_update', $2, false, NOW());
      `,
      [seeker.id, targetJob.id]
    );
  }

  console.log('\nCredentials');
  console.log('Employer: talha@dhaba.com / Kaam@12345');
  for (const teammate of TEAMMATES) {
    console.log(`${teammate.name}: ${teammate.email} / Kaam@12345`);
  }

  await pool.end();
}

seedFun().catch(async (err) => {
  console.error('Seeding failed:', err.message);
  await pool.end();
  process.exit(1);
});
