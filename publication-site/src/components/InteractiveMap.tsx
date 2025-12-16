import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useTime, useTransform, MotionValue } from 'framer-motion';
import { Node } from './Node';
import { ContentCard } from './ContentCard';
import { Background } from './Background';
import publicationData from '../data/publication.json';

// Helper component for orbiting logic
const OrbitingNode = ({ node, time, activeNodeId, onClick }: {
    node: typeof publicationData.nodes[0],
    time: MotionValue<number>,
    activeNodeId: string | null,
    onClick: (id: string, x: number | MotionValue<number>, y: number | MotionValue<number>) => void
}) => {
    // Calculate initial polar coordinates
    const initialX = node.position.x;
    const initialY = node.position.y;
    const radius = Math.sqrt(initialX * initialX + initialY * initialY);
    const initialAngle = Math.atan2(initialY, initialX);

    // Different speeds for visual variety (based on radius or index)
    // Nodes further out move slightly slower? Or just random variation?
    // Let's use a base speed.
    const speed = 0.05; // Radians per second roughly
    const direction = radius % 2 === 0 ? 1 : -1; // Some go clockwise, some counter

    const x = useTransform(time, t => {
        // If radius is 0 (center), don't move
        if (radius === 0) return 0;
        const currentAngle = initialAngle + (t / 1000) * speed * direction;
        return radius * Math.cos(currentAngle);
    });

    const y = useTransform(time, t => {
        if (radius === 0) return 0;
        const currentAngle = initialAngle + (t / 1000) * speed * direction;
        return radius * Math.sin(currentAngle);
    });

    return (
        <Node
            key={node.id}
            id={node.id}
            label={node.label}
            x={x}
            y={y}
            category={node.category}
            isActive={activeNodeId === node.id}
            onClick={() => onClick(node.id, x, y)}
        />
    );
};

export const InteractiveMap = () => {
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const constraintsRef = useRef(null);
    const time = useTime();

    const activeNode = activeNodeId ? publicationData.nodes.find(n => n.id === activeNodeId) : null;

    const handleNodeClick = (id: string, x: number | MotionValue<number>, y: number | MotionValue<number>) => {
        setActiveNodeId(id);
    };

    const closeCard = () => {
        setActiveNodeId(null);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden text-white font-sans selection:bg-fuchsia-500 selection:text-white">
            <Background />

            <div className="absolute top-8 left-8 z-30 pointer-events-none">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mix-blend-overlay opacity-50">
                    {publicationData.title}
                </h1>
                <p className="text-xl md:text-2xl font-light tracking-widest uppercase opacity-70">
                    {publicationData.subtitle}
                </p>
                <div className="mt-8 text-sm opacity-50 max-w-xs">
                    Drag to explore • Click to expand
                </div>
            </div>

            {/* Draggable Surface */}
            <motion.div
                ref={constraintsRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
            >
                <motion.div
                    drag
                    dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
                    className="absolute left-1/2 top-1/2 w-0 h-0" // Center origin
                >
                    {publicationData.nodes.map((node) => (
                        <OrbitingNode
                            key={node.id}
                            node={node}
                            time={time}
                            activeNodeId={activeNodeId}
                            onClick={handleNodeClick}
                        />
                    ))}
                </motion.div>
            </motion.div>

            {/* Overlay */}
            <ContentCard node={activeNode} onClose={closeCard} />

        </div>
    );
};
