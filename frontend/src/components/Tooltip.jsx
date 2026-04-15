import React, { useId, cloneElement } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

/**
 * Komponen Tooltip Universal berbasi pustaka `react-tooltip`.
 * @param {string} text - Konten teks tooltip.
 * @param {string} position - Penempatan ('top', 'right', 'bottom', 'left').
 * @param {number} offset - Jarak dari elemen pemicu.
 * @param {ReactNode} children - Elemen yang akan diberikan tooltip.
 */
const Tooltip = ({ text, position = 'top', offset = 8, children }) => {
    const tooltipId = useId();

    const trigger = cloneElement(React.Children.only(children), {
        'data-tooltip-id': tooltipId,
        'data-tooltip-content': text,
        'data-tooltip-place': position,
    });

    return (
        <>
            {trigger}
            <ReactTooltip 
                id={tooltipId}
                className="!bg-gray-950 !px-0.5 !py-0.5 !text-[12px] !font-medium !rounded !shadow-2xl z-[99999] !opacity-100"
                arrowColor="#030712"
                offset={offset}
                noArrow={false}
            />
        </>
    );
};

export default Tooltip;
