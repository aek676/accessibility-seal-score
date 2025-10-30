import cv2
import numpy as np

# --- Ajusta este valor ---
# Define qué tan "oscuro" puede ser el blanco para seguir siendo considerado parte del sello.
# Un valor más bajo (ej. 180) incluirá más tonos de gris claro.
# Un valor más alto (ej. 240) solo incluirá blancos muy brillantes.
# Empieza con 200 y ajústalo si es necesario.
UMBRAL_BLANCO = 200
# -------------------------

# Define los rangos de color para el blanco en BGR
# Límite inferior (B, G, R)
lower_white = np.array([UMBRAL_BLANCO, UMBRAL_BLANCO, UMBRAL_BLANCO], dtype=np.uint8)
# Límite superior (siempre blanco puro)
upper_white = np.array([255, 255, 255], dtype=np.uint8)

# 1. Cargar la imagen
# Asegúrate de que el nombre del archivo sea correcto
try:
    img = cv2.imread('./Sellos/SealWhite.png') # Reemplaza con el nombre de tu imagen
    if img is None:
        raise FileNotFoundError("No se pudo cargar la imagen. Revisa el nombre y la ruta.")
except FileNotFoundError as e:
    print(e)
    exit()

# 2. Crear la máscara
# La máscara será blanca (255) donde la imagen esté dentro del rango (el sello)
# y negra (0) donde esté fuera del rango (el fondo).
mask = cv2.inRange(img, lower_white, upper_white)

# 3. Crear la imagen final con fondo transparente (BGRA)
# Convertimos la imagen original a BGRA (con canal Alfa)
result_bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

# 4. Aplicar la máscara al canal Alfa
# El canal Alfa es el cuarto canal (índice 3)
# Donde la máscara es 0 (fondo), el alfa será 0 (transparente).
# Donde la máscara es 255 (sello), el alfa será 255 (opaco).
result_bgra[:, :, 3] = mask

# 5. Guardar la imagen resultante
# DEBE guardarse en formato .png para conservar la transparencia
output_filename = 'sello_sin_fondo.png'
cv2.imwrite(output_filename, result_bgra)

print(f"¡Éxito! Imagen guardada como: {output_filename}")

# 6. Mostrar los resultados (opcional)
cv2.imshow('Original', img)
cv2.imshow('Mascara (Tu sello)', mask)
cv2.imshow('Resultado (Fondo transparente)', result_bgra)

print("Presiona cualquier tecla para cerrar las ventanas.")
cv2.waitKey(0)
cv2.destroyAllWindows()