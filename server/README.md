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
cat <<'EOF' > .env
GOOGLE_SHEETS_CREDENTIALS_JSON="/path/to/service-account.json"
GOOGLE_SHEETS_ID="your-sheet-id"
GOOGLE_SHEETS_CLIENTS_TAB="clients"
GOOGLE_SHEETS_STAFF_TAB="staff"
GOOGLE_SHEETS_TRANSPLANTS_TAB="transplants"
GOOGLE_SHEETS_FINANCE_TAB="finance"
EOF
export $(grep -v '^#' .env | xargs)
export GOOGLE_SHEETS_CREDENTIALS_JSON="/path/to/service-account.json"
export GOOGLE_SHEETS_ID="your-sheet-id"
export GOOGLE_SHEETS_CLIENTS_TAB="clients"
export GOOGLE_SHEETS_STAFF_TAB="staff"
export GOOGLE_SHEETS_TRANSPLANTS_TAB="transplants"
export GOOGLE_SHEETS_FINANCE_TAB="finance"
flask --app app run --port 5001
```

> חשוב: ה‑UI מדבר עם `http://127.0.0.1:5001/api`, אז בבדיקה ידנית השתמשו ב‑`http://127.0.0.1:5001/api/clients`

## נקודות API בסיסיות
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/staff`
- `POST /api/staff`
- `GET /api/transplants`
- `POST /api/transplants`
- `GET /api/finance`
- `POST /api/finance`

## שמות עמודות מומלצים (Headers)
### clients
`id`, `firstName`, `lastName`, `phone`, `email`, `treatment`, `status`

### staff
`id`, `firstName`, `lastName`, `role`, `employmentType`, `compensation`, `startDate`, `status`

### transplants
`date`, `time`, `client`, `type`, `grafts`, `price`, `leadDoctor`, `tech1`, `tech2`, `tech3`, `status`

### finance
`id`, `month`, `type`, `category`, `amount`, `notes`

> הערה: זו שכבת API ראשונית. אפשר להרחיב אימות, הרשאות, ולידציה לפי צורך.
