FROM python:3.9.13
WORKDIR /mt4
COPY . /mt4

RUN apt-get update && apt-get install -y libzmq3-dev
RUN pip install --upgrade pip
RUN pip install pyzmq
RUN pip install mysql-connector-python
RUN pip install numpy 
RUN pip install requests
RUN pip install tensorflow==2.15
RUN pip install pandas

CMD ["python", "model.py"]
