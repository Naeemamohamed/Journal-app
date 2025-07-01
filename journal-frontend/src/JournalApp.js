


import { useState, useEffect } from 'react';
import "./index.css";
import axios from 'axios';

function JournalApp() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMonths, setExpandedMonths] = useState({});
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => { 
    console.log('Filter changed to:', filter);
  },[filter]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchEntries = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/entries/');

      const normalizedEntries = res.data.map(entry => ({
        ...entry,
        sentiment: entry.sentiment?.toLowerCase().trim(),
      }));
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/entries/', {title,content});
      setTitle('');
      setContent('');
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (entry) => {
   setEditingEntryId(entry.id);
   setEditTitle(entry.title);
   setEditContent(entry.content);
  };
  
  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setShowConfirmModal(true);
  };

  const handleSave = async (id) => {
   try {
    await axios.put(`http://127.0.0.1:8000/api/entries/${id}/`, {
      title: editTitle,
      content: editContent,
    });
    setEditingEntryId(null);
    fetchEntries(); 
   } catch (err) {
    console.error('Error updating entry:', err);
   }
  };

    const handleConfirmDelete = async () => {
      if(!entryToDelete) return;

      try{
        await axios.delete(`http://127.0.0.1:8000/api/entries/${entryToDelete.id}/`);
        fetchEntries();
      } catch (err) {
        console.error("Error deleting entry:", err);
      } finally {
        setShowConfirmModal(false);
        setEntryToDelete(null);
      }
  
    };
    entries.forEach(entry => console.log('Entry sentiment:', `"${entry.sentiment}"`));
      console.log('Current filter:', filter);

  const filteredEntries = entries
    .filter(entry => {
      if (filter === 'all') return true;
      const entrySentiment = entry.sentiment?.toLowerCase().trim() || 'unknown';
      const filterSentiment = filter.toLowerCase().trim();
      return entrySentiment === filterSentiment;
    })
    .sort((a,b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    console.log('Filtered entries:', filteredEntries);

    const moodScores = entries.map(entry => entry.mood_score);
    const avgMoodScore =
      moodScores.length > 0
      ? (moodScores.reduce((a,b) => a + b, 0) / moodScores.length).toFixed(2)
      :'N/A' ;  

    const sentimentCounts = {
        positive: 0,
        neutral: 0,
        negative: 0,
        unknown: 0,
      };
      
    entries.forEach(entry => {
       const sentiment = entry.sentiment?.toLowerCase().trim();
        if (sentimentCounts.hasOwnProperty(sentiment)) {
          sentimentCounts[sentiment]++;
        } else {
          sentimentCounts.unknown++;
        }
      });

    const toggleMonth = (month) => {
      setExpandedMonths(prev => ( {
        ...prev,
        [month]: !prev[month]
      }));
    };
  console.log(entries);

  return (
      <div className="min-h-screen bg-[#f9f9f9] text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
   <div className="max-w-xl mx-auto px-4">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-semibold tracking-tight">📓 Journal </h1>
    <button
      onClick={() => {
         setDarkMode(prev =>{
          console.log('toggling dark mode:', !prev);
          return !prev;
         });
        }}
      className="bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-3 py-1.5 rounded-md text-sm transition duration-300"
    >
      {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  </div>

  




      <form onSubmit={handleSubmit} className=" space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-400"
        />
        <textarea
          placeholder="Write your entry here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-3 h-32 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button 
           type="submit"
           className=" w-full bg-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition duration-300 animate-pulse-glow">
          Add Entry
        </button>
      </form>
      <div className = "flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <select 
           value={filter} 
           onChange={(e) => {
            setFilter(e.target.value)
           }}
           className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
          >

          
          <option value="all">All Sentiments</option>
          <option value="positive">Positive😊</option>
          <option value="neutral">Neutral😐</option>
          <option value="negative">Negative😞</option>
          <option value="unknown">Unknown ❓</option>
        </select>
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white">
          <option value="newest">Newest First ⬇️</option>
          <option value="oldest">Oldest First ⬆️</option>
        </select>
      </div>
      <div className="bg-indigo-50 text-gray-800 rounded-lg p-4 mb-6 shadow-sm border border-indigo-100">
        <h3 className="text-lg font-semibold mb-2"> 📊Mood Overview</h3>
        <p><span className="font-medium">Average Mood Score:</span>{avgMoodScore}</p>
        <p>
          <span className="font-medium">Sentiments:</span>{' '}
          😊{sentimentCounts.positive} | 😐 {sentimentCounts.neutral} | 😞 {sentimentCounts.negative} | ❓ {sentimentCounts.unknown}
        </p>
      </div>

      <input
      type="text"
      placeholder="Search entries..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-2  border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
      />
  <h2 className="text-2xl font-semibold mb-4">Your Entries</h2>
  {filteredEntries.length === 0 ? (
     <p>No entries yet.</p>
) : (
  Object.entries(
    filteredEntries
      .filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .reduce((acc, entry) => {
        const date = new Date(entry.created_at);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(entry);
        return acc;
      }, {})
  ).map(([month, entries]) => (
    <div key={month}>
      <h3
        onClick={() => toggleMonth(month)}
        className="mt-8 mb-2 cursor-pointer text-indigo-600 hover:underline text-lg font-medium"
      >
        {expandedMonths[month] ? '🔽' : '▶️'} {month}
      </h3>
        {expandedMonths[month] &&
         entries.map((entry) => {
          const normalizedSentiment = entry.sentiment?.toLowerCase().trim();
          const isEditing = editingEntryId === entry.id;

          return (

        
          <div
            key={entry.id}
            className={` p-4 mb-4 rounded-lg  shadow-sm border transition-colors duration-300 dark:border-gray-700 ${
              normalizedSentiment === 'positive' ? 'border-green-400 bg-green-50' :
              normalizedSentiment === 'neutral' ? 'border-gray-400 bg-gray-50' :
              normalizedSentiment === 'negative'? 'border-red-400 bg-red-50' :
              'border-black bg-white dark:bg-gray-800'
            }text-gray-900 dark:text-white`}
            
        >
          {isEditing ? (
            <>
            <input
            type ="text"
            value ={editTitle}
            onChange ={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
            value = {editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 mb-2 border rounded h-24 resize-none focus:outline-none focus:ring-indigo-400"
            />
            <div className="flex gap-2" >
              <button
               onClick = {() => handleSave(entry.id)}
               className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
               >Save</button>
             <button 
              onClick = {() => setEditingEntryId(null)} 
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
             >Cancel
             </button>
            </div>
          </>
            
          ) : (
            <>
          <h3>{entry.title}</h3>
          <p>{entry.content}</p>
          <p><strong>Sentiment:</strong> {
          normalizedSentiment === "positive" ? "😊" :
          normalizedSentiment === "neutral" ? "😐" :
           normalizedSentiment === "negative" ? "😞":
           "❓ unknown"
           }</p>
          <p><strong>Mood Score:</strong> {entry.mood_score?.toFixed(2)}</p>
          <small>
            {new Date(entry.created_at).toLocaleString()} at{" "}
            {new Date(entry.created_at).toLocaleTimeString()}
          </small>
          

          <div style ={{marginTop: 10}}>
            <button onClick={() => startEditing(entry)}>Edit</button>
              <button onClick={() => handleDeleteClick(entry.id)} style={{ marginLeft: 8, color: 'red' }}>
                Delete
              </button>
         </div>
        </> 
       )}    
      </div>
     
      );
    })}
    </div>
  ))
)}
{showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <p className="text-lg font-medium mb-4">Are you sure you want to delete this entry?</p>
            <div className="flex justify-end gap-3">
            <button 
              onClick={handleConfirmDelete} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowConfirmModal(false)}
              className ="bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >Cancel
            </button>
          </div>
          </div>
        </div>
      )}
  
  



     </div>
    </div>
  );
}
export default JournalApp;

   