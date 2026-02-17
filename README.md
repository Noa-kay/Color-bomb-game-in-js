# פרויקט פורים – Color Bomb (JavaScript)

משחק דפדפן בסגנון Match-3 עם קופסאות צבעוניות ופצצות.
מטרת המשחק היא להסיר את כל הפצצות לפני שנגמרים המהלכים.

## מה יש בפרויקט
- עמוד בית: `files/Home.html`
- עמוד בחירת רמות: `files/levels.html`
- עמוד משחק: `files/game.html`
- עמוד הוראות: `files/Instructions.html`
- עמוד הפסד: `files/game-over.html`
- עמוד ניצחון: `files/winner.html`

## טכנולוגיות
- HTML
- CSS
- JavaScript (Vanilla)

## פיצ'רים מרכזיים
- בחירת רמת קושי (`Easy` / `Medium` / `Hard`)
- מערכת מהלכים וניקוד
- פצצות שנופלות ונעלמות בעת מעבר הקו
- מסכי ניצחון/הפסד
- סאונד למשחק ולפיצוצים

## מבנה תיקיות
- `files/` – כל קבצי הדפים, ה־CSS וה־JS
- `Extras/images/` – כל קבצי התמונות
- `Extras/sound/` – כל קבצי השמע

## הרצה מקומית
מהתיקייה הראשית של הפרויקט:

```bash
python3 -m http.server 8000
```

ואז לפתוח בדפדפן:

`http://127.0.0.1:8000/files/Home.html`

## הערה
הפרויקט מותאם לעבודה מקומית בדפדפן מודרני (Chrome/Edge/Firefox).