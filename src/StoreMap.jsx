import React, { useState, useRef, useCallback } from 'react';
import storeMapSvg from './assets/STORE_MAP_FIGMA.svg';

const Y_OFFSET = 0.115;

const SECTION_BOUNDS = {
  "ALCOHOLIC BEVERAGES": [
    { x_min:0.2622, y_min:0.2446, x_max:0.2854, y_max:0.8654, center_x:0.2738, center_y:0.555 },
    { x_min:0.2144, y_min:0.2446, x_max:0.2377, y_max:0.8654, center_x:0.2261, center_y:0.555 },
  ],
  "BABY FOODS":        [{ x_min:0.0012, y_min:0.9059, x_max:0.0244, y_max:1.1091, center_x:0.0128, center_y:1.0075 }],
  "BAKING MIXES":      [{ x_min:0.6456, y_min:0.2453, x_max:0.6689, y_max:0.5760, center_x:0.6573, center_y:0.4106 }],
  "BARS":              [{ x_min:0.4282, y_min:0.2446, x_max:0.4515, y_max:0.8653, center_x:0.4399, center_y:0.5549 }],
  "BREADS": [
    { x_min:0.6230, y_min:0.9148, x_max:0.7405, y_max:0.9657, center_x:0.6818, center_y:0.9403 },
    { x_min:0.6230, y_min:0.9657, x_max:0.7405, y_max:1.0166, center_x:0.6818, center_y:0.9911 },
  ],
  "BREAKFAST CEREALS": [{ x_min:0.5475, y_min:0.2446, x_max:0.5708, y_max:0.8653, center_x:0.5592, center_y:0.5549 }],
  "CAKES": [
    { x_min:0.7660, y_min:0.8639, x_max:0.9482, y_max:0.9148, center_x:0.8571, center_y:0.8893 },
    { x_min:0.7661, y_min:0.8145, x_max:0.9483, y_max:0.8654, center_x:0.8572, center_y:0.8399 },
  ],
  "CANDIES":           [{ x_min:0.4762, y_min:0.2446, x_max:0.4995, y_max:0.8653, center_x:0.4879, center_y:0.5549 }],
  "CANNED FOOD":       [{ x_min:0.5708, y_min:0.2446, x_max:0.5941, y_max:0.8653, center_x:0.5824, center_y:0.5549 }],
  "CHOCOLATE":         [{ x_min:0.4997, y_min:0.2446, x_max:0.5230, y_max:0.8653, center_x:0.5113, center_y:0.5549 }],
  "COFFEES":           [{ x_min:0.7173, y_min:0.5753, x_max:0.7406, y_max:0.8652, center_x:0.7289, center_y:0.7203 }],
  "CONDIMENTS":        [{ x_min:0.6230, y_min:0.2446, x_max:0.6463, y_max:0.8653, center_x:0.6346, center_y:0.5549 }],
  "DAIRY": [
    { x_min:0.0012, y_min:0.1791, x_max:0.0244, y_max:0.8639, center_x:0.0128, center_y:0.5215 },
    { x_min:0.0012, y_min:0.1176, x_max:0.3010, y_max:0.1805, center_x:0.1511, center_y:0.1490 },
  ],
  "DELI": [
    { x_min:0.7582, y_min:1.0413, x_max:0.9978, y_max:1.1074, center_x:0.8780, center_y:1.0743 },
    { x_min:0.7665, y_min:0.9579, x_max:0.9478, y_max:1.0166, center_x:0.8571, center_y:0.9872 },
  ],
  "DIPS":              [{ x_min:0.3334, y_min:0.5561, x_max:0.3567, y_max:0.8664, center_x:0.3450, center_y:0.7112 }],
  "DRIED FRUITS":      [{ x_min:0.7172, y_min:0.2949, x_max:0.9509, y_max:0.3458, center_x:0.8340, center_y:0.3204 }],
  "EGGS":              [{ x_min:0.3010, y_min:0.1176, x_max:0.3891, y_max:0.1805, center_x:0.3450, center_y:0.1490 }],
  "FLOURS":            [{ x_min:0.6945, y_min:0.5750, x_max:0.7178, y_max:0.8651, center_x:0.7062, center_y:0.7200 }],
  "FROZEN FOODS": [
    { x_min:0.1911, y_min:0.2446, x_max:0.2144, y_max:0.8653, center_x:0.2027, center_y:0.5549 },
    { x_min:0.1433, y_min:0.2435, x_max:0.1666, y_max:0.8642, center_x:0.1550, center_y:0.5538 },
  ],
  "FRUITS":            [{ x_min:0.9732, y_min:0.1801, x_max:0.9979, y_max:1.0453, center_x:0.9855, center_y:0.6127 }],
  "HONEYS":            [{ x_min:0.0474, y_min:0.9077, x_max:0.2516, y_max:0.9579, center_x:0.1495, center_y:0.9328 }],
  "ICE CREAMS": [
    { x_min:0.1201, y_min:0.2435, x_max:0.1433, y_max:0.8642, center_x:0.1317, center_y:0.5538 },
    { x_min:0.0723, y_min:0.2435, x_max:0.0956, y_max:0.8642, center_x:0.0839, center_y:0.5538 },
  ],
  "JAMS":              [{ x_min:0.0493, y_min:0.2435, x_max:0.0726, y_max:0.5538, center_x:0.0609, center_y:0.3986 }],
  "MEATS":             [{ x_min:0.3892, y_min:0.1176, x_max:0.9978, y_max:0.1805, center_x:0.6935, center_y:0.1490 }],
  "PASTAS":            [{ x_min:0.4047, y_min:0.2446, x_max:0.4280, y_max:0.8653, center_x:0.4163, center_y:0.5549 }],
  "RICES":             [{ x_min:0.0474, y_min:1.0572, x_max:0.2516, y_max:1.1074, center_x:0.1495, center_y:1.0823 }],
  "SALTY SNACKS":      [{ x_min:0.3334, y_min:0.2446, x_max:0.3567, y_max:0.5550, center_x:0.3450, center_y:0.3998 }],
  "SEAFOOD":           [{ x_min:0.7175, y_min:0.2446, x_max:0.9513, y_max:0.2955, center_x:0.8344, center_y:0.2701 }],
  "SODAS":             [{ x_min:0.2857, y_min:0.2443, x_max:0.3089, y_max:0.8651, center_x:0.2973, center_y:0.5547 }],
  "SPICES":            [{ x_min:0.0493, y_min:0.5485, x_max:0.0725, y_max:0.8589, center_x:0.0609, center_y:0.7037 }],
  "SPREADS":           [{ x_min:0.0474, y_min:0.9873, x_max:0.2516, y_max:1.0375, center_x:0.1495, center_y:1.0124 }],
  "SUGARS":            [{ x_min:0.6943, y_min:0.2446, x_max:0.7175, y_max:0.5753, center_x:0.7059, center_y:0.4100 }],
  "TEAS":              [{ x_min:0.7172, y_min:0.3458, x_max:0.7405, y_max:0.5760, center_x:0.7288, center_y:0.4609 }],
  "VEGETABLE OILS":    [{ x_min:0.6454, y_min:0.5753, x_max:0.6687, y_max:0.8652, center_x:0.6570, center_y:0.7203 }],
  "VEGETABLES": [
    { x_min:0.7661, y_min:0.3928, x_max:0.9475, y_max:0.4437, center_x:0.8568, center_y:0.4183 },
    { x_min:0.7665, y_min:0.4409, x_max:0.9478, y_max:0.4918, center_x:0.8571, center_y:0.4664 },
    { x_min:0.7665, y_min:0.5385, x_max:0.9478, y_max:0.5894, center_x:0.8571, center_y:0.5639 },
    { x_min:0.7665, y_min:0.5869, x_max:0.9478, y_max:0.6379, center_x:0.8571, center_y:0.6124 },
    { x_min:0.7661, y_min:0.6724, x_max:0.9475, y_max:0.7233, center_x:0.8568, center_y:0.6979 },
    { x_min:0.7661, y_min:0.7205, x_max:0.9475, y_max:0.7714, center_x:0.8568, center_y:0.7460 },
  ],
  "WATERS":            [{ x_min:0.3569, y_min:0.2446, x_max:0.3802, y_max:0.8653, center_x:0.3685, center_y:0.5549 }],
};

const CLICK_CATEGORIES = {
  "ALCOHOLIC BEVERAGES": ["Alcoholic Beverages","Beers","Ciders","Distilled Beverages","Hard Seltzers","Liqueurs","Perry","Premixed Alcoholic Beverages","Rum Based Cocktail","Sake","Whiskey Based Cocktail","Wine Based Drinks","Wines"],
  "BABY FOODS":          ["Baby Foods","Baby Milks","Cereals For Babies"],
  "BAKING MIXES":        ["Brownies Mixes","Cake Mixes","Cooking Helpers"],
  "BARS":                ["Bars","Candy Chocolate Bars","Cereal Bars","Energy Bars","Nut Bars"],
  "BREADS":              ["Bran Bread","Bread Crumbs","Bread Rolls","Breads","Croutons","Flatbreads","Frozen Breads","Gluten Free Breads","Packaged Breads","Rye Breads","Sliced Breads","Sourdough Breads","Toasts","White Breads","Wholemeal Breads"],
  "BREAKFAST CEREALS":   ["Breakfast Cereals","Cereal Flakes","Cereals With Caramel","Cereals With Fruits","Cereals With Nuts","Chocolate Cereals","Crunchy Cereal Clusters","Extruded Cereals","Mueslis","Porridge","Puffed Cereals"],
  "CAKES":               ["Cakes","Cheesecakes","Chocolate Cakes","Doughnuts","Muffins","Pound Cake","Sponge Cakes"],
  "CANDIES":             ["Candies","Candy Canes","Gummi Candies","Hard Candies","Lollipops","Marshmallows","Sugarfree Candies"],
  "CANNED FOOD":         ["Canned Foods","Canned Meals","Canned Plant Based Foods"],
  "CHOCOLATE":           ["Assorted Chocolates","Caramel Chocolates","Chocolates","Chocolates With Almonds","Chocolates With Hazelnuts","Dark Chocolates","Filled Chocolates","Flavoured Chocolates","Milk Chocolates","White Chocolates"],
  "COFFEES":             ["Arabica Coffees","Coffee Beans","Coffee Capsules","Coffees","Decaffeinated Coffees","Ground Coffees","Instant Coffees"],
  "CONDIMENTS":          ["Condiments","Gravy","Herbs And Spices","Mustards","Nutritional Yeast","Salts","Sauces","Vinegars"],
  "DAIRY":               ["Creams","Dairies","Dairy Desserts","Dairy Drinks","Fermented Milk Products","Milks"],
  "DELI":                ["Italian Meat Products","Pate","Prepared Meats","Sausages"],
  "DIPS":                ["Barbecue Sauces","Dips","Hot Sauces","Salad Dressings","Tzatzikis"],
  "DRIED FRUITS":        ["Dates","Dried Fruits","Dried Plant Based Foods","Raisins"],
  "EGGS":                ["Boiled Eggs","Chicken Eggs","Egg White","Eggs","Fresh Eggs","Hard Boiled Egg","Quail Eggs"],
  "FLOURS":              ["Bread Flours","Cassava Flour","Cereal Flours","Flours","Legume Flours","Nut Flours","Potato Flours","Tapioca Flours"],
  "FROZEN FOODS":        ["Frozen Foods","Frozen Fried Potatoes","Frozen Meals With Meat","Frozen Pizzas And Pies","Frozen Plant Based Foods","Frozen Ready Made Meals"],
  "FRUITS":              ["Apples","Berries","Cherries","Citrus","Figs","Fresh Fruits","Frozen Fruits","Fruits","Grapes","Pears","Plums","Tropical Fruits"],
  "HONEYS":              ["Acacia Honeys","Honeys"],
  "ICE CREAMS":          ["Ice Creams And Sorbets","Ice Pops","Mochi Ice Cream"],
  "JAMS":                ["Apple Jams","Apricot Jams","Berry Jams","Cherry Jams","Dietary Jams","Grape Jams","Jams","Low Sugar Fruit Jam","Mixed Fruit Jams","Peach Jams","Rhubarb Jams","Tropical Fruit Jams"],
  "MEATS":               ["Beef","Canned Meats","Frozen Meats","Ground Meats","Meats","Pork","Poultries","Steaks"],
  "PASTAS":              ["Chickpea Pasta","Conchiglie","Corn Pasta","Dry Pastas","Egg Pastas","Fresh Pasta","Frozen Pasta","Gluten Free Pasta","Gnocchi","Linguine","Noodles","Orecchiette","Pastas","Penne","Rigatoni","Spaghetti","Udon"],
  "RICES":               ["Aromatic Rices","Black Rices","Brown Rices","Long Grain Rices","Rices","Rices For Risotto","White Rices"],
  "SALTY SNACKS":        ["Appetizers","Salted Nuts","Salty Snacks"],
  "SEAFOOD":             ["Crustaceans","Fishes And Their Products","Frozen Seafood","Mollusc","Seafood","Seaweeds And Their Products"],
  "SODAS":               ["Colas","Diet Sodas","Fruit Sodas","Lemonade","Root Beers","Sodas","Tonic Water"],
  "SPICES":              ["Cinnamon","Cumin","Dried Herbs","Ginger","Paprika","Peppers","Vanilla"],
  "SPREADS":             ["Plant Based Spreads","Salted Spreads","Spreadable Fats","Spreads","Sweet Spreads"],
  "SUGARS":              ["Brown Sugars","Coconut Sugar","Granulated Sugars","Inverted Sugar Syrups","Maple Sugars","Palm Sugars","Powdered Sugars","Sugars"],
  "TEAS":                ["Black Teas","Decaffeinated Teas","Flavored Teas","Green Teas","Herbal Teas","Teas","White Teas"],
  "VEGETABLE OILS":      ["Cereal Oils","Mixed Vegetable Oils","Nut Oils","Olive Oils","Rapeseed Oils","Sunflower Oils","Vegetable Oil Sprays","Vegetable Oils"],
  "VEGETABLES":          ["Fresh Asparagus","Fresh Belgian Endives","Fresh Broccoli","Fresh Brussels Sprouts","Fresh Carrots","Fresh Cucumbers","Fresh Fennel Bulbs","Fresh Garlic","Fresh Green Beans","Fresh Mixed Vegetables","Fresh Mushrooms","Fresh Onions","Fresh Shallots","Fresh Spinachs","Fresh Sweet Peppers","Fresh Sweet Potatoes","Fresh Tomatoes","Fresh Vegetables","Fresh Zucchini"],
  "WATERS":              ["Carbonated Waters","Drinking Water","Flavored Waters","Mineral Waters","Waters"],
};

// Flat lookup: "fresh tomatoes" → "VEGETABLES"
const ITEM_TO_SECTION = {};
Object.entries(CLICK_CATEGORIES).forEach(([section, items]) => {
  items.forEach(item => { ITEM_TO_SECTION[item.toLowerCase()] = section; });
});

// Helpers

function normToPercent(normX, normY) {
  return {
    left: `${normX * 100}%`,
    top: `${((normY - Y_OFFSET) / 1.0) * 100}%`,
  };
}

function normToPercentRect(x_min, y_min, x_max, y_max) {
  return {
    left: `${x_min * 100}%`,
    top: `${((y_min - Y_OFFSET) / 1.0) * 100}%`,
    width: `${(x_max - x_min) * 100}%`,
    height: `${((y_max - y_min) / 1.0) * 100}%`,
  };
}

function getSectionCenter(sectionName) {
  const rects = SECTION_BOUNDS[sectionName];
  if (!rects) return null;
  const cx = rects.reduce((s, r) => s + r.center_x, 0) / rects.length;
  const cy = rects.reduce((s, r) => s + r.center_y, 0) / rects.length;
  return { cx, cy };
}

// Tooltip

function CategoryTooltip({ section, clickX, clickY, containerRef, onClose }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState(null);
  const items = CLICK_CATEGORIES[section] || [];

  // Position after first render so we know the tooltip dimensions
  const measuredRef = useCallback(node => {
    if (!node || !containerRef.current) return;
    tooltipRef.current = node;
    const container = containerRef.current;
    const cw = container.offsetWidth;
    const ch = container.offsetHeight;
    const tw = node.offsetWidth;
    const th = node.offsetHeight;

    let left = clickX + 14;
    let top  = clickY - 10;
    if (left + tw > cw - 6) left = clickX - tw - 14;
    if (top + th > ch - 6)  top  = ch - th - 6;
    if (top < 4)   top  = 4;
    if (left < 4)  left = 4;
    setPos({ left, top });
  }, [clickX, clickY, containerRef]);

  return (
    <div
      ref={measuredRef}
      style={{
        position: 'absolute',
        left: pos ? pos.left : clickX + 14,
        top:  pos ? pos.top  : clickY - 10,
        zIndex: 100,
        background: 'white',
        border: '2px solid #3CB371',
        borderRadius: '10px',
        boxShadow: '0 6px 28px rgba(0,0,0,0.15)',
        padding: '12px 14px',
        maxWidth: '230px',
        minWidth: '150px',
        pointerEvents: 'auto',
        opacity: pos ? 1 : 0,            // invisible until positioned
        animation: pos ? 'ttIn 0.14s ease-out forwards' : 'none',
      }}
    >
      {/* Header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
        <span style={{ fontSize:'11px', fontWeight:'800', color:'#3CB371', textTransform:'uppercase', letterSpacing:'0.6px' }}>
          {section}
        </span>
        <button
          onClick={onClose}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#bbb', fontSize:'17px', lineHeight:1, padding:'0 0 0 8px' }}
        >×</button>
      </div>

      {/* Item tags */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
        {items.map(item => (
          <span key={item} style={{
            fontSize:'11px',
            background:'#f0faf4',
            color:'#1a5c35',
            borderRadius:'4px',
            padding:'2px 7px',
            fontWeight:'500',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// StoreMap

export default function StoreMap() {
  const containerRef = useRef(null);
  const [tooltip,           setTooltip]           = useState(null);   // { section, x, y }
  const [hoveredSection,    setHoveredSection]    = useState(null);
  const [searchQuery,       setSearchQuery]       = useState('');
  const [searchDot,         setSearchDot]         = useState(null);   // { section, cx, cy, label }
  const [highlightSection,  setHighlightSection]  = useState(null);
  const [searchError,       setSearchError]       = useState('');

  // click on a section rect
  const handleRectClick = useCallback((section, e) => {
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({ section, x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHighlightSection(null);
    setSearchDot(null);
  }, []);

  // search
  const handleSearch = useCallback(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSearchDot(null); setSearchError(''); setHighlightSection(null); return; }

    // exact match
    let section = ITEM_TO_SECTION[q];

    // partial match (q contained in key, or first word of key in q)
    if (!section) {
      const key = Object.keys(ITEM_TO_SECTION).find(k => k.includes(q) || q.includes(k));
      if (key) section = ITEM_TO_SECTION[key];
    }

    if (section) {
      const c = getSectionCenter(section);
      setSearchDot({ section, cx: c.cx, cy: c.cy, label: searchQuery.trim() });
      setHighlightSection(section);
      setSearchError('');
      setTooltip(null);
    } else {
      setSearchDot(null);
      setHighlightSection(null);
      setSearchError(`"${searchQuery.trim()}" not found. Try a different item.`);
    }
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchDot(null);
    setSearchError('');
    setHighlightSection(null);
  };

  const dotPos = searchDot ? normToPercent(searchDot.cx, searchDot.cy) : null;

  return (
    <div style={s.page}>
      <style>{`
        @keyframes ttIn   { from{opacity:0;transform:scale(0.9) translateY(4px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes dotPop { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.45)} }
        @keyframes ring   { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.65} 100%{transform:translate(-50%,-50%) scale(3);opacity:0} }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Store Map</h2>
          <p style={s.subtitle}>Click any section to see what's stocked there, or search for a specific item.</p>
        </div>

        <div style={s.searchRow}>
          <div style={s.searchBox}>
            {/* magnifier */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              style={s.searchInput}
              placeholder="e.g. Fresh Tomatoes, Spaghetti, Milks…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && (
              <button onClick={clearSearch} style={s.clearBtn}>×</button>
            )}
          </div>
          <button onClick={handleSearch} style={s.findBtn}>Find</button>
        </div>
      </div>

      {/* Result / error banner */}
      {searchDot && (
        <div style={s.resultBanner}>
          <span>📍</span>
          <span style={{ fontSize:'13px', color:'#1a1a1a' }}>
            <strong>{searchDot.label}</strong> is in the <strong style={{ color:'#3CB371' }}>{searchDot.section}</strong> section
          </span>
          <button onClick={clearSearch} style={s.bannerClear}>Clear</button>
        </div>
      )}
      {searchError && (
        <div style={{ ...s.resultBanner, background:'#fff5f5', borderColor:'#ffc2c2' }}>
          <span style={{ fontSize:'13px', color:'#c62828' }}>{searchError}</span>
        </div>
      )}

      {/* Map */}
      <div style={s.mapOuter}>
        {/* aspect-ratio box: 1920 × 878 */}
        <div
          ref={containerRef}
          style={s.mapInner}
          onClick={() => { setTooltip(null); }}
        >
          {/* SVG image */}
          <img src={storeMapSvg} alt="Store Map" style={s.mapImg} draggable={false} />

          {/* Invisible clickable rects */}
          {Object.entries(SECTION_BOUNDS).map(([section, rects]) =>
            rects.map((rect, i) => {
              const hovered    = hoveredSection   === section;
              const highlighted = highlightSection === section;
              return (
                <div
                  key={`${section}-${i}`}
                  style={{
                    position: 'absolute',
                    ...normToPercentRect(rect.x_min, rect.y_min, rect.x_max, rect.y_max),
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    background: highlighted
                      ? 'rgba(60,179,113,0.20)'
                      : hovered
                        ? 'rgba(60,179,113,0.10)'
                        : 'transparent',
                    border: highlighted
                      ? '2px solid rgba(60,179,113,0.65)'
                      : hovered
                        ? '1.5px solid rgba(60,179,113,0.38)'
                        : '1.5px solid transparent',
                    borderRadius: '2px',
                    transition: 'background 0.13s, border-color 0.13s',
                  }}
                  onClick={e => handleRectClick(section, e)}
                  onMouseEnter={() => setHoveredSection(section)}
                  onMouseLeave={() => setHoveredSection(null)}
                />
              );
            })
          )}

          {/* Search dot */}
          {searchDot && dotPos && (
            <>
              <div style={{
                position:'absolute', left:dotPos.left, top:dotPos.top,
                width:'22px', height:'22px', borderRadius:'50%',
                background:'rgba(60,179,113,0.3)', border:'2px solid #3CB371',
                transform:'translate(-50%,-50%)',
                animation:'ring 1.5s ease-out infinite',
                pointerEvents:'none', zIndex:30,
              }}/>
              <div style={{
                position:'absolute', left:dotPos.left, top:dotPos.top,
                width:'13px', height:'13px', borderRadius:'50%',
                background:'#3CB371', border:'2.5px solid white',
                boxShadow:'0 2px 8px rgba(0,0,0,0.28)',
                transform:'translate(-50%,-50%)',
                animation:'dotPop 1.5s ease-in-out infinite',
                pointerEvents:'none', zIndex:31,
              }}/>
            </>
          )}

          {/* Tooltip */}
          {tooltip && (
            <CategoryTooltip
              section={tooltip.section}
              clickX={tooltip.x}
              clickY={tooltip.y}
              containerRef={containerRef}
              onClose={() => setTooltip(null)}
            />
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={s.legend}>
        <span style={s.legendDot}/>
        <span style={s.legendText}>Hover to highlight · Click to see items · Search to locate a product</span>
      </div>
    </div>
  );
}

// Styles

const s = {
  page: { display:'flex', flexDirection:'column', width:'100%', height:'100%', gap:'10px' },

  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'10px' },
  title:  { fontSize:'26px', fontWeight:'700', color:'#1e1e1e88', marginBottom:'2px' },
  subtitle: { fontSize:'13px', color:'#888' },

  searchRow:  { display:'flex', gap:'8px', alignItems:'center' },
  searchBox:  {
    display:'flex', alignItems:'center', gap:'8px',
    background:'white', border:'2px solid #e0e0e0', borderRadius:'22px',
    padding:'7px 14px', width:'300px',
    boxShadow:'0 1px 6px rgba(0,0,0,0.05)',
  },
  searchInput: { flex:1, border:'none', outline:'none', fontSize:'13px', color:'#1a1a1a', background:'transparent', minWidth:0 },
  clearBtn:    { background:'none', border:'none', cursor:'pointer', color:'#bbb', fontSize:'18px', lineHeight:1, padding:0, flexShrink:0 },
  findBtn: {
    background:'#3CB371', color:'white', border:'none', borderRadius:'22px',
    padding:'8px 20px', fontSize:'13px', fontWeight:'700', cursor:'pointer', flexShrink:0,
  },

  resultBanner: {
    display:'flex', alignItems:'center', gap:'8px',
    background:'#f0faf4', border:'1.5px solid #c8ecd4',
    borderRadius:'8px', padding:'8px 14px',
  },
  bannerClear: { marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:'13px', fontWeight:'600', padding:0 },

  mapOuter: {
    flex:1, minHeight:0,
    border:'1px solid #e4e4e4',
    borderRadius:'12px',
    overflow:'auto',
    boxShadow:'0 2px 12px rgba(0,0,0,0.06)',
  },
  mapInner: {
    position:'relative',
    width:'100%',
    paddingBottom:`${(878/1920)*100}%`,  // 45.73% — preserves aspect ratio
    overflow:'hidden',
    cursor:'default',
  },
  mapImg: {
    position:'absolute', top:0, left:0,
    width:'100%', height:'100%',
    objectFit:'fill',
    userSelect:'none', display:'block',
  },

  legend:    { display:'flex', alignItems:'center', gap:'7px', paddingBottom:'2px' },
  legendDot: { width:'9px', height:'9px', borderRadius:'50%', background:'#3CB371', flexShrink:0 },
  legendText:{ fontSize:'12px', color:'#bbb' },
};
