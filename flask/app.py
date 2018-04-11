import flask
from flask import Flask
from flask import request, render_template, jsonify

TEMPLATES_AUTO_RELOAD = True
app = Flask(__name__)
app.jinja_env.auto_reload = True

from pynlpl.clients.frogclient import FrogClient
frogclient = FrogClient('nlp', 12345)
frogclient.returnall = True

def translate(text):
    return frogclient.process(text)

@app.route("/", methods=['GET', 'POST'])
def hello():
    if request.method == 'POST':
        text = request.json['text']
        return jsonify(translate(text))
    else:
        return 'hello\n'