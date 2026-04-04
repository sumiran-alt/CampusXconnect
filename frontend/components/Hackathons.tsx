'use client';

import React, { useState, useEffect } from 'react';
import { Users, Trophy, Calendar, MapPin, ExternalLink } from 'lucide-react';

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  prizePool?: { totalAmount: number };
  registeredTeams: any[];
  maxTeamSize: number;
  status: 'upcoming' | 'registration' | 'ongoing' | 'judging' | 'completed';
}

export const HackathonCard: React.FC<{ hackathon: Hackathon; onRegister?: () => void }> = ({
  hackathon,
  onRegister,
}) => {
  const [registered, setRegistered] = useState(false);

  const handleRegister = async () => {
    setRegistered(true);
    if (onRegister) onRegister();
  };

  const daysUntilStart = Math.ceil(
    (new Date(hackathon.startDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'registration':
        return 'bg-purple-100 text-purple-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{hackathon.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{hackathon.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(hackathon.status)}`}>
          {hackathon.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={18} />
          {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={18} />
          {hackathon.location}
        </div>
        {hackathon.prizePool?.totalAmount && (
          <div className="flex items-center gap-2">
            <Trophy size={18} />
            Prize Pool: ₹{hackathon.prizePool.totalAmount.toLocaleString()}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <Users size={16} className="inline mr-1" />
          {hackathon.registeredTeams.length} teams registered
        </div>
        <button
          onClick={handleRegister}
          disabled={registered}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            registered
              ? 'bg-green-100 text-green-600'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {registered ? 'Registered' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

export const HackathonGallery: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch('/api/hackathons?status=upcoming');
        const data = await response.json();
        setHackathons(data.hackathons || []);
      } catch (error) {
        console.error('Failed to fetch hackathons');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  if (loading) return <div className="text-center py-8">Loading hackathons...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon._id} hackathon={hackathon} />
      ))}
    </div>
  );
};
