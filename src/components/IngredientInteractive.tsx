// "use client";

// import React from "react";

// interface Ingredient {
//   name: string;
//   scientific: string;
//   source: string;
//   function: string;
//   description: string;
//   bgColor: string;
//   tint: string;
// }

// export default function IngredientInteractive() {
//   const ingredients: Ingredient[] = [
//     {
//       name: "Orchid Stem Cells",
//       scientific: "Calanthe Discolor Extract",
//       source: "Organic Japanese Calanthe Orchid",
//       function: "Cellular Communication Booster",
//       description: "Stimulates communication between skin stem cells and fibroblasts, boosting growth factors to lift sagging contours and fill deep lines from within.",
//       bgColor: "rgba(239, 230, 245, 0.4)",
//       tint: "rgba(215, 195, 235, 0.2)"
//     },
//     {
//       name: "Copper Peptides Complex",
//       scientific: "GHK-Cu Copper Tripeptide",
//       source: "Biocompatible Amino Acids",
//       function: "Collagen & Elastin Synthesizer",
//       description: "Mimics natural repair molecules, instructing skin to produce fresh collagen, micro-heal surface redness, and build epidermal density.",
//       bgColor: "rgba(220, 240, 245, 0.4)",
//       tint: "rgba(160, 215, 225, 0.2)"
//     },
//     {
//       name: "Centella Asiatica (Cica)",
//       scientific: "Madecassoside & Asiaticoside",
//       source: "Gotu Kola Botanical Leaf",
//       function: "Anti-Inflammatory Protector",
//       description: "A legendary botanical healer that instantly calms micro-inflammation, supports compromised skin barriers, and reduces skin reactivity.",
//       bgColor: "rgba(225, 235, 230, 0.4)",
//       tint: "rgba(180, 205, 190, 0.2)"
//     },
//     {
//       name: "Green Coffee Caffeine",
//       scientific: "Coffea Arabica Seed Extract",
//       source: "Moroccan Raw Coffee Bean",
//       function: "Micro-Circulation Drainer",
//       description: "A potent vasoconstrictor that improves lymphatic drainage under the eyes, reducing fluid retention, puffiness, and cellular sluggishness.",
//       bgColor: "rgba(245, 240, 230, 0.4)",
//       tint: "rgba(229, 200, 150, 0.2)"
//     },
//     {
//       name: "Moroccan Squalane",
//       scientific: "Hydrogenated Squalene",
//       source: "Cold-Pressed Spanish Olives",
//       function: "Biomimetic Lipid Shield",
//       description: "A ultra-stable dry oil that perfectly mirrors skin's natural sebum, absorbing instantly to lock in deep hydration without clogging pores.",
//       bgColor: "rgba(255, 255, 255, 0.4)",
//       tint: "rgba(0, 0, 0, 0.03)"
//     },
//     {
//       name: "Blue Tansy Absolute",
//       scientific: "Tanacetum Annuum Flower Oil",
//       source: "Steam-Distilled Moroccan Flowers",
//       function: "Azulene Redness Neutralizer",
//       description: "Rich in azulene, which gives it a natural deep blue hue. It neutralizes skin stress, relieves dry flakiness, and provides aromatic calmness.",
//       bgColor: "rgba(220, 230, 245, 0.4)",
//       tint: "rgba(170, 195, 235, 0.2)"
//     }
//   ];

//   return (
//     <section id="ingredients" style={{
//       padding: "100px 0",
//       backgroundColor: "var(--bg-primary)",
//       borderTop: "1px solid var(--border-color)"
//     }}>
//       <div className="container">
//         <div style={{ maxWidth: "600px", marginBottom: "60px" }}>
//           <span style={{
//             fontSize: "12px",
//             fontWeight: "600",
//             letterSpacing: "0.15em",
//             color: "var(--accent-pink)",
//             textTransform: "uppercase",
//             display: "block",
//             marginBottom: "12px"
//           }}>
//             Advanced Formulation Science
//           </span>
//           <h2 style={{
//             fontSize: "clamp(36px, 6vw, 56px)",
//             color: "var(--text-primary)",
//             lineHeight: "1.1",
//             marginBottom: "20px"
//           }}>
//             Every drop is active.
//           </h2>
//           <p style={{
//             fontSize: "16px",
//             lineHeight: "1.6",
//             color: "var(--text-secondary)"
//           }}>
//             We replace inactive fillers and water with pure botanical distillates and clinical cellular bio-actives. The result is biocompatible formulas that work in synergy with your skin.
//           </p>
//         </div>

//         {/* Ingredients Interactive Grid */}
//         <div className="grid-3">
//           {ingredients.map((ing) => (
//             <div 
//               key={ing.name}
//               className="ingredient-card"
//               style={{
//                 backgroundColor: "var(--bg-card)",
//                 border: "1px solid var(--border-color)",
//                 borderRadius: "20px",
//                 padding: "36px 28px",
//                 position: "relative",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 transition: "var(--transition-smooth)"
//               }}
//             >
//               {/* Dynamic Ripple Circle Background on Hover */}
//               <div 
//                 className="card-ripple" 
//                 style={{
//                   position: "absolute",
//                   bottom: "-30px",
//                   right: "-30px",
//                   width: "120px",
//                   height: "120px",
//                   borderRadius: "50%",
//                   backgroundColor: ing.tint,
//                   transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
//                   zIndex: 0
//                 }}
//               />

//               <div style={{ position: "relative", zIndex: 1 }}>
//                 <span style={{
//                   fontSize: "10px",
//                   fontWeight: "600",
//                   letterSpacing: "1.5px",
//                   textTransform: "uppercase",
//                   color: "var(--accent-pink)",
//                   display: "block",
//                   marginBottom: "8px"
//                 }}>
//                   {ing.function}
//                 </span>
                
//                 <h3 style={{
//                   fontSize: "24px",
//                   color: "var(--text-primary)",
//                   marginBottom: "4px"
//                 }}>
//                   {ing.name}
//                 </h3>
                
//                 <span style={{
//                   fontSize: "12px",
//                   fontStyle: "italic",
//                   color: "var(--text-secondary)",
//                   display: "block",
//                   marginBottom: "16px"
//                 }}>
//                   {ing.scientific}
//                 </span>

//                 <div style={{
//                   width: "24px",
//                   height: "1px",
//                   backgroundColor: "var(--border-color)",
//                   marginBottom: "20px"
//                 }} />

//                 <p style={{
//                   fontSize: "13.5px",
//                   lineHeight: "1.6",
//                   color: "var(--text-secondary)",
//                   marginBottom: "16px"
//                 }}>
//                   {ing.description}
//                 </p>

//                 <div style={{
//                   fontSize: "11px",
//                   fontWeight: "500",
//                   color: "var(--text-primary)"
//                 }}>
//                   Source: <span style={{ color: "var(--text-secondary)", fontWeight: "400" }}>{ing.source}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <style jsx global>{`
//         .ingredient-card:hover {
//           transform: translateY(-4px);
//           border-color: var(--accent-pink);
//           box-shadow: var(--shadow-md);
//         }

//         .ingredient-card:hover .card-ripple {
//           transform: scale(2.8);
//           background-color: ${`rgba(0,0,0,0.02)`}; /* fallback blend */
//         }
//       `}</style>
//     </section>
//   );
// }
