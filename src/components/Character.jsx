import React from 'react';

// Simple pixel art character parts using CSS/divs
const CharacterSprite = ({ head, chest, legs, weapon, accessory }) => {
  const headColors = ['#FFB6C1', '#87CEEB', '#90EE90', '#FFD700', '#DDA0DD'];
  const chestColors = ['#FF6347', '#4169E1', '#32CD32', '#FFD700', '#9370DB'];
  const legsColors = ['#8B4513', '#000080', '#006400', '#B8860B', '#4B0082'];

  return (
    <div className="flex justify-center items-center p-8">
      <div className="relative" style={{ width: '128px', height: '192px' }}>
        {/* Head */}
        <div
          className="absolute border-4 border-black"
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: headColors[head % headColors.length],
            top: '0',
            left: '40px',
          }}
        >
          {/* Eyes */}
          <div className="flex gap-2 justify-center mt-3">
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
          </div>
        </div>

        {/* Chest/Body */}
        <div
          className="absolute border-4 border-black"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: chestColors[chest % chestColors.length],
            top: '48px',
            left: '32px',
          }}
        >
          {/* Buttons */}
          <div className="flex flex-col gap-2 items-center mt-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Arms */}
        <div
          className="absolute border-2 border-black"
          style={{
            width: '16px',
            height: '48px',
            backgroundColor: chestColors[chest % chestColors.length],
            top: '56px',
            left: '12px',
          }}
        ></div>
        <div
          className="absolute border-2 border-black"
          style={{
            width: '16px',
            height: '48px',
            backgroundColor: chestColors[chest % chestColors.length],
            top: '56px',
            right: '12px',
          }}
        ></div>

        {/* Legs */}
        <div
          className="absolute border-4 border-black"
          style={{
            width: '28px',
            height: '64px',
            backgroundColor: legsColors[legs % legsColors.length],
            top: '112px',
            left: '32px',
          }}
        ></div>
        <div
          className="absolute border-4 border-black"
          style={{
            width: '28px',
            height: '64px',
            backgroundColor: legsColors[legs % legsColors.length],
            top: '112px',
            right: '32px',
          }}
        ></div>

        {/* Weapon (if equipped) */}
        {weapon > 0 && (
          <div
            className="absolute border-2 border-black bg-gray-400"
            style={{
              width: '8px',
              height: '48px',
              top: '64px',
              right: '0px',
            }}
          ></div>
        )}

        {/* Accessory (if equipped) */}
        {accessory > 0 && (
          <div
            className="absolute border-2 border-black bg-yellow-400"
            style={{
              width: '56px',
              height: '8px',
              top: '12px',
              left: '36px',
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default CharacterSprite;
