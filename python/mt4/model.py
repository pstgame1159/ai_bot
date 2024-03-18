import numpy as np
import json
from tensorflow.keras.models import load_model
import zmq
import mysql.connector

servername = "db"
username = "root"
password = "MYSQL_ROOT_PASSWORD"
dbname = "robot_trade"


loaded_model = load_model('lstm_model.h5')



context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5555")

def predict_next_close(model, past_close_prices):
    # ทำนายค่า Close ของวันถัดไป
    next_close = model.predict(np.array([past_close_prices]))[0][0]
    return next_close

def predict_close(data):
    closePrice1 = float(data.get('closePrice1'))
    closePrice2 = float(data.get('closePrice2'))
    closePrice3 = float(data.get('closePrice3'))
    model = str(data.get('model'))

    
    next_close_prediction = predict_next_close(loaded_model, [closePrice1, closePrice2, closePrice3])
    next_close_prediction = float(next_close_prediction)
    print(next_close_prediction)
    response = json.dumps( next_close_prediction)
    socket.send_string(response)
    
        
def insert_profits(data):
    
    conn = mysql.connector.connect(
        host=servername,
        user=username,
        password=password,
        database=dbname
    )

    if not conn.is_connected():
        print("Connection failed")

    balance = float(data.get('balance'))
    equity = float(data.get('equity'))
    currentDate = str(data.get('currentDate'))
    portnumber = str(data.get('portnumber'))

    response = json.dumps(balance)
    socket.send_string(response)

    cur = conn.cursor()
    insert_sql = "INSERT INTO profits (port_number, date_transaction, balance, equity) VALUES (%s, %s, %s, %s)"
    date_transaction = currentDate
    data = (portnumber, date_transaction, balance, equity)
    cur.execute(insert_sql, data)
    conn.commit()

    update_sql = "UPDATE ports SET balance = %s, equity = %s WHERE port_number = %s"
    update_data = (balance,equity, portnumber) 
    cur.execute(update_sql, update_data)

    conn.commit()
    cur.close()
    conn.close()

def allow_port(data):
    
    conn = mysql.connector.connect(
        host=servername,
        user=username,
        password=password,
        database=dbname
    )



    if not conn.is_connected():
        print("Connection failed")

    port_number = str(data.get('allow_port'))
    cur = conn.cursor()

    select_sql = "SELECT (SELECT equity FROM profits WHERE port_number = %s ORDER BY date_transaction DESC LIMIT 1) AS latest_equity, (SELECT equity FROM profits WHERE port_number = %s AND status = 0 ORDER BY date_transaction ASC LIMIT 1) AS earliest_equity;"
    data = (port_number, port_number)

    cur.execute(select_sql, data)

    result = cur.fetchall()
    if result and result[0][0] is not None and result[0][1] is not None:
        latest_balance = float(result[0][0])
        start_balance = float(result[0][1])
        ten_percent = 0.1 * (latest_balance - start_balance)
        if (latest_balance - start_balance) > 100:
            insert_sql = "INSERT INTO pay_commission (port_number, commission_pay) VALUES (%s, %s)" 
            data = (port_number, ten_percent) 
            cur.execute(insert_sql, data) 
            conn.commit()
            update_sql = "UPDATE ports SET status_port = %s WHERE port_number = %s"
            update_data = (1,port_number) 
            cur.execute(update_sql, update_data)
            conn.commit()





    select_sql = "SELECT * FROM `ports` WHERE port_number = %s ;"
    data = (port_number,)
    cur.execute(select_sql, data)
    result = cur.fetchall()

    if result:  # ถ้ามีข้อมูลที่พบ
        response = json.dumps(result[0][5])  # แสดงค่าสถานะบอท
    else:  # ถ้าไม่พบข้อมูล
        response = json.dumps(1)  # กำหนดค่าเป็น หากไม่เจอค่า
        
    socket.send_string(response)
    cur.close()
    conn.close()
    


def server():
    print("Server started...")
    while True:
        message = socket.recv_string()
        data = json.loads(message)
        if 'allow_port' in data:
            allow_port(data)
        elif 'portnumber' in data:
            insert_profits(data)
        elif 'model' in data:
            predict_close(data)


      

if __name__ == "__main__":
    server()
