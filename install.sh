#!/bin/sh

echo "Make sure that python-devel is installed"

python3 -m venv .env

source .env/bin/activate

pip3 install wheel os-sys # build deps

pip3 install opencv-python urllib3 matplotlib pylab-sdk numpy dlib joblib scipy scikit-image scikit-learn==0.24.1 flask

echo "Make sure that virtual environment is activated. If not active, run:"
echo "$ source .env/bin/activate"