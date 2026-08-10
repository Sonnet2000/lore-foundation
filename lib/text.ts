/**
 * Itilitè pou afiche tèks senp (ki soti nan yon <textarea> — pa yon editè
 * rich-text/HTML) san danje, an konvèti sèl salt de ligne (\n) an <br/>.
 *
 * `content` / `description` yo se tèks bri ki soti nan yon <textarea> nan
 * panno admin. Yo pa t janm gen entansyon pou yo kenbe HTML — men si yon moun
 * (menm yon admin ki gen kont konpwomèt) tape/kole yon bagay tankou
 * "<script>...</script>" oswa "<img onerror=...>", `escapeHtml` anpeche l
 * egzekite lè paj piblik la afiche kontni an ak `dangerouslySetInnerHTML`.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Konvèti yon tèks senp an HTML ki san danje pou `dangerouslySetInnerHTML`:
 * 1) chape karaktè HTML yo (< > & " ') pou anpeche enjeksyon script/tag,
 * 2) apre sa, ranplase \n pa <br/> pou konsève sote-liy yo.
 */
export function safeTextToHtml(input: string): string {
  return escapeHtml(input).replace(/\n/g, "<br/>");
}
