/**
 * Student Master Calendar System - SNAP #18 Enhancement
 * Complete calendar view for ALL enrolled courses, events, and activities
 * Octave 13: Social Infrastructure - Personal Schedule Management
 */

import type { Vibeathon, VibeathonRegistration } from './vibeathon-system.js';

// ========== MASTER CALENDAR TYPES ==========

export type CalendarEventType = 
  | 'VIBEATHON'
  | 'COURSE_LECTURE'
  | 'LAB_SESSION'
  | 'OFFICE_HOURS'
  | 'EXAM'
  | 'ASSIGNMENT_DUE'
  | 'PROJECT_PRESENTATION'
  | 'STUDY_GROUP'
  | 'MENTORSHIP'
  | 'WORKSHOP';

export type CalendarView = 'DAY' | 'WEEK' | 'MONTH' | 'SEMESTER' | 'YEAR' | 'AGENDA';

export interface MasterCalendarEvent {
  id: string;
  studentId: string;
  
  // Event details
  type: CalendarEventType;
  title: string;
  description: string;
  location: string;
  
  // Timing
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  timezone: string;
  
  // Recurrence
  recurring: boolean;
  recurrenceRule?: string; // iCal RRULE format
  recurrenceEndDate?: Date;
  
  // Source
  sourceType: 'VIBEATHON' | 'COURSE' | 'MANUAL';
  sourceId: string;
  
  // Academic info
  courseCode?: string;
  courseName?: string;
  college?: string;
  instructor?: string;
  credits?: number;
  
  // Status
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  attendance: 'NOT_STARTED' | 'PRESENT' | 'ABSENT' | 'EXCUSED';
  
  // Reminders
  reminders: number[]; // Minutes before event
  
  // Colors & display
  color: string;
  backgroundColor: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentCalendar {
  studentId: string;
  studentName: string;
  studentEmail: string;
  
  // Calendar settings
  timezone: string;
  weekStartsOn: 'SUNDAY' | 'MONDAY';
  defaultView: CalendarView;
  defaultReminders: number[]; // Minutes before
  
  // Calendar feed
  feedUrl: string;
  feedToken: string;
  lastSync: Date;
  
  // Events
  events: MasterCalendarEvent[];
  
  // Statistics
  totalEvents: number;
  upcomingEvents: number;
  thisWeekEvents: number;
  thisMonthEvents: number;
  
  // Preferences
  showWeekends: boolean;
  show24Hour: boolean;
  colorByType: boolean;
  colorByCourse: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarSubscription {
  id: string;
  studentId: string;
  type: 'ICAL' | 'GOOGLE' | 'OUTLOOK' | 'APPLE';
  url: string;
  token: string;
  active: boolean;
  lastAccessed?: Date;
  accessCount: number;
  createdAt: Date;
}

export interface CalendarExport {
  studentId: string;
  format: 'ICAL' | 'CSV' | 'JSON' | 'PDF';
  dateRange: {
    start: Date;
    end: Date;
  };
  includeTypes: CalendarEventType[];
  content: string;
  generatedAt: Date;
}

// ========== MASTER CALENDAR SYSTEM ==========

export class StudentMasterCalendarSystem {
  private calendars: Map<string, StudentCalendar> = new Map();
  private subscriptions: Map<string, CalendarSubscription> = new Map();
  
  constructor() {
    console.log('📅 Student Master Calendar System Initializing...');
    console.log('   SNAP #18 Enhancement: Complete Schedule Management');
    console.log('   Octave 13: Personal Calendar for ALL Enrolled Activities');
  }
  
  // ========== CALENDAR INITIALIZATION ==========
  
  /**
   * Initialize calendar for a student
   */
  async initializeCalendar(
    studentId: string,
    studentName: string,
    studentEmail: string,
    timezone: string = 'America/Los_Angeles'
  ): Promise<StudentCalendar> {
    const feedToken = this.generateFeedToken();
    const feedUrl = `https://calendar.nspfrnp.ai/feed/${studentId}/${feedToken}.ics`;
    
    const calendar: StudentCalendar = {
      studentId,
      studentName,
      studentEmail,
      timezone,
      weekStartsOn: 'SUNDAY',
      defaultView: 'WEEK',
      defaultReminders: [15, 60, 1440], // 15min, 1hr, 1day
      feedUrl,
      feedToken,
      lastSync: new Date(),
      events: [],
      totalEvents: 0,
      upcomingEvents: 0,
      thisWeekEvents: 0,
      thisMonthEvents: 0,
      showWeekends: true,
      show24Hour: false,
      colorByType: true,
      colorByCourse: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.calendars.set(studentId, calendar);
    
    console.log(`📅 Master calendar initialized for ${studentName}`);
    console.log(`   Calendar feed: ${feedUrl}`);
    console.log(`   Timezone: ${timezone}`);
    
    return calendar;
  }
  
  /**
   * Get or create calendar for student
   */
  async getCalendar(studentId: string): Promise<StudentCalendar | undefined> {
    return this.calendars.get(studentId);
  }
  
  // ========== EVENT MANAGEMENT ==========
  
  /**
   * Add event to student's master calendar
   */
  async addEvent(
    studentId: string,
    eventData: Partial<MasterCalendarEvent>
  ): Promise<MasterCalendarEvent> {
    const calendar = this.calendars.get(studentId);
    if (!calendar) {
      throw new Error('Calendar not found. Initialize first.');
    }
    
    const event: MasterCalendarEvent = {
      id: `CAL-EVT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      studentId,
      type: eventData.type || 'VIBEATHON',
      title: eventData.title || 'Untitled Event',
      description: eventData.description || '',
      location: eventData.location || '',
      startTime: eventData.startTime || new Date(),
      endTime: eventData.endTime || new Date(Date.now() + 60 * 60 * 1000),
      allDay: eventData.allDay || false,
      timezone: eventData.timezone || calendar.timezone,
      recurring: eventData.recurring || false,
      recurrenceRule: eventData.recurrenceRule,
      recurrenceEndDate: eventData.recurrenceEndDate,
      sourceType: eventData.sourceType || 'MANUAL',
      sourceId: eventData.sourceId || '',
      courseCode: eventData.courseCode,
      courseName: eventData.courseName,
      college: eventData.college,
      instructor: eventData.instructor,
      credits: eventData.credits,
      status: eventData.status || 'CONFIRMED',
      attendance: 'NOT_STARTED',
      reminders: eventData.reminders || calendar.defaultReminders,
      color: eventData.color || this.getColorForType(eventData.type || 'VIBEATHON'),
      backgroundColor: eventData.backgroundColor || this.getBackgroundColorForType(eventData.type || 'VIBEATHON'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    calendar.events.push(event);
    calendar.totalEvents++;
    calendar.updatedAt = new Date();
    
    this.updateStatistics(calendar);
    
    console.log(`📅 Event added: ${event.title}`);
    console.log(`   Type: ${event.type}`);
    console.log(`   When: ${event.startTime.toLocaleString()}`);
    
    return event;
  }
  
  /**
   * Add vibeathon to student's calendar
   */
  async addVibeathonToCalendar(
    studentId: string,
    vibeathon: Vibeathon,
    registration: VibeathonRegistration
  ): Promise<MasterCalendarEvent> {
    return this.addEvent(studentId, {
      type: 'VIBEATHON',
      title: vibeathon.title,
      description: vibeathon.description,
      location: this.formatVibeathonLocation(vibeathon, registration),
      startTime: vibeathon.startTime,
      endTime: vibeathon.endTime,
      timezone: vibeathon.timezone,
      recurring: vibeathon.recurrence !== 'ONCE',
      recurrenceRule: this.convertRecurrenceToRRule(vibeathon.recurrence),
      sourceType: 'VIBEATHON',
      sourceId: vibeathon.id,
      college: vibeathon.college,
      status: 'CONFIRMED'
    });
  }
  
  /**
   * Add course schedule to calendar (all lectures for semester)
   */
  async addCourseSchedule(
    studentId: string,
    courseData: {
      courseCode: string;
      courseName: string;
      college: string;
      instructor: string;
      credits: number;
      schedule: {
        dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
        startTime: string; // "14:00"
        endTime: string;   // "15:30"
        location: string;
        type: 'LECTURE' | 'LAB' | 'DISCUSSION';
      }[];
      semesterStart: Date;
      semesterEnd: Date;
      holidays: Date[];
    }
  ): Promise<MasterCalendarEvent[]> {
    const events: MasterCalendarEvent[] = [];
    
    // For each scheduled time (e.g., MWF 2:00pm)
    for (const scheduleItem of courseData.schedule) {
      // Generate all occurrences for the semester
      const occurrences = this.generateRecurringDates(
        scheduleItem.dayOfWeek,
        scheduleItem.startTime,
        scheduleItem.endTime,
        courseData.semesterStart,
        courseData.semesterEnd,
        courseData.holidays
      );
      
      // Add each occurrence as an event
      for (const occurrence of occurrences) {
        const event = await this.addEvent(studentId, {
          type: 'COURSE_LECTURE',
          title: `${courseData.courseCode}: ${scheduleItem.type}`,
          description: courseData.courseName,
          location: scheduleItem.location,
          startTime: occurrence.start,
          endTime: occurrence.end,
          courseCode: courseData.courseCode,
          courseName: courseData.courseName,
          college: courseData.college,
          instructor: courseData.instructor,
          credits: courseData.credits,
          sourceType: 'COURSE',
          sourceId: courseData.courseCode,
          status: 'CONFIRMED'
        });
        
        events.push(event);
      }
    }
    
    console.log(`📚 Course schedule added: ${courseData.courseCode}`);
    console.log(`   Total events: ${events.length}`);
    console.log(`   Semester: ${courseData.semesterStart.toLocaleDateString()} - ${courseData.semesterEnd.toLocaleDateString()}`);
    
    return events;
  }
  
  /**
   * Bulk add all enrolled courses
   */
  async syncAllEnrollments(
    studentId: string,
    enrollments: {
      courses: any[];
      vibeathons: any[];
      workshops: any[];
    }
  ): Promise<number> {
    let totalAdded = 0;
    
    console.log(`🔄 Syncing all enrollments for student ${studentId}...`);
    
    // Add all courses
    for (const course of enrollments.courses) {
      const events = await this.addCourseSchedule(studentId, course);
      totalAdded += events.length;
    }
    
    // Add all vibeathons
    for (const vibeathon of enrollments.vibeathons) {
      await this.addVibeathonToCalendar(studentId, vibeathon.event, vibeathon.registration);
      totalAdded++;
    }
    
    // Add all workshops
    for (const workshop of enrollments.workshops) {
      await this.addEvent(studentId, {
        type: 'WORKSHOP',
        title: workshop.title,
        description: workshop.description,
        location: workshop.location,
        startTime: workshop.startTime,
        endTime: workshop.endTime,
        sourceType: 'COURSE',
        sourceId: workshop.id
      });
      totalAdded++;
    }
    
    console.log(`✅ Sync complete: ${totalAdded} events added to calendar`);
    
    return totalAdded;
  }
  
  // ========== CALENDAR VIEWS ==========
  
  /**
   * Get calendar view for specific time range
   */
  async getCalendarView(
    studentId: string,
    view: CalendarView,
    date: Date = new Date()
  ): Promise<{
    view: CalendarView;
    dateRange: { start: Date; end: Date };
    events: MasterCalendarEvent[];
    stats: any;
  }> {
    const calendar = this.calendars.get(studentId);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    
    const dateRange = this.getDateRangeForView(view, date);
    const events = calendar.events.filter(event => 
      event.startTime >= dateRange.start &&
      event.startTime <= dateRange.end
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    const stats = this.getViewStatistics(events);
    
    return {
      view,
      dateRange,
      events,
      stats
    };
  }
  
  /**
   * Get agenda view (upcoming events list)
   */
  async getAgendaView(
    studentId: string,
    daysAhead: number = 14
  ): Promise<MasterCalendarEvent[]> {
    const calendar = this.calendars.get(studentId);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    
    const now = new Date();
    const endDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    
    return calendar.events.filter(event =>
      event.startTime >= now &&
      event.startTime <= endDate
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }
  
  // ========== CALENDAR SUBSCRIPTION ==========
  
  /**
   * Create calendar subscription (for external calendar apps)
   */
  async createSubscription(
    studentId: string,
    type: CalendarSubscription['type'] = 'ICAL'
  ): Promise<CalendarSubscription> {
    const calendar = this.calendars.get(studentId);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    
    const subscription: CalendarSubscription = {
      id: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      studentId,
      type,
      url: calendar.feedUrl,
      token: calendar.feedToken,
      active: true,
      accessCount: 0,
      createdAt: new Date()
    };
    
    this.subscriptions.set(subscription.id, subscription);
    
    console.log(`🔗 Calendar subscription created`);
    console.log(`   Type: ${type}`);
    console.log(`   URL: ${subscription.url}`);
    console.log(`   Instructions: Subscribe to this URL in your calendar app`);
    
    return subscription;
  }
  
  /**
   * Generate iCal feed for student (subscribable calendar)
   */
  async generateICalFeed(studentId: string, token: string): Promise<string> {
    const calendar = this.calendars.get(studentId);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    
    if (calendar.feedToken !== token) {
      throw new Error('Invalid feed token');
    }
    
    const now = new Date();
    const events = calendar.events.filter(e => 
      e.endTime >= now // Only future and current events
    );
    
    let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NSPFRNP Student Master Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${calendar.studentName}'s Schedule
X-WR-TIMEZONE:${calendar.timezone}
X-WR-CALDESC:Complete academic schedule for ${calendar.studentName}
`;
    
    for (const event of events) {
      ical += this.generateVEvent(event);
    }
    
    ical += 'END:VCALENDAR';
    
    console.log(`📄 iCal feed generated for ${calendar.studentName}`);
    console.log(`   Events included: ${events.length}`);
    
    return ical;
  }
  
  /**
   * Export calendar to various formats
   */
  async exportCalendar(
    studentId: string,
    format: CalendarExport['format'],
    dateRange?: { start: Date; end: Date },
    includeTypes?: CalendarEventType[]
  ): Promise<CalendarExport> {
    const calendar = this.calendars.get(studentId);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    
    // Default to current semester if no range specified
    const range = dateRange || this.getCurrentSemesterRange();
    
    // Filter events
    let events = calendar.events.filter(e =>
      e.startTime >= range.start && e.startTime <= range.end
    );
    
    if (includeTypes && includeTypes.length > 0) {
      events = events.filter(e => includeTypes.includes(e.type));
    }
    
    let content: string;
    
    switch (format) {
      case 'ICAL':
        content = await this.exportToICal(events, calendar);
        break;
      case 'CSV':
        content = this.exportToCSV(events);
        break;
      case 'JSON':
        content = JSON.stringify(events, null, 2);
        break;
      case 'PDF':
        content = this.exportToPDF(events, calendar, range);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    const exportData: CalendarExport = {
      studentId,
      format,
      dateRange: range,
      includeTypes: includeTypes || [],
      content,
      generatedAt: new Date()
    };
    
    console.log(`📦 Calendar exported to ${format}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   Range: ${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`);
    
    return exportData;
  }
  
  // ========== HELPER METHODS ==========
  
  private generateFeedToken(): string {
    return Math.random().toString(36).substr(2, 32);
  }
  
  private formatVibeathonLocation(vibeathon: any, registration: any): string {
    if (registration.attendanceMode === 'PHYSICAL') {
      return vibeathon.physicalLocation;
    } else if (registration.attendanceMode === 'FSR') {
      return `FSR: ${vibeathon.fsrChamber}`;
    } else if (registration.attendanceMode === 'VIRTUAL') {
      return vibeathon.virtualLink;
    } else {
      return `${vibeathon.physicalLocation} (Hybrid)`;
    }
  }
  
  private convertRecurrenceToRRule(recurrence: string): string | undefined {
    const rules: Record<string, string> = {
      'DAILY': 'FREQ=DAILY',
      'WEEKLY': 'FREQ=WEEKLY',
      'MONTHLY': 'FREQ=MONTHLY'
    };
    return rules[recurrence];
  }
  
  private generateRecurringDates(
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    semesterStart: Date,
    semesterEnd: Date,
    holidays: Date[]
  ): { start: Date; end: Date }[] {
    const occurrences: { start: Date; end: Date }[] = [];
    const current = new Date(semesterStart);
    
    // Find first occurrence of the day
    while (current.getDay() !== dayOfWeek) {
      current.setDate(current.getDate() + 1);
    }
    
    // Generate all occurrences
    while (current <= semesterEnd) {
      // Check if not a holiday
      const isHoliday = holidays.some(holiday =>
        holiday.toDateString() === current.toDateString()
      );
      
      if (!isHoliday) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const start = new Date(current);
        start.setHours(startHour, startMin, 0, 0);
        
        const end = new Date(current);
        end.setHours(endHour, endMin, 0, 0);
        
        occurrences.push({ start, end });
      }
      
      // Next week
      current.setDate(current.getDate() + 7);
    }
    
    return occurrences;
  }
  
  private getDateRangeForView(view: CalendarView, date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    const end = new Date(date);
    
    switch (view) {
      case 'DAY':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'WEEK':
        start.setDate(date.getDate() - date.getDay()); // Start of week
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6); // End of week
        end.setHours(23, 59, 59, 999);
        break;
      case 'MONTH':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0); // Last day of month
        end.setHours(23, 59, 59, 999);
        break;
      case 'SEMESTER':
        const semesterRange = this.getCurrentSemesterRange(date);
        return semesterRange;
      case 'YEAR':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }
    
    return { start, end };
  }
  
  private getCurrentSemesterRange(date: Date = new Date()): { start: Date; end: Date } {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Simple semester logic (adjust for your academic calendar)
    if (month >= 8) {
      // Fall semester: September - December
      return {
        start: new Date(year, 8, 1), // Sept 1
        end: new Date(year, 11, 31)  // Dec 31
      };
    } else if (month >= 0 && month <= 4) {
      // Spring semester: January - May
      return {
        start: new Date(year, 0, 1),  // Jan 1
        end: new Date(year, 4, 31)    // May 31
      };
    } else {
      // Summer semester: June - August
      return {
        start: new Date(year, 5, 1),  // June 1
        end: new Date(year, 7, 31)    // Aug 31
      };
    }
  }
  
  private updateStatistics(calendar: StudentCalendar): void {
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    calendar.upcomingEvents = calendar.events.filter(e => e.startTime >= now).length;
    calendar.thisWeekEvents = calendar.events.filter(e => 
      e.startTime >= now && e.startTime <= weekEnd
    ).length;
    calendar.thisMonthEvents = calendar.events.filter(e =>
      e.startTime >= now && e.startTime <= monthEnd
    ).length;
  }
  
  private getViewStatistics(events: MasterCalendarEvent[]): any {
    const byType: Record<string, number> = {};
    const byCourse: Record<string, number> = {};
    
    for (const event of events) {
      byType[event.type] = (byType[event.type] || 0) + 1;
      if (event.courseCode) {
        byCourse[event.courseCode] = (byCourse[event.courseCode] || 0) + 1;
      }
    }
    
    return {
      total: events.length,
      byType,
      byCourse,
      avgEventsPerDay: events.length / 7 // Assuming week view
    };
  }
  
  private getColorForType(type: CalendarEventType): string {
    const colors: Record<CalendarEventType, string> = {
      'VIBEATHON': '#ff6b6b',
      'COURSE_LECTURE': '#4ecdc4',
      'LAB_SESSION': '#45b7d1',
      'OFFICE_HOURS': '#f9ca24',
      'EXAM': '#eb4d4b',
      'ASSIGNMENT_DUE': '#f39c12',
      'PROJECT_PRESENTATION': '#9b59b6',
      'STUDY_GROUP': '#3498db',
      'MENTORSHIP': '#2ecc71',
      'WORKSHOP': '#e67e22'
    };
    return colors[type] || '#95a5a6';
  }
  
  private getBackgroundColorForType(type: CalendarEventType): string {
    const color = this.getColorForType(type);
    return color + '20'; // Add 20% opacity
  }
  
  private generateVEvent(event: MasterCalendarEvent): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    let vevent = `
BEGIN:VEVENT
UID:${event.id}@nspfrnp.ai
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.startTime)}
DTEND:${formatDate(event.endTime)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
STATUS:${event.status}
`;
    
    if (event.recurring && event.recurrenceRule) {
      vevent += `RRULE:${event.recurrenceRule}\n`;
    }
    
    for (const minutes of event.reminders) {
      vevent += `BEGIN:VALARM
TRIGGER:-PT${minutes}M
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.title}
END:VALARM
`;
    }
    
    vevent += 'END:VEVENT\n';
    
    return vevent;
  }
  
  private async exportToICal(events: MasterCalendarEvent[], calendar: StudentCalendar): Promise<string> {
    let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NSPFRNP Student Calendar Export//EN
CALSCALE:GREGORIAN
X-WR-CALNAME:${calendar.studentName}'s Schedule Export
X-WR-TIMEZONE:${calendar.timezone}
`;
    
    for (const event of events) {
      ical += this.generateVEvent(event);
    }
    
    ical += 'END:VCALENDAR';
    
    return ical;
  }
  
  private exportToCSV(events: MasterCalendarEvent[]): string {
    const headers = 'Type,Title,Description,Location,Start,End,Course,Instructor,Status\n';
    const rows = events.map(e =>
      `"${e.type}","${e.title}","${e.description}","${e.location}","${e.startTime.toISOString()}","${e.endTime.toISOString()}","${e.courseCode || ''}","${e.instructor || ''}","${e.status}"`
    ).join('\n');
    
    return headers + rows;
  }
  
  private exportToPDF(events: MasterCalendarEvent[], calendar: StudentCalendar, range: { start: Date; end: Date }): string {
    // In production, use a PDF library like PDFKit
    // For now, return formatted text
    let pdf = `STUDENT SCHEDULE
Name: ${calendar.studentName}
Period: ${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}
Total Events: ${events.length}

`;
    
    events.forEach((e, i) => {
      pdf += `${i + 1}. ${e.title}
   Type: ${e.type}
   Date: ${e.startTime.toLocaleString()}
   Location: ${e.location}
   ${e.courseCode ? `Course: ${e.courseCode}` : ''}
   
`;
    });
    
    return pdf;
  }
}

// Export singleton
export const studentMasterCalendarSystem = new StudentMasterCalendarSystem();

// CLI testing
if (require.main === module) {
  (async () => {
    console.log('📅 Testing Student Master Calendar System...\n');
    
    // Initialize calendar
    const calendar = await studentMasterCalendarSystem.initializeCalendar(
      'STU-123',
      'Alex Johnson',
      'alex@university.edu',
      'America/Los_Angeles'
    );
    
    console.log('\n--- Adding Course Schedule ---\n');
    
    // Add full course schedule
    await studentMasterCalendarSystem.addCourseSchedule('STU-123', {
      courseCode: 'CS-401',
      courseName: 'Advanced Algorithms',
      college: 'BHEP',
      instructor: 'Dr. Smith',
      credits: 4,
      schedule: [
        {
          dayOfWeek: 1, // Monday
          startTime: '14:00',
          endTime: '15:30',
          location: 'Room 301',
          type: 'LECTURE'
        },
        {
          dayOfWeek: 3, // Wednesday
          startTime: '14:00',
          endTime: '15:30',
          location: 'Room 301',
          type: 'LECTURE'
        },
        {
          dayOfWeek: 5, // Friday
          startTime: '10:00',
          endTime: '12:00',
          location: 'Lab 205',
          type: 'LAB'
        }
      ],
      semesterStart: new Date(2026, 0, 15), // Jan 15, 2026
      semesterEnd: new Date(2026, 4, 15),   // May 15, 2026
      holidays: [
        new Date(2026, 1, 17), // President's Day
        new Date(2026, 2, 15)  // Spring Break
      ]
    });
    
    console.log('\n--- Generating Calendar Views ---\n');
    
    // Get week view
    const weekView = await studentMasterCalendarSystem.getCalendarView('STU-123', 'WEEK');
    console.log(`Week View: ${weekView.events.length} events`);
    console.log(`Date Range: ${weekView.dateRange.start.toLocaleDateString()} - ${weekView.dateRange.end.toLocaleDateString()}`);
    
    // Get agenda
    const agenda = await studentMasterCalendarSystem.getAgendaView('STU-123', 14);
    console.log(`\nAgenda (next 14 days): ${agenda.length} events`);
    
    console.log('\n--- Creating Subscription ---\n');
    
    // Create calendar subscription
    const subscription = await studentMasterCalendarSystem.createSubscription('STU-123', 'ICAL');
    console.log(`Subscribe to: ${subscription.url}`);
    
    console.log('\n--- Generating iCal Feed ---\n');
    
    // Generate iCal feed
    const icalFeed = await studentMasterCalendarSystem.generateICalFeed('STU-123', calendar.feedToken);
    console.log('iCal Feed (first 300 chars):');
    console.log(icalFeed.substring(0, 300) + '...');
    
    console.log('\n--- Exporting Calendar ---\n');
    
    // Export to CSV
    const csvExport = await studentMasterCalendarSystem.exportCalendar('STU-123', 'CSV');
    console.log('CSV Export (first 200 chars):');
    console.log(csvExport.content.substring(0, 200) + '...');
  })();
}
