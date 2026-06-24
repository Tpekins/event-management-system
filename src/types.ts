/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ORGANIZER = 'Organizer',
  HOST = 'Host',
  GUEST = 'Guest',
}

export enum EventStatus {
  DRAFT = 'Draft',
  OPEN = 'Open',
  FULL = 'Full',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum EventType {
  WORKSHOP = 'Workshop',
  TALK = 'Talk',
  NETWORKING = 'Networking',
  HACKATHON = 'Hackathon',
  PANEL = 'Panel',
}

export interface User {
  id: string; // email
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  profilePhoto: string; // base64
  location: string;
  bio: string;
  dateOfBirth: string;
  gender?: string;
  role: UserRole;
  
  // Role-specific extensions
  // Organizer fields
  organizationName?: string;
  website?: string;
  yearsExperience?: number;
  isVerified?: boolean;
  
  // Host fields
  title?: string;
  expertiseArea?: string;
  socialHandle?: string;
  speakingBio?: string;
  availabilityStatus?: 'Available' | 'Busy';
  
  // Guest fields
  jobTitle?: string;
  company?: string;
  interests?: string[];
  linkedinUrl?: string;
  dietaryPreference?: string;
  tShirtSize?: string;
}

export interface EventAnnouncement {
  id: string;
  eventId: string;
  hostId: string;
  content: string;
  createdAt: number;
}

export interface GuestCheckIn {
  guestId: string;
  checkedIn: boolean;
  timestamp?: number;
}

export interface Event {
  id: string;
  name: string;
  organizerId: string;
  startDateTime: number;
  endDateTime: number;
  location: {
    venue: string;
    address: string;
  };
  type: EventType;
  description: string;
  maxCapacity: number;
  coverImage: string; // base64
  tags: string[];
  hostIds: string[];
  status: EventStatus;
  rsvps: string[]; // guestIds
  checkIns: GuestCheckIn[];
  announcements: EventAnnouncement[];
}
