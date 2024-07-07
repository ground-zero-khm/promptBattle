
from flask import Flask,jsonify, send_from_directory, abort
import time
import threading

from generation import AIWrapper

wrapper = AIWrapper(model_name="stabilityai/stable-diffusion-xl-base-1.0")
app = Flask(__name__)

queue_lock = threading.Lock()

def prompting(input_text):
    timestamp = int(time.time())
    image_path = f'static/images/{timestamp}.png'
    wrapper.txt2img(input_text, num_inference_steps=15, guidance_scale=9).save(image_path)
    return image_path

@app.route('/prompt/<input_text>', methods=['GET'])
def getText(input_text):
    input_text = input_text.replace("%20"," ")
    with queue_lock:
        time.sleep(1)
        output = prompting(input_text)
    return jsonify({"url": output})

if __name__ == "__main__":
    app.run(host='172.18.2.131', port=5000, debug=True)
