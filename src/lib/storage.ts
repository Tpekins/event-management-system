/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Event, UserRole } from './types.ts';

const USERS_KEY = 'nexus_users';
const EVENTS_KEY = 'nexus_events';
const SESSION_KEY = 'nexus_session';

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  
  getEvents: (): Event[] => {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveEvents: (events: Event[]) => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },
  
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    const session = JSON.parse(data);
    const users = storage.getUsers();
    return users.find(u => u.email === session.email) || null;
  },
  
  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email }));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }
};
