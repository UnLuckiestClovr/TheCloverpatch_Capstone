FROM python:3.11

# Install system dependencies for pyodbc
RUN apt-get update && apt-get install -y \
    unixodbc \
    unixodbc-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

ENV NAME CloverpatchCafeAPI
ENV EUREKA_HOST CloverpatchEureka

CMD ["python", "main.py"]