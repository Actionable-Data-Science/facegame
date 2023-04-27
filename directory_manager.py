from dotenv import load_dotenv
import os

load_dotenv("facegame_data/.env")

FACES_FOLDER_PATH = os.environ["FACES_FOLDER_PATH"]
GAMEPLAY_IMAGE_FOLDER_PATH = os.environ["GAMEPLAY_IMAGE_FOLDER_PATH"]

required_dirs = [FACES_FOLDER_PATH, GAMEPLAY_IMAGE_FOLDER_PATH]

def prepare_dirs():
    print(required_dirs)
    for d in required_dirs:
        if not os.path.exists(d):
            os.makedirs(d)
