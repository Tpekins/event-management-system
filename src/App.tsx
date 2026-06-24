/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  UserRole, 
  Event, 
  EventType, 
  EventStatus, 
  EventAnnouncement 
} from './types.ts';
import { storage } from './lib/storage.ts';
import { aiService } from './lib/ai.ts';
import { 
  Plus, 
  LogOut, 
  Calendar, 
  Users, 
  User as UserIcon, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Bell, 
  Sparkles, 
  Download, 
  MapPin, 
  Clock, 
  Tag,
  Briefcase,
  Globe,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- UI COMPONENTS ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}: any) => {
  const baseStyles = "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700",
    outline: "bg-transparent border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-400",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-500 hover:text-slate-200",
    danger: "bg-red-600 hover:bg-red-500 text-white"
  };
  
  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, className = "", required = false }: any) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
    <input 
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-600 text-sm"
    />
  </div>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'info', className = "" }: any) => {
  const variants: any = {
    info: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-900/50 text-emerald-400 border-emerald-500",
    warning: "bg-amber-900/10 text-amber-400 border-amber-900/50",
    danger: "bg-red-900/10 text-red-400 border-red-900/50",
    role: "bg-blue-900 text-blue-400 border-blue-600"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- AUTH PAGES ---

const SignupPage = ({ onSignup, onSwitch }: any) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', role: UserRole.GUEST,
    phoneNumber: '', city: '', bio: '', dob: '', profilePhoto: ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Join Silicon Mountain</h1>
          <p className="text-slate-400">Scale your tech conference experience</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">I am a...</label>
            <div className="flex gap-2">
              {Object.values(UserRole).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    formData.role === role 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <Input label="Full Name" value={formData.fullName} onChange={(e: any) => setFormData({...formData, fullName: e.target.value})} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} required />
          <Input label="Password" type="password" value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} required />
          <Input label="Phone" type="tel" value={formData.phoneNumber} onChange={(e: any) => setFormData({...formData, phoneNumber: e.target.value})} />
          <Input label="City" value={formData.city} onChange={(e: any) => setFormData({...formData, city: e.target.value})} />
          <Input label="Date of Birth" type="date" value={formData.dob} onChange={(e: any) => setFormData({...formData, dob: e.target.value})} />
          
          {formData.role === UserRole.GUEST && (
            <Input 
              label="Interests (Comma separated)" 
              placeholder="AI, Web3, Design..."
              onChange={(e: any) => setFormData({...formData, interests: e.target.value.split(',').map((s: string) => s.trim())})} 
              className="md:col-span-2"
            />
          )}

          <div className="md:col-span-2">
            <Input label="Bio" placeholder="Tech enthusiast, serial speaker..." value={formData.bio} onChange={(e: any) => setFormData({...formData, bio: e.target.value})} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500" />
            {formData.profilePhoto && (
              <img src={formData.profilePhoto} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-blue-600" />
            )}
          </div>

          <div className="md:col-span-2 pt-4">
            <Button type="submit" className="w-full">Create Account</Button>
            <p className="mt-4 text-center text-slate-400 text-sm">
              Already have an account? <button type="button" onClick={onSwitch} className="text-blue-400 hover:underline">Login</button>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

const LoginPage = ({ onLogin, onSwitch }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] rotate-3">
              <Calendar className="text-white w-10 h-10 -rotate-3" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Silicon Mountain Login</h1>
          <p className="text-slate-400">Welcome back to the hub</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe} 
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-blue-600"
            />
            <label htmlFor="remember" className="text-sm text-slate-400 select-none">Remember Me</label>
          </div>

          <Button type="submit" className="w-full h-12 text-lg">Sign In</Button>
          
          <p className="text-center text-slate-400 text-sm">
            New here? <button type="button" onClick={onSwitch} className="text-blue-400 hover:underline">Create an account</button>
          </p>
        </form>
      </Card>
    </div>
  );
};

// --- DASHBOARDS ---

const OrganizerDashboard = ({ user, events, setEvents, allUsers }: any) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: '', type: EventType.TALK, status: EventStatus.OPEN, 
    tags: [], hostIds: [], maxCapacity: 100, description: '',
    startDateTime: Date.now(), endDateTime: Date.now() + 3600000,
    coverImage: '', location: { venue: '', address: '' }
  });
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const organizerEvents = events.filter((e: Event) => e.organizerId === user.email);
  const hosts = allUsers.filter((u: User) => u.role === UserRole.HOST);

  const handleCreateEvent = () => {
    if (!newEvent.name) return;
    const event: Event = {
      ...newEvent as any,
      id: Math.random().toString(36).substr(2, 9),
      organizerId: user.email,
      rsvps: [],
      checkIns: [],
      announcements: []
    };
    setEvents([...events, event]);
    setShowCreateModal(false);
    setNewEvent({
      name: '', type: EventType.TALK, status: EventStatus.OPEN, 
      tags: [], hostIds: [], maxCapacity: 100, description: '',
      startDateTime: Date.now(), endDateTime: Date.now() + 3600000,
      coverImage: '', location: { venue: '', address: '' }
    });
  };

  const handleAiDescription = async () => {
    if (!newEvent.name) return;
    setIsAiGenerating(true);
    const desc = await aiService.generateEventDescription(newEvent.name || '', newEvent.type || '', newEvent.tags || []);
    setNewEvent({ ...newEvent, description: desc });
    setIsAiGenerating(false);
  };

  const exportGuestList = (event: Event) => {
    const guests = allUsers.filter((u: User) => event.rsvps.includes(u.email));
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Check-in Status\n"
      + guests.map(g => {
          const ci = event.checkIns.find(c => c.guestId === g.email);
          return `${g.fullName},${g.email},${ci?.checkedIn ? 'Checked In' : 'Registered'}`;
        }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.name}_guests.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e: Event) => e.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Organizer Dashboard</h2>
          <p className="text-slate-400">Managing {user.organizationName || 'Nexus'} Excellence</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5" />
          New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Total Events</p>
            <h3 className="text-3xl font-extrabold text-white">{organizerEvents.length}</h3>
          </div>
        </Card>
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Experience</p>
            <h3 className="text-3xl font-extrabold text-white">{user.yearsExperience || 0} Years</h3>
          </div>
        </Card>
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Verification</p>
            <h3 className="text-3xl font-extrabold text-white">{user.isVerified ? 'VERIFIED' : 'PENDING'}</h3>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          Your Events
          <span className="text-sm font-normal text-slate-500">({organizerEvents.length})</span>
        </h3>
        {organizerEvents.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 italic">
            No events created yet. Launch your first one!
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {organizerEvents.map((event: Event) => (
              <Card key={event.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-700 transition-colors">
                <div className="flex gap-4 items-center">
                  {event.coverImage ? (
                    <img src={event.coverImage} className="w-20 h-20 rounded-lg object-cover shadow-lg border border-slate-800" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={event.status === EventStatus.OPEN ? 'success' : 'info'}>{event.status}</Badge>
                      <Badge variant="role">{event.type}</Badge>
                    </div>
                    <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{event.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location.venue}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.rsvps.length} / {event.maxCapacity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="secondary" className="flex-1 md:flex-none" onClick={() => exportGuestList(event)}>
                    <Download className="w-4 h-4" /> Guest List
                  </Button>
                  <Button variant="danger" className="flex-1 md:flex-none" onClick={() => deleteEvent(event.id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 w-full max-w-3xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Create New Event</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white"><LogOut className="rotate-180" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Event Name" value={newEvent.name} onChange={(e: any) => setNewEvent({...newEvent, name: e.target.value})} className="md:col-span-2" />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</label>
                  <select 
                    value={newEvent.type} 
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <Input label="Max Capacity" type="number" value={newEvent.maxCapacity} onChange={(e: any) => setNewEvent({...newEvent, maxCapacity: parseInt(e.target.value)})} />
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags</label>
                  <div className="flex gap-2">
                    <input 
                      id="tag-input"
                      placeholder="AI, Startup, Web3..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none"
                    />
                    <Button 
                      variant="secondary"
                      onClick={() => {
                        const input = document.getElementById('tag-input') as HTMLInputElement;
                        if (input.value && !newEvent.tags?.includes(input.value)) {
                          setNewEvent({...newEvent, tags: [...(newEvent.tags || []), input.value]});
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newEvent.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-600/20 border border-blue-600/50 rounded-md text-[10px] text-blue-400 flex items-center gap-1 font-bold">
                        {tag}
                        <button onClick={() => setNewEvent({...newEvent, tags: newEvent.tags?.filter(t => t !== tag)})} className="hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <Input label="Venue" value={newEvent.location?.venue} onChange={(e: any) => setNewEvent({...newEvent, location: { ...newEvent.location as any, venue: e.target.value }})} />
                <Input label="Address" value={newEvent.location?.address} onChange={(e: any) => setNewEvent({...newEvent, location: { ...newEvent.location as any, address: e.target.value }})} />
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cover Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewEvent({ ...newEvent, coverImage: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-100 hover:file:bg-slate-700" 
                  />
                  {newEvent.coverImage && (
                    <img src={newEvent.coverImage} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-slate-800" />
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">AI Description Generator</label>
                    <button 
                      onClick={handleAiDescription}
                      disabled={isAiGenerating || !newEvent.name}
                      className="text-[11px] text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors uppercase font-bold tracking-widest disabled:opacity-30"
                    >
                      <Sparkles className="w-3 h-3" /> {isAiGenerating ? 'AI Thinking...' : 'AI Generate'}
                    </button>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-blue-600">
                    <textarea 
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Tell attendees what to expect..."
                      className="w-full bg-transparent text-slate-300 focus:outline-none min-h-[100px] text-sm"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assign Hosts</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {hosts.map((host: User) => (
                      <label key={host.email} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${newEvent.hostIds?.includes(host.email) ? 'bg-blue-600/10 border-blue-600/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                        <input 
                          type="checkbox" 
                          checked={newEvent.hostIds?.includes(host.email)} 
                          onChange={(e) => {
                            const newHosts = e.target.checked 
                              ? [...(newEvent.hostIds || []), host.email]
                              : (newEvent.hostIds || []).filter(h => h !== host.email);
                            setNewEvent({...newEvent, hostIds: newHosts});
                          }}
                          className="hidden"
                        />
                        <img src={host.profilePhoto || 'https://via.placeholder.com/150'} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs text-white font-medium">{host.fullName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2 mt-2">
                  <Button onClick={handleCreateEvent} className="w-full">Create Event</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HostDashboard = ({ user, events, setEvents, allUsers }: any) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const assignedEvents = events.filter((e: Event) => e.hostIds.includes(user.email));
  const [suggestingAnnounceFor, setSuggestingAnnounceFor] = useState<string | null>(null);

  const handlePostAnnouncement = async (eventId: string, topic: string) => {
    if (!topic) return;
    setSuggestingAnnounceFor(eventId);
    const content = await aiService.suggestAnnouncement(events.find((e: any) => e.id === eventId)?.name || '', topic);
    
    const newEvents = events.map((e: Event) => {
      if (e.id === eventId) {
        const ann: EventAnnouncement = {
          id: Math.random().toString(36).substr(2, 9),
          eventId,
          hostId: user.email,
          content,
          createdAt: Date.now()
        };
        return { ...e, announcements: [ann, ...e.announcements] };
      }
      return e;
    });
    setEvents(newEvents);
    setSuggestingAnnounceFor(null);
  };

  const toggleCheckIn = (eventId: string, guestId: string) => {
    const newEvents = events.map((e: Event) => {
      if (e.id === eventId) {
        const existing = e.checkIns.find(c => c.guestId === guestId);
        let newCheckIns;
        if (existing) {
          newCheckIns = e.checkIns.map(c => c.guestId === guestId ? { ...c, checkedIn: !c.checkedIn, timestamp: Date.now() } : c);
        } else {
          newCheckIns = [...e.checkIns, { guestId, checkedIn: true, timestamp: Date.now() }];
        }
        return { ...e, checkIns: newCheckIns };
      }
      return e;
    });
    setEvents(newEvents);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Host Dashboard</h2>
        <p className="text-slate-400">{user.title || 'Master of Ceremony'} | {user.expertiseArea}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['upcoming', 'active', 'past'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-all border ${
              activeTab === tab ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
        <div className={`p-2 rounded-lg border text-center ${user.availabilityStatus === 'Available' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          <span className="text-xs font-bold uppercase tracking-widest">{user.availabilityStatus}</span>
        </div>
      </div>

      <div className="space-y-6">
        {assignedEvents.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 italic">No assigned events. Check your availability!</Card>
        ) : (
          assignedEvents.map((event: Event) => (
            <Card key={event.id} className="p-6 space-y-6 border-l-4 border-l-blue-600">
               <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{event.name}</h4>
                    <p className="text-slate-400 flex items-center gap-1 text-sm"><MapPin className="w-3 h-3" /> {event.location.venue}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Badge variant="info">{event.type}</Badge>
                   <Badge variant="success">{event.checkIns.filter(c => c.checkedIn).length} Checked In</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CHECK-IN LIST */}
                <div className="space-y-4">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" /> 
                    Guest Check-in 
                    <span className="text-xs text-slate-500 font-normal">({event.rsvps.length} RSVP'd)</span>
                  </h5>
                  <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-2 max-h-[300px] overflow-y-auto no-scrollbar divide-y divide-slate-800">
                    {event.rsvps.length === 0 ? (
                      <p className="p-4 text-sm text-slate-600 italic">No RSVPs yet.</p>
                    ) : (
                      event.rsvps.map(guestId => {
                        const guest = allUsers.find((u: User) => u.email === guestId);
                        const isCheckedIn = event.checkIns.find(c => c.guestId === guestId)?.checkedIn;
                        return (
                          <div key={guestId} className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                               <img src={guest?.profilePhoto || 'https://via.placeholder.com/150'} className="w-8 h-8 rounded-full object-cover contrast-125" />
                               <div>
                                 <p className="text-sm font-semibold text-white">{guest?.fullName || guestId}</p>
                                 <p className="text-[10px] text-slate-500 uppercase tracking-tight">{guest?.jobTitle || 'Attendee'}</p>
                               </div>
                            </div>
                            <button 
                              onClick={() => toggleCheckIn(event.id, guestId)}
                              className={`p-1.5 rounded-full border transition-all ${isCheckedIn ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-white'}`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* ANNOUNCEMENTS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      Announcements
                    </h5>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      id={`ann-${event.id}`}
                      placeholder="What's the update?"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
                    />
                    <Button 
                      onClick={() => {
                        const val = (document.getElementById(`ann-${event.id}`) as HTMLInputElement).value;
                        handlePostAnnouncement(event.id, val);
                        (document.getElementById(`ann-${event.id}`) as HTMLInputElement).value = '';
                      }}
                      disabled={suggestingAnnounceFor === event.id}
                      className="!p-2"
                    >
                      {suggestingAnnounceFor === event.id ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar">
                    {event.announcements.length === 0 ? (
                       <p className="text-sm text-slate-600 italic">No announcements posted yet.</p>
                    ) : (
                      event.announcements.map((ann: EventAnnouncement) => (
                        <div key={ann.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 relative group">
                          <p className="text-sm text-slate-200 pr-4">{ann.content}</p>
                          <span className="text-[10px] text-slate-600 block mt-1">{new Date(ann.createdAt).toLocaleTimeString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const GuestDashboard = ({ user, events, setEvents }: any) => {
  const [filter, setFilter] = useState({ type: 'All', search: '' });
  const [pitchingFor, setPitchingFor] = useState<string | null>(null);
  const [pitches, setPitches] = useState<Record<string, string>>({});

  const filteredEvents = events.filter((e: Event) => {
    const matchesSearch = e.name.toLowerCase().includes(filter.search.toLowerCase()) || 
                          e.description.toLowerCase().includes(filter.search.toLowerCase());
    const matchesType = filter.type === 'All' || e.type === filter.type;
    return matchesSearch && matchesType && e.status !== EventStatus.DRAFT;
  });

  const myRsvps = events.filter((e: Event) => e.rsvps.includes(user.email));

  const toggleRsvp = (eventId: string) => {
    const newEvents = events.map((e: Event) => {
      if (e.id === eventId) {
        const isRsvpd = e.rsvps.includes(user.email);
        const newRsvps = isRsvpd ? e.rsvps.filter(id => id !== user.email) : [...e.rsvps, user.email];
        return { ...e, rsvps: newRsvps };
      }
      return e;
    });
    setEvents(newEvents);
  };

  const getPitch = async (event: Event) => {
    setPitchingFor(event.id);
    const pitch = await aiService.generateAttendPitch(event.name, event.description, user.interests || []);
    setPitches({ ...pitches, [event.id]: pitch });
    setPitchingFor(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight uppercase tracking-tighter">Event Portal</h2>
          <p className="text-blue-400 font-mono text-sm tracking-widest">{user.jobTitle || 'Attendee'} @ {user.company || 'Innovator'}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              placeholder="Search tech vibes..."
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <select 
             value={filter.type} 
             onChange={(e) => setFilter({...filter, type: e.target.value})}
             className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Types</option>
            {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* MY RSVPS */}
      {myRsvps.length > 0 && (
         <div className="space-y-6">
           <h3 className="text-xl font-bold text-white flex items-center gap-3">
             <div className="w-10 h-1 bg-blue-600"></div>
             Active Reservations
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {myRsvps.map((event: Event) => (
                <Card key={event.id} className="p-0 border-blue-500/30 ring-1 ring-blue-500/20 bg-blue-600/5">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="success">Confirmed RSVP</Badge>
                      <button onClick={() => toggleRsvp(event.id)} className="text-xs text-red-500 hover:underline">Cancel</button>
                    </div>
                    <h4 className="text-xl font-bold text-white leading-tight">{event.name}</h4>
                    <div className="space-y-2 text-xs text-slate-400">
                      <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(event.startDateTime).toLocaleDateString()}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {event.location.venue}</p>
                    </div>

                    {event.announcements.length > 0 && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-1">
                        <p className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-1"><Bell className="w-3 h-3" /> Latest Announcement</p>
                        <p className="text-xs text-slate-200">{event.announcements[0].content}</p>
                      </div>
                    )}
                  </div>
                </Card>
             ))}
           </div>
         </div>
      )}

      {/* BROWSE */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-1 bg-slate-700"></div>
          Discovery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event: Event) => {
            const isRsvpd = event.rsvps.includes(user.email);
            return (
              <Card key={event.id} className="flex flex-col group hover:border-blue-500/50 transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  {event.coverImage ? (
                    <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-700">
                      <Calendar className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="role" className="!bg-black/60 !backdrop-blur-md">{event.type}</Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
                    <h4 className="text-lg font-bold text-white leading-tight">{event.name}</h4>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">#{tag}</span>)}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                     {pitches[event.id] ? (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="p-4 bg-slate-800 border-l-4 border-blue-600 rounded-xl"
                       >
                         <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1 mb-2"><Sparkles className="w-3 h-3" /> Personalized Pitch</p>
                         <p className="text-xs text-slate-300 italic leading-relaxed">"{pitches[event.id]}"</p>
                       </motion.div>
                     ) : (
                       <button 
                         onClick={() => getPitch(event)}
                         disabled={pitchingFor === event.id}
                         className="text-[11px] text-slate-500 flex items-center gap-1 hover:text-blue-400 transition-colors uppercase font-bold tracking-widest disabled:opacity-30"
                       >
                         <Sparkles className="w-3 h-3" /> {pitchingFor === event.id ? 'Analyzing...' : 'Should I attend?'}
                       </button>
                     )}

                     <Button 
                       variant={isRsvpd ? 'secondary' : 'primary'} 
                       className="w-full"
                       onClick={() => toggleRsvp(event.id)}
                     >
                       {isRsvpd ? 'RSVP Confirmed' : 'RSVP Now'}
                     </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- PROFILE COMPONENT ---

const ProfileEditor = ({ user, onSave }: any) => {
  const [formData, setFormData] = useState({ ...user });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom duration-500">
      <div className="md:col-span-2 flex items-center gap-6 pb-6 border-b border-slate-800">
        <div className="relative group">
          <img src={formData.profilePhoto || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-2xl object-cover ring-2 ring-blue-600/50 ring-offset-4 ring-offset-slate-950" />
          <div className="absolute -top-2 -right-2">
            <Badge variant="role">{user.role}</Badge>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{user.fullName}</h2>
          <p className="text-slate-500 font-mono">{user.email}</p>
        </div>
      </div>

      <Input label="Full Name" value={formData.fullName} onChange={(e: any) => setFormData({...formData, fullName: e.target.value})} />
      <Input label="Phone" value={formData.phoneNumber} onChange={(e: any) => setFormData({...formData, phoneNumber: e.target.value})} />
      <Input label="Location" value={formData.location} onChange={(e: any) => setFormData({...formData, location: e.target.value})} />
      <Input label="Bio" value={formData.bio} onChange={(e: any) => setFormData({...formData, bio: e.target.value})} />
      
      {user.role === UserRole.ORGANIZER && (
        <>
          <Input label="Organization" value={formData.organizationName} onChange={(e: any) => setFormData({...formData, organizationName: e.target.value})} />
          <Input label="Website" value={formData.website} onChange={(e: any) => setFormData({...formData, website: e.target.value})} />
        </>
      )}

      {user.role === UserRole.HOST && (
        <>
          <Input label="Title" value={formData.title} onChange={(e: any) => setFormData({...formData, title: e.target.value})} />
          <Input label="Expertise" value={formData.expertiseArea} onChange={(e: any) => setFormData({...formData, expertiseArea: e.target.value})} />
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Speaking Bio</label>
            <textarea 
              value={formData.speakingBio} 
              onChange={(e) => setFormData({...formData, speakingBio: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none min-h-[100px] mt-1"
            />
          </div>
        </>
      )}

      {user.role === UserRole.GUEST && (
        <>
          <Input label="Job Title" value={formData.jobTitle} onChange={(e: any) => setFormData({...formData, jobTitle: e.target.value})} />
          <Input label="Company" value={formData.company} onChange={(e: any) => setFormData({...formData, company: e.target.value})} />
          <Input label="LinkedIn" value={formData.linkedinUrl} onChange={(e: any) => setFormData({...formData, linkedinUrl: e.target.value})} />
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interests (Comma separated)</label>
            <input 
              value={formData.interests?.join(', ')} 
              onChange={(e) => setFormData({...formData, interests: e.target.value.split(',').map(s => s.trim())})}
              placeholder="AI, Web3, Design..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dietary Preference</label>
            <select 
              value={formData.dietaryPreference} 
              onChange={(e) => setFormData({...formData, dietaryPreference: e.target.value})}
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-100"
            >
              {['None', 'Veg', 'Vegan', 'Halal'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">T-Shirt Size</label>
            <select 
              value={formData.tShirtSize} 
              onChange={(e) => setFormData({...formData, tShirtSize: e.target.value})}
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-100"
            >
              {['XS', 'S', 'M', 'L', 'XL'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </>
      )}

      <div className="md:col-span-2 pt-6">
        <Button onClick={() => onSave(formData)} className="w-full">Update Profile</Button>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<'login' | 'signup' | 'dashboard' | 'profile'>('login');
  
  useEffect(() => {
    const storedUsers = storage.getUsers();
    setUsers(storedUsers);
    setEvents(storage.getEvents());
    
    const session = storage.getCurrentUser();
    if (session) {
      setCurrentUser(session);
      setPage('dashboard');
    }
  }, []);

  useEffect(() => {
    storage.saveUsers(users);
  }, [users]);

  useEffect(() => {
    storage.saveEvents(events);
  }, [events]);

  const handleSignup = (data: any) => {
    if (users.some(u => u.email === data.email)) {
      alert('Email already exists');
      return;
    }
    const newUser = { ...data, id: data.email };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    storage.setSession(newUser);
    setPage('dashboard');
  };

  const handleLogin = (email: string, pass: string, remember: boolean) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      if (remember) storage.setSession(user);
      setPage('dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storage.setSession(null);
    setPage('login');
  };

  const updateProfile = (data: User) => {
    const newUsers = users.map(u => u.email === data.email ? data : u);
    setUsers(newUsers);
    setCurrentUser(data);
    alert('Profile updated successfully');
  };

  if (!currentUser) {
    return page === 'signup' 
      ? <SignupPage onSignup={handleSignup} onSwitch={() => setPage('login')} />
      : <LoginPage onLogin={handleLogin} onSwitch={() => setPage('signup')} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-600/30">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-right border-slate-800 flex flex-col p-6 hidden lg:flex">
        <div className="mb-10">
          <div className="text-2xl font-extrabold text-blue-500 tracking-tighter flex items-center gap-2 italic">
            KMER<span className="text-white">.TECH</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setPage('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              page === 'dashboard' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${page === 'dashboard' ? 'bg-blue-600/10' : 'bg-slate-800'}`}>
              <Calendar className="w-4 h-4" />
            </div>
            Dashboard
          </button>
          
          <button 
            onClick={() => setPage('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              page === 'profile' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${page === 'profile' ? 'bg-blue-600/10' : 'bg-slate-800'}`}>
              <UserIcon className="w-4 h-4" />
            </div>
            Profile
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <img src={currentUser.profilePhoto || 'https://via.placeholder.com/150'} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-600" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{currentUser.fullName}</p>
              <Badge variant="role" className="text-[9px] !px-2 !py-0">{currentUser.role.toUpperCase()}</Badge>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE NAV (Bottom Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 h-16 flex items-center justify-around lg:hidden z-50">
        <button onClick={() => setPage('dashboard')} className={page === 'dashboard' ? 'text-blue-500' : 'text-slate-500'}><Calendar /></button>
        <button onClick={() => setPage('profile')} className={page === 'profile' ? 'text-blue-500' : 'text-slate-500'}><UserIcon /></button>
        <button onClick={handleLogout} className="text-slate-500"><LogOut /></button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* MOBILE TOP BAR */}
        <header className="lg:hidden h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
          <div className="text-xl font-bold text-blue-500 italic">KMER.TECH</div>
          <img src={currentUser.profilePhoto || 'https://via.placeholder.com/150'} className="w-8 h-8 rounded-full border border-slate-700" />
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
          <div className="max-w-6xl mx-auto">
             {page === 'dashboard' && (
               <>
                 {currentUser.role === UserRole.ORGANIZER && <OrganizerDashboard user={currentUser} events={events} setEvents={setEvents} allUsers={users} />}
                 {currentUser.role === UserRole.HOST && <HostDashboard user={currentUser} events={events} setEvents={setEvents} allUsers={users} />}
                 {currentUser.role === UserRole.GUEST && <GuestDashboard user={currentUser} events={events} setEvents={setEvents} />}
               </>
             )}
             
             {page === 'profile' && (
               <div className="max-w-3xl">
                  <h2 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Profile Settings</h2>
                  <Card className="p-8">
                    <ProfileEditor user={currentUser} onSave={updateProfile} />
                  </Card>
               </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
}
