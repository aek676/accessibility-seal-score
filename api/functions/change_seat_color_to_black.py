def change_seat_color_to_black(image):
    try:
        result = image.copy()
        if result.mode != 'RGBA':
            result = result.convert('RGBA')

        pixels = result.load()

        ancho, alto = result.size

        for x in range(ancho):
            for y in range(alto):
                r, g, b, a = pixels[x, y]
                umbral = 255 

                if r == umbral and g == umbral and b == umbral and a != 0:
                    pixels[x, y] = (0, 0, 0, 255)

        return result

    except Exception as e:
        print(f"Ocurrió un error: {e}")
        return None
