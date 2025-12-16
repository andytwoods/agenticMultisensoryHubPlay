
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { glossary } from '../data/glossary';
import { GlossaryTooltip } from './GlossaryTooltip';

interface ContentCardProps {
    node: any;
    onClose: () => void;
}

export const ContentCard = ({ node, onClose }: ContentCardProps) => {
    if (!node) return null;

    // Process text to inject tooltips
    const processedContent = useMemo(() => {
        let contentParts: (string | JSX.Element)[] = [node.content];

        glossary.forEach((item) => {
            const newParts: (string | JSX.Element)[] = [];
            contentParts.forEach((part) => {
                if (typeof part === 'string') {
                    // Regex to find the term (case insensitive, whole word)
                    const regex = new RegExp('\\b(' + item.term + ')\\b', 'gi');
                    const split = part.split(regex);

                    for (let i = 0; i < split.length; i++) {
                        // If this part matches the term (ignoring case), replace it
                        if (split[i].toLowerCase() === item.term.toLowerCase()) {
                            newParts.push(
                                <GlossaryTooltip key={item.term + '-' + i} term={split[i]} definition={item.definition} />
                            );
                        } else {
                            newParts.push(split[i]);
                        }
                    }
                } else {
                    newParts.push(part);
                }
            });
            contentParts = newParts;
        });

        return contentParts;
    }, [node.content]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:pr-10"
                onClick={onClose} // Click outside to close
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:w-[500px] bg-black/80 backdrop-blur-xl border-l sm:border sm:rounded-3xl border-white/10 shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >

                    {/* Header Image */}
                    {node.image && (
                        <div className="h-64 bg-gray-900 relative overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
                            <img src={`${import.meta.env.BASE_URL}${node.image}`} alt={node.title} className="w-full h-full object-cover opacity-80" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-8 relative flex-1 overflow-y-auto custom-scrollbar">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-black text-white mb-2 leading-tight"
                        >
                            {node.title}
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded uppercase tracking-widest text-white/50">{node.category}</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="prose prose-invert prose-lg"
                        >
                            <p className="lead text-xl text-white/80 font-light border-l-4 border-white/20 pl-4 mb-6">
                                {node.summary}
                            </p>

                            <div className="text-gray-300 font-sans space-y-4 whitespace-pre-wrap">
                                {processedContent}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

