import { NextResponse } from "next/server";

const SYSTEM_CONTEXT = `Tu es un rédacteur professionnel pour le blog de Loré Foundation, une fondation haïtienne basée à Cap-Haïtien dont la mission est : "Améliorer la vie des gens à travers l'éducation, la formation digitale, le développement des jeunes, le leadership, l'innovation et l'action communautaire." Slogan : "Former. Inspirer. Transformer."

Le blog couvre deux types de contenu :
1. Des articles sur les activités et programmes propres à Loré Foundation
2. Des articles d'actualité et d'analyse sur le monde — technologie, intelligence artificielle, éducation, entrepreneuriat, innovation sociale — basés sur des informations RÉELLES ET RÉCENTES, qui informent et inspirent les lecteurs.`;

const WRITING_RULES = `Règles impératives :
- Écris en français, ton journalistique, informé, professionnel et accessible
- Base-toi UNIQUEMENT sur les informations réelles et vérifiées trouvées via la recherche — ne complète jamais avec des faits inventés
- Si une information n'est pas confirmée par la recherche, ne l'affirme pas
- Structure avec des titres ## et ### en Markdown
- Utilise des listes à puces quand pertinent
- Évite le jargon technique inutile — écris pour un public large et curieux
- Longueur : 600 à 1000 mots
- Le dernier paragraphe peut être une réflexion, une conclusion, ou (si pertinent) une invitation à découvrir Loré Foundation — selon ce qui convient naturellement au sujet`;

function getApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY manquant. Ajoutez-le dans les variables Vercel.");
  return key;
}

export async function POST(request: Request) {
  try {
    const apiKey = getApiKey();
    const body = await request.json().catch(() => ({}));
    const topic = (body.topic ?? "").trim();
    const category = body.category ?? "";
    const useSearch = body.use_search !== false; // activé par défaut

    // ── ÉTAPE 1 : Recherche d'actualités récentes via Google Search grounding ──
    let researchNotes = "";
    let sources: { title: string; uri: string }[] = [];

    if (useSearch) {
      const searchPrompt = topic
        ? `Recherche des informations récentes et fiables sur : "${topic}". Donne-moi 5 points factuels précis trouvés en ligne (dates, chiffres, faits vérifiés). Sois concis.`
        : `Trouve UNE actualité récente et intéressante dans un de ces domaines : technologie, IA, éducation, entrepreneuriat. Résume en 4-5 points factuels précis (dates, faits vérifiés). Sois concis.`;

      const searchRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: searchPrompt }] }],
            tools: [{ google_search: {} }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
          }),
        }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        researchNotes = (searchData.candidates?.[0]?.content?.parts?.[0]?.text ?? "").slice(0, 1500);
        const groundingChunks = searchData.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        sources = groundingChunks
          .map((c: { web?: { title?: string; uri?: string } }) => ({
            title: c.web?.title ?? "",
            uri: c.web?.uri ?? "",
          }))
          .filter((s: { uri: string }) => s.uri)
          .slice(0, 5);
      } else if (searchRes.status === 429) {
        return NextResponse.json(
          { error: "Limite quotidienne Gemini atteinte (tier gratuit). Réessayez dans quelques minutes ou demain." },
          { status: 429 }
        );
      }
      // Si la recherche échoue pour une autre raison, on continue sans (fallback connaissance du modèle)
    }

    // ── ÉTAPE 2 : Rédaction structurée de l'article en JSON ──
    const writingPrompt = topic
      ? `${SYSTEM_CONTEXT}\n\n${WRITING_RULES}\n\n${researchNotes ? `Voici des informations récentes et vérifiées trouvées par recherche web :\n${researchNotes}\n\nÉcris maintenant un article de blog complet sur "${topic}"${category ? ` (catégorie : ${category})` : ""} en te basant sur ces informations.` : `Écris un article de blog sur "${topic}"${category ? ` (catégorie : ${category})` : ""}.`}`
      : `${SYSTEM_CONTEXT}\n\n${WRITING_RULES}\n\n${researchNotes ? `Voici des informations récentes et vérifiées trouvées par recherche web :\n${researchNotes}\n\nÉcris maintenant un article de blog complet basé sur ces informations d'actualité.` : `Choisis un sujet pertinent lié à l'éducation, la technologie ou Loré Foundation et écris un article complet.`}`;

    const jsonFormatInstruction = `\n\nRéponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans balises markdown \`\`\`json, au format exact suivant :
{
  "title": "Titre accrocheur de l'article (60-80 caractères)",
  "excerpt": "Résumé accrocheur de 1-2 phrases (150-250 caractères)",
  "content": "Contenu complet en Markdown avec ## et ### pour les titres",
  "category": "une seule valeur parmi: technologie, education, ia, entrepreneuriat, activites, actualites, leadership",
  "tags": ["3 à 5 tags pertinents en minuscules"],
  "read_time_minutes": un nombre entre 3 et 8,
  "image_keywords": "2 à 4 mots-clés en anglais décrivant une image qui illustrerait bien le sujet"
}`;

    const writeRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: writingPrompt + jsonFormatInstruction }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!writeRes.ok) {
      const errText = await writeRes.text();
      if (writeRes.status === 429) {
        return NextResponse.json(
          { error: "Limite quotidienne Gemini atteinte (tier gratuit). Réessayez dans quelques minutes ou demain." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `Erreur API Gemini (${writeRes.status}): ${errText.slice(0, 250)}` },
        { status: 500 }
      );
    }

    const writeData = await writeRes.json();
    const rawText: string = writeData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText) {
      return NextResponse.json({ error: "Gemini n'a renvoyé aucun contenu. Réessayez." }, { status: 500 });
    }

    const cleaned = rawText.replace(/```json\s*|\s*```/g, "").trim();

    // Essayer d'extraire un objet JSON même si du texte l'entoure
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Chercher un bloc JSON dans le texte (entre { et })
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          // Si toujours invalide, demander une correction à Gemini
          const fixRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{
                  role: "user",
                  parts: [{ text: `Le texte suivant contient un article de blog mais n'est pas un JSON valide. Extrais les informations et retourne UNIQUEMENT un objet JSON valide dans ce format exact, sans aucun texte avant ou après :\n{"title":"...","excerpt":"...","content":"...","category":"actualites","tags":["tag1"],"read_time_minutes":5,"image_keywords":"keyword"}\n\nTexte à convertir:\n${rawText.slice(0, 3000)}` }],
                }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 4096, responseMimeType: "application/json" },
              }),
            }
          );
          if (fixRes.ok) {
            const fixData = await fixRes.json();
            const fixText = fixData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            try { parsed = JSON.parse(fixText.replace(/```json\s*|\s*```/g, "").trim()); }
            catch { return NextResponse.json({ error: "Réponse IA invalide après correction. Réessayez." }, { status: 500 }); }
          } else {
            return NextResponse.json({ error: "Réponse IA invalide (JSON mal formé). Réessayez." }, { status: 500 });
          }
        }
      } else {
        return NextResponse.json({ error: "Réponse IA invalide (JSON mal formé). Réessayez." }, { status: 500 });
      }
    }

    const VALID_CATEGORIES = ["technologie", "education", "ia", "entrepreneuriat", "activites", "actualites", "leadership"];
    const result = {
      title:             String(parsed.title ?? "").slice(0, 150),
      excerpt:           String(parsed.excerpt ?? "").slice(0, 300),
      content:           String(parsed.content ?? ""),
      category:          VALID_CATEGORIES.includes(parsed.category) ? parsed.category : "actualites",
      tags:              Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5).map(String) : [],
      read_time_minutes: Number(parsed.read_time_minutes) || 5,
    };

    if (!result.title || !result.content) {
      return NextResponse.json({ error: "L'IA n'a pas généré de contenu valide." }, { status: 500 });
    }

    // Ajouter les sources en bas de l'article si on a fait une recherche
    if (sources.length > 0) {
      const sourcesText = sources
        .filter(s => s.title && s.uri)
        .map(s => `- [${s.title}](${s.uri})`)
        .join("\n");
      if (sourcesText) {
        result.content += `\n\n## Sources\n\n${sourcesText}`;
      }
    }

    // ── Recherche d'une image de couverture pertinente via Unsplash ──
    let cover_url: string | null = null;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
      try {
        const searchQuery = String(parsed.image_keywords ?? (result.tags.join(" ") || result.category));
        const imgRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
          { headers: { Authorization: `Client-ID ${unsplashKey}` } }
        );
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          cover_url = imgData.results?.[0]?.urls?.regular ?? null;
        }
      } catch { /* pas bloquant */ }
    }

    return NextResponse.json({
      item: { ...result, cover_url },
      used_search: useSearch && !!researchNotes,
      sources_count: sources.length,
    });

  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
