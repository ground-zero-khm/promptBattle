from diffusers import AutoPipelineForText2Image
import torch

class AIWrapper:
    def __init__(self, model_name="stabilityai/sdxl-turbo", torch_dtype=torch.float16, device="cuda"):
        self.pipe = AutoPipelineForText2Image.from_pretrained(model_name, torch_dtype=torch_dtype, variant="fp16", requires_safety_checker=False)
        self.pipe.to(device)
    
    def txt2img(self, prompt, num_inference_steps=1, guidance_scale=0.0):
        image = self.pipe(prompt=prompt, num_inference_steps=num_inference_steps, guidance_scale=guidance_scale).images[0]
        return image

