import os
import requests

from datetime import date
from flask import Flask, render_template, jsonify, request
from flask_caching import Cache
from flask_cors import CORS

app = Flask(__name__,
            static_folder="../dist/assets",
            template_folder="../dist")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

CACHE_CONFIG = {"CACHE_TYPE": "filesystem", "CACHE_DIR": "/tmp"}
cache = Cache(app, config=CACHE_CONFIG)

NOTION_API = "https://api.notion.com/v1/databases/"
NOTION_BASE = os.getenv("NOTION_BASE")
API_KEY = os.getenv("NOTION_API_KEY")
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}
CACHE_TIMEOUT = 1 if app.config['DEBUG'] else os.getenv('CACHE_TIMEOUT', 600)


@app.route("/api/inventaire")
@cache.cached(timeout=CACHE_TIMEOUT)
def inventaire():
    url = f"{NOTION_API}{NOTION_BASE}/query"
    payload = {
        "page_size": 100,
        "filter": {
            "property": "PUBLIC",
            "checkbox": {
                "equals": True
            }
        },
    }
    start_cursor = request.args.get("start_cursor")
    if start_cursor:
        payload["start_cursor"] = start_cursor
    r = requests.post(url, json=payload, headers=HEADERS)
    r.raise_for_status()
    return jsonify(r.json())


@app.route("/", defaults={"path": ""})
# allows routing in vuejs
@app.route("/<path:path>")
def index(path):
    return render_template("index.html")
