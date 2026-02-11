# RNClinic API (Google Sheets)

שרת Python קטן שמתווך בין ה‑UI לבין Google Sheets.

## דרישות
- Python 3.10+
- יצירת Service Account בגוגל ושיתוף ה‑Sheet עם כתובת המייל שלו.

## התקנה והרצה
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app app run --port 5001
```

> חשוב: צריך לערוך את `server/.env` ולהכניס את `GOOGLE_SHEETS_ID`, נתיב ה-JSON של ה-Service Account, וגם `GOOGLE_SHEETS_INVENTORY_TAB`.

> חשוב: ה‑UI מדבר עם `http://127.0.0.1:5001/api`, אז בבדיקה ידנית השתמשו ב‑`http://127.0.0.1:5001/api/clients`

## תקלות נפוצות
### SyntaxError שמזכיר קוד JavaScript
אם אתם רואים שגיאה כמו:
```
SyntaxError: leading zeros in decimal integer literals are not permitted
```
בדרך כלל זה אומר שקובץ `server/app.py` הוחלף בטעות עם תוכן של `app.js`.
יש לוודא ש-`server/app.py` הוא קובץ Python מהפרויקט, ולא קובץ JavaScript.

## נקודות API בסיסיות
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/staff`
- `POST /api/staff`
- `GET /api/transplants`
- `POST /api/transplants`
- `GET /api/finance`
- `POST /api/finance`
- `GET /api/inventory`
- `POST /api/inventory`
- `PUT /api/inventory/<item_id>`

## שמות עמודות מומלצים (Headers)
### clients
`id`, `firstName`, `lastName`, `phone`, `email`, `treatment`, `status`

### staff
`id`, `firstName`, `lastName`, `role`, `employmentType`, `compensation`, `startDate`, `status`

### transplants
`date`, `time`, `client`, `type`, `grafts`, `price`, `leadDoctor`, `tech1`, `tech2`, `tech3`, `status`

### finance
`id`, `month`, `type`, `category`, `amount`, `notes`

### inventory
`id`, `itemName`, `category`, `sku`, `unit`, `quantity`, `minQuantity`, `supplier`, `cost`, `status`, `lastUpdated`, `notes`

> הערה: זו שכבת API ראשונית. אפשר להרחיב אימות, הרשאות, ולידציה לפי צורך.
