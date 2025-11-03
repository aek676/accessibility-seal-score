import io
import base64
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from functions.change_score import change_score

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return "Bievenido a la API de generación de sellos de accesibilidad."

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/imagen-score/{score}")
async def get_score_image_api(score: float):
    try:
        images = change_score(score)
        
        white_buffer = io.BytesIO()
        images["white_seal"].save(white_buffer, format="PNG")
        white_buffer.seek(0)
        white_base64 = base64.b64encode(white_buffer.getvalue()).decode('utf-8')
        
        black_buffer = io.BytesIO()
        images["black_seal"].save(black_buffer, format="PNG")
        black_buffer.seek(0)
        black_base64 = base64.b64encode(black_buffer.getvalue()).decode('utf-8')
        
        return JSONResponse(
            status_code=200,
            content={
                "white_seal": f"data:image/png;base64,{white_base64}",
                "black_seal": f"data:image/png;base64,{black_base64}"
            }
        )

    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})