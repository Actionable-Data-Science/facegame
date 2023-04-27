# syntax=docker/dockerfile:1

from python:3.7.16-bullseye as base
WORKDIR /app
COPY requirements.txt .
RUN apt-get update
RUN apt-get install cmake -y
RUN apt-get install ffmpeg libsm6 libxext6  -y

from base as python

RUN python3 -m venv env
RUN . env/bin/activate
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

from python as final

COPY . .

CMD ["gunicorn", "-w", "4", "wsgi:application", "--bind", "0.0.0.0:8000"]