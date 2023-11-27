To run project u need follow this steps (I dont have any reviews about instruction so it can be not correct)
1. Have installed next.js
2. Create in /web-project/.env.local by example :

user='username'
host='host'
database='database'
password='password'
port=port(number) 
JWT='secretkey'

3.Have installed Docker Desktop (to run in docker container by /web-project/)
4. Run in /web-project/ : docker compose up (in my docker i need to stop and run this command again to see normaly changes)
5.Install flask server in some folder that will be runned (flask --app app run -p 8001)
6.Have app.py in flaskProject with following code:

--------------------------------------------------------------------------------------------




from flask import Flask, request, jsonify
from queue import Queue
import psycopg2
import numpy as np
import base64
from io import BytesIO
import time
import threading
from threading import Thread, Lock

app = Flask(__name__)
task_queue = Queue()
db_lock = Lock()
thread = None
lock = threading.Lock()
task_counter = 0
# Налаштуйте з'єднання з базою даних
conn = psycopg2.connect(
    dbname="database",
    user="username",
    password="password",
    host="host",
    port="port(number)"
)

def worker():
    while True:
        # Отримати завдання з черги
        result = task_queue.get()

        # Виконати завдання
        try:
            long_task(result)
        finally:
            # Позначити завдання як завершене
            task_queue.task_done()
thread = Thread(target=worker)
thread.daemon = True
thread.start()

def matrix_multiplication(A, B, matrix_id):
    try:
        cur = conn.cursor()

        rows_A = len(A)
        cols_A = len(A[0])
        rows_B = len(B)
        cols_B = len(B[0])

        if cols_A != rows_B:
            raise Exception("Кількість стовпців матриці A не дорівнює кількості рядків матриці B")
        # винести помилку і повернути якщо є
        result = np.zeros((rows_A, cols_B))

        for i in range(rows_A):
            for j in range(cols_B):
                for k in range(cols_A):
                    result[i][j] += int(A[i][k] * B[k][j])

            # обчислюємо прогрес після кожного проходження зовнішнього циклу
            progress = int((i + 1) / rows_A * 100)
            cur.execute("UPDATE matrix_operationsv2 SET progress = %s WHERE id = %s", (progress, matrix_id))
            if cur.rowcount == 0:
                # Якщо немає рядків, що були оновлені, можливо запис було видалено
                raise ValueError("Запис було видалено з бази даних, завдання скасовано")
            conn.commit()
            print(f"Прогрес: {progress:.2f}%")
        progress = 100 # якщо порахує тільки до ~99.9 , заокруглить навсяк випадок
        cur.execute("UPDATE matrix_operationsv2 SET progress = %s WHERE id = %s", (progress, matrix_id))
        if cur.rowcount == 0:
            # Якщо немає рядків, що були оновлені, можливо запис було видалено
            raise ValueError("Запис було видалено з бази даних, завдання скасовано")
        conn.commit()
        cur.close()
        return result
    except Exception as e:
        print(f"Помилка при оновленні progress: {e}")
        cur.close()
        return None

def save_to_db(task_id,result_matrix):
    buffer = BytesIO()
    np.save(buffer,result_matrix)
    byte_data = buffer.getvalue()
    encoded_data = base64.b64encode(byte_data)
    try:
        cur = conn.cursor()
        cur.execute("UPDATE matrix_operationsv2 SET result = %s WHERE id = %s", (encoded_data, task_id))
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"Помилка при оновленні result2: {e}")
def long_task(result):
    # Тут ви можете працювати з отриманими даними. Наприклад:
    task_id, user_id, n, m, matrix1, matrix2, result2, progress, start_time = result

    if isinstance(matrix1, memoryview):
        matrix_bytes1 = matrix1.tobytes()
    else:
        matrix_bytes1 = matrix1
    decoded_data = base64.b64decode(matrix_bytes1)
    buffer = BytesIO(decoded_data)
    restored_matrix1 = np.load(buffer, allow_pickle=True)
    matrix_string1 = np.array2string(restored_matrix1)

    if isinstance(matrix2, memoryview):
        matrix_bytes2 = matrix2.tobytes()
    else:
        matrix_bytes2 = matrix2
    decoded_data = base64.b64decode(matrix_bytes2)
    buffer = BytesIO(decoded_data)
    restored_matrix2 = np.load(buffer, allow_pickle=True)
    matrix_string2 = np.array2string(restored_matrix2)

    result_matrix = matrix_multiplication(restored_matrix1, restored_matrix2, task_id)
    if result_matrix is None:
        # Якщо результат None, завдання було перервано
        return
    else:
        matrix_result_string = np.array2string(result_matrix)
        save_to_db(task_id, result_matrix)


@app.route('/', methods=['POST'])
def receive_matrix_id():
    data = request.json
    matrix_id = data.get('matrixId')

    with db_lock:
        # Запит до бази даних для отримання даних за ID
        cur = conn.cursor()
        cur.execute("SELECT * FROM matrix_operationsv2 WHERE id = %s", (matrix_id,))
        result = cur.fetchone()
        cur.close()
        if not result:
            return jsonify({"error": "No data found for given ID"}), 404
    global task_counter
    with db_lock:
        task_counter += 1  # Збільшуємо лічильник завдань
        position_in_queue = task_queue.qsize() + 1  # Позиція в черзі
        task_queue.put(result)  # Додаємо лічильник завдань до черги

    return jsonify({"message": "Task received", "positionInQueue": position_in_queue}), 200


if __name__ == '__main__':
    app.run(debug=True)



--------------------------------------------------------------------------------------------
That's it ) (probably)

