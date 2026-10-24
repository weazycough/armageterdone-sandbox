// theme.ts — the saved light/dark choice. Plain TS (no JSX) so the build
// scripts can import it too.

export const THEME_KEY = "cc-theme";

/** Runs in <head> before paint: applies a saved theme choice. */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
