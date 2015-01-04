from flask import Flask
from flask import render_template

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route("/bidAsk")
def bidAsk():
	return render_template("bidAsk.html")


if __name__ == "__main__":
	app.run()

