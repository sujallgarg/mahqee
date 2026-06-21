// "use client";

// import React from "react";
// import Link from "next/link";

// export default function CurlerBanner() {
//   return (
//     <section 
//       style={{
//         padding: "40px 0",
//         backgroundColor: "var(--bg-primary)",
//         width: "100%",
//         overflow: "hidden"
//       }}
//     >
//       {/* Banner Card - Full Widescreen Width */}
//       <div style={{
//         position: "relative",
//         width: "100%",
//         height: "550px",
//         overflow: "hidden",
//         borderTop: "1px solid var(--border-color)",
//         borderBottom: "1px solid var(--border-color)",
//         boxShadow: "var(--shadow-sm)"
//       }} className="curler-banner-card">
        
//         {/* Background Zoom Image Wrapper */}
//         <div 
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundImage: "url('/images/eyelash-curler-banner.jpg')",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
//             zIndex: 0,
//             opacity: 0.9,
//           }}
//           className="curler-banner-bg"
//         />

//         {/* Subtly darkened bottom overlay for text legibility */}
//         <div style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: "50%",
//           background: "linear-gradient(0deg, rgba(16, 34, 77, 0.15) 0%, transparent 100%)",
//           zIndex: 1,
//           pointerEvents: "none"
//         }} />

//         {/* Centered container to keep the CTA aligned with standard website layout bounds */}
//         <div className="container curler-card-container" style={{
//           height: "100%",
//           position: "relative",
//           zIndex: 2,
//           display: "flex",
//           alignItems: "flex-end",
//           paddingBottom: "60px",
//           pointerEvents: "none"
//         }}>
//           {/* Floating Glassmorphic CTA Box */}
//           <div style={{
//             backgroundColor: "rgba(255, 255, 255, 0.45)",
//             backdropFilter: "blur(20px)",
//             WebkitBackdropFilter: "blur(20px)",
//             borderRadius: "20px",
//             padding: "28px 32px",
//             maxWidth: "400px",
//             border: "1px solid rgba(255, 255, 255, 0.5)",
//             boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
//             transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             pointerEvents: "auto"
//           }} className="curler-glass-card">
//             <span style={{
//               fontSize: "11px",
//               fontWeight: "700",
//               letterSpacing: "0.15em",
//               color: "var(--accent-pink)",
//               textTransform: "uppercase",
//               display: "block",
//               marginBottom: "8px"
//             }}>
//               Now Available
//             </span>
            
//             <h2 style={{
//               fontSize: "28px",
//               color: "var(--text-primary)",
//               marginBottom: "12px",
//               fontFamily: "var(--font-serif)",
//               lineHeight: "1.2"
//             }}>
//               Precision Eyelash Curler
//             </h2>
            
//             <p style={{
//               color: "var(--text-secondary)",
//               fontSize: "13.5px",
//               lineHeight: "1.5",
//               marginBottom: "24px"
//             }}>
//               Designed for effortless, long-lasting lift and perfect lash definition without pinching.
//             </p>
            
//             <Link 
//               href="/shop?cat=tools" 
//               className="btn-primary" 
//               style={{
//                 borderRadius: "8px",
//                 padding: "12px 28px",
//                 fontSize: "13px",
//                 display: "inline-block",
//                 textAlign: "center"
//               }}
//             >
//               Shop Curler Now
//             </Link>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .curler-banner-card:hover .curler-banner-bg {
//           transform: scale(1.02);
//         }
//         .curler-banner-card:hover .curler-glass-card {
//           transform: translateY(-4px);
//           box-shadow: 0 15px 35px rgba(16, 34, 77, 0.08), 0 2px 10px rgba(0, 0, 0, 0.02);
//         }

//         @media (max-width: 768px) {
//           .curler-card-container {
//             padding: 0 !important;
//             height: auto !important;
//             display: block !important;
//           }
//           .curler-banner-card {
//             height: auto !important;
//             min-height: 480px;
//             display: flex;
//             flex-direction: column;
//             justify-content: flex-end;
//           }
//           .curler-glass-card {
//             position: relative !important;
//             margin: 24px !important;
//             max-width: calc(100% - 48px) !important;
//             padding: 24px !important;
//             background-color: rgba(255, 255, 255, 0.85) !important;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }
