FROM python:3.11

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

ENV NAME CloverpatchBasketAPI
ENV EUREKA_HOST CloverpatchEureka

CMD ["python", "app.py"]