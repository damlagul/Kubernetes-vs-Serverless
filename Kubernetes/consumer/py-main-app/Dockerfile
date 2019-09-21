FROM python:alpine
EXPOSE 8080 80
CMD ["python", "main.py"]
WORKDIR /app
COPY requirements.txt /app
RUN cd /app && pip install -r requirements.txt && python -m pip install pika --upgrade
COPY main.py /app