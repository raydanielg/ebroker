'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import FeaturedPropertyHorizontalCard from './FeaturedPropertyHorizontalCard';
import { useIsMobile } from '@/hooks/use-mobile';

// Define a base top offset value for stacking
const STICKY_BASE_TOP = 180; // Base offset for the first card (adjust if needed)
const STICKY_BASE_TOP_MOBILE = 90; // Base offset for the first card (adjust if needed)

const AnimatedFeaturedCard = ({ property, index, data }) => {
    const cardRef = useRef(null);
    const isMobile = useIsMobile()

    // All cards stick to the same top position
    const stickyTopOffset = isMobile ? STICKY_BASE_TOP_MOBILE : STICKY_BASE_TOP;


    return (
        <motion.div
            ref={cardRef} // Assign ref to the motion div
            key={property.id} // Key should ideally be here if component is directly in map
            className="mb-6 lg:mb-0 relative" // Keep relative for zIndex
            style={{
                ...(data?.length > 0 ? {
                    position: 'sticky',
                    top: `${stickyTopOffset}px`, // Use constant top offset
                    zIndex: index,
                } : {}),
            }}
        >
            <FeaturedPropertyHorizontalCard property={property} />
        </motion.div>
    );
};

export default AnimatedFeaturedCard; 