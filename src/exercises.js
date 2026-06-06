export const EXERCISES = [
  // ── Mains ─────────────────────────────────────────────────────────
  { name: "Figure en 8", cat: "h", color: "#ff3cac",
    desc: "Fais glisser la rondelle en forme de 8 devant toi, de gauche à droite, en alternant forehand et backhand.",
    anim: "figure8" },

  { name: "Passe latérale sous le pont", cat: "b", color: "#00f5ff",
    desc: "Envoie la rondelle sous le petit pont de gauche à droite et reprends-la de l'autre côté.",
    anim: "bridge_lateral" },

  { name: "Dribble devant-arrière", cat: "h", color: "#f9f002",
    desc: "Pousse la rondelle devant toi puis tire-la vers toi en alternant les deux côtés du bâton.",
    anim: "frontback" },

  { name: "Croisé forehand/backhand", cat: "h", color: "#ff3cac",
    desc: "Frappe forehand vers la droite, reviens backhand vers la gauche rapidement.",
    anim: "crossover" },

  { name: "Pas chassé + puck devant", cat: "p", color: "#39ff14",
    desc: "Pas chassé latéral de 2-3 pas pendant que tu contrôles la rondelle devant toi. Les pieds bougent, les mains restent stables.",
    anim: "chasse_front" },

  { name: "Pont — entrée côté gauche", cat: "b", color: "#00f5ff",
    desc: "Glisse la rondelle sous le pont en entrant par le côté gauche, récupère à droite.",
    anim: "bridge_left" },

  { name: "Pont — entrée côté droit", cat: "b", color: "#00f5ff",
    desc: "Glisse la rondelle sous le pont en entrant par le côté droit, récupère à gauche.",
    anim: "bridge_right" },

  { name: "Déplacement latéral + puck", cat: "p", color: "#39ff14",
    desc: "Déplace-toi latéralement (2 pas à gauche, 2 à droite) tout en maintenant la rondelle devant toi à portée de bâton.",
    anim: "lateral_move" },

  { name: "Figure en 8 rapide", cat: "h", color: "#ff3cac",
    desc: "Même mouvement qu'au début mais à vitesse maximale. Accélère les poignets, maintiens le contrôle.",
    anim: "figure8" },

  { name: "Pont + pas croisé", cat: "b", color: "#00f5ff",
    desc: "Envoie la rondelle sous le pont et fais un pas croisé en la récupérant de l'autre côté. Coordonne pieds et mains.",
    anim: "bridge_cross" },

  { name: "Dribble rapide deux mains", cat: "h", color: "#f9f002",
    desc: "Dribble très vite en alternant forehand et backhand sur place.",
    anim: "rapid_dribble" },

  { name: "Reculons + puck latéral", cat: "p", color: "#39ff14",
    desc: "Recule doucement tout en faisant un contrôle latéral de la rondelle devant toi. Regard devant.",
    anim: "backward_lateral" },

  { name: "Passe sous le pont D/G", cat: "b", color: "#00f5ff",
    desc: "Passe la rondelle alternativement sous le pont de droite à gauche et de gauche à droite. Cadence soutenue.",
    anim: "bridge_lateral" },

  { name: "Pont + virage 180°", cat: "b", color: "#ff6b00",
    desc: "Envoie la rondelle sous le pont, fais un pivot de 180° et récupère-la de l'autre côté.",
    anim: "bridge_turn" },

  { name: "Figure en 8 + variation", cat: "h", color: "#ff3cac",
    desc: "Figure en 8 avec une extension plus large : agrandis le mouvement, teste ta portée maximale de chaque côté.",
    anim: "figure8" },

  { name: "Pas chassé + puck côté", cat: "p", color: "#39ff14",
    desc: "Pas chassé latéral avec la rondelle tenue sur le côté du corps, pas devant.",
    anim: "chasse_side" },

  { name: "Pont — entrée arrière", cat: "b", color: "#00f5ff",
    desc: "Positionne-toi dos au pont et pousse la rondelle dessous à l'aveugle, puis pivote pour récupérer.",
    anim: "bridge_back" },

  { name: "Dribble devant-arrière rapide", cat: "h", color: "#f9f002",
    desc: "Version accélérée du dribble devant-arrière.",
    anim: "frontback" },

  { name: "Reculons + pont", cat: "b", color: "#ff6b00",
    desc: "Recule vers le pont et envoie la rondelle dessous en reculant. Récupère-la en repartant vers l'avant.",
    anim: "bridge_back" },

  { name: "Croisé de bâton rapide", cat: "h", color: "#ff3cac",
    desc: "Maximum de croisés forehand/backhand en 20 secondes. Compte mentalement, dépasse ton record.",
    anim: "crossover" },

  { name: "Figure en 8 relâchée", cat: "h", color: "#ff3cac",
    desc: "Figure en 8 à vitesse modérée pour récupérer. Concentre-toi sur la fluidité du poignet, pas la vitesse.",
    anim: "figure8" },

  { name: "Passe latérale sous le pont (sprint)", cat: "b", color: "#00f5ff",
    desc: "Retour aux passes latérales sous le pont. Essaie de battre ton rythme du début de session.",
    anim: "bridge_lateral" },

  { name: "Pas chassé + puck devant (intensif)", cat: "p", color: "#39ff14",
    desc: "Reprends le pas chassé avec puck devant. À cette étape, maintiens l'intensité malgré la fatigue.",
    anim: "chasse_front" },

  { name: "Reculons + puck latéral (accéléré)", cat: "p", color: "#39ff14",
    desc: "Reculons avec contrôle latéral, version accélérée. Garde la tête haute, ne regarde pas la rondelle.",
    anim: "backward_lateral" },

  { name: "Figure en 8 — explosion", cat: "h", color: "#ff3cac",
    desc: "Figure en 8 à vitesse maximale absolue pendant 20 secondes. Tout donner.",
    anim: "figure8" },

  { name: "Pont — entrée gauche rapide", cat: "b", color: "#00f5ff",
    desc: "Entrée côté gauche sous le pont, vitesse maximale. Répète autant de fois que possible.",
    anim: "bridge_left" },

  { name: "Déplacement latéral + puck devant (intensif)", cat: "p", color: "#39ff14",
    desc: "Déplacement latéral avec puck — version intensive. Plus d'amplitude dans les déplacements.",
    anim: "lateral_move" },

  { name: "Dribble rapide deux mains", cat: "h", color: "#f9f002",
    desc: "Avant-dernière série de dribbles rapides gauche droite. Maintiens l'intensité jusqu'au bout.",
    anim: "rapid_dribble" },

  { name: "Figure en 8 — FINISSEUR", cat: "h", color: "#ff3cac",
    desc: "DERNIER EXERCICE ! Figure en 8 à fond. Laisse tout sur le plancher !",
    anim: "figure8" },
];

export const CAT_LABEL = { h: "Mains", p: "Pieds + Mains", b: "Avec pont" };
export const CAT_COLOR = { h: "#ff3cac", p: "#39ff14", b: "#00f5ff" };
