import { UserProfile, FactoryInfo, Post, JobPosting } from '../types';

export const INITIAL_FACTORIES: FactoryInfo[] = [
  {
    id: 'fac-1',
    name: 'Square Textiles Ltd',
    codeName: 'Square Textiles',
    logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    category: 'Spinning',
    location: 'Valuka, Mymensingh / Gazipur',
    establishedYear: '1997',
    totalEmployees: 4500,
    description: 'One of the largest ring spun yarn and vortex yarn production complexes in Bangladesh, producing cotton, melange, and synthetic yarns.',
    websiteUrl: 'https://squaretextiles.com'
  },
  {
    id: 'fac-2',
    name: 'Beximco Industrial Park',
    codeName: 'Beximco',
    logoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    category: 'Composite',
    location: 'Sarabo, Kashimpur, Gazipur',
    establishedYear: '1980',
    totalEmployees: 12000,
    description: 'Integrated textile manufacturing ecosystem encompassing spinning, weaving, denim washing, knitting, and apparel exporting globally.',
    websiteUrl: 'https://beximco.com'
  },
  {
    id: 'fac-3',
    name: 'DBL Group (Matami & Jinnat)',
    codeName: 'DBL Group',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
    category: 'Composite',
    location: 'Kashimpur, Gazipur / Mawna',
    establishedYear: '1991',
    totalEmployees: 38000,
    description: 'Leading eco-friendly composite textile manufacturer specializing in knitwear, dyeing, spinning, and technical garments.',
    websiteUrl: 'https://dbl-group.com'
  },
  {
    id: 'fac-4',
    name: 'Envoy Textiles Ltd',
    codeName: 'Envoy Textiles',
    logoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
    category: 'Denim/Woven',
    location: 'Bhaluka, Mymensingh',
    establishedYear: '2005',
    totalEmployees: 3200,
    description: 'First LEED Certified Platinum Denim Manufacturing facility in Bangladesh, pioneering sustainable rope dyeing and premium denim fabrics.',
    websiteUrl: 'https://envoytextiles.com'
  },
  {
    id: 'fac-5',
    name: 'Pacific Jeans Group',
    codeName: 'Pacific Jeans',
    logoUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
    category: 'Denim/Woven',
    location: 'EPZ, Chattogram',
    establishedYear: '1984',
    totalEmployees: 30000,
    description: 'World-renowned premium denim outerwear and pants exporter operating multiple state-of-the-art washing & sewing units in CEPZ.',
    websiteUrl: 'https://pacificjeans.com'
  },
  {
    id: 'fac-6',
    name: 'Ha-Meem Group',
    codeName: 'Ha-Meem Group',
    logoUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    category: 'Apparel/Garments',
    location: 'Tongi & Ashulia, Dhaka',
    establishedYear: '1988',
    totalEmployees: 50000,
    description: 'One of the premier woven apparel and denim exporters with spinning, weaving, washing and 26 garment factories across Bangladesh.',
    websiteUrl: 'https://hameemgroup.com'
  }
];

export const UNIVERSITIES_LIST = [
  { id: 'BUTEX', name: 'BUTEX', fullName: 'Bangladesh University of Textiles', location: 'Tejgaon, Dhaka' },
  { id: 'DUET', name: 'DUET', fullName: 'Dhaka University of Engineering & Technology', location: 'Gazipur' },
  { id: 'NITER', name: 'NITER', fullName: 'National Institute of Textile Engineering & Research', location: 'Savar, Dhaka' },
  { id: 'MBSTU', name: 'MBSTU', fullName: 'Mawlana Bhashani Science & Technology University', location: 'Tangail' },
  { id: 'AUST', name: 'AUST', fullName: 'Ahsanullah University of Science and Technology', location: 'Dhaka' },
  { id: 'BUBT', name: 'BUBT', fullName: 'Bangladesh University of Business and Technology', location: 'Mirpur, Dhaka' },
  { id: 'SEU', name: 'SEU', fullName: 'Southeast University', location: 'Tejgaon, Dhaka' },
  { id: 'CTEC', name: 'CTEC', fullName: 'Chittagong Textile Engineering College', location: 'Chattogram' }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    firstName: 'Tanvir',
    lastName: 'Ahmed',
    email: 'tanvir.ahmed@butex.edu.bd',
    mobileNumber: '+8801712345678',
    birthDate: '1995-04-12',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80',
    headline: 'Assistant General Manager (Spinning) at Square Textiles Ltd | BUTEX 40th Batch',
    bio: 'Textile Engineer specializing in Ring & Vortex Spinning technology, process optimization, and sustainable yarn development. Over 8 years of factory floor management experience.',
    location: 'Gazipur, Bangladesh',
    education: {
      university: 'BUTEX',
      universityFullName: 'Bangladesh University of Textiles',
      department: 'Yarn Engineering',
      batchNumber: '40th Batch',
      passingYear: '2016',
      degreeName: 'B.Sc. in Textile Engineering'
    },
    currentCompany: 'Square Textiles Ltd',
    currentPosition: 'Assistant General Manager',
    currentDepartment: 'Spinning Division',
    joiningYear: '2021',
    previousJobs: [
      {
        id: 'pj-1',
        companyName: 'Envoy Textiles Ltd',
        position: 'Senior Production Executive',
        department: 'Rope Dyeing & Yarn Preparation',
        startDate: '2018',
        endDate: '2021',
        description: 'Managed indigo slasher dyeing machine parameters and yarn tension optimization.'
      },
      {
        id: 'pj-2',
        companyName: 'Beximco Industrial Park',
        position: 'Management Trainee Officer',
        department: 'Spinning Dept',
        startDate: '2016',
        endDate: '2018',
        description: 'Trained across blowroom, carding, drawing, comb, speed frame and ring frame departments.'
      }
    ],
    skills: ['Ring Spinning', 'Process Optimization', 'Vortex Yarn', 'Cotton Blends', 'Production Planning', 'ISO 9001 Quality'],
    connectionsCount: 842
  },
  {
    id: 'usr-2',
    firstName: 'Nusrat',
    lastName: 'Jahan',
    email: 'nusrat.jahan@squaretextiles.com',
    mobileNumber: '+8801898765432',
    birthDate: '1996-08-22',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=80',
    headline: 'Senior Merchandiser at Square Textiles Ltd | BUTEX 41st Batch',
    bio: 'Knitwear & Yarn merchandising specialist handling European brands like H&M, Zara, and C&A. Passionate about sustainable organic cotton sourcing.',
    location: 'Dhaka, Bangladesh',
    education: {
      university: 'BUTEX',
      universityFullName: 'Bangladesh University of Textiles',
      department: 'Textile Engineering Management',
      batchNumber: '41st Batch',
      passingYear: '2017',
      degreeName: 'B.Sc. in Textile Engineering'
    },
    currentCompany: 'Square Textiles Ltd',
    currentPosition: 'Senior Merchandiser',
    currentDepartment: 'Marketing & Sales',
    joiningYear: '2020',
    previousJobs: [
      {
        id: 'pj-3',
        companyName: 'Ha-Meem Group',
        position: 'Assistant Merchandiser',
        department: 'Woven Division',
        startDate: '2017',
        endDate: '2020',
        description: 'Handled trim sourcing, tech pack analysis, sample approval, and shipment tracking.'
      }
    ],
    skills: ['Costing & Pricing', 'Fabric Sourcing', 'Buyer Communication', 'ERP Systems', 'Export Documentation'],
    connectionsCount: 1250
  },
  {
    id: 'usr-3',
    firstName: 'Mahmudul',
    lastName: 'Hasan',
    email: 'mahmud.duet@gmail.com',
    mobileNumber: '+8801655443322',
    birthDate: '1993-11-05',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1000&auto=format&fit=crop&q=80',
    headline: 'Wet Processing Manager at DBL Group | DUET 2015 Batch',
    bio: 'Dyeing & Finishing Specialist focusing on low-liquor ratio dyeing machines, shade matching, ETP compliance, and water recycling technologies.',
    location: 'Gazipur, Bangladesh',
    education: {
      university: 'DUET',
      universityFullName: 'Dhaka University of Engineering & Technology',
      department: 'Wet Process Engineering',
      batchNumber: '2015 Batch',
      passingYear: '2015',
      degreeName: 'B.Sc. in Textile Engineering'
    },
    currentCompany: 'DBL Group (Matami & Jinnat)',
    currentPosition: 'Dyeing & Finishing Manager',
    currentDepartment: 'Wet Processing Unit',
    joiningYear: '2019',
    previousJobs: [
      {
        id: 'pj-4',
        companyName: 'Viyellatex Group',
        position: 'Dyeing Executive',
        department: 'Dyehouse',
        startDate: '2015',
        endDate: '2019',
        description: 'Optimized reactive and disperse dye recipes, reducing re-dyeing rates below 1.5%.'
      }
    ],
    skills: ['Fabric Dyeing', 'Color Matching', 'Thies & Fong Machine Operation', 'ETP Management', 'ZDHC Compliance'],
    connectionsCount: 620
  },
  {
    id: 'usr-4',
    firstName: 'Rafiqul',
    lastName: 'Islam',
    email: 'rafiq.niter@gmail.com',
    mobileNumber: '+8801733221100',
    birthDate: '1997-02-14',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1000&auto=format&fit=crop&q=80',
    headline: 'Quality Assurance Lead at Envoy Textiles Ltd | NITER 08 Batch',
    bio: 'Denim Quality Specialist with expertise in continuous shade inspection, tensile strength testing, and ISO laboratory compliance.',
    location: 'Mymensingh, Bangladesh',
    education: {
      university: 'NITER',
      universityFullName: 'National Institute of Textile Engineering and Research',
      department: 'Fabric Engineering',
      batchNumber: '08th Batch',
      passingYear: '2018',
      degreeName: 'B.Sc. in Textile Engineering'
    },
    currentCompany: 'Envoy Textiles Ltd',
    currentPosition: 'Quality Assurance Lead',
    currentDepartment: 'Quality Control Lab',
    joiningYear: '2021',
    previousJobs: [
      {
        id: 'pj-5',
        companyName: 'Square Textiles Ltd',
        position: 'Quality Control Officer',
        department: 'Yarn Testing Lab',
        startDate: '2018',
        endDate: '2021',
        description: 'Operated Uster Tester 5, Classimat, and Single Yarn Tenacity testing equipment.'
      }
    ],
    skills: ['Denim Fabric Inspection', 'Uster Testing', '4-Point System Inspection', 'Lab Dip Approval', 'AQL Standard'],
    connectionsCount: 510
  },
  {
    id: 'usr-5',
    firstName: 'Shakil',
    lastName: 'Reza',
    email: 'shakil.pacific@gmail.com',
    mobileNumber: '+8801911223344',
    birthDate: '1994-06-30',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=1000&auto=format&fit=crop&q=80',
    headline: 'R&D Wash Manager at Pacific Jeans Group | BUTEX 39th Batch',
    bio: 'Laser washing, ozone treatment, and enzyme washing specialist for global denim brands. Champion of waterless wash technologies in CEPZ.',
    location: 'Chattogram, Bangladesh',
    education: {
      university: 'BUTEX',
      universityFullName: 'Bangladesh University of Textiles',
      department: 'Wet Process Engineering',
      batchNumber: '39th Batch',
      passingYear: '2015',
      degreeName: 'B.Sc. in Textile Engineering'
    },
    currentCompany: 'Pacific Jeans Group',
    currentPosition: 'R&D Wash Manager',
    currentDepartment: 'Denim Laundry Division',
    joiningYear: '2018',
    previousJobs: [
      {
        id: 'pj-6',
        companyName: 'Beximco Industrial Park',
        position: 'Washing Specialist',
        department: 'Denim Wash Plant',
        startDate: '2015',
        endDate: '2018',
        description: 'Developed vintage wash effects, resin treatments, and 3D whiskers for Levis and G-Star.'
      }
    ],
    skills: ['Laser Wash (Jeanologia)', 'Ozone Washing', '3D Whiskering', 'PP Spray Alternatives', 'Eco Laundry'],
    connectionsCount: 930
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'usr-1',
    authorName: 'Tanvir Ahmed',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    authorHeadline: 'Assistant General Manager (Spinning) at Square Textiles Ltd',
    authorUniversity: 'BUTEX',
    authorCompany: 'Square Textiles Ltd',
    content: 'Proud to announce that our new Vortex Spinning line at Square Textiles Unit-4 has achieved 99.2% efficiency this month! We successfully reduced yarn hairiness by 18% using custom traveler speeds and optimized drafting profiles. Kudos to the entire spinning team!',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80',
    visibility: 'ANYONE',
    createdAt: '2 hours ago',
    likes: 142,
    reposts: 18,
    comments: [
      {
        id: 'c-1',
        authorId: 'usr-2',
        authorName: 'Nusrat Jahan',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        authorHeadline: 'Senior Merchandiser at Square Textiles Ltd',
        content: 'Congratulations Tanvir Vai! This high-vortex low-hairiness yarn will help us win the new premium knitwear order from H&M.',
        createdAt: '1 hour ago',
        likes: 12
      },
      {
        id: 'c-2',
        authorId: 'usr-4',
        authorName: 'Rafiqul Islam',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        authorHeadline: 'Quality Assurance Lead at Envoy Textiles Ltd',
        content: 'Great achievement! Did you use Rieter or Murata Vortex machinery for this trial?',
        createdAt: '45 mins ago',
        likes: 5
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'usr-2',
    authorName: 'Nusrat Jahan',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    authorHeadline: 'Senior Merchandiser at Square Textiles Ltd | BUTEX 41st Batch',
    authorUniversity: 'BUTEX',
    authorCompany: 'Square Textiles Ltd',
    content: '🎓 Special update for BUTEX alumni brothers & sisters! Our 41st Batch annual get-together details will be finalized next week. We are organizing a panel discussion on "Future of Smart Textiles & Sustainable Sourcing in Bangladesh". Hope to see all BUTEX Engineers present!',
    visibility: 'UNIVERSITY_ONLY',
    targetUniversity: 'BUTEX',
    createdAt: '5 hours ago',
    likes: 89,
    reposts: 14,
    comments: [
      {
        id: 'c-3',
        authorId: 'usr-5',
        authorName: 'Shakil Reza',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        authorHeadline: 'R&D Wash Manager at Pacific Jeans Group | BUTEX 39th Batch',
        content: 'Count me in! I will join from Chattogram. Happy to share some research on waterless laser washing.',
        createdAt: '3 hours ago',
        likes: 8
      }
    ]
  },
  {
    id: 'post-3',
    authorId: 'usr-1',
    authorName: 'Tanvir Ahmed',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    authorHeadline: 'Assistant General Manager at Square Textiles Ltd',
    authorUniversity: 'BUTEX',
    authorCompany: 'Square Textiles Ltd',
    content: '🏭 Square Textiles Factory Internal Update: Scheduled annual maintenance for Carding and Combing machines in Unit-2 starts this Friday. Shift Engineers are requested to submit machine audit sheets by Thursday 5:00 PM.',
    visibility: 'FACTORY_ONLY',
    targetFactory: 'Square Textiles Ltd',
    createdAt: '1 day ago',
    likes: 34,
    reposts: 2,
    comments: [
      {
        id: 'c-4',
        authorId: 'usr-2',
        authorName: 'Nusrat Jahan',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        authorHeadline: 'Senior Merchandiser at Square Textiles Ltd',
        content: 'Noted Tanvir Bhai. We have aligned delivery schedules with buyers accordingly.',
        createdAt: '22 hours ago',
        likes: 4
      }
    ]
  },
  {
    id: 'post-4',
    authorId: 'usr-3',
    authorName: 'Mahmudul Hasan',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    authorHeadline: 'Wet Processing Manager at DBL Group | DUET 2015 Batch',
    authorUniversity: 'DUET',
    authorCompany: 'DBL Group (Matami & Jinnat)',
    content: 'Implemented zero-liquid discharge (ZLD) testing in our dyehouse today. Reduced water consumption per kg of cotton fabric from 60 liters down to 38 liters using cold pad-batch dyeing! Sustainability is not just a slogan, it is the future of Bangladesh Textile Export.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1000&auto=format&fit=crop&q=80',
    visibility: 'ANYONE',
    createdAt: '2 days ago',
    likes: 210,
    reposts: 42,
    comments: []
  }
];

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Assistant Manager - Wet Processing (Dyeing)',
    companyName: 'Square Textiles Ltd',
    factoryLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80',
    location: 'Valuka, Mymensingh',
    jobType: 'Full-time',
    experienceRequired: '4-6 Years',
    targetUniversity: 'BUTEX / DUET / NITER Preferred',
    salaryRange: 'BDT 65,000 - 85,000 / month',
    postedDate: '2 days ago',
    description: 'Looking for an experienced Textile Engineer to oversee knit fabric dyeing operations on Thies and Fong high-temperature dyeing machines.',
    requirements: [
      'B.Sc. in Textile Engineering (Wet Processing specialty preferred)',
      'Minimum 4 years working experience in large scale dyehouse',
      'Strong knowledge of reactive dyeing, shade matching, and chemical dosage',
      'Ability to manage shift workers and maintain zero defect rate'
    ]
  },
  {
    id: 'job-2',
    title: 'Senior Garment Merchandiser (Knit & Sweater)',
    companyName: 'DBL Group',
    factoryLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80',
    location: 'Gazipur, Dhaka',
    jobType: 'Full-time',
    experienceRequired: '5-8 Years',
    salaryRange: 'BDT 80,000 - 110,000 / month',
    postedDate: '1 day ago',
    description: 'Responsible for managing EU buyer accounts (Puma, Lidl, George), cost estimation, fabric booking, and production follow-up.',
    requirements: [
      'B.Sc. in Textile Engineering or Merchandising background',
      'Proven track record handling European retail buyers',
      'Excellent verbal and written English communication skills',
      'Expertise in ERP software and costing sheets'
    ]
  },
  {
    id: 'job-3',
    title: 'R&D Denim Wash Specialist',
    companyName: 'Pacific Jeans Group',
    factoryLogo: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150&auto=format&fit=crop&q=80',
    location: 'CEPZ, Chattogram',
    jobType: 'Full-time',
    experienceRequired: '3-5 Years',
    salaryRange: 'BDT 55,000 - 75,000 / month',
    postedDate: '3 days ago',
    description: 'Develop innovative wash recipes using Jeanologia laser technology, ozone wash, and eco-friendly enzymes for premium denim lines.',
    requirements: [
      'B.Sc. in Textile Engineering (BUTEX/DUET/CTEC/NITER)',
      'Hands-on laser washing and ozone washing machine experience',
      'Creative mind for developing fashion wash samples'
    ]
  }
];
