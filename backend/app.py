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

AIRTABLE_API = "https://api.airtable.com/v0/"
AIRTABLE_BASE = "appISQqfvRPMg6CH3/Suivi"
API_KEY = os.getenv("AIRTABLE_API_KEY")
HEADERS = {"Authorization": f"Bearer {API_KEY}"}
CACHE_TIMEOUT = 1 if app.config['DEBUG'] else os.getenv('CACHE_TIMEOUT', 600)


@app.route("/api/inventaire")
@cache.cached(timeout=CACHE_TIMEOUT)
def inventaire():
    url = f"{AIRTABLE_API}{AIRTABLE_BASE}"
    r = requests.get(url, headers=HEADERS)
    return jsonify(r.json())


@app.route("/api/demande", methods=["POST"])
def demande():
    # mapping {<form_name>: <airtables_name>}
    fields = {
        "description": "Données recherchées",
        "title": "Titre du jeu de données",
        "organisation": "Organisation",
        "geo": "Echelle géographique souhaitée",
        "update": "Fréquence de mise à jour souhaitée",
        "reuse": "Réutilisation envisagée",
        "contact": "Contact",
    }
    url = f"{AIRTABLES_URL}/Demandes%20d'ouverture"
    fields_dict = {fields[fkey]: request.json.get(fkey) for fkey in fields.keys()}
    fields_dict["Date"] = date.today().isoformat()
    r = requests.post(url, json={
        "fields": fields_dict
    }, headers=HEADERS)
    r.raise_for_status()
    return "", 201


@app.route("/", defaults={"path": ""})
# allows routing in vuejs
@app.route("/<path:path>")
def index(path):
    return render_template("index.html")
