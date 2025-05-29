import { 
  users, courses, enrollments, certificates, badges, userBadges, quizAttempts,
  type User, type InsertUser, type Course, type InsertCourse, 
  type Enrollment, type InsertEnrollment, type Certificate, type InsertCertificate,
  type Badge, type InsertBadge, type UserBadge, type InsertUserBadge,
  type QuizAttempt, type InsertQuizAttempt
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Courses
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined>;
  getPublishedCourses(): Promise<Course[]>;

  // Enrollments
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment | undefined>;

  // Certificates
  getUserCertificates(userId: number): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getCertificateById(id: string): Promise<Certificate | undefined>;

  // Badges
  getAllBadges(): Promise<Badge[]>;
  getUserBadges(userId: number): Promise<UserBadge[]>;
  createUserBadge(userBadge: InsertUserBadge): Promise<UserBadge>;

  // Quiz Attempts
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: number, courseId: number): Promise<QuizAttempt[]>;

  // Analytics
  getLeaderboard(limit?: number): Promise<User[]>;
  getUserStats(userId: number): Promise<{ inProgress: number; completed: number; certificates: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private courses: Map<number, Course> = new Map();
  private enrollments: Map<number, Enrollment> = new Map();
  private certificates: Map<number, Certificate> = new Map();
  private badges: Map<number, Badge> = new Map();
  private userBadges: Map<number, UserBadge> = new Map();
  private quizAttempts: Map<number, QuizAttempt> = new Map();
  private currentUserId = 1;
  private currentCourseId = 1;
  private currentEnrollmentId = 1;
  private currentCertificateId = 1;
  private currentBadgeId = 1;
  private currentUserBadgeId = 1;
  private currentQuizAttemptId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers: InsertUser[] = [
      {
        username: "john.doe",
        email: "john.doe@company.com",
        password: "password123",
        role: "learner",
        firstName: "John",
        lastName: "Doe",
        department: "Product Team",
        totalXP: 1850,
        level: 7
      },
      {
        username: "admin",
        email: "admin@skillnest.com",
        password: "admin123",
        role: "admin",
        firstName: "Admin",
        lastName: "User",
        department: "Administration",
        totalXP: 5000,
        level: 15
      }
    ];

    sampleUsers.forEach(user => {
      const newUser: User = { ...user, id: this.currentUserId++, createdAt: new Date() };
      this.users.set(newUser.id, newUser);
    });

    // Create sample courses
    const sampleCourses: InsertCourse[] = [
      {
        title: "Leadership Fundamentals",
        description: "Learn essential leadership skills to inspire and motivate your team effectively.",
        category: "Leadership",
        level: "beginner",
        duration: "4h 30m",
        thumbnail: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        authorId: 2,
        modules: [
          {
            id: "module-1",
            type: "video",
            title: "Introduction to Leadership",
            content: { url: "https://example.com/video1", duration: "36:20" }
          },
          {
            id: "module-2",
            type: "quiz",
            title: "Leadership Knowledge Check",
            content: {
              questions: [
                {
                  id: "q1",
                  question: "What is the most important quality of a good leader?",
                  type: "multiple-choice",
                  options: ["Intelligence", "Emotional intelligence", "Technical skills", "Years of experience"],
                  correctAnswer: 1
                }
              ]
            }
          }
        ],
        tags: ["leadership", "management", "soft-skills"],
        isPublished: true
      },
      {
        title: "Project Management Essentials",
        description: "Master the fundamentals of project planning, execution, and delivery.",
        category: "Project Management",
        level: "intermediate",
        duration: "6h 15m",
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        authorId: 2,
        modules: [],
        tags: ["project-management", "planning", "execution"],
        isPublished: true
      },
      {
        title: "Effective Communication",
        description: "Develop powerful communication skills for professional success.",
        category: "Communication",
        level: "beginner",
        duration: "3h 45m",
        thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        authorId: 2,
        modules: [],
        tags: ["communication", "presentation", "soft-skills"],
        isPublished: true
      }
    ];

    sampleCourses.forEach(course => {
      const newCourse: Course = { ...course, id: this.currentCourseId++, createdAt: new Date() };
      this.courses.set(newCourse.id, newCourse);
    });

    // Create sample enrollments
    const sampleEnrollments: InsertEnrollment[] = [
      { userId: 1, courseId: 1, progress: 75, completedModules: ["module-1"] },
      { userId: 1, courseId: 2, progress: 45, completedModules: [] },
      { userId: 1, courseId: 3, progress: 100, completedModules: ["module-1", "module-2"] }
    ];

    sampleEnrollments.forEach(enrollment => {
      const newEnrollment: Enrollment = { 
        ...enrollment, 
        id: this.currentEnrollmentId++, 
        enrolledAt: new Date(),
        completedAt: enrollment.progress === 100 ? new Date() : null
      };
      this.enrollments.set(newEnrollment.id, newEnrollment);
    });

    // Create sample badges
    const sampleBadges: InsertBadge[] = [
      {
        name: "First Course",
        description: "Complete your first course",
        icon: "fas fa-graduation-cap",
        type: "course",
        requirement: { courseCount: 1 },
        xpReward: 100
      },
      {
        name: "Quick Learner",
        description: "Complete a course in under 24 hours",
        icon: "fas fa-brain",
        type: "streak",
        requirement: { timeLimit: 24 },
        xpReward: 200
      }
    ];

    sampleBadges.forEach(badge => {
      const newBadge: Badge = { ...badge, id: this.currentBadgeId++ };
      this.badges.set(newBadge.id, newBadge);
    });

    // Create sample certificates
    const sampleCertificates: InsertCertificate[] = [
      {
        userId: 1,
        courseId: 3,
        certificateId: "CERT-EC-001",
        score: 95
      }
    ];

    sampleCertificates.forEach(cert => {
      const newCert: Certificate = { ...cert, id: this.currentCertificateId++, issuedAt: new Date() };
      this.certificates.set(newCert.id, newCert);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.currentUserId++, createdAt: new Date() };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.category === category);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const course: Course = { ...insertCourse, id: this.currentCourseId++, createdAt: new Date() };
    this.courses.set(course.id, course);
    return course;
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, ...updates };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async getPublishedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.isPublished);
  }

  // Enrollment methods
  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      enrollment => enrollment.userId === userId && enrollment.courseId === courseId
    );
  }

  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(enrollment => enrollment.userId === userId);
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id: this.currentEnrollmentId++, 
      enrolledAt: new Date(),
      completedAt: null
    };
    this.enrollments.set(enrollment.id, enrollment);
    return enrollment;
  }

  async updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) return undefined;
    
    const updatedEnrollment = { ...enrollment, ...updates };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Certificate methods
  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).filter(cert => cert.userId === userId);
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const certificate: Certificate = { 
      ...insertCertificate, 
      id: this.currentCertificateId++, 
      issuedAt: new Date() 
    };
    this.certificates.set(certificate.id, certificate);
    return certificate;
  }

  async getCertificateById(certificateId: string): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values()).find(cert => cert.certificateId === certificateId);
  }

  // Badge methods
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values()).filter(badge => badge.userId === userId);
  }

  async createUserBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const userBadge: UserBadge = { 
      ...insertUserBadge, 
      id: this.currentUserBadgeId++, 
      earnedAt: new Date() 
    };
    this.userBadges.set(userBadge.id, userBadge);
    return userBadge;
  }

  // Quiz methods
  async createQuizAttempt(insertQuizAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const attempt: QuizAttempt = { 
      ...insertQuizAttempt, 
      id: this.currentQuizAttemptId++, 
      completedAt: new Date() 
    };
    this.quizAttempts.set(attempt.id, attempt);
    return attempt;
  }

  async getUserQuizAttempts(userId: number, courseId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(
      attempt => attempt.userId === userId && attempt.courseId === courseId
    );
  }

  // Analytics methods
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, limit);
  }

  async getUserStats(userId: number): Promise<{ inProgress: number; completed: number; certificates: number }> {
    const enrollments = await this.getUserEnrollments(userId);
    const certificates = await this.getUserCertificates(userId);
    
    const inProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
    const completed = enrollments.filter(e => e.progress === 100).length;
    
    return {
      inProgress,
      completed,
      certificates: certificates.length
    };
  }
}

export const storage = new MemStorage();
