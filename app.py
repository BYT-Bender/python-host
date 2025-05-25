from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enables CORS for all domains

@app.route("/api/proxy")
def proxy():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    query_type = request.args.get("type", "groupsearch")
    query = request.args.get("query", "kurkure")

    if not lat or not lon:
        return jsonify({"error": "Latitude and Longitude are required"}), 400

    url = "https://qp94doiea4.execute-api.ap-south-1.amazonaws.com/default/qc"
    params = {
        "lat": lat,
        "lon": lon,
        "type": query_type,
        "query": query
    }

    headers = {
        "accept": "*/*",
        "origin": "https://quickcompare.in",
        "referer": "https://quickcompare.in/",
        "user-agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
