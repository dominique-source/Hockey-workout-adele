# Hockey Workout — Adèle 🏒

Application de workout hockey de 30 minutes pour Adèle.  
Puck handling + mouvements des pieds · 45 exercices · 20s travail / 20s repos · Voix française

## Stack

- **React 18** + **Vite 5**
- Zero dépendances UI externes — animations SVG custom
- Speech Synthesis API (voix française intégrée navigateur)
- Web Audio API (bips de compte à rebours)

---

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173

## Build de production

```bash
npm run build
npm run preview
```

---

## Déploiement GitHub → Vercel

1. Push sur `main` → Vercel déploie automatiquement
2. Les settings Vercel sont dans `vercel.json`

```bash
git add .
git commit -m "feat: hockey workout app"
git push origin main
```

---

## Structure du projet

```
src/
  App.jsx              — logique principale + layout
  exercises.js         — 45 exercices avec descriptions
  useVoice.js          — hook Speech Synthesis + Audio API
  index.css            — thème sombre neon
  components/
    StickFigure.jsx    — bonhommes allumettes animés SVG
    TimerRing.jsx      — anneau de compte à rebours
    FinishScreen.jsx   — écran de fin
```

---

## Instructions Claude Code

Colle ce qui suit dans Claude Code pour continuer le développement :

### Prompt de démarrage Claude Code

```
Je travaille sur l'app hockey-workout-adele.
Stack : React 18 + Vite 5, thème dark neon.
Fichiers clés :
- src/App.jsx — logique timer + layout
- src/exercises.js — 45 exercices
- src/useVoice.js — voix FR + bips
- src/components/StickFigure.jsx — animations SVG

Couleurs neon : #ff3cac (pink), #00f5ff (cyan), #f9f002 (yellow), #39ff14 (green), #b44aff (purple)
Police display : Bebas Neue
```

---

## Exercices couverts

| Catégorie | Couleur | Exemples |
|-----------|---------|---------|
| Mains seulement | `#ff3cac` | Figure en 8, croisé, dribble |
| Pieds + Mains | `#39ff14` | Pas chassé, saut latéral, reculons |
| Avec pont | `#00f5ff` | Slalom, entrée G/D, virage 180° |
