import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import algorithmRegistry from '../../data/algorithms';

const NOTES_KEY = 'algoflow-notes';

const ExportProgress = ({ bookmarks = [], progressData = [], userName = 'User' }) => {
    const [exporting, setExporting] = useState(false);

    const generatePDF = () => {
        setExporting(true);

        try {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);

            // 🎨 PROFESSIONAL THEME COLORS
            const colors = {
                dark: [10, 15, 26],      // #0a0f1a
                card: [15, 21, 32],      // #0f1520
                accent: [59, 130, 246],  // #3b82f6 (Blue)
                emerald: [16, 185, 129], // #10b981
                text: [226, 232, 240],   // #e2e8f0
                muted: [100, 116, 139]   // #64748b
            };

            // 1. BACKGROUND
            doc.setFillColor(...colors.dark);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // 2. HEADER BLOCK
            doc.setFillColor(...colors.card);
            doc.roundedRect(margin, margin, contentWidth, 35, 3, 3, 'F');
            
            // Logo Text
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(...colors.text);
            doc.text('Algo', margin + 10, margin + 18);
            doc.setTextColor(...colors.accent);
            doc.text('Flow', margin + 28, margin + 18);

            doc.setFontSize(10);
            doc.setTextColor(...colors.muted);
            doc.text('DSA LEARNING PROGRESS REPORT', margin + 10, margin + 26);

            // User Info (Right Aligned)
            doc.setFontSize(11);
            doc.setTextColor(...colors.text);
            doc.text(userName.toUpperCase(), pageWidth - margin - 10, margin + 18, { align: 'right' });
            doc.setFontSize(9);
            doc.setTextColor(...colors.muted);
            doc.text(new Date().toLocaleDateString('en-US', { dateStyle: 'medium' }), pageWidth - margin - 10, margin + 24, { align: 'right' });

            let y = margin + 45;

            // 3. STATS GRID (Single Row)
            const completed = progressData.filter(p => p.status === 'completed').length;
            const inProgress = progressData.filter(p => p.status === 'in_progress').length;
            const bookmarkCount = bookmarks.length;
            
            const statW = (contentWidth - 6) / 3;
            const stats = [
                { label: 'COMPLETED', val: completed, color: colors.emerald },
                { label: 'IN PROGRESS', val: inProgress, color: colors.accent },
                { label: 'BOOKMARKS', val: bookmarkCount, color: [245, 158, 11] }
            ];

            stats.forEach((s, i) => {
                const x = margin + (i * (statW + 3));
                doc.setFillColor(...colors.card);
                doc.roundedRect(x, y, statW, 25, 2, 2, 'F');
                
                doc.setFontSize(8);
                doc.setTextColor(...colors.muted);
                doc.text(s.label, x + statW/2, y + 8, { align: 'center' });
                
                doc.setFontSize(14);
                doc.setTextColor(...s.color);
                doc.text(String(s.val), x + statW/2, y + 18, { align: 'center' });
            });

            y += 35;

            // 4. COMPLETED ALGORITHMS (Two Column List)
            doc.setFontSize(12);
            doc.setTextColor(...colors.text);
            doc.text('COURSE PROGRESSION', margin, y);
            y += 8;

            const completedAlgos = progressData.filter(p => p.status === 'completed');
            doc.setFontSize(9);
            
            if (completedAlgos.length === 0) {
                doc.setTextColor(...colors.muted);
                doc.text('No algorithms completed yet. Start your journey!', margin + 5, y + 5);
                y += 15;
            } else {
                const colWidth = contentWidth / 2;
                completedAlgos.forEach((prog, i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    const posX = margin + (col * colWidth);
                    const posY = y + (row * 7);

                    doc.setFillColor(...colors.emerald);
                    doc.circle(posX + 2, posY - 1, 1, 'F');
                    
                    doc.setTextColor(...colors.text);
                    const name = algorithmRegistry[prog.algorithmId]?.algorithm?.name || prog.algorithmId;
                    doc.text(name, posX + 6, posY);
                    
                    if (col === 1 || i === completedAlgos.length - 1) {
                        // Update y only after filling row or at end
                        if (posY > y) y = posY; 
                    }
                });
                y += 10;
            }

            // 5. PERSONAL NOTES (Compact Section)
            y += 5;
            doc.setFontSize(12);
            doc.setTextColor(...colors.accent);
            doc.text('RECENT STUDY NOTES', margin, y);
            y += 8;

            const allNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
            const noteEntries = Object.entries(allNotes)
                .filter(([_, v]) => v.content?.trim())
                .slice(0, 3); // Max 3 for single page fit

            if (noteEntries.length === 0) {
                doc.setFontSize(9);
                doc.setTextColor(...colors.muted);
                doc.text('No study notes found.', margin + 5, y + 5);
            } else {
                noteEntries.forEach(([id, data]) => {
                    doc.setFillColor(...colors.card);
                    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
                    
                    doc.setFontSize(9);
                    doc.setTextColor(...colors.text);
                    const name = algorithmRegistry[id]?.algorithm?.name || id;
                    doc.text(name, margin + 5, y + 7);
                    
                    doc.setFontSize(8);
                    doc.setTextColor(...colors.muted);
                    const text = data.content.replace(/\n/g, ' ').substring(0, 140) + '...';
                    const splitText = doc.splitTextToSize(text, contentWidth - 10);
                    doc.text(splitText, margin + 5, y + 13);
                    
                    y += 24;
                });
            }

            // 6. FOOTER
            doc.setFontSize(8);
            doc.setTextColor(...colors.muted);
            doc.text('This is an official progress report generated by AlgoFlow DSA Engine.', pageWidth/2, pageHeight - 15, { align: 'center' });
            doc.setTextColor(...colors.accent);
            doc.text('www.algoflow.io', pageWidth/2, pageHeight - 10, { align: 'center' });

            // Final Save
            doc.save(`AlgoFlow_Report_${userName}.pdf`);

        } catch (err) {
            console.error('PDF Error:', err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePDF}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg disabled:opacity-50"
        >
            <svg className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {exporting ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                )}
            </svg>
            {exporting ? 'Generating...' : 'Download Report'}
        </motion.button>
    );
};

export default ExportProgress;