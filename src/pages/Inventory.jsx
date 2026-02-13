// Inventory.jsx
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { data } from "../constants/data";
import FloorComparisonPanel from "../components/FloorComparisonPanel";
import NavigationBar from "../components/Nav";
import Loader from "../components/Loader";
import OrientationLock from "../components/OrientationLock";

export default function Inventory() {
  const [layers] = useState(data);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [floorCentroids, setFloorCentroids] = useState({});
  const [showComparison, setShowComparison] = useState(false);
  const [lockedFloor, setLockedFloor] = useState(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const svgRef = useRef(null);

  // Initialize debug transforms from the actual data
  const [debugTransforms, setDebugTransforms] = useState(() => {
    const initial = {};
    data.forEach((layer) => {
      if (layer.customTransform) {
        initial[layer.path_id] = {
          translateX: layer.customTransform.translateX || 0,
          translateY: layer.customTransform.translateY || 0,
          scale: layer.customTransform.scale || 1,
        };
      }
    });
    return initial;
  });

  // Toggle debug panel with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setShowDebugPanel((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Calculate centroid of each floor path
  useEffect(() => {
    const centroids = {};

    layers.forEach((layer) => {
      if (layer.d && layer.floor_number !== undefined) {
        const pathElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        pathElement.setAttribute("d", layer.d);

        try {
          const bbox = pathElement.getBBox();
          centroids[layer.path_id] = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2,
            floorNumber: layer.floor_number,
          };
        } catch (e) {
          console.warn(`Could not calculate centroid for ${layer.path_id}`);
        }
      }
    });

    setFloorCentroids(centroids);
  }, [layers]);

  const getClassColor = useCallback((layer) => {
    const classColors = {
      "cls-1": "rgba(29, 41, 56, 0.60)",
      "cls-2": "rgba(29, 41, 56, 0.60)",
      "cls-3": "rgba(29, 41, 56, 0.60)",
      "cls-4": "#f3ea0b",
      "cls-5": "#f7ec13",
      "cls-6": "#f4ea11",
      "cls-7": "rgba(181, 209, 141, 0.60)",
      "cls-8": "#3b4b9f",
      "cls-9": "rgba(204, 256, 252, 0.60)",
    };
    return classColors[layer.class] || "#d0aa2d";
  }, []);

  const getFill = useCallback(
    (layer) => {
      const active =
        selectedLayer === layer.path_id || hoveredLayer === layer.path_id;
      return active ? getClassColor(layer) : "rgba(0, 0, 0, 0.1)";
    },
    [selectedLayer, hoveredLayer, getClassColor]
  );

  const getOpacity = useCallback(
    (layer) => {
      const active =
        selectedLayer === layer.path_id || hoveredLayer === layer.path_id;
      return active ? 0.9 : 1;
    },
    [selectedLayer, hoveredLayer]
  );

  const handleLayerMouseEnter = useCallback((pathId) => {
    setHoveredLayer(pathId);
  }, []);

  const handleLayerMouseLeave = useCallback(() => {
    setHoveredLayer(null);
  }, []);

  const handleLayerClick = useCallback((layer) => {
    if (["cls-1", "cls-2", "cls-3"].includes(layer.class)) {
      const floor = {
        id: layer.path_id,
        d: layer.d,
        floor_number: layer.floor_number,
        info: {
          bhk: layer.bhk || "Duplex",
          floorNumber: layer.floor_number,
          price: layer.price || "XX Cr",
          area: layer.area || "XXXX sq.ft",
          availability: layer.availability !== false,
        },
      };

      setLockedFloor(floor);
      setShowComparison(true);
    }

    setSelectedLayer((prev) =>
      prev === layer.path_id ? null : layer.path_id
    );
  }, []);

  const closeComparison = useCallback(() => {
    setShowComparison(false);
    setLockedFloor(null);
  }, []);

  // Check if a layer has custom transform (either in data or debug state)
  const hasCustomTransform = useCallback(
    (layer) => {
      return layer.customTransform || debugTransforms[layer.path_id];
    },
    [debugTransforms]
  );

  // Get transform string for a layer - uses debug values which update live
  const getLayerTransform = useCallback(
    (layer) => {
      // Prefer debug transforms (they update live)
      if (debugTransforms[layer.path_id]) {
        const { translateX, translateY, scale } = debugTransforms[layer.path_id];
        return `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      }
      // Fall back to layer's customTransform
      if (layer.customTransform) {
        const { translateX, translateY, scale } = layer.customTransform;
        return `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      }
      return null;
    },
    [debugTransforms]
  );

  // Update debug transform value
  const updateDebugTransform = (pathId, property, value) => {
    setDebugTransforms((prev) => ({
      ...prev,
      [pathId]: {
        ...prev[pathId],
        [property]: parseFloat(value) || 0,
      },
    }));
  };

  // Copy current debug values to clipboard
  const copyDebugValues = () => {
    const output = Object.entries(debugTransforms)
      .map(([pathId, transform]) => {
        const layer = layers.find((l) => l.path_id === pathId);
        const floorName = layer
          ? layer.floor_number === 0
            ? "Ground Floor"
            : layer.floor_number === 21
            ? "Terrace"
            : `Floor ${layer.floor_number}`
          : pathId;
        return `// ${floorName} (${pathId})\ncustomTransform: {\n  translateX: ${transform.translateX},\n  translateY: ${transform.translateY},\n  scale: ${transform.scale},\n}`;
      })
      .join("\n\n");
    navigator.clipboard.writeText(output);
    alert("Debug values copied to clipboard!");
  };

  // Get display name for floor number
  const getFloorDisplayName = (floorNumber) => {
    if (floorNumber === 0) return "G";
    if (floorNumber === 21) return "T";
    return floorNumber;
  };

  // Separate layers into those with custom transforms and those without
  const regularLayers = useMemo(
    () => layers.filter((layer) => !hasCustomTransform(layer)),
    [layers, hasCustomTransform]
  );
  
  const customTransformLayers = useMemo(
    () => layers.filter((layer) => hasCustomTransform(layer)),
    [layers, hasCustomTransform]
  );

  return (
    <>
      <OrientationLock />
      <Loader>
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#dedbd4] font-futura-bk">
          {/* Logo */}
          <div className="fixed top-4 right-10 z-40">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-30 md:h-30 object-contain"
            />
          </div>
          <div className="absolute top-3 sm:top-10 sm:left-50 md:top-10 md:left-60 xl:top-0 lg:left-1/2 -translate-x-1/2 z-40 cursor-pointer hover:scale-105 transition-transform duration-300 font-balgin font-bold uppercase flex flex-col ">
            <img
              src="/images/Cliff-tower.png"
              alt="Rustomjee"
              className={`w-auto h-12 sm:h-20 md:h-25 lg:h-30 xl:h-35 2xl:h-40 3xl:h-60 4xl:h-90`}
            />
          </div>

          {/* Debug Positioning Panel */}
          {showDebugPanel && (
            <div className="fixed top-20 left-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 w-80 max-h-[80vh] overflow-y-auto border border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  SVG Position Debug
                </h3>
                <button
                  onClick={() => setShowDebugPanel(false)}
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600"
                >
                  ×
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Press <kbd className="bg-gray-200 px-1 rounded">Ctrl+Shift+D</kbd> to toggle
              </p>

              {Object.keys(debugTransforms).length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>No custom transform floors found.</strong>
                  <p className="mt-2">
                    Add <code>customTransform</code> property to floors in your data.js to enable positioning.
                  </p>
                </div>
              ) : (
                Object.entries(debugTransforms).map(([pathId, transform]) => {
                  const layer = layers.find((l) => l.path_id === pathId);
                  const floorName = layer
                    ? layer.floor_number === 0
                      ? "Ground Floor"
                      : layer.floor_number === 21
                      ? "Terrace"
                      : `Floor ${layer.floor_number}`
                    : pathId;

                  return (
                    <div key={pathId} className="mb-6 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        {floorName}
                        <span className="text-xs text-gray-400 ml-2">({pathId})</span>
                      </h4>

                      {/* Translate X */}
                      <div className="mb-3">
                        <label className="block text-xs text-gray-600 mb-1">
                          Translate X: <strong>{transform.translateX}</strong>
                        </label>
                        <input
                          type="range"
                          min="-500"
                          max="4000"
                          step="10"
                          value={transform.translateX}
                          onChange={(e) =>
                            updateDebugTransform(pathId, "translateX", e.target.value)
                          }
                          className="w-full"
                        />
                        <input
                          type="number"
                          value={transform.translateX}
                          onChange={(e) =>
                            updateDebugTransform(pathId, "translateX", e.target.value)
                          }
                          className="w-full mt-1 px-2 py-1 text-sm border rounded"
                        />
                      </div>

                      {/* Translate Y */}
                      <div className="mb-3">
                        <label className="block text-xs text-gray-600 mb-1">
                          Translate Y: <strong>{transform.translateY}</strong>
                        </label>
                        <input
                          type="range"
                          min="-500"
                          max="4000"
                          step="10"
                          value={transform.translateY}
                          onChange={(e) =>
                            updateDebugTransform(pathId, "translateY", e.target.value)
                          }
                          className="w-full"
                        />
                        <input
                          type="number"
                          value={transform.translateY}
                          onChange={(e) =>
                            updateDebugTransform(pathId, "translateY", e.target.value)
                          }
                          className="w-full mt-1 px-2 py-1 text-sm border rounded"
                        />
                      </div>

                      {/* Scale */}
                      <div className="mb-2">
                        <label className="block text-xs text-gray-600 mb-1">
                          Scale: <strong>{transform.scale}</strong>
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="30"
                          step="0.1"
                          value={transform.scale}
                          onChange={(e) =>
                            updateDebugTransform(pathId, "scale", e.target.value)
                          }
                          className="w-full"
                        />
                        <input
                          type="number"
                          value={transform.scale}
                          onChange={(e) =>
                            updateDebugTransform(pathId, "scale", e.target.value)
                          }
                          className="w-full mt-1 px-2 py-1 text-sm border rounded"
                          step="0.1"
                        />
                      </div>
                    </div>
                  );
                })
              )}

              {Object.keys(debugTransforms).length > 0 && (
                <>
                  <button
                    onClick={copyDebugValues}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Copy Values to Clipboard
                  </button>

                  <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    <strong>Tip:</strong> After positioning, copy the values and update your data.js file with the customTransform values.
                  </div>
                </>
              )}
            </div>
          )}

          {/* Building SVG */}
          <div className="fixed inset-0 w-full h-full flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 6826 3840"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              style={{ shapeRendering: "optimizeSpeed", pointerEvents: "auto" }}
            >
              <image
                href="/images/3.3.1.jpg"
                x="0"
                y="0"
                width="6826"
                height="3840"
                preserveAspectRatio="xMidYMid slice"
              />

              {/* Regular layers with default group transform */}
              <g style={{ transform: "translate(2050px, -10px) scale(0.85)" }}>
                {regularLayers.map((layer) => (
                  <path
                    key={layer.path_id}
                    id={layer.path_id}
                    d={layer.d}
                    fill={getFill(layer)}
                    stroke="none"
                    strokeWidth="0"
                    opacity={getOpacity(layer)}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 120ms ease-out, fill 120ms ease-out",
                    }}
                    onMouseEnter={() => handleLayerMouseEnter(layer.path_id)}
                    onMouseLeave={handleLayerMouseLeave}
                    onClick={() => handleLayerClick(layer)}
                  />
                ))}

                {/* Glowing Floor Numbers - Only show on hover for regular layers */}
                {hoveredLayer &&
                  floorCentroids[hoveredLayer] &&
                  !hasCustomTransform(
                    layers.find((l) => l.path_id === hoveredLayer)
                  ) && (
                    <g>
                      <text
                        x={-100}
                        y={1500}
                        textAnchor="start"
                        dominantBaseline="middle"
                        className="floor-number-glow font-futura-bk"
                        style={{
                          fontSize: "700px",
                          fontWeight: "bold",
                          fill: "rgba(0, 0, 20, 0.4)",
                          pointerEvents: "none",
                        }}
                      >
                        {floorCentroids[hoveredLayer].floorNumber}
                      </text>
                    </g>
                  )}
              </g>

              {/* Custom transform layers - each with their own transform (updates live from debug panel) */}
              {customTransformLayers.map((layer) => (
                <g
                  key={layer.path_id}
                  style={{ transform: getLayerTransform(layer) }}
                >
                  <path
                    id={layer.path_id}
                    d={layer.d}
                    fill={getFill(layer)}
                    stroke="none"
                    strokeWidth="0"
                    opacity={getOpacity(layer)}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 120ms ease-out, fill 120ms ease-out",
                    }}
                    onMouseEnter={() => handleLayerMouseEnter(layer.path_id)}
                    onMouseLeave={handleLayerMouseLeave}
                    onClick={() => handleLayerClick(layer)}
                  />
                </g>
              ))}

              {/* Glowing Floor Numbers for custom transform layers */}
              {hoveredLayer &&
                floorCentroids[hoveredLayer] &&
                hasCustomTransform(
                  layers.find((l) => l.path_id === hoveredLayer)
                ) && (
                  <g style={{ transform: "translate(2050px, -10px) scale(0.85)" }}>
                    <text
                      x={-100}
                      y={1500}
                      textAnchor="start"
                      dominantBaseline="middle"
                      className="floor-number-glow font-futura-bk"
                      style={{
                        fontSize: "700px",
                        fontWeight: "bold",
                        fill: "rgba(0, 0, 20, 0.4)",
                        pointerEvents: "none",
                      }}
                    >
                      {getFloorDisplayName(floorCentroids[hoveredLayer].floorNumber)}
                    </text>
                  </g>
                )}

              {/* SVG Filter for Blue Glow Effect */}
              <defs>
                <filter
                  id="blue-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="10" result="coloredBlur" />
                  <feFlood floodColor="#3b4b9f" floodOpacity="0.8" />
                  <feComposite in2="coloredBlur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode />
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>

          {showComparison && (
            <FloorComparisonPanel
              show={showComparison}
              onClose={closeComparison}
              floors={data}
              lockedFloor={lockedFloor}
            />
          )}
          <NavigationBar className="!opacity-100" />
        </div>
      </Loader>
    </>
  );
}