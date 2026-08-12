export type AudienceVisibility = 'ANYONE' | 'UNIVERSITY_ONLY' | 'FACTORY_ONLY' | 'DEPARTMENT_ONLY';

export interface JobHistoryItem {
  id: string;
  companyName: string; // Factory or Textile Company
  position: string; // Designation
  department?: string; // e.g. Spinning, Weaving, Wet Process, Merchandising, QA
  location?: string;
  startDate: string;
  endDate: string | 'Present';
  description?: string;
  isCurrent?: boolean;
}

export interface EducationInfo {
  university: string; // e.g. "BUTEX", "DUET", "NITER", "MBSTU", "AUST", "BUBT"
  universityFullName: string; // e.g. "Bangladesh University of Textiles"
  department: string; // e.g. "Yarn Engineering", "Wet Process Engineering", "Fabric Engineering", "Apparel Engineering"
  batchNumber: string; // e.g. "41st Batch", "2018-2019"
  passingYear: string;
  degreeName?: string; // e.g., B.Sc. in Textile Engineering
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  birthDate: string;
  gender?: string; // e.g. "Male", "Female", "Other"
  avatarUrl: string;
  coverImageUrl?: string;
  headline: string; // e.g. "Senior Merchandiser at Square Textiles Ltd | BUTEX 38th Batch"
  bio?: string;
  location: string;
  
  // Education
  education: EducationInfo;
  
  // Current Job / Factory
  currentCompany: string; // Factory Name e.g. "Square Textiles Ltd"
  currentPosition: string; // e.g. "Manager - Quality Assurance"
  currentDepartment: string; // e.g. "Quality Control"
  joiningYear: string;
  
  // Previous Jobs
  previousJobs: JobHistoryItem[];

  // Skills
  skills: string[];
  
  // Connections count
  connectionsCount: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHeadline: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHeadline: string;
  authorUniversity: string;
  authorCompany: string;
  
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  
  visibility: AudienceVisibility;
  targetUniversity?: string; // e.g. "BUTEX" if visibility === 'UNIVERSITY_ONLY'
  targetFactory?: string; // e.g. "Square Textiles Ltd" if visibility === 'FACTORY_ONLY'
  targetDepartment?: string;
  
  createdAt: string;
  likes: number;
  likedByCurrentUser?: boolean;
  likedBy?: string[];
  reposts: number;
  comments: Comment[];
  isBookmarked?: boolean;
}

export interface FactoryInfo {
  id: string;
  name: string;
  codeName: string;
  logoUrl: string;
  bannerUrl: string;
  category: 'Spinning' | 'Composite' | 'Apparel/Garments' | 'Dyeing & Printing' | 'Denim/Woven' | 'Accessories';
  location: string;
  establishedYear: string;
  totalEmployees: number;
  description: string;
  websiteUrl?: string;
}

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: FriendRequestStatus;
  createdAt: string;
  createdAtISO: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  createdAtISO: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageSenderId?: string;
  updatedAtISO: string;
}

export interface JobPosting {
  id: string;
  title: string;
  companyName: string;
  factoryLogo: string;
  location: string;
  jobType: 'Full-time' | 'Contract' | 'Internship';
  experienceRequired: string;
  targetUniversity?: string;
  salaryRange: string;
  postedDate: string;
  description: string;
  requirements: string[];
}
