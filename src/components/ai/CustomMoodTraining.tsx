'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Plus, 
  Trash2, 
  RefreshCw,
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Track } from '@/lib/types';

interface CustomMoodCategory {
  id: string;
  name: string;
  description: string;
  audioFeatures: {
    valence: { min: number; max: number };
    energy: { min: number; max: number };
    danceability: { min: number; max: number };
    acousticness: { min: number; max: number };
  };
  examples: Track[];
  color: string;
}

interface CustomMoodTrainingProps {
  tracks: Track[];
  onCategoriesChange: (categories: CustomMoodCategory[]) => void;
}

const defaultMoodCategories: CustomMoodCategory[] = [
  {
    id: 'euphoric',
    name: 'Euphoric',
    description: 'High energy, highly positive tracks that make you feel on top of the world',
    audioFeatures: {
      valence: { min: 0.8, max: 1.0 },
      energy: { min: 0.7, max: 1.0 },
      danceability: { min: 0.6, max: 1.0 },
      acousticness: { min: 0.0, max: 0.3 }
    },
    examples: [],
    color: '#FFD700'
  },
  {
    id: 'melancholic',
    name: 'Melancholic',
    description: 'Low energy, emotional tracks perfect for introspection',
    audioFeatures: {
      valence: { min: 0.0, max: 0.3 },
      energy: { min: 0.0, max: 0.4 },
      danceability: { min: 0.0, max: 0.5 },
      acousticness: { min: 0.3, max: 1.0 }
    },
    examples: [],
    color: '#6B73FF'
  },
  {
    id: 'pump-up',
    name: 'Pump Up',
    description: 'High energy tracks that motivate and energize',
    audioFeatures: {
      valence: { min: 0.5, max: 1.0 },
      energy: { min: 0.8, max: 1.0 },
      danceability: { min: 0.7, max: 1.0 },
      acousticness: { min: 0.0, max: 0.2 }
    },
    examples: [],
    color: '#FF6B6B'
  },
  {
    id: 'chill',
    name: 'Chill Vibes',
    description: 'Relaxed, laid-back tracks for unwinding',
    audioFeatures: {
      valence: { min: 0.4, max: 0.7 },
      energy: { min: 0.2, max: 0.5 },
      danceability: { min: 0.3, max: 0.7 },
      acousticness: { min: 0.2, max: 0.8 }
    },
    examples: [],
    color: '#4ECDC4'
  }
];

export default function CustomMoodTraining({ tracks, onCategoriesChange }: CustomMoodTrainingProps) {
  const [categories, setCategories] = useState<CustomMoodCategory[]>(defaultMoodCategories);
  const [selectedCategory, setSelectedCategory] = useState<CustomMoodCategory | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [trainingAccuracy, setTrainingAccuracy] = useState<number | null>(null);

  useEffect(() => {
    // Auto-assign tracks to categories based on audio features
    const updatedCategories = categories.map(category => {
      const matchingTracks = tracks.filter(track => {
        const features = category.audioFeatures;
        return (
          track.valence >= features.valence.min && track.valence <= features.valence.max &&
          track.energy >= features.energy.min && track.energy <= features.energy.max &&
          track.danceability >= features.danceability.min && track.danceability <= features.danceability.max &&
          (track.acousticness || 0) >= features.acousticness.min && (track.acousticness || 0) <= features.acousticness.max
        );
      });
      return { ...category, examples: matchingTracks.slice(0, 10) };
    });
    
    setCategories(updatedCategories);
  }, [tracks]); // Intentionally excluding categories to prevent infinite loop

  const createNewCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: CustomMoodCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: newCategoryName,
      description: newCategoryDescription || `Custom mood category: ${newCategoryName}`,
      audioFeatures: {
        valence: { min: 0.0, max: 1.0 },
        energy: { min: 0.0, max: 1.0 },
        danceability: { min: 0.0, max: 1.0 },
        acousticness: { min: 0.0, max: 1.0 }
      },
      examples: [],
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setShowNewCategoryForm(false);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
    }
  };

  const updateCategoryFeatures = (categoryId: string, feature: string, range: 'min' | 'max', value: number) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          audioFeatures: {
            ...cat.audioFeatures,
            [feature]: {
              ...cat.audioFeatures[feature as keyof typeof cat.audioFeatures],
              [range]: value
            }
          }
        };
      }
      return cat;
    }));
  };

  const trainCategories = async () => {
    setIsTraining(true);
    
    // Simulate training process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate training accuracy based on how well tracks fit their categories
    let totalTracks = 0;
    let correctlyClassified = 0;
    
    categories.forEach(category => {
      totalTracks += category.examples.length;
      category.examples.forEach(track => {
        const features = category.audioFeatures;
        const isCorrect = (
          track.valence >= features.valence.min && track.valence <= features.valence.max &&
          track.energy >= features.energy.min && track.energy <= features.energy.max &&
          track.danceability >= features.danceability.min && track.danceability <= features.danceability.max
        );
        if (isCorrect) correctlyClassified++;
      });
    });
    
    const accuracy = totalTracks > 0 ? (correctlyClassified / totalTracks) * 100 : 0;
    setTrainingAccuracy(accuracy);
    setIsTraining(false);
    
    onCategoriesChange(categories);
  };

  const FeatureSlider = ({ 
    label, 
    feature, 
    categoryId, 
    min, 
    max 
  }: { 
    label: string; 
    feature: string; 
    categoryId: string; 
    min: number; 
    max: number; 
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Min:</span>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={min}
            onChange={(e) => updateCategoryFeatures(categoryId, feature, 'min', parseFloat(e.target.value))}
            className="w-20 h-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Max:</span>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={max}
            onChange={(e) => updateCategoryFeatures(categoryId, feature, 'max', parseFloat(e.target.value))}
            className="w-20 h-8 text-xs"
          />
        </div>
      </div>
      <div className="h-2 bg-gray-700 rounded-full relative">
        <div 
          className="absolute h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          style={{ 
            left: `${min * 100}%`, 
            width: `${(max - min) * 100}%` 
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          Custom Mood Training
        </h2>
        <p className="text-gray-400">
          Create and train custom mood categories based on audio features
        </p>
      </div>

      {/* Training Status */}
      {trainingAccuracy !== null && (
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="font-semibold text-white">Training Complete</h3>
              <p className="text-sm text-gray-300">
                Model accuracy: {trainingAccuracy.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all duration-300 ${
                selectedCategory?.id === category.id
                  ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50'
                  : 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold text-white">{category.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory(category.id);
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-400">{category.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{category.examples.length} tracks</span>
                  <Target className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Add New Category */}
        <Card 
          className="p-4 border-2 border-dashed border-gray-600 hover:border-purple-500/50 cursor-pointer transition-all duration-300"
          onClick={() => setShowNewCategoryForm(true)}
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-400 hover:text-purple-400">
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Add New Category</span>
          </div>
        </Card>
      </div>

      {/* New Category Form */}
      {showNewCategoryForm && (
        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Mood Category</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category Name</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Study Focus, Workout Energy"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Input
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Describe what this mood category represents"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createNewCategory} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Category
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewCategoryForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Category Detail Editor */}
      {selectedCategory && (
        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-purple-900/20 border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedCategory.color }}
              />
              {selectedCategory.name}
            </h3>
            <Button
              onClick={() => setSelectedCategory(null)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audio Features Configuration */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Audio Feature Ranges
              </h4>
              <div className="space-y-4">
                <FeatureSlider
                  label="Valence (Positivity)"
                  feature="valence"
                  categoryId={selectedCategory.id}
                  min={selectedCategory.audioFeatures.valence.min}
                  max={selectedCategory.audioFeatures.valence.max}
                />
                <FeatureSlider
                  label="Energy"
                  feature="energy"
                  categoryId={selectedCategory.id}
                  min={selectedCategory.audioFeatures.energy.min}
                  max={selectedCategory.audioFeatures.energy.max}
                />
                <FeatureSlider
                  label="Danceability"
                  feature="danceability"
                  categoryId={selectedCategory.id}
                  min={selectedCategory.audioFeatures.danceability.min}
                  max={selectedCategory.audioFeatures.danceability.max}
                />
                <FeatureSlider
                  label="Acousticness"
                  feature="acousticness"
                  categoryId={selectedCategory.id}
                  min={selectedCategory.audioFeatures.acousticness.min}
                  max={selectedCategory.audioFeatures.acousticness.max}
                />
              </div>
            </div>

            {/* Example Tracks */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Example Tracks ({selectedCategory.examples.length})
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedCategory.examples.length > 0 ? (
                  selectedCategory.examples.map((track, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="font-medium text-white text-sm">{track.name}</div>
                      <div className="text-xs text-gray-400">{track.artist}</div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>V: {(track.valence * 100).toFixed(0)}%</span>
                        <span>E: {(track.energy * 100).toFixed(0)}%</span>
                        <span>D: {(track.danceability * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>No tracks match the current feature ranges</p>
                    <p className="text-sm">Adjust the sliders to include more tracks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Training Controls */}
      <div className="text-center">
        <Button
          onClick={trainCategories}
          disabled={isTraining || categories.length === 0}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
        >
          {isTraining ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Brain className="w-5 h-5 mr-2" />
          )}
          {isTraining ? 'Training Model...' : 'Train Custom Categories'}
        </Button>
      </div>
    </div>
  );
}
