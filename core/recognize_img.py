import requests
from PIL import Image
from StringIO import StringIO

r = requests.get('https://example.com/image.jpg')
i = Image.open(StringIO(r.content))





