/**
 * State Management Sederhana SPLASH
 */

import { getCurrentUser } from './services/storage.js';

class AppState {
  constructor() {
    this.user = getCurrentUser();
    this.previewAsStudent = false; // Mode guru pratinjau sebagai siswa
    this.listeners = [];
  }

  setUser(user) {
    this.user = user;
    this.notify();
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.user;
  }

  isTeacher() {
    return this.user && this.user.role === 'guru';
  }

  isStudent() {
    return this.user && this.user.role === 'siswa';
  }

  setPreviewMode(enabled) {
    this.previewAsStudent = enabled;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this));
  }
}

export const appState = new AppState();
