"use client"

import Script from "next/script"

export default function AffirmScript() {
  return (
    <>
      {/* SDK Affirm */}
      <Script
        src={process.env.NODE_ENV === "production"
          ? "https://cdn1.affirm.com/js/v2/affirm.js"
          : "https://cdn1-sandbox.affirm.com/js/v2/affirm.js"}
        strategy="afterInteractive"
        onLoad={() => {
          if (process.env.NODE_ENV === "development") {
            console.log("✅ Affirm SDK chargé avec succès")
          }
        }}
        onError={(e) => {
          console.error("❌ Erreur lors du chargement du SDK Affirm:", e)
        }}
      />

      {/* Configuration Affirm */}
      <Script
        id="affirm-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.affirmConfig = {
              public_api_key: "${process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_AFFIRM_PUBLIC_API_KEY || ""
                : process.env.NEXT_PUBLIC_AFFIRM_SANDBOX_PUBLIC_API_KEY || ""
              }",
              script: "${process.env.NODE_ENV === "production"
                ? "https://cdn1.affirm.com/js/v2/affirm.js"
                : "https://cdn1-sandbox.affirm.com/js/v2/affirm.js"
              }"
            };

            // Vérification du chargement avec retry
            document.addEventListener('DOMContentLoaded', function() {
              let checkCount = 0;
              const maxChecks = 20;
              
              const checkAffirm = () => {
                if (window.affirm) {
                  console.log('✅ Affirm SDK disponible');
                } else if (checkCount < maxChecks) {
                  checkCount++;
                  setTimeout(checkAffirm, 250);
                } else {
                  console.warn('⚠️ Affirm SDK non chargé après 5 secondes');
                }
              };
              
              setTimeout(checkAffirm, 100);
            });
          `
        }}
      />
    </>
  )
}
