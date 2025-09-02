import React from 'react'

const CustomPagination = ({ totalSlides, currentSlide, goToSlide }) => {
    return (
        <div className="flex gap-2 items-center mt-5">
            {[...Array(totalSlides)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 
                        ${currentSlide === index
                            ? 'primaryBg w-2' // Active bullet
                            : 'bg-gray-300'    // Inactive bullet
                        }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    );
}

export default CustomPagination