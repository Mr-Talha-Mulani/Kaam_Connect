// lib/sampleData.ts

export const sampleUser = {
  id: 1,
  name: "Ravi Kumar",
  email: "ravi@example.com",
  role: "job_seeker",
  is_profile_completed: true,
  created_at: "2024-01-15T10:00:00Z",
};

export const sampleJobSeekerProfile = {
  id: 1,
  user_id: 1,
  skills: "Data Entry, MS Excel, Typing, Customer Support",
  age: 24,
  location: "mumbai",
  phone_number: "9876543210",
  qualification: "graduate",
};

export const sampleEmployer = {
  id: 2,
  name: "Sharma Enterprises",
  email: "hr@sharmaenterprises.com",
  role: "employer",
  is_profile_completed: true,
  created_at: "2024-01-10T08:00:00Z",
};

export const sampleEmployerProfile = {
  id: 1,
  user_id: 2,
  name: "Sharma Enterprises",
  location: "delhi",
  phone_number: "9123456780",
  email: "hr@sharmaenterprises.com",
  business_description:
    "We are a mid-sized retail company looking for motivated individuals for various roles across our stores and offices.",
};

export const sampleJobs = [
  {
    id: 1,
    title: "Data Entry Operator",
    description: "Enter and manage data records accurately in our ERP system.",
    salary: "₹12,000/month",
    skills_required: "MS Excel, Typing, Attention to Detail",
    qualification_required: "12th_pass",
    location: "mumbai",
    vacancies: 3,
    status: "open",
    employer_id: 2,
    employer_name: "Sharma Enterprises",
    created_at: "2024-03-01T09:00:00Z",
  },
  {
    id: 2,
    title: "Customer Support Executive",
    description: "Handle inbound calls and resolve customer queries.",
    salary: "₹15,000/month",
    skills_required: "Communication, Hindi & English, Patience",
    qualification_required: "graduate",
    location: "delhi",
    vacancies: 5,
    status: "open",
    employer_id: 2,
    employer_name: "Sharma Enterprises",
    created_at: "2024-03-05T11:00:00Z",
  },
  {
    id: 3,
    title: "Warehouse Helper",
    description: "Assist in packing, sorting, and shipping warehouse goods.",
    salary: "₹10,000/month",
    skills_required: "Physical Fitness, Basic Counting",
    qualification_required: "10th_pass",
    location: "pune",
    vacancies: 10,
    status: "open",
    employer_id: 2,
    employer_name: "Sharma Enterprises",
    created_at: "2024-03-10T08:30:00Z",
  },
  {
    id: 4,
    title: "Accounts Assistant",
    description: "Support the accounts team with billing and invoice management.",
    salary: "₹18,000/month",
    skills_required: "Tally, MS Excel, Basic Accounting",
    qualification_required: "post_graduate",
    location: "mumbai",
    vacancies: 2,
    status: "closed",
    employer_id: 2,
    employer_name: "Sharma Enterprises",
    created_at: "2024-02-20T10:00:00Z",
  },
];