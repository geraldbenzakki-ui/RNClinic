import os
from typing import Dict, List, Sequence

import gspread
from google.oauth2.service_account import Credentials
from gspread.utils import rowcol_to_a1


def _get_client() -> gspread.Client:
    credentials_path = os.getenv("GOOGLE_SHEETS_CREDENTIALS_JSON")
    if not credentials_path:
        raise RuntimeError("Missing GOOGLE_SHEETS_CREDENTIALS_JSON")

    scopes = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_file(credentials_path, scopes=scopes)
    return gspread.authorize(creds)


def _get_sheet(sheet_name: str) -> gspread.Worksheet:
    sheet_id = os.getenv("GOOGLE_SHEETS_ID")
    if not sheet_id:
        raise RuntimeError("Missing GOOGLE_SHEETS_ID")

    client = _get_client()
    spreadsheet = client.open_by_key(sheet_id)
    return spreadsheet.worksheet(sheet_name)


def fetch_rows(sheet_name: str) -> List[Dict[str, str]]:
    worksheet = _get_sheet(sheet_name)
    rows = worksheet.get_all_records()
    return rows


def append_row(sheet_name: str, payload: Dict[str, str]) -> None:
  worksheet = _get_sheet(sheet_name)
  header = worksheet.row_values(1)
  if not header:
    header = list(payload.keys())
    worksheet.append_row(header)
  row = [payload.get(key, "") for key in header]
  worksheet.append_row(row)


def update_row_by_id(
    sheet_name: str,
    record_id: str,
    payload: Dict[str, str],
    id_fields: Sequence[str],
) -> bool:
    worksheet = _get_sheet(sheet_name)
    header = worksheet.row_values(1)
    if not header:
        return False

    id_column = None
    for field in id_fields:
        if field in header:
            id_column = header.index(field) + 1
            break
    if not id_column:
        return False

    column_values = worksheet.col_values(id_column)
    row_index = None
    for index, value in enumerate(column_values[1:], start=2):
        if str(value).strip() == str(record_id).strip():
            row_index = index
            break
    if not row_index:
        return False

    row_values = [payload.get(key, "") for key in header]
    start_cell = rowcol_to_a1(row_index, 1)
    end_cell = rowcol_to_a1(row_index, len(header))
    worksheet.update(f"{start_cell}:{end_cell}", [row_values])
    return True
