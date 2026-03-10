from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# Route for the portfolio main page
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle contact form submission
@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        # Here you could save to a database or send an email
        # For now, we'll just log it and return success
        print(f"New Contact Message: {name} ({email}): {message}")
        
        # Optionally save to a file
        with open('messages.txt', 'a') as f:
            f.write(f"Name: {name}, Email: {email}, Message: {message}\n---\n")

        return jsonify({"status": "success", "message": "Thank you for reaching out, Swetha will get back to you soon!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
