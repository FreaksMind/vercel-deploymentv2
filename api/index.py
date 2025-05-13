from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route("/api/post_question", methods=["POST"])
def healthchecker():
    return jsonify({"status": "success", "message": "Integrate Flask Framework with Next.js"})

if __name__ == "__main__":
    app.run()
