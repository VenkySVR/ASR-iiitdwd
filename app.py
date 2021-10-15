import os
from flask import Flask,flash,render_template,jsonify,redirect,request , url_for

UPLOAD_FOLDER = 'uploads/audios/'
ALLOWED_EXTENSIONS = {'wav'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def predict(file):
    return file.filename

@app.route("/", methods=["GET","POST"])
def index():
    output = ""
    if request.method == "POST":
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        file.filename = request.form['fname']
        if file :
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], "temp22.wav"))
            output = predict(file)
    return render_template('index.html', predicted=output )

if __name__=='__main__':
    app.run(debug=True,port=8080)