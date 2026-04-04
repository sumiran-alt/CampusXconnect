'use client';

import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Hash, TrendingUp } from 'lucide-react';

interface Community {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon?: string;
  memberCount: number;
  stats: { totalPosts: number; totalComments: number };
}

interface CommunityPost {
  _id: string;
  title: string;
  content: string;
  author: { name: string; profilePicture: string };
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  type: 'discussion' | 'question' | 'resource';
}

export const CommunityCard: React.FC<{ community: Community; onJoin?: () => void }> = ({
  community,
  onJoin,
}) => {
  const [joined, setJoined] = useState(false);

  const handleJoin = async () => {
    setJoined(true);
    if (onJoin) onJoin();
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{community.name}</h3>
          <p className="text-gray-600 text-sm">{community.description}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
          {community.category}
        </span>
      </div>

      <div className="flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Users size={16} />
          {community.memberCount} members
        </div>
        <div className="flex items-center gap-1">
          <Hash size={16} />
          {community.stats.totalPosts} posts
        </div>
      </div>

      <button
        onClick={handleJoin}
        disabled={joined}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          joined
            ? 'bg-green-100 text-green-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {joined ? 'Joined' : 'Join Community'}
      </button>
    </div>
  );
};

export const CommunityPostCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-700 font-medium">{post.author.name}</span>
          </div>
        </div>
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
          {post.type}
        </span>
      </div>

      <p className="text-gray-600 line-clamp-3">{post.content}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex gap-4 text-sm text-gray-600">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1 transition ${liked ? 'text-red-600' : ''}`}
          >
            ❤️ {post.likesCount}
          </button>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            {post.commentsCount}
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export const CommunitiesBrowser: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const url = selectedCategory
          ? `/api/communities?category=${selectedCategory}`
          : '/api/communities';
        const response = await fetch(url);
        const data = await response.json();
        setCommunities(data.communities || []);
      } catch (error) {
        console.error('Failed to fetch communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [selectedCategory]);

  const categories = [
    'ai_ml',
    'web_dev',
    'mobile_dev',
    'competitive_programming',
    'startups',
    'other',
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'all' ? '' : cat)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
              selectedCategory === cat || (!selectedCategory && cat === 'all')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading communities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <CommunityCard key={community._id} community={community} />
          ))}
        </div>
      )}
    </div>
  );
};
