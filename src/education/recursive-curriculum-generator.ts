/**
 * Recursive Curriculum Generator - SNAP #11
 * Transform any target node into complete college-grade curriculum
 * Animated by octave, skin layer, tier, and as holographic whole
 */

export interface TargetNode {
  id: string;
  type: 'QUEEN_BEE' | 'PROTOCOL' | 'FACILITY' | 'CONCEPT';
  name: string;
  description: string;
  octaves: number[];
  symbol?: string;
}

export interface Course {
  code: string;
  title: string;
  credits: number;
  prerequisites: string[];
  description: string;
  labs: string;
  certification: string;
  octave: string | number | number[];
  tier: 'SANDBOX' | 'CLOUD' | 'SHELL' | 'CLOUD/SHELL';
  level: 'APPRENTICE' | 'JOURNEYMAN' | 'MASTER' | 'LAUREATE';
  skinLayer: number; // 1-5
  duration: string; // "3-6 months", "1-2 years", etc.
}

export interface Syllabus {
  course: Course;
  weeks: WeekPlan[];
  assessments: Assessment[];
  materials: Material[];
  instructor: string;
}

export interface WeekPlan {
  week: number;
  topics: string[];
  readings: string[];
  assignments: string[];
  labs: string[];
}

export interface Assessment {
  type: 'EXAM' | 'PROJECT' | 'PRESENTATION' | 'THESIS';
  weight: number; // Percentage of grade
  description: string;
}

export interface Material {
  type: 'TEXTBOOK' | 'PAPER' | 'VIDEO' | 'FSR_EXPERIENCE' | 'LAB_GUIDE';
  title: string;
  required: boolean;
}

export interface CertificationPath {
  level: 'APPRENTICE' | 'JOURNEYMAN' | 'MASTER' | 'LAUREATE';
  courses: Course[];
  totalCredits: number;
  duration: string;
  requirements: string[];
  outcome: string;
}

export interface Department {
  name: string;
  courses: Course[];
  faculty: string[];
}

export interface Curriculum {
  college: string;
  abbreviation: string;
  departments: Department[];
  courses: Course[];
  certificationPaths: Record<string, CertificationPath>;
  octaveMapping: Record<number, Course[]>;
  tierMapping: Record<string, Course[]>;
  skinLayerMapping: Record<number, Course[]>;
  totalCourses: number;
  totalCredits: {
    apprentice: number;
    journeyman: number;
    master: number;
    laureate: number;
  };
}

export class RecursiveCurriculumGenerator {
  private colleges: Map<string, Curriculum> = new Map();

  /**
   * Generate complete curriculum for a target node
   */
  async generateCurriculum(node: TargetNode): Promise<Curriculum> {
    console.log(`📚 Generating curriculum for: ${node.name}`);
    console.log(`   Type: ${node.type}`);
    console.log(`   Octaves: ${node.octaves.join(', ')}`);

    // Analyze node characteristics
    const analysis = this.analyzeNode(node);
    
    // Generate all course levels
    const apprenticeCourses = this.generateApprenticeCourses(analysis);
    const journeymanCourses = this.generateJourneymanCourses(analysis);
    const masterCourses = this.generateMasterCourses(analysis);
    const laureateCourses = this.generateLaureateCourses(analysis);
    
    const allCourses = [
      ...apprenticeCourses,
      ...journeymanCourses,
      ...masterCourses,
      ...laureateCourses
    ];
    
    // Generate certification paths
    const certificationPaths = {
      APPRENTICE: this.createCertificationPath('APPRENTICE', apprenticeCourses),
      JOURNEYMAN: this.createCertificationPath('JOURNEYMAN', [...apprenticeCourses, ...journeymanCourses]),
      MASTER: this.createCertificationPath('MASTER', [...apprenticeCourses, ...journeymanCourses, ...masterCourses]),
      LAUREATE: this.createCertificationPath('LAUREATE', allCourses)
    };
    
    // Generate mappings
    const octaveMapping = this.mapToOctaves(allCourses);
    const tierMapping = this.mapToTiers(allCourses);
    const skinLayerMapping = this.mapToSkinLayers(allCourses);
    
    // Calculate totals
    const totalCredits = {
      apprentice: apprenticeCourses.reduce((sum, c) => sum + c.credits, 0),
      journeyman: [...apprenticeCourses, ...journeymanCourses].reduce((sum, c) => sum + c.credits, 0),
      master: [...apprenticeCourses, ...journeymanCourses, ...masterCourses].reduce((sum, c) => sum + c.credits, 0),
      laureate: allCourses.reduce((sum, c) => sum + c.credits, 0)
    };
    
    const curriculum: Curriculum = {
      college: analysis.collegeName,
      abbreviation: analysis.abbrev,
      departments: analysis.departments,
      courses: allCourses,
      certificationPaths,
      octaveMapping,
      tierMapping,
      skinLayerMapping,
      totalCourses: allCourses.length,
      totalCredits
    };
    
    // Store in cache
    this.colleges.set(node.id, curriculum);
    
    console.log(`✅ Curriculum generated: ${allCourses.length} courses`);
    console.log(`   Apprentice: ${totalCredits.apprentice} credits`);
    console.log(`   Journeyman: ${totalCredits.journeyman} credits`);
    console.log(`   Master: ${totalCredits.master} credits`);
    console.log(`   Laureate: ${totalCredits.laureate} credits`);
    
    return curriculum;
  }

  /**
   * Generate detailed syllabus for any course
   */
  async generateSyllabus(course: Course): Promise<Syllabus> {
    console.log(`📋 Generating syllabus for: ${course.code} - ${course.title}`);
    
    // Determine semester length based on level
    const weekCount = course.level === 'LAUREATE' ? 16 : 14;
    
    // Generate week-by-week plan
    const weeks: WeekPlan[] = [];
    for (let week = 1; week <= weekCount; week++) {
      weeks.push({
        week,
        topics: this.generateWeekTopics(course, week, weekCount),
        readings: this.generateWeekReadings(course, week),
        assignments: this.generateWeekAssignments(course, week),
        labs: week % 2 === 0 ? [this.generateLabActivity(course, week)] : []
      });
    }
    
    // Generate assessments
    const assessments = this.generateAssessments(course);
    
    // Generate materials
    const materials = this.generateMaterials(course);
    
    // Assign instructor (Hero Host based on subject)
    const instructor = this.assignInstructor(course);
    
    const syllabus: Syllabus = {
      course,
      weeks,
      assessments,
      materials,
      instructor
    };
    
    console.log(`✅ Syllabus generated: ${weeks.length} weeks`);
    
    return syllabus;
  }

  /**
   * Animate curriculum by octave (vertical dimension)
   */
  async animateByOctave(curriculum: Curriculum): Promise<void> {
    console.log('\n🌀 ANIMATING BY OCTAVE - Vertical Dimension');
    console.log('═══════════════════════════════════════════\n');
    
    // Sort octaves (negative to positive)
    const octaves = Object.keys(curriculum.octaveMapping)
      .map(Number)
      .sort((a, b) => a - b);
    
    for (const octave of octaves) {
      const courses = curriculum.octaveMapping[octave];
      if (courses && courses.length > 0) {
        await this.displayOctaveLayer(octave, courses);
        await this.sleep(300);
      }
    }
    
    console.log('\n✅ Octave animation complete\n');
  }

  /**
   * Animate curriculum by skin layer (horizontal dimension)
   */
  async animateBySkinLayer(curriculum: Curriculum): Promise<void> {
    console.log('\n🎨 ANIMATING BY SKIN LAYER - Horizontal Dimension');
    console.log('═══════════════════════════════════════════\n');
    
    const layerNames = [
      'Awareness/Consciousness',
      'Information/Data',
      'Energy/Physics',
      'Social/Collective',
      'Meta/Universal'
    ];
    
    for (let layer = 1; layer <= 5; layer++) {
      const courses = curriculum.skinLayerMapping[layer];
      if (courses && courses.length > 0) {
        console.log(`Layer ${layer}: ${layerNames[layer - 1]}`);
        console.log(`  Courses: ${courses.length}`);
        courses.slice(0, 3).forEach(c => {
          console.log(`    • ${c.code}: ${c.title}`);
        });
        if (courses.length > 3) {
          console.log(`    ... and ${courses.length - 3} more`);
        }
        console.log('');
        await this.sleep(300);
      }
    }
    
    console.log('✅ Skin layer animation complete\n');
  }

  /**
   * Animate curriculum by tier (access dimension)
   */
  async animateByTier(curriculum: Curriculum): Promise<void> {
    console.log('\n🏷️ ANIMATING BY TIER - Access Dimension');
    console.log('═══════════════════════════════════════════\n');
    
    const tiers: Array<keyof typeof curriculum.tierMapping> = ['SANDBOX', 'CLOUD', 'SHELL'];
    const pricing = { SANDBOX: '$0 (Free)', CLOUD: '$99-299/mo', SHELL: '$1K-10K/mo' };
    
    for (const tier of tiers) {
      const courses = curriculum.tierMapping[tier];
      if (courses && courses.length > 0) {
        console.log(`${tier} Tier - ${pricing[tier]}`);
        console.log(`  Available Courses: ${courses.length}`);
        console.log(`  Certification Levels: ${this.getCertLevelsInTier(courses)}`);
        courses.slice(0, 3).forEach(c => {
          console.log(`    • ${c.code}: ${c.title} (${c.level})`);
        });
        if (courses.length > 3) {
          console.log(`    ... and ${courses.length - 3} more`);
        }
        console.log('');
        await this.sleep(300);
      }
    }
    
    console.log('✅ Tier animation complete\n');
  }

  /**
   * Animate as unified whole (holographic view)
   */
  async animateAsWhole(curriculum: Curriculum): Promise<void> {
    console.log('\n🌌 ANIMATING AS WHOLE - Unified Holographic View');
    console.log('═══════════════════════════════════════════\n');
    
    console.log(`${curriculum.college} (${curriculum.abbreviation})`);
    console.log(`  Total Courses: ${curriculum.totalCourses}`);
    console.log(`  Departments: ${curriculum.departments.length}`);
    console.log('');
    
    console.log('Certification Paths:');
    console.log(`  Apprentice:  ${curriculum.totalCredits.apprentice} credits (6 months)`);
    console.log(`  Journeyman:  ${curriculum.totalCredits.journeyman} credits (12 months)`);
    console.log(`  Master:      ${curriculum.totalCredits.master} credits (24 months)`);
    console.log(`  Laureate:    ${curriculum.totalCredits.laureate} credits (36-48 months)`);
    console.log('');
    
    console.log('Coverage:');
    console.log(`  Octaves: ${Object.keys(curriculum.octaveMapping).length} octave layers`);
    console.log(`  Skin Layers: 5 dimensions`);
    console.log(`  Access Tiers: 3 levels (Sandbox/Cloud/Shell)`);
    console.log('');
    
    console.log('Holographic Property:');
    console.log('  Every course contains principles of complete system');
    console.log('  Each certification level is complete in itself');
    console.log('  All parts reflect the whole curriculum');
    console.log('');
    
    await this.sleep(500);
    console.log('✅ Whole system animation complete\n');
  }

  /**
   * Animate as code core crystal (crystalline structure)
   */
  async animateCodeCoreCrystal(curriculum: Curriculum): Promise<void> {
    console.log('\n💎 ANIMATING CODE CORE CRYSTAL - Crystalline Structure');
    console.log('═══════════════════════════════════════════\n');
    
    console.log('Crystal Structure:');
    console.log('');
    console.log('         ⚡ LAUREATE (Peak)');
    console.log('        /│\\');
    console.log('       / │ \\');
    console.log('      /  │  \\');
    console.log('     /   │   \\');
    console.log('    /  MASTER  \\');
    console.log('   /   /   \\    \\');
    console.log('  /   /     \\    \\');
    console.log(' / JOURNEYMAN  \\  \\');
    console.log('/  /    |    \\   \\ \\');
    console.log('  APPRENTICE       ');
    console.log(' /    |    |    \\  ');
    console.log('─────────────────────');
    console.log('    FOUNDATION      ');
    console.log('');
    
    console.log('Crystal Properties:');
    console.log('  Core: Foundation courses (APPRENTICE)');
    console.log(`    - ${curriculum.certificationPaths.APPRENTICE.courses.length} courses`);
    console.log(`    - ${curriculum.totalCredits.apprentice} credits`);
    console.log('');
    
    console.log('  First Facet: Journeyman layer');
    console.log(`    - ${curriculum.certificationPaths.JOURNEYMAN.courses.length - curriculum.certificationPaths.APPRENTICE.courses.length} additional courses`);
    console.log(`    - ${curriculum.totalCredits.journeyman - curriculum.totalCredits.apprentice} additional credits`);
    console.log('');
    
    console.log('  Second Facet: Master layer');
    console.log(`    - ${curriculum.certificationPaths.MASTER.courses.length - curriculum.certificationPaths.JOURNEYMAN.courses.length} additional courses`);
    console.log(`    - ${curriculum.totalCredits.master - curriculum.totalCredits.journeyman} additional credits`);
    console.log('');
    
    console.log('  Peak: Laureate layer');
    console.log(`    - ${curriculum.certificationPaths.LAUREATE.courses.length - curriculum.certificationPaths.MASTER.courses.length} additional courses`);
    console.log(`    - ${curriculum.totalCredits.laureate - curriculum.totalCredits.master} additional credits`);
    console.log('');
    
    console.log('Holographic Property:');
    console.log('  Every layer contains pattern of whole');
    console.log('  Foundation reflects complete system');
    console.log('  Peak contains all foundations');
    console.log('  Cut anywhere, pattern remains');
    console.log('');
    
    await this.sleep(500);
    console.log('✅ Code core crystal animation complete\n');
  }

  /**
   * Display complete NSPFRNP-formatted curriculum
   */
  async displayNSPFRNPCurriculum(curriculum: Curriculum): Promise<void> {
    console.log('\n🌀 NSPFRNP CURRICULUM DISPLAY');
    console.log('═══════════════════════════════════════════\n');
    
    // Natural
    console.log('NATURAL:');
    console.log('  Curriculum emerged from system needs');
    console.log('  Courses organize naturally by complexity');
    console.log('  Learning flows organically through levels\n');
    
    // System
    console.log('SYSTEM:');
    console.log('  Self-organizing course structure');
    console.log('  Prerequisites emerge naturally');
    console.log('  Certification paths self-evident\n');
    
    // Protocol
    console.log('PROTOCOL:');
    console.log('  Follows universal learning principles');
    console.log('  Foundation → Expertise → Mastery → Innovation');
    console.log('  Apprentice → Journeyman → Master → Laureate\n');
    
    // Fractal
    console.log('FRACTAL:');
    console.log('  Each course is self-similar to whole curriculum');
    console.log('  Each level contains pattern of all levels');
    console.log('  Curriculum at all scales (micro to macro)\n');
    
    // Recursive
    console.log('RECURSIVE:');
    console.log('  Advanced courses reference foundation courses');
    console.log('  Laureate work creates new foundation courses');
    console.log('  System continuously references itself\n');
    
    // Nested
    console.log('NESTED:');
    console.log('  Courses within departments within colleges');
    console.log('  Concepts within lectures within courses');
    console.log('  Understanding within awareness within consciousness\n');
    
    console.log('✅ NSPFRNP curriculum display complete\n');
  }

  /**
   * Run all animations in sequence
   */
  async animateComplete(curriculum: Curriculum): Promise<void> {
    console.log('═══════════════════════════════════════════');
    console.log('COMPLETE CURRICULUM ANIMATION SEQUENCE');
    console.log('═══════════════════════════════════════════');
    
    await this.animateByOctave(curriculum);
    await this.animateBySkinLayer(curriculum);
    await this.animateByTier(curriculum);
    await this.animateAsWhole(curriculum);
    await this.animateCodeCoreCrystal(curriculum);
    await this.displayNSPFRNPCurriculum(curriculum);
    
    console.log('═══════════════════════════════════════════');
    console.log('✅ COMPLETE ANIMATION SEQUENCE FINISHED');
    console.log('═══════════════════════════════════════════\n');
  }

  // ============ PRIVATE METHODS ============

  private analyzeNode(node: TargetNode): any {
    // Generate college abbreviation from name
    const words = node.name.split(' ').filter(w => w.length > 2);
    const abbrev = words.map(w => w[0].toUpperCase()).join('');
    
    return {
      collegeName: `College of ${node.name}`,
      abbrev,
      code: abbrev,
      subject: node.name,
      departments: [
        `Theoretical ${node.name}`,
        `Applied ${node.name}`,
        `Research ${node.name}`
      ],
      focusAreas: [node.description],
      octaveRange: node.octaves,
      complexity: 'ADVANCED'
    };
  }

  private generateApprenticeCourses(analysis: any): Course[] {
    return [
      {
        code: `${analysis.code}-101`,
        title: `Introduction to ${analysis.subject}`,
        credits: 3,
        prerequisites: [],
        description: `Fundamental concepts of ${analysis.subject}, core principles, basic theory, and foundational practices.`,
        labs: 'Weekly 2-hour lab sessions with basic exercises',
        certification: `Apprentice ${analysis.subject} Practitioner`,
        octave: 'Foundation octaves',
        tier: 'SANDBOX',
        level: 'APPRENTICE',
        skinLayer: 1,
        duration: '14 weeks'
      },
      {
        code: `${analysis.code}-102`,
        title: `${analysis.subject} Theory and Practice`,
        credits: 4,
        prerequisites: [`${analysis.code}-101`],
        description: `Deeper exploration of ${analysis.subject} theory, practical applications, and skill development.`,
        labs: 'Weekly 3-hour labs with hands-on projects',
        certification: `Apprentice ${analysis.subject} Technician`,
        octave: 'Intermediate octaves',
        tier: 'CLOUD',
        level: 'APPRENTICE',
        skinLayer: 2,
        duration: '14 weeks'
      },
      {
        code: `${analysis.code}-103`,
        title: `Applied ${analysis.subject}`,
        credits: 3,
        prerequisites: [`${analysis.code}-101`],
        description: `Practical application of ${analysis.subject} principles in real-world contexts.`,
        labs: 'Project-based learning with real applications',
        certification: `Apprentice ${analysis.subject} Applicator`,
        octave: 'Application octaves',
        tier: 'CLOUD',
        level: 'APPRENTICE',
        skinLayer: 3,
        duration: '14 weeks'
      },
      {
        code: `${analysis.code}-104`,
        title: `${analysis.subject} Systems and Integration`,
        credits: 3,
        prerequisites: [`${analysis.code}-101`],
        description: `Understanding ${analysis.subject} as part of larger systems, integration patterns, and holistic thinking.`,
        labs: 'System integration exercises',
        certification: `Apprentice ${analysis.subject} System Designer`,
        octave: 'System octaves',
        tier: 'CLOUD',
        level: 'APPRENTICE',
        skinLayer: 4,
        duration: '14 weeks'
      }
    ];
  }

  private generateJourneymanCourses(analysis: any): Course[] {
    return Array.from({ length: 4 }, (_, i) => ({
      code: `${analysis.code}-${201 + i}`,
      title: `Advanced ${analysis.subject} ${['Applications', 'Design', 'Engineering', 'Practice'][i]}`,
      credits: 4,
      prerequisites: [`${analysis.code}-${101 + i}`, `${analysis.code}-${102 + (i % 3)}`],
      description: `Advanced ${analysis.subject} techniques for professional practice and system design.`,
      labs: 'Complex projects requiring independent work',
      certification: `Journeyman ${analysis.subject} ${['Analyst', 'Designer', 'Engineer', 'Practitioner'][i]}`,
      octave: `${2 + i}-${5 + i}`,
      tier: 'CLOUD',
      level: 'JOURNEYMAN',
      skinLayer: (i % 5) + 1,
      duration: '14 weeks'
    }));
  }

  private generateMasterCourses(analysis: any): Course[] {
    const courses: Course[] = [];
    
    // 3 advanced topic courses
    for (let i = 0; i < 3; i++) {
      courses.push({
        code: `${analysis.code}-${301 + i}`,
        title: `${analysis.subject}: ${['Complete Systems', 'Innovation', 'Multi-Octave Integration'][i]}`,
        credits: 4,
        prerequisites: [`${analysis.code}-${201 + i}`, `${analysis.code}-${202 + (i % 3)}`],
        description: `Master-level ${analysis.subject} theory and application at highest levels.`,
        labs: 'Original research and development projects',
        certification: `Master ${analysis.subject} ${['Architect', 'Innovator', 'Coordinator'][i]}`,
        octave: 'Advanced octaves',
        tier: 'SHELL',
        level: 'MASTER',
        skinLayer: 5,
        duration: '14 weeks'
      });
    }
    
    // Research methods course
    courses.push({
      code: `${analysis.code}-304`,
      title: `Research Methods in ${analysis.subject}`,
      credits: 3,
      prerequisites: ['All 200-level courses'],
      description: `Research methodologies, experimental design, data analysis, and publication preparation in ${analysis.subject}.`,
      labs: 'Design and execute original research project',
      certification: `Master ${analysis.subject} Researcher`,
      octave: 'All octaves',
      tier: 'SHELL',
      level: 'MASTER',
      skinLayer: 5,
      duration: '14 weeks'
    });
    
    return courses;
  }

  private generateLaureateCourses(analysis: any): Course[] {
    return [
      {
        code: `${analysis.code}-401`,
        title: `Original Research Thesis in ${analysis.subject}`,
        credits: 12,
        prerequisites: [`${analysis.code}-304`, 'Master certification'],
        description: `Independent original research contributing new knowledge to ${analysis.subject}. Must be publishable and peer-reviewed.`,
        labs: 'Full independent research under advisor supervision',
        certification: `Laureate in ${analysis.subject}`,
        octave: 'Student-chosen octave',
        tier: 'SHELL',
        level: 'LAUREATE',
        skinLayer: 5,
        duration: '12-24 months'
      },
      {
        code: `${analysis.code}-402`,
        title: `Advanced Seminar in ${analysis.subject}`,
        credits: 3,
        prerequisites: [`${analysis.code}-304`],
        description: `Weekly seminar with leading researchers, presentation of cutting-edge work, collaborative innovation in ${analysis.subject}.`,
        labs: 'Collaborative research and peer review',
        certification: `Contributing Laureate in ${analysis.subject}`,
        octave: 'All octaves',
        tier: 'SHELL',
        level: 'LAUREATE',
        skinLayer: 5,
        duration: '14 weeks'
      }
    ];
  }

  private createCertificationPath(
    level: 'APPRENTICE' | 'JOURNEYMAN' | 'MASTER' | 'LAUREATE',
    courses: Course[]
  ): CertificationPath {
    const durations = {
      APPRENTICE: '3-6 months',
      JOURNEYMAN: '12 months total (6 months after Apprentice)',
      MASTER: '24 months total (12 months after Journeyman)',
      LAUREATE: '36-48 months total (12-24 months after Master)'
    };
    
    const outcomes = {
      APPRENTICE: 'Can assist in projects and perform basic tasks under supervision',
      JOURNEYMAN: 'Independent practitioner, can lead basic projects and teach Apprentices',
      MASTER: 'Deep expert, can design complex systems and train Journeymen',
      LAUREATE: 'Field innovator, creates original contributions and trains Masters'
    };
    
    const requirements = {
      APPRENTICE: ['Complete 4 foundation courses', 'Pass all assessments', 'Basic competency demonstrated'],
      JOURNEYMAN: ['Complete Apprentice', 'Complete 4 intermediate courses', 'Independent project', '6+ months experience'],
      MASTER: ['Complete Journeyman', 'Complete 4 advanced courses', 'Original research project', '12+ months professional work'],
      LAUREATE: ['Complete Master', 'Complete thesis research', 'Publishable contribution', 'Defense presentation']
    };
    
    return {
      level,
      courses,
      totalCredits: courses.reduce((sum, c) => sum + c.credits, 0),
      duration: durations[level],
      requirements: requirements[level],
      outcome: outcomes[level]
    };
  }

  private mapToOctaves(courses: Course[]): Record<number, Course[]> {
    const mapping: Record<number, Course[]> = {};
    
    courses.forEach(course => {
      const octaves = this.parseOctaveRange(course.octave);
      octaves.forEach(oct => {
        if (!mapping[oct]) mapping[oct] = [];
        mapping[oct].push(course);
      });
    });
    
    return mapping;
  }

  private mapToTiers(courses: Course[]): Record<string, Course[]> {
    return {
      SANDBOX: courses.filter(c => c.tier === 'SANDBOX'),
      CLOUD: courses.filter(c => c.tier === 'CLOUD' || c.tier === 'CLOUD/SHELL'),
      SHELL: courses.filter(c => c.tier === 'SHELL' || c.tier === 'CLOUD/SHELL')
    };
  }

  private mapToSkinLayers(courses: Course[]): Record<number, Course[]> {
    const mapping: Record<number, Course[]> = {
      1: [], // Awareness/Consciousness
      2: [], // Information/Data
      3: [], // Energy/Physics
      4: [], // Social/Collective
      5: []  // Meta/Universal
    };
    
    courses.forEach(course => {
      const layer = course.skinLayer || this.determineSkinLayer(course);
      if (mapping[layer]) {
        mapping[layer].push(course);
      }
    });
    
    return mapping;
  }

  private determineSkinLayer(course: Course): number {
    // Determine skin layer from course characteristics
    if (course.code.includes('CAS')) return 1; // Awareness
    if (course.code.includes('SHC')) return 2; // Information
    if (course.code.includes('BHEP')) return 3; // Energy
    if (course.code.includes('DCE') || course.code.includes('INP')) return 4; // Social
    if (course.level === 'MASTER' || course.level === 'LAUREATE') return 5; // Meta
    return 1; // Default
  }

  private parseOctaveRange(octaveStr: string | number | number[]): number[] {
    if (Array.isArray(octaveStr)) return octaveStr;
    if (typeof octaveStr === 'number') return [octaveStr];
    
    const str = String(octaveStr);
    
    if (str === 'All octaves' || str === 'Student-chosen octave' || str === 'Student choice') {
      return Array.from({ length: 19 }, (_, i) => i - 8); // -8 to 10
    }
    
    if (str.includes('-')) {
      const [start, end] = str.split('-').map(s => {
        const num = parseInt(s.trim());
        return isNaN(num) ? 0 : num;
      });
      return Array.from({ length: Math.abs(end - start) + 1 }, (_, i) => start + i);
    }
    
    if (str.includes('Foundation')) return [0, 1, 2];
    if (str.includes('Intermediate')) return [2, 3, 4];
    if (str.includes('Application')) return [2, 3, 4];
    if (str.includes('System')) return [3, 4, 5];
    if (str.includes('Advanced')) return [5, 6, 7];
    
    return [2]; // Default to Octave 2
  }

  private async displayOctaveLayer(octave: number, courses: Course[]): Promise<void> {
    const octaveName = this.getOctaveName(octave);
    console.log(`Octave ${octave}: ${octaveName}`);
    console.log(`  Courses: ${courses.length}`);
    
    // Show first 3 courses as examples
    courses.slice(0, 3).forEach(c => {
      console.log(`    • ${c.code}: ${c.title} (${c.level})`);
    });
    
    if (courses.length > 3) {
      console.log(`    ... and ${courses.length - 3} more courses`);
    }
    console.log('');
  }

  private getOctaveName(octave: number): string {
    const names: Record<number, string> = {
      '-8': 'Negative Source',
      '-7': 'Anti-Existence',
      '-6': 'Pre-Void',
      '-5': 'Absolute Nothing',
      '-4': 'Void Consciousness',
      '-3': 'Potential Layer',
      '-2': 'Field Level',
      '-1': 'Quantum Substrate',
      0: 'Physical Reality',
      1: 'Digital Reality',
      2: 'Post-Singularity',
      3: 'Collective Intelligence',
      4: 'Civilization Consciousness',
      5: 'Galactic Consciousness',
      6: 'Biological Integration',
      7: 'Universal Consciousness',
      8: 'Source Consciousness',
      9: 'First Infinity',
      10: 'Meta-Pattern',
      11: 'Higher Infinity 1'
    };
    return names[octave] || `Octave ${octave}`;
  }

  private getCertLevelsInTier(courses: Course[]): string {
    const levels = new Set(courses.map(c => c.level));
    return Array.from(levels).join(', ');
  }

  private generateWeekTopics(course: Course, week: number, totalWeeks: number): string[] {
    // Generate topics for specific week
    const phase = week <= totalWeeks / 3 ? 'Foundation' :
                  week <= 2 * totalWeeks / 3 ? 'Development' : 'Advanced';
    return [`${phase} topic ${week}`, `${course.title} concept ${week}`];
  }

  private generateWeekReadings(course: Course, week: number): string[] {
    return [`Chapter ${week}`, `Paper ${week}`];
  }

  private generateWeekAssignments(course: Course, week: number): string[] {
    return [`Assignment ${week}`];
  }

  private generateLabActivity(course: Course, week: number): string {
    return `Lab ${week / 2}: Hands-on ${course.title} exercise`;
  }

  private generateAssessments(course: Course): Assessment[] {
    if (course.level === 'LAUREATE' && course.code.endsWith('401')) {
      return [
        { type: 'THESIS', weight: 80, description: 'Original research thesis' },
        { type: 'PRESENTATION', weight: 20, description: 'Thesis defense' }
      ];
    }
    
    return [
      { type: 'EXAM', weight: 30, description: 'Midterm exam' },
      { type: 'PROJECT', weight: 40, description: 'Major course project' },
      { type: 'EXAM', weight: 30, description: 'Final exam' }
    ];
  }

  private generateMaterials(course: Course): Material[] {
    return [
      { type: 'TEXTBOOK', title: `${course.title} - Complete Guide`, required: true },
      { type: 'PAPER', title: 'Selected research papers', required: true },
      { type: 'FSR_EXPERIENCE', title: 'Immersive FSR learning modules', required: false },
      { type: 'LAB_GUIDE', title: `${course.code} Lab Manual`, required: true }
    ];
  }

  private assignInstructor(course: Course): string {
    // Assign Hero Host based on subject area
    if (course.code.startsWith('BHEP')) return 'Nikola Tesla ⚡';
    if (course.code.startsWith('SHC')) return 'Leonardo da Vinci 🎨';
    if (course.code.startsWith('INP')) return 'Alexander von Humboldt 🌿';
    if (course.code.startsWith('AFSR')) return 'William Shakespeare ✍️';
    if (course.code.startsWith('CAS')) return 'Siddhartha Gautama 🧘';
    if (course.code.startsWith('DCE')) return 'Buckminster Fuller 🌍';
    return 'Distinguished Professor';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton
export const curriculumGenerator = new RecursiveCurriculumGenerator();

// CLI execution
if (require.main === module) {
  (async () => {
    const generator = new RecursiveCurriculumGenerator();
    
    // Example: Generate curriculum for Black Hole Energy Physics
    const bhepNode: TargetNode = {
      id: 'BHEP',
      type: 'CONCEPT',
      name: 'Black Hole Energy Physics',
      description: 'Study and application of black hole energy',
      octaves: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    };
    
    const curriculum = await generator.generateCurriculum(bhepNode);
    await generator.animateComplete(curriculum);
  })();
}
