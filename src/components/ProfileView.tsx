import React, { useState } from 'react';
import { User, Project } from '../types';
import { UserContact } from '../types';
import { 
  Award, 
  Github, 
  Mail, 
  Sparkles, 
  Edit3, 
  Check, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  allProjects: Project[];
  onUpdateProfile: (updated: Partial<User>) => void;
  onViewProject: (project: Project) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  allProjects,
  onUpdateProfile,
  onViewProject
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [blurb, setBlurb] = useState(user.blurb || '');
  const [github, setGithub] = useState(user.github || '');
  const [contactType, setContactType] = useState<UserContact['type']>(user.contact?.type || 'discord');
  const [contactHandle, setContactHandle] = useState(user.contact?.handle || '');

  const myPostedProjects = allProjects.filter((p) => p.owner.id === user.id);
  const myContributedProjects = allProjects.filter((p) => p.contributorIds.includes(user.id));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      blurb: blurb.trim(),
      github: github.trim() || undefined,
      contact: {
        type: contactType,
        handle: contactHandle.trim()
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-zinc-100 shadow-xs"
            />
            <div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{user.name}</h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">@{user.handle}</p>
              {user.github && (
                <a
                  href={`https://github.com/${user.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>github.com/{user.github}</span>
                </a>
              )}
            </div>
          </div>

          <button
            id="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Close Edit' : 'Edit Blurb'}</span>
          </button>
        </div>

        {/* Blurb */}
        {!isEditing ? (
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100/90 text-xs sm:text-sm text-zinc-700 leading-relaxed">
            <p className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider mb-1">
              One-Line Builder Blurb
            </p>
            <p>{user.blurb || 'No blurb added yet.'}</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">One-line Blurb</label>
              <input
                type="text"
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                placeholder="What do you like building?"
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">GitHub Username</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="yourgithub"
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Default Contact App</label>
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value as UserContact['type'])}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-white font-medium"
                >
                  <option value="discord">Discord</option>
                  <option value="telegram">Telegram</option>
                  <option value="x">X / Twitter</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Contact Handle</label>
                <input
                  type="text"
                  value={contactHandle}
                  onChange={(e) => setContactHandle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 rounded-lg hover:bg-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-profile-btn"
                className="px-4 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Contributed Projects Section */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
            Contributions ({myContributedProjects.length})
          </h3>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Real projects where the owner confirmed you shipped or helped out!
        </p>

        {myContributedProjects.length === 0 ? (
          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              No contributions marked yet. Once an owner marks you as a contributor after swapping contacts, it will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {myContributedProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onViewProject(proj)}
                className="p-3.5 rounded-2xl border border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-50/50 cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-zinc-900">{proj.title}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Shipped
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Owner: {proj.owner.name} • {proj.commitment}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Posted Projects Section */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
            Projects Posted ({myPostedProjects.length})
          </h3>
        </div>

        {myPostedProjects.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No projects posted yet.</p>
        ) : (
          <div className="space-y-2">
            {myPostedProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onViewProject(proj)}
                className="p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-zinc-800">{proj.title}</p>
                  <p className="text-[11px] text-zinc-400">{proj.commitment}</p>
                </div>
                <span className="text-xs text-blue-600 font-semibold">View</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
