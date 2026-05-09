import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Report = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("/history/admin");
      if (response.data.success) {

        setHistory(response.data.history);
      } else {
        toast.error("Failed to fetch history");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedCats, setSelectedCats] = useState(['user', 'add', 'delete']);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    // Select all users by default when history is loaded
    if (history.length > 0) {
      const allUserIds = [...new Set(history.map(log => log.userId?._id || 'deleted'))];
      setSelectedUsers(allUserIds);
    }
  }, [history]);

  // Group history by user
  const groupedHistory = history.reduce((acc, log) => {
    const userId = log.userId?._id || 'deleted';
    if (!acc[userId]) {
      acc[userId] = {
        user: log.userId || { name: 'Deleted User', _id: 'deleted' },
        logs: []
      };
    }
    acc[userId].logs.push(log);
    return acc;
  }, {});

  const generatePDF = () => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select at least one user");
      return;
    }
    if (selectedCats.length === 0) {
      toast.warning("Please select at least one activity type");
      return;
    }

    const doc = new jsPDF();
    doc.text("Activity History Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    let currentY = 30;

    const filteredGroups = Object.values(groupedHistory).filter(group =>
      selectedUsers.includes(group.user?._id || 'deleted')
    );

    filteredGroups.forEach((group, idx) => {
      const userName = group.user?.name || 'Unknown User';

      const categorizedLogs = [
        { key: 'user', title: 'User Management', logs: group.logs.filter(log => ['USER_JOINED', 'REMOVED_USER'].includes(log.action)) },
        { key: 'add', title: 'Additions (Songs/Albums)', logs: group.logs.filter(log => log.action.includes('ADDED') || log.action.includes('CREATED')) },
        { key: 'delete', title: 'Deletions', logs: group.logs.filter(log => log.action.includes('DELETED') || log.action === 'REMOVED_FROM_PLAYLIST') }
      ].filter(section => selectedCats.includes(section.key) && section.logs.length > 0);

      if (categorizedLogs.length === 0) return;

      if (idx !== 0) {
        currentY = doc.lastAutoTable.finalY + 15;
      }

      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129); // Accent color
      doc.text(`${userName}'s Activity Report`, 14, currentY);
      currentY += 8;

      categorizedLogs.forEach(section => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(section.title, 14, currentY);

        const tableData = section.logs.map(log => [
          log.action.replace(/_/g, ' '),
          log.itemType,
          log.itemName,
          new Date(log.createdAt).toLocaleString()
        ]);

        autoTable(doc, {
          startY: currentY + 2,
          head: [['Action', 'Type', 'Item Name', 'Timestamp']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [30, 30, 30] },
          margin: { top: 10 }
        });

        currentY = doc.lastAutoTable.finalY + 10;
      });
    });

    doc.save(`Activity_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return <div className="text-center p-10">Loading history...</div>;
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Activity <span className="text-[var(--accent-color)]">Report</span></h2>
          <p className="text-sm text-[var(--text-secondary)]">Track all modifications made by your linked users.</p>
        </div>
        <button
          onClick={generatePDF}
          className="bg-[var(--accent-color)] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:opacity-80 transition-all active:scale-95 flex items-center gap-2 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          REPORT PDF
        </button>
      </div>

      {/* PDF Options */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--surface-color)] border border-[var(--border-color)] p-6 rounded-[2rem] shadow-sm flex flex-col lg:flex-row gap-8"
      >
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50">Include Users</h4>
            <button
              onClick={() => setSelectedUsers(selectedUsers.length === Object.keys(groupedHistory).length ? [] : Object.keys(groupedHistory))}
              className="text-[10px] font-bold text-[var(--accent-color)] hover:underline"
            >
              {selectedUsers.length === Object.keys(groupedHistory).length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(groupedHistory).map(group => {
              const userId = group.user?._id || 'deleted';
              const isSelected = selectedUsers.includes(userId);
              return (
                <button
                  key={userId}
                  onClick={() => {
                    setSelectedUsers(prev => isSelected ? prev.filter(i => i !== userId) : [...prev, userId]);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-lg shadow-emerald-500/20' : 'bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)]'}`}
                >
                  {group.user?.name || 'Deleted User'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:border-l lg:border-[var(--border-color)] lg:pl-8 min-w-[260px]">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50">Activity Types</h4>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {[
              { id: 'user', label: 'User Management', icon: '👤' },
              { id: 'add', label: 'Additions', icon: '✚' },
              { id: 'delete', label: 'Deletions', icon: '🗑️' }
            ].map(cat => (
              <div
                key={cat.id}
                onClick={() => setSelectedCats(prev => prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id])}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border ${selectedCats.includes(cat.id) ? 'bg-[var(--accent-color)]/5 border-[var(--accent-color)]/20 text-[var(--accent-color)]' : 'bg-transparent border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-color)]'}`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${selectedCats.includes(cat.id) ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-color)]'}`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-bold">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <div className="flex flex-col gap-10">
          {Object.keys(groupedHistory).length === 0 ? (
            <div className="text-center py-20 text-[var(--text-secondary)] opacity-50">
              <p className="text-4xl mb-4">📜</p>
              <p>No activity logs found for your users.</p>
            </div>
          ) : (
            Object.values(groupedHistory).map((group, gIdx) => {
              const categorizedLogs = {
                userActions: group.logs.filter(log => ['USER_JOINED', 'REMOVED_USER'].includes(log.action)),
                addActions: group.logs.filter(log => log.action.includes('ADDED') || log.action.includes('CREATED')),
                deleteActions: group.logs.filter(log => log.action.includes('DELETED') || log.action === 'REMOVED_FROM_PLAYLIST')
              };

              const sections = [
                { title: 'User Management', logs: categorizedLogs.userActions, icon: '👤' },
                { title: 'Additions', logs: categorizedLogs.addActions, icon: '✚' },
                { title: 'Deletions', logs: categorizedLogs.deleteActions, icon: '🗑️' }
              ];

              return (
                <div key={group.user?._id || gIdx} className="flex flex-col gap-8 p-8 rounded-[2.5rem] bg-[var(--surface-color)]/50 border border-[var(--border-color)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--accent-gradient)] flex items-center justify-center text-white text-lg font-black shadow-lg">
                      {group.user?.name ? group.user.name[0].toUpperCase() : '?'}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">
                        {group.user?.name || 'Unknown User'}'s History
                      </h3>
                      <p className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-widest opacity-60">Activity Summary</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-10">
                    {sections.map((section, sIdx) => section.logs.length > 0 && (
                      <div key={sIdx} className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{section.icon}</span>
                          <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] opacity-40">
                            {section.title}
                          </h4>
                          <div className="h-[1px] flex-1 bg-[var(--border-color)] opacity-30"></div>
                        </div>

                        <div className="w-full overflow-x-auto">
                          <div className="min-w-[700px] border border-[var(--border-color)]/30 rounded-2xl overflow-hidden bg-[var(--bg-color)]/30">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest bg-[var(--bg-color)]/50">
                                  <th className="px-6 py-4">Action</th>
                                  <th className="px-6 py-4">Type</th>
                                  <th className="px-6 py-4">Item Name</th>
                                  <th className="px-6 py-4">Timestamp</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border-color)]/30">
                                {section.logs.map((log, lIdx) => (
                                  <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: lIdx * 0.01 }}
                                    key={log._id}
                                    className="hover:bg-[var(--accent-color)]/5 transition-colors"
                                  >
                                    <td className="px-6 py-4">
                                      <span className={`
                                        px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider
                                        ${log.action === 'REMOVED_USER'
                                          ? 'bg-rose-500/10 text-rose-500'
                                          : log.action.includes('ADDED')
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : log.action.includes('CREATED')
                                              ? 'bg-blue-500/10 text-blue-500'
                                              : log.action === 'USER_JOINED'
                                                ? 'bg-purple-500/10 text-purple-500'
                                                : log.action === 'REMOVED_FROM_PLAYLIST'
                                                  ? 'bg-orange-500/10 text-orange-500'
                                                  : log.action.includes('DELETED')
                                                    ? 'bg-rose-500/10 text-rose-500'
                                                    : 'bg-red-500/10 text-red-500'
                                        }
                                      `}>
                                        {log.action.replace(/_/g, ' ')}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-[12px] font-medium text-[var(--text-secondary)] opacity-60">
                                      {log.itemType}
                                    </td>
                                    <td className="px-6 py-4 text-[12px] font-bold text-[var(--text-primary)]">
                                      {log.itemName}
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-mono text-[var(--text-secondary)] opacity-40">
                                      {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );


};


export default Report;
