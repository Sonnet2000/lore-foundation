import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Tu es un rédacteur professionnel pour le blog de Loré Foundation, une fondation haïtienne basée à Cap-Haïtien dont la mission est : "Améliorer la vie des gens à travers l'éducation, la formation digitale, le développement des jeunes, le leadership, l'innovation et l'action communautaire." Slogan : "Former. Inspirer. Transformer."

Règles impératives :
- Écris en français, ton inspirant, professionnel mais chaleureux et accessible
- L'article doit avoir un lien clair avec la mission de Loré Foundation (éducation, technologie, leadership, jeunesse, communauté en Haïti) — même si le sujet de départ est plus large (ex: IA, entrepreneuriat), ramène toujours à l'impact concret sur la jeunesse haïtienne ou la communauté
- Structure avec des titres ## et ### en Markdown
- Utilise des listes à puces quand pertinent
- Inclus des exemples concrets liés à Haïti quand possible
- Évite le jargon technique inutile — écris pour un public large
- Longueur : 600 à 900 mots
- Termine par un paragraphe d'appel à l'action invitant à découvrir les programmes de Loré Foundation ou à devenir partenaire

Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, au format exact suivant :
{
  "title": "Titre accrocheur de l'article (60-80 caractères)",
  "excerpt": "Résumé accrocheur de 1-2 phrases (150-250 caractères)",
  "content": "Contenu complet en Markdown avec ## et ### pour les titres",
  "category": "une seule valeur parmi: technologie, education, ia, entrepreneuriat, activites, actualites, leadership",
  "tags": ["3 à 5 tags pertinents en minuscules"],
  "read_time_minutes": un nombre entre 3 et 8
}`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY manquant. Ajoutez-le dans les variables Vercel." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const topic = (body.topic ?? "").trim();
    const category = body.category ?? "";

    const userPrompt = topic
      ? `Écris un article de blog sur le sujet suivant : "${topic}"${category ? ` (catégorie suggérée : ${category})` : ""}.`
      : `Choisis toi-même un sujet pertinent et inspirant en lien avec la mission de Loré Foundation (éducation, technologie, leadership, jeunesse, communauté haïtienne) et écris un article de blog complet à ce sujet.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Erreur API Claude (${res.status}): ${errText.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    const rawText = data.content?.[0]?.text ?? "";

    // Nettoyer et parser le JSON (au cas où Claude ajoute des ```json fences)
    const cleaned = rawText.replace(/```json\s*|\s*```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Réponse IA invalide. Réessayez." },
        { status: 500 }
      );
    }

    // Validation basique
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

    return NextResponse.json({ item: result });

  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
