import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ProgressBar from 'progressbar.js';

/**
 * Komponen Loading dengan 3 varian:
 * 1. spinner (digunakan di dalam button)
 * 2. skeleton (placeholder card/konten)
 * 3. progressbar (global progress bar)
 */
const Loading = ({ variant = 'spinner', ...props }) => {
    const progressRef = useRef(null);

    useEffect(() => {
        if (variant === 'progressbar' && progressRef.current) {
            // Inisialisasi ProgressBar.js
            const bar = new ProgressBar.Line(progressRef.current, {
                strokeWidth: 4,
                easing: 'easeInOut',
                duration: 1400,
                color: '#408A71',
                trailColor: '#eee',
                trailWidth: 1,
                svgStyle: { width: '100%', height: '100%' }
            });

            bar.animate(1.0); // Animasi ke 100%

            return () => {
                bar.destroy();
            };
        }
    }, [variant]);

    if (variant === 'spinner') {
        return (
            <div className={`flex items-center justify-center ${props.className}`}>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (variant === 'skeleton') {
        return (
            <SkeletonTheme baseColor="#F3F3F3" highlightColor="#ffffff">
                <div className={`p-4 rounded-xl border border-gray-100 ${props.className}`}>
                    <Skeleton height={props.height || 150} borderRadius={12} />
                    <div className="mt-4">
                        <Skeleton count={2} height={20} />
                    </div>
                </div>
            </SkeletonTheme>
        );
    }

    if (variant === 'progressbar') {
        return createPortal(
            <div className="fixed top-0 left-0 w-full h-1 z-[9999]" ref={progressRef}></div>,
            document.body
        );
    }

    return null;
};

export default Loading;
