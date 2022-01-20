echo "Make sure that python-devel is installed"

source .env/bin/activate

pip install wheel os-sys

pip install opencv-python urllib3 matplotlib pylab-sdk numpy dlib joblib scipy scikit-image scikit-learn==0.24.1


