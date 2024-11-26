FROM python:3.11

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

ENV NAME CloverpatchOrderAPI
ENV EUREKA_HOST CloverpatchEureka
ENV BASKETDTB_HOST CloverpatchBasketDatabase
ENV PRODUCTDTB_HOST CloverpatchProductDatabase:27017

CMD ["python", "main.py"]