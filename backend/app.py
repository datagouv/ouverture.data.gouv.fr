import os
from typing import List
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
NOTION_BASE_MINISTERIAL_COMMITMENTS = os.getenv("NOTION_BASE_MINISTERIAL_COMMITMENTS")
NOTION_BASE_HVD = os.getenv("NOTION_BASE_HVD")
API_KEY = os.getenv("NOTION_API_KEY")
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}
CACHE_TIMEOUT = 1 if app.config['DEBUG'] else os.getenv('CACHE_TIMEOUT', 600)

def get_value(property):
    if property['type'] == 'title':
        return property['title'][0]['plain_text'].strip()
    if property['type'] == 'rich_text':
        return property['rich_text'][0]['plain_text'].strip()
    elif property['type'] == 'url':
        return property['url'].strip() if property['url'] is not None else None
    elif property['type'] == 'select':
        return property['select']['name'].strip()
    else:
        raise RuntimeError(f"Unknown property type {property['type']}")
    
def fetch_database(id: str, properties: List[str]) -> List[dict]:
    url = f"{NOTION_API}{id}/query"
    r = requests.post(url, json={ "page_size": 100 }, headers=HEADERS)
    r.raise_for_status()
    response = r.json()
    lines = []
    for result in response["results"]:
        lines.append({
            property: get_value(result["properties"][property]) for property in properties
        })
    return jsonify(lines)

@app.route("/api/ministerial_commitments")
@cache.cached(timeout=CACHE_TIMEOUT, query_string=True)
def ministerial_commitments():
    return fetch_database(NOTION_BASE_MINISTERIAL_COMMITMENTS, ["TITRE", "STATUT", "URL", "PRODUCTEUR", "DATE ESTIMÉE"])

@app.route("/api/high_value_datasets")
@cache.cached(timeout=CACHE_TIMEOUT, query_string=True)
def high_value_datasets():
    return fetch_database(NOTION_BASE_HVD, ["TITRE", "STATUT", "URL", "PRODUCTEUR", "ENSEMBLE DE DONNÉES", "MINISTÈRE DE TUTELLE", "THÉMATIQUE"])


@app.route("/", defaults={"path": "index"})
# allows routing in vuejs
@app.route("/<path:path>")
def index(path):
    try:
        return render_template(path + '.html')
    except:
        return render_template('index.html')
