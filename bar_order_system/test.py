import MySQLdb

try:
    conn = MySQLdb.connect(
        host='localhost',
        user='root',
        password='123456',
        db='bar_order_system'
    )
    print("连接成功!")
    conn.close()
except Exception as e:
    print("连接失败:", e) 