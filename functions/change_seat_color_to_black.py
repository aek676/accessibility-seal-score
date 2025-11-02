def change_seat_color_to_black(image):
    try:
        if image.mode != 'RGBA':
            image = image.convert('RGBA')

        pixels = image.load()

        ancho, alto = image.size

        for x in range(ancho):
            for y in range(alto):
                r, g, b, a = pixels[x, y]
                umbral = 255 

                if r == umbral and g == umbral and b == umbral and a != 0:
                    pixels[x, y] = (0, 0, 0, 255)

        return image

    except Exception as e:
        print(f"Ocurrió un error: {e}")
        return None
