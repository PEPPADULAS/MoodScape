import React, { useState } from 'react';
import { DiaryEditor } from './components/DiaryEditor';
import { DiaryEntry } from './components/DiaryEntry';
import { useCustomization } from './hooks/useCustomization';
import { BookOpen, Plus, Settings } from 'lucide-react';

interface Entry {
  id: string;
  content: string;
  date: Date;
  customization: any;
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const { preferences } = useCustomization();

  const handleSaveEntry = (content: string, customization: any) => {
    if (editingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, content, customization }
          : entry
      ));
      setEditingEntry(null);
    } else {
      // Create new entry
      const newEntry: Entry = {
        id: Date.now().toString(),
        content,
        date: new Date(),
        customization
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    setShowEditor(false);
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  MoodScape Journal
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Express yourself in your own style and language
                </p>
              </div>
            </div>
            
            <button
              onClick={handleNewEntry}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {showEditor ? (
          <div className="mb-8">
            <DiaryEditor
              entryId={editingEntry?.id || `entry-${Date.now()}`}
              initialContent={editingEntry?.content || ''}
              onSave={handleSaveEntry}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingEntry(null);
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Message */}
            {entries.length === 0 && (
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Welcome to Your Personal Journal
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Start writing your thoughts with personalized fonts and languages. 
                  Express yourself in your own unique style.
                </p>
                <button
                  onClick={handleNewEntry}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Write Your First Entry
                </button>
              </div>
            )}

            {/* Entries List */}
            <div className="space-y-6">
              {entries.map(entry => (
                <DiaryEntry
                  key={entry.id}
                  id={entry.id}
                  content={entry.content}
                  date={entry.date}
                  customization={entry.customization}
                  onEdit={() => handleEditEntry(entry)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Features Info */}
      {!showEditor && entries.length === 0 && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Font Customization
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Choose from a wide variety of fonts including serif, sans-serif, handwritten, 
                calligraphy, typewriter, and modern styles.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• 15+ beautiful font options</li>
                <li>• Google Fonts integration</li>
                <li>• Per-entry customization</li>
                <li>• Real-time preview</li>
              </ul>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Multilingual Support
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Write in your preferred language with full support for multiple scripts 
                and right-to-left text direction.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• 15+ language options</li>
                <li>• RTL text support</li>
                <li>• Native font rendering</li>
                <li>• Per-entry language selection</li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;