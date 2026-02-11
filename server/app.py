import logging
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from google_sheets import append_row, fetch_rows, update_row_by_id


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))


def create_app() -> Flask:
    app = Flask(__name__)
    logging.basicConfig(level=logging.INFO)
    allowed_origins = {
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    }
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:8000",
                    "http://127.0.0.1:8000",
                ]
            }
        },
    )

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        app.logger.info(
            "CORS check path=%s origin=%s method=%s status=%s",
            request.path,
            origin,
            request.method,
            response.status_code,
        )
        if origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,OPTIONS"
            requested_headers = request.headers.get("Access-Control-Request-Headers")
            if requested_headers:
                response.headers["Access-Control-Allow-Headers"] = requested_headers
            else:
                response.headers["Access-Control-Allow-Headers"] = (
                    "Content-Type, Cache-Control, Pragma, Authorization"
                )
        return response

    clients_tab = os.getenv("GOOGLE_SHEETS_CLIENTS_TAB", "clients")
    staff_tab = os.getenv("GOOGLE_SHEETS_STAFF_TAB", "staff")
    transplants_tab = os.getenv("GOOGLE_SHEETS_TRANSPLANTS_TAB", "transplants")
    finance_tab = os.getenv("GOOGLE_SHEETS_FINANCE_TAB", "finance")
    inventory_tab = os.getenv("GOOGLE_SHEETS_INVENTORY_TAB", "inventory")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.get("/api/clients")
    def get_clients():
        return jsonify(fetch_rows(clients_tab))

    @app.post("/api/clients")
    def create_client():
        payload = request.get_json(silent=True) or {}
        append_row(clients_tab, payload)
        return jsonify({"status": "created"}), 201

    @app.put("/api/clients/<client_id>")
    def update_client(client_id: str):
        payload = request.get_json(silent=True) or {}
        updated = update_row_by_id(
            clients_tab,
            client_id,
            payload,
            ["id", "מספר לקוח", "מס' לקוח"],
        )
        if updated:
            return jsonify({"status": "updated"}), 200
        append_row(clients_tab, payload)
        return jsonify({"status": "created"}), 201

    @app.get("/api/staff")
    def get_staff():
        return jsonify(fetch_rows(staff_tab))

    @app.post("/api/staff")
    def create_staff():
        payload = request.get_json(silent=True) or {}
        append_row(staff_tab, payload)
        return jsonify({"status": "created"}), 201

    @app.put("/api/staff/<staff_id>")
    def update_staff(staff_id: str):
        payload = request.get_json(silent=True) or {}
        updated = update_row_by_id(
            staff_tab,
            staff_id,
            payload,
            ["id", "מספר עובד", "מס' עובד"],
        )
        if updated:
            return jsonify({"status": "updated"}), 200
        append_row(staff_tab, payload)
        return jsonify({"status": "created"}), 201

    @app.get("/api/transplants")
    def get_transplants():
        return jsonify(fetch_rows(transplants_tab))

    @app.post("/api/transplants")
    def create_transplant():
        payload = request.get_json(silent=True) or {}
        append_row(transplants_tab, payload)
        return jsonify({"status": "created"}), 201

    @app.put("/api/transplants/<transplant_id>")
    def update_transplant(transplant_id: str):
        payload = request.get_json(silent=True) or {}
        updated = update_row_by_id(
            transplants_tab,
            transplant_id,
            payload,
            ["id", "מספר השתלה", "מס' השתלה"],
        )
        if updated:
            return jsonify({"status": "updated"}), 200
        append_row(transplants_tab, payload)
        return jsonify({"status": "created"}), 201

    @app.get("/api/finance")
    def get_finance():
        return jsonify(fetch_rows(finance_tab))

    @app.post("/api/finance")
    def create_finance():
        payload = request.get_json(silent=True) or {}
        append_row(finance_tab, payload)
        return jsonify({"status": "created"}), 201

    @app.get("/api/inventory")
    def get_inventory():
        return jsonify(fetch_rows(inventory_tab))

    @app.post("/api/inventory")
    def create_inventory():
        payload = request.get_json(silent=True) or {}
        append_row(inventory_tab, payload)
        return jsonify({"status": "created"}), 201

    @app.put("/api/inventory/<item_id>")
    def update_inventory(item_id: str):
        payload = request.get_json(silent=True) or {}
        updated = update_row_by_id(
            inventory_tab,
            item_id,
            payload,
            ["id", "מספר פריט", "מס' פריט"],
        )
        if updated:
            return jsonify({"status": "updated"}), 200
        append_row(inventory_tab, payload)
        return jsonify({"status": "created"}), 201

    return app


if __name__ == "__main__":
    create_app().run(port=5001, debug=True)
